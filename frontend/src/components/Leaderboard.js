import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  const getScores = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/scores");
      const jsonData = await response.json();

      setScores(jsonData);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getScores();
  }, []);

  return (
    <div>
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>WPM</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score) => (
            <tr>
              <td>{score.user_id}</td>
              <td>{score.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
