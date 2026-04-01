"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
    const router = useRouter();
    const [userName, setUserName] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("user-name") || "Explorer";
        }
        return "Explorer";
    });
    const [crystals, setCrystals] = useState(() => {
        if (typeof window !== "undefined") {
            return parseInt(localStorage.getItem("lumiu-crystals") || "0");
        }
        return 0;
    });

    useEffect(() => {
        const auth = localStorage.getItem("user-authenticated");
        if (!auth) {
            router.push("/login");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("user-authenticated");
        localStorage.removeItem("user-name");
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-[#f5f3ff] text-[#1e1b4b] font-sans p-8">
            <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16">
                <div className="text-3xl font-black tracking-tighter text-[#1e1b4b]">
                    Lumiu<span className="text-[#a855f7]">.</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-6 py-2 rounded-full border border-purple-200 text-sm font-bold text-purple-600 hover:bg-purple-50 transition-all"
                >
                    Logout
                </button>
            </nav>

            <main className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-12 rounded-[40px] shadow-xl shadow-purple-100 border border-purple-50"
                >
                    <h1 className="text-5xl font-black mb-6">Welcome back, <span className="text-[#a855f7]">{userName}</span>!</h1>
                    <p className="text-xl text-[#64748b] max-w-2xl leading-relaxed">
                        Your personalized learning universe is ready. Ready to continue your journey of discovery?
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        {[
                            { title: "AI Quiz Master", color: "bg-purple-100", icon: "✨", href: "/dashboard/ai-quiz", subtitle: "Generate custom learning" },
                            { title: `${crystals} Knowledge Crystals`, color: "bg-blue-100", icon: "💎", href: "#", subtitle: "Fully synced offline" },
                            { title: "Learning Path", color: "bg-indigo-100", icon: "🛣️", href: "#", subtitle: "Click to resume" },
                        ].map((card) => (
                            card.href !== "#" ? (
                                <Link href={card.href} key={card.title} className={`${card.color} p-8 rounded-[30px] transition-transform hover:scale-105 cursor-pointer block text-[#1e1b4b] no-underline`}>
                                    <div className="text-4xl mb-4">{card.icon}</div>
                                    <h3 className="text-xl font-bold">{card.title}</h3>
                                    <p className="text-sm opacity-70 mt-2 font-semibold">{card.subtitle}</p>
                                </Link>
                            ) : (
                                <div key={card.title} className={`${card.color} p-8 rounded-[30px] transition-transform hover:scale-105 cursor-pointer`}>
                                    <div className="text-4xl mb-4">{card.icon}</div>
                                    <h3 className="text-xl font-bold">{card.title}</h3>
                                    <p className="text-sm opacity-70 mt-2 font-semibold">{card.subtitle}</p>
                                </div>
                            )
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
