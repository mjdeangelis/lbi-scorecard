import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import homeIcon from 'icons/home.svg';
import leaderboardIcon from 'icons/award.svg';
import scorecardIcon from 'icons/scorecard.svg';

export function Nav() {
  return (
    <footer className="app-footer">
      <div className="footer-icons">
        <NavLink className="footer-link" to="/">
          <img src={homeIcon} />
          Home
        </NavLink>
        <NavLink className="footer-link" to="/scorecard">
          <img src={scorecardIcon} />
          Scorecard
        </NavLink>
        <NavLink className="footer-link" to="/leaderboard">
          <img src={leaderboardIcon} />
          Leaderboard
        </NavLink>
      </div>
    </footer>
  );
}
