import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { TournamentContext } from "./App";
import icon from "./golf-icon.png";

export function PlayersList() {
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState({});
  const tournament = useContext(TournamentContext);

  const getPlayers = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}players/getTournamentPlayers/62b66f3a823df6535020cf38`
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
  }, [tournament]);

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
