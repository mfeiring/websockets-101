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

  // Oppgave 6
  interface IncomingPosition {
    x: string;
    y: string;
  }

  interface Position extends IncomingPosition {
    id: string;
  }

  let positions: Position[] = [];
  // ---------

  io.on('connection', (socket: any) => {
    console.log('a user connected 😻');

    // Oppgave 1
    socket.emit('participants', participants);
    // ---------

    // Oppgave 2
    socket.on('join', (participant: Participant) => {
      // Oppgave 4
      socket.join('chat');
      // ---------
      participants.push(participant);
      io.emit('participants', participants);
      socket.emit('chat messages', chatMessages);
    });
    // ---------

    // Oppgave 3
    socket.on('add message', (message: IncomingMessage) => {
      const newMessage: Message = {
        ...message,
        sender: participants.find(participant => participant.id === socket.id)!
      };

      chatMessages.push(newMessage);

      // Løsning på oppgave 3, men unødvendig med funksjonen under
      // io.emit('new message', newMessage);

      // Oppgave 4
      io.to('chat').emit('new message', newMessage);
      //
    });
    // ---------

    socket.on('disconnect', () => {
      console.log('user disconnected 😿');

      // Oppgave 5
      participants = participants.filter(
        participant => participant.id !== socket.id
      );
      //
    });

    // Oppgave 6
    socket.on('draw', (position: IncomingPosition) => {
      positions.push({ ...position, id: socket.id });
      io.emit('positions', positions);
    });
    // ---------
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
