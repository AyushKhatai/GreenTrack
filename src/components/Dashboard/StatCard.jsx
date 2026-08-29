import React from 'react';
import { TrendingUp, TreePine, HeartPulse, Wind, Users, Award } from 'lucide-react';

export default function StatCards({ aggregateImpact }) {
  const stats = [
    {
      id: 'total',
      label: 'Trees Tracked',
      value: aggregateImpact.totalTrees,
      unit: 'Saplings',
      change: '+14% this month',
      icon: TreePine,
      color: 'emerald',
      gradient: 'from-emerald-500/20 to-teal-500/5',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    },
    {
      id: 'survival',
      label: 'Survival Rate',
      value: `${aggregateImpact.survivalRate}%`,
      unit: `${aggregateImpact.healthyCount} Optimal Vigor`,
      change: '+6.2% vs baseline',
      icon: HeartPulse,
      color: 'teal',
      gradient: 'from-teal-500/20 to-emerald-500/5',
      iconBg: 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
    },
    {
      id: 'co2',
      label: 'CO₂ Sequestered',
      value: aggregateImpact.totalCo2Kg >= 1000 
        ? `${(aggregateImpact.totalCo2Kg / 1000).toFixed(2)}t` 
        : `${aggregateImpact.totalCo2Kg} kg`,
      unit: `≈ ${aggregateImpact.carKmOffset.toLocaleString()} car km offset`,
      change: 'Calculated in real-time',
      icon: Wind,
      color: 'cyan',
      gradient: 'from-cyan-500/20 to-teal-500/5',
      iconBg: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
    },
    {
      id: 'guardians',
      label: 'Eco Guardians',
      value: aggregateImpact.guardiansCount,
      unit: 'Active Tree Stewards',
      change: 'Community Powered',
      icon: Users,
      color: 'amber',
      gradient: 'from-amber-500/20 to-yellow-500/5',
      iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="glass-panel glass-panel-hover p-5 sm:p-6 rounded-3xl relative overflow-hidden group"
          >
            {/* Background ambient gradient glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.gradient} rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500`} />

            <div className="relative z-10 flex items-start justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {item.label}
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                  {item.value}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.iconBg}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between pt-3 border-t border-emerald-500/10 text-xs">
              <span className="text-slate-400 font-medium truncate max-w-[150px]">
                {item.unit}
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {item.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
