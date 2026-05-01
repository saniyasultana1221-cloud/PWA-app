import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type GameId = "hub" | "neural" | "semantic-sprint" | "signal-noise" | "pressure-cooker" | "echo-chamber";
type Theme = "light" | "dark";

// ─── Sample deck content (astrophysics) ──────────────────────────────────────
const CONCEPTS = [
  { term: "Neutron Star", def: "Ultra-dense stellar remnant of a supernova, composed almost entirely of neutrons", connections: ["Supernova", "Pulsar", "Gravity", "Density", "Magnetar"] },
  { term: "Black Hole", def: "Region where gravity is so strong that nothing, not even light, can escape the event horizon", connections: ["Singularity", "Event Horizon", "Hawking Radiation", "Gravity", "Spacetime"] },
  { term: "Redshift", def: "Shift of spectral lines toward longer wavelengths, indicating an object is moving away", connections: ["Doppler Effect", "Expansion", "Light", "Velocity", "Cosmology"] },
  { term: "Dark Matter", def: "Hypothetical matter that does not interact with the electromagnetic force but whose presence is inferred from gravitational effects", connections: ["Gravity", "Galaxy", "Mass", "Invisible", "Cold"] },
  { term: "Photosynthesis", def: "Process by which plants convert light energy into chemical energy stored as glucose", connections: ["Chlorophyll", "Glucose", "Light", "CO2", "Oxygen"] },
  { term: "Mitosis", def: "Cell division producing two genetically identical daughter cells for growth and repair", connections: ["DNA", "Chromosomes", "Cell Cycle", "Prophase", "Cytokinesis"] },
  { term: "Entropy", def: "Measure of disorder or randomness in a thermodynamic system; tends to increase over time", connections: ["Thermodynamics", "Disorder", "Energy", "Time", "Equilibrium"] },
  { term: "Eigenvalue", def: "Scalar λ where Av = λv; the factor by which a matrix scales its eigenvector", connections: ["Matrix", "Eigenvector", "Linear Algebra", "Transformation", "Determinant"] },
  { term: "Covalent Bond", def: "Chemical bond formed by sharing electron pairs between atoms", connections: ["Electrons", "Atoms", "Molecule", "Sharing", "Orbital"] },
  { term: "Newton's 2nd Law", def: "Force equals mass times acceleration: F = ma", connections: ["Force", "Mass", "Acceleration", "Momentum", "Velocity"] },
];

const IMPOSTERS = ["Quantum Foam","Plasma Toroid","Helium Flash","Dark Flow","Tachyon Field","Baryonic Resonance","Spinor Field","Virial Theorem","Geodesic Drift","Holomorphic Bundle"];

const uid = () => Math.random().toString(36).slice(2, 8);

