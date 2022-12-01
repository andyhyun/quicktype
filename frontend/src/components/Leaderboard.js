import React, { useEffect, useState, useRef } from 'react';

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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/scores/${gameLength}`);
      const jsonData = await response.json();

      setScores(jsonData);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getScores();
  }, [gameLength, leaderboardKey]);

  useEffect(() => {
    switch (gameLength) {
      case 25:
        twentyFiveEl.current.style.backgroundColor = 'lightgray';
        break;
      case 50:
        fiftyEl.current.style.backgroundColor = 'lightgray';
        break;
      case 100:
        oneHundredEl.current.style.backgroundColor = 'lightgray';
        break;
      default:
        tenEl.current.style.backgroundColor = 'lightgray';
    }
  }, [gameLength, leaderboardKey]);

  const handleChange = (e) => {
    setLeaderboardKey(!leaderboardKey);
    setGameLength(parseInt(e.target.value));
  }

  return (
    <div key={leaderboardKey}>
      <h1>Leaderboard</h1>
      <div className='radio-buttons'>
        <div ref={tenEl}>
          <input type='radio' name='length' id='10' value='10' onChange={handleChange} />
          <label htmlFor='10'>10</label>
        </div>
        <div ref={twentyFiveEl}>
          <input type='radio' name='length' id='25' value='25' onChange={handleChange} />
          <label htmlFor='25'>25</label>
        </div>
        <div ref={fiftyEl}>
          <input type='radio' name='length' id='50' value='50' onChange={handleChange} />
          <label htmlFor='50'>50</label>
        </div>
        <div ref={oneHundredEl}>
          <input type='radio' name='length' id='100' value='100' onChange={handleChange} />
          <label htmlFor='100'>100</label>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>WPM</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, i) => (
            <tr key={i}>
              <td key={i + 'username'}>{score.username}</td>
              <td key={i + 'avg_score'}>{score.avg_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
