import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import icon from './golf-icon-min.png';
import { PasswordPrompt } from './PasswordPrompt';

export function PlayersList({ players }) {
  let navigate = useNavigate();
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const handleSelectPlayer = (id) => {
    const currentPlayer = players.find((item) => item._id === id);
    setCurrentPlayer(currentPlayer);
  };

  const navigateToPlayer = (id) => {
    navigate(`/scorecard/${id}`);
  };

  const handleTeeOffClick = (player) => {
    if (!player._id) {
      alert('Please select a player');
      return;
    }
    // decide if we need to show prompt here
    const passwordHasBeenEntered = window.localStorage.getItem(player._id);
    console.log('Password has been entered?', passwordHasBeenEntered);
    if (passwordHasBeenEntered == 'true') {
      navigateToPlayer(player._id);
    } else {
      setShowPasswordPrompt(true);
    }
  };

  const handlePasswordPromptChange = (player, result) => {
    setShowPasswordPrompt(false);
    window.localStorage.setItem(player._id, result);
    console.log('We have a result from the prompt', result);
    if (result) {
      navigateToPlayer(player._id);
    } else if (result === null) {
      return;
    } else {
      alert('Incorrect password. Try again.');
    }
  };

  return (
    <div>
      {showPasswordPrompt && (
        <PasswordPrompt
          player={currentPlayer}
          handleChange={handlePasswordPromptChange}
        />
      )}
      <p className="intro-text">
        Select the golfer you are keeping score for,
        <br /> and tap the Tee Off button
      </p>
      <div className="golfers">
        <h2>Golfers</h2>
        <div className="player-list">
          <div className="select-container">
            <select
              onChange={(e) => handleSelectPlayer(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Select a player
              </option>
              {players.length > 0 &&
                players.map((player) => (
                  <option key={player._id} value={player._id}>
                    {player.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      <button
        className="btn btn-teeoff"
        onClick={() => handleTeeOffClick(currentPlayer)}
      >
        <img src={icon} className="btn-icon" alt="Golf icon" />
        Tee Off
      </button>
    </div>
  );
}
