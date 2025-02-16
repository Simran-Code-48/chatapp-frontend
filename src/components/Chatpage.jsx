import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:1337");

function Chat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const chatContainerRef = useRef(null);

  useEffect(() => {
    socket.on("Message", (message) => {
      setChatHistory((prev) => {
        const newHistory = [...prev, { from: "server", text: message }];
        localStorage.setItem("chatHistory", JSON.stringify(newHistory));
        return newHistory;
      });
    });

    return () => {
      socket.off("Message");
    };
  }, []);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("Message", message);
      setChatHistory((prev) => {
        const newHistory = [...prev, { from: "user", text: message }];
        localStorage.setItem("chatHistory", JSON.stringify(newHistory));
        return newHistory;
      });
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const clearChat = () => {
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
  };

  return (
    <div className="min-h-screen container mx-auto flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Chat with Server</h2>
        <button
          onClick={clearChat}
          className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition"
        >
          Clear Chat
        </button>
      </header>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[75vh] bg-white"
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] p-3 rounded-xl shadow-md text-sm ${
              msg.from === "user"
                ? "bg-blue-500 text-white self-end ml-auto text-right"
                : "bg-gray-200 text-gray-800 self-start mr-auto text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="p-4 bg-white flex items-center border-t border-gray-300">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        />
        <button
          onClick={sendMessage}
          className="ml-4 bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
