import React, { useState } from 'react';
import { getHexColor } from '../../src/helpers';

const UPDATE_THRESHOLD = 2;

const Game = ({ socket }) => {
  const [xPostion, setXPostion] = useState(0);
  const [yPostion, setyPostion] = useState(0);

  const mouseMove = e => {
    const { clientX, clientY } = e;

    const canvas = document.getElementById('canvas');
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width; // relationship bitmap vs. element for X
    const scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    if (
      (xPostion !== x || yPostion !== y) &&
      (Math.abs(xPostion - x) > UPDATE_THRESHOLD ||
        Math.abs(yPostion - y) > UPDATE_THRESHOLD)
    ) {
      setXPostion(x);
      setyPostion(y);
      socket.emit('draw', { x, y });
    }
  };

  socket.on('positions', positions => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    positions.forEach(position => {
      if (position.id) {
        context.fillStyle = getHexColor(position.id);
        context.fillRect(position.x, position.y, 3, 3);
      }
    });
  });

  return (
    <article className="container game-container">
      <h2>Game</h2>
      <canvas className="game" id="canvas" onMouseMove={mouseMove} />
    </article>
  );
};

export default Game;
