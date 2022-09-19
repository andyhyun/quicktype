import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();

  const [scores, setScores] = useState([]);

  const getScores = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/scores/${id}`);
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
      <h1>Profile</h1>
      <h2>Past Scores</h2>
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

export default Profile;
