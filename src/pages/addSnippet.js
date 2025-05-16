import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { json } from "@codemirror/lang-json";
import { php } from "@codemirror/lang-php";
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { useUser } from "@clerk/clerk-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

// Modal component (same as before)
const Modal = ({ isOpen, onClose, onSave, description, setDescription, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-indigo-400 mb-4">Describe Your Code</h2>
        <textarea
          className="w-full h-24 p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter a description for your code..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition"
          onClick={onSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

const languageExtensions = {
  javascript: javascript(),
  python: python(),
  html: html(),
  css: css(),
  java: java(),
  cpp: cpp(),
  json: json(),
  php: php(),
};

const languageMap = {
  javascript: { id: 63, name: "JavaScript (Node.js 12.14.0)" },
  python: { id: 71, name: "Python (3.8.1)" },
  java: { id: 62, name: "Java (OpenJDK 13.0.1)" },
  cpp: { id: 54, name: "C++ (GCC 9.2.0)" },
  php: { id: 68, name: "PHP (7.4.1)" },
  // HTML/CSS/JSON not supported for code execution in most APIs
};

const AddSnippet = () => {
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("javascript");
  const [modalOpen, setModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const { isSignedIn, user, isLoaded } = useUser()

  // AI Section
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Run Code Section
  const [runOutput, setRunOutput] = useState("");
  const [runLoading, setRunLoading] = useState(false);

  // Handle code submit
  const handleSubmit = async () => {
    setSaving(true);
    try {
      await fetch("https://backend-codershangout.vercel.app/store/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code,
          description: description,
          language: language,
          user_email: user.emailAddresses[0].emailAddress,
          user_id: user.id,
          user_image: user.imageUrl
        }),
      });
      setModalOpen(false);
      setDescription("");
      window.location.reload()
    } catch (err) {
      // Optionally handle error
      console.log(err)
    }
    setSaving(false);
  };

  // Handle AI prompt
  const handleAIGenerate = async () => {
    setAiLoading(true);
    setAiResponse("");
    try {
      const res = await fetch("https://backend-codershangout.vercel.app/ai/code/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      setAiResponse(data.response || "No response from AI.");
    } catch (err) {
      setAiResponse("Error generating response.");
    }
    setAiLoading(false);
  };

  // Handle Run Code
  const handleRunCode = async () => {
    setRunLoading(true);
    setRunOutput("");
    // Only run if supported language
    if (!languageMap[language]) {
      setRunOutput("Code execution not supported for this language.");
      setRunLoading(false);
      return;
    }
    try {
      // Example using Judge0 API (replace with your backend for security in production)
      const res = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": "a821a5b348mshf29389296b4677bp181b00jsn0f038b6e864f", // Replace with your RapidAPI key
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageMap[language].id,
        }),
      });
      const data = await res.json();
      console.log(data)
      setRunOutput(data.stdout || data.stderr || data.compile_output || "No output.");
    } catch (err) {
      setRunOutput("Error running code.");
    }
    setRunLoading(false);
  };

  return (
    <>
    <Navbar />
    <SignedIn>
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center px-2 py-6">
      <div className="w-full max-w-4xl bg-gray-900 rounded-lg shadow-lg p-4 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-indigo-400">Code Editor</h1>
          <div className="flex gap-2">
            <select
              className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-700 focus:outline-none"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="php">PHP</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
            </select>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-1 rounded transition"
              onClick={() => setModalOpen(true)}
            >
              Submit
            </button>
          </div>
        </div>
        <CodeMirror
          value={code}
          height="400px"
          theme="dark"
          extensions={[languageExtensions[language]]}
          onChange={setCode}
          className="rounded"
        />

        {/* Run Code Section */}
        <div className="mt-6">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded transition"
            onClick={handleRunCode}
            disabled={runLoading}
          >
            {runLoading ? "Running..." : "Run Code"}
          </button>
          <div className="mt-4 bg-gray-800 rounded p-4 min-h-[80px] text-sm overflow-x-auto">
            <span className="block font-semibold text-indigo-400 mb-1">Output:</span>
            <pre className="whitespace-pre-wrap break-words">{runOutput}</pre>
          </div>
        </div>
      </div>

      {/* Modal for code submission */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSubmit}
        description={description}
        setDescription={setDescription}
        loading={saving}
      />

      {/* Ask from AI section */}
      <div className="w-full max-w-4xl bg-gray-900 rounded-lg shadow-lg p-4 md:p-8">
        <h2 className="text-xl font-bold text-indigo-400 mb-2">Ask from AI</h2>
        <textarea
          className="w-full h-24 p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
          placeholder="Describe what you want to ask the AI..."
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
        />
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded transition mb-4"
          onClick={handleAIGenerate}
          disabled={aiLoading}
        >
          {aiLoading ? "Generating..." : "Generate Response"}
        </button>
        {aiResponse && (
          <div className="mt-4 p-4 bg-gray-800 rounded text-indigo-200 whitespace-pre-wrap">
            {aiResponse}
          </div>
        )}
      </div>
    </div>
    </SignedIn>
    <SignedOut>
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 sm:py-24">
          <div className="container mx-auto px-4 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Welcome to <span className="text-blue-600">CodersHangout</span>
            </h1>
            <h2 className="text-lg sm:text-2xl font-semibold text-blue-700 mb-2">
              Effortlessly Manage Your Blogs & Code Snippets
            </h2>
            <p className="text-gray-600 max-w-xl mb-8 text-base sm:text-lg">
              Organize your blogs, showcase your code, and boost your productivity with our modern, intuitive dashboard. Join now and start your journey!
            </p>
            <SignInButton
              className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold text-base sm:text-lg shadow-md hover:bg-blue-700 transition-colors"
            />
          </div>
        </section>
    </SignedOut>
    <Footer />
    </>
  );
};

export default AddSnippet;
