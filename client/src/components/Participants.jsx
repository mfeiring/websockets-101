import React, { useEffect, useState } from 'react';

const Participants = ({ socket }) => {
  const [participants, setParticipants] = useState([]);

  return (
    <article className="container participant-container">
      <h2>Participants</h2>
      <ul className="participant-list">
        {participants.map(participant => (
          <li className="participant" key={participant.id}>
            {participant.nickname}
          </li>
        ))}
      </ul>
    </article>
  );
};

export default Participants;
