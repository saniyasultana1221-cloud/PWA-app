"use client";

import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Minimize2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function FocusPage() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(25 * 60);
    };

    return (
        <div className={`min-h-screen flex transition-all duration-1000 ${isFullscreen ? 'pl-0' : 'pl-32'} py-10 pr-10 overflow-hidden`}>
            <AnimatePresence>
                {!isFullscreen && <Navbar />}
            </AnimatePresence>

            <div className="flex-1 flex flex-col items-center justify-center relative">
                {/* Animated ambient background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-teal/5 blur-[120px] rounded-full pointer-events-none"></div>

                <motion.div
                    layout
                    className={`pro-card flex flex-col items-center justify-center gap-16 transition-all duration-1000 ${isFullscreen ? 'w-full h-full max-w-none rounded-none border-none bg-transparent shadow-none' : 'w-[560px] h-[560px] rounded-[120px]'}`}
                >
                    <div className="text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center gap-2 text-accent-teal uppercase tracking-[0.2em] text-xs font-black"
                        >
                            <Sparkles size={14} />
                            <span>Deep Focus Mode</span>
                        </motion.div>

                        <motion.h1
                            key={timeLeft}
                            initial={{ scale: 0.9, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`font-black tabular-nums tracking-tighter transition-all duration-700 ${isFullscreen ? 'text-[16rem]' : 'text-9xl'}`}
                            style={{ filter: "drop-shadow(0 0 20px rgba(45, 212, 191, 0.2))" }}
                        >
                            {formatTime(timeLeft)}
                        </motion.h1>
                    </div>

                    <div className="flex items-center gap-12">
                        <button
                            onClick={resetTimer}
                            className="w-16 h-16 rounded-full border border-glass-border flex items-center justify-center text-text-muted hover:text-accent-teal hover:bg-white/5 transition-all group"
                        >
                            <RotateCcw size={28} className="group-hover:rotate--90 transition-transform duration-500" />
                        </button>

                        <button
                            onClick={toggleTimer}
                            className="w-28 h-28 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-bg-deep transform hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-teal-500/30"
                        >
                            {isActive ? <Pause size={48} fill="currentColor" /> : <Play size={48} className="ml-2" fill="currentColor" />}
                        </button>

                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="w-16 h-16 rounded-full border border-glass-border flex items-center justify-center text-text-muted hover:text-accent-teal hover:bg-white/5 transition-all"
                        >
                            {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
                        </button>
                    </div>

                    {!isFullscreen && (
                        <div className="flex flex-wrap justify-center gap-4">
                            <TimerPreset label="Deep Focus" mins={25} active={timeLeft === 25 * 60} onClick={() => setTimeLeft(25 * 60)} />
                            <TimerPreset label="Short Break" mins={5} active={timeLeft === 5 * 60} onClick={() => setTimeLeft(5 * 60)} />
                            <TimerPreset label="Zen Session" mins={60} active={timeLeft === 60 * 60} onClick={() => setTimeLeft(60 * 60)} />
                        </div>
                    )}
                </motion.div>

                {/* Fullscreen Toggle Button */}
                <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="absolute bottom-6 right-6 p-4 text-text-muted hover:text-accent-teal hover:bg-white/10 rounded-2xl transition-all group"
                    title={isFullscreen ? "Exit Focus Mode" : "Enter Focus Mode"}
                >
                    {isFullscreen ? <Minimize2 size={28} /> : <Maximize2 size={28} />}
                </button>
            </div>

            <style jsx>{`
        .min-h-screen { display: flex; min-height: 100vh; }
        .flex-1 { flex: 1; }
        .text-9xl { font-size: 8rem; }
      `}</style>
        </div>
    );
}

function TimerPreset({ label, mins, active, onClick }: { label: string; mins: number; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${active ? 'bg-accent-teal text-bg-deep shadow-lg shadow-accent-teal/20' : 'bg-white/5 text-text-secondary border border-glass-border hover:bg-white/10'}`}
        >
            {label}
        </button>
    );
}
