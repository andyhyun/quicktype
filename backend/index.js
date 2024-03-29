const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./queries');

const app = express();
const port = process.env.PORT || 8080;

dotenv.config();
app.use(bodyParser.json());
app.use(cors());

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

