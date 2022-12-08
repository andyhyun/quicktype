import './Profile.css';
import React, { useEffect, useState } from 'react';
import {useAuth0} from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import { formatAuth0Sub, formatAverageWpm } from '../../util/gameUtil';

const apiURL = process.env.REACT_APP_API_URL || 'https://www.quicktype.app';

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  const [averageScores, setAverageScores] = useState([]);
  const [scores, setScores] = useState([]);

  const getScores = async () => {
    try {
      const response = await fetch(`${apiURL}/api/users/${formatAuth0Sub(user.sub)}`);
      const jsonData = await response.json();

      setAverageScores(jsonData[0]);
      setScores(jsonData[1]);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getScores();
  }, []);

  return (
    isAuthenticated && (
      <div className="profile-body">
        <div className="container">
          <h1>Profile</h1>
          <div className="user-info">
            {user?.picture && <img src={user.picture} alt={user?.name} className="profilePic"/>}
            <ul>
              <li className="username">{user['quicktype username']}</li>
              <li>{user?.email}</li>
            </ul>
          </div>
          <div>
            <h2>Average Scores</h2>
            <table>
              <thead>
                <tr>
                  <th>Average WPM</th>
                  <th># of words</th>
                </tr>
              </thead>
              <tbody>
                {averageScores.map((averageScore, i) => (
                  <tr className={(i % 2 === 0) ? 'even' : 'odd'} key={i + 'average'}>
                    <td key={i + 'avg_score'}>{formatAverageWpm(averageScore.avg_score)}</td>
                    <td key={i + 'avg_length'}>{averageScore.length}</td>
                  </tr>
                ))}
                {averageScores.length === 0 && (
                  <tr className={'even'}>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Recent Scores</h2>
            <table>
              <thead>
                <tr>
                  <th>WPM</th>
                  <th># of words</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, i) => (
                  <tr className={(i % 2 === 0) ? 'even' : 'odd'} key={i + 'recent'}>
                    <td key={i + 'score'}>{score.score}</td>
                    <td key={i + 'length'}>{score.length}</td>
                  </tr>
                ))}
                {scores.length === 0 && (
                  <tr className={'even'}>
                    <td>--</td>
                    <td>--</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  )
}

export default Profile;
