import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { TournamentContext } from "./App";
import { Header } from "./Header";
import { Loading } from "./Loading";

import { PlayersList } from "./PlayersList";

export function Home() {
  const tournament = useContext(TournamentContext);
  const playersLoaded = false;
  const handlePlayersLoaded = () => {
    console.log("handlePlayersLoaded");
  };
  if (tournament?.name) {
    return (
      <div>
        <Header />
        <h1>{tournament.name}</h1>
        <PlayersList playersLoaded={handlePlayersLoaded()} />
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
