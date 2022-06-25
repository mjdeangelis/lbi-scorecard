import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import logo from "./logo.png";

import { Home } from "./Home";
import Leaderboard from "./Leaderboard";
import Scorecard from "./Scorecard";

export const TournamentContext = createContext({});
export const LoadingContext = createContext(false);

function App() {
  const [tournament, setTournament] = useState({}); // todo - also save tournament in localstorage

  const getTournament = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}tournaments/getTournament/62b66f3a823df6535020cf38`
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
      <div className="background-overlay"></div>
      <div className="container">
        <TournamentContext.Provider value={tournament}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/scorecard/:id" element={<Scorecard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </Router>
        </TournamentContext.Provider>
      </div>
    </div>
  );
}

export default App;
