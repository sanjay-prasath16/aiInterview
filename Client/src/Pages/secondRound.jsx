import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as monaco from "monaco-editor";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import JupiterActivatedState from "../Components/jupiterActivatedState";
import PracticeSimulationQuestion from "../Components/PracticeSimulationQuestion";
import Timer from "../assets/Timer.svg";

const questions = [
  {
    question: "You are developing a system for a bookstore to manage its inventory. The bookstore has a unique way of organizing books: they are arranged in a circular queue, where the front of the queue connects back to the rear. Each book in the queue has a title and a price. The store owner wants to implement a feature that finds the most expensive book within a given range of the queue, considering its circular nature. Write a function that takes the circular queue of books, a start position, and the number of books to consider, and returns the title of the most expensive book within that range.",
    example: "Input: Queue: [{'The Hobbit', 15}, ('1984', 10), ('To Kill a Mockingbird', 12), ('Pride and Prejudice', 9), ('The Great Gatsby', 11)] , Start: 2, Range: 4\nOutput: The Hobbit",
  },
  {
    question: "You are designing a ticket reservation system for a cinema. The cinema has multiple rows of seats, and each row is represented as an array of seats, where each seat can either be available (represented by 0) or booked (represented by 1). To help customers find the best seating arrangement, the cinema owner wants to implement a feature that finds the largest contiguous block of available seats in a given row. The function should take a list representing a row of seats and return the maximum number of consecutive available seats. If multiple blocks of the same size exist, return any one of them.",
    example: "Input: [1, 0, 0, 0, 1, 0, 0, 1]\nOutput: 3 (The largest contiguous block of available seats is [0, 0, 0])",
  },
  {
    question: "A company wants to analyze its sales data to identify the best short-term revenue periods. The sales team maintains an array where each value represents the revenue earned on a particular day. The company wants to implement a function that determines the maximum revenue that can be obtained from a contiguous subarray of at most k days. This will help the company understand the best short-term sales windows. The function should take the sales array and the maximum allowed number of days as input and return the highest revenue possible for any valid contiguous period.",
    example: "Input: Sales = [3, 2, 5, 1, 6], k = 2\nOutput: 7 (The best contiguous subarray is [5, 2] or [1, 6])",
  },
  {
    question: "You are developing a text analysis tool for a language processing application. One of the important features of the tool is detecting the longest substring of unique characters within a given string. Given a string containing only lowercase letters, implement a function that finds the longest contiguous substring where no character repeats. The function should return the length of this substring. If there are multiple substrings of the same length, return any one of them. The result will help in analyzing patterns and uniqueness in text processing.",
    example: "Input: 'abcabcbb'\nOutput: 3 (The longest substring without repeating characters is 'abc')",
  },
  {
    question: "A warehouse keeps track of its inventory using a list of product IDs. Some product IDs appear more than once due to restocking, but the warehouse manager needs a function to identify the first unique product ID that appears in the list. This will help streamline stock tracking and identify which products were added first without repetition. The function should process the list in the given order and return the first product ID that does not appear more than once in the sequence.",
    example: "Input: [4, 5, 1, 2, 1, 4, 5]\nOutput: 2 (The first non-repeating product ID is 2)",
  }
];

const getRandomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

