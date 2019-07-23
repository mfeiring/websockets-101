import React, { useEffect, useState } from 'react';

const Participants = ({ socket }) => {
  const [participants, setParticipants] = useState([]);

  socket.on('participants', participants => {
    setParticipants(participants);
  });

  return (
    <article className="container participant-container">
      <h2>Participants</h2>
      <ul className="participant-list">
        {participants.map(participant => (
          <li key={participant.id}>{participant.nickname}</li>
        ))}
      </ul>
    </article>
  );
};

export default Participants;
