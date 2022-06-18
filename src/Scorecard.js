import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { TournamentContext } from "./App";

const API_URL_BASE = "http://localhost:7777/api/"; // todo: make global

/* todo
 * Figure out how to store hole/course data globally (figuring out par on each hole)
 */
function Scorecard() {
  const { id } = useParams();
  const [player, setPlayer] = useState({});
  const [currentHole, setCurrentHole] = useState(null);
  const [newScore, setNewScore] = useState(0);
  const tournament = useContext(TournamentContext);

  const getPlayerDetails = async (id) => {
    const res = await fetch(`${API_URL_BASE}/players/details/${id}`);
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
      `${API_URL_BASE}/players/updateHole`,
      requestOptions
    );
    const data = await response.json();
    setPlayer(data);
  };

  const updatePlayerScore = async (newScore, par) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: player._id, currentHole, newScore, par }),
    };
    const response = await fetch(
      `${API_URL_BASE}/players/updateScore`,
      requestOptions
    );
    const data = await response.json();
    setPlayer(data);
  };

  useEffect(() => {
    getPlayerDetails(id);
  }, [id]);

  useEffect(() => {
    if (currentHole) {
      setNewScore(player?.scorecard[currentHole - 1]?.score);
      updateCurrentHole(currentHole);
    }
  }, [currentHole]);

  useEffect(() => {
    if (newScore !== "" && newScore > 0) {
      updatePlayerScore(newScore, tournament?.holes[currentHole - 1].par);
    }
  }, [newScore]);

  if (!player.name) return null;

  return (
    <div>
      <div className="hole-info">
        <p className="hole-number">Hole {currentHole}</p>
        <p className="hole-par">
          Par {tournament?.holes[currentHole - 1]?.par}
        </p>
      </div>
      <div className="nav-links">
        <button
          className="nav-btn"
          onClick={() =>
            setCurrentHole(currentHole - 1 < 1 ? 18 : currentHole - 1)
          }
        >
          &lt;&lt; Prev Hole
        </button>
        <button
          className="nav-btn"
          onClick={() =>
            setCurrentHole(currentHole + 1 > 18 ? 1 : currentHole + 1)
          }
        >
          Next Hole &gt;&gt;
        </button>
      </div>
      <div className="scorecard">
        <div className="scorecard-player-details">
          <p className="scorecard-name">{player.name}</p>
          <div className="scorecard-score">
            <p className="scorecard-handicap">{player.handicap}</p>
            <p className="scorecard-current-score">
              ({player.parScore > 0 && <span>+</span>}
              {player.parScore})
            </p>
          </div>
        </div>
        <div className="scorecard-input">
          <input
            type="text"
            maxLength={2}
            value={newScore}
            onChange={(event) => setNewScore(event.target.value)}
          />
        </div>
      </div>
      <hr />
      <Link to="/">Back to home</Link>
      <br />
      <br />
      <Link to="/leaderboard">View full leaderboard</Link>
    </div>
  );
}

export default Scorecard;
