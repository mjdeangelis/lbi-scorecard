import React, { useContext, useState, useEffect } from 'react';
import { useSpring, useTransition, animated } from 'react-spring';

import { TournamentContext } from '../App';
import { Header } from './Header';
import { PlayersList } from './PlayersList';

export function Home() {
  const tournament = useContext(TournamentContext);
  const [players, setPlayers] = useState([]);
  const [arePlayersLoaded, setArePlayersLoaded] = useState(false);
  const [logoShouldStop, setLogoShouldStop] = useState(false);

  const getPlayers = async () => {
    console.log('getPlayers()');
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}players/getTournamentPlayers/64c9aa773c7e801258a27a7a`
      );
      const players = await res.json();
      setPlayers(players);
      setArePlayersLoaded(true);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getPlayers();
  }, []);

  const logoStyles = useSpring({
    loop: true,
    from: { rotateZ: 0 },
    to: { rotateZ: 360 },
    cancel: logoShouldStop,
    onRest: () => setLogoShouldStop(arePlayersLoaded),
  });

  const transitions = useTransition(arePlayersLoaded, {
    from: { opacity: 0, transform: 'translate(100%, 0)' },
    enter: { opacity: 1, transform: 'translate(0, 0)' },
    leave: { opacity: 0, transform: 'translate(100%, 0)' },
    delay: 200,
  });

  return (
    <div>
      <animated.div style={logoStyles}>
        <Header />
      </animated.div>
      {transitions(
        (styles, item) =>
          item && (
            <div className="home-text" style={styles}>
              <p className="script-text">Welcome to the</p>
              <h1 class="home-header-text">{tournament?.name}</h1>
              <p className="script-text">at Bensalem Country Club </p>
              <PlayersList style={styles} players={players} />
            </div>
          )
      )}
    </div>
  );
}
