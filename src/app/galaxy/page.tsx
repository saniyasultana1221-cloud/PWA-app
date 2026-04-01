"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ZoomIn, ZoomOut, Compass } from "lucide-react";

// Mock Data based on the reference Star Map provided by the user
const constellations = [
    {
        id: "aquila",
        name: "Chapter 1",
        description: "Mastered fundamentals.",
        x: 800, y: 700,
        status: "completed",
        stars: [
            { id: "aq1", dx: -50, dy: 100, name: "Altair (Alpha Aquilae)", completed: true },
            { id: "aq2", dx: 0, dy: -50, name: "Tarazed", completed: true },
            { id: "aq3", dx: 40, dy: 60, name: "Alshain", completed: true },
            { id: "aq4", dx: 80, dy: 120, name: "Theta Aquilae", completed: true },
            { id: "aq5", dx: 140, dy: 180, name: "Eta Aquilae", completed: true },
        ],
        connections: [[0, 1], [1, 2], [0, 2], [2, 3], [3, 4]]
    },
    {
        id: "scutum",
        name: "Chapter 2",
        description: "The Shield.",
        x: 1200, y: 900,
        status: "completed",
        stars: [
            { id: "scu1", dx: 0, dy: -40, name: "Alpha Scuti", completed: true },
            { id: "scu2", dx: -30, dy: 20, name: "Beta Scuti", completed: true },
            { id: "scu3", dx: 40, dy: 30, name: "Delta Scuti", completed: true },
            { id: "scu4", dx: 10, dy: 80, name: "Gamma Scuti", completed: true },
        ],
        connections: [[0, 1], [0, 2], [1, 3], [2, 3]]
    },
    {
        id: "libra",
        name: "Chapter 3",
        description: "The Scales.",
        x: 1900, y: 500,
        status: "completed",
        stars: [
            { id: "lb1", dx: 0, dy: -50, name: "Zubeneschamali", completed: true },
            { id: "lb2", dx: -60, dy: 40, name: "Zubenelgenubi", completed: true },
            { id: "lb3", dx: 80, dy: 60, name: "Brachium", completed: true },
            { id: "lb4", dx: -60, dy: 160, name: "Sigma Librae", completed: true },
        ],
        connections: [[0, 1], [0, 2], [1, 2], [1, 3]]
    },
    {
        id: "ophiuchus",
        name: "Chapter 4",
        description: "The Serpent Bearer.",
        x: 2300, y: 1100,
        status: "current",
        stars: [
            { id: "op1", dx: 0, dy: -100, name: "Rasalhague", completed: true },
            { id: "op2", dx: -80, dy: 0, name: "Cebalrai", completed: true },
            { id: "op3", dx: 80, dy: 20, name: "Yed Prior", completed: false },
            { id: "op4", dx: -120, dy: 120, name: "Sabik", completed: false },
            { id: "op5", dx: 120, dy: 140, name: "Zeta Ophiuchi", completed: false },
            { id: "op6", dx: 0, dy: 180, name: "Eta Ophiuchi", completed: false },
        ],
        connections: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5]]
    },
    {
        id: "sagittarius",
        name: "Chapter 5",
        description: "The Archer.",
        x: 1500, y: 1500,
        status: "current",
        stars: [
            { id: "sg1", dx: -60, dy: 0, name: "Kaus Media", completed: true },
            { id: "sg2", dx: -20, dy: -50, name: "Kaus Borealis", completed: true },
            { id: "sg3", dx: 40, dy: -20, name: "Nunki", completed: false },
            { id: "sg4", dx: 80, dy: 80, name: "Ascella", completed: false },
            { id: "sg5", dx: 0, dy: 100, name: "Kaus Australis", completed: false },
        ],
        connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2]]
    },
    {
        id: "serpens",
        name: "Chapter 6",
        description: "The Serpent.",
        x: 2800, y: 600,
        status: "locked",
        stars: [
            { id: "sr1", dx: 0, dy: 0, name: "Unukalhai", completed: false },
            { id: "sr2", dx: -40, dy: 80, name: "Alya", completed: false },
            { id: "sr3", dx: 40, dy: -60, name: "Mu Serpentis", completed: false },
        ],
        connections: [[0, 1], [0, 2]]
    },
    {
        id: "scorpius",
        name: "Chapter 7",
        description: "The Scorpion.",
        x: 2200, y: 1900,
        status: "locked",
        stars: [
            { id: "sc1", dx: 0, dy: -80, name: "Antares", completed: false },
            { id: "sc2", dx: -40, dy: -120, name: "Graffias", completed: false },
            { id: "sc3", dx: -10, dy: -30, name: "Al Niyat", completed: false },
            { id: "sc4", dx: 40, dy: 20, name: "Wei", completed: false },
            { id: "sc5", dx: -10, dy: 80, name: "Sargas", completed: false },
            { id: "sc6", dx: -80, dy: 100, name: "Shaula", completed: false },
        ],
        connections: [[0, 2], [2, 3], [3, 4], [4, 5], [0, 1]]
    },
    {
        id: "capricorn",
        name: "Chapter 8",
        description: "The Sea-Goat.",
        x: 900, y: 1800,
        status: "locked",
        stars: [
            { id: "cp1", dx: -50, dy: 0, name: "Algedi", completed: false },
            { id: "cp2", dx: 80, dy: -40, name: "Dabih", completed: false },
            { id: "cp3", dx: 60, dy: 60, name: "Nashira", completed: false },
            { id: "cp4", dx: -80, dy: 80, name: "Deneb Algedi", completed: false },
        ],
        connections: [[0, 1], [1, 2], [2, 3], [3, 0]]
    },
    {
        id: "lupus",
        name: "Chapter 9",
        description: "The Wolf.",
        x: 2900, y: 1500,
        status: "locked",
        stars: [
            { id: "lp1", dx: 0, dy: 0, name: "Alpha Lupi", completed: false },
            { id: "lp2", dx: -40, dy: 40, name: "Beta Lupi", completed: false },
            { id: "lp3", dx: 40, dy: 60, name: "Gamma Lupi", completed: false },
        ],
        connections: [[0, 1], [0, 2]]
    }
];

