import './Game.css'
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRandomPrompt, wordStartIsSame, formatAuth0Sub, setGameLengthHelper } from '../../util/gameUtil'
import { useAuth0 } from '@auth0/auth0-react';

const apiURL = process.env.REACT_APP_API_URL || 'https://www.quicktype.app';

const Game = () => {
  const [gameLength, setGameLength] = useState(setGameLengthHelper(localStorage.getItem('gameLength')));
  const [gameKey, setGameKey] = useState(true);
  const [startTime, setStartTime] = useState(0);
  const [wpm, setWpm] = useState('--');
  const [phase, setPhase] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const promptEl = useRef(null);

  const { loginWithRedirect, isLoading, isAuthenticated, user } = useAuth0();

  const [promptWords, promptDivs] = useMemo(() => {
    return createRandomPrompt(gameLength)
  }, [gameLength, gameKey]);

  const handleSubmit = async (data) => {
    try {
      await fetch(`${apiURL}/api/scores`, {
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
  
  const handleKeyDown = (e) => {
    if (phase === 0 && e.target.value.length > 0) setPhase(1);
    if (currentWordIndex >= gameLength) return;

    if (wordStartIsSame(e.target.value, promptWords[currentWordIndex])) {
      e.target.style.backgroundColor = 'white';
    } else {
      e.target.style.backgroundColor = '#eb3d7c';
    }

    if (
      currentWordIndex === gameLength - 1
      && promptWords[currentWordIndex] === e.target.value.trimEnd()
    ) {
      // Handle the game ending here
      e.preventDefault();
      e.target.value = '';
      promptEl.current.children[currentWordIndex].style.color = '#58f558';
      setCurrentWordIndex(currentWordIndex + 1);
      setWpm(Math.round((promptWords.join(' ').length / 5) / ((performance.now() - startTime) / 60000)));
      setPhase(2);
    } else if ((e.key === ' ' || e.target.value.charAt(e.target.value.length - 1) === ' ') && e.target.value === '') {
      // Pressing space with nothing in text input
      e.preventDefault();
    } else if ((e.key === ' ' || e.target.value.charAt(e.target.value.length - 1) === ' ') && e.target.value.trimEnd() === promptWords[currentWordIndex]) {
      // Pressing space when word is typed correctly
      e.preventDefault();
      e.target.value = '';
      promptEl.current.children[currentWordIndex].style.color = '#58f558';
      setCurrentWordIndex(currentWordIndex + 1);
    }
  }

  const handleChange = (e) => {
    handleRedo();
    setGameLength(setGameLengthHelper(e.target.value));
    localStorage.setItem('gameLength', setGameLengthHelper(e.target.value));
  }

  const handleRedo = () => {
    setGameKey(!gameKey);
    setCurrentWordIndex(0);
    setStartTime(0);
    setWpm('--');
    setPhase(0);
  }

  return (
    <div className='game-body'>
      <div className='container' key={gameKey}>
        {!isLoading && !isAuthenticated && (
          <div className="message"><span onClick={() => loginWithRedirect()}>Sign in</span> or <span onClick={() => loginWithRedirect()}>register</span> to record your scores and compete on the leaderboards!</div>
        )}
        <div className='top-bar'>
          <div className='length-select'>
            <div># of words:</div>
            <div className='radio-buttons'>
              <div>
                <input type='radio' name='length' id='10' value='10' onChange={handleChange} />
                <label htmlFor='10' className={(gameLength === 10) ? 'active' : 'inactive'}>10</label>
              </div>
              <div>
                <input type='radio' name='length' id='25' value='25' onChange={handleChange} />
                <label htmlFor='25' className={(gameLength === 25) ? 'active' : 'inactive'}>25</label>
              </div>
              <div>
                <input type='radio' name='length' id='50' value='50' onChange={handleChange} />
                <label htmlFor='50' className={(gameLength === 50) ? 'active' : 'inactive'}>50</label>
              </div>
              <div>
                <input type='radio' name='length' id='100' value='100' onChange={handleChange} />
                <label htmlFor='100' className={(gameLength === 100) ? 'active' : 'inactive'}>100</label>
              </div>
            </div>
          </div>
          <div className='stats'>{wpm} WPM</div>
        </div>
        <div className='typing-area'>
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
    </div>
  );
}

export default Game;
