import { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { TournamentContext } from '../App';
import { Header } from './Header';
import { useSpring, useTransition, animated } from 'react-spring';
import { PlayersList } from './PlayersList';

import PullToRefresh from 'pulltorefreshjs';

const ptr = PullToRefresh.init({
  mainElement: 'body',
  onRefresh() {
    window.location.reload();
  },
});

/* todo
 * Figure out how to store hole/course data globally (figuring out par on each hole)
 */
function Scorecard() {
  const { id } = useParams();
  let navigate = useNavigate();
  // const [isTeamScore, setIsTeamScore] = useState({});
  const isTeamScore = true;
  const [players, setPlayers] = useState({});
  const [player, setPlayer] = useState({});
  const [hasCurrentPlayer, setHasCurrentPlayer] = useState({});
  const [currentHole, setCurrentHole] = useState(null);
  const [newScores, setNewScores] = useState(null);
  const [isDoneLoading, setIsDoneLoading] = useState(false);
  const [logoShouldStop, setLogoShouldStop] = useState(false);
  const tournament = useContext(TournamentContext);

  useEffect(() => {
    console.log('getting player in local storage..');
    const currentPlayerInLocalStorage =
      window.localStorage.getItem('currentPlayer');
    if (currentPlayerInLocalStorage) {
      setHasCurrentPlayer(true);
      // todo: getPlayerDetails is being called twice
      console.log(
        'currentPlayerInLocalStorage!!!',
        currentPlayerInLocalStorage
      );
      getPlayerDetails(currentPlayerInLocalStorage);
    } else {
      getPlayers();
      setHasCurrentPlayer(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      getPlayerDetails(id);
    }
  }, [id]);

  useEffect(() => {
    console.log('currentHole updated.', currentHole);
    if (currentHole) {
      if (isTeamScore) {
        handleSetNewScores(player?.scorecard[currentHole - 1]?.teamScore);
      } else {
        handleSetNewScores(player?.scorecard[currentHole - 1]?.scores);
      }
      updateCurrentHole(currentHole);
    }
  }, [currentHole]);

  useEffect(() => {
    console.log('newScores changed', newScores);
    const isEmptyScore =
      (isTeamScore && newScores === 0) ||
      (!isTeamScore && newScores.every((item) => item === 0));
    const hasNullOrZeroScore =
      (isTeamScore && hasNullOrEmptyOrZero(newScores)) ||
      (!isTeamScore &&
        newScores.filter((item) => hasNullOrEmptyOrZero(item)).length);
    console.log('isEmptyScore', isEmptyScore);
    console.log('hasNullOrZeroScore', hasNullOrZeroScore);
    if (!isEmptyScore && !hasNullOrZeroScore) {
      console.log('Updated score.');
      updatePlayerScore(newScores, tournament?.holes[currentHole - 1].par);
    } else {
      console.log('Empty score.');
    }
  }, [newScores]);

  const hasNullOrEmptyOrZero = (input) => {
    return input === null || input === '' || input === 0;
  };

  const getPlayers = async () => {
    console.log('getPlayers()');
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}players/getTournamentPlayers/66a5971d57a98add4e0e1466`
      );
      const players = await res.json();
      setPlayers(players);
      // setArePlayersLoaded(true);
    } catch (e) {
      console.error(e);
    }
  };

  const getPrevHole = (currentHole) =>
    currentHole - 1 < 1 ? 18 : currentHole - 1;

  const getNextHole = (currentHole) => {
    return currentHole + 1 > 18 ? 1 : currentHole + 1;
  };

  const validateScores = async (callback, nextHole) => {
    const hasEmptyScore =
      (isTeamScore && hasNullOrEmptyOrZero(newScores)) ||
      (!isTeamScore &&
        newScores.filter((score) => hasNullOrEmptyOrZero(score)).length);
    // Deleo message
    if (
      player.name === 'Deleo/Blake' &&
      ((!isTeamScore &&
        newScores[0] - tournament?.holes[currentHole - 1]?.par >= 1) ||
        (isTeamScore &&
          newScores - tournament?.holes[currentHole - 1]?.par >= 1))
    ) {
      alert('JACKASSES');
    }
    // Pos new crew message
    else if (
      player.name === 'Kohler/Gibson' &&
      ((!isTeamScore &&
        newScores[0] - tournament?.holes[currentHole - 1]?.par >= 1) ||
        (isTeamScore &&
          newScores - tournament?.holes[currentHole - 1]?.par >= 1))
    ) {
      alert('Thought you guys were pros?');
    }
    // Snowman message
    else if (
      (isTeamScore &&
        newScores === 8 &&
        tournament?.holes[currentHole - 1]?.par === 4) ||
      (!isTeamScore &&
        newScores.includes(8) &&
        tournament?.holes[currentHole - 1]?.par === 4)
    ) {
      alert('☃️');
    }
    // Generic bogey message
    else if (
      (!isTeamScore &&
        newScores[0] - tournament?.holes[currentHole - 1]?.par >= 1) ||
      (isTeamScore && newScores - tournament?.holes[currentHole - 1]?.par >= 1)
    ) {
      alert('Yikes 😬');
    }

    // Generic birdie message
    else if (
      (!isTeamScore &&
        newScores[0] - tournament?.holes[currentHole - 1]?.par === -1) ||
      (isTeamScore &&
        newScores - tournament?.holes[currentHole - 1]?.par === -1)
    ) {
      alert('🐦');
    }

    // Generic eagle message
    else if (
      (!isTeamScore &&
        newScores[0] - tournament?.holes[currentHole - 1]?.par === -2) ||
      (isTeamScore &&
        newScores - tournament?.holes[currentHole - 1]?.par === -2)
    ) {
      alert('🦅');
    }

    if (hasEmptyScore) {
      const text =
        'You have an empty score. Are you sure you want to go to next hole?';
      if (window.confirm(text) === true) {
        // Even though we have a 0 score here, player confirmed
        // so we save in db and go to the next hole
        await updatePlayerScore(
          newScores,
          tournament?.holes[currentHole - 1].par
        );
        callback(nextHole);
      } else {
        return;
      }
    } else {
      callback(nextHole);
    }
  };

  /* If empty score is given, set it as 0  */
  const handleScoreOnBlur = (newScore, i = null) => {
    // todo: teamscore
    if (newScore === '' || newScore === 0) {
      handleSetNewScores(0, i);
    }
  };

  /* If score is 0 before focus, clear it for user  */
  const handleScoreOnFocus = (newScore, i = null) => {
    console.log('handleScoreOnFocus', newScore);
    // todo: teamscore
    if (newScore == 0) {
      console.log('zero score');
      handleSetNewScores('', i);
    }
  };

  const handleSetNewScores = (newScore, i = null) => {
    const re = /^[0-9\b]+$/;

    // // Check if this is just a team score
    // if (isTeamScore) {
    //   setNewScores(newScore);
    //   return;
    // }

    // If we don't pass an index, we're updating both scores or single team score
    if (i === null) {
      setNewScores(newScore);
      return;
    }

    if (newScore !== '' && newScore !== null) {
      newScore = Number(newScore);
    }

    if (newScore === '' || re.test(newScore)) {
      // Update only one score
      setNewScores(newScores.map((score, j) => (j === i ? newScore : score)));
    }
  };

  const getPlayerDetails = async (id) => {
    console.log('getPlayerDetails()', id);
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/players/details/${id}`
    );
    const newPlayer = await res.json();

    setPlayer(newPlayer);
    setCurrentHole(newPlayer.currentHole);
    setIsDoneLoading(true);
  };

  const updateCurrentHole = async (newHole) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: player._id, currentHole: newHole }),
    };
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/players/updateHole`,
      requestOptions
    );
    const data = await response.json();
    setPlayer(data);
  };

  const updatePlayerScore = async (newScores, par) => {
    console.log('updatePlayerScore()', newScores, par);
    let endpointUrl = isTeamScore ? 'updateTeamScore' : 'updateScore';
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: player._id, currentHole, newScores, par }),
    };

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/players/${endpointUrl}`,
      requestOptions
    );
    const data = await response.json();
    setPlayer(data);
  };

  const logoStyles = useSpring({
    loop: true,
    from: { rotateZ: 0 },
    to: { rotateZ: 360 },
    cancel: logoShouldStop,
    onRest: () => setLogoShouldStop(isDoneLoading),
  });

  // const transitions = useTransition(isDoneLoading, {
  //   from: { opacity: 1, transform: 'translate(100%, 0)' },
  //   enter: { opacity: 1, transform: 'translate(0, 0)' },
  //   leave: { opacity: 1, transform: 'translate(-100%, 0)' },
  //   delay: 200,
  // });

  if (!hasCurrentPlayer) {
    return <PlayersList players={players} />;
  } else if (tournament?.name && player?.name) {
    return (
      <div>
        <animated.div style={logoStyles}>
          <Header />
        </animated.div>
        <div className="scorecard-header">
          <button
            className="nav-btn"
            onClick={() => setCurrentHole(getPrevHole(currentHole))}
          >
            &lt; Hole {getPrevHole(currentHole)}
            {/* <br />({tournament?.holes[getPrevHole(currentHole) - 1]?.alias}) */}
          </button>
          <div className="hole-info">
            <p className="hole-number">
              Hole {currentHole}
              {/* <br />({tournament?.holes[currentHole - 1]?.alias}) */}
            </p>
            <p className="hole-par">
              Par {tournament?.holes[currentHole - 1]?.par} &#8226;{' '}
              {tournament?.holes[currentHole - 1]?.yards} yards
            </p>
          </div>
          <button
            className="nav-btn"
            onClick={() =>
              validateScores(setCurrentHole, getNextHole(currentHole))
            }
          >
            Hole {getNextHole(currentHole)}&gt;
            {/* <br />({tournament?.holes[getNextHole(currentHole) - 1]?.alias}) */}
          </button>
        </div>
        {newScores !== null && (
          <div className="scorecard app-box">
            <div className="scorecard-player-details">
              {/* <div className="scorecard-team">
                <p className="scorecard-team-name">
                  {player.name} ({player.handicap})
                </p>
                <p className="scorecard-team-score">
                  {player.parScore > 0 && <span>+</span>}
                  {player.parScore === 0 && 'E'}
                  {player.parScore !== 0 && player.parScore}
                </p>
              </div> */}
              <div className="scorecard-players">
                <div className="scorecard-player">
                  {/* <p className="scorecard-player-name">{player.name}</p> */}
                  <div className="scorecard-team">
                    <p className="scorecard-team-name">{player.name}</p>
                    <p className="scorecard-team-score">
                      {player.totalScore} (
                      {player.netParScore > 0 && <span>+</span>}
                      {player.netParScore === 0 && 'E'}
                      {player.netParScore !== 0 && player.netParScore})
                    </p>
                  </div>
                  <div className="scorecard-input">
                    <input
                      type="text"
                      maxLength={2}
                      inputMode="numeric"
                      onFocus={(event) =>
                        handleScoreOnFocus(event.target.value)
                      }
                      onBlur={(event) => handleScoreOnBlur(event.target.value)}
                      value={newScores}
                      onChange={(event) =>
                        handleSetNewScores(event.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
              {/* <div className="scorecard-players">
                {player.players.map((teamPlayer, i) => (
                  <div className="scorecard-player" key={`player${i}`}>
                    <p className="scorecard-player-name">{teamPlayer.name}</p>
                    <div className="scorecard-input">
                      <input
                        type="text"
                        maxLength={2}
                        inputMode="numeric"
                        onFocus={(event) =>
                          handleScoreOnFocus(event.target.value, i)
                        }
                        onBlur={(event) =>
                          handleScoreOnBlur(event.target.value, i)
                        }
                        value={newScores[i]}
                        onChange={(event) =>
                          handleSetNewScores(event.target.value, i)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div> */}
              <p>
                <em>
                  <strong>Remember to fill out your physical scorecard!</strong>
                </em>
              </p>
            </div>
          </div>
        )}
        {/* <hr />
        <Link to="/">Back to home</Link>
        <br />
        <br />
        <Link to="/leaderboard">View full leaderboard</Link> */}
      </div>
    );
  } else {
    return null;
  }
}

export default Scorecard;
