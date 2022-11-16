import React, { useEffect, useState } from 'react';
import {useAuth0} from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  // const { id } = useParams();
  const { user, isAuthenticated } = useAuth0();

  // const [scores, setScores] = useState([]);

  // const getScores = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/scores/${id}`);
  //     const jsonData = await response.json();

  //     setScores(jsonData);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // useEffect(() => {
  //   getScores();
  // }, []);

  return (
    isAuthenticated && (

      <article className='column'>
          <h1>Profile</h1>
        {user?.picture && <img src={user.picture} alt={user?.name} />}
        <ul>
             <li >email: {user?.email}</li>
             <li>QuickType Username: {user['quicktype username']}</li>
        </ul>
        <div>
          <h2>Past Scores</h2>
          {/* <table>
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
          </table> */}
        </div>
      </article>
    )
  )
}

export default Profile;
