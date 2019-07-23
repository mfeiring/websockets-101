import React, { useEffect, useState } from 'react';

const Participants = ({ socket }) => {
  const [participants, setParticipants] = useState([]);

  // Oppgave 1
  socket.on('participants', participants => {
    setParticipants(participants);
  });
  // ---------

  return (
    <article className="container participant-container">
      <h2>Participants</h2>
      <ul className="participant-list">
        {participants.map(participant => (
          <li
            className={`participant ${
              participant.id === socket.id ? 'participant--active' : ''
            }`}
            key={participant.id}
          >
            {participant.nickname}
          </li>
        ))}
      </ul>
    </article>
  );
};

export default Participants;
