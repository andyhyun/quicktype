import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Burger from './Burger';

const Nav = styled.nav`
  width: 100%;
  height: 55px;
  border-bottom: 2px solid #f1f1f1;
  padding: 0 10px;
  background-color: #152932;
  display: flex;
  justify-content: space-between;
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 2rem;
    padding: 0 1rem;
  }
  .nav a {
    color: white;
    text-decoration: none;
    height: 100%;
    display: flex;
    align-items: center;
    padding: .25rem
}
.site-title {
    font-size: 2rem;
}
.logo {
    max-width:  50px;
    max-height: 50px;
    margin-right: .25rem;
}
`

const Navbar = () => {
  return (
    <Nav>
      <div className={"nav"}>
        <Link to={'/'} className={"site-title"}><img src="qtlogo.png" alt="logo" className={"logo"}/>QuickType</Link>
        {/* <a href={"/"} className={"site-title"}><img src="qtlogo.png" alt="logo" className={"logo"}/>QuickType</a> */}
      </div>
      <Burger />
    </Nav>
  )
}

export default Navbar
