"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, User, Mail, Shield, Bell, Moon, LogOut } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState({ name: "Lauv", email: "lauv@example.com" });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const name = localStorage.getItem("user-name") || "Lauv";
            const email = localStorage.getItem("user-email") || "lauv@example.com";
            setUser({ name, email });
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
    };

    return (
        <div className="min-h-screen w-full bg-[#f8f9fc] flex flex-col font-sans text-slate-800">
            <header className="h-20 bg-white border-b border-slate-100 flex items-center px-8 gap-4">
                <button 
                    onClick={() => router.push('/dashboard')}
                    className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-xl font-bold">Profile Settings</h1>
            </header>

            <main className="flex-1 max-w-2xl mx-auto w-full p-12">
                <div className="bg-white rounded-[40px] p-12 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-[#9b72ff]">
                            <User size={48} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black">{user.name}</h2>
                            <p className="text-slate-500 font-medium">{user.email}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                                    <Mail size={20} />
                                </div>
                                <span className="font-bold text-sm">Email Notifications</span>
                            </div>
                            <div className="w-12 h-6 bg-green-400 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-500 shadow-sm">
                                    <Moon size={20} />
                                </div>
                                <span className="font-bold text-sm">Dark Mode</span>
                            </div>
                            <div className="w-12 h-6 bg-slate-200 rounded-full relative">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="w-full mt-12 py-4 bg-red-50 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                        >
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
