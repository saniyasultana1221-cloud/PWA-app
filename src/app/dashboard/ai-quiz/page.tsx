"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles, CheckCircle2, ChevronRight, RefreshCw } from "lucide-react";

export default function AIQuizGeneratorPage() {
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState("Gentle");
    const [quizState, setQuizState] = useState<"idle" | "generating" | "ready" | "completed">("idle");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);

    // Mock Quiz Data
    const mockQuiz = [
        {
            question: `What is the main role of the Sun in our Solar System?`,
            options: [
                "To provide gravity and light for the planets.",
                "To orbit around the Earth.",
                "To cool down the solar wind.",
                "To create black holes."
            ],
            correctIndex: 0,
            explanation: "The Sun's immense gravity keeps the planets in orbit, and it produces the light and heat necessary for life on Earth."
        },
        {
            question: `Which planet is known as the Red Planet?`,
            options: [
                "Venus",
                "Jupiter",
                "Mars",
                "Saturn"
            ],
            correctIndex: 2,
            explanation: "Mars is often called the Red Planet because iron oxide (rust) on its surface gives it a reddish appearance."
        },
        {
            question: `How long does it take Earth to orbit the Sun once?`,
            options: [
                "1 month",
                "6 months",
                "365 days",
                "24 hours"
            ],
            correctIndex: 2,
            explanation: "It takes Earth about 365.25 days to complete one orbit around the Sun, which we call a year."
        }
    ];

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setQuizState("generating");

        // Simulate AI Generation
        setTimeout(() => {
            setQuizState("ready");
            setCurrentQuestion(0);
            setScore(0);
            setSelectedAnswer(null);
        }, 3000);
    };

    const handleAnswerSelect = (index: number) => {
        if (selectedAnswer !== null) return; // Prevent changing answer
        setSelectedAnswer(index);

        if (index === mockQuiz[currentQuestion].correctIndex) {
            setScore((s) => s + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestion < mockQuiz.length - 1) {
            setCurrentQuestion((c) => c + 1);
            setSelectedAnswer(null);
        } else {
            setQuizState("completed");

            // Offline Sync: Save progress to local storage
            const savedCrystals = parseInt(localStorage.getItem("lumiu-crystals") || "0");
            localStorage.setItem("lumiu-crystals", (savedCrystals + score + 1).toString()); // give crystals based on score + participation
        }
    };

    const difficultyColors = {
        "Gentle": "bg-emerald-100 text-emerald-700 border-emerald-200",
        "Normal": "bg-blue-100 text-blue-700 border-blue-200",
        "Challenge": "bg-purple-100 text-purple-700 border-purple-200",
    };

    return (
        <div className="min-h-screen bg-[#f5f3ff] text-[#1e1b4b] font-sans p-6 sm:p-10">
            <nav className="max-w-4xl mx-auto flex items-center gap-4 mb-12">
                <Link
                    href="/dashboard"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform text-[#a855f7]"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div className="text-2xl font-black tracking-tighter text-[#1e1b4b]">
                    Lumiu <span className="text-[#a855f7] font-medium tracking-normal text-xl ml-2">| AI Quiz Master</span>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">

                    {/* STATE 1: IDLE / CONFIG */}
                    {quizState === "idle" && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white p-8 sm:p-12 rounded-[40px] shadow-xl shadow-purple-100 border border-purple-50"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center text-[#a855f7]">
                                    <Sparkles size={32} />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-[#1e1b4b]">Create a Custom Quiz</h1>
                                    <p className="text-[#64748b] mt-1 font-medium">Let AI build a personalized, stress-free learning session for you.</p>
                                </div>
                            </div>

                            <form onSubmit={handleGenerate} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-lg font-bold text-[#1e1b4b]">What would you like to learn about?</label>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g., The Solar System, Photosynthesis, or History of Rome"
                                        className="w-full p-5 rounded-2xl border-2 border-purple-100 bg-purple-50/50 text-[#1e1b4b] text-lg outline-none focus:border-[#a855f7] focus:bg-white transition-all shadow-inner"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-lg font-bold text-[#1e1b4b]">Select Pace & Depth</label>
                                    <div className="flex flex-wrap gap-4">
                                        {(["Gentle", "Normal", "Challenge"] as const).map((level) => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => setDifficulty(level)}
                                                className={`px-6 py-3 rounded-2xl font-bold border-2 transition-all ${difficulty === level ? difficultyColors[level as keyof typeof difficultyColors] + " scale-105 shadow-md ring-2 ring-offset-2 ring-" + (level === 'Gentle' ? 'emerald' : level === 'Normal' ? 'blue' : 'purple') + "-400" : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!topic.trim()}
                                    className="w-full bg-[#a855f7] text-white py-5 rounded-3xl text-xl font-bold shadow-xl shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 mt-4"
                                >
                                    <Sparkles size={24} />
                                    Generate My Custom Quiz
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* STATE 2: GENERATING (Calm Breathing Animation) */}
                    {quizState === "generating" && (
                        <motion.div
                            key="generating"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-[50vh]"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="w-40 h-40 bg-purple-200 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(168,85,247,0.4)]"
                            >
                                <Sparkles size={60} className="text-[#a855f7]" />
                            </motion.div>
                            <h2 className="text-2xl font-black text-[#1e1b4b] mt-12 mb-2 animate-pulse">Crafting your universe...</h2>
                            <p className="text-[#64748b] font-medium text-center max-w-sm">Designing perfectly paced questions just for you.</p>
                        </motion.div>
                    )}

                    {/* STATE 3: READY / QUIZ IN PROGRESS */}
                    {quizState === "ready" && (
                        <motion.div
                            key="ready"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white p-8 sm:p-12 rounded-[40px] shadow-xl shadow-purple-100 border border-purple-50"
                        >
                            {/* Progress Bar */}
                            <div className="w-full bg-purple-100 h-3 rounded-full mb-10 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentQuestion) / mockQuiz.length) * 100}%` }}
                                    className="h-full bg-[#a855f7] rounded-full"
                                />
                            </div>

                            <div className="mb-4 text-[#a855f7] font-black tracking-widest text-sm uppercase">Question {currentQuestion + 1} of {mockQuiz.length}</div>
                            <h2 className="text-3xl font-black text-[#1e1b4b] mb-8 leading-tight">
                                {mockQuiz[currentQuestion].question}
                            </h2>

                            <div className="space-y-4">
                                {mockQuiz[currentQuestion].options.map((option, index) => {
                                    const isSelected = selectedAnswer === index;
                                    const isCorrect = index === mockQuiz[currentQuestion].correctIndex;
                                    const showResult = selectedAnswer !== null;

                                    let btnClass = "bg-purple-50 hover:bg-purple-100 border-purple-100 text-[#1e1b4b]";

                                    if (showResult) {
                                        if (isCorrect) btnClass = "bg-emerald-100 border-emerald-400 text-emerald-900";
                                        else if (isSelected && !isCorrect) btnClass = "bg-rose-100 border-rose-400 text-rose-900 scale-[0.98]";
                                        else btnClass = "bg-gray-50 border-gray-100 text-gray-400 opacity-50";
                                    }

                                    return (
                                        <button
                                            key={index}
                                            disabled={showResult}
                                            onClick={() => handleAnswerSelect(index)}
                                            className={`w-full p-6 rounded-2xl border-2 text-left text-lg font-bold transition-all sm:flex items-center justify-between ${btnClass}`}
                                        >
                                            <span>{option}</span>
                                            {showResult && isCorrect && <CheckCircle2 size={24} className="text-emerald-500 hidden sm:block" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Explanation & Next Box */}
                            <AnimatePresence>
                                {selectedAnswer !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: "auto", marginTop: 32 }}
                                        className="overflow-hidden"
                                    >
                                        <div className={`p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between ${selectedAnswer === mockQuiz[currentQuestion].correctIndex ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'
                                            }`}>
                                            <div className="flex-1">
                                                <div className={`font-black mb-1 ${selectedAnswer === mockQuiz[currentQuestion].correctIndex ? 'text-emerald-700' : 'text-rose-700'
                                                    }`}>
                                                    {selectedAnswer === mockQuiz[currentQuestion].correctIndex ? "Spot On! 🌟" : "Not quite, but here's why! 💡"}
                                                </div>
                                                <p className={`font-medium ${selectedAnswer === mockQuiz[currentQuestion].correctIndex ? 'text-emerald-900' : 'text-rose-900'
                                                    }`}>{mockQuiz[currentQuestion].explanation}</p>
                                            </div>

                                            <button
                                                onClick={handleNextQuestion}
                                                className="flex-shrink-0 px-8 py-4 bg-[#1e1b4b] hover:bg-[#a855f7] text-white rounded-xl font-bold flex items-center gap-2 shadow-lg transition-colors w-full sm:w-auto justify-center"
                                            >
                                                {currentQuestion < mockQuiz.length - 1 ? "Next Question" : "Complete Quiz"}
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* STATE 4: COMPLETED */}
                    {quizState === "completed" && (
                        <motion.div
                            key="completed"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-12 rounded-[40px] shadow-xl shadow-purple-100 border border-purple-50 text-center flex flex-col items-center"
                        >
                            <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-8 border-8 border-emerald-50">
                                <CheckCircle2 size={64} />
                            </div>
                            <h1 className="text-4xl font-black text-[#1e1b4b] mb-4">Brilliant Work!</h1>
                            <p className="text-xl text-[#64748b] font-medium mb-8 max-w-md">
                                You calmly navigated through the {topic} quiz. You scored <strong className="text-[#a855f7]">{score} out of {mockQuiz.length}</strong>.
                            </p>

                            <div className="bg-purple-50 px-8 py-4 rounded-2xl flex items-center gap-4 mb-10 w-full max-w-sm justify-center">
                                <div className="text-3xl">💎</div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-purple-400 uppercase tracking-widest">Reward Earned</div>
                                    <div className="text-[#1e1b4b] font-black text-xl">+{score + 1} Knowledge Crystals</div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                                <button
                                    onClick={() => setQuizState("idle")}
                                    className="flex-1 py-4 bg-purple-100 text-[#a855f7] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-purple-200 transition-colors"
                                >
                                    <RefreshCw size={20} />
                                    New Topic
                                </button>
                                <Link
                                    href="/dashboard"
                                    className="flex-1 py-4 bg-[#a855f7] text-white rounded-2xl font-bold shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all text-center"
                                >
                                    Return to Dashboard
                                </Link>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
}
