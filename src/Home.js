import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { TournamentContext } from "./App";

import { PlayersList } from "./PlayersList";

export function Home() {
  const tournament = useContext(TournamentContext);
  return (
    <div>
      <h1>{tournament.name}</h1>
      <PlayersList />
      <hr />
      <h2>Spectators only.</h2>
      <p>Click below to view the outing leaderboard</p>
      <Link className="btn" to="/leaderboard">
        View the leaderboard
      </Link>
    </div>
  );
}