// ─── XP & Level system ───────────────────────────────────────────────────────
const XP_PER_LEVEL = 200;
const levelName = (lvl: number) => ["Cadet","Explorer","Scholar","Luminary","Starforger","Voidwalker","Nebula Sage"][Math.min(lvl - 1, 6)];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LumIUGames() {
  const [theme, setTheme] = useState<Theme>("light");
  const [game, setGame] = useState<GameId>("hub");
  const [xp, setXp] = useState(340);
  const [streak, setStreak] = useState(7);
  const [totalGames, setTotalGames] = useState(23);
  const [bestChain, setBestChain] = useState(12);

  const addXp = (amt: number) => setXp(p => p + amt);
  const isDark = theme === "dark";
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpInLevel = xp % XP_PER_LEVEL;

  // ─── Design tokens matching Lumiu Notes ──────────────────────────────────
  const T = {
    bg:           isDark ? "#0f0f23"                    : "#f0eeff",
    surface:      isDark ? "#1a1a38"                    : "#ffffff",
    s2:           isDark ? "#22223a"                    : "#ede9ff",
    s3:           isDark ? "#2a2a48"                    : "#e2dcff",
    sidebar:      isDark ? "#16162e"                    : "#9D79FF",
    sidebarText:  isDark ? "#e0d8ff"                    : "#ffffff",
    sidebarMuted: isDark ? "rgba(200,192,240,0.5)"      : "rgba(255,255,255,0.7)",
    sidebarActive:isDark ? "#2e2e52"                    : "rgba(255,255,255,0.22)",
    border:       isDark ? "rgba(157,121,255,0.15)"     : "rgba(157,121,255,0.2)",
    b2:           isDark ? "rgba(157,121,255,0.25)"     : "rgba(157,121,255,0.35)",
    text:         isDark ? "#e8e4ff"                    : "#1a1040",
    muted:        isDark ? "rgba(200,192,240,0.55)"     : "rgba(80,60,140,0.55)",
    accent:       "#9D79FF",
    accentHover:  "#7c5cfc",
    glow:         "rgba(157,121,255,0.15)",
    glowMd:       "rgba(157,121,255,0.3)",
    green:        isDark ? "#34d399"                    : "#059669",
    amber:        isDark ? "#fbbf24"                    : "#d97706",
    red:          isDark ? "#f87171"                    : "#ef4444",
    blue:         isDark ? "#60a5fa"                    : "#3b82f6",
    pill:         isDark ? "#22223a"                    : "#ede9ff",
    canvasBg:     isDark ? "#0b0b1e"                    : "#edeaff",
    cardBg:       isDark ? "#1e1e40"                    : "#faf8ff",
  };

  const css = `
@import url('https://api.fontshare.com/v2/css?f[]=chillax@300,400,500,600,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
.lg-root{font-family:'Chillax',sans-serif;background:${T.bg};color:${T.text};height:100vh;display:flex;flex-direction:column;overflow:hidden;transition:background 0.3s,color 0.3s;}

/* ── Topbar ── */
.lg-top{height:54px;background:${T.surface};border-bottom:1px solid ${T.border};display:flex;align-items:center;padding:0 20px;gap:14px;flex-shrink:0;z-index:50;}
.lg-logo{font-weight:700;font-size:19px;color:${T.accent};letter-spacing:-0.4px;display:flex;align-items:center;gap:6px;}
.lg-logo-dot{width:7px;height:7px;border-radius:50%;background:${T.accent};box-shadow:0 0 10px ${T.accent};animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.8);}}
.lg-badge{font-size:11px;padding:2px 9px;border-radius:20px;background:${T.glow};color:${T.accent};border:1px solid ${T.border};font-weight:600;}
.lg-top-right{margin-left:auto;display:flex;align-items:center;gap:10px;}
.lg-xp-bar{display:flex;align-items:center;gap:8px;}
.lg-xp-bg{width:100px;height:6px;border-radius:3px;background:${T.s3};}
.lg-xp-fill{height:6px;border-radius:3px;background:linear-gradient(90deg,${T.accent},#c4b0ff);transition:width 0.5s;}
.lg-level{font-size:11px;font-weight:600;color:${T.accent};white-space:nowrap;font-family:'JetBrains Mono';}
.lg-streak{display:flex;align-items:center;gap:5px;background:${T.glow};border:1px solid ${T.border};border-radius:20px;padding:4px 12px;font-size:12px;font-weight:600;color:${T.amber};}
.theme-toggle{display:flex;align-items:center;gap:7px;border:1px solid ${T.border};border-radius:20px;padding:5px 12px;cursor:pointer;background:${T.pill};color:${T.muted};font-size:12px;font-family:'Chillax';font-weight:500;transition:all 0.2s;}
.theme-toggle:hover{border-color:${T.accent};}
.tog-track{width:32px;height:17px;border-radius:9px;background:${isDark ? T.accent : T.s3};position:relative;transition:background 0.25s;flex-shrink:0;}
.tog-thumb{position:absolute;width:13px;height:13px;border-radius:50%;background:white;top:2px;left:${isDark ? "17px" : "2px"};transition:left 0.25s;box-shadow:0 1px 3px rgba(0,0,0,0.3);}

/* ── Body layout ── */
.lg-body{display:flex;flex:1;overflow:hidden;}

/* ── Sidebar ── */
.lg-sidebar{width:230px;background:${T.sidebar};display:flex;flex-direction:column;padding:16px 10px;gap:4px;flex-shrink:0;overflow-y:auto;}
.lg-section-label{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${T.sidebarMuted};padding:8px 10px 4px;margin-top:8px;}
.lg-nav-btn{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:12px;cursor:pointer;border:none;background:transparent;color:${T.sidebarText};font-family:'Chillax';font-size:13px;font-weight:500;width:100%;text-align:left;transition:all 0.18s;}
.lg-nav-btn:hover{background:${T.sidebarActive};}
.lg-nav-btn.active{background:${isDark ? "rgba(157,121,255,0.22)" : "rgba(255,255,255,0.28)"};color:white;}
.lg-nav-icon{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.lg-nav-sub{font-size:10px;color:${T.sidebarMuted};font-weight:400;display:block;margin-top:1px;}
.lg-divider{height:1px;background:rgba(255,255,255,0.12);margin:8px 0;}

/* ── Stats block in sidebar ── */
.lg-stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:10px;}
.lg-stat{background:${isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.3)"};border-radius:10px;padding:8px 10px;}
.lg-stat-num{font-size:18px;font-weight:700;color:white;letter-spacing:-0.5px;}
.lg-stat-lbl{font-size:9px;color:${T.sidebarMuted};margin-top:1px;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;}

/* ── Main content ── */
.lg-main{flex:1;overflow-y:auto;padding:24px;}

/* ── Hub ── */
.hub-hero{background:${isDark ? "linear-gradient(135deg,#1a1a38,#2e1a54)" : "linear-gradient(135deg,#9D79FF,#7c5cfc)"};border-radius:20px;padding:28px 32px;margin-bottom:22px;position:relative;overflow:hidden;}
.hub-hero-title{font-size:26px;font-weight:700;color:white;letter-spacing:-0.5px;margin-bottom:4px;}
.hub-hero-sub{font-size:14px;color:rgba(255,255,255,0.7);margin-bottom:18px;}
.hub-hero-btn{background:white;color:${T.accent};border:none;padding:10px 22px;border-radius:12px;font-family:'Chillax';font-size:14px;font-weight:700;cursor:pointer;transition:all 0.18s;letter-spacing:-0.2px;}
.hub-hero-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.2);}
.hub-stars{position:absolute;inset:0;pointer-events:none;}

.games-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:22px;}
.game-card{background:${T.cardBg};border:1px solid ${T.border};border-radius:18px;padding:20px;cursor:pointer;transition:all 0.22s;position:relative;overflow:hidden;}
.game-card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(157,121,255,0.18);border-color:${T.b2};}
.game-card-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:12px;}
.game-card-title{font-size:16px;font-weight:700;letter-spacing:-0.3px;margin-bottom:4px;}
.game-card-desc{font-size:12px;color:${T.muted};line-height:1.5;margin-bottom:12px;}
.game-card-tags{display:flex;gap:5px;flex-wrap:wrap;}
.game-tag{font-size:10px;font-weight:600;padding:2px 8px;border-radius:8px;text-transform:uppercase;letter-spacing:0.04em;}
.game-card-play{margin-top:14px;padding:8px 16px;border-radius:10px;border:none;background:${T.accent};color:white;font-family:'Chillax';font-size:12px;font-weight:600;cursor:pointer;transition:all 0.15s;width:100%;}
.game-card-play:hover{background:${T.accentHover};}

/* Achievements */
.ach-row{display:flex;gap:10px;margin-bottom:20px;overflow-x:auto;padding-bottom:4px;}
.ach{background:${T.cardBg};border:1px solid ${T.border};border-radius:14px;padding:12px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;min-width:180px;}
.ach-icon{font-size:24px;}
.ach-title{font-size:12px;font-weight:600;margin-bottom:1px;}
.ach-sub{font-size:10px;color:${T.muted};}
.ach.locked{opacity:0.4;}

/* Section title */
.sec-title{font-size:16px;font-weight:700;letter-spacing:-0.3px;margin-bottom:12px;display:flex;align-items:center;gap:8px;}

/* ── Game shell ── */
.game-shell{background:${T.surface};border-radius:20px;border:1px solid ${T.border};overflow:hidden;min-height:560px;display:flex;flex-direction:column;}
.game-header{padding:16px 20px;border-bottom:1px solid ${T.border};display:flex;align-items:center;gap:12px;}
.game-header-back{width:32px;height:32px;border-radius:50%;border:1px solid ${T.border};background:${T.pill};color:${T.text};font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s;flex-shrink:0;}
.game-header-back:hover{border-color:${T.accent};color:${T.accent};}
.game-title{font-size:16px;font-weight:700;letter-spacing:-0.3px;}
.game-subtitle{font-size:12px;color:${T.muted};font-weight:400;}
.game-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;}

/* ── Score pill ── */
.score-pill{display:flex;align-items:center;gap:6px;background:${T.glow};border:1px solid ${T.border};border-radius:20px;padding:5px 14px;font-size:13px;font-weight:600;color:${T.accent};margin-left:auto;}

/* ─────────────────────────────────────────────────────────────
   NEURAL GAME
───────────────────────────────────────────────────────────── */
.neural-canvas{width:100%;max-width:600px;position:relative;height:420px;}
.neural-input-row{display:flex;gap:8px;width:100%;max-width:500px;margin-top:16px;}
.neural-input{flex:1;padding:12px 16px;background:${T.s2};border:1.5px solid ${T.border};border-radius:12px;color:${T.text};font-family:'Chillax';font-size:15px;font-weight:500;outline:none;transition:border-color 0.18s;}
.neural-input:focus{border-color:${T.accent};}
.neural-submit{padding:12px 20px;border-radius:12px;border:none;background:${T.accent};color:white;font-family:'Chillax';font-size:14px;font-weight:600;cursor:pointer;transition:all 0.15s;}
.neural-submit:hover{background:${T.accentHover};}
.beat-ring{border-radius:50%;border:2px solid ${T.accent};position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);animation:beat-pulse 1s ease-in-out infinite;}
@keyframes beat-pulse{0%,100%{opacity:0.6;transform:translate(-50%,-50%) scale(1);}50%{opacity:1;transform:translate(-50%,-50%) scale(1.06);}}
.chain-badge{background:${isDark?"linear-gradient(135deg,#9D79FF,#7c5cfc)":"linear-gradient(135deg,#9D79FF,#7c5cfc)"};color:white;border-radius:20px;padding:5px 16px;font-size:13px;font-weight:700;font-family:'JetBrains Mono';letter-spacing:0.05em;}

/* ─────────────────────────────────────────────────────────────
   SEMANTIC SPRINT
───────────────────────────────────────────────────────────── */
.ss-concept-card{background:${isDark?"linear-gradient(135deg,#1a0a3d,#2d1b69)":"linear-gradient(135deg,#9D79FF,#7c5cfc)"};border-radius:20px;padding:28px 32px;max-width:480px;width:100%;text-align:center;margin-bottom:20px;}
.ss-concept-main{font-size:22px;font-weight:700;color:white;letter-spacing:-0.4px;margin-bottom:4px;}
.ss-concept-def{font-size:13px;color:rgba(255,255,255,0.7);line-height:1.5;}
.ss-connector{font-size:13px;color:${T.muted};margin-bottom:8px;text-align:center;}
.ss-concept-b{font-size:18px;font-weight:700;color:${T.accent};margin-bottom:16px;text-align:center;}
.ss-input{width:100%;max-width:480px;padding:13px 16px;background:${T.s2};border:1.5px solid ${T.border};border-radius:13px;color:${T.text};font-family:'Chillax';font-size:15px;font-weight:500;outline:none;text-align:center;transition:border-color 0.18s;margin-bottom:10px;}
.ss-input:focus{border-color:${T.accent};}
.ss-heat-bar{width:100%;max-width:480px;height:8px;border-radius:4px;background:${T.s3};margin-bottom:16px;overflow:hidden;}
.ss-heat-fill{height:8px;border-radius:4px;transition:width 0.5s,background 0.5s;}
.ss-result-row{display:flex;gap:8px;width:100%;max-width:480px;margin-bottom:8px;}
.ss-result-chip{flex:1;padding:10px;border-radius:10px;text-align:center;font-size:12px;font-weight:600;}
.ss-submit{padding:11px 28px;border-radius:12px;border:none;background:${T.accent};color:white;font-family:'Chillax';font-size:14px;font-weight:600;cursor:pointer;transition:all 0.15s;width:100%;max-width:480px;}
.ss-submit:hover{background:${T.accentHover};}

/* ─────────────────────────────────────────────────────────────
   SIGNAL vs NOISE
───────────────────────────────────────────────────────────── */
.sn-stream{display:flex;flex-direction:column;gap:10px;width:100%;max-width:520px;height:340px;overflow:hidden;position:relative;}
.sn-item{padding:12px 18px;border-radius:12px;border:1.5px solid ${T.border};background:${T.cardBg};font-size:14px;font-weight:500;cursor:pointer;transition:all 0.18s;display:flex;align-items:center;justify-content:space-between;animation:slide-in 0.35s ease;}
@keyframes slide-in{from{transform:translateY(-20px);opacity:0;}to{transform:translateY(0);opacity:1;}}
.sn-item:hover{border-color:${T.accent};background:${T.glow};}
.sn-item.correct{border-color:${T.green};background:rgba(52,211,153,0.12);animation:flash-correct 0.5s ease;}
.sn-item.wrong{border-color:${T.red};background:rgba(248,113,113,0.12);animation:flash-wrong 0.4s ease;}
@keyframes flash-correct{0%,100%{transform:scale(1);}50%{transform:scale(1.02);}}
@keyframes flash-wrong{0%,100%{transform:translateX(0);}25%{transform:translateX(-6px);}75%{transform:translateX(6px);}}
.sn-label{font-size:11px;font-weight:700;padding:2px 8px;border-radius:6px;text-transform:uppercase;letter-spacing:0.05em;}
.sn-speed-bar{width:100%;max-width:520px;height:4px;border-radius:2px;background:${T.s3};margin-top:16px;overflow:hidden;}
.sn-speed-fill{height:4px;border-radius:2px;background:${T.accent};transition:width 0.1s linear;}
.sn-stats-row{display:flex;gap:12px;margin-top:14px;}
.sn-stat{text-align:center;background:${T.cardBg};border:1px solid ${T.border};border-radius:12px;padding:10px 18px;}
.sn-stat-n{font-size:20px;font-weight:700;letter-spacing:-0.5px;}
.sn-stat-l{font-size:10px;color:${T.muted};text-transform:uppercase;letter-spacing:0.06em;font-weight:600;}

/* ─────────────────────────────────────────────────────────────
   PRESSURE COOKER
───────────────────────────────────────────────────────────── */
.pc-card{background:${isDark?"linear-gradient(135deg,#1a1a38,#2a1a50)":"linear-gradient(135deg,#f0eeff,#e2dcff)"};border:1.5px solid ${T.b2};border-radius:20px;padding:24px 28px;max-width:500px;width:100%;margin-bottom:20px;min-height:140px;display:flex;flex-direction:column;justify-content:center;}
.pc-card-q{font-size:18px;font-weight:600;color:${T.text};letter-spacing:-0.2px;text-align:center;line-height:1.4;}
.pc-timer-ring{position:relative;width:80px;height:80px;margin:0 auto 18px;}
.pc-timer-svg{transform:rotate(-90deg);}
.pc-timer-text{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;font-family:'JetBrains Mono';color:${T.accent};}
.pc-btn-row{display:flex;gap:10px;width:100%;max-width:500px;}
.pc-know{flex:1;padding:13px;border-radius:13px;border:none;background:${T.green};color:white;font-family:'Chillax';font-size:14px;font-weight:700;cursor:pointer;transition:all 0.15s;}
.pc-know:hover{opacity:0.88;transform:translateY(-1px);}
.pc-dontknow{flex:1;padding:13px;border-radius:13px;border:none;background:${T.red};color:white;font-family:'Chillax';font-size:14px;font-weight:700;cursor:pointer;transition:all 0.15s;}
.pc-dontknow:hover{opacity:0.88;transform:translateY(-1px);}
.pc-progress{display:flex;gap:4px;flex-wrap:wrap;width:100%;max-width:500px;margin-top:14px;}
.pc-pip{width:12px;height:12px;border-radius:4px;transition:background 0.2s;}

/* ─────────────────────────────────────────────────────────────
   ECHO CHAMBER
───────────────────────────────────────────────────────────── */
.ec-show-card{background:${isDark?"linear-gradient(135deg,#1a0a3d,#2d1b69)":"linear-gradient(135deg,#9D79FF,#7c5cfc)"};border-radius:18px;padding:22px 26px;max-width:480px;width:100%;margin-bottom:18px;animation:fade-in 0.4s ease;}
@keyframes fade-in{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
.ec-def-text{font-size:16px;color:white;line-height:1.6;font-weight:500;}
.ec-window{font-size:12px;font-family:'JetBrains Mono';color:rgba(255,255,255,0.6);margin-bottom:8px;display:flex;align-items:center;gap:6px;}
.ec-window-pip{display:inline-block;width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.4);}
.ec-textarea{width:100%;max-width:480px;min-height:100px;padding:14px 16px;background:${T.s2};border:1.5px solid ${T.border};border-radius:13px;color:${T.text};font-family:'Chillax';font-size:14px;font-weight:500;outline:none;resize:none;transition:border-color 0.18s;line-height:1.6;margin-bottom:12px;}
.ec-textarea:focus{border-color:${T.accent};}
.ec-score-bar{width:100%;max-width:480px;height:8px;border-radius:4px;background:${T.s3};overflow:hidden;margin-bottom:10px;}
.ec-score-fill{height:8px;border-radius:4px;background:linear-gradient(90deg,${T.accent},#34d399);transition:width 0.7s ease;}
.ec-result-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:10px;font-size:13px;font-weight:600;margin-bottom:14px;}
.ec-submit{padding:11px 28px;border-radius:12px;border:none;background:${T.accent};color:white;font-family:'Chillax';font-size:14px;font-weight:600;cursor:pointer;transition:all 0.15s;width:100%;max-width:480px;}
.ec-submit:hover{background:${T.accentHover};}

/* ── Misc ── */
.btn-p{padding:9px 22px;border-radius:11px;border:none;background:${T.accent};color:white;font-family:'Chillax';font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s;}
.btn-p:hover{background:${T.accentHover};transform:translateY(-1px);}
.btn-s{padding:9px 18px;border-radius:11px;border:1px solid ${T.border};background:${T.pill};color:${T.text};font-family:'Chillax';font-size:13px;font-weight:500;cursor:pointer;transition:all 0.15s;}
.btn-s:hover{background:${T.s2};}
.done-wrap{display:flex;flex-direction:column;align-items:center;gap:14px;padding:32px 20px;}
.done-title{font-size:22px;font-weight:700;letter-spacing:-0.4px;}
.done-xp{background:${T.glow};border:1px solid ${T.border};border-radius:14px;padding:10px 20px;font-size:15px;font-weight:700;color:${T.accent};}
.timer-bar{width:100%;height:4px;border-radius:2px;background:${T.s3};overflow:hidden;margin-bottom:14px;}
.timer-fill{height:4px;border-radius:2px;background:${T.accent};transition:width 0.1s linear;}

scrollbar-width:thin;scrollbar-color:rgba(157,121,255,0.3) transparent;
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:rgba(157,121,255,0.3);border-radius:4px;}
`;

  const navItems: { id: GameId; icon: string; label: string; sub: string; color: string }[] = [
    { id: "hub", icon: "🏠", label: "Game Hub", sub: "All games", color: "#9D79FF" },
    { id: "neural", icon: "🧠", label: "NEURAL", sub: "Signature game", color: "#9D79FF" },
    { id: "semantic-sprint", icon: "⚡", label: "Semantic Sprint", sub: "Word connections", color: "#34d399" },
    { id: "signal-noise", icon: "📡", label: "Signal vs Noise", sub: "Inhibition training", color: "#60a5fa" },
    { id: "pressure-cooker", icon: "⏱️", label: "Pressure Cooker", sub: "Metacognition", color: "#fbbf24" },
    { id: "echo-chamber", icon: "🔮", label: "Echo Chamber", sub: "Free recall", color: "#f87171" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="lg-root">
        {/* Topbar */}
        <div className="lg-top">
          <div className="lg-logo">
            <div className="lg-logo-dot" />
            lumiu
          </div>
          <span className="lg-badge">Gamification</span>
          <div className="lg-top-right">
            <div className="lg-streak">🔥 {streak} day streak</div>
            <div className="lg-xp-bar">
              <span className="lg-level">Lv.{level} · {levelName(level)}</span>
              <div className="lg-xp-bg">
                <div className="lg-xp-fill" style={{ width: `${(xpInLevel / XP_PER_LEVEL) * 100}%` }} />
              </div>
              <span style={{ fontSize: 11, color: T.muted, fontFamily: "'JetBrains Mono'" }}>{xpInLevel}/{XP_PER_LEVEL} XP</span>
            </div>
            <button className="theme-toggle" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>
              {theme === "dark" ? "🌙" : "☀️"}
              <div className="tog-track"><div className="tog-thumb" /></div>
              {theme === "dark" ? "Dark" : "Light"}
            </button>
          </div>
        </div>

        <div className="lg-body">
          {/* Sidebar */}
          <div className="lg-sidebar">
            <div className="lg-section-label">Games</div>
            {navItems.map(n => (
              <button key={n.id} className={`lg-nav-btn ${game === n.id ? "active" : ""}`} onClick={() => setGame(n.id)}>
                <div className="lg-nav-icon" style={{ background: game === n.id ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)" }}>
                  {n.icon}
                </div>
                <div>
                  {n.label}
                  <span className="lg-nav-sub">{n.sub}</span>
                </div>
              </button>
            ))}
            <div className="lg-divider" />
            <div className="lg-section-label">My Stats</div>
            <div className="lg-stat-grid">
              <div className="lg-stat">
                <div className="lg-stat-num">{totalGames}</div>
                <div className="lg-stat-lbl">Games</div>
              </div>
              <div className="lg-stat">
                <div className="lg-stat-num">{streak}</div>
                <div className="lg-stat-lbl">Streak</div>
              </div>
              <div className="lg-stat">
                <div className="lg-stat-num">{bestChain}</div>
                <div className="lg-stat-lbl">Best Chain</div>
              </div>
              <div className="lg-stat">
                <div className="lg-stat-num">{xp}</div>
                <div className="lg-stat-lbl">Total XP</div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg-main">
            {game === "hub" && <Hub T={T} setGame={setGame} isDark={isDark} />}
            {game === "neural" && <NeuralGame T={T} isDark={isDark} addXp={addXp} setBestChain={setBestChain} setTotalGames={setTotalGames} goBack={() => setGame("hub")} />}
            {game === "semantic-sprint" && <SemanticSprint T={T} isDark={isDark} addXp={addXp} setTotalGames={setTotalGames} goBack={() => setGame("hub")} />}
            {game === "signal-noise" && <SignalNoise T={T} isDark={isDark} addXp={addXp} setTotalGames={setTotalGames} goBack={() => setGame("hub")} />}
            {game === "pressure-cooker" && <PressureCooker T={T} isDark={isDark} addXp={addXp} setTotalGames={setTotalGames} goBack={() => setGame("hub")} />}
            {game === "echo-chamber" && <EchoChamber T={T} isDark={isDark} addXp={addXp} setTotalGames={setTotalGames} goBack={() => setGame("hub")} />}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Hub ──────────────────────────────────────────────────────────────────────
function Hub({ T, setGame, isDark }: { T: any; setGame: (g: GameId) => void; isDark: boolean }) {
  const games = [
    { id: "neural" as GameId, icon: "🧠", color: "#9D79FF", bg: isDark ? "rgba(157,121,255,0.15)" : "rgba(157,121,255,0.1)", label: "NEURAL", desc: "Rhythm-based knowledge chain game. Type connections from your deck on each beat. Build the longest chain.", tags: ["memory","typing","rhythm"], tagColors: ["#9D79FF","#60a5fa","#34d399"] },
    { id: "semantic-sprint" as GameId, icon: "⚡", color: "#34d399", bg: isDark ? "rgba(52,211,153,0.12)" : "rgba(52,211,153,0.08)", label: "Semantic Sprint", desc: "Connect two concepts with a typed bridge. AI scores your semantic closeness — no right/wrong binary.", tags: ["connections","ai","open-ended"], tagColors: ["#34d399","#9D79FF","#60a5fa"] },
    { id: "signal-noise" as GameId, icon: "📡", color: "#60a5fa", bg: isDark ? "rgba(96,165,250,0.12)" : "rgba(96,165,250,0.08)", label: "Signal vs Noise", desc: "Real deck terms stream down. Tap only the real ones. Imposters are AI-generated lookalikes. Speed increases.", tags: ["focus","inhibition","speed"], tagColors: ["#60a5fa","#f87171","#fbbf24"] },
    { id: "pressure-cooker" as GameId, icon: "⏱️", color: "#fbbf24", bg: isDark ? "rgba(251,191,36,0.1)" : "rgba(251,191,36,0.07)", label: "Pressure Cooker", desc: "60 seconds. Sort cards into Know / Don't Know. Trains metacognition — understanding what you actually know.", tags: ["metacognition","timed","sort"], tagColors: ["#fbbf24","#f87171","#9D79FF"] },
    { id: "echo-chamber" as GameId, icon: "🔮", color: "#f87171", bg: isDark ? "rgba(248,113,113,0.1)" : "rgba(248,113,113,0.07)", label: "Echo Chamber", desc: "See a definition for 4 seconds. Then type back the core idea. Window shortens as you improve. Free recall training.", tags: ["recall","typing","compulsion"], tagColors: ["#f87171","#9D79FF","#34d399"] },
  ];

  const achievements = [
    { icon: "🔥", title: "7-Day Streak", sub: "Logged in 7 days", unlocked: true },
    { icon: "⛓️", title: "Chain Master", sub: "Chain of 10+ in NEURAL", unlocked: true },
    { icon: "🎯", title: "Signal Pure", sub: "100% accuracy in S/N", unlocked: false },
    { icon: "⚡", title: "Speed Recall", sub: "Echo at 1s window", unlocked: false },
    { icon: "🌌", title: "Voidwalker", sub: "Reach level 7", unlocked: false },
    { icon: "💡", title: "Metacog Pro", sub: "100% Pressure accuracy", unlocked: false },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="hub-hero">
        <svg className="hub-stars" viewBox="0 0 600 140">
          {Array.from({ length: 40 }, (_, i) => (
            <circle key={i} cx={Math.random() * 600} cy={Math.random() * 140} r={0.5 + Math.random() * 1.5} fill="white" opacity={0.3 + Math.random() * 0.4}>
              <animate attributeName="opacity" values={`${0.2 + Math.random() * 0.3};${0.7 + Math.random() * 0.3};${0.2 + Math.random() * 0.3}`} dur={`${2 + Math.random() * 3}s`} begin={`${Math.random() * 4}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
        <div style={{ position: "relative" }}>
          <div className="hub-hero-title">🌌 Galaxy of Knowledge</div>
          <div className="hub-hero-sub">5 neurodivergent-friendly games · powered by your flashcard deck · every session is studying</div>
          <button className="hub-hero-btn" onClick={() => setGame("neural")}>▶ Play NEURAL — Signature Game</button>
        </div>
      </div>

      {/* Game cards */}
      <div className="sec-title">
        <span>All Games</span>
        <span style={{ fontSize: 12, fontWeight: 400, color: T.muted }}>tap any to play</span>
      </div>
      <div className="games-grid">
        {games.map(g => (
          <div key={g.id} className="game-card" onClick={() => setGame(g.id)} style={{ background: g.bg }}>
            <div className="game-card-icon" style={{ background: `${g.color}22`, fontSize: 24 }}>{g.icon}</div>
            <div className="game-card-title">{g.label}</div>
            <div className="game-card-desc">{g.desc}</div>
            <div className="game-card-tags">
              {g.tags.map((tag, i) => (
                <span key={tag} className="game-tag" style={{ background: `${g.tagColors[i]}22`, color: g.tagColors[i] }}>{tag}</span>
              ))}
            </div>
            <button className="game-card-play" style={{ background: g.color }}>Play →</button>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="sec-title" style={{ marginTop: 8 }}>
        <span>Achievements</span>
        <span style={{ fontSize: 12, fontWeight: 400, color: T.muted }}>{achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked</span>
      </div>
      <div className="ach-row">
        {achievements.map(a => (
          <div key={a.title} className={`ach ${a.unlocked ? "" : "locked"}`}>
            <div className="ach-icon">{a.icon}</div>
            <div>
              <div className="ach-title">{a.title}</div>
              <div className="ach-sub">{a.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NEURAL GAME ──────────────────────────────────────────────────────────────
function NeuralGame({ T, isDark, addXp, setBestChain, setTotalGames, goBack }: any) {
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [centerConcept] = useState(() => CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)]);
  const [chain, setChain] = useState<{ text: string; score: number }[]>([]);
  const [input, setInput] = useState("");
  const [beat, setBeat] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [feedback, setFeedback] = useState<{ text: string; good: boolean } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Beat timer
  useEffect(() => {
    if (phase !== "play") return;
    const iv = setInterval(() => {
      setBeat(b => (b + 1) % 100);
      setTimeLeft(t => {
        if (t <= 1) { setPhase("done"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [phase]);

  const submit = () => {
    if (!input.trim()) return;
    const val = input.trim().toLowerCase();
    const known = centerConcept.connections.map((c: string) => c.toLowerCase());
    const isGood = known.some((k: string) => val.includes(k.split(" ")[0]) || k.includes(val.split(" ")[0])) || val.length > 3;
    const score = isGood ? Math.floor(60 + Math.random() * 35) : Math.floor(20 + Math.random() * 30);
    setChain(prev => [...prev, { text: input.trim(), score }]);
    setFeedback({ text: isGood ? `+${score} semantic` : `weak link (${score})`, good: isGood });
    setInput("");
    setTimeout(() => setFeedback(null), 1200);
    inputRef.current?.focus();
  };

  const handleDone = () => {
    const xpGained = chain.length * 18 + (chain.length >= 5 ? 50 : 0);
    addXp(xpGained);
    setBestChain((p: number) => Math.max(p, chain.length));
    setTotalGames((p: number) => p + 1);
  };

  // SVG node positions
  const nodeRadius = 180;
  const centerX = 300, centerY = 210;
  const nodes = chain.slice(-6).map((c, i, arr) => {
    const angle = (i / Math.max(arr.length, 6)) * Math.PI * 2 - Math.PI / 2;
    return { x: centerX + nodeRadius * Math.cos(angle), y: centerY + nodeRadius * Math.sin(angle), ...c };
  });

  if (phase === "intro") return (
    <div className="game-shell">
      <div className="game-header">
        <button className="game-header-back" onClick={goBack}>←</button>
        <div><div className="game-title">🧠 NEURAL</div><div className="game-subtitle">Signature game · rhythm-based knowledge chain</div></div>
      </div>
      <div className="game-body" style={{ gap: 16, textAlign: "center" }}>
        <div style={{ fontSize: 56 }}>🧠</div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.4px" }}>How to play NEURAL</div>
        <div style={{ maxWidth: 420, color: T.muted, fontSize: 14, lineHeight: 1.7 }}>
          A concept from your deck appears in the centre. On each beat, type one thing that <strong style={{ color: T.text }}>connects to it</strong>. Build the longest chain you can in 60 seconds.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, maxWidth: 400, marginTop: 8 }}>
          {[["🎵", "Follow the beat", "Type one word per pulse"], ["⛓️", "Build a chain", "Each connection extends it"], ["🌟", "Earn XP", "+18 XP per valid link"]].map(([icon, title, sub]) => (
            <div key={title} style={{ background: T.s2, borderRadius: 14, padding: "14px 10px", textAlign: "center", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 11, color: T.muted }}>{sub}</div>
            </div>
          ))}
        </div>
        <button className="btn-p" style={{ marginTop: 8, padding: "12px 36px", fontSize: 15 }} onClick={() => { setPhase("play"); setTimeout(() => inputRef.current?.focus(), 100); }}>
          ▶ Start Game
        </button>
      </div>
    </div>
  );

  if (phase === "done") return (
    <div className="game-shell">
      <div className="game-header">
        <button className="game-header-back" onClick={goBack}>←</button>
        <div><div className="game-title">🧠 NEURAL — Complete</div></div>
      </div>
      <div className="done-wrap">
        <div style={{ fontSize: 52 }}>🎉</div>
        <div className="done-title">Chain of {chain.length}!</div>
        <div className="done-xp">+{chain.length * 18 + (chain.length >= 5 ? 50 : 0)} XP earned</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", maxWidth: 480 }}>
          {chain.map((c, i) => (
            <span key={i} style={{ background: T.s2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 500 }}>
              {c.text} <span style={{ color: T.accent, fontFamily: "'JetBrains Mono'" }}>{c.score}</span>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button className="btn-s" onClick={goBack}>Back to Hub</button>
          <button className="btn-p" onClick={() => { setPhase("intro"); setChain([]); setTimeLeft(60); handleDone(); }}>Play Again</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="game-shell">
      <div className="game-header">
        <button className="game-header-back" onClick={goBack}>←</button>
        <div><div className="game-title">🧠 NEURAL</div><div className="game-subtitle">Type connections to {centerConcept.term}</div></div>
        <div className="score-pill">⛓️ {chain.length}</div>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 600, color: timeLeft <= 10 ? T.red : T.accent, marginLeft: 8 }}>{timeLeft}s</div>
      </div>
      <div className="timer-bar"><div className="timer-fill" style={{ width: `${(timeLeft / 60) * 100}%`, background: timeLeft <= 10 ? T.red : T.accent }} /></div>
      <div className="game-body">
        {/* SVG graph */}
        <div className="neural-canvas">
          <svg width="600" height="420" viewBox="0 0 600 420" style={{ position: "absolute", inset: 0 }}>
            {/* Beat rings */}
            {[120, 170, 220].map((r, i) => (
              <circle key={r} cx={centerX} cy={centerY} r={r} fill="none" stroke={T.accent} strokeWidth={0.5} opacity={0.12 + i * 0.04} />
            ))}
            {/* Beat pulse ring */}
            <circle cx={centerX} cy={centerY} r={84 + (beat % 20) * 0.5} fill="none" stroke={T.accent} strokeWidth={1.5} opacity={0.5}>
              <animate attributeName="r" values="80;90;80" dur="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.8;0.5" dur="1s" repeatCount="indefinite" />
            </circle>
            {/* Connection lines */}
            {nodes.map((n, i) => (
              <line key={i} x1={centerX} y1={centerY} x2={n.x} y2={n.y} stroke={T.accent} strokeWidth={1} opacity={0.35} strokeDasharray="4,3" />
            ))}
            {/* Chain nodes */}
            {nodes.map((n, i) => (
              <g key={i}>
                <circle cx={n.x} cy={n.y} r={30} fill={isDark ? "#1a1a38" : "#ede9ff"} stroke={T.accent} strokeWidth={1.5} />
                <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" fill={T.text} fontSize={9} fontFamily="Chillax" fontWeight="600">
                  {n.text.length > 10 ? n.text.slice(0, 9) + "…" : n.text}
                </text>
                <text x={n.x} y={n.y + 16} textAnchor="middle" fill={T.accent} fontSize={8} fontFamily="JetBrains Mono">{n.score}</text>
              </g>
            ))}
            {/* Center node */}
            <circle cx={centerX} cy={centerY} r={56} fill={isDark ? "#2a1a50" : "#9D79FF"} stroke={T.accent} strokeWidth={2} />
            <text x={centerX} y={centerY - 6} textAnchor="middle" fill="white" fontSize={11} fontFamily="Chillax" fontWeight="700">
              {centerConcept.term.length > 14 ? centerConcept.term.slice(0, 13) + "…" : centerConcept.term}
            </text>
            <text x={centerX} y={centerY + 10} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={8} fontFamily="JetBrains Mono">NEURAL CORE</text>
          </svg>
        </div>

        {/* Feedback */}
        {feedback && (
          <div style={{ fontSize: 13, fontWeight: 700, color: feedback.good ? T.green : T.muted, fontFamily: "'JetBrains Mono'", minHeight: 22, transition: "all 0.2s" }}>
            {feedback.text}
          </div>
        )}
        {!feedback && <div style={{ minHeight: 22 }} />}

        {/* Input */}
        <div className="neural-input-row">
          <input
            ref={inputRef}
            className="neural-input"
            placeholder={`What connects to "${centerConcept.term}"?`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            autoFocus
          />
          <button className="neural-submit" onClick={submit}>→</button>
        </div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 6, fontFamily: "'JetBrains Mono'" }}>press Enter on each beat</div>
      </div>
    </div>
  );
}

// ─── SEMANTIC SPRINT ──────────────────────────────────────────────────────────
function SemanticSprint({ T, isDark, addXp, setTotalGames, goBack }: any) {
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [heatScore, setHeatScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<{ a: string; b: string; conn: string; score: number }[]>([]);
  const TOTAL_ROUNDS = 6;

  const pairs = useRef(Array.from({ length: TOTAL_ROUNDS }, () => {
    const a = CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)];
    const b = CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)];
    return { a: a.term, b: b.term };
  })).current;

  const currentPair = pairs[round];

  const submit = () => {
    if (!input.trim() || submitted) return;
    const heat = Math.floor(30 + Math.random() * 65);
    setHeatScore(heat);
    setSubmitted(true);
    setScore(s => s + heat);
    setHistory(h => [...h, { a: currentPair.a, b: currentPair.b, conn: input, score: heat }]);
  };

  const next = () => {
    if (round + 1 >= TOTAL_ROUNDS) {
      addXp(Math.floor(score / 6 * 0.5));
      setTotalGames((p: number) => p + 1);
      setPhase("done");
    } else {
      setRound(r => r + 1);
      setInput("");
      setHeatScore(0);
      setSubmitted(false);
    }
  };

  const heatColor = heatScore >= 80 ? T.green : heatScore >= 50 ? T.amber : T.red;

  if (phase === "intro") return (
    <div className="game-shell">
      <div className="game-header">
        <button className="game-header-back" onClick={goBack}>←</button>
        <div><div className="game-title">⚡ Semantic Sprint</div><div className="game-subtitle">Bridge two concepts · AI scores your connection</div></div>
      </div>
      <div className="game-body" style={{ gap: 14, textAlign: "center" }}>
        <div style={{ fontSize: 52 }}>⚡</div>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px" }}>Connect two concepts</div>
        <div style={{ maxWidth: 400, color: T.muted, fontSize: 13, lineHeight: 1.7 }}>
          Two concepts appear. Type one word or phrase that semantically bridges them. The AI scores your closeness — no binary right/wrong. Partial knowledge earns partial credit.
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {["Removes anxiety", "Rewards nuance", "Deep encoding"].map(t => (
            <span key={t} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 8, background: T.glow, color: T.accent, border: `1px solid ${T.border}`, fontWeight: 600 }}>{t}</span>
          ))}
        </div>
        <button className="btn-p" style={{ marginTop: 8, padding: "11px 32px" }} onClick={() => setPhase("play")}>Start →</button>
      </div>
    </div>
  );

  if (phase === "done") return (
    <div className="game-shell">
      <div className="game-header">
        <button className="game-header-back" onClick={goBack}>←</button>
        <div><div className="game-title">⚡ Semantic Sprint — Done</div></div>
      </div>
      <div className="done-wrap">
        <div style={{ fontSize: 48 }}>⚡</div>
        <div className="done-title">Avg score: {Math.round(score / TOTAL_ROUNDS)}</div>
        <div className="done-xp">+{Math.floor(score / 6 * 0.5)} XP</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7, width: "100%", maxWidth: 440 }}>
          {history.map((h, i) => (
            <div key={i} style={{ background: T.s2, borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 10, border: `1px solid ${T.border}`, fontSize: 12 }}>
              <span style={{ fontWeight: 600, color: T.text }}>{h.a}</span>
              <span style={{ color: T.muted }}>→</span>
              <span style={{ color: T.accent, fontWeight: 600 }}>"{h.conn}"</span>
              <span style={{ color: T.muted }}>→</span>
              <span style={{ fontWeight: 600, color: T.text }}>{h.b}</span>
              <span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono'", fontWeight: 700, color: h.score >= 80 ? T.green : h.score >= 50 ? T.amber : T.red }}>{h.score}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-s" onClick={goBack}>Hub</button>
          <button className="btn-p" onClick={() => { setPhase("intro"); setRound(0); setScore(0); setHistory([]); setSubmitted(false); }}>Again</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="game-shell">
      <div className="game-header">
        <button className="game-header-back" onClick={goBack}>←</button>
        <div><div className="game-title">⚡ Semantic Sprint</div><div className="game-subtitle">Round {round + 1} of {TOTAL_ROUNDS}</div></div>
        <div className="score-pill">Avg: {round > 0 ? Math.round(score / round) : "—"}</div>
      </div>
      <div className="game-body" style={{ gap: 10 }}>
        <div className="ss-concept-card">
          <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", opacity: 0.55, marginBottom: 10, letterSpacing: "0.08em" }}>CONCEPT A</div>
          <div className="ss-concept-main">{currentPair.a}</div>
        </div>
        <div className="ss-connector">What semantically bridges</div>
        <div className="ss-concept-b">{currentPair.a} → ??? → {currentPair.b}</div>
        <input className="ss-input" placeholder="Type your bridge word or phrase…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !submitted && submit()} disabled={submitted} autoFocus={!submitted} />
        {submitted ? (
          <>
            <div className="ss-heat-bar"><div className="ss-heat-fill" style={{ width: `${heatScore}%`, background: heatColor }} /></div>
            <div className="ss-result-row">
              <div className="ss-result-chip" style={{ background: `${heatColor}18`, color: heatColor }}>
                Semantic score: <strong style={{ fontFamily: "'JetBrains Mono'" }}>{heatScore}</strong>
              </div>
              <div className="ss-result-chip" style={{ background: T.s2, color: T.muted, flex: "unset", padding: "10px 14px" }}>
                {heatScore >= 80 ? "🔥 Strong connection" : heatScore >= 50 ? "✓ Valid bridge" : "↗ Weak but partial credit"}
              </div>
            </div>
            <button className="ss-submit" onClick={next}>{round + 1 >= TOTAL_ROUNDS ? "See Results →" : "Next →"}</button>
          </>
        ) : (
          <button className="ss-submit" onClick={submit}>Submit Bridge →</button>
        )}
      </div>
    </div>
  );
}

// ─── SIGNAL vs NOISE ──────────────────────────────────────────────────────────
function SignalNoise({ T, isDark, addXp, setTotalGames, goBack }: any) {
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [items, setItems] = useState<{ id: string; text: string; isReal: boolean; state: "idle" | "correct" | "wrong" }[]>([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [speed, setSpeed] = useState(0);

  const buildItems = useCallback(() => {
    const pool: typeof items = [];
    // Pick 3–4 real concepts
    const real = CONCEPTS.sort(() => Math.random() - 0.5).slice(0, 4);
    real.forEach(c => pool.push({ id: uid(), text: c.term, isReal: true, state: "idle" }));
    // Pick 2–3 imposters
    const fakes = IMPOSTERS.sort(() => Math.random() - 0.5).slice(0, 3);
    fakes.forEach(f => pool.push({ id: uid(), text: f, isReal: false, state: "idle" }));
    return pool.sort(() => Math.random() - 0.5).slice(0, 5);
  }, []);

  useEffect(() => {
    if (phase !== "play") return;
    setItems(buildItems());
    const iv = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setPhase("done"); return 0; }
        return t - 1;
      });
      setSpeed(s => Math.min(s + 1, 100));
      // Refresh items every 5s
      if (Math.random() < 0.2) setItems(buildItems());
    }, 1000);
    return () => clearInterval(iv);
  }, [phase, buildItems]);

  const tap = (id: string, isReal: boolean) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, state: isReal ? "correct" : "wrong" } : it));
    if (isReal) setScore(s => s + 10);
    else setMisses(m => m + 1);
    setTimeout(() => {
      setItems(prev => prev.map(it => it.id === id ? { ...it, state: "idle" } : it));
    }, 600);
  };

  if (phase === "intro") return (
    <div className="game-shell">
      <div className="game-header">
        <button className="game-header-back" onClick={goBack}>←</button>
        <div><div className="game-title">📡 Signal vs Noise</div><div className="game-subtitle">Tap real terms · ignore imposters</div></div>
      </div>
      <div className="game-body" style={{ gap: 14, textAlign: "center" }}>
        <div style={{ fontSize: 52 }}>📡</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Separate real from fake</div>
        <div style={{ maxWidth: 400, color: T.muted, fontSize: 13, lineHeight: 1.7 }}>
          Terms from your deck stream down. Some are real, some are AI-generated lookalikes. Tap only the real ones. Speed increases over time. Trains inhibitory control — clinically weak in ADHD.
        </div>
        <button className="btn-p" style={{ padding: "11px 32px" }} onClick={() => setPhase("play")}>Start Signal →</button>
      </div>
    </div>
  );

  if (phase === "done") {
    addXp(score + Math.max(0, 50 - misses * 10));
    setTotalGames((p: number) => p + 1);
    return (
      <div className="game-shell">
        <div className="game-header">
          <button className="game-header-back" onClick={goBack}>←</button>
          <div><div className="game-title">📡 Signal vs Noise — Done</div></div>
        </div>
        <div className="done-wrap">
          <div style={{ fontSize: 48 }}>📡</div>
          <div className="done-title">Score: {score}</div>
          <div className="done-xp">+{score + Math.max(0, 50 - misses * 10)} XP</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, width: "100%", maxWidth: 360 }}>
            {[{ n: score, l: "Signal hits", c: T.green }, { n: misses, l: "False taps", c: T.red }, { n: Math.round(score / Math.max(score + misses * 10, 1) * 100), l: "Accuracy %", c: T.accent }].map(s => (
              <div key={s.l} className="sn-stat"><div className="sn-stat-n" style={{ color: s.c }}>{s.n}</div><div className="sn-stat-l">{s.l}</div></div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-s" onClick={goBack}>Hub</button>
            <button className="btn-p" onClick={() => { setPhase("intro"); setScore(0); setMisses(0); setTimeLeft(45); setSpeed(0); }}>Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-shell">
      <div className="game-header">
        <button className="game-header-back" onClick={goBack}>←</button>
        <div><div className="game-title">📡 Signal vs Noise</div><div className="game-subtitle">Tap real terms only</div></div>
        <div className="score-pill">+{score}</div>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 600, color: timeLeft <= 10 ? T.red : T.accent, marginLeft: 8 }}>{timeLeft}s</div>
      </div>
      <div className="timer-bar"><div className="timer-fill" style={{ width: `${(timeLeft / 45) * 100}%`, background: timeLeft <= 10 ? T.red : T.accent }} /></div>
      <div className="game-body" style={{ gap: 10, justifyContent: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: T.green, fontWeight: 600 }}>● Real terms: tap</span>
          <span style={{ fontSize: 12, color: T.red, fontWeight: 600 }}>● Imposters: ignore</span>
          <span style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginLeft: "auto" }}>Misses: {misses}</span>
        </div>
        <div className="sn-stream">
          {items.map(it => (
            <div key={it.id} className={`sn-item ${it.state}`} onClick={() => tap(it.id, it.isReal)}>
              <span>{it.text}</span>
              {it.state === "correct" && <span className="sn-label" style={{ background: `${T.green}22`, color: T.green }}>REAL ✓</span>}
              {it.state === "wrong" && <span className="sn-label" style={{ background: `${T.red}22`, color: T.red }}>FAKE ✕</span>}
              {it.state === "idle" && <span style={{ fontSize: 11, color: T.muted }}>tap?</span>}
            </div>
          ))}
        </div>
        <div className="sn-speed-bar"><div className="sn-speed-fill" style={{ width: `${speed}%` }} /></div>
        <div style={{ fontSize: 10, color: T.muted, fontFamily: "'JetBrains Mono'" }}>speed increasing ↑</div>
      </div>
    </div>
  );
}

// ─── PRESSURE COOKER ──────────────────────────────────────────────────────────
function PressureCooker({ T, isDark, addXp, setTotalGames, goBack }: any) {
  const [phase, setPhase] = useState<"intro" | "play" | "review" | "done">("intro");
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answers, setAnswers] = useState<{ term: string; userKnows: boolean }[]>([]);
  const cards = useRef(CONCEPTS.sort(() => Math.random() - 0.5)).current;

  useEffect(() => {
    if (phase !== "play") return;
    const iv = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setPhase("review"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [phase]);

  const respond = (knows: boolean) => {
    setAnswers(prev => [...prev, { term: cards[index].term, userKnows: knows }]);
    if (index + 1 >= cards.length) setPhase("review");
    else setIndex(i => i + 1);
  };

  const circumference = 2 * Math.PI * 32;
  const progress = timeLeft / 60;

  if (phase === "intro") return (
    <div className="game-shell">
      <div className="game-header">
        <button className="game-header-back" onClick={goBack}>←</button>
        <div><div className="game-title">⏱️ Pressure Cooker</div><div className="game-subtitle">Metacognition trainer · 60 seconds</div></div>
      </div>
      <div className="game-body" style={{ gap: 14, textAlign: "center" }}>
        <div style={{ fontSize: 52 }}>⏱️</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Know it or not?</div>
        <div style={{ maxWidth: 420, color: T.muted, fontSize: 13, lineHeight: 1.7 }}>
          Terms flash for 2 seconds each. Sort them: Know It / Don't Know. You're not being tested on the answer — you're training the ability to know what you know. Metacognitive accuracy is one of the strongest predictors of exam performance.
        </div>
        <button className="btn-p" style={{ padding: "11px 32px" }} onClick={() => setPhase("play")}>Start Timer →</button>
      </div>
    </div>
  );

  if (phase === "review" || phase === "done") {
    const knewCount = answers.filter(a => a.userKnows).length;
    if (phase === "review") {
      addXp(answers.length * 8);
      setTotalGames((p: number) => p + 1);
    }
    return (
      <div className="game-shell">
        <div className="game-header">
          <button className="game-header-back" onClick={goBack}>←</button>
          <div><div className="game-title">⏱️ Pressure Cooker — Results</div></div>
        </div>
        <div className="done-wrap">
          <div style={{ fontSize: 48 }}>⏱️</div>
          <div className="done-title">{answers.length} cards sorted</div>
          <div className="done-xp">+{answers.length * 8} XP</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxWidth: 300 }}>
            <div className="sn-stat"><div className="sn-stat-n" style={{ color: T.green }}>{knewCount}</div><div className="sn-stat-l">Knew it</div></div>
            <div className="sn-stat"><div className="sn-stat-n" style={{ color: T.red }}>{answers.length - knewCount}</div><div className="sn-stat-l">Unsure</div></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", maxWidth: 420 }}>
            {answers.slice(0, 6).map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: T.s2, borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 13 }}>
                <span style={{ fontSize: 16 }}>{a.userKnows ? "✅" : "❓"}</span>
                <span style={{ fontWeight: 500 }}>{a.term}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: T.muted }}>self-rated: {a.userKnows ? "know" : "unsure"}</span>
              </div>
            ))}
            {answers.length > 6 && <div style={{ fontSize: 12, color: T.muted, textAlign: "center" }}>+{answers.length - 6} more</div>}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-s" onClick={goBack}>Hub</button>
            <button className="btn-p" onClick={() => { setPhase("intro"); setIndex(0); setAnswers([]); setTimeLeft(60); }}>Again</button>
          </div>
        </div>
      </div>
    );
  }

  const card = cards[index];
  return (
    <div className="game-shell">
      <div className="game-header">
        <button className="game-header-back" onClick={goBack}>←</button>
        <div><div className="game-title">⏱️ Pressure Cooker</div><div className="game-subtitle">Know it or not?</div></div>
        <div className="score-pill">{answers.length} sorted</div>
      </div>
      <div className="timer-bar"><div className="timer-fill" style={{ width: `${(timeLeft / 60) * 100}%`, background: timeLeft <= 10 ? T.red : T.accent }} /></div>
      <div className="game-body" style={{ gap: 16 }}>
        {/* Timer ring */}
        <div className="pc-timer-ring">
          <svg className="pc-timer-svg" width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke={T.s3} strokeWidth="6" />
            <circle cx="40" cy="40" r="32" fill="none" stroke={T.accent} strokeWidth="6"
              strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.9s linear" }} />
          </svg>
          <div className="pc-timer-text">{timeLeft}</div>
        </div>

        <div className="pc-card">
          <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono'", opacity: 0.5, marginBottom: 10, letterSpacing: "0.08em", textAlign: "center" }}>TERM {index + 1}</div>
          <div className="pc-card-q">{card.term}</div>
        </div>

        <div className="pc-btn-row">
          <button className="pc-dontknow" onClick={() => respond(false)}>❓ Don't Know</button>
          <button className="pc-know" onClick={() => respond(true)}>✅ Know It</button>
        </div>

        <div className="pc-progress">
          {answers.map((a, i) => (
            <div key={i} className="pc-pip" style={{ background: a.userKnows ? T.green : T.red }} />
          ))}
          {Array.from({ length: Math.max(0, Math.min(20 - answers.length, 10)) }).map((_, i) => (
            <div key={`e${i}`} className="pc-pip" style={{ background: T.border }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ECHO CHAMBER ─────────────────────────────────────────────────────────────
function EchoChamber({ T, isDark, addXp, setTotalGames, goBack }: any) {
  const [phase, setPhase] = useState<"intro" | "show" | "recall" | "score" | "done">("intro");
  const [round, setRound] = useState(0);
  const [showTime, setShowTime] = useState(4);
  const [countdown, setCountdown] = useState(0);
  const [input, setInput] = useState("");
  const [totalScore, setTotalScore] = useState(0);
  const [history, setHistory] = useState<{ def: string; recall: string; score: number }[]>([]);
  const TOTAL_ROUNDS = 5;
  const cards = useRef(CONCEPTS.sort(() => Math.random() - 0.5).slice(0, TOTAL_ROUNDS)).current;
  const currentCard = cards[round];

  const startRound = () => {
    setCountdown(showTime);
    setPhase("show");
  };

  useEffect(() => {
    if (phase !== "show") return;
    if (countdown <= 0) { setPhase("recall"); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  const submitRecall = () => {
    if (!input.trim()) return;
    // Score: word overlap approximation
    const defWords = new Set(currentCard.def.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const recallWords = new Set(input.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const overlap = [...recallWords].filter(w => defWords.has(w)).length;
    const score = Math.min(100, Math.floor((overlap / Math.max(defWords.size, 1)) * 120 + 15 + Math.random() * 20));
    setHistory(h => [...h, { def: currentCard.def, recall: input, score }]);
    setTotalScore(s => s + score);
    setPhase("score");
  };

  const next = () => {
    if (round + 1 >= TOTAL_ROUNDS) {
      addXp(Math.floor(totalScore / TOTAL_ROUNDS * 0.6));
      setTotalGames((p: number) => p + 1);
      setPhase("done");
    } else {
      setRound(r => r + 1);
      setInput("");
      setShowTime(t => Math.max(1, t - 0.5));
      setPhase("intro");
    }
  };

  if (phase === "done") {
    const lastScore = history[history.length - 1]?.score ?? 0;
    return (
      <div className="game-shell">
        <div className="game-header">
          <button className="game-header-back" onClick={goBack}>←</button>
          <div><div className="game-title">🔮 Echo Chamber — Done</div></div>
        </div>
        <div className="done-wrap">
          <div style={{ fontSize: 48 }}>🔮</div>
          <div className="done-title">Avg recall: {Math.round(totalScore / TOTAL_ROUNDS)}%</div>
          <div className="done-xp">+{Math.floor(totalScore / TOTAL_ROUNDS * 0.6)} XP</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 440 }}>
            {history.map((h, i) => (
              <div key={i} style={{ background: T.s2, borderRadius: 12, padding: "10px 14px", border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontFamily: "'JetBrains Mono'" }}>ORIGINAL</div>
                <div style={{ fontSize: 12, color: T.text, marginBottom: 7 }}>{h.def}</div>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontFamily: "'JetBrains Mono'" }}>YOUR RECALL</div>
                <div style={{ fontSize: 12, color: T.accent, marginBottom: 7 }}>{h.recall}</div>
                <div style={{ height: 4, background: T.s3, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: 4, width: `${h.score}%`, background: h.score >= 70 ? T.green : h.score >= 40 ? T.amber : T.red, borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 10, color: T.muted, marginTop: 4, fontFamily: "'JetBrains Mono'" }}>Recall score: {h.score}%</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-s" onClick={goBack}>Hub</button>
            <button className="btn-p" onClick={() => { setPhase("intro"); setRound(0); setTotalScore(0); setHistory([]); setShowTime(4); setInput(""); }}>Again</button>
          </div>
        </div>
      </div>
    );
  }

  const lastHistory = history[history.length - 1];

  return (
    <div className="game-shell">
      <div className="game-header">
        <button className="game-header-back" onClick={goBack}>←</button>
        <div><div className="game-title">🔮 Echo Chamber</div><div className="game-subtitle">Round {round + 1} of {TOTAL_ROUNDS} · window: {showTime}s</div></div>
        <div className="score-pill">Avg: {round > 0 ? Math.round(totalScore / round) : "—"}%</div>
      </div>
      <div className="game-body" style={{ gap: 12 }}>
        {phase === "intro" && (
          <>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.text, textAlign: "center" }}>Get ready for round {round + 1}</div>
            <div style={{ fontSize: 13, color: T.muted, textAlign: "center" }}>The definition will show for <strong style={{ color: T.accent }}>{showTime} seconds</strong>. Memorise it, then type it back.</div>
            {round > 0 && lastHistory && (
              <div style={{ background: T.s2, borderRadius: 14, padding: "12px 16px", width: "100%", maxWidth: 480, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 6, fontFamily: "'JetBrains Mono'" }}>LAST ROUND SCORE</div>
                <div className="ec-score-bar"><div className="ec-score-fill" style={{ width: `${lastHistory.score}%` }} /></div>
                <div style={{ fontSize: 12, color: T.muted }}>{lastHistory.score}% recall accuracy</div>
              </div>
            )}
            <button className="btn-p" style={{ padding: "11px 32px" }} onClick={startRound}>Show Definition →</button>
          </>
        )}

        {phase === "show" && (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.muted, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "'JetBrains Mono'", color: countdown <= 1 ? T.red : T.accent }}>{countdown}</span>
              Memorise this definition
            </div>
            <div className="ec-show-card">
              <div className="ec-window">
                <span className="ec-window-pip" style={{ background: countdown <= 1 ? "#f87171" : "rgba(255,255,255,0.5)" }} />
                {currentCard.term}
              </div>
              <div className="ec-def-text">{currentCard.def}</div>
            </div>
            <div className="timer-bar" style={{ maxWidth: 480, width: "100%" }}>
              <div className="timer-fill" style={{ width: `${(countdown / showTime) * 100}%`, transition: "width 0.9s linear" }} />
            </div>
          </>
        )}

        {phase === "recall" && (
          <>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text, textAlign: "center", marginBottom: 8 }}>
              Now type back what you remember about <strong style={{ color: T.accent }}>{currentCard.term}</strong>
            </div>
            <textarea
              className="ec-textarea"
              placeholder="Type the core ideas — not word for word, just what you remember…"
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
            />
            <button className="ec-submit" onClick={submitRecall}>Submit Recall →</button>
          </>
        )}

        {phase === "score" && lastHistory && (
          <>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text, textAlign: "center", marginBottom: 8 }}>Recall compared</div>
            <div style={{ width: "100%", maxWidth: 480, background: T.s2, borderRadius: 14, padding: "14px 16px", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 4, fontFamily: "'JetBrains Mono'" }}>ORIGINAL</div>
              <div style={{ fontSize: 13, color: T.text, marginBottom: 12, lineHeight: 1.5 }}>{lastHistory.def}</div>
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 4, fontFamily: "'JetBrains Mono'" }}>YOUR RECALL</div>
              <div style={{ fontSize: 13, color: T.accent, marginBottom: 12, lineHeight: 1.5 }}>{lastHistory.recall}</div>
              <div className="ec-score-bar"><div className="ec-score-fill" style={{ width: `${lastHistory.score}%` }} /></div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 6 }}>Recall score: {lastHistory.score}%</div>
            </div>
            <button className="ec-submit" onClick={next} style={{ marginTop: 8 }}>
              {round + 1 >= TOTAL_ROUNDS ? "See Final Results →" : `Next Round (${showTime - 0.5}s window) →`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
