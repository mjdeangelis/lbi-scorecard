import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { PasswordPrompt } from './PasswordPrompt';

function Leaderboard() {
  let navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const createLeaderboard = (players) => {
    const idlePlayers = players.filter((player) => player.thru === 0);
    const playersWhoStarted = players.filter((player) => player.thru > 0);
    const sortedPlayers = playersWhoStarted.sort(
      (a, b) => a.netScore - b.netScore
    );
    const sortedIdlePlayers = idlePlayers.sort(
      (a, b) => a.netScore - b.netScore
    );
    return [...sortedPlayers, ...sortedIdlePlayers];
  };

  const getPlayers = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}players/getTournamentPlayers/62d06d5b22205616a2c67323`
      );
      const players = await res.json();

      setPlayers(createLeaderboard(players));
    } catch (e) {
      console.error(e);
    }
  };

  const navigateToPlayer = (id) => {
    navigate(`/scorecard/${id}`);
  };

  const handlePasswordPromptChange = (player, result) => {
    setShowPasswordPrompt(false);
    window.localStorage.setItem(player._id, result);
    if (result) {
      navigateToPlayer(player._id);
    } else if (result === null) {
      setCurrentPlayer({});
    } else {
      setCurrentPlayer({});
      alert('Incorrect password. Try again.');
    }
  };

  useEffect(() => {
    if (currentPlayer._id) {
      // decide if we need to show prompt here
      const passwordHasBeenEntered = window.localStorage.getItem(
        currentPlayer._id
      );
      console.log('Password has been entered?', passwordHasBeenEntered);
      if (passwordHasBeenEntered == 'true') {
        navigateToPlayer(currentPlayer._id);
      } else {
        setShowPasswordPrompt(true);
      }
    }
  }, [currentPlayer]);

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
        {showPasswordPrompt && (
          <PasswordPrompt
            player={currentPlayer}
            handleChange={handlePasswordPromptChange}
          />
        )}
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
                <th>Gross</th>
                <th>Strokes</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={player._id}>
                  <td>{index + 1}</td>
                  <td>
                    <button
                      className="btn-link"
                      onClick={() => setCurrentPlayer(player)}
                    >
                      {player.name}
                    </button>
                  </td>
                  <td>{player.totalScore}</td>
                  <td>
                    {player.handicap > 0 && <span>-</span>} {player.handicap}
                  </td>
                  <td>{player.netScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br />
        <br />
        <Link to="/">Back to home</Link>
        <br />
        <br />
      </div>
    );
  } else {
    return null;
  }
}

export default Leaderboard;
