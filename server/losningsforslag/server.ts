// IIFE(Immediately Invoked Function Expression) hack for
// preventing TS redeclaration error
(() => {
  const server = require('http').createServer();
  const io = require('socket.io')(server);
  const PORT = process.env.PORT || 3000;

  interface Participant {
    id: string;
    nickname: string;
  }

  interface Message {
    text: string;
    timestamp: number;
    sender: Participant;
  }

  interface IncomingMessage {
    text: string;
    timestamp: number;
  }

  const DUMMY_PARTICIPANTS = [
    { nickname: 'Powerwolf', id: 'fakeId1' },
    { nickname: 'Babymetal', id: 'fakeId2' }
  ];

  const DUMMY_MESSAGES = [
    {
      text: 'Velkommen til chatten',
      timestamp: Date.now(),
      sender: DUMMY_PARTICIPANTS[0]
    }
  ];

  let participants: Participant[] = DUMMY_PARTICIPANTS;
  let chatMessages: Message[] = DUMMY_MESSAGES;

  io.on('connection', (socket: any) => {
    console.log('a user connected 😻');

    socket.emit('participants', participants);

    socket.on('join', (participant: Participant) => {
      participants.push(participant);
      io.emit('participants', participants);
      socket.emit('chat messages', chatMessages);
    });

    socket.on('new message', (message: IncomingMessage) => {
      const sender = participants.find(
        participant => participant.id === socket.id
      )!;

      chatMessages.push({
        ...message,
        sender
      });

      io.emit('chat messages', chatMessages);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  server.listen(PORT, (err: any) => {
    if (err) {
      console.log(err);
    }
    console.info(
      `==> 🌎 Listening on port ${PORT}. Open up localhost:${PORT} in your browser.`
    );
  });
})();
