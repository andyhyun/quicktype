const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./queries');

const app = express();
const port = process.env.PORT || 8080;

let whitelist = ['https://quicktype.app', 'https://www.quicktype.app'];
if (process.env.FRONTEND_URL) {
  whitelist.push(process.env.FRONTEND_URL);
}

dotenv.config();
app.use(bodyParser.json());
app.use(cors({
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.get('/api/healthcheck', (request, response) => {
  response.status(200).send('OK');
});

app.post('/api/users', db.addUser);
app.get('/api/users/:userId', db.getUserScores);

app.post('/api/scores', db.addScore);
app.get('/api/scores/:length', db.getTopUsers);

app.use((error, request, response, next) => {
  console.error(error.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

