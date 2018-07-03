import React from 'react';

// simple function navbar component for now
const NavBar = () => {
  return (
    <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
      <a className="navbar-brand col-sm-3 col-md-2 mr-0">Assignment</a>
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap">
          <a className="nav-link">Sign out</a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
