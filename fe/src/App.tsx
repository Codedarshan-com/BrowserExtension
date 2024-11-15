import { useState, useRef, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import axios from "axios";
import "./App.css";
import logo from "./assets/CDlogo.png";

type Payload = {
  code: string;
  url: string;
};

export default function App() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [userAnswer, setUserAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  async function handleSubmit() {
    if (userAnswer.trim() !== "") {
      setAnswers([...answers, userAnswer]);
      setUserAnswer("");
      setLoading(true);

      const url = window.location.href;
      const payloadEncoded = url.split("?LC=")[1];
      if (payloadEncoded) {
        const payload = JSON.parse(
          atob(decodeURIComponent(payloadEncoded))
        ) as Payload;

        try {
          const response = await axios.post(apiUrl, {
            useranswer: payload.code,
            url: payload.url,
          });

          const aiResponseText = response.data.aiResponse;
          const formattedResponse = aiResponseText.replace(/\n/g, "<br/>");

          setAnswers([...answers, formattedResponse]);
        } catch (error) {
          console.error("Error sending input:", error);
        }
      }

      setLoading(false);
    }
  }

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [answers]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br bg-customBackground text-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-lg">
        <img src={logo} alt="CodeDarshan" className="h-12 object-contain" />
        <h1 className="text-2xl font-bold text-white">Algoezy</h1>
      </div>

      {/* Quote */}
      <div className="text-center my-2">
        <p className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Work Hard, Stay Smart!
        </p>
      </div>

      {/* Chat Section */}
      <div className="flex-grow flex flex-col justify-between px-4 pb-6">
        {/* Messages */}
        <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {answers.map((answer, index) => (
            <div
              key={index}
              className="bg-gray-700 p-4 rounded-lg text-white mb-3 shadow-md"
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          ))}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Area */}
        <div className="flex items-center mt-4 border-2 border-gray-500 rounded-full bg-gray-700 shadow-lg">
          <input
            type="text"
            placeholder="Type your answer here..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="bg-transparent flex-grow border-none outline-none text-white placeholder-gray-400 px-4 text-lg"
          />

          <button
            onClick={handleSubmit}
            className={`p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-110 hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50`}
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              <FaArrowUp size={20} className="text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
