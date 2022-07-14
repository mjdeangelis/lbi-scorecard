import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from './Header';
import { Loading } from './Loading';

function Leaderboard() {
  const [players, setPlayers] = useState([]);

  const createLeaderboard = (players) => {
    // players = new Array(players);
    const idlePlayers = players.filter((player) => player.thru === 0);
    const playersWhoStarted = players.filter((player) => player.thru > 0);
    const sortedPlayers = playersWhoStarted.sort(
      (a, b) => a.parScore - b.parScore
    );
    return [...sortedPlayers, ...idlePlayers];
  };

  const getPlayers = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}players/getTournamentPlayers/62b66f3a823df6535020cf38`
      );
      const players = await res.json();

      setPlayers(createLeaderboard(players));
    } catch (e) {
      console.error(e);
    }
  };

  // useEffect(() => {
  //   getPlayers();
  // }, []);

  useEffect(() => {
    getPlayers();
    const interval = setInterval(() => getPlayers(), 20000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (players?.length) {
    return (
      <div>
        <Header />
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
                <tr key={player._id}>
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
        <Link
          style={{
            marginTop: '15px',
            display: 'inline-block',
          }}
          to="/"
        >
          Back to home
        </Link>
      </div>
    );
  } else {
    return <Loading />;
  }
}

export default Leaderboard;
