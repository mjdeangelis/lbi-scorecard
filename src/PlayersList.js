import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import icon from "./golf-icon.png";

const API_URL_BASE = "http://localhost:7777/api/"; // todo: make global

export function PlayersList() {
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState({});

  const getPlayers = async () => {
    try {
      const res = await fetch(
        `${API_URL_BASE}players/getTournamentPlayers/62acee1f82eee941e40ee295`
      );
      const players = await res.json();
      setPlayers(players);
      console.log("players", players);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getPlayers();
  }, []);

  return (
    <div>
      <p className="intro-text">
        Select the golfer you are keeping score for,
        <br /> and tap the Tee Off button
      </p>
      <Link className="btn btn-teeoff" to={`/scorecard/${currentPlayer?._id}`}>
        <img src={icon} className="btn-icon" alt="Golf icon" />
        Tee Off
      </Link>
      <div className="golfers">
        <h2>Golfers</h2>
        <ul className="unstyled-list player-list">
          {players?.map((player) => (
            <li>
              <label className="radio-container">
                {player.name}
                <input
                  type="radio"
                  name="player"
                  value={player.name}
                  id={player._id}
                  onClick={() => setCurrentPlayer(player)}
                />
                <span className="checkmark"></span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
