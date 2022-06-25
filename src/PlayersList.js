import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { TournamentContext } from "./App";
import icon from "./golf-icon.png";

export function PlayersList({ players }) {
  const [currentPlayer, setCurrentPlayer] = useState({});
  const tournament = useContext(TournamentContext);

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
            <li key={player._id}>
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
