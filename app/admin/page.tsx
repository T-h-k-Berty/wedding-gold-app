"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Users, UserCheck, Search, Lock, LogOut, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ADMIN_PIN = "2026";

type RSVP = {
  id: number;
  created_at: string;
  full_name: string;
  guest_count: number;
  dietary_notes: string;
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      fetchRSVPs();
    } else {
      alert("Incorrect PIN! Please try again.");
      setPinInput("");
    }
  };

  const fetchRSVPs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching RSVPs:", error);
    } else {
      setRsvps(data || []);
    }
    setIsLoading(false);
  };

  // Luxury Background Wrapper
  const BackgroundWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen relative font-lato overflow-hidden">
      <div className="absolute inset-0 bg-[url('/wedding_rings_blurred.jpg')] bg-cover bg-center bg-fixed z-0"></div>
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-0"></div>
      <div className="relative z-10 w-full h-full min-h-screen py-10 px-4 sm:px-8">
        {children}
      </div>
    </div>
  );

  // --- Login Screen ---
  if (!isAuthenticated) {
    return (
      <BackgroundWrapper>
        <div className="h-[80vh] flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="glass-panel p-10 md:p-12 rounded-[2.5rem] w-full max-w-md text-center border border-white/80 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-800"></div>
            
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-full flex items-center justify-center text-yellow-700 mb-6 shadow-inner border border-yellow-200/50">
              <Lock size={36} strokeWidth={1.5} />
            </div>
            
            <h1 className="font-playfair text-4xl font-bold text-gray-900 mb-3 tracking-tight">Admin Portal</h1>
            <p className="text-gray-500 mb-10 font-light text-sm uppercase tracking-widest">Authorized Access Only</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <input 
                  type="password" 
                  value={pinInput} 
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="• • • •" 
                  className="w-full text-center text-3xl tracking-[1em] bg-white/70 border border-gray-200 rounded-2xl px-4 py-5 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white transition-all shadow-inner"
                  autoFocus
                />
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-800 text-white font-playfair font-bold text-xl py-4 rounded-2xl hover:shadow-[0_10px_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-all duration-300">
                Unlock Dashboard <ChevronRight size={24} />
              </button>
            </form>
          </motion.div>
        </div>
      </BackgroundWrapper>
    );
  }

  // --- Dashboard Data Processing ---
  const totalSubmissions = rsvps.length;
  const totalGuests = rsvps.reduce((sum, rsvp) => sum + rsvp.guest_count, 0);
  const filteredRsvps = rsvps.filter(rsvp => 
    rsvp.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Dashboard UI ---
  return (
    <BackgroundWrapper>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        
        {/* Top Navigation Bar */}
        <div className="glass-panel flex flex-col md:flex-row justify-between items-center p-6 md:px-10 rounded-[2rem] shadow-xl border border-white">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="font-playfair text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-700 to-gray-900">
              Guest Management
            </h1>
            <p className="text-gray-500 mt-1 text-sm tracking-widest uppercase font-bold">Tharu & Ishara Wedding</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)} 
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 px-6 py-3 rounded-xl transition-all shadow-sm font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Luxury Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel p-8 md:p-10 rounded-[2rem] shadow-xl border border-white flex items-center justify-between group hover:shadow-2xl transition-all duration-300"
          >
            <div>
              <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs mb-3">Total Submissions</p>
              <h2 className="font-playfair text-6xl md:text-7xl font-extrabold text-gray-900">{totalSubmissions}</h2>
            </div>
            <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-full text-yellow-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <UserCheck size={48} strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="relative p-8 md:p-10 rounded-[2rem] shadow-xl border border-yellow-500/30 flex items-center justify-between group overflow-hidden"
          >
            {/* Gold Gradient Background for the primary stat */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-yellow-800 z-0"></div>
            <div className="absolute inset-0 bg-[url('/wedding_rings_blurred.jpg')] bg-cover opacity-10 mix-blend-overlay z-0"></div>
            
            <div className="relative z-10 text-white">
              <p className="text-yellow-100 font-bold uppercase tracking-[0.2em] text-xs mb-3">Total Headcount</p>
              <h2 className="font-playfair text-6xl md:text-7xl font-extrabold">{totalGuests}</h2>
            </div>
            <div className="relative z-10 p-6 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
              <Users size={48} strokeWidth={1.5} />
            </div>
          </motion.div>
        </div>

        {/* Table Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-panel rounded-[2rem] overflow-hidden shadow-xl border border-white"
        >
          {/* Table Header & Search */}
          <div className="p-6 md:p-8 border-b border-gray-200/60 bg-white/40 flex flex-col sm:flex-row justify-between items-center gap-6">
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-gray-800">RSVP Directory</h3>
            
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-yellow-600" />
              </div>
              <input 
                type="text" 
                placeholder="Search by guest name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white/90 shadow-sm text-gray-700 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Custom Scrollable Table Container */}
          <div className="w-full max-h-[420px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-yellow-600/40 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-yellow-600">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                <p className="text-gray-500 font-lato tracking-widest uppercase text-sm">Loading Data...</p>
              </div>
            ) : filteredRsvps.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <Search size={24} />
                </div>
                <p className="text-gray-500 font-playfair text-xl">No RSVPs found.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse relative">
                <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-10 shadow-sm">
                  <tr className="text-gray-500 text-xs uppercase tracking-[0.2em] font-bold">
                    <th className="p-5 pl-8 border-b border-gray-200">Guest Name</th>
                    <th className="p-5 text-center border-b border-gray-200">Count</th>
                    <th className="p-5 border-b border-gray-200">Dietary / Messages</th>
                    <th className="p-5 text-right pr-8 border-b border-gray-200">Date Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50 bg-white/40">
                  <AnimatePresence>
                    {filteredRsvps.map((rsvp, index) => (
                      <motion.tr 
                        key={rsvp.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-yellow-50/60 transition-colors group"
                      >
                        <td className="p-5 pl-8">
                          <p className="font-playfair font-bold text-lg text-gray-900 group-hover:text-yellow-800 transition-colors">{rsvp.full_name}</p>
                        </td>
                        <td className="p-5 text-center">
                          <span className="inline-flex items-center justify-center min-w-[2.5rem] h-10 px-3 bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-800 rounded-xl font-bold shadow-sm border border-yellow-300/50">
                            {rsvp.guest_count}
                          </span>
                        </td>
                        <td className="p-5">
                          {rsvp.dietary_notes ? (
                            <p className="text-gray-700 text-sm max-w-[250px] md:max-w-md line-clamp-2 leading-relaxed">
                              {rsvp.dietary_notes}
                            </p>
                          ) : (
                            <span className="text-gray-400 italic text-sm">None provided</span>
                          )}
                        </td>
                        <td className="p-5 text-right pr-8 text-gray-500 text-sm font-medium tracking-wide">
                          {new Date(rsvp.created_at).toLocaleDateString('en-US', {
                            month: 'short', day: '2-digit', year: 'numeric'
                          })}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
          
          {/* Table Footer / Fade Effect */}
          <div className="h-4 bg-gradient-to-t from-white/80 to-transparent absolute bottom-0 left-0 w-full pointer-events-none rounded-b-[2rem]"></div>
        </motion.div>

      </motion.div>
    </BackgroundWrapper>
  );
}