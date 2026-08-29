import React from 'react';
import { 
  Calendar, 
  Leaf, 
  FlaskConical, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Droplets,
  Sun,
  Wind
} from 'lucide-react';

export default function TreatmentPlan({ disease, species }) {
  if (!disease) return null;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-emerald-500/15">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1">
            <Calendar className="w-4 h-4" /> Customized Prescription
          </div>
          <h3 className="text-xl font-extrabold text-white">
            7-Day Recovery & Care Protocol
          </h3>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-300">
          Target: {disease.name}
        </span>
      </div>

      {/* 7-Day Timeline Milestones */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Timeline Milestones
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {disease.sevenDayPlan.map((step, idx) => (
            <div 
              key={idx}
              className="bg-slate-900/70 p-4 rounded-2xl border border-emerald-500/15 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                  {step.day}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  {step.status}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {step.action}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column: Organic Remedies vs Chemical Remedies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Organic Solution */}
        <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/25 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Leaf className="w-4 h-4" />
            <span>Organic & Eco-Friendly Remedy</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {disease.organicRemedy}
          </p>
          <div className="text-[11px] text-emerald-400/80 flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Safe for household pets, pollinators & soil biome
          </div>
        </div>

        {/* Chemical Solution */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
            <FlaskConical className="w-4 h-4" />
            <span>Systemic / Targeted Chemical Fallback</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {disease.chemicalRemedy}
          </p>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Use only as secondary option in advanced blight
          </div>
        </div>

      </div>

      {/* Prevention & Long-term Environmental Setup */}
      <div className="p-5 rounded-2xl bg-slate-900/50 border border-emerald-500/10 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Long-Term Prophylaxis & Environmental Guidelines
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {disease.prevention}
        </p>
      </div>

    </div>
  );
}
