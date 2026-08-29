import React from 'react';
import { 
  X, 
  Sun, 
  Droplets, 
  Wind, 
  ShieldCheck, 
  AlertCircle, 
  Leaf, 
  Sparkles, 
  Layers, 
  CheckCircle2,
  Share2
} from 'lucide-react';

export default function PlantDetailModal({ 
  plant, 
  onClose, 
  onDiagnoseThisPlant 
}) {
  if (!plant) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-emerald-500/30 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-enter my-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 border-b border-emerald-500/20 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-3xl shrink-0 shadow-lg">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  {plant.category}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                  {plant.difficulty} Care
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                {plant.name}
              </h2>
              <p className="text-xs text-slate-400 italic">
                {plant.scientificName} • Family: {plant.family}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Description */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/15">
            <p className="text-xs text-slate-200 leading-relaxed">
              {plant.description}
            </p>
          </div>

          {/* Care Requirements Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Environmental Specifications & Care Protocols
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-amber-400 flex items-center gap-1.5 uppercase">
                  <Sun className="w-3.5 h-3.5" /> Sunlight Exposure
                </div>
                <div className="text-xs font-semibold text-slate-200">{plant.sunlight}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-blue-400 flex items-center gap-1.5 uppercase">
                  <Droplets className="w-3.5 h-3.5" /> Watering Protocol
                </div>
                <div className="text-xs font-semibold text-slate-200">{plant.watering}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                  <Leaf className="w-3.5 h-3.5" /> Soil & Potting Medium
                </div>
                <div className="text-xs font-semibold text-slate-200">{plant.soil}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-teal-400 flex items-center gap-1.5 uppercase">
                  <Wind className="w-3.5 h-3.5" /> Growth & Height
                </div>
                <div className="text-xs font-semibold text-slate-200">
                  {plant.growthRate} • Mature: {plant.matureHeight}
                </div>
              </div>

            </div>
          </div>

          {/* Expert Pro Tips */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Botanical Care Tips
            </h4>
            <div className="space-y-2">
              {plant.careTips && plant.careTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pet Toxicity & Common Vulnerabilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Pet Toxicity Status</div>
              <p className="text-xs text-slate-300">{plant.petToxicity}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Propagation Methods</div>
              <p className="text-xs text-slate-300">{plant.propagation}</p>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-emerald-500/15 bg-slate-950/90 flex items-center justify-between">
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <Wind className="w-4 h-4" />
            <span>Carbon Sink: {plant.co2Absorption} kg CO₂ / yr</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onDiagnoseThisPlant(plant);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>Run Diagnostic Check on this Species</span>
          </button>
        </div>

      </div>
    </div>
  );
}
