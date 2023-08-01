import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import icon from 'icons/golf-icon-white.png';
import { PasswordPrompt } from './PasswordPrompt';

export function PlayersList({ players }) {
  let navigate = useNavigate();
  const [selectedPlayer, setSelectedPlayer] = useState({});
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const handleSelectPlayer = (id) => {
    const selectedPlayerOption = players.find((item) => item._id === id);
    setSelectedPlayer(selectedPlayerOption);
  };

  const handleSuccess = (id) => {
    window.localStorage.setItem('currentPlayer', id);
    navigateToPlayer(id);
  };

  const navigateToPlayer = (id) => {
    navigate(`/scorecard/${id}`);
  };

  const handleTeeOffClick = (player) => {
    if (!player._id) {
      alert('Please select a team');
      return;
    }
    // decide if we need to show prompt here
    const passwordHasBeenEntered = window.localStorage.getItem(player._id);
    if (passwordHasBeenEntered == 'true') {
      // navigateToPlayer(player._id);
      handleSuccess(player._id);
    } else {
      setShowPasswordPrompt(true);
    }
  };

  const handlePasswordPromptChange = (player, result) => {
    setShowPasswordPrompt(false);
    window.localStorage.setItem(player._id, result);
    if (result) {
      // navigateToPlayer(player._id);
      handleSuccess(player._id);
    } else if (result === null) {
      return;
    } else {
      alert('Incorrect password. Try again.');
    }
  };

  return (
    <div className="playersList">
      {showPasswordPrompt && (
        <PasswordPrompt
          player={selectedPlayer}
          handleChange={handlePasswordPromptChange}
        />
      )}

      <div className="golfers">
        <h2>Team Selection</h2>
        <p>
          Select the team you are keeping score for,
          <br /> and tap the Tee Off button
        </p>
        <div className="player-list">
          <div className="select-container">
            <select
              onChange={(e) => handleSelectPlayer(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Select a team
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
        onClick={() => handleTeeOffClick(selectedPlayer)}
      >
        <img src={icon} className="btn-icon" alt="Golf icon" />
        Tee Off
      </button>
    </div>
  );
}
