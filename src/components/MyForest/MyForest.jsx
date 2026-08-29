import React from 'react';
import { 
  TreePine, 
  Droplets, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Flame, 
  Plus, 
  Calendar, 
  MapPin, 
  Award,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MyForest({ 
  trees = [], 
  onSelectTree, 
  onWaterTree, 
  onRunAIScan, 
  onOpenPlantModal 
}) {
  const getPlantLevel = (tree) => {
    const ageDays = Math.max(1, Math.round((new Date() - new Date(tree.datePlanted)) / (1000 * 3600 * 24)));
    const eventsCount = tree.history ? tree.history.length : 1;
    const xp = eventsCount * 50 + ageDays * 5 + (tree.healthScore || 90);

    if (xp >= 1000) return { level: 5, title: "Ancient Titan", icon: "👑", nextXp: 1500, currentXp: xp, color: "text-amber-400" };
    if (xp >= 600) return { level: 4, title: "Urban Canopy", icon: "🌲", nextXp: 1000, currentXp: xp, color: "text-emerald-400" };
    if (xp >= 300) return { level: 3, title: "Rooted Sapling", icon: "🌳", nextXp: 600, currentXp: xp, color: "text-teal-400" };
    if (xp >= 100) return { level: 2, title: "Growing Seedling", icon: "🌿", nextXp: 300, currentXp: xp, color: "text-green-400" };
    return { level: 1, title: "Tender Sprout", icon: "🌱", nextXp: 100, currentXp: xp, color: "text-emerald-300" };
  };

  const handleWaterClick = (tree, e) => {
    e.stopPropagation();
    onWaterTree(tree.id);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#06b6d4', '#3b82f6', '#10b981']
    });
  };

  const handleScanClick = (tree, e) => {
    e.stopPropagation();
    onRunAIScan(tree);
  };

  return (
    <div className="space-y-8 animate-enter">
      
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30 mb-2">
            <TreePine className="w-3.5 h-3.5" />
            <span>My Active Urban Forest</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Your Tracked Trees & Growth Passports
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Log regular waterings, verify health scans with AI, and level up your living trees
          </p>
        </div>

        <button
          onClick={onOpenPlantModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 hover:scale-[1.02] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Plant New Tree (+120 XP)</span>
        </button>
      </div>

      {/* Trees Grid */}
      {trees.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-3xl flex items-center justify-center mx-auto">
            🌱
          </div>
          <h3 className="font-extrabold text-white text-lg">No Trees Planted Yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Begin your journey by planting your first sapling on campus or in your neighborhood. Mint a digital QR passport and start your survival streak!
          </p>
          <button
            onClick={onOpenPlantModal}
            className="px-6 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg"
          >
            Plant Your First Sapling
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trees.map((tree) => {
            const plantLvl = getPlantLevel(tree);
            const xpPct = Math.min(100, Math.round((plantLvl.currentXp / plantLvl.nextXp) * 100));

            return (
              <div
                key={tree.id}
                onClick={() => onSelectTree(tree)}
                className="glass-panel glass-panel-hover p-6 rounded-3xl flex flex-col justify-between cursor-pointer group relative overflow-hidden space-y-5"
              >
                {/* Top Row: Avatar & Level */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {tree.planterAvatar || "🌳"}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-base group-hover:text-emerald-300 transition-colors">
                          {tree.name}
                        </h3>
                        <p className="text-xs text-slate-400 italic">
                          {tree.speciesName}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-emerald-500/30 font-bold text-emerald-400 flex items-center gap-1">
                      <span>{plantLvl.icon}</span>
                      <span>Lv.{plantLvl.level}</span>
                    </span>
                  </div>

                  {/* Level & XP Progress Bar */}
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className={plantLvl.color}>{plantLvl.title}</span>
                      <span className="text-slate-400 font-mono">{plantLvl.currentXp} / {plantLvl.nextXp} XP</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        style={{ width: `${xpPct}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                      />
                    </div>
                  </div>

                  {/* Location & Stats */}
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{tree.address}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-emerald-500/10 text-[11px]">
                      <span className="text-slate-400">Health: <b className="text-emerald-400">{tree.healthScore || 90}%</b></span>
                      <span className="text-slate-400">CO₂: <b className="text-teal-300">{tree.co2OffsetKg || 15} kg</b></span>
                      <span className="text-slate-400">Height: <b className="text-white">{tree.heightMeters || 1.8}m</b></span>
                    </div>
                  </div>
                </div>

                {/* Bottom Care Actions */}
                <div className="pt-4 border-t border-emerald-500/15 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => handleWaterClick(tree, e)}
                    className="px-3.5 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-all border border-blue-500/30"
                    title="Log watering check-in"
                  >
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                    <span>Water (+15 XP)</span>
                  </button>

                  <button
                    onClick={(e) => handleScanClick(tree, e)}
                    className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-all border border-purple-500/30"
                    title="Run AI vision check"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>AI Scan</span>
                  </button>

                  <button
                    onClick={() => onSelectTree(tree)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                    title="Open Digital Passport"
                  >
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
