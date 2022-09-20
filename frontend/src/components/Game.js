import React, { useState } from 'react';

const Leaderboard = () => {
  const [data, setData] = useState({
    wpm: 0,
    userId: 1
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(JSON.stringify(data));
    try {
      await fetch("http://localhost:5000/api/scores", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.error(err);
    }
  }

  const updateWpm = (value) => {
    let tempData = structuredClone(data);
    tempData.wpm = parseInt(value);
    setData(tempData);
  }

  const updateUserId = (value) => {
    let tempData = structuredClone(data);
    tempData.userId = parseInt(value);
    setData(tempData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="wpm">WPM</label>
        <input
          id="wpm"
          type="number"
          onChange={(e) => updateWpm(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="user-id">User ID</label>
        <input
          id="user-id"
          type="number"
          onChange={(e) => updateUserId(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add to database</button>
    </form>
  );
}

export default Leaderboard;
