import React, { useState, useEffect } from "react";

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
    <div>
      <h1>Live leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Team</th>
            <th>Gross Score</th>
            <th>Net Score</th>
            <th>Thru</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr>
              <td>{player.position}</td>
              <td>{player.name}</td>
              <td>IDK</td>
              <td>IDK</td>
              <td>0</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
