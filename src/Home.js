import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSpring, useTransition, animated } from 'react-spring';

import { TournamentContext } from './App';
import { Header } from './Header';
// import { Loading } from './Loading';
import { PlayersList } from './PlayersList';
import logo from './logo-min.png';

export function Home() {
  const tournament = useContext(TournamentContext);
  const [players, setPlayers] = useState([]);
  const [arePlayersLoaded, setArePlayersLoaded] = useState(false);
  const [logoShouldStop, setLogoShouldStop] = useState(false);
  let preloader;

  const getPlayers = async () => {
    console.log('getPlayers()');
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}players/getTournamentPlayers/62b66f3a823df6535020cf38`
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
            <div style={styles}>
              <h1>{tournament.name}</h1>
              <PlayersList style={styles} players={players} />
              <hr />
              <h2>Spectators only.</h2>
              <p>Click below to view the outing leaderboard</p>
              <Link className="btn" to="/leaderboard">
                View the leaderboard
              </Link>
            </div>
          )
      )}
    </div>
  );
}
