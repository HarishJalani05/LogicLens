const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeCodeWithAI = async (code, baseArray) => {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("⚠️ GEMINI_API_KEY is missing. Returning default analysis payload.");
        return {
            algorithm: "Custom Runtime",
            language: "Unknown",
            code_summary: "Custom code snippet execution",
            has_syntax_errors: false,
            error_details: "",
            corrected_code: code || "",
            complexity: { time: { best: "O(?)", average: "O(?)", worst: "O(?)" }, space: "O(?)" },
            optimization_suggestion: "Please configure your GEMINI_API_KEY in the server/.env file to receive advanced AI optimization suggestions.",
            explanation: "Code execution tracking (AI breakdown disabled without API key).",
            interview_steps: ["⚠️ Gemini API Key not found. Add it to server/.env to enable AI conceptual breakdowns."],
            steps: [{ array: baseArray || [30, 10, 45, 20, 15], highlight: [], action: "none", explanation: "API offline." }]
        };
    }

    // 1. Initialize the model with the strict JSON requirement
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "application/json", // <-- THIS IS THE MAGIC LINE
        }
    });

    const prompt = `
    You are an expert Technical Interviewer and Computer Science Tutor. Analyze this code.
    1. Identify the core algorithm logic. Even if the code is just an incomplete snippet (e.g. missing variables or function wrappers), you MUST classify it if you recognize the pattern. Use EXACTLY one of these strings: "Bubble Sort", "Quick Sort", "Merge Sort", "Selection Sort", "Insertion Sort", "Linear Search", "Binary Search". If it is completely unrecognizable, output "Custom".
    2. Determine Time and Space Complexity.
    3. Identify the programming language used (e.g., C++, Java, Python, JavaScript).
    4. Generate a 3-4 step "Interview Breakdown" explaining the logic, time complexity reasoning, and space complexity reasoning to help a student prepare for a software engineering interview.
    5. Check the code for any syntax errors (like missing semicolons, unmatched brackets/parentheses, misspelled keywords, undeclared variables) or grammatical/structural mistakes. Set "has_syntax_errors" to true if any are found, otherwise false. If true, describe them briefly in "error_details", and provide the fully corrected code in "corrected_code". If false, set "error_details" to "" and "corrected_code" to the original code.
    6. Generate a "dry run" of the code tracing exactly how the input array changes step-by-step.
    7. Generate a "code_summary" field: a single short sentence (max 10 words) that describes what the code does. Examples: "Bubble Sort on an integer array", "Display Hello World", "Find maximum element in array", "Binary search for a target value".
    8. Generate an "optimization_suggestion" field: If the worst-case time complexity is O(n^2) or worse (like O(n^3), O(2^n)), provide a helpful 2-3 sentence suggestion explaining how the algorithm could be optimized to a lower complexity. Mention the specific alternative algorithm or technique and its complexity. If the code already has optimal or near-optimal complexity (O(n log n) or better), set this field to an empty string "".

    Input Array: [${(baseArray || []).join(", ")}]

    Return a valid JSON object matching this schema exactly:
    {
        "algorithm": "Descriptive Name Here",
        "language": "Programming Language",
        "code_summary": "One-line summary of what the code does",
        "has_syntax_errors": false,
        "error_details": "Brief description of the syntax errors found (e.g., 'Missing semicolon on line 4')",
        "corrected_code": "The fully corrected source code string",
        "complexity": { "time": { "best": "O(n)", "average": "O(n log n)", "worst": "O(n^2)" }, "space": "O(1)" },
        "optimization_suggestion": "Suggestion text if complexity is high, or empty string if already optimal.",
        "explanation": "A short 1-sentence explanation.",
        "interview_steps": [
            "🧠 **Core Logic:** Explain how the algorithm fundamentally works.",
            "⏱️ **Time Complexity:** Explain step-by-step mathematically why the time complexity for best, average, and worst cases are what they are.",
            "💾 **Space Complexity:** Explain step-by-step the memory and auxiliary space usage."
        ],
        "steps": [
            {
                "array": [ ... ], // The state of the array at this step of execution
                "highlight": [0, 1], // Indices being compared, swapped, or accessed (max 3, empty if none)
                "action": "compare", // "compare" or "swap" or "none"
                "explanation": "Comparing elements at index 0 and 1."
            }
        ]
    }

    Code to analyze:
    ${code}
    `;


    try {
        const result = await model.generateContent(prompt);
        // Because we set responseMimeType, we don't need messy regex anymore!
        const text = result.response.text();
        return JSON.parse(text);

    } catch (error) {
        // If it STILL fails, we will log the exact reason to your terminal
        console.error("🚨 CRITICAL AI ERROR:", error.message);
        return {
            algorithm: "Analysis Failed",
            language: "Unknown",
            code_summary: "Analysis failed due to API error",
            has_syntax_errors: false,
            error_details: "",
            corrected_code: code || "",
            complexity: { time: { best: "O(n)", average: "O(n)", worst: "O(n)" }, space: "O(1)" },
            optimization_suggestion: "Unable to calculate optimization suggestions without a working API connection.",
            explanation: `API Error: ${error.message.split(']')[1] || error.message}`,
            interview_steps: [`⚠️ Analysis failed. ${error.message}`],
            steps: [{ array: baseArray, highlight: [], action: "none", explanation: "Execution failed." }]
        };
    }
};

module.exports = { analyzeCodeWithAI };