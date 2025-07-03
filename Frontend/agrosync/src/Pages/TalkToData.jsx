import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FaMicrophone, FaStop, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { Player } from "@lottiefiles/react-lottie-player";
import agrobot from "../assets/agrobot-illustration.png"
const API_KEY =import.meta.env.VITE_GEMINI_API_KEY
const TalkToData = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    console.log("Gemini API Key:",API_KEY);
    const ai = new GoogleGenerativeAI(API_KEY);
    setModel(ai.getGenerativeModel({ model: 'gemini-2.5-flash' }));
  }, []);

  const sendMessage = async (text) => {
  const updatedHistory = [...chatHistory, { role: 'user', content: text }];
  setChatHistory(updatedHistory);
  setIsLoading(true);

  try {
    
    const formattedHistory = updatedHistory.slice(0, -1).map((msg) => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // 🛑 If first message is from 'model', skip it
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift(); // Remove the invalid first message
    }

    let result;
    if (formattedHistory.length > 0) {
      const chat = model.startChat({ history: formattedHistory });
      result = await chat.sendMessage(text);
    } else {
      result = await model.generateContent(text);
    }

    const reply = result.response.text();
    setChatHistory((prev) => [...prev, { role: 'ai', content: reply }]);
  } catch (err) {
    setChatHistory((prev) => [...prev, { role: 'ai', content: '⚠️ Error: ' + err.message }]);
  } finally {
    setIsLoading(false);
  }
};

  

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceSend = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const reader = new FileReader();

        reader.onloadend = async () => {
          const base64Audio = reader.result.split(',')[1];
          setIsLoading(true);
          const result = await model.generateContent([
            { text: 'Be a helpful assistant.' },
            {
              inlineData: { mimeType: 'audio/webm', data: base64Audio }
            }
          ]);
          const reply = result.response.text();
          setChatHistory(prev => [...prev, { role: 'ai', content: reply }]);
          setIsLoading(false);
        };

        reader.readAsDataURL(blob);
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start();
      setIsRecording(true);
    }
  };

  return (
    <>

    {/* AgroBot Custom Illustration */}
   
 {!isOpen && (
  <div className="relative min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 flex flex-col items-center justify-center px-4 text-center">
    
    {/* AgroBot Custom Illustration */}
    <img
      src={agrobot} // Make sure agrobot is imported at the top
      alt="AgroBot"
      className="w-72 h-auto mb-4 rounded-lg shadow-lg"
    />

    {/* AgroBot Text */}
    <h1 className="text-4xl mt-2 font-extrabold text-green-700 mb-3">
      Meet AgroBot 🤖
    </h1>
    

    {/* Sample Questions */}
    <div className="bg-white border border-green-300 p-4 rounded-lg shadow w-full max-w-md text-left text-green-800">
      <p className="font-semibold mb-2">Try asking:</p>
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li>What is the best fertilizer for tomato crops?</li>
<li>How do I protect my crops during heavy rainfall?</li>
<li>Which vegetables can I grow in August in Karnataka?</li>

      </ul>
    </div>

    {/* Open AgroBot Button */}
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-lime-500 text-white px-6 py-4 rounded-full shadow-xl hover:scale-105 transition-all duration-200 z-50 flex items-center gap-2 text-lg font-semibold"
    >
      <span className="text-2xl">🤖</span>
      <span className="text-xl">Open AgroBot</span>
    </button>
  </div>
)}

       

      {/* Fullscreen Chat UI */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Header */}
          <div className="bg-green-600 text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-10">
            <h2 className="text-2xl font-bold">🌾 AgroBot</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-red-300 transition"
              title="Close"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gradient-to-br from-green-50 to-white">
            {chatHistory.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                👋 Hi! I’m AgroBot. Ask me anything about crops, fertilizers, tools, weather, or farming.
              </div>
            )}

            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`max-w-lg px-4 py-3 rounded-xl shadow-sm ${
                  msg.role === 'user'
                    ? 'ml-auto bg-green-100 text-green-900'
                    : 'mr-auto bg-white border border-green-100 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            ))}

            {isLoading && (
              <div className="mr-auto px-4 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg animate-pulse">
                Typing...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="px-4 py-4 border-t bg-white flex items-center gap-3">
            <input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border rounded-xl px-4 py-2 focus:ring-2 ring-green-300 outline-none shadow-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="text-green-600 hover:text-green-800 text-xl"
              title="Send"
            >
              <FaPaperPlane />
            </button>
            <button
              onClick={handleVoiceSend}
              className={`text-xl ${
                isRecording ? 'text-red-600 animate-pulse' : 'text-green-600'
              }`}
              title={isRecording ? 'Stop Recording' : 'Record with Voice' }
            >
              {isRecording ? <FaStop /> : <FaMicrophone />}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TalkToData;
