import logo from './logo.svg';
import './App.css';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import { withAuthenticationRequired, useAuth0 } from '@auth0/auth0-react';
import {
  Routes,
  Route
} from 'react-router-dom';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import Game from './components/Game/Game';
import Navbar from './components/Nav/Navbar';
import { formatAuth0Sub } from './util/gameUtil';
import { useEffect } from 'react';

const apiURL = process.env.REACT_APP_API_URL || 'https://www.quicktype.app';

const ProtectedRoute = ({ component, ...args }) => {
  const Component = withAuthenticationRequired(component, args);
  return <Component />;
};

function App() {
  const { isLoading, error, user, isAuthenticated } = useAuth0();
  
  const handleSubmit = async (data) => {
    try {
      await fetch(`${apiURL}/api/users`, {
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
    if (isAuthenticated) {
      handleSubmit([{
        username: user['quicktype username'],
        userId: formatAuth0Sub(user.sub)
      }]);
    }
  }, [isAuthenticated]);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={<div>quicktype</div>}></Route>
        <Route path='/leaderboard' element={<Leaderboard />}></Route>
        <Route path='/profile' element={<ProtectedRoute component={Profile} />}></Route>
        <Route path='/game' element={<Game />}></Route>
      </Routes>
    </div>
  );
}

export default App;
