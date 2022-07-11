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
  let location = useLocation();

  // const transitions = useTransition(location, {
  //   from: { position: 'absolute', opacity: 0 },
  //   enter: { opacity: 1 },
  //   leave: { opacity: 0 },
  // });

  const transitions = useTransition(location, {
    from: { opacity: 0, transform: 'translate(100%, 0)' },
    enter: { opacity: 1, transform: 'translate(0, 0)' },
    leave: { opacity: 0, transform: 'translate(-100%, 0)' },
    delay: 200,
  });

  useEffect(() => {
    console.log('location', location);
  }, [location]);

  return (
    <div>
      {transitions(
        (props, item) =>
          item && (
            <animated.div className="transitionRouteContainer" style={props}>
              <Routes location={item}>
                <Route path="/" element={<Home />} />
                <Route path="/scorecard/:id" element={<Scorecard />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Routes>
            </animated.div>
          )
      )}
    </div>
  );
}

export default Main;
