"use client";
import React, { useState, useEffect } from "react";
import styles from "./AppHeader.module.css";

import logo from './assets/icons/logo.png';
import settingsIcon from './assets/icons/more.png';
import profileIcon from './assets/icons/profile-icon.png';
import reputationIcon from './assets/icons/icon _reputation.svg';
import bossTrustIcon from './assets/icons/icon_boss.svg';
import teamTrustIcon from './assets/icons/icon_team.svg';
import efficiencyIcon from './assets/icons/icon_efficiency.svg';
import politicalSkillIcon from './assets/icons/icon_cunnig.svg';
import responsibilityAvoidanceIcon from './assets/icons/icon_avoid.svg';
import buzzwordPowerIcon from './assets/icons/icon_buzzword.svg';
import stressIcon from './assets/icons/icon_stress.svg';
import patienceIcon from './assets/icons/icon_patience.svg';
import productivityTheatreIcon from './assets/icons/icon_productivity.svg';
import mentalIcon from './assets/icons/icon_mental.svg';
import cunningIcon from './assets/icons/icon_cunning.svg';
import professionalIcon from './assets/icons/icon_professional.svg';
import UserAvatar from "./UserAvatar";

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

  const iconStyle = { height: "1.5em", width: "1.7em", verticalAlign: "middle" };

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
          <div className={styles.profileIcon} style={{padding:0, background:'none', width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}} onClick={toggleStatsVisibility} role="button" tabIndex={0}>
            <UserAvatar size={28} />
          </div>
        </div>
      </header>
      {isStatsVisible && (
        <div className={styles.statsCard}>
          <h2>Statystyki Gracza</h2>
          <h3><img src={professionalIcon} alt="Professional" style={iconStyle} /> Profesjonalne Umiejętności</h3>
          <p>
            <img src={reputationIcon} alt="Reputacja" style={iconStyle} /> Reputacja: {stats.reputation}
          </p>
          <p>
            <img src={bossTrustIcon} alt="Zaufanie Szefa" style={iconStyle} /> Zaufanie Szefa: {stats.bossTrust}
          </p>
          <p>
            <img src={teamTrustIcon} alt="Zaufanie Zespołu" style={iconStyle} /> Zaufanie Zespołu: {stats.teamTrust}
          </p>
          <p>
            <img src={efficiencyIcon} alt="Efektywność" style={iconStyle} /> Efektywność: {stats.efficiency}
          </p>
          <progress value={(stats.reputation + stats.bossTrust + stats.teamTrust + stats.efficiency) / 4} max="100"></progress>
          {((stats.reputation + stats.bossTrust + stats.teamTrust + stats.efficiency) / 4) > 70 && (
            <p>Masz szansę na awans, ale musisz dużo pracować.</p>
          )}

          <h3><img src={cunningIcon} alt="Cunning" style={iconStyle} /> Korpo Cwaniactwo</h3>
          <p>
            <img src={politicalSkillIcon} alt="Polityczny Spryt" style={iconStyle} /> Polityczny Spryt: {stats.politicalSkill}
          </p>
          <p>
            <img src={responsibilityAvoidanceIcon} alt="Unikanie Odpowiedzialności" style={iconStyle} /> Unikanie Odpowiedzialności: {stats.responsibilityAvoidance}
          </p>
          <p>
            <img src={buzzwordPowerIcon} alt="Buzzword Power" style={iconStyle} /> Buzzword Power: {stats.buzzwordPower}
          </p>
          <progress value={(stats.politicalSkill + stats.responsibilityAvoidance + stats.buzzwordPower) / 3} max="100"></progress>
          {((stats.politicalSkill + stats.responsibilityAvoidance + stats.buzzwordPower) / 3) > 70 && (
            <p>Jesteś sprytnym oszustem, ale zespół może cię nienawidzić.</p>
          )}

          <h3><img src={mentalIcon} alt="Mental" style={iconStyle} /> Mentalność Gracza</h3>
          <p>
            <img src={stressIcon} alt="Stres" style={iconStyle} /> Stres: {stats.stress}
          </p>
          <p>
            <img src={patienceIcon} alt="Cierpliwość" style={iconStyle} /> Cierpliwość: {stats.patience}
          </p>
          <p>
            <img src={productivityTheatreIcon} alt="Produktivity Theatre" style={iconStyle} /> Produktivity Theatre: {stats.productivityTheatre}
          </p>
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
