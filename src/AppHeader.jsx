"use client";
import React, { useState, useEffect } from "react";
import styles from "./AppHeader.module.css";

import logo from './assets/icons/logo.png';
import settingsIcon from './assets/icons/more.png';
import profileIcon from './assets/icons/profile-icon.png';

const AppHeader = () => {
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem("playerStats");
    return savedStats ? JSON.parse(savedStats) : {};
  });

  useEffect(() => {
    const updateStats = () => {
      const updatedStats = localStorage.getItem("playerStats");
      if (updatedStats) {
        setStats(JSON.parse(updatedStats));
      }
    };

    // Update stats immediately when the component mounts
    updateStats();

    // Override `localStorage.setItem` to detect changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, arguments);
      if (key === "playerStats") {
        updateStats();
      }
    };

    // Cleanup: Restore the original `setItem` method
    return () => {
      localStorage.setItem = originalSetItem;
    };
  }, []);

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
          <progress value={(stats.reputation + stats.bossTrust + stats.teamTrust + stats.efficiency) / 4} max="100"></progress>
          {((stats.reputation + stats.bossTrust + stats.teamTrust + stats.efficiency) / 4) > 70 && (
            <p>Masz szansę na awans, ale musisz dużo pracować.</p>
          )}

          <h3>😈 Korpo Cwaniactwo</h3>
          <p>🕶️ Polityczny Spryt: {stats.politicalSkill}</p>
          <p>🎭 Unikanie Odpowiedzialności: {stats.responsibilityAvoidance}</p>
          <p>🔄 Buzzword Power: {stats.buzzwordPower}</p>
          <progress value={(stats.politicalSkill + stats.responsibilityAvoidance + stats.buzzwordPower) / 3} max="100"></progress>
          {((stats.politicalSkill + stats.responsibilityAvoidance + stats.buzzwordPower) / 3) > 70 && (
            <p>Jesteś sprytnym oszustem, ale zespół może cię nienawidzić.</p>
          )}

          <h3>🔥 Mentalność Gracza</h3>
          <p>😰 Stres: {stats.stress}</p>
          <p>🛑 Cierpliwość: {stats.patience}</p>
          <p>💤 Produktivity Theatre: {stats.productivityTheatre}</p>
          <progress value={(stats.patience - stats.stress) / 2} max="100"></progress>
          {((stats.patience - stats.stress) / 2) <= 0 && (
            <p>Masz dość i rzucasz robotę (czyli przegrywasz… albo wygrywasz, zależy jak patrzeć).</p>
          )}

          <button onClick={toggleStatsVisibility}>Zamknij</button>
        </div>
      )}
    </>
  );
};

export default AppHeader;
