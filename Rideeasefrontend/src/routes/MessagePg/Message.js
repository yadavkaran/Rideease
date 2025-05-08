import React, { useState } from "react";
import "./Message.css";
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons


const Message = () => {
  const [messages, setMessages] = useState([
    { text: "Welcome to Hop-in Service", sender: "receiver" },
    { text: "Hi Hop-in", sender: "user" },
  ]);
  const [input, setInput] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, sender: "user" },
    ]);
    const userMessage = input.toLowerCase();
    setInput("");

    setTimeout(() => {
      let botResponse = "I'm sorry, I didn't understand that.";

      if (userMessage.includes("hello") || userMessage.includes("hi")) {
        botResponse = "Hello! How can I assist you today?";
      } else if (userMessage.includes("help")) {
        botResponse = "Sure! Please let me know what you need help with.";
      } else if (userMessage.includes("thank")) {
        botResponse = "You're welcome!";
      } else if (userMessage.includes("bye")) {
        botResponse = "Goodbye! Have a great day!";
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, sender: "receiver" },
      ]);
    }, 1000);
  };

  return (
    <>
      <button
        className="floating-button"
        onClick={() => setIsChatVisible((prev) => !prev)}
      >
            <i className="bi bi-chat" style={{ fontSize: '22px', color: '#f1f1f1' }}></i> {/* Message Icon */}

      </button>
      {isChatVisible && (
        <div className="chat-container">
          <div className="chat-header">
            <span>Hop-in</span>
            
            <button
              className="close-button"
              onClick={() => setIsChatVisible(false)}
            >
              ✖
            </button>
          </div>
          <div className="chat-message">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              placeholder="Enter your message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
