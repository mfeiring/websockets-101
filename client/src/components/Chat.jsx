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
              <li className="message-content" key={message.time}>
                <p className="message">{message.message}</p>
                <div className="message__metadata">
                  <span>{message.user.nickname}</span>
                  <span>{dateFormat(message.time, 'HH:mm:ss')}</span>
                </div>
              </li>
            ))}
          </ul>
          <form className="message-form" onSubmit={sendMessage}>
            <textarea
              rows="4"
              value={message}
              onChange={e => setMessage(e.target.value)}
              spellCheck={false}
            />
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
