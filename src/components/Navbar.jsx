import React, { useState, useRef, useEffect } from 'react';
import {
  Sprout,
  TreePine,
  MapPin,
  BookOpen,
  Trophy,
  Plus,
  QrCode,
  Sparkles,
  Menu,
  X,
  Activity
} from 'lucide-react';
import { hasGeminiApiKey } from '../services/geminiService';
import { loadGuilds, getUserGuild } from '../data/guildsData';
import { VisuallyHidden } from './ui';

export default function Navbar({
  currentTab,
  setCurrentTab,
  aggregateImpact,
  onOpenPlantModal,
  onOpenQRScanner
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const guilds = loadGuilds();
  const userGuildId = getUserGuild();
  const activeGuild = guilds.find(g => g.id === userGuildId) || guilds[0];
  const isGeminiReady = hasGeminiApiKey();

  const navItems = [
    { id: 'dashboard', label: 'Forest', icon: TreePine },
    { id: 'guilds', label: 'Guilds', icon: Trophy },
    { id: 'doctor', label: 'AI Doctor', icon: Sparkles },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'encyclopedia', label: 'Encyclopedia', icon: BookOpen },
  ];

  const handleNavClick = (tabId) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  // Close the mobile menu on Escape and return focus to the trigger.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Brand */}
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2 group focus-ring rounded-md"
            aria-label="GreenTrack home"
          >
            <div className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center" aria-hidden="true">
              <Sprout className="w-4 h-4 text-[#052e16]" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-white">
              GreenTrack
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-1.5 h-8 px-3 rounded-md text-[13px] font-medium transition-colors focus-ring ${
                    isActive
                      ? 'bg-[#161616] text-white'
                      : 'text-[#a1a1a1] hover:text-white hover:bg-[#111111]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.id === 'doctor' && isGeminiReady && (
                    <span
                      className="ml-1 w-1.5 h-1.5 rounded-full bg-emerald-500 dot-pulse"
                      aria-label="Gemini AI ready"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <div
              className="hidden lg:flex items-center gap-3 mr-1 px-3 h-8 rounded-md border border-[#1f1f1f] bg-[#111111]"
              aria-label={`Total CO₂ sequestered: ${aggregateImpact.totalCo2Kg} kilograms`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} aria-hidden="true" />
              <span className="text-[12px] text-[#a1a1a1]">CO₂</span>
              <span className="text-[12px] font-semibold text-white tabular-nums">
                {aggregateImpact.totalCo2Kg >= 1000
                  ? `${(aggregateImpact.totalCo2Kg / 1000).toFixed(2)}t`
                  : `${Math.round(aggregateImpact.totalCo2Kg)}kg`}
              </span>
            </div>

            <button
              onClick={onOpenQRScanner}
              title="Scan QR"
              aria-label="Scan QR code"
              className="hidden sm:inline-flex w-8 h-8 items-center justify-center rounded-md text-[#a1a1a1] hover:text-white hover:bg-[#111111] border border-[#1f1f1f] focus-ring"
            >
              <QrCode className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
            </button>

            <button
              onClick={onOpenPlantModal}
              className="btn btn-primary h-8 px-3 text-[13px] focus-ring"
              aria-label="Plant a new tree"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden="true" />
              <span className="hidden sm:inline">Plant tree</span>
              <VisuallyHidden className="sm:hidden">Plant a new tree</VisuallyHidden>
            </button>

            <button
              ref={menuButtonRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="primary-mobile-menu"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden w-8 h-8 inline-flex items-center justify-center rounded-md text-[#a1a1a1] hover:text-white hover:bg-[#111111] border border-[#1f1f1f] focus-ring"
            >
              {mobileMenuOpen
                ? <X className="w-4 h-4" aria-hidden="true" />
                : <Menu className="w-4 h-4" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="primary-mobile-menu"
          ref={menuRef}
          className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} pb-3 pt-2 border-t border-[#1f1f1f] mt-1`}
          role="menu"
          aria-label="Primary"
        >
          <div className="grid grid-cols-2 gap-1 animate-enter">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 h-9 px-3 rounded-md text-[13px] font-medium focus-ring ${
                    isActive
                      ? 'bg-[#161616] text-white'
                      : 'text-[#a1a1a1] hover:text-white hover:bg-[#111111]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}