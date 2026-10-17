# LogicLens Codebase Documentation & File Explanations

Welcome to the comprehensive code explanation document for **LogicLens - AI-Powered Code & DSA Visualization Engine**. This document provides a highly detailed walkthrough of each file in the workspace, explaining its purpose, code mechanisms, and integration within the overall system architecture.

---

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Root Directory Files](#1-root-directory-files)
3. [Server Workspace (`/server`)](#2-server-workspace-server)
4. [Server Source Workspace (`/server/src`)](#3-server-source-workspace-serversrc)
5. [Vercel API Wrapper (`/api`)](#4-vercel-api-wrapper-api)
6. [Client Prototype Workspace (`/client`)](#5-client-prototype-workspace-client)
7. [Data Logs and Configuration Files](#6-data-logs-and-configuration-files)

---

## System Architecture Overview
LogicLens is designed as a hybrid visualization platform consisting of a lightweight frontend and a server-side analytics runtime:
- **Frontend**: A collection of high-performance vanilla HTML5 pages styled by a premium custom-property CSS stylesheet. Canvases are rendered dynamically in real-time using absolute DOM positions and dynamic SVGs.
- **Backend**: An Express.js application designed to run locally or as a Vercel Serverless Function. It handles:
  1. **AI Synthesis**: Leverages the Google Gemini 2.5 Flash API to parse custom algorithm logic, determine time/space complexity, and output execution steps.
  2. **Sandboxed Local Execution**: Utilizes Node's native `vm` module combined with JavaScript `Proxy` objects to securely execute custom user-submitted JS code and record memory mutations automatically.
  3. **Offline Fallback Routing**: Determines if algorithms match standard sorting/searching categories and routes them to hardcoded step generators for guaranteed correctness.

---

## 1. Root Directory Files

### [analyzer.js](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/analyzer.js)
- **Role**: Root AI Helper Module (Legacy/Backup).
- **Functionality**:
  - Initializes the Google Generative AI SDK using `@google/generative-ai`.
  - Exports the asynchronous function `analyzeCodeWithAI(code, baseArray)`.
  - Formulates a highly structured prompt requesting Gemini 2.5 Flash to act as a step-by-step dry-run execution engine.
  - Sets the generation configuration `responseMimeType: "application/json"` to ensure the model outputs a parseable JSON object matching the defined schema (algorithm name, complexities, interview breakdown steps, and array trace frames).
  - Handles API failures gracefully by returning an error-safe payload structure.

### [cover.html](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/cover.html)
- **Role**: Application Welcome Portal.
- **Functionality**:
  - Acts as the initial entry point for the user.
  - Designed with glassmorphic cards (using inline styles and tokens from [logiclens.css](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/logiclens.css)) presenting a clean user decision path.
  - Integrates a global Light/Dark mode switcher that toggles the `.light` class on the `<body>` element.
  - Routes the user to the standard sorting and search visualizer ([index.html](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/index.html)) or the custom code visualizer ([custom.html](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/custom.html)).

### [index.html](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/index.html)
- **Role**: Standard DSA Learning Page & Sorting Visualizer.
- **Functionality**:
  - Serves as the primary sorting visualizer workspace.
  - **Setup Panel**: Standard controls for custom comma-separated arrays and preset sorting snippets (Bubble, Insertion, Selection, Quick).
  - **Visualizer Canvas**: Renders array states as vertical bar charts. Highlights active elements based on state markers:
    - `#22c55e` (Green) for fully sorted elements.
    - `#ef4444` (Red) for swapped elements.
    - `#eab308` (Yellow) for compared elements.
    - `#38bdf8` (Blue) for unsorted/normal elements.
  - **Execution Controller**: Integrates playback commands including timeline scrubbing via an `<input type="range">`, playback toggle (Play/Pause/Replay), forward/backward single stepping, speed tuning (Slow, Normal, Fast), and scroll-synchronized code line highlighting.
  - **Technical Scaling Section**: Hosts collapsible descriptions explaining complexities (O(1), O(log n), O(n), O(n log n), O(n²)) and details their mathematical calculation.

### [custom.html](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/custom.html)
- **Role**: Custom Algorithm Tracer Interface.
- **Functionality**:
  - Similar in layout and control logic to `index.html` but optimized specifically for user-pasted custom code.
  - Communicates directly with the server endpoint `/api/analyze` to obtain steps from either Gemini or the VM Sandbox.
  - Renders a feedback widget (`#feedbackPrompt`) asking: *"Is this visualization correct?"* which posts responses to `/api/feedback` to log and validate AI execution accuracy.

### [stack.html](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/stack.html)
- **Role**: Stack Data Structure Visualizer.
- **Functionality**:
  - Supports two operational structures:
    1. **Array Stack**: Represents a fixed capacity linear array where elements are pushed/popped from index `0` up to `Max Capacity`.
    2. **Linked-List Stack**: Renders nodes dynamically, showing the `Top` node linking to its parent via vertical arrows.
  - Offers custom operations panel: `Push`, `Pop`, `Peek`, `isEmpty`, `Size`, and `Clear`.
  - Features an operational script text area (`#stackCodeInput`) allowing batch command executions (e.g. `push(10)`, `pop()`, `peek()`) which are processed into sequential animated frames.
  - Logs commands inside a local scrolling operational ledger (`#opLog`).

### [queue.html](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/queue.html)
- **Role**: Queue Data Structure Visualizer.
- **Functionality**:
  - Visualizes LIFO queues in four distinct modes:
    1. **Simple Queue**: Linear queue where insertion occurs at the rear and removal at the front.
    2. **Circular Queue**: Mode wrapping array memory bounds where front/rear index calculations use modulo arithmetic (`(idx + 1) % Capacity`).
    3. **Double-Ended Queue (Deque)**: Allows insertion and removal from both Front and Rear.
    4. **Priority Queue**: Elements are inserted alongside a priority ranking; the canvas sorts them so the highest-priority element dequeues first.
  - Renders dynamic text labels for `Front` and `Rear` pointers above and below the active memory cells.
  - Supports script execution (`#queueCodeInput`) and records operations in a custom log ledger.

### [trees.html](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/trees.html)
- **Role**: BST and AVL Tree Visualizer.
- **Functionality**:
  - **Tree Structures**:
    1. **Binary Search Tree (BST)**: Direct binary node insertions and deletions based on key values.
    2. **AVL Tree**: Self-balancing tree that calculates height balance factors and triggers auto-balance animations (Left-Left, Left-Right, Right-Right, Right-Left rotations) with balanced markers.
  - **Traversals**: Offers animated step-by-step traversal flows (Inorder, Preorder, Postorder, and Level-Order) where nodes turn bright cyan (`#00e5ff`) as they are traversed.
  - **SVG Connectors**: Employs an absolute SVG layer (`#treeEdges`) rendering quadratic Bezier curves or lines connecting parent nodes to children.
  - Displays a details bar showing total node counts, active tree height, and balance state.

### [graphs.html](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/graphs.html)
- **Role**: Graph Data Structure Visualizer.
- **Functionality**:
  - Supports **Directed**, **Undirected**, and **Weighted** graphs.
  - Uses an interactive canvas where nodes can be added, positioned, and dragged by the mouse.
  - Connects nodes via SVG lines (`#graphEdges`). Weighted mode renders edge weights centered on the lines. Directed mode uses SVG markers to render directional arrowheads.
  - Animates Graph Traversal algorithms:
    - **Breadth-First Search (BFS)** using a queue.
    - **Depth-First Search (DFS)** using a recursion call stack.
  - Traversal animations shift nodes dynamically from blue (unvisited) to yellow (exploring) to green (visited).

### [strings.html](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/strings.html)
- **Role**: String Pattern Matching Visualizer.
- **Functionality**:
  - Visualizes string matching algorithms character-by-character:
    1. **Naive Pattern Search**: Checks all characters index-by-index in O(m * (n - m + 1)) time.
    2. **Knuth-Morris-Pratt (KMP)**: Visualizes the prefix table (LPS array) and demonstrates how the search index skips redundant checks.
    3. **Rabin-Karp**: Calculates and compares hash codes for matching windows before performing character validation.
  - Displays the base string and query pattern side-by-side as letters in adjacent memory cells, highlighting mismatches (yellow) and correct matches (green).

### [sentences.html](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/sentences.html)
- **Role**: NLP Sentence Visualizer.
- **Functionality**:
  - Tokenizes raw input sentences into space-delimited word tokens represented as linear array slots.
  - Visualizes three word-level procedures:
    1. **Linear Search**: Scanning index-by-index for a target word.
    2. **Reverse Sentence**: In-place sentence reversing using a two-pointer technique to swap words.
    3. **Palindrome Check**: Validates if the sentence structure reads identical forwards and backwards.

### [logiclens.css](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/logiclens.css)
- **Role**: Master Stylesheet.
- **Functionality**:
  - Implements the complete design system using CSS Custom Properties (variables) for backgrounds, borders, colors, text styles, and border-radii.
  - Features grid lines background animations (`body::before` and `body::after` radial gradients).
  - Styles specific UI controls, sidebar editors, primary visualizer canvases, media controls, timeline sliders, SVG overlays, tooltips, and the light theme overrides (`body.light`).

---

## 2. Server Workspace (`/server`)

### [server/analyzer.js](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/server/analyzer.js)
- **Role**: Server AI Module.
- **Functionality**:
  - Standard module interacting with the Google Generative AI APIs.
  - Configured with `gemini-2.5-flash` to extract structured analysis payloads.
  - Prompts Gemini to categorize incoming code into standard algorithms (`"Bubble Sort"`, `"Quick Sort"`, `"Merge Sort"`, `"Selection Sort"`, `"Insertion Sort"`, `"Linear Search"`, `"Binary Search"`) or output `"Custom"`.
  - Analyzes best, average, and worst-case complexities.
  - Provides a fallback payload structure when the `GEMINI_API_KEY` environment variable is not defined or the API goes offline.

### [server/.env](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/server/.env)
- **Role**: Environment Configuration.
- **Functionality**:
  - Contains private application secrets, specifically:
    ```env
    GEMINI_API_KEY=your_gemini_key_here
    ```

---

## 3. Server Source Workspace (`/server/src`)

### [server/src/index.js](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/server/src/index.js)
- **Role**: Main Express App and Local Execution Engine.
- **Functionality**:
  - Sets up Express, CORS, and json parsers, and hosts static workspace directories.
  - **Algorithm Step Generators**:
    - Programmatically traces steps for standard algorithms to guarantee absolute mathematical correctness (since LLMs can occasionally fail on granular execution traces).
    - Contains logic for `generateBubbleSortSteps`, `generateSelectionSortSteps`, `generateInsertionSortSteps`, `generateQuickSortSteps`, `generateLinearSearchSteps`, and `generateBinarySearchSteps`.
  - **VM Execution Sandbox**:
    - Implements `executeDynamicCode(code, initialArray)`.
    - Creates a JS `Proxy` wrapper (`trackerHandler`) around the input array.
    - Property reads (`get`) trigger custom animations logged as `"compare"`.
    - Property writes (`set`) perform updates and log animations as `"swap"`.
    - Runs custom javascript code securely using Node's native `vm.createContext` and `vm.runInContext` with a strict `1000ms` timeout to prevent infinite loops.
  - **API Routes**:
    - `/api/analyze` (POST): Accepts code and arrays, coordinates with `server/analyzer.js` for metadata/complexities, routes to standard programmatic step generators or the VM proxy sandbox, maps action flags to code line indices, and returns the final JSON response.
    - `/api/feedback` (POST): Appends validation feedback arrays to [feedback_log.json](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/feedback_log.json).

### [server/src/engine/rules.js](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/server/src/engine/rules.js)
- **Role**: Algorithm Rules (Placeholder).
- **Functionality**:
  - Empty JavaScript file reserved for mapping rule schemas and heuristics in future architectural upgrades.

### [server/src/engine/generators/bubbleSort.js](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/server/src/engine/generators/bubbleSort.js)
- **Role**: Isolated Programmatic Step Generator.
- **Functionality**:
  - Dedicated bubble sort visualizer logic block.
  - Traces passes, inner loops, index comparisons, and index swaps, returning an array of frame states. Used as a reference module pattern for programmatic generators.

---

## 4. Vercel API Wrapper (`/api`)

### [api/index.js](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/api/index.js)
- **Role**: Vercel Serverless Function entry point.
- **Functionality**:
  - Resolves serverless API routing by requiring the Express application directly from `../server/src/index.js` and exporting it. This enables zero-configuration hosting on Vercel.

---

## 5. Client Prototype Workspace (`/client`)

### [client/src/index.html](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/client/src/index.html)
- **Role**: Alternative React Single Page Application (SPA).
- **Functionality**:
  - React + Tailwind CSS client prototype loaded via CDNs using Babel compile setups.
  - Uses `framer-motion` to animate elements during array sorting transitions.
  - Implements `Chart.js` to render a responsive line chart showing complexity scaling curve graphs.

### [client/src/logiclens.css](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/client/src/logiclens.css)
- **Role**: Alternative Stylesheet.
- **Functionality**:
  - A duplicate or variant of the master stylesheet customized for client prototype templates.

### [client/tailwind.config.js](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/client/tailwind.config.js)
- **Role**: Tailwind Configuration.
- **Functionality**:
  - Configuration file defining workspace content scans, theme spacing configurations, and responsive screens rules for Tailwind.

---

## 6. Data Logs and Configuration Files

### [feedback_log.json](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/feedback_log.json)
- **Role**: AI Accuracy Ledger.
- **Functionality**:
  - Stores logged inputs of correctness reports submitted by users from the Custom Code visualizer.
  - Written dynamically by `/api/feedback` as a JSON array of objects recording the timestamp, code analyzed, input array, and confirmation flag (`correct: true/false`).

### [vercel.json](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/vercel.json)
- **Role**: Vercel Deployment Configuration.
- **Functionality**:
  - Configures route redirects and server rules:
    ```json
    {
      "rewrites": [{ "source": "/api/(.*)", "destination": "/api/index.js" }]
    }
    ```
  - Directs Vercel to route all backend API calls to the serverless entrypoint.

### [package.json](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/package.json) & [server/package.json](file:///c:/Users/Harish%20Jalani/Desktop/Harish/Project%20-%20LogicLens/server/package.json)
- **Role**: NPM Package Specifications.
- **Functionality**:
  - Root `package.json` sets up project dependencies.
  - Server `package.json` installs dependencies (`express`, `cors`, `@google/generative-ai`, `dotenv`) and registers the `npm start` trigger running `node src/index.js`.
