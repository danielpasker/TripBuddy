import {initApp} from './server';
import https from 'https';
import fs from 'fs';
import { Env } from '@env';

const port = Env.PORT;

initApp().then((app) => {
  if (Env.NODE_ENV != 'production') {
    app.listen(port, () => {
      console.log(`TripBuddy app listening at http://localhost:${port}`);
    });
  } else {
    const options = {
      key: fs.readFileSync('../../client-key.pem'),
      cert: fs.readFileSync('../../client-cert.pem'),
    };
    https.createServer(options, app).listen(port);
  }
});
