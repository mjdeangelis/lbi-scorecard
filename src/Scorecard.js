import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TournamentContext } from './App';
import { Header } from './Header';
import { useSpring, useTransition, animated } from 'react-spring';

/* todo
 * Figure out how to store hole/course data globally (figuring out par on each hole)
 */
function Scorecard() {
  const { id } = useParams();
  const [player, setPlayer] = useState({});
  const [currentHole, setCurrentHole] = useState(null);
  const [newScores, setNewScores] = useState([0, 0]);
  const [isDoneLoading, setIsDoneLoading] = useState(false);
  const [logoShouldStop, setLogoShouldStop] = useState(false);
  const tournament = useContext(TournamentContext);

  const getPrevHole = (currentHole) =>
    currentHole - 1 < 1 ? 18 : currentHole - 1;

  const getNextHole = (currentHole) => {
    return currentHole + 1 > 18 ? 1 : currentHole + 1;
  };

  const validateScores = async (callback, nextHole) => {
    const hasEmptyScore = newScores.filter(
      (score) => score === 0 || score === null || score === ''
    ).length;
    // Deleo message
    if (
      player.name === 'Deleo/Blake' &&
      newScores[0] - tournament?.holes[currentHole - 1]?.par >= 2
    ) {
      alert('JACKASS');
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
    if (newScore === '' || newScore === 0) {
      handleSetNewScores(0, i);
    }
  };

  /* If score is 0 before focus, clear it for user  */
  const handleScoreOnFocus = (newScore, i = null) => {
    console.log('handleScoreOnFocus', newScore);
    if (newScore == 0) {
      console.log('zero score');
      handleSetNewScores('', i);
    }
  };

  const handleSetNewScores = (newScore, i = null) => {
    // If we don't pass an index, we're updating both scores
    if (i === null) {
      setNewScores(newScore);
      return;
    }
    if (newScore !== '' && newScore !== null) {
      newScore = Number(newScore);
    }
    // Update only one score
    setNewScores(newScores.map((score, j) => (j === i ? newScore : score)));
  };

  const getPlayerDetails = async (id) => {
    console.log('getPlayerDetails()');
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
    console.log('updatePlayerScore()');
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: player._id, currentHole, newScores, par }),
    };
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/players/updateScore`,
      requestOptions
    );
    const data = await response.json();
    setPlayer(data);
  };

  useEffect(() => {
    getPlayerDetails(id);
  }, [id]);

  useEffect(() => {
    console.log('currentHole updated.', currentHole);
    if (currentHole) {
      handleSetNewScores(player?.scorecard[currentHole - 1]?.scores);
      updateCurrentHole(currentHole);
    }
  }, [currentHole]);

  useEffect(() => {
    console.log('newScores changed', newScores);
    const isEmptyScore = newScores.every((item) => item === 0);
    const hasNullOrZeroScore = newScores.filter(
      (item) => item === null || item === '' || item === 0
    ).length;
    console.log('isEmptyScore', isEmptyScore);
    console.log('hasNullOrZeroScore', hasNullOrZeroScore);
    if (!isEmptyScore && !hasNullOrZeroScore) {
      console.log('Updated score.');
      updatePlayerScore(newScores, tournament?.holes[currentHole - 1].par);
    } else {
      console.log('Empty score.');
    }
  }, [newScores]);

  const logoStyles = useSpring({
    loop: true,
    from: { rotateZ: 0 },
    to: { rotateZ: 360 },
    cancel: logoShouldStop,
    onRest: () => setLogoShouldStop(isDoneLoading),
  });

  const transitions = useTransition(isDoneLoading, {
    from: { opacity: 1, transform: 'translate(100%, 0)' },
    enter: { opacity: 1, transform: 'translate(0, 0)' },
    leave: { opacity: 1, transform: 'translate(-100%, 0)' },
    delay: 200,
  });

  if (tournament?.name && player?.name) {
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
            <br />({tournament?.holes[getPrevHole(currentHole) - 1]?.alias})
          </button>
          <div className="hole-info">
            <p className="hole-number">
              Hole {currentHole} <br />(
              {tournament?.holes[currentHole - 1]?.alias})
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
            <br />({tournament?.holes[getNextHole(currentHole) - 1]?.alias})
          </button>
        </div>
        {newScores?.length && (
          <div className="scorecard">
            <div className="scorecard-player-details">
              <div className="scorecard-team">
                <p className="scorecard-team-name">
                  {player.name} ({player.handicap})
                </p>
                <p className="scorecard-team-score">
                  {player.parScore > 0 && <span>+</span>}
                  {player.parScore === 0 && 'E'}
                  {player.parScore !== 0 && player.parScore}
                </p>
              </div>
              <div className="scorecard-players">
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
              </div>
              <p>
                <em>
                  <strong>Remember to fill out your physical scorecard!</strong>
                </em>
              </p>
            </div>
          </div>
        )}
        <hr />
        <Link to="/">Back to home</Link>
        <br />
        <br />
        <Link to="/leaderboard">View full leaderboard</Link>
      </div>
    );
  } else {
    return null;
  }
}

export default Scorecard;
