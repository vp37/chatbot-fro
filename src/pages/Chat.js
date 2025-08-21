import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import "../App.css";
import botImage from "../images/egps3.jpg";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatEndRef = useRef(null);

  // Backend URL - set only production URL here
  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || "https://chatbot-bac-1.onrender.com";

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const res = await axios.post(`${BACKEND_URL}/chat/`, {
        message: input,
      });
      setMessages([...newMessages, { sender: "bot", text: res.data.reply }]);
      setInput("");
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Error: Could not reach server." },
      ]);
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle emoji click
  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      {/* Header */}
      <div className="header">
        <h2>Bot 🤖</h2>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌙" : "☀️"}
        </button>
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <button
          className="emoji-btn"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          😊
        </button>

        {showEmojiPicker && (
          <div className="emoji-picker">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {/* Image Section */}
      <div className="chat-image">
        <img src={botImage} alt="Chat visual" />
      </div>
    </div>
  );
}

export default App;
