"use client";
import React, { useState, useEffect } from "react";
import styles from "./AppHeader.module.css";

import logo from './assets/icons/logo.png';
import settingsIcon from './assets/icons/more.png';
import profileIcon from './assets/icons/profile-icon.png';

const AppHeader = () => {
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [stats, setStats] = useState({
    reputation: 50,
    bossTrust: 50,
    teamTrust: 50,
    efficiency: 50,
    politicalSkill: 30,
    responsibilityAvoidance: 30,
    buzzwordPower: 30,
    stress: 20,
    patience: 80,
    productivityTheatre: 40,
  });

  useEffect(() => {
    const savedStats = localStorage.getItem("playerStats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("playerStats", JSON.stringify(stats));
  }, [stats]);

  const toggleStatsVisibility = () => {
    setIsStatsVisible((prev) => !prev);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img
            src={logo}
            alt="Logo"
            className={styles.logo}
          />
        </div>
        <div className={styles.profileSection}>
          <img
            src={settingsIcon}
            alt="Settings"
            className={styles.settingsIcon}
            onClick={() => alert("Settings clicked")}
            role="button"
            tabIndex={0}
          />
          <img
            src={profileIcon}
            alt="Profile"
            className={styles.profileIcon}
            onClick={toggleStatsVisibility}
            role="button"
            tabIndex={0}
          />
        </div>
      </header>
      {isStatsVisible && (
        <div className={styles.statsCard}>
          <h2>Statystyki Gracza</h2>
          <h3>🔹 Profesjonalne Umiejętności</h3>
          <p>✅ Reputacja: {stats.reputation}</p>
          <p>✅ Zaufanie Szefa: {stats.bossTrust}</p>
          <p>✅ Zaufanie Zespołu: {stats.teamTrust}</p>
          <p>✅ Efektywność: {stats.efficiency}</p>

          <h3>😈 Korpo Cwaniactwo</h3>
          <p>🕶️ Polityczny Spryt: {stats.politicalSkill}</p>
          <p>🎭 Unikanie Odpowiedzialności: {stats.responsibilityAvoidance}</p>
          <p>🔄 Buzzword Power: {stats.buzzwordPower}</p>

          <h3>🔥 Mentalność Gracza</h3>
          <p>😰 Stres: {stats.stress}</p>
          <p>🛑 Cierpliwość: {stats.patience}</p>
          <p>💤 Produktivity Theatre: {stats.productivityTheatre}</p>

          <button onClick={toggleStatsVisibility}>Zamknij</button>
        </div>
      )}
    </>
  );
};

export default AppHeader;
