import React, { useEffect, useState } from 'react';
import dateFormat from 'date-fns/format';

const Chat = ({ socket }) => {
  const [active, setActive] = useState(false);

  const joinChat = e => {
    e.preventDefault();
  };

  return (
    <article className="container chat-container">
      <h2>Chat</h2>
      {active ? (
        <>
          <ul className="messages" id="messages">
            {messages.map(message => (
              <li className="message" key={message.timestamp}>
                <p className="message__text">{message.text}</p>
                <div className="message__metadata">
                  <span>{message.sender.nickname}</span>
                  <span>{dateFormat(message.timestamp, 'HH:mm:ss')}</span>
                </div>
              </li>
            ))}
          </ul>
          <form className="message-form">
            <textarea id="messageText" rows="4" spellCheck={false} />
            <button className="message-form__button" onClick={sendMessage}>
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
