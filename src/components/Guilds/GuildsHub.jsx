import React, { useState } from 'react';
import { 
  Trophy, 
  Users, 
  TreePine, 
  Flame, 
  Sparkles, 
  Droplets, 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  Compass,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { loadGuilds, saveGuilds, getUserGuild, setUserGuild } from '../../data/guildsData';

export default function GuildsHub({ onPlantForGuild, onOpenMap }) {
  const [guilds, setGuilds] = useState(loadGuilds());
  const [activeGuildId, setActiveGuildId] = useState(getUserGuild());
  const [quests, setQuests] = useState([
    {
      id: "quest-sprint-1",
      title: "Inter-College Green Sprint",
      category: "Campus Clash",
      description: "Plant & verify 50 native saplings on campus or urban greenways within 14 days.",
      target: 50,
      currentProgress: 38,
      unit: "Trees Planted",
      rewardXp: 500,
      badgeReward: "Green Sprint Victor",
      daysLeft: 4,
      accent: "from-amber-500/20 to-yellow-500/5 text-amber-400 border-amber-500/30"
    },
    {
      id: "quest-hydration-7",
      title: "7-Day Zero-Drought Streak",
      category: "Survival Quest",
      description: "Maintain a 7-day continuous hydration schedule across all campus saplings.",
      target: 7,
      currentProgress: 5,
      unit: "Days Completed",
      rewardXp: 350,
      badgeReward: "Hydration Master",
      daysLeft: 2,
      accent: "from-blue-500/20 to-cyan-500/5 text-blue-400 border-blue-500/30"
    },
    {
      id: "quest-ai-scout",
      title: "AI Diagnostic Scout Patrol",
      category: "Health Verification",
      description: "Scan 10 trees with the AI Doctor camera to identify early signs of nutrient deficiency.",
      target: 10,
      currentProgress: 7,
      unit: "Scans Verified",
      rewardXp: 400,
      badgeReward: "Botanical Scout",
      daysLeft: 6,
      accent: "from-purple-500/20 to-emerald-500/5 text-purple-400 border-purple-500/30"
    }
  ]);
  const [switchModalOpen, setSwitchModalOpen] = useState(false);

  const activeGuild = guilds.find(g => g.id === activeGuildId) || guilds[0];

  const handleJoinGuild = (id) => {
    setUserGuild(id);
    setActiveGuildId(id);
    setSwitchModalOpen(false);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleContributeQuest = (questId) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId && q.currentProgress < q.target) {
        const nextProg = q.currentProgress + 1;
        if (nextProg === q.target) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6']
          });
        }
        return { ...q, currentProgress: nextProg };
      }
      return q;
    }));
  };

  return (
    <div className="space-y-8 animate-enter">
      
      {/* Clan Hero Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Guild Territory • Rank #{activeGuild.rank}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{activeGuild.avatar}</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {activeGuild.name}
              </h2>
              <p className="text-xs text-emerald-400 font-semibold italic mt-0.5">
                "{activeGuild.motto}"
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSwitchModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-teal-400" />
            <span>Switch Clan</span>
          </button>

          <button
            onClick={onPlantForGuild}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Plant for Your Clan</span>
          </button>
        </div>
      </div>

      {/* Guild Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/15">
          <div className="text-[11px] font-bold uppercase text-slate-400">Clan XP Score</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
            {activeGuild.squadXp.toLocaleString()} <span className="text-xs font-bold text-slate-400">XP</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Rank #{activeGuild.rank} Overall</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/15">
          <div className="text-[11px] font-bold uppercase text-slate-400">Trees Under Care</div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            {activeGuild.treesTracked}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">{activeGuild.membersCount} Active Members</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/15">
          <div className="text-[11px] font-bold uppercase text-slate-400">Survival Rate</div>
          <div className="text-2xl sm:text-3xl font-black text-teal-400 mt-1">
            {activeGuild.survivalRate}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Verified with AI Scans</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/15">
          <div className="text-[11px] font-bold uppercase text-slate-400">CO₂ Sequestered</div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 mt-1">
            {activeGuild.totalCo2Kg} <span className="text-xs font-bold text-slate-400">kg</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Total Clan Impact</div>
        </div>

      </div>

      {/* Active Quests & Challenges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              Active Clan Quests & Competitions
            </h3>
            <p className="text-xs text-slate-400">
              Work together with your campus & neighborhood clan to earn massive squad XP
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/20 text-emerald-300 hidden sm:inline">
            3 Active Quests
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quests.map((quest) => {
            const pct = Math.round((quest.currentProgress / quest.target) * 100);
            const isCompleted = quest.currentProgress >= quest.target;

            return (
              <div
                key={quest.id}
                className="glass-panel p-6 rounded-3xl border border-emerald-500/15 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                      {quest.category}
                    </span>
                    <span className="text-[10px] font-bold text-amber-400">
                      ⏱️ {quest.daysLeft} days left
                    </span>
                  </div>

                  <h4 className="font-extrabold text-white text-base">
                    {quest.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {quest.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-emerald-400">
                        {quest.currentProgress} / {quest.target} {quest.unit} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        style={{ width: `${Math.min(100, pct)}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-amber-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Reward & Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-500/10">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>+{quest.rewardXp} XP</span>
                    </span>

                    <button
                      onClick={() => handleContributeQuest(quest.id)}
                      disabled={isCompleted}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                      }`}
                    >
                      {isCompleted ? "✅ Completed" : "Contribute Progress"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clan Leaderboard Table */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15">
          <div>
            <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Inter-College & Neighborhood Clan Standings
            </h3>
            <p className="text-xs text-slate-400">Ranked by total squad XP, survival rates, and verified tree volume</p>
          </div>
        </div>

        <div className="space-y-3">
          {guilds.map((g, idx) => {
            const isUserGuild = g.id === activeGuildId;
            const rankColors = [
              'bg-amber-500/20 text-amber-400 border-amber-500/40',
              'bg-slate-300/20 text-slate-200 border-slate-300/40',
              'bg-amber-700/20 text-amber-500 border-amber-700/40'
            ];

            return (
              <div
                key={g.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isUserGuild
                    ? 'bg-emerald-950/40 border-emerald-500/40 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/20'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Rank badge */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs border shrink-0 ${
                    idx < 3 ? rankColors[idx] : 'bg-slate-950 text-slate-500 border-slate-800'
                  }`}>
                    #{idx + 1}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl shrink-0">
                    {g.avatar}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-base">
                        {g.name}
                      </span>
                      {isUserGuild && (
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                          Your Clan
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      {g.city} • {g.membersCount} Members • Leader: {g.leader}
                    </div>
                  </div>
                </div>

                {/* Score Stats */}
                <div className="flex items-center justify-between sm:justify-end gap-6 text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div>
                    <div className="text-sm font-extrabold text-emerald-400">
                      {g.squadXp.toLocaleString()} XP
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {g.survivalRate}% Survival Rate
                    </div>
                  </div>

                  <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-teal-300">
                    {g.treesTracked} Trees
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Switch Guild Modal */}
      {switchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-emerald-500/30 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 animate-enter">
            <h3 className="font-extrabold text-white text-lg">Choose Your Clan / Campus</h3>
            <p className="text-xs text-slate-400">Select the college or neighborhood guild you want to represent:</p>
            
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {guilds.map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleJoinGuild(g.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    g.id === activeGuildId
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{g.avatar}</span>
                    <div>
                      <div className="text-xs font-bold">{g.name}</div>
                      <div className="text-[10px] text-slate-400">{g.city}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">{g.squadXp} XP</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setSwitchModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
