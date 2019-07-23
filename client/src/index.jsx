import React from 'react';
import { render } from 'react-dom';
import io from 'socket.io-client';
import Participants from './components/Participants';
import Chat from './components/Chat';

import './index.css';
import Game from './components/Game';

const socket = io('http://localhost:3000');

render(
  <main>
    <Participants socket={socket} />
    <Chat socket={socket} />
    <Game socket={socket} />
  </main>,
  document.getElementById('app')
);
