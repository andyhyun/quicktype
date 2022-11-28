import {Route} from "react-router-dom";
import Leaderboard from "./components/Leaderboard";
import Profile from "./components/Profile";
import Game from "./components/Game/Game";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import { withAuthenticationRequired, useAuth0 } from '@auth0/auth0-react';
import React, {useState, useEffect} from 'react'
import './App.css';


export default function Navbar() {
    const { isLoading, error } = useAuth0();
    const [toggleMenu, setToggleMenu] = useState(false)
    const toggleNav = () => {
    setToggleMenu(!toggleMenu)
  }
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    useEffect(() => {

    const changeWidth = () => {
      setScreenWidth(window.innerWidth);
    }

    window.addEventListener('resize', changeWidth)
    return () => {
        window.removeEventListener('resize', changeWidth)
    }
  }, [])
    return <nav className="nav">

        <a href={"/"} className={"site-title"}><img src="qtlogo.png" alt="logo" className={"logo"}/>QuickType</a>
        {(toggleMenu || screenWidth > 500) && (
        <ul className={"links"}>
            <li className={"items"}><a href={"/leaderboard"}>Leaderboard</a></li>
            <li className={"items"}><a href={"/profile"}>Profile</a></li>
                <li className={"items"}><a href={"/game"}>Game</a></li>
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
        </ul>)}
     <button onClick={toggleNav} className="btn">BTN</button>
    </nav>
}