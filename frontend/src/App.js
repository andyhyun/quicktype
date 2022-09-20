import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import Game from './components/Game';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/leaderboard' element={<Leaderboard />}></Route>
        <Route path='/profile/:id' element={<Profile />}></Route>
        <Route path='/game' element={<Game />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
