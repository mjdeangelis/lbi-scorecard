import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { TournamentContext } from "./App";
import { Header } from "./Header";
import { Loading } from "./Loading";

/* todo
 * Figure out how to store hole/course data globally (figuring out par on each hole)
 */
function Scorecard() {
  const { id } = useParams();
  const [player, setPlayer] = useState({});
  const [currentHole, setCurrentHole] = useState(null);
  const [newScores, setNewScores] = useState([0, 0]);
  const tournament = useContext(TournamentContext);

  const isEmptyScore = (scoresArr) => {
    scoresArr.every((item) => item === 0);
  };

  const getPrevHole = (currentHole) =>
    currentHole - 1 < 1 ? 18 : currentHole - 1;

  const getNextHole = (currentHole) =>
    currentHole + 1 > 18 ? 1 : currentHole + 1;

  const handleSetNewScores = (newScore, i = null) => {
    // If we don't pass an index, we're updating both scores
    if (i === null) {
      setNewScores(newScore);
      return;
    }
    if (newScore !== "" && newScore !== null) {
      newScore = Number(newScore);
    }
    console.log("newScore updated", newScore);
    console.log("old scores.", newScores);
    setNewScores(newScores.map((score, j) => (j === i ? newScore : score)));
  };

  const getPlayerDetails = async (id) => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/players/details/${id}`
    );
    const newPlayer = await res.json();
    setPlayer(newPlayer);
    setCurrentHole(newPlayer.currentHole);
  };

  const updateCurrentHole = async (newHole) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    console.log("currentHole updated.", currentHole);
    if (currentHole) {
      handleSetNewScores(player?.scorecard[currentHole - 1]?.scores);
      updateCurrentHole(currentHole);
    }
  }, [currentHole]);

  useEffect(() => {
    console.log("newScores changed", newScores);
    const isEmptyScore = newScores.every((item) => item === 0);
    if (!isEmptyScore) {
      console.log("Updated score.");
      updatePlayerScore(newScores, tournament?.holes[currentHole - 1].par);
    } else {
      console.log("Empty score.");
    }
  }, [newScores]);

  if (tournament.name && player?.name) {
    return (
      <div>
        <Header />
        <div className="scorecard-header">
          <button
            className="nav-btn"
            onClick={() => setCurrentHole(getPrevHole(currentHole))}
          >
            &lt; Hole {getPrevHole(currentHole)}
          </button>
          <div className="hole-info">
            <p className="hole-number">Hole {currentHole}</p>
            <p className="hole-par">
              Par {tournament?.holes[currentHole - 1]?.par} &#8226;{" "}
              {tournament?.holes[currentHole - 1]?.yards} yards
            </p>
          </div>
          <button
            className="nav-btn"
            onClick={() => setCurrentHole(getNextHole(currentHole))}
          >
            Hole {getNextHole(currentHole)} &gt;
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
                  {player.parScore}
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
                        inputmode="numeric"
                        value={newScores[i]}
                        onChange={(event) =>
                          handleSetNewScores(event.target.value, i)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
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
    return <Loading />;
  }
}

export default Scorecard;
