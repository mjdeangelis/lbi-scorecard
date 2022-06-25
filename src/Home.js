import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TournamentContext } from "./App";
import { Header } from "./Header";
import { Loading } from "./Loading";
import { PlayersList } from "./PlayersList";
import logo from "./logo.png";

import EnsureAnimation from "ensure-animation";

export function Home() {
  const tournament = useContext(TournamentContext);
  const [players, setPlayers] = useState([]);
  let preloader;

  const getPlayers = async () => {
    console.log("getPlayers()");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}players/getTournamentPlayers/62b66f3a823df6535020cf38`
      );
      const players = await res.json();
      preloader.finish().then(() => {
        console.log("preloader finished");
        setPlayers(players);
        console.log("players", players);
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    preloader = new EnsureAnimation(".app-logo")[0]; // get our first instance
    getPlayers();
  }, []);

  if (tournament?.name && players?.length) {
    return (
      <div>
        <Header />
        <h1>{tournament.name}</h1>
        <PlayersList players={players} />
        <hr />
        <h2>Spectators only.</h2>
        <p>Click below to view the outing leaderboard</p>
        <Link className="btn" to="/leaderboard">
          View the leaderboard
        </Link>
      </div>
    );
  } else {
    return <Loading />;
  }
}
