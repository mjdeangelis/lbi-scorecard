import React, { useState, useEffect } from 'react';
import logo from './logo-min.png';

export function Header() {
  return (
    <header className="app-header">
      <div className="app-logo-container">
        <img
          src={logo}
          className="app-logo"
          alt="Leroy Brown Invitational Logo"
        />
      </div>
    </header>
  );
}
