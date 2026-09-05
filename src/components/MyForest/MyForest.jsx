import React from 'react';
import {
  TreePine,
  Droplets,
  Sparkles,
  MapPin,
  Plus,
  ArrowUpRight,
  Leaf
} from 'lucide-react';
import { StatNumber } from '../ui';
import { confettiSmall } from '../../services/confetti';

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

    if (xp >= 1000) return { level: 5, title: "Ancient", nextXp: 1500, currentXp: xp };
    if (xp >= 600) return { level: 4, title: "Canopy", nextXp: 1000, currentXp: xp };
    if (xp >= 300) return { level: 3, title: "Sapling", nextXp: 600, currentXp: xp };
    if (xp >= 100) return { level: 2, title: "Seedling", nextXp: 300, currentXp: xp };
    return { level: 1, title: "Sprout", nextXp: 100, currentXp: xp };
  };

  const handleWaterClick = (tree, e) => {
    e.stopPropagation();
    onWaterTree(tree.id);
    confettiSmall();
  };

  const handleScanClick = (tree, e) => {
    e.stopPropagation();
    onRunAIScan(tree);
  };

  return (
    <div className="space-y-6 animate-enter">

      {/* Header */}
      <div className="card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div
            className="w-11 h-11 rounded-md flex items-center justify-center shrink-0"
            style={{
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-border-25)',
            }}
          >
            <Leaf className="w-5 h-5" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <div className="eyebrow text-fg-subtle mb-1.5">In your canopy</div>
            <h2 className="text-h2 text-fg">Your forest</h2>
            <p className="text-body text-fg-muted mt-1.5">
              {trees.length === 0
                ? 'Plant your first sapling to start your canopy.'
                : `${trees.length} tree${trees.length === 1 ? '' : 's'} under your care.`}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenPlantModal}
          className="btn btn-primary"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>Plant tree</span>
        </button>
      </div>

      {/* Trees grid */}
      {trees.length === 0 ? (
        <div className="surface p-12 text-center">
          <div className="w-12 h-12 rounded-md bg-[#161616] border border-[#262626] flex items-center justify-center mx-auto mb-4">
            <TreePine className="w-5 h-5 text-emerald-500" strokeWidth={2} />
          </div>
          <h3 className="text-[15px] font-semibold text-white">No trees yet</h3>
          <p className="text-[13px] text-[#6b6b6b] max-w-sm mx-auto mt-1 leading-relaxed">
            Plant your first sapling on campus or in your neighborhood and start tracking its growth.
          </p>
          <button
            onClick={onOpenPlantModal}
            className="btn btn-primary mt-5"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>Plant your first tree</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {trees.map((tree) => {
            const plantLvl = getPlantLevel(tree);
            const xpPct = Math.min(100, Math.round((plantLvl.currentXp / plantLvl.nextXp) * 100));

            return (
              <div
                key={tree.id}
                onClick={() => onSelectTree(tree)}
                className="surface surface-hover p-5 cursor-pointer group flex flex-col justify-between min-h-[200px]"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-md bg-[#161616] border border-[#262626] flex items-center justify-center text-[16px] shrink-0">
                        {tree.planterAvatar || '🌳'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white text-[14px] truncate group-hover:text-emerald-500 transition-colors">
                          {tree.name}
                        </h3>
                        <p className="text-[11px] text-[#6b6b6b] truncate">
                          {tree.speciesName}
                        </p>
                      </div>
                    </div>

                    <span className="chip">
                      Lv.{plantLvl.level}
                    </span>
                  </div>

                  {/* XP progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-[#a1a1a1]">{plantLvl.title}</span>
                      <span className="text-[#6b6b6b] tabular-nums">
                        {plantLvl.currentXp} / {plantLvl.nextXp} XP
                      </span>
                    </div>
                    <div className="h-1 w-full bg-[#161616] rounded-full overflow-hidden">
                      <div
                        style={{ width: `${xpPct}%` }}
                        className="h-full bg-emerald-500 transition-all duration-500"
                      />
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#1f1f1f] text-[11px]">
                    <div>
                      <div className="text-[#6b6b6b]">Health</div>
                      <div className="text-white tabular-nums font-medium mt-0.5">
                        {tree.healthScore || 90}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[#6b6b6b]">CO₂</div>
                      <div className="text-white tabular-nums font-medium mt-0.5">
                        {tree.co2OffsetKg || 15} kg
                      </div>
                    </div>
                    <div>
                      <div className="text-[#6b6b6b]">Height</div>
                      <div className="text-white tabular-nums font-medium mt-0.5">
                        {tree.heightMeters || 1.8}m
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#6b6b6b] mt-3 truncate">
                    <MapPin className="w-3 h-3 shrink-0" strokeWidth={2} />
                    <span className="truncate">{tree.address}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[#1f1f1f]">
                  <button
                    onClick={(e) => handleWaterClick(tree, e)}
                    aria-label={`Log watering for ${tree.name}`}
                    className="btn btn-secondary text-[12px] flex-1"
                  >
                    <Droplets className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                    <span>Water</span>
                  </button>

                  <button
                    onClick={(e) => handleScanClick(tree, e)}
                    aria-label={`Run AI diagnostic on ${tree.name}`}
                    className="btn btn-secondary text-[12px] flex-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                    <span>AI scan</span>
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectTree(tree); }}
                    className="w-9 h-9 inline-flex items-center justify-center rounded-md text-[#a1a1a1] hover:text-white hover:bg-[#161616] border border-[#262626] focus-ring"
                    title="Open passport"
                    aria-label={`Open ${tree.name} passport`}
                  >
                    <ArrowUpRight className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
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