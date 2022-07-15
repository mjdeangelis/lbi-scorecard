import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { PasswordPrompt } from './PasswordPrompt';

function Leaderboard() {
  let navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  // current team is used to display scorecard
  const [detailsShown, setDetailShown] = useState([]);

  const createLeaderboard = (players) => {
    const idlePlayers = players.filter((player) => player.thru === 0);
    const playersWhoStarted = players.filter((player) => player.thru > 0);
    const sortedPlayers = [...playersWhoStarted].sort(
      (a, b) => a.netScore - b.netScore
    );
    const sortedIdlePlayers = [...idlePlayers].sort(
      (a, b) => a.netScore - b.netScore
    );
    /* Account for possible ties */
    console.log('sortedPlayers 1', sortedPlayers);
    sortedPlayers.reduce(
      (padded, player, i) => {
        const score = player.netScore;
        const prevScore = padded[i].netScore;
        const nextScore = padded[i + 2].netScore;

        player.isTied = score === prevScore || score === nextScore;
        player.place = score === prevScore ? padded[i].place : i + 1;
        player.isToggled = false;
        return padded;
      },
      [{ netScore: null }, ...sortedPlayers, { netScore: null }]
    );
    /* Sort idle players - note that we added sortedPlayers.length to place to account for already ranked players */
    sortedIdlePlayers.reduce(
      (padded, player, i) => {
        const score = player.netScore;
        const prevScore = padded[i].netScore;
        const nextScore = padded[i + 2].netScore;

        player.isTied = score === prevScore || score === nextScore;
        player.place =
          score === prevScore ? padded[i].place : sortedPlayers.length + i + 1;
        player.isToggled = false;
        return padded;
      },
      [{ netScore: null }, ...sortedIdlePlayers, { netScore: null }]
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

  const togglePlayerScorecard = (userId) => {
    const shownState = detailsShown.slice();
    const index = shownState.indexOf(userId);
    if (index >= 0) {
      shownState.splice(index, 1);
      setDetailShown(shownState);
    } else {
      shownState.push(userId);
      setDetailShown(shownState);
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
          <p>
            <em>*Not Official - Hand in physical scorecard after round*</em>
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
                <React.Fragment key={player._id}>
                  <tr>
                    <td>
                      {player.isTied && <span>T</span>}
                      {player.place}
                    </td>
                    <td>
                      <button
                        className="btn-link"
                        onClick={() => togglePlayerScorecard(player._id)}
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
                  {/* Team scorecard */}
                  {detailsShown.includes(player._id) && (
                    <React.Fragment>
                      <tr>
                        <td className="player-scorecard-container">
                          <table
                            key={`scoredcard_${player._id}`}
                            className="player-scorecard-table"
                          >
                            <thead>
                              <tr>
                                <th></th>
                                <th>1</th>
                                <th>2</th>
                                <th>3</th>
                                <th>4</th>
                                <th>5</th>
                                <th>6</th>
                                <th>7</th>
                                <th>8</th>
                                <th>9</th>
                                <th>10</th>
                                <th>11</th>
                                <th>12</th>
                                <th>13</th>
                                <th>14</th>
                                <th>15</th>
                                <th>16</th>
                                <th>17</th>
                                <th>18</th>
                                <th>{null}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {player.players.map(
                                (indPlayer, indPlayerIndex) => (
                                  <tr
                                    key={`scoredcard_${player._id}_${indPlayerIndex}`}
                                  >
                                    <td>{indPlayer.name}</td>
                                    {player.scorecard.map((hole, index) => (
                                      <td
                                        key={`scoredcard_${player._id}_${indPlayerIndex}_${index}`}
                                      >
                                        {hole.scores[indPlayerIndex]}
                                      </td>
                                    ))}
                                    <td>
                                      {player.scorecard.reduce(
                                        (total, hole) =>
                                          total + hole.scores[indPlayerIndex],
                                        0
                                      )}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </React.Fragment>
                  )}
                  {detailsShown.includes(player._id) && (
                    <tr>
                      <td className="editTeam">
                        <button
                          className="btn-link"
                          onClick={() => setCurrentPlayer(player)}
                        >
                          Edit team
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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
