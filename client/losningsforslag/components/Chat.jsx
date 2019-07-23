import React, { useEffect, useState } from 'react';
import dateFormat from 'date-fns/format';

const Chat = ({ socket }) => {
  const [active, setActive] = useState(false);
  const [messages, setMessages] = useState([]);

  const sendMessage = e => {
    e.preventDefault();
    const text = e.target.messageText.value;

    if (text) {
      socket.emit('new message', { text, timestamp: Date.now() });
    }
  };

  socket.on('chat messages', chatMessages => {
    setMessages(chatMessages);
    setActive(true);
  });

  const joinChat = e => {
    e.preventDefault();

    const nickname = e.target.nickname.value;

    if (nickname) {
      const participant = { nickname, id: socket.id };
      socket.emit('join', participant);
    }
  };

  useEffect(() => {
    // Scroll to and show last message
    const chatHistory = document.getElementById('messages');
    if (chatHistory) {
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }
  }, [messages]);

  return (
    <article className="container chat-container">
      <h2>Chat</h2>
      {active ? (
        <>
          <ul className="messages" id="messages">
            {messages.map(message => (
              <li className="message-content" key={message.timestamp}>
                <p className="message">{message.text}</p>
                <div className="message__metadata">
                  <span>{message.sender.nickname}</span>
                  <span>{dateFormat(message.timestamp, 'HH:mm:ss')}</span>
                </div>
              </li>
            ))}
          </ul>
          <form className="message-form" onSubmit={sendMessage}>
            <textarea id="messageText" rows="4" spellCheck={false} />
            <button className="message-form__button">
              <img src="../arrow.svg" alt="Send message" />
            </button>
          </form>
        </>
      ) : (
        <form className="join-form" onSubmit={joinChat}>
          <label htmlFor="nickname">Enter nickname</label>
          <input id="nickname" placeholder="Ola Normann" spellCheck={false} />
          <button>Join chat</button>
        </form>
      )}
    </article>
  );
};

export default Chat;
