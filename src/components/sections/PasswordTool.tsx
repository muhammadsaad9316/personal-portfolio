"use client";

import React, { useState, useEffect } from "react";
import {
  Copy, RefreshCw, Shield, Zap,
  Key, Eye, EyeOff, Timer, ArrowRight, Check, Lock
} from "lucide-react";
import styles from './PasswordTool.module.css';

export default function PasswordTool() {
  // --- STATE ---
  const [password, setPassword] = useState("");
  const [score, setScore] = useState(0);
  const [crackTime, setCrackTime] = useState("");
  const [xp, setXp] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Generator State
  const [genLength, setGenLength] = useState(14);
  const [config, setConfig] = useState({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true
  });

  // Mascot State
  const [mascotState, setMascotState] = useState<"sleeping" | "angry" | "thinking" | "good" | "happy">("sleeping");

  // --- LOGIC: Analysis ---
  useEffect(() => {
    if (!password) {
      setScore(0);
      setCrackTime("Forever");
      setXp(0);
      setMascotState("sleeping");
      return;
    }

    let rawScore = 0;
    if (password.length >= 8) rawScore += 1;
    if (password.length >= 12) rawScore += 1;
    if (/[A-Z]/.test(password)) rawScore += 1;
    if (/[0-9]/.test(password)) rawScore += 1;
    if (/[^A-Za-z0-9]/.test(password)) rawScore += 1;
    if (password.length >= 16) rawScore += 1;

    const finalScore = Math.min(4, Math.floor(rawScore / 1.5));
    setScore(finalScore);
    setXp(finalScore * 250 + password.length * 15);

    const times = ["Instantly", "2 seconds", "4 hours", "9 years", "3 Centuries"];
    setCrackTime(times[finalScore]);

    // Mascot Logic
    if (finalScore <= 1) setMascotState("angry");
    else if (finalScore === 2) setMascotState("thinking");
    else if (finalScore === 3) setMascotState("good");
    else setMascotState("happy");

  }, [password]);

  // --- LOGIC: Generator ---
  const generatePassword = () => {
    let chars = "";
    if (config.lower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (config.upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (config.numbers) chars += "0123456789";
    if (config.symbols) chars += "!@#$%^&*()_+-={}[]<>?";

    if (!chars) return;

    let pass = "";
    for (let i = 0; i < genLength; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(pass);
    setCopied(false);
    setShowPassword(true);
  };

  const copyToClipboard = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleConfig = (key: keyof typeof config) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- MASCOT DATA ---
  const mascot = {
    sleeping: { emoji: "😴", text: "Zzz..." },
    angry: { emoji: "😡", text: "Weak!" },
    thinking: { emoji: "🧐", text: "Okay..." },
    good: { emoji: "🙂", text: "Good!" },
    happy: { emoji: "😎", text: "Strong!" },
  };

  // Get score color
  const getScoreColorClass = () => {
    if (score <= 1) return styles.textWeak;
    if (score === 2) return styles.textFair;
    if (score === 3) return styles.textGood;
    return styles.textStrong;
  };

  const getScoreBgClass = () => {
    if (score <= 1) return styles.bgWeakLight;
    if (score === 2) return styles.bgFairLight;
    if (score === 3) return styles.bgGoodLight;
    return styles.bgStrongLight;
  };

  const getScoreBarFillClass = () => {
    if (score <= 1) return styles.bgWeak;
    if (score === 2) return styles.bgFair;
    if (score === 3) return styles.bgGood;
    return styles.bgStrong;
  };

  return (
    <section id="password-tool" className={styles.section}>

      {/* Background Blobs */}
      <div className={styles.blobBlue}></div>
      <div className={styles.blobPurple}></div>

      <div className="container">

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <div className={styles.pulseDot}></div>
            Secure Your Digital Footprint
          </div>
          <h2 className={styles.title}>
            Password Tool Suite
          </h2>
          <p className={styles.subtitle}>
            Generate cryptographically strong credentials and analyze password entropy with real-time feedback designed for modern security standards.
          </p>
        </div>

        <div className={styles.grid}>

          {/* === GENERATOR PANEL (LEFT) === */}
          <div>
            <div className={styles.card}>

              <div className={styles.cardHeader}>
                <div className={styles.iconBox}>
                  <Key size={24} />
                </div>
                <div>
                  <h2 className={styles.cardTitle}>Generator</h2>
                  <p className={styles.cardDesc}>Create random, secure passwords instantly.</p>
                </div>
              </div>

              {/* Display Box */}
              <div className={styles.displayBox}>
                <span className={styles.passwordText}>
                  {password || <span className={styles.placeholder}>Click generate...</span>}
                </span>
                <div className={styles.actionButtons}>
                  <button
                    onClick={copyToClipboard}
                    className={styles.actionBtn}
                    title="Copy"
                  >
                    {copied ? <Check size={18} className={styles.textStrong} /> : <Copy size={18} />}
                  </button>
                  <button
                    onClick={generatePassword}
                    className={styles.actionBtn}
                    title="Refresh"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              </div>

              {/* Length Slider */}
              <div className={styles.controls}>
                <div className={styles.controlRow}>
                  <label className={styles.label}>Password Length</label>
                  <span className={styles.valueBadge}>{genLength}</span>
                </div>
                <div className={styles.sliderContainer}>
                  <input
                    type="range"
                    min="8"
                    max="32"
                    value={genLength}
                    onChange={(e) => setGenLength(Number(e.target.value))}
                    className={styles.rangeInput}
                  />
                </div>
                <div className={styles.rangeLabels}>
                  <span>8 chars</span>
                  <span>32 chars</span>
                </div>
              </div>

              {/* Checkboxes */}
              <div className={styles.optionsGrid}>
                {[
                  { key: 'upper', label: 'Uppercase (A-Z)' },
                  { key: 'lower', label: 'Lowercase (a-z)' },
                  { key: 'numbers', label: 'Numbers (0-9)' },
                  { key: 'symbols', label: 'Symbols (!@#$%)' },
                ].map((item) => (
                  <label key={item.key} className={styles.optionLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={config[item.key as keyof typeof config]}
                      onChange={() => toggleConfig(item.key as keyof typeof config)}
                    />
                    <span className={styles.optionText}>{item.label}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={generatePassword}
                className={styles.generateBtn}
              >
                <Zap size={20} className={styles.zapIcon} />
                Generate Secure Password
              </button>
            </div>
          </div>

          {/* === STRENGTH PANEL (RIGHT) === */}
          <div>
            <div className={styles.card}>

              <div className={styles.strengthHeader}>
                <div className="flex items-center gap-4">
                  <div className={`${styles.iconBox} ${styles.iconBoxPurple}`}>
                    <Shield size={24} />
                  </div>
                  <div>
                    <h2 className={styles.cardTitle}>Strength Check</h2>
                    <p className={styles.cardDesc}>Analyze vulnerability.</p>
                  </div>
                </div>
                <div className={styles.mascotContainer}>
                  <div className={`${styles.mascotBox} ${mascotState === 'angry' ? styles.shake : ''} ${getScoreBgClass()}`}>
                    {mascot[mascotState].emoji}
                  </div>
                  <div className={styles.mascotState}>
                    <div className={`${styles.statusDot} ${getScoreBarFillClass()}`}></div>
                  </div>
                </div>
              </div>

              <div className={styles.inputWrapper}>
                <input
                  className={styles.passwordInput}
                  placeholder="Type password here..."
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.toggleEye}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className={styles.metrics}>
                <div className={styles.scoreRow}>
                  <span>Strength Score</span>
                  <span className={getScoreColorClass()}>
                    {score === 0 ? "Empty" : score <= 1 ? "Weak" : score === 2 ? "Fair" : score === 3 ? "Good" : "Strong"}
                  </span>
                </div>
                <div className={styles.scoreBarBg}>
                  <div
                    className={`${styles.scoreBarFill} ${getScoreBarFillClass()}`}
                    style={{ width: `${(score / 4) * 100}%` }}
                  ></div>
                </div>
                <p className={styles.crackTime}>
                  <Timer size={16} />
                  Crack time estimate: <span style={{ color: 'var(--foreground)' }}>{crackTime}</span>
                </p>

                {/* XP Display */}
                <div className={styles.xpBox}>
                  <div className={styles.xpRow}>
                    <span style={{ color: 'var(--muted-foreground)' }}>Gamified Score</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>XP: {xp}</span>
                  </div>
                </div>
              </div>

              <div className={styles.reqList}>
                <p className={styles.reqTitle}>Security Requirements:</p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {[
                    { label: "At least 8 characters", met: password.length >= 8 },
                    { label: "Contains a number", met: /[0-9]/.test(password) },
                    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
                    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
                  ].map((req, i) => (
                    <li key={i} className={`${styles.reqItem} ${req.met ? styles.reqMet : ''}`}>
                      <div className={styles.reqIcon}>
                        {req.met && <Check size={14} />}
                      </div>
                      {req.label}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>

        {/* Info Card */}
        <div className={styles.infoCard}>
          <div className={styles.infoBgIcon}>
            <Lock size={320} color="var(--muted-foreground)" />
          </div>
          <div className={styles.infoContent}>
            <div className={styles.infoHeader}>
              <span className={styles.pulseDot}></span>
              <h3 className={styles.infoTitle}>Cybersecurity Tip</h3>
            </div>
            <p className={styles.infoText}>
              Using a password manager is the safest way to store your credentials. Avoid reusing passwords across different sites to prevent credential stuffing attacks. Modern cyber hygiene involves more than just complexity—it requires uniqueness and regular updates.
            </p>
            <div className={styles.readMore}>
              Read more about Cyber Hygiene
              <ArrowRight size={16} className={styles.arrowIcon} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
