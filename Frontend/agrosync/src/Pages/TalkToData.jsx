import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FaMicrophone, FaStop, FaPaperPlane, FaTimes } from 'react-icons/fa';

const API_KEY = 'AIzaSyDgNm0jaNBvafKYawi2nsetBKTvCMapcIU'; 

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
    const ai = new GoogleGenerativeAI(API_KEY);
    setModel(ai.getGenerativeModel({ model: 'gemini-2.5-flash' }));
  }, []);

  const sendMessage = async (text) => {
    const updatedHistory = [...chatHistory, { role: 'user', content: text }];
    setChatHistory(updatedHistory);
    setIsLoading(true);

    try {
      const formattedHistory = updatedHistory.slice(0, -1).map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      let result;

      if (formattedHistory.length > 0) {
        const chat = model.startChat({ history: formattedHistory });
        result = await chat.sendMessage(text);
      } else {
        result = await model.generateContent(text);
      }

      const reply = result.response.text();
      setChatHistory(prev => [...prev, { role: 'ai', content: reply }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', content: '⚠️ Error: ' + err.message }]);
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
      {!isOpen && (
  <button
    onClick={() => setIsOpen(true)}
    className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-lime-500 text-white px-6 py-4 rounded-full shadow-xl hover:scale-105 transition-all duration-200 z-50 flex items-center gap-2 text-lg font-semibold"
  >
    <span className="text-2xl">🤖</span> 
    <span className="text-xl">Open AgroBot</span>
  </button>
)}


      {isOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Header */}
          <div className="bg-green-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
            <h2 className="text-2xl font-bold">🌾 AgroBot</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-lg hover:text-red-200"
            >
              <FaTimes className="mr-1" /> Close
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`max-w-lg px-4 py-3 rounded-xl ${
                  msg.role === 'user'
                    ? 'ml-auto bg-green-100 text-right text-green-900'
                    : 'mr-auto bg-white border text-gray-800'
                } shadow-sm`}
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

          {/* Input area */}
          <div className="px-4 py-4 border-t bg-white flex items-center gap-3">
            <input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border rounded-xl px-4 py-2 focus:ring-2 ring-green-300 outline-none"
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
              title={isRecording ? 'Stop Recording' : 'Record'}
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
