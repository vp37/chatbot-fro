// import React, { useState } from "react";
// import axios from "axios";
// import "../App.css";

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [darkMode, setDarkMode] = useState(false); // 🌙 state for theme

//   const sendMessage = async () => {
//     if (!input) return;

//     const newMessages = [...messages, { sender: "user", text: input }];
//     setMessages(newMessages);

//     const res = await axios.post("http://127.0.0.1:8000/chat/", {
//       message: input,
//     });
//     setMessages([...newMessages, { sender: "bot", text: res.data.reply }]);
//     setInput("");
//   };

//   return (
//     <div className={`App ${darkMode ? "dark" : "light"}`}>
//       <div className="header">
//         <h2> Bot 🤖</h2>
//         <button onClick={() => setDarkMode(!darkMode)}>
//           {darkMode ? "🌙" : "☀️"}
//         </button>
//       </div>

//       <div className="chat-window">
//         {messages.map((msg, i) => (
//           <div key={i} className={`message ${msg.sender}`}>
//             <div className="message-text">{msg.text}</div>
//           </div>
//         ))}
//       </div>

//       <div className="input-area">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           placeholder="Type your message..."
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input) return;

    // Add user's message
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      // Send message to backend
      const res = await axios.post("http://127.0.0.1:8000/chat/", {
        message: input,
      });

      // Add bot's response
      setMessages([
        ...newMessages,
        { sender: "bot", text: res.data.reply || "No reply received" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Error: Could not get response" },
      ]);
    }

    setInput("");
  };

  // Scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      <div className="header">
        <h2>Bot 🤖</h2>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌙" : "☀️"}
        </button>
      </div>

      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;


