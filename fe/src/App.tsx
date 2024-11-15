import { useState, useRef, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import axios from 'axios';

type Payload = {
	code: string;
	url: string;
}

export default function App() {
	const apiUrl = import.meta.env.VITE_API_URL;
	const [userAnswer, setUserAnswer] = useState("");
	const [answers, setAnswers] = useState<string[]>([userAnswer]);
	const [loading, setLoading] = useState<boolean>(false);
	const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

	async function handleSubmit() {
		if (userAnswer.trim() !== "") {
			setAnswers([...answers, userAnswer]);
			setUserAnswer("");
			setLoading(true);

			// Extract and decode the payload from the URL
			const url = window.location.href;
			const payloadEncoded = url.split("?LC=")[1];
			if (payloadEncoded) {
				const payload = JSON.parse(atob(decodeURIComponent(payloadEncoded))) as Payload;

				try {
					// Send the request to the backend
					const response = await axios.post(apiUrl, {
						useranswer: payload.code,
						url: payload.url
					});

					// Extract the text content from the response and format line breaks
					const aiResponseText = response.data.aiResponse;
					const formattedResponse = aiResponseText.replace(/\n/g, "<br/>");

					// Add the AI response to the answers
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
		<div className="flex h-screen">
			<div className="flex flex-col justify-between w-full h-full border-4 border-black p-4 rounded-lg bg-gray-800">
				<h1 className="text-white mb-4">Stuck? Here are some hints :) <br /> you dont need to copy paste your solution</h1>

				<div className="text-white mt-4 overflow-y-auto" style={{ maxHeight: 'calc(100% - 130px)' }}>
					{answers.map((answer, index) => (
						<div key={index} className="message-container" dangerouslySetInnerHTML={{ __html: answer }} />
					))}
					<div ref={endOfMessagesRef} />
				</div>



				<div className="flex items-center border-2 border-slate-400 rounded-lg p-2 bg-gray-700 mt-auto">
					<input
						type="text"
						placeholder="Type your answer here"
						value={userAnswer}
						onChange={(e) => setUserAnswer(e.target.value)}
						className="bg-transparent flex-grow border-none outline-none text-white placeholder-gray-400 mr-2 h-12 resize-none"
					/>

					<button
						onClick={handleSubmit}
						className="text-white p-2 rounded-full bg-slate-700 hover:bg-slate-500"
						disabled={loading}
					>
						{loading ? "Loading..." : <FaArrowUp />}
					</button>
				</div>
			</div>
		</div>
	);
}
