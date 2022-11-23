import {Route} from "react-router-dom";
import Leaderboard from "./components/Leaderboard";
import Profile from "./components/Profile";
import Game from "./components/Game";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import { withAuthenticationRequired, useAuth0 } from '@auth0/auth0-react';

import './App.css';


export default function Navbar() {
    const { isLoading, error } = useAuth0();
    return <nav className="nav">
        <a href={"/"} className={"site-title"}><img src="qtlogo.png" alt="logo" className={"logo"}></img>QuickType</a>
        <ul>
            <li>
                <a href={"/leaderboard"}>Leaderboard</a>
            </li>
            <li>
                <a href={"/profile"}>Profile</a>
            </li>
            <li>
                <a href={"/game"}>Game</a>
            </li>
            <main className='column'>
        {error && <p>Authentication Error</p>}
        {!error && isLoading && <p>Loading...</p>}
        {!error && !isLoading && (
          <>
            <LoginButton />
            <LogoutButton />
          </>
        )}
      </main>
        </ul>
    </nav>
}