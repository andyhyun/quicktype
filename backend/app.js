const express = require('express')
const app = express()
const port = 8080;
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const { json, query } = require('express');
app.use(bodyParser.json());

// create the connection to database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

app.get('/api/test', (req, res) => {
  res.send('Testing out the API');
});

app.post('/api/scores/', (req, res) => {
  const cscore =req.body[0].score;
  const clength =req.body[0].length;
  const cuserId =req.body[0].userId;
  const query = 'INSERT into scores(score,length,user_Id) values(' + cscore + ',' + clength + ',\'' + cuserId + '\')';
  console.log(query);
  connection.query(
    query,
    function(err, results, fields) {
      if (err){
        console.log(err);
        res.status(500).send(err);
      } else{
        res.end();
      }
    }
  );
  
});

app.get('/api/users/:userid', (req, res) => {
  const articles = [];
  const fetchid = req.params.userid;
  connection.query(
    'SELECT score,length,date_set FROM scores WHERE user_id = ? ORDER BY date_set DESC LIMIT 10;',fetchid ,
    function(err, results, fields) {
      if (err){
        console.log(err);
      } else{
        var data=JSON.parse(JSON.stringify(results));
        res.send(data);
      }
    }
  );
});

app.get('/api/scores/:length', (req, res) => {
  const articles = [];
  const fetchlength = req.params.length;
  connection.query(
    'SELECT score,username FROM scores as scores,users as users WHERE users.id = scores.user_id AND scores.length=? ORDER BY scores.score DESC limit 10;',fetchlength,
    function(err, results, fields) {
      if (err){
        console.log(err);
      } else{
        var data=JSON.parse(JSON.stringify(results));
        res.send(data);
      }
    }
  );
});

app.post('/api/users/', (req, res) => {
  const cname =req.body[0].username;
  const cuserId =req.body[0].userId;
  const query = 'INSERT into users(username,id) values(\'' + cname + '\',\'' + cuserId + '\')';
  console.log(query);
  connection.query(
    query,
    function(err, results, fields) {
      if (err){
        console.log(err);
        res.status(500).send(err);
      } else{
        res.end();
      }
    }
  );
  
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
