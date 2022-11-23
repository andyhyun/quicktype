import './Game.css'
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRandomPrompt, wordStartIsSame, formatAuth0Sub } from '../../util/gameUtil'
import { useAuth0 } from '@auth0/auth0-react';

const Game = () => {
  const [gameLength, setGameLength] = useState(10);
  const [gameKey, setGameKey] = useState(true);
  const [startTime, setStartTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [phase, setPhase] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const promptEl = useRef(null);
  const tenEl = useRef(null);
  const twentyFiveEl = useRef(null);
  const fiftyEl = useRef(null);
  const oneHundredEl = useRef(null);

  const { isAuthenticated, user } = useAuth0();

  const [promptWords, promptDivs] = useMemo(() => {
    return createRandomPrompt(gameLength)
  }, [gameLength, gameKey]);

  const handleSubmit = async (data) => {
    try {
      await fetch("http://localhost:8080/api/scores", {
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

  useEffect(() => {
    if (phase === 1) {
      setStartTime(performance.now());
    } else if (phase === 2) {
      if (isAuthenticated) {
        handleSubmit({
          score: wpm,
          length: gameLength,
          userId: formatAuth0Sub(user.sub)
        });
      }
    }
  }, [phase]);

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
  }, [gameLength, gameKey]);
  
  const handleKeyDown = (e) => {
    if (phase === 0 && e.target.value.length > 0) setPhase(1);
    if (currentWordIndex >= gameLength) return;

    if (wordStartIsSame(e.target.value, promptWords[currentWordIndex])) {
      e.target.style.backgroundColor = 'white';
    } else {
      e.target.style.backgroundColor = 'red';
    }

    if ((e.key === ' ' || e.target.value.charAt(e.target.value.length - 1) === ' ') && e.target.value === '') {
      // Pressing space with nothing in text input
      e.preventDefault();
    } else if ((e.key === ' ' || e.target.value.charAt(e.target.value.length - 1) === ' ') && e.target.value.trimEnd() === promptWords[currentWordIndex]) {
      // Pressing space when word is typed correctly
      e.preventDefault();
      e.target.value = '';
      promptEl.current.children[currentWordIndex].style.color = 'lightgreen';
      setCurrentWordIndex(currentWordIndex + 1);
    } else if (
      currentWordIndex === gameLength - 1
      && promptWords[currentWordIndex] === e.target.value
    ) {
      // Handle the game ending here
      e.preventDefault();
      e.target.value = '';
      promptEl.current.children[currentWordIndex].style.color = 'lightgreen';
      setCurrentWordIndex(currentWordIndex + 1);
      setWpm(Math.round((promptWords.join(' ').length / 5) / ((performance.now() - startTime) / 60000)));
      setPhase(2);
    }
  }

  const handleChange = (e) => {
    handleRedo();
    setGameLength(parseInt(e.target.value));
  }

  const handleRedo = () => {
    setGameKey(!gameKey);
    setCurrentWordIndex(0);
    setStartTime(0);
    setWpm(0);
    setPhase(0);
  }

  return (
    <div className='game-body'>
      <div className='container' key={gameKey}>
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
        <div className='stats'>{wpm} WPM</div>
        <div ref={promptEl} className='prompt'>{promptDivs}</div>
        <div className='controls'>
          <input
            type='text'
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyDown}
            autoFocus
          />
          <button type='button' onClick={handleRedo}>redo</button>
        </div>
      </div>
    </div>
  );
}

export default Game;
