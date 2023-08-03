import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { TournamentContext } from '../App';
import { PasswordPrompt } from './PasswordPrompt';

function Leaderboard() {
  let navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  // current team is used to display scorecard
  const [detailsShown, setDetailShown] = useState([]);
  const tournament = useContext(TournamentContext);

  const createLeaderboard = (players) => {
    const idlePlayers = players.filter((player) => player.thru === 0);
    const playersWhoStarted = players.filter((player) => player.thru > 0);
    const sortedPlayers = [...playersWhoStarted].sort(
      (a, b) => a.parScore - b.parScore
    );
    const sortedIdlePlayers = [...idlePlayers].sort(
      (a, b) => a.parScore - b.parScore
    );
    /* Account for possible ties */
    console.log('sortedPlayers 1', sortedPlayers);
    sortedPlayers.reduce(
      (padded, player, i) => {
        const score = player.parScore;
        const prevScore = padded[i].parScore;
        const nextScore = padded[i + 2].parScore;

        player.isTied = score === prevScore || score === nextScore;
        player.place = score === prevScore ? padded[i].place : i + 1;
        player.isToggled = false;
        return padded;
      },
      [{ parScore: null }, ...sortedPlayers, { parScore: null }]
    );
    /* Sort idle players - note that we added sortedPlayers.length to place to account for already ranked players */
    sortedIdlePlayers.reduce(
      (padded, player, i) => {
        const score = player.parScore;
        const prevScore = padded[i].parScore;
        const nextScore = padded[i + 2].parScore;

        player.isTied = score === prevScore || score === nextScore;
        player.place =
          score === prevScore ? padded[i].place : sortedPlayers.length + i + 1;
        player.isToggled = false;
        return padded;
      },
      [{ parScore: null }, ...sortedIdlePlayers, { parScore: null }]
    );
    return [...sortedPlayers, ...sortedIdlePlayers];
  };

  const getPlayers = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}players/getTournamentPlayers/64c9aa773c7e801258a27a7a`
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
          <h1>Live Leaderboard</h1>
          <p className="white-text">
            <em>Scores updated every 20 seconds</em>
          </p>
          <p className="white-text">
            <strong>
              <em>*Unofficial - hand in physical scorecard after round*</em>
            </strong>
          </p>
          {/* <Link to="/">Back to home</Link>
          <br />
          <br /> */}
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Team</th>
                <th>Net</th>
                <th>Gross</th>
                <th>Thru</th>
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
                    <td>
                      {player.parScore > 0 && <span>+</span>}{' '}
                      {player.parScore === 0 ? 'E' : player.parScore}
                    </td>
                    <td>{player.totalScore}</td>
                    <td>
                      {player.thru}
                      {/* {player.handicap > 0 && <span>-</span>} {player.handicap} */}
                    </td>
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
                                <th>TOT</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="par-row">
                                <td>Par</td>
                                {tournament.holes.map((hole) => (
                                  <td key={`hole${hole.hole}`}>{hole.par}</td>
                                ))}
                                <td>{null}</td>
                              </tr>
                              <tr key={`scoredcard_${player._id}`}>
                                <td>{player.name}</td>
                                {player.scorecard.map((hole, index) => (
                                  <td key={`scoredcard_${player._id}_${index}`}>
                                    {hole.teamScore}
                                  </td>
                                ))}
                                <td>
                                  {player.scorecard.reduce(
                                    (total, hole) => total + hole.teamScore,
                                    0
                                  )}
                                </td>
                              </tr>
                              {/* {player.players.map(
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
                              )} */}
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
                          Edit team &gt;
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {/* <br />
        <br />
        <Link to="/">Back to home</Link>
        <br />
        <br /> */}
      </div>
    );
  } else {
    return null;
  }
}

export default Leaderboard;