const TechnicalPracticeSimulation = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timer, setTimer] = useState(15 * 60);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [tempLanguage, setTempLanguage] = useState("python");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const codeEditorRef = useRef(null);
  const decorationRef = useRef([]);
  const selectRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentQuestion(getRandomQuestion());
  }, []);

  const handleToggle = () => {
    setIsFlipped((prev) => !prev);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const onMount = (editor) => {
    codeEditorRef.current = editor;
    updateActiveLineDecoration(editor, 1);
    editor.setPosition({ lineNumber: 1, column: 1 });

    editor.onDidChangeCursorPosition(() => {
      const currentPosition = editor.getPosition();
      if (currentPosition) {
        updateActiveLineDecoration(editor, currentPosition.lineNumber);
      }
    });
  };

  const updateActiveLineDecoration = (editor, activeLine) => {
    decorationRef.current = editor.deltaDecorations(decorationRef.current, [
      {
        range: new monaco.Range(activeLine, 1, activeLine, 1),
        options: {
          isWholeLine: true,
          className: "active-line-highlight",
        },
      },
    ]);
  };

  useEffect(() => {
    const fetchLanguages = async () => {
      const availableLanguages = [
        { label: "Python", value: "python" },
        { label: "Java", value: "java" },
        { label: "C", value: "c" },
        { label: "C++", value: "cpp" },
      ];
      setLanguages(availableLanguages);

      if (availableLanguages.some((lang) => lang.value === "python")) {
        setSelectedLanguage("python");
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (selectRef.current) {
      const text = selectedLanguage;
      const tempElement = document.createElement("span");
      tempElement.style.visibility = "hidden";
      tempElement.style.position = "absolute";
      tempElement.style.font = window.getComputedStyle(selectRef.current).font;
      tempElement.textContent = text;

      document.body.appendChild(tempElement);
      selectRef.current.style.width = `${tempElement.offsetWidth + 40}px`;
      document.body.removeChild(tempElement);
    }
  }, [selectedLanguage]);

  const handleLanguageChange = (newLanguage) => {
    if (codeEditorRef.current?.getValue()?.trim()) {
      setTempLanguage(newLanguage);
      setIsPopupVisible(true);
    } else {
      setSelectedLanguage(newLanguage);
    }
  };

  const handlePopupAction = (action) => {
    if (action === "ok") {
      codeEditorRef.current?.setValue("");
      setSelectedLanguage(tempLanguage);
    }
    setIsPopupVisible(false);
  };

  const handleNext = async () => {
    const code = codeEditorRef.current.getValue();
    const userOutput = output;
    const exampleOutput = currentQuestion.example;

    await saveInterviewData({
      question: currentQuestion.question,
      code,
      exampleOutput,
      userOutput,
    });

    setCurrentQuestion(getRandomQuestion());
    setTimer(15 * 60);
    setOutput("");
    setError("");
    codeEditorRef.current.setValue("");
  };

  const saveInterviewData = async (data) => {
    await handleRunCode();

    try {
      const response = await fetch("http://localhost:8000/storeTechnicalData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save interview data");
      }
      navigate("/applicantResult");
    } catch (err) {
      console.error("Error saving interview data:", err);
    }
  };

  useEffect(() => {
    if (timer === 0) {
      handleNext();
    }
  }, [timer]);

  const handleRunCode = async () => {
    const code = codeEditorRef.current.getValue();
    setOutput("");
    setError("");

    try {
      const response = await fetch("http://localhost:5000/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: selectedLanguage,
          code: code,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setOutput(result.output);
      } else {
        setError(result.error || "An error occurred while executing the code.");
      }
    } catch (err) {
      setError("Failed to connect to the server.", err);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-[#0E0E0E] overflow-hidden">
      <div className="absolute -left-[5%] top-[60%] -translate-y-1/2 w-[35%] h-[70%] rounded-full bg-gradient-radial from-blue-400/50 via-blue-500/70 to-transparent blur-2xl" />
      <div className="absolute -right-[5%] top-[40%] -translate-y-1/2 w-[35%] h-[70%] rounded-full bg-gradient-radial from-purple-500/50 via-purple-600/70 to-transparent blur-2xl" />
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative h-full flex">
        <div
          className="w-[50%] h-[60%] ml-10 mr-5 my-8 rounded-3xl bg-black bg-opacity-50 p-5 relative shadow-lg"
          style={{
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex justify-between items-center text-gray-800 mb-4 pb-5 border-b border-b-[#505050]">
            <div className="flex items-center space-x-2">
              <h2 className="text-[18px] font-semibold text-white">
                Language:
              </h2>
              <select
                ref={selectRef}
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="text-white bg-black outline-none font-semibold rounded-md text-[18px]"
              >
                {languages.map((lang) => (
                  <option
                    key={lang.value}
                    value={lang.value}
                    className="text-[18px]"
                  >
                    {lang.label.charAt(0).toUpperCase() + lang.label.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white border border-[#FFFFFF] rounded-full p-3 px-5 text-[20px] font-medium flex">
                <img src={Timer} alt="" className="w-[23px] h-[24px] mt-1 mr-2" />
                Timer: {formatTimer(timer)}
              </span>
              <button
                onClick={handleRunCode}
                className="bg-[#7403D0] text-white py-4 px-10 text-[14px] rounded-full"
              >
                Run
              </button>
            </div>
          </div>
          <div className="h-[60%]">
            <Editor
              height="100%"
              language={selectedLanguage}
              defaultValue="#Write your code here..."
              theme="vs-dark"
              onMount={onMount}
              options={{
                minimap: { enabled: false },
                fontSize: "30px",
                fontFamily: "'regular', Consolas, 'Courier New', monospace",
                cursorBlinking: "smooth",
                overviewRulerBorder: false,
                hideCursorInOverviewRuler: true,
                renderLineHighlight: "none",
                smoothScrolling: true,
                scrollBeyondLastLine: false,
                letterSpacing: 1.5,
              }}
            />
          </div>
          <div
            className="absolute top-[125%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full h-[40%] 
             bg-[#3E3B41]/30 backdrop-blur-lg shadow-lg rounded-3xl p-4 text-white overflow-auto border border-white/20"
          >
            <div className="text-lg font-semibold">OUTPUT:</div>
            {error ? (
              <div className="text-red-500 mt-2">{error}</div>
            ) : (
              <div className="text-green-500 text-[15px] mt-[2%] ml-[5%]">{output}</div>
            )}
          </div>
        </div>
        <div className="w-1/2 flex justify-center items-center relative">
          <motion.div
            className="w-full h-[90%] relative rounded-3xl"
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className={`absolute w-full h-[90%] backface-hidden ${isFlipped ? "hidden" : "block"
                }`}
            >
              <PracticeSimulationQuestion
                question={currentQuestion?.question || "No question available"}
                example={currentQuestion?.example || "No example available"}
                onSmallJupiterClick={handleToggle}
              />
            </div>

            <div
              className={`absolute w-full h-[90%] backface-hidden ${isFlipped ? "block" : "hidden"
                }`}
              style={{ transform: "rotateY(180deg)" }}
            >
              <JupiterActivatedState onEnlargedJupiterClick={handleToggle} />
            </div>
          </motion.div>
        </div>
      </div>
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
            <h2 className="text-lg font-bold">Change Language?</h2>
            <p>
              Changing the language will erase the current code. Do you want to
              proceed?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handlePopupAction("cancel")}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePopupAction("ok")}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="absolute bottom-10 right-10">
        <button onClick={handleNext} className="border border-[#7403D0] bg-[#7403D0] rounded-full px-10 py-2 text-white text-[14px] font-medium shadow-lg">
          Next
        </button>
      </div>
    </div>
  );
};

export default TechnicalPracticeSimulation;