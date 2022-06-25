import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL_BASE = "http://localhost:7777/api/"; // todo: make global

function Leaderboard() {
  const [players, setPlayers] = useState([]);

  const createLeaderboard = (players) => {
    return players.sort((a, b) => b.score - a.score);
  };

  const getPlayers = async () => {
    try {
      const res = await fetch(
        `${API_URL_BASE}players/getTournamentPlayers/62acee1f82eee941e40ee295`
      );
      const players = await res.json();
      setPlayers(createLeaderboard(players));
      console.log("players", players);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getPlayers();
  }, []);

  return (
    <div className="leaderboard-container">
      <h1>Live leaderboard</h1>
      <p>
        <em>Scores updated every 20 seconds</em>
      </p>
      <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Team</th>
            <th>+/-</th>
            <th>Net</th>
            <th>Thru</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>
                <Link to={`/scorecard/${player?._id}`}>{player.name}</Link>
              </td>
              <td>
                {player.parScore > 0 && <span>+</span>}
                {player.parScore}
              </td>
              <td>{player.netScore}</td>
              <td>{player.thru}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
