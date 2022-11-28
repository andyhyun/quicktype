import React from 'react';
import styled from 'styled-components';
import {Route} from "react-router-dom";
import Leaderboard from "../Leaderboard";
import Profile from "../Profile";
import Game from "../Game/Game";
import LoginButton from "../LoginButton";
import LogoutButton from "../LogoutButton";
import { withAuthenticationRequired, useAuth0 } from '@auth0/auth0-react';

const Ul = styled.ul`
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  li {
    padding: 18px 10px;
  }
  a {
    color: inherit;
    text-decoration: none;
    height: 100%;
    display: flex;
    align-items: center;
    padding: .25rem
}

  @media (max-width: 768px) {
    flex-flow: column nowrap;
    background-color: #0D2538;
    position: fixed;
    transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(100%)'};
    top: 0;
    right: 0;
    height: 100vh;
    width: 300px;
    padding-top: 3.5rem;
    transition: transform 0.3s ease-in-out;
    li {
      color: #fff;
    }
  }
`;

const RightNav = ({ open }) => {
   const { isLoading, error } = useAuth0();
    return (
    <Ul open={open}>
        <li><a href={"/"}>Home</a></li>
      <li><a href={"/leaderboard"}>Leaderboard</a></li>
      <li><a href={"/profile"}>Profile</a></li>
      <li><a href={"/game"}>Game</a></li>
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
    </Ul>
  )
}

export default RightNav