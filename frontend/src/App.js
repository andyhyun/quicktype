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
import Game from './components/Game';

const ProtectedRoute = ({ component, ...args }) => {
  const Component = withAuthenticationRequired(component, args);
  return <Component />;
};

function App() {
  const { isLoading, error } = useAuth0();
  return (
    <div>
      <Routes>
        <Route path='/' element={<div>quicktype</div>}></Route>
        <Route path='/leaderboard' element={<Leaderboard />}></Route>
        <Route path='/profile' element={<ProtectedRoute component={Profile} />}></Route>
        <Route path='/game' element={<Game />}></Route>
      </Routes>
      <main className='column'>
        <h1>QuickType Login</h1>
        {error && <p>Authentication Error</p>}
        {!error && isLoading && <p>Loading...</p>}
        {!error && !isLoading && (
          <>
            <LoginButton />
            <LogoutButton />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