export default function GalaxyTrackerPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [hoveredConstellation, setHoveredConstellation] = useState<string | null>(null);
    const [hoveredStar, setHoveredStar] = useState<string | null>(null);
    const [backgroundStars, setBackgroundStars] = useState<{ x: number, y: number, o: number, s: number, c: string }[]>([]);
    const [nebulae, setNebulae] = useState<{ x: number, y: number, color: string, scale: number }[]>([]);

    useEffect(() => {
        const colors = ["#ffffff", "#e2e8f0", "#a5b4fc", "#c7d2fe", "#fef08a", "#fff0f5"];
        const stars = Array.from({ length: 8000 }).map(() => {
            const size = Math.pow(Math.random(), 4) * 4 + 0.5; // nice soft glowing stars, no crosses
            return {
                x: Math.random() * 8000,
                y: Math.random() * 8000,
                o: Math.random() * 0.8 + 0.2,
                s: size,
                c: colors[Math.floor(Math.random() * colors.length)]
            };
        });
        setBackgroundStars(stars);

        // Generate glowing nebulae clouds (blue and brown/gold like the reference image)
        const nebulaColors = [
            "rgba(30, 58, 138, 0.15)", // dark blue
            "rgba(29, 78, 216, 0.1)",  // blue
            "rgba(146, 64, 14, 0.15)", // dark brown/gold
            "rgba(180, 83, 9, 0.12)",   // amber/brown
            "rgba(125, 211, 252, 0.08)" // light blue
        ];
        const nebs = Array.from({ length: 45 }).map(() => ({
            x: Math.random() * 8000,
            y: Math.random() * 8000,
            color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
            scale: Math.random() * 2500 + 1000
        }));
        setNebulae(nebs);

    }, []);

    const handleZoomIn = () => setScale(s => Math.min(s + 0.2, 2));
    const handleZoomOut = () => setScale(s => Math.max(s - 0.2, 0.4));
    const handleResetZoom = () => setScale(1);

    const getStarStyle = (constellationStatus: string, starCompleted: boolean) => {
        // Crisp white stars with white glow, matching new reference
        if (constellationStatus === "locked") return {
            backgroundColor: "#ffffff",
            border: "none",
            opacity: 0.15,
            boxShadow: "0 0 2px rgba(255, 255, 255, 0.2)"
        };
        if (starCompleted) return {
            backgroundColor: "#ffffff",
            border: "none",
            boxShadow: "0 0 8px 2px rgba(255, 255, 255, 0.9)" // white bloom
        };
        return {
            backgroundColor: "#ffffff",
            border: "none",
            opacity: 0.5,
            boxShadow: "0 0 4px 1px rgba(255, 255, 255, 0.3)"
        };
    };

    const getLineProps = (constellationStatus: string, aComp: boolean, bComp: boolean) => {
        if (constellationStatus === "locked") {
            return { stroke: "rgba(255, 255, 255, 0.05)", strokeWidth: "1", filter: "none" };
        }
        if (aComp && bComp) {
            // Thick, glowing orange line for completed connections
            return {
                stroke: "#fb923c", // bright golden-orange
                strokeWidth: "3",
                filter: "drop-shadow(0 0 4px rgba(251, 146, 60, 0.8))"
            };
        }
        // Thin, faint orange line for incomplete connections
        return {
            stroke: "rgba(251, 146, 60, 0.4)",
            strokeWidth: "1",
            filter: "none"
        };
    };

    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            width: "100%", height: "100%",
            backgroundColor: "#000000", // pure black background
            overflow: "hidden", // return to hidden for drag
            fontFamily: "var(--font-inter), sans-serif",
            userSelect: "none",
            zIndex: 100 // ensure it sits over regular layout entirely
        }}>

            {/* Background Ambience */}
            <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                pointerEvents: "none",
                background: "#000000", // Pure black
                zIndex: 0
            }} />

            {/* Top Navigation Overlay */}
            <div style={{
                position: "absolute",
                top: "32px", left: "32px", right: "32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                zIndex: 50,
                pointerEvents: "auto"
            }}>
                <div>
                    <Link
                        href="/"
                        style={{
                            display: "flex", alignItems: "center", gap: "8px",
                            padding: "12px 20px",
                            backgroundColor: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            backdropFilter: "blur(12px)",
                            borderRadius: "9999px",
                            color: "white",
                            fontWeight: "bold",
                            textDecoration: "none",
                            transition: "all 0.3s",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        <ArrowLeft size={18} />
                        Back to Base
                    </Link>
                </div>
            </div>

            {/* Zoom Controls */}
            <div style={{
                position: "absolute",
                bottom: "40px", right: "40px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                zIndex: 50,
                pointerEvents: "auto"
            }}>
                <button onClick={handleZoomIn} style={zoomBtnStyle}>
                    <ZoomIn size={20} />
                </button>
                <button onClick={handleResetZoom} style={{ ...zoomBtnStyle, color: "#c084fc", fontWeight: "900", fontSize: "14px" }}>
                    1x
                </button>
                <button onClick={handleZoomOut} style={zoomBtnStyle}>
                    <ZoomOut size={20} />
                </button>
            </div>



            {/* Draggable Galaxy Canvas */}
            <motion.div
                ref={containerRef}
                style={{
                    position: "absolute",
                    zIndex: 10,
                    width: "8000px", height: "8000px",
                    cursor: "grab",
                    transformOrigin: "center"
                }}
                drag
                dragConstraints={{ left: -6000, right: 0, top: -6000, bottom: 0 }}
                dragElastic={0.2}
                dragTransition={{ bounceStiffness: 100, bounceDamping: 10 }}
                initial={{ x: -400, y: -300 }}
                animate={{ scale }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >

                {/* Render Nebulae Clouds */}
                {nebulae.map((n, i) => (
                    <div key={`neb-${i}`} style={{
                        position: "absolute",
                        left: n.x, top: n.y,
                        width: n.scale + "px", height: n.scale + "px",
                        background: `radial-gradient(circle, ${n.color} 0%, transparent 70%)`,
                        borderRadius: "50%",
                        pointerEvents: "none",
                        transform: "translate(-50%, -50%)",
                        filter: "blur(80px)",
                        opacity: 0.9
                    }} />
                ))}

                {/* Render Dense Background Stars inside draggable area so they move with the universe */}
                {backgroundStars.map((s, i) => (
                    <div key={`bgstar-${i}`} style={{
                        position: "absolute",
                        left: s.x, top: s.y,
                        width: Math.max(s.s, 1) + "px", height: Math.max(s.s, 1) + "px",
                        backgroundColor: s.c,
                        opacity: s.o,
                        borderRadius: "50%",
                        pointerEvents: "none",
                        boxShadow: s.s > 1.5 ? `0 0 ${s.s * 2}px ${s.c}` : "none"
                    }} />
                ))}

                {/* Render Constellations */}
                {constellations.map((constellation) => (
                    <div
                        key={constellation.id}
                        style={{
                            position: "absolute",
                            left: constellation.x, top: constellation.y
                        }}
                        onMouseEnter={() => setHoveredConstellation(constellation.id)}
                        onMouseLeave={() => setHoveredConstellation(null)}
                    >

                        {/* Draw SVG connections between stars */}
                        <svg style={{ position: "absolute", overflow: "visible", pointerEvents: "none", left: 0, top: 0 }}>
                            {constellation.connections.map(([a, b], idx) => {
                                const starA = constellation.stars[a];
                                const starB = constellation.stars[b];
                                const lineProps = getLineProps(constellation.status, starA.completed, starB.completed);
                                return (
                                    <line
                                        key={idx}
                                        x1={starA.dx} y1={starA.dy}
                                        x2={starB.dx} y2={starB.dy}
                                        stroke={lineProps.stroke}
                                        strokeWidth={lineProps.strokeWidth}
                                        strokeLinecap="round"
                                        style={{ transition: "all 0.5s", filter: lineProps.filter }}
                                    />
                                );
                            })}
                        </svg>

                        {/* Render Individual Stars */}
                        {constellation.stars.map((star, idx) => {
                            const starStyles = getStarStyle(constellation.status, star.completed);
                            const isHovered = hoveredStar === star.id || hoveredConstellation === constellation.id;
                            const showTooltip = hoveredStar === star.id || hoveredConstellation === constellation.id;

                            return (
                                <div
                                    key={star.id}
                                    style={{
                                        position: "absolute",
                                        left: star.dx, top: star.dy,
                                        transform: "translate(-50%, -50%)",
                                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                        zIndex: isHovered ? 50 : 10
                                    }}
                                >
                                    {/* Invisible large hit area for easier hovering on tiny stars */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            width: "40px", height: "40px",
                                            borderRadius: "50%",
                                            cursor: constellation.status !== 'locked' ? 'pointer' : 'default',
                                            pointerEvents: "auto",
                                        }}
                                        onMouseEnter={() => setHoveredStar(star.id)}
                                        onMouseLeave={() => setHoveredStar(null)}
                                    />

                                    {/* The actual Star Dot */}
                                    <div
                                        style={{
                                            width: "6px", height: "6px",
                                            borderRadius: "50%",
                                            pointerEvents: "none",
                                            transition: "all 0.3s",
                                            ...starStyles,
                                            transform: (isHovered && constellation.status !== 'locked') ? "scale(1.5)" : "scale(1)"
                                        }}
                                    />

                                    {/* Permanent Faint Label */}
                                    {(constellation.status !== 'locked') && (
                                        <div style={{
                                            position: "absolute",
                                            top: "20px",
                                            whiteSpace: "nowrap",
                                            fontSize: "11px",
                                            fontWeight: isHovered ? "600" : "400",
                                            color: "#ffffff",
                                            opacity: isHovered ? 1 : 0, // completely invisible until hovered
                                            pointerEvents: "none",
                                            transition: "all 0.3s",
                                            textShadow: isHovered ? "0 0 10px rgba(255,255,255,0.8)" : "none",
                                            letterSpacing: "0.05em"
                                        }}>
                                            Concept {idx + 1}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Realistic Constellation Base Label */}
                        <div
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "140px",
                                transform: `translateX(-50%)`,
                                pointerEvents: "none",
                                zIndex: 0,
                                textAlign: "center",
                                width: "400px",
                                opacity: 0.8
                            }}
                        >
                            <h2 style={{
                                fontSize: "28px",
                                fontWeight: "800",
                                color: "rgba(255, 255, 255, 0.9)",
                                margin: 0,
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                textShadow: "0 2px 10px rgba(0,0,0,0.8)"
                            }}>
                                {constellation.name}
                            </h2>
                        </div>

                    </div>
                ))}
            </motion.div>
        </div>
    );
}

const zoomBtnStyle: React.CSSProperties = {
    width: "48px", height: "48px",
    backgroundColor: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    backdropFilter: "blur(12px)",
    borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "white",
    transition: "all 0.3s",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    outline: "none"
};
