import React, { useState, useEffect } from 'react';
import logo from './logo-min.png';

export function Loading() {
  return (
    <div className="loading">
      <div className="app-logo-container">
        <img
          src={logo}
          onAnimationEnd={() => console.log('Animation ended')}
          className="app-logo"
          alt="Leroy Brown Invitational Logo"
        />
      </div>
    </div>
  );
}
