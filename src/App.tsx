import React, { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Calendar, Users, CheckCircle, ArrowRight, Play, Info, MapPin, Inbox, Compass, BookOpen, Volume2, Heart, X } from "lucide-react";
import HskExplorer from "./components/HskExplorer";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  const [activeTab, setActiveTab] = useState<"map" | "books" | "stats">("map");
  const [email, setEmail] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [ticketNum, setTicketNum] = useState<number>(0);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [explorerCount, setExplorerCount] = useState<number>(7642);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  useEffect(() => {
    // Read waitlist registration if any
    const savedWaitlist = localStorage.getItem("memzi_waitlist_ticket");
    if (savedWaitlist) {
      try {
        const parsed = JSON.parse(savedWaitlist);
        setIsSubmitted(true);
        setTicketNum(parsed.number);
      } catch (e) {
        console.error("Failed to parse waitlist ticket", e);
      }
    }

    const savedCount = localStorage.getItem("memzi_waitlist_count");
    if (savedCount) {
      setExplorerCount(parseInt(savedCount, 10));
    } else {
      const initialCount = 7642 + Math.floor(Math.random() * 10);
      setExplorerCount(initialCount);
      localStorage.setItem("memzi_waitlist_count", initialCount.toString());
    }
  }, []);

  const handleJoinWaitlist = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address 🌱");
      return;
    }

    const nextCount = explorerCount + 1;
    setExplorerCount(nextCount);
    localStorage.setItem("memzi_waitlist_count", nextCount.toString());

    const ticket = {
      email,
      number: nextCount,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem("memzi_waitlist_ticket", JSON.stringify(ticket));
    setTicketNum(nextCount);
    setIsSubmitted(true);
    setModalMessage(`Welcome, traveler! You have successfully sprouted to ticket #${nextCount}! 🌱`);
  };

  const handleResetWaitlist = () => {
    localStorage.removeItem("memzi_waitlist_ticket");
    setIsSubmitted(false);
    setEmail("");
    setModalMessage(null);
  };

  // Pre-configured list of map landmarks
  const mapLandmarks = [
    {
      id: "valley",
      name: "Sprouts Valley 🌾",
      description: "A cozy green starting pasture where beginner explorers learn fundamental Pinyin rules and practice with Lumo's first matching exercises.",
      level: "HSK 1"
    },
    {
      id: "forest",
      name: "Misty Bamboo Forest 🎋",
      description: "An ancient shadowy thicket. Here, you discover critical survival survival verbs, complete character radical stroke quests, and meet old panda masters.",
      level: "HSK 2"
    },
    {
      id: "tavern",
      name: "Tea Blossom Tavern 🍵",
      description: "A warm, high-altitude social spot. Stop by to take listening checkouts, practice ordering foods, and interact with the tavern keeper in full voice lessons.",
      level: "HSK 3"
    }
  ];

  const [selectedLandmark, setSelectedLandmark] = useState(mapLandmarks[0]);

  return (
    <div className="min-h-screen bg-[#F9FBF7] text-[#333333] font-sans flex flex-col relative selection:bg-memzi-green/20 selection:text-memzi-forest">
      
      {/* BACKGROUND DECORATIVE ELEMENTS - GEOMETRIC BALANCE */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-memzi-green/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-[60vh] right-10 w-[450px] h-[450px] bg-memzi-sprout/15 rounded-full filter blur-[120px] pointer-events-none -z-10" />

      {/* Navigation Bar */}
      <nav className="h-20 px-6 md:px-12 flex items-center justify-between border-b border-[#E6EBE0] bg-white sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-memzi-green to-memzi-green-light rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-md transition-transform hover:scale-105">
            🌱
          </div>
          <span className="text-xl md:text-2xl font-extrabold tracking-tight text-[#2D4F1E] font-display flex items-center gap-1.5">
            Memzi <span className="font-light text-[#558B2F]">Living World</span>
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-[#558B2F]">
          <a href="#about" className="hover:text-[#2D4F1E] hover:underline underline-offset-4 transition-colors">About</a>
          <a href="#live-preview-section" className="hover:text-[#2D4F1E] hover:underline underline-offset-4 transition-colors">Interactive Preview</a>
          <a href="#hsk-explorer" className="hover:text-[#2D4F1E] hover:underline underline-offset-4 transition-colors">HSK Library</a>
          <a href="#waitlist-section" className="hover:text-[#2D4F1E] hover:underline underline-offset-4 transition-colors">Waitlist</a>
        </div>
      </nav>

      {/* Main Hero Content */}
      <main className="flex-1 flex flex-col lg:flex-row px-6 md:px-12 py-12 gap-12 items-center max-w-7xl mx-auto w-full">
        {/* Left column (three-fifths equivalent) */}
        <div className="w-full lg:w-3/5 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#DCEDC8] text-[#33691E] rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles size={12} className="text-memzi-green-light animate-spin" />
            Meet Lumo, Your Cozy Learning Companion
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#1B3012] leading-[1.1] tracking-tight italic uppercase font-display">
            The Cozy Way To <br/>
            <span className="text-[#4ADE80] not-italic bg-gradient-to-r from-memzi-green-light to-memzi-green bg-clip-text text-transparent">
              Learn Chinese
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-[#556B4B] max-w-xl leading-relaxed font-normal">
            Memzi replaces mechanical memorization with an immersive fantasy RPG map. Open Book World to tackle structured HSK 1-6 levels, or hike through the World Map to apply custom phrases in hand-drawn stories with cute sprout helpers.
          </p>
          
          {/* Action container */}
          <div className="bg-white p-4 rounded-3xl border border-memzi-cream-dark/95 shadow-lg max-w-lg">
            {!isSubmitted ? (
              <form onSubmit={handleJoinWaitlist} className="space-y-3">
                <div className="text-xs font-semibold text-[#556B4B] flex items-center justify-between px-1">
                  <span>Join the Lumo Waitlist:</span>
                  <span className="font-mono text-memzi-teal">{explorerCount.toLocaleString()} Sprout Seeds Planted</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter email to join queue..."
                    value={email}
                    id="waitlist-email-hero"
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-2xl bg-memzi-cream text-sm border border-memzi-cream-dark focus:outline-none focus:ring-2 focus:ring-memzi-green-light/40 focus:border-memzi-green-light text-memzi-forest font-medium"
                  />
                  <button
                    type="submit"
                    id="join-waitlist-hero-btn"
                    className="px-6 py-3 bg-[#2D4F1E] hover:bg-[#1B3012] text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    Plant Seed <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-2 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                  <CheckCircle size={14} /> Registered Sprout Companion
                </div>
                <div>
                  <p className="text-xs text-[#556B4B] font-medium">Your Cozy Priority Ticket Number:</p>
                  <p className="text-3xl font-extrabold font-mono text-[#1B3012] tracking-wider mt-1">#{ticketNum}</p>
                </div>
                <button
                  onClick={handleResetWaitlist}
                  className="text-[11px] underline text-[#558B2F] hover:text-[#2D4F1E] font-medium"
                >
                  Change Email / Leave Waitlist
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 select-none">
            <button
              onClick={() => setShowVideoModal(true)}
              className="px-6 py-3.5 bg-white border-2 border-[#2D4F1E] hover:bg-memzi-cream-dark/20 text-[#2D4F1E] rounded-2xl font-bold text-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Play size={16} fill="currentColor" /> Watch App Trailer
            </button>
          </div>
          
          {/* Feature Grid Mock - Geometric Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-[#E6EBE0]" id="about">
            <div className="flex gap-3 items-center">
              <div className="w-3 h-3 bg-[#4ADE80] rounded-full rotate-45 transform shrink-0"></div>
              <span className="text-sm font-semibold text-[#1B3012]">HSK 1-6 Grid Curriculum</span>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-3 h-3 bg-[#4ADE80] rounded-full rotate-45 transform shrink-0"></div>
              <span className="text-sm font-semibold text-[#1B3012]">Environmental Exploration Layers</span>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-3 h-3 bg-[#4ADE80] rounded-full rotate-45 transform shrink-0"></div>
              <span className="text-sm font-semibold text-[#1B3012]">Spaced Tone Practice Games</span>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-3 h-3 bg-[#4ADE80] rounded-full rotate-45 transform shrink-0"></div>
              <span className="text-sm font-semibold text-[#1B3012]">Native High-Definition Voice Audio</span>
            </div>
          </div>
        </div>

        {/* Visual Mockup Space (two-fifths equivalent) - Interactive Preview Area */}
        <div id="live-preview-section" className="w-full lg:w-2/5 aspect-[4/5] sm:aspect-square lg:h-[500px] bg-[#E8F5E9] rounded-[48px] border-8 border-white shadow-2xl overflow-hidden relative flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-[#A5D6A7] to-[#81C784] opacity-20 pointer-events-none" />
          
          {/* Header of Mock App */}
          <div className="bg-white/80 backdrop-blur-md border-b border-white px-5 py-3.5 flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-base select-none">🗺️</span>
              <span className="text-xs font-extrabold font-display tracking-widest text-[#2D4F1E] uppercase">Lumo Live Stream</span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveTab("map")}
                className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full transition-all ${
                  activeTab === "map" ? "bg-memzi-teal text-white" : "hover:bg-white/90 text-memzi-teal/70"
                }`}
              >
                World Map
              </button>
              <button
                onClick={() => setActiveTab("books")}
                className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full transition-all ${
                  activeTab === "books" ? "bg-memzi-teal text-white" : "hover:bg-white/90 text-memzi-teal/70"
                }`}
              >
                Book Shelf
              </button>
            </div>
          </div>

          {/* Interactive Screen Container */}
          <div className="flex-1 p-6 flex flex-col justify-between z-10 relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {activeTab === "map" && (
                <motion.div
                  key="map-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex flex-col justify-between"
                >
                  {/* Map Simulator */}
                  <div className="space-y-4">
                    <div className="text-center px-4 py-2 bg-white/70 backdrop-blur-xs border border-white/80 rounded-2xl">
                      <p className="text-[10px] font-bold text-memzi-forest/60 uppercase tracking-widest leading-none mb-1">Cozy Landmark explorer</p>
                      <p className="text-sm font-extrabold text-[#1B3012]">{selectedLandmark.name}</p>
                    </div>

                    {/* Interactive nodes */}
                    <div className="grid grid-cols-3 gap-2.5">
                      {mapLandmarks.map((landmark) => (
                        <button
                          key={landmark.id}
                          id={`landmark-${landmark.id}`}
                          onClick={() => setSelectedLandmark(landmark)}
                          className={`px-2.5 py-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer ${
                            selectedLandmark.id === landmark.id
                              ? "bg-white border-memzi-green shadow-md scale-105"
                              : "bg-white/40 border-white/20 hover:bg-white/60"
                          }`}
                        >
                          <span className="text-xl">
                            {landmark.id === "valley" ? "🌾" : landmark.id === "forest" ? "🎋" : "🍵"}
                          </span>
                          <span className="text-[9px] font-bold text-[#1B3012] font-display whitespace-nowrap overflow-hidden text-ellipsis w-full">
                            {landmark.name.split(" ")[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bubble content */}
                  <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-white max-w-xs mx-auto shadow-lg space-y-1">
                    <div className="flex justify-between items-center border-b border-memzi-cream-dark pb-1 mb-1.5">
                      <span className="text-[9px] font-bold text-memzi-green-light font-mono bg-memzi-sprout/40 px-1.5 py-0.2 rounded uppercase">
                        {selectedLandmark.level} Content
                      </span>
                      <span className="text-[9px] font-semibold text-memzi-forest/40">Lumo Guide</span>
                    </div>
                    <p className="text-xs text-[#333333] leading-relaxed">
                      {selectedLandmark.description}
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "books" && (
                <motion.div
                  key="books-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex flex-col justify-center space-y-4"
                >
                  <div className="text-center py-2">
                    <h5 className="font-display font-bold text-sm text-[#1B3012]">Cozy HSK Book Shelf</h5>
                    <p className="text-[10px] text-memzi-forest/60">Study characters in logical chapters</p>
                  </div>

                  {/* Horizontal Scroll Shelf */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3.5 rounded-2xl border border-white flex flex-col justify-between shadow-sm">
                      <div>
                        <span className="p-1 bg-[#DCEDC8] text-[#33691E] rounded-md text-[9px] font-extrabold uppercase">Unit 1</span>
                        <h6 className="font-extrabold text-xs text-[#1B3012] mt-2 leading-tight">First Greetings (你好)</h6>
                        <p className="text-[10px] text-memzi-forest/60 mt-1">12 vital HSK 1 characters</p>
                      </div>
                      <div className="w-full bg-[#E6EBE0] h-1.5 rounded-full overflow-hidden mt-3">
                        <div className="bg-memzi-green-light w-4/5 h-full rounded-full" />
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-white flex flex-col justify-between shadow-sm">
                      <div>
                        <span className="p-1 bg-[#DCEDC8] text-[#33691E] rounded-md text-[9px] font-extrabold uppercase">Unit 2</span>
                        <h6 className="font-extrabold text-xs text-[#1B3012] mt-2 leading-tight">Number Magic (一二三)</h6>
                        <p className="text-[10px] text-memzi-forest/60 mt-1">15 counting patterns</p>
                      </div>
                      <div className="w-full bg-[#E6EBE0] h-1.5 rounded-full overflow-hidden mt-3">
                        <div className="bg-memzi-green-light w-1/3 h-full rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Interactive character stroke order tip */}
                  <div className="bg-white/80 p-3.5 rounded-2xl border border-white/60 text-xs flex gap-2 items-center">
                    <div className="w-10 h-10 border border-emerald-100 rounded-lg bg-green-50 flex items-center justify-center font-bold text-lg text-emerald-800 shrink-0 font-display">
                      你
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-[#1B3012]">Stroke Order Animator</p>
                      <p className="text-[10px] text-memzi-forest/70">Left-side radical (人 symbol) stands for human connection.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom mini stats banner */}
            <div className="flex justify-between items-center bg-white/40 border border-white/50 p-2 rounded-xl text-[9px] font-mono text-memzi-teal font-semibold">
              <span className="flex items-center gap-1">🟢 Server State: Online</span>
              <span>App Target: HSK 1-6</span>
              <span className="flex items-center gap-0.5 text-rose-600"><Heart size={10} fill="currentColor" /> Lumo Buddy</span>
            </div>
          </div>
        </div>
      </main>

      {/* CORE PEDAGOGICAL DEMO: HSK LIVING LIBRARY */}
      <section className="px-6 md:px-12 py-12 max-w-7xl mx-auto w-full border-t border-[#E6EBE0]">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-memzi-green-light font-mono mb-1.5">Interactive Playground Area</p>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-memzi-forest tracking-tight">
            Check Your Mandarin Foundation
          </h2>
          <p className="text-sm text-memzi-clay mt-1.5">
            Test our planned core gamified mechanics in real-time. Use the toggles below to switch HSK levels and challenge yourself with Lumo's sprout pairing mini-game!
          </p>
        </div>
        
        <HskExplorer />
      </section>

      {/* FOOTER AND ACCLAIM DETAILS */}
      <footer className="mt-16 bg-white border-t border-[#E6EBE0]">
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-[#E6EBE0]">
          {/* Brand */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <span className="text-xl">🌱</span>
              <span className="font-extrabold tracking-tight text-[#2D4F1E] font-display">
                Memzi <span className="font-light text-[#558B2F]">Living World</span>
              </span>
            </div>
            <p className="text-xs text-[#556B4B]/80 italic">
              Bringing magic and game-driven delight to HSK language metrics.
            </p>
          </div>

          {/* Social connections */}
          <div className="flex justify-center gap-4 text-xs font-semibold text-[#558B2F]">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-memzi-forest hover:underline">Twitter / X</a>
            <span>•</span>
            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="hover:text-memzi-forest hover:underline">Discord Community</a>
            <span>•</span>
            <a href="mailto:hello@memziworld.com" className="hover:text-memzi-forest hover:underline">Email Support</a>
          </div>

          {/* Waitlist status summary */}
          <div className="text-center md:text-right text-xs text-memzi-teal font-medium">
            <p>Waitlist is currently <span className="text-emerald-600 font-bold">ACTIVE</span></p>
            <p className="text-[10px] text-memzi-forest/40 mt-1 font-mono">Join waitlist for exclusive closed alpha access keys!</p>
          </div>
        </div>

        {/* BOTTOM METADATA RAIL */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A5D6A7] font-bold uppercase tracking-[0.2em] gap-2 pt-4 sm:pt-0 pb-4 sm:pb-0">
          <span>© 2026 Memzi Labs</span>
          <span className="normal-case tracking-normal text-[#556B4B]/60 font-semibold font-mono">Ask Lumo Custom Support Engine</span>
          <span>Version 1.0.4-Lumo</span>
        </div>
      </footer>

      {/* FLOAT CHAT OVERLAY */}
      <ChatWidget />

      {/* CHANNELS MODAL (VIDEO TRAILER DIALOG) */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#14302e]/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 border border-[#E6EBE0] max-w-lg w-full shadow-2xl relative space-y-4"
            >
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-memzi-cream hover:bg-memzi-cream-dark transition-colors"
                id="close-trailer-btn"
              >
                <X size={16} />
              </button>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-memzi-sprout/40 mx-auto flex items-center justify-center text-xl">
                  🎬
                </div>
                <h4 className="text-lg font-extrabold font-display text-memzi-forest">Memzi Living World Trailer Simulator</h4>
                <p className="text-xs text-[#556B4B] max-w-sm mx-auto leading-relaxed">
                  "Step into Book World, a floating bookshelf where Chinese characters take physical form. Travel down whisperwind paths with Lumo, collecting water gems and matching tone symbols in interactive game maps."
                </p>
              </div>

              {/* Graphic Mock Video Screen */}
              <div className="aspect-video w-full rounded-2xl bg-memzi-forest border border-memzi-cream-dark shadow-inner overflow-hidden flex flex-col items-center justify-center p-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1D3B3A]/80 to-memzi-forest/95 pointer-events-none" />
                <div className="absolute top-2 left-2 flex gap-1 z-10">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[8px] font-mono font-bold text-white/50 tracking-widest uppercase">HD STREAM PREVIEW</span>
                </div>
                <div className="z-10 text-center space-y-2">
                  <span className="text-6xl animate-bounce inline-block">🏯</span>
                  <p className="text-xs font-bold text-memzi-sprout italic">Whisperwind Bamboo Zen Valley</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Audio Sync: Completed</p>
                </div>
                <div className="absolute bottom-2 right-2 text-[9px] text-white/30 font-mono">
                  Press ESC or close button to exit
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="flex-1 bg-[#2D4F1E] hover:bg-[#1B3012] text-white text-xs font-bold py-3 rounded-xl shadow-md transition-colors text-center"
                >
                  Return to Exploration
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOTIFICATION CONTAINER */}
      <AnimatePresence>
        {modalMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 z-50 bg-memzi-forest text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-memzi-green/20 flex items-center justify-between gap-3 text-xs font-medium max-w-sm"
          >
            <span>{modalMessage}</span>
            <button
              onClick={() => setModalMessage(null)}
              className="text-memzi-sprout font-bold uppercase tracking-wider text-[10px] hover:text-white"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
