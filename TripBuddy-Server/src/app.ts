import {initApp} from './server';
import https from 'https';
import fs from 'fs';
import {Env} from '@env';
import {initSocket} from '@utils/socket';

const port = Env.PORT;

initApp().then(app => {
  if (Env.NODE_ENV != 'production') {
    app.listen(port, () => {
      console.log(`TripBuddy app listening at http://localhost:${port}`);
    });
  } else {
    const options = {
      key: fs.readFileSync('../certs/myserver.key'),
      cert: fs.readFileSync('../certs/CSB.crt'),
    };
    const server = https.createServer(options, app);
    server.listen(port);
    initSocket(server);
  }
});
