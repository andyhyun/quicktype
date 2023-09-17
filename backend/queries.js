const dotenv = require('dotenv');
dotenv.config();

const Pool = require('pg').Pool;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const addUser = async (request, response) => {
  const {
    userId,
    username,
  } = request.body;

  try {
    const query = `
      INSERT INTO users (id, username)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [userId, username];
    const result = await pool.query(query, values);
    response.status(201).send(`User added with ID: ${result.rows[0].id}`);
  } catch (error) {
    console.error(error.message);
    response.status(409).send('User already exists');
  }
};

const getUserScores = async (request, response) => {
  const { userId } = request.params;

  try {
    const avgScoresQuery = `
      SELECT AVG(score) avg_score, length
      FROM scores
      WHERE user_id = $1
      GROUP BY length
      ORDER BY length;
    `;
    const avgScoresValues = [userId];
    const avgScores = await pool.query(avgScoresQuery, avgScoresValues);

    const newScoresQuery = `
      SELECT score, length, date_set
      FROM scores
      WHERE user_id = $1
      ORDER BY date_set
      DESC LIMIT 10;
    `;
    const newScoresValues = [userId];
    const newScores = await pool.query(newScoresQuery, newScoresValues);

    const result = [avgScores.rows, newScores.rows];
    response.status(200).send(result);
  } catch (error) {
    console.error(error.message);
    response.status(404).send('Profile data could not be retrieved');
  }
};

const addScore = async (request, response) => {
  const {
    score,
    length,
    userId,
  } = request.body;

  try {
    const query = `
    INSERT INTO scores (score, length, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
    `;
    const values = [score, length, userId];
    const result = await pool.query(query, values);
    response.status(201).send(`Score added with ID: ${result.rows[0].id}`);
  } catch (error) {
    console.error(error.message);
    response.status(409).send('Score could not be added');
  }
};

const getTopUsers = async (request, response) => {
  const { length } = request.params;

  try {
    const query = `
      SELECT username, AVG(score) avg_score
      FROM scores
      INNER JOIN users
      ON scores.user_id = users.id
      WHERE length = $1
      GROUP BY username
      ORDER BY AVG(score)
      DESC LIMIT 10;
    `;
    const values = [length];
    const result = await pool.query(query, values);
    response.status(200).send(result.rows);
  } catch (error) {
    console.error(error.message);
    response.status(404).send('Top users could not be retrieved');
  }
};

module.exports = {
  addUser,
  getUserScores,
  addScore,
  getTopUsers,
};

