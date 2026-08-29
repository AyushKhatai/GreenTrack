import React, { useState } from 'react';
import { 
  Sprout, 
  TreePine, 
  MapPin, 
  BookOpen, 
  Trophy, 
  Plus, 
  QrCode, 
  Download, 
  Sparkles, 
  Menu, 
  X, 
  RotateCcw,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { exportDataAsCSV, exportDataAsJSON, resetToDemoData } from '../services/storageService';
import { hasGeminiApiKey } from '../services/geminiService';
import { loadGuilds, getUserGuild } from '../data/guildsData';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  aggregateImpact, 
  onOpenPlantModal, 
  onOpenQRScanner,
  onResetData 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dataMenuOpen, setDataMenuOpen] = useState(false);

  const guilds = loadGuilds();
  const userGuildId = getUserGuild();
  const activeGuild = guilds.find(g => g.id === userGuildId) || guilds[0];
  const isGeminiReady = hasGeminiApiKey();

  const navItems = [
    { id: 'dashboard', label: 'My Forest & Stats', icon: TreePine },
    { id: 'guilds', label: 'Guilds & Quests', icon: Trophy, badge: 'Clan Clash' },
    { id: 'doctor', label: 'AI Plant Doctor', icon: Sparkles, badge: isGeminiReady ? 'Gemini AI' : 'Vision' },
    { id: 'map', label: 'GIS Map Tracker', icon: MapPin },
    { id: 'encyclopedia', label: 'Plant Directory', icon: BookOpen },
  ];

  const handleNavClick = (tabId) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                  GreenTrack
                </span>
                <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  CLANS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Social Tree Survival & Campus Guilds
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-emerald-950/40 p-1.5 rounded-2xl border border-emerald-500/15">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                      : 'text-slate-300 hover:text-emerald-300 hover:bg-emerald-900/30'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Active Guild Badge */}
            <button
              onClick={() => handleNavClick('guilds')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/20 text-xs font-bold text-slate-200 hover:border-emerald-400 transition-all"
              title="Your Active Clan"
            >
              <span>{activeGuild.avatar}</span>
              <span className="truncate max-w-[100px] text-emerald-400">{activeGuild.name.split(' ')[0]}</span>
              <span className="text-[10px] text-amber-400">#{activeGuild.rank}</span>
            </button>

            {/* QR Scanner Quick Button */}
            <button
              onClick={onOpenQRScanner}
              title="Scan Physical Tree QR Tag"
              className="p-2.5 rounded-xl bg-slate-900/90 text-emerald-400 border border-emerald-500/20 hover:border-emerald-400 hover:bg-emerald-950/50 transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Data & Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDataMenuOpen(!dataMenuOpen)}
                className="p-2.5 rounded-xl bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-emerald-500/30 hover:text-emerald-300 transition-all"
                title="Export & Tools"
              >
                <Download className="w-4 h-4" />
              </button>

              {dataMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-emerald-500/30 shadow-2xl p-2 z-50 animate-enter text-xs space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Data Management
                  </div>
                  <button
                    onClick={() => { exportDataAsCSV(); setDataMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-900/40 text-slate-200 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" /> Export CSV Data
                  </button>
                  <button
                    onClick={() => { exportDataAsJSON(); setDataMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-900/40 text-slate-200 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-400" /> Export JSON Backup
                  </button>
                  <div className="border-t border-slate-800 my-1"></div>
                  <button
                    onClick={() => { onResetData(); setDataMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-950/40 text-red-400 flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-red-400" /> Reset Demo Trees
                  </button>
                </div>
              )}
            </div>

            {/* Plant New Sapling Button */}
            <button
              onClick={onOpenPlantModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Plant Tree</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-emerald-400 bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-emerald-500/20 grid grid-cols-2 gap-2 animate-enter">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-900/90 text-slate-300 hover:bg-emerald-900/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
