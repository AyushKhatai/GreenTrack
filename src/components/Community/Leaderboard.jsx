import React from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  Sparkles, 
  TreePine, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Flame,
  Star
} from 'lucide-react';

export default function Leaderboard({ trees = [] }) {
  // Compute leaderboard metrics from active trees
  const planterStats = {};

  trees.forEach(tree => {
    const planterName = tree.planter ? tree.planter.trim() : "Anonymous Guardian";
    if (!planterStats[planterName]) {
      planterStats[planterName] = {
        name: planterName,
        treesCount: 0,
        healthyCount: 0,
        totalCo2: 0,
        avatar: tree.planterAvatar || "🌿",
        role: tree.planterRole || "Eco Guardian"
      };
    }
    planterStats[planterName].treesCount++;
    if (tree.status === "Healthy") planterStats[planterName].healthyCount++;
    planterStats[planterName].totalCo2 += (tree.co2OffsetKg || 15);
  });

  const guardians = Object.values(planterStats).map(g => {
    const survivalRate = Math.round((g.healthyCount / g.treesCount) * 100);
    const xpPoints = g.treesCount * 120 + g.healthyCount * 80 + Math.round(g.totalCo2 * 5);
    return {
      ...g,
      survivalRate,
      xpPoints,
      totalCo2: +g.totalCo2.toFixed(1)
    };
  }).sort((a, b) => b.xpPoints - a.xpPoints);

  const achievements = [
    { id: 'ach-1', title: 'Forest Guardian', icon: '🌳', desc: 'Sustained 90%+ sapling survival rate over 6 months', unlocked: true },
    { id: 'ach-2', title: 'AI Doctor Visionary', icon: '🔬', desc: 'Completed 10+ AI pixel diagnostic health scans', unlocked: true },
    { id: 'ach-3', title: 'Carbon Heavyweight', icon: '🌍', desc: 'Sequestered over 100 kg of urban atmospheric CO₂', unlocked: true },
    { id: 'ach-4', title: 'Century Planter', icon: '🌱', desc: 'Registered 100+ community trees in the GIS registry', unlocked: false }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
            <Trophy className="w-3.5 h-3.5" />
            <span>Community Impact & Gamified Care</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Eco-Guardians Leaderboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Tree care isn't just about planting — it's about sustaining post-plantation survival. Guardians earn XP by logging waterings, conducting AI health checks, and maintaining survival rates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Leaderboard Table */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-400" />
              Guardian Rankings & XP
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Ranked by Sustained Impact</span>
          </div>

          <div className="space-y-3">
            {guardians.map((guardian, idx) => {
              const isTop3 = idx < 3;
              const rankColors = [
                'bg-amber-500/20 text-amber-400 border-amber-500/40',
                'bg-slate-300/20 text-slate-200 border-slate-300/40',
                'bg-amber-700/20 text-amber-500 border-amber-700/40'
              ];

              return (
                <div
                  key={guardian.name}
                  className="bg-slate-900/60 hover:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/15 transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank Badge */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs border ${
                      isTop3 ? rankColors[idx] : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}>
                      #{idx + 1}
                    </div>

                    {/* Avatar & Name */}
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl shrink-0">
                      {guardian.avatar}
                    </div>

                    <div>
                      <div className="font-bold text-white group-hover:text-emerald-300 transition-colors text-sm">
                        {guardian.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {guardian.role} • {guardian.treesCount} Trees Under Care
                      </div>
                    </div>
                  </div>

                  {/* Score Stats */}
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="font-extrabold text-emerald-400 text-sm">
                        {guardian.xpPoints.toLocaleString()} XP
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {guardian.survivalRate}% Survival
                      </div>
                    </div>

                    <div className="hidden sm:block text-xs font-semibold text-teal-300 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      {guardian.totalCo2} kg CO₂
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gamified Achievements Sidebar */}
        <div className="space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              Guardian Badges
            </h3>

            <div className="space-y-3">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                    ach.unlocked
                      ? 'bg-slate-900/70 border-emerald-500/25'
                      : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                  }`}
                >
                  <span className="text-2xl shrink-0 mt-0.5">{ach.icon}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-xs">{ach.title}</span>
                      {ach.unlocked && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {ach.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
