const express = require("express");
const cors = require("cors");
// This points one level up to find analyzer.js
const { analyzeCodeWithAI } = require("../analyzer");

const app = express();
app.use(cors());
app.use(express.json());

// --- ANIMATION STEP GENERATORS ---
const generateBubbleSortSteps = (initialArray) => {
  let steps = [];
  let arr = [...initialArray];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      steps.push({
        array: [...arr],
        highlight: [j, j + 1],
        explanation: `Checking ${arr[j]} and ${arr[j + 1]}`,
      });
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          array: [...arr],
          highlight: [j, j + 1],
          explanation: `Swapping elements`,
        });
      }
    }
  }
  return steps;
};

const generateLinearSearchSteps = (initialArray, target) => {
  let steps = [];
  let arr = [...initialArray];
  for (let i = 0; i < arr.length; i++) {
    steps.push({
      array: [...arr],
      highlight: [i],
      explanation: `Checking if ${arr[i]} equals ${target}...`,
    });
    if (arr[i] === target) {
      steps.push({
        array: [...arr],
        highlight: [i],
        explanation: `Target ${target} found at index ${i}!`,
      });
      break;
    }
  }
  return steps;
};

const generateBinarySearchSteps = (initialArray, target) => {
  let steps = [];
  let arr = [...initialArray].sort((a, b) => a - b);
  steps.push({
    array: [...arr],
    highlight: [],
    explanation: `First, the array must be sorted.`,
  });
  let left = 0,
    right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    steps.push({
      array: [...arr],
      highlight: [left, mid, right],
      explanation: `Checking middle element ${arr[mid]}...`,
    });
    if (arr[mid] === target) {
      steps.push({
        array: [...arr],
        highlight: [mid],
        explanation: `Target ${target} found at index ${mid}!`,
      });
      break;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return steps;
};

const generateConstantTimeSteps = (initialArray) => {
  return [
    {
      array: [...initialArray],
      highlight: [0],
      explanation: `Instantly accessing array[0] -> ${initialArray[0]}`,
    },
  ];
};

// --- API ROUTE ---
app.post("/api/analyze", async (req, res) => {
  const { code, array, algorithm } = req.body;
  const baseArray = array || [30, 10, 45, 20, 15];

  try {
    const analysis = await analyzeCodeWithAI(code);
    let steps = [];

    // Clean up the time complexity string to make matching easier (e.g., "O( n )" -> "O(n)")
    // Clean up the time complexity string
    const timeComp = analysis.complexity.time.replace(/\s/g, "");
    const targetAlgo = algorithm ? algorithm.toLowerCase() : analysis.algorithm.toLowerCase();

    // DYNAMIC TARGET: Automatically pick an element from the middle of the user's array to search for
    const searchTarget = baseArray[Math.floor(baseArray.length / 2)];

    // ROUTE BASED PRIMARILY ON TIME COMPLEXITY
    if (timeComp.includes("nlogn") || timeComp.includes("n log n") || targetAlgo.includes("merge")) {
      // We don't have a Merge Sort animator yet, so we borrow Bubble Sort's animation
      // but we KEEP the correct O(n log n) math label!
      steps = generateBubbleSortSteps(baseArray);
      analysis.complexity.time = "O(n log n)";
    } 
    else if (timeComp.includes("n²") || timeComp.includes("n^2") || targetAlgo.includes("bubble")) {
      steps = generateBubbleSortSteps(baseArray);
      analysis.complexity.time = "O(n²)";
    } 
    else if (timeComp.includes("log") || targetAlgo.includes("binary")) {
      steps = generateBinarySearchSteps(baseArray, searchTarget);
      analysis.complexity.time = "O(log n)";
    } 
    else if (timeComp.includes("n") || targetAlgo.includes("linear") || targetAlgo.includes("search")) {
      steps = generateLinearSearchSteps(baseArray, searchTarget);
      analysis.complexity.time = "O(n)";
    } 
    else {
      steps = generateConstantTimeSteps(baseArray);
      analysis.complexity.time = "O(1)";
    }

    // Capture the interview steps from the AI, defaulting to an empty array if missing
    const interviewSteps = analysis.interview_steps || [];

    // Send everything back to the frontend cleanly
    res.json({ ...analysis, steps, interview_steps: interviewSteps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

app.listen(5000, () =>
  console.log("🚀 LogicLens AI Server live at http://localhost:5000"),
);