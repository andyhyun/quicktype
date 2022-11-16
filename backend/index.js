const express = require('express');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.get('/api/test', (req, res) => {
  res.send('Testing out the API');
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
