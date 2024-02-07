import './Leaderboard.css';
import React, { useEffect, useState, useRef } from 'react';
import { setGameLengthHelper, formatAverageWpm } from '../../util/gameUtil';

const apiURL = process.env.REACT_APP_API_URL || 'https://www.quicktype.app';

const Leaderboard = () => {
  const [leaderboardKey, setLeaderboardKey] = useState(true);
  const [scores, setScores] = useState([]);
  const [gameLength, setGameLength] = useState(10);

  const tenEl = useRef(null);
  const twentyFiveEl = useRef(null);
  const fiftyEl = useRef(null);
  const oneHundredEl = useRef(null);

  const getScores = async () => {
    try {
      const response = await fetch(`${apiURL}/api/scores/${gameLength}`);
      const jsonData = await response.json();

      setScores(jsonData);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getScores();
  }, [gameLength, leaderboardKey]);

  const handleChange = (e) => {
    setLeaderboardKey(!leaderboardKey);
    setGameLength(setGameLengthHelper(e.target.value));
  }

  return (
    <div className="leaderboard-body">
      <div className="container" key={leaderboardKey}>
        <h1>Top 10 Leaderboards</h1>
        <div className="length-select">
          <div># of words:</div>
          <div className="radio-buttons">
            <div ref={tenEl}>
              <input type="radio" name="length" id="10" value="10" onChange={handleChange} />
              <label htmlFor="10" className={(gameLength === 10) ? 'active' : 'inactive'}>10</label>
            </div>
            <div ref={twentyFiveEl}>
              <input type="radio" name="length" id="25" value="25" onChange={handleChange} />
              <label htmlFor="25" className={(gameLength === 25) ? 'active' : 'inactive'}>25</label>
            </div>
            <div ref={fiftyEl}>
              <input type="radio" name="length" id="50" value="50" onChange={handleChange} />
              <label htmlFor="50" className={(gameLength === 50) ? 'active' : 'inactive'}>50</label>
            </div>
            <div ref={oneHundredEl}>
              <input type="radio" name="length" id="100" value="100" onChange={handleChange} />
              <label htmlFor="100" className={(gameLength === 100) ? 'active' : 'inactive'}>100</label>
            </div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th className="rank-col">#</th>
              <th>Username</th>
              <th>Average WPM</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, i) => (
              <tr className={(i % 2 === 0) ? 'even' : 'odd'} key={i}>
                <td key={i + 'rank'}>{i + 1}</td>
                <td key={i + 'username'}>{score.username}</td>
                <td key={i + 'avg_score'}>{formatAverageWpm(score.avg_score)}</td>
              </tr>
            ))}
            {scores.length === 0 && (
              <tr className="even">
                <td>1</td>
                <td>--</td>
                <td>--</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
