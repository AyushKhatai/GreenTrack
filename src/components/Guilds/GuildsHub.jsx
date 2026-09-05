import React, { useState } from 'react';
import {
  Trophy,
  Users,
  Sparkles,
  Plus,
  CheckCircle2,
  Crown,
  ArrowRightLeft,
  Flame
} from 'lucide-react';
import { confettiSmall, confettiMajor } from '../../services/confetti';
import { loadGuilds, getUserGuild, setUserGuild } from '../../data/guildsData';
import { Modal, SectionHeader, StatNumber, StatTile, StatusBadge } from '../ui';

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
      unit: "Trees planted",
      rewardXp: 500,
      badgeReward: "Sprint Victor",
      daysLeft: 4
    },
    {
      id: "quest-hydration-7",
      title: "7-Day Zero-Drought Streak",
      category: "Survival",
      description: "Maintain a 7-day continuous hydration schedule across all campus saplings.",
      target: 7,
      currentProgress: 5,
      unit: "Days completed",
      rewardXp: 350,
      badgeReward: "Hydration Master",
      daysLeft: 2
    },
    {
      id: "quest-ai-scout",
      title: "AI Diagnostic Scout Patrol",
      category: "Verification",
      description: "Scan 10 trees with the AI Doctor camera to identify early signs of nutrient deficiency.",
      target: 10,
      currentProgress: 7,
      unit: "Scans verified",
      rewardXp: 400,
      badgeReward: "Botanical Scout",
      daysLeft: 6
    }
  ]);
  const [switchModalOpen, setSwitchModalOpen] = useState(false);

  const activeGuild = guilds.find(g => g.id === activeGuildId) || guilds[0];

  const handleJoinGuild = (id) => {
    setUserGuild(id);
    setActiveGuildId(id);
    setSwitchModalOpen(false);
    confettiSmall();
  };

  const handleContributeQuest = (questId) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId && q.currentProgress < q.target) {
        const nextProg = q.currentProgress + 1;
        if (nextProg === q.target) {
          confettiMajor();
        }
        return { ...q, currentProgress: nextProg };
      }
      return q;
    }));
  };

  return (
    <div className="space-y-8 animate-enter">

      {/* Active guild sub-hero */}
      <div className="card-elevated p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="w-14 h-14 rounded-md flex items-center justify-center text-[26px] shrink-0"
            style={{
              background: 'var(--accent-soft)',
              border: '1px solid var(--accent-border-25)',
            }}
          >
            {activeGuild.avatar}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <Crown className="w-3.5 h-3.5 text-status-healthy" strokeWidth={2} />
              <StatusBadge variant="healthy" label={`Rank #${activeGuild.rank}`} size="xs" />
            </div>
            <h2 className="text-h2 text-fg truncate">{activeGuild.name}</h2>
            <p className="text-body text-fg-muted italic mt-1">"{activeGuild.motto}"</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSwitchModalOpen(true)}
            className="btn btn-secondary"
          >
            <Users className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Switch guild</span>
          </button>

          <button
            onClick={onPlantForGuild}
            className="btn btn-primary"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>Plant for guild</span>
          </button>
        </div>
      </div>

      {/* Guild stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile
          label="Squad XP"
          value={activeGuild.squadXp.toLocaleString()}
          sub={`Rank #${activeGuild.rank}`}
          tone="healthy"
        />
        <StatTile
          label="Trees under care"
          value={activeGuild.treesTracked}
          sub={`${activeGuild.membersCount} active members`}
        />
        <StatTile
          label="Survival rate"
          value={`${activeGuild.survivalRate}%`}
          tone={activeGuild.survivalRate >= 80 ? 'healthy' : activeGuild.survivalRate >= 60 ? 'attention' : 'critical'}
          sub="AI-verified"
        />
        <StatTile
          label="CO₂ sequestered"
          value={`${activeGuild.totalCo2Kg}`}
          unit="kg"
          sub="Total clan impact"
        />
      </div>

      {/* Active quests */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Active quests"
          title="Earn squad XP with your guild"
          description="Time-bound missions, plant drives, and verification sprints that move your clan up the leaderboard."
          icon={Flame}
          trailing={<StatusBadge variant="neutral" label={`${quests.length} active`} size="xs" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {quests.map((quest) => {
            const pct = Math.round((quest.currentProgress / quest.target) * 100);
            const isCompleted = quest.currentProgress >= quest.target;

            return (
              <div
                key={quest.id}
                className="card p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="chip">{quest.category}</span>
                    <span className="text-caption text-fg-subtle nums">{quest.daysLeft}d left</span>
                  </div>

                  <h4 className="text-h3 text-fg leading-snug mb-2">
                    {quest.title}
                  </h4>
                  <p className="text-body text-fg-muted leading-relaxed">
                    {quest.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-line space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="eyebrow text-fg-subtle">Progress</span>
                      <span className="text-fg nums font-medium">
                        {quest.currentProgress} / {quest.target} {quest.unit}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-surface-1 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, pct)}%` }}
                        className={`h-full transition-all duration-500 ${
                          isCompleted ? 'bg-status-attention' : 'bg-status-healthy'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-caption text-fg-muted flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-status-healthy" strokeWidth={2} />
                      +{quest.rewardXp} XP
                    </span>

                    {isCompleted ? (
                      <span
                        className="inline-flex items-center gap-1.5 chip"
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          fontSize: '12px',
                          color: 'var(--status-healthy-fg)',
                          borderColor: 'var(--status-healthy-border)',
                          background: 'var(--status-healthy-bg)',
                        }}
                        aria-label={`Quest ${quest.title} completed`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleContributeQuest(quest.id)}
                        className="btn btn-primary"
                        style={{ height: '28px', padding: '0 10px', fontSize: '12px' }}
                        aria-label={`Contribute to ${quest.title}`}
                      >
                        Contribute
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Guild standings"
          title="Survival leaderboard"
          description="Ranked by squad XP, survival rate, and verified tree volume."
          icon={Trophy}
          trailing={<StatusBadge variant="live" label="Updated live" size="xs" pulse />}
        />

        <div className="card overflow-hidden">
          <div className="divide-y divide-line">
          {guilds.map((g, idx) => {
            const isUserGuild = g.id === activeGuildId;
            return (
              <div
                key={g.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isUserGuild ? 'bg-surface-1' : 'hover:bg-surface-1 transition-colors'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center font-semibold text-[12px] nums shrink-0 ${
                    idx === 0 ? 'bg-status-healthy text-fg' :
                    idx === 1 ? 'bg-surface-3 text-fg' :
                    idx === 2 ? 'bg-surface-2 text-fg-muted' :
                    'bg-transparent text-fg-subtle border border-line-elev'
                  }`}>
                    {idx + 1}
                  </div>

                  <div className="w-9 h-9 rounded-md bg-surface-2 border border-line-elev flex items-center justify-center text-[18px] shrink-0">
                    {g.avatar}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-fg text-[14px] truncate">
                        {g.name}
                      </span>
                      {isUserGuild && (
                        <StatusBadge variant="verified" label="You" size="xs" />
                      )}
                    </div>
                    <div className="text-[11px] text-fg-subtle truncate">
                      {g.city} · {g.membersCount} members · {g.leader}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 text-right">
                  <div>
                    <StatNumber value={`${g.squadXp.toLocaleString()}`} unit="XP" size="sm" />
                    <div className="eyebrow text-fg-subtle mt-1">
                      {g.survivalRate}% survival
                    </div>
                  </div>
                  <div className="text-body font-medium text-fg-muted nums">
                    {g.treesTracked} trees
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </section>

      {/* Switch modal */}
      <Modal
        open={switchModalOpen}
        onClose={() => setSwitchModalOpen(false)}
        title="Switch guild"
        subtitle="Choose a college or neighborhood guild to represent"
        icon={ArrowRightLeft}
        size="md"
      >
        <div className="space-y-1 max-h-72 overflow-y-auto">
          {guilds.map((g) => {
            const active = g.id === activeGuildId;
            return (
              <button
                key={g.id}
                onClick={() => handleJoinGuild(g.id)}
                className={`w-full p-3 rounded-md text-left flex items-center justify-between transition-colors ${
                  active
                    ? 'border border-line-elev bg-surface-2'
                    : 'border border-transparent hover:border-line-elev hover:bg-surface-1'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[20px]">{g.avatar}</span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-fg truncate">{g.name}</div>
                    <div className="text-[11px] text-fg-subtle truncate">{g.city}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-status-healthy nums">
                    {g.squadXp.toLocaleString()}
                  </span>
                  {active && <CheckCircle2 className="w-4 h-4 text-status-healthy" strokeWidth={2} />}
                </div>
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
