import { useEffect } from 'react';

export function PasswordPrompt({ player, handleChange }) {
  useEffect(() => {
    showPasswordPrompt(player);
  }, [player]);

  const showPasswordPrompt = (player) => {
    let password = prompt(`Please enter your team password.`, '');
    if (password == null || password == '') {
      handleChange(player, null);
      // todo: make this player.password
    } else if (password.toLowerCase() == player.handicap) {
      handleChange(player, true);
    } else {
      handleChange(player, false);
    }
  };

  return <div></div>;
}
