import React, { useState, useEffect, createContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { useTransition, animated } from 'react-spring';

import './App.css';
import logo from './logo.png';

import { Home } from './Home';
import Leaderboard from './Leaderboard';
import Scorecard from './Scorecard';

function Main() {
  // let location = useLocation();

  // const transitions = useTransition(location, {
  //   from: { position: 'absolute', opacity: 0 },
  //   enter: { opacity: 1 },
  //   leave: { opacity: 0 },
  // });

  // useEffect(() => {
  //   console.log('location', location);
  // }, [location]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scorecard/:id" element={<Scorecard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </div>
  );
}

export default Main;
