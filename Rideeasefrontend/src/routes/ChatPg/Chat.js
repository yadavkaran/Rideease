import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import MessageTile from '../../components/MessageTile';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
let offset = 0;
let adminId = "";

const ChatRoom = ({ roomId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState("1");
  const [userIdTyping, setUserIdTyping] = useState('');
  const [groupName, setGroupName] = useState('');
  const flashListRef = useRef(null);

  const setupSocket = async () => {
    const newSocket = io(API_URL, { auth: { token: sessionStorage.getItem('token') } });
    setSocket(newSocket);

    newSocket.on('connect', () => console.log('Connected to server'));
    newSocket.emit('join_group', { room_id: roomId, clientOffset: offset });

    newSocket.on('message', (data) => {
      const newOffset = parseInt(data.id);
      if (newOffset > offset) setMessages((prev) => [...prev, data]);
      if (newOffset > offset) offset = newOffset;
    });

    newSocket.on('typing', ({ userId }) => setUserIdTyping(`${userId} is typing...`));

    return () => newSocket.disconnect();
  };

  useEffect(() => {
    setupSocket();
  }, [roomId]);

  const handleSendMessage = async () => {
    if (socket && message.trim() && userId) {
      const msg = { from: userId, message, group: roomId};
      socket.emit('message', msg);
      setMessage('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <p variant="h6">Chatting with {groupName}</p>
      <div style={{ maxHeight: '70vh', overflowY: 'scroll' }} ref={flashListRef}>
        {messages.map((msg) => (
          <MessageTile key={msg.id} message={msg} userId={userId} />
        ))}
      </div>

      {userIdTyping && <p variant="caption">{userIdTyping}</p>}

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
        type = "text"
          variant="outlined"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            socket.emit('typing', { userId, groupId: roomId });
          }}
        />
        <button onClick={handleSendMessage} variant="contained" color="primary">
          Send
        </button>
      </div>

    </div>
  );
};

export default ChatRoom;
