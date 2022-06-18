import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import logo from "./logo.png";

import { Home } from "./Home";
import Leaderboard from "./Leaderboard";
import Scorecard from "./Scorecard";

const API_URL_BASE = "http://localhost:7777/api/"; // todo: make global
export const TournamentContext = createContext({});

function App() {
  const [tournament, setTournament] = useState({}); // todo - also save tournament in localstorage

  const getTournament = async () => {
    try {
      const res = await fetch(
        `${API_URL_BASE}tournaments/getTournament/62acee1f82eee941e40ee295`
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
        <header className="app-header">
          <div className="app-logo-container">
            <img
              src={logo}
              className="app-logo"
              alt="Leroy Brown Invitational Logo"
            />
          </div>
        </header>
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
