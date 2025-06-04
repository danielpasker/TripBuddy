import {initApp} from './server';
import http from 'http';
import https from 'https';
import fs from 'fs';
import {Env} from '@env';
import {Server} from 'socket.io';
import {registerChatSocket} from '@utils/socket';

const port = Env.PORT;

initApp().then(app => {
  const ioOptions = {
    cors: {
      origin: Env.NODE_ENV === 'production' ? false : ['http://localhost:5173'],
      credentials: true,
    },
  };

  let server, io;
  if (Env.NODE_ENV != 'production') {
    server = http.createServer(app);
    io = new Server(server, ioOptions);

    registerChatSocket(io);
    server.listen(port, () => {
      console.log(`TripBuddy app listening at http://localhost:${port}`);
    });
  } else {
    const options = {
      key: fs.readFileSync('../certs/myserver.key'),
      cert: fs.readFileSync('../certs/CSB.crt'),
    };
    server = https.createServer(options, app);
    io = new Server(server, ioOptions);

    registerChatSocket(io);
    server.listen(port);
  }
});
