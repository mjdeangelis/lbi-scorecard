import React, { useState, useEffect, createContext } from 'react';
import {
  BrowserRouter as Router,
  // Routes,
  // Route,
  // useLocation,
} from 'react-router-dom';

import './App.css';
import logo from './logo-min.png';

// import { Home } from "./Home";
// import Leaderboard from "./Leaderboard";
// import Scorecard from "./Scorecard";
import Main from './Main';

export const TournamentContext = createContext({});
export const LoadingContext = createContext(false);

function App() {
  const [tournament, setTournament] = useState({}); // todo - also save tournament in localstorage

  const getTournament = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}tournaments/getTournament/62d06d5b22205616a2c67323`
      );
      const tournament = await res.json();
      setTournament(tournament);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getTournament();
  }, []);

  return (
    <div className="app">
      <div className="container">
        <TournamentContext.Provider value={tournament}>
          <Router>
            <Main />
            {/* <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/scorecard/:id" element={<Scorecard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes> */}
          </Router>
        </TournamentContext.Provider>
      </div>
    </div>
  );
}

export default App;
