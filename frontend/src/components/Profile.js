import React, { useEffect, useState } from 'react';
import {useAuth0} from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import { formatAuth0Sub } from '../util/gameUtil'

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  const [scores, setScores] = useState([]);

  const getScores = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${formatAuth0Sub(user.sub)}`);
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
    isAuthenticated && (
      <article className='column'>
        <h1>Profile</h1>
        {user?.picture && <img src={user.picture} alt={user?.name} className={"profilePic"}/>}
        <ul>
          <li >email: {user?.email}</li>
          <li>QuickType Username: {user['quicktype username']}</li>
        </ul>
        <div>
          <h2>Past Scores</h2>
          <table>
            <thead>
              <tr>
                <th>WPM</th>
                <th>Length</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score) => (
                <tr>
                  <td>{score.score}</td>
                  <td>{score.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    )
  )
}

export default Profile;
