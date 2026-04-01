"use client";

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Plus, Search, Book, Clock, LayoutGrid, ChevronRight } from "lucide-react";
import { useState } from "react";

const DEMO_DECKS = [
    { id: 1, title: "Psychology 101", cards: 24, lastStudied: "2 days ago", color: "from-teal-400 to-blue-500", progress: 65 },
    { id: 2, title: "Digital Art Basics", cards: 15, lastStudied: "1 week ago", color: "from-purple-400 to-pink-500", progress: 30 },
    { id: 3, title: "Modern Architecture", cards: 42, lastStudied: "Today", color: "from-blue-400 to-cyan-500", progress: 92 },
];

export default function DecksPage() {
    const [search, setSearch] = useState("");

    const filteredDecks = DEMO_DECKS.filter(deck =>
        deck.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen flex pl-32 py-12 pr-12">
            <Navbar />

            <div className="flex-1 space-y-12 max-w-7xl mx-auto">
                <header className="flex justify-between items-end">
                    <div className="space-y-3">
                        <h1 className="text-5xl font-black tracking-tight gradient-text">Library</h1>
                        <p className="text-lg text-text-secondary font-medium">Explore and manage your subject constellations.</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-teal transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search constellations..."
                                className="bg-white/5 border border-glass-border rounded-2xl pl-12 pr-6 py-4 w-80 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal/30 transition-all font-medium"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="btn-primary flex items-center gap-2 px-6 py-4">
                            <Plus size={22} />
                            <span>Create New</span>
                        </button>
                    </div>
                </header>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {filteredDecks.map((deck, index) => (
                        <DeckCard key={deck.id} deck={deck} index={index} />
                    ))}

                    <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="border-2 border-dashed border-glass-border rounded-[32px] p-8 flex flex-col items-center justify-center gap-6 text-text-secondary hover:border-accent-teal/50 hover:bg-accent-teal/5 hover:text-accent-teal cursor-pointer transition-all group"
                    >
                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-accent-teal/10 transition-colors">
                            <Plus size={40} />
                        </div>
                        <div className="text-center">
                            <span className="font-bold text-xl block">Initialize New Star</span>
                            <span className="text-sm opacity-60">Add a new subject to your universe</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <style jsx>{`
        .min-h-screen { display: flex; min-height: 100vh; }
        .flex-1 { flex: 1; }
        .text-5xl { font-size: 3.5rem; }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        @media (min-width: 768px) { .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (min-width: 1024px) { .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        .mx-auto { margin-left: auto; margin-right: auto; }
      `}</style>
        </div>
    );
}

function DeckCard({ deck, index }: { deck: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
            className="pro-card p-8 group cursor-pointer relative"
        >
            <div className={`absolute -right-4 -top-4 w-32 h-32 bg-gradient-to-br ${deck.color} opacity-0 blur-3xl group-hover:opacity-20 transition-opacity duration-700`}></div>

            <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-start">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${deck.color} flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-500`}>
                        <Book className="text-white" size={32} />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                        Constellation #{deck.id}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-2xl font-black flex items-center justify-between">
                        {deck.title}
                        <ChevronRight className="opacity-0 group-hover:opacity-100 transform translate-x--2 group-hover:translate-x-0 transition-all text-accent-teal" size={24} />
                    </h3>
                    <div className="flex items-center gap-5 text-sm font-medium text-text-secondary">
                        <span className="flex items-center gap-1.5"><LayoutGrid size={16} className="text-accent-teal" /> {deck.cards} units</span>
                        <span className="flex items-center gap-1.5"><Clock size={16} className="text-accent-blue" /> {deck.lastStudied}</span>
                    </div>
                </div>

                <div className="space-y-3 pt-4">
                    <div className="flex justify-between items-end text-xs font-bold uppercase tracking-wider text-text-muted">
                        <span>Mastery Level</span>
                        <span className="text-accent-teal font-black text-sm">{deck.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${deck.progress}%` }}
                            transition={{ delay: 0.5 + (index * 0.1), duration: 1, ease: "easeOut" }}
                            className={`h-full bg-gradient-to-r ${deck.color} shadow-[0_0_15px_rgba(45,212,191,0.3)]`}
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
        .text-2xl { font-size: 1.75rem; }
      `}</style>
        </motion.div>
    );
}
