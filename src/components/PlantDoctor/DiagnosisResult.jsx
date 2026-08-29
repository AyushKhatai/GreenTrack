import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Sparkles, 
  Eye, 
  Flame, 
  Layers, 
  CheckCircle2, 
  MessageSquareText, 
  Save, 
  Activity,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function DiagnosisResult({ 
  result, 
  onSaveToTree, 
  onAskBotanist, 
  onViewEncyclopedia,
  selectedTreeForLog 
}) {
  const [showHeatmap, setShowHeatmap] = useState(false);

  if (!result) return null;

  const { species, disease, healthScore, confidence, ratios, heatmapUrl, lesionCount } = result;

  const getScoreColor = (score) => {
    if (score >= 85) return 'from-emerald-500 to-teal-400 text-emerald-400';
    if (score >= 60) return 'from-amber-500 to-yellow-400 text-amber-400';
    return 'from-red-500 to-rose-400 text-red-400';
  };

  const getSeverityBadge = (severity) => {
    if (severity === "None") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> Healthy Vigor (No Action Required)
        </span>
      );
    }
    if (severity === "Moderate") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" /> Moderate Risk (Intervention Advised)
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-300 border border-red-500/30 flex items-center gap-1.5">
        <AlertOctagon className="w-4 h-4" /> Critical Blight (Immediate Action Required)
      </span>
    );
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl animate-enter space-y-6">
      
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-emerald-500/15">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI Diagnostic Complete
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-400">
              Confidence: {confidence}%
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {species.name}
          </h2>
          <p className="text-sm text-slate-300 italic">
            {species.scientificName} • {species.family}
          </p>
        </div>

        {/* Health Score Circular / Pill Meter */}
        <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-emerald-500/20">
          <div className="text-right">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Health Score</div>
            <div className={`text-3xl font-black bg-gradient-to-r ${getScoreColor(healthScore)} bg-clip-text text-transparent`}>
              {healthScore} <span className="text-sm font-bold text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-2xl font-bold">
            {healthScore >= 85 ? "🌿" : healthScore >= 60 ? "⚠️" : "🚨"}
          </div>
        </div>
      </div>

      {/* Disease Diagnosis Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-emerald-500/20 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Detected Condition
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {disease.name}
            </h3>
          </div>
          {getSeverityBadge(disease.severity)}
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-emerald-400 font-semibold">Primary Pathology:</strong> {disease.causes}
        </p>
      </div>

      {/* Pixel Lesion Chromatic Signature Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            Leaf Pigment & Lesion Density Analysis
          </span>
          <span className="text-slate-400 text-[11px]">
            {lesionCount > 0 ? `${lesionCount} lesion clusters detected` : "Clean blade morphology"}
          </span>
        </div>

        {/* Segmented Progress Bar */}
        <div className="h-3 rounded-full bg-slate-900 overflow-hidden flex p-0.5 border border-slate-800">
          <div 
            style={{ width: `${ratios.healthyGreen}%` }} 
            className="bg-emerald-500 h-full rounded-l-full transition-all duration-700" 
            title={`Healthy Chlorophyll: ${ratios.healthyGreen}%`} 
          />
          <div 
            style={{ width: `${ratios.chlorosisYellow}%` }} 
            className="bg-amber-400 h-full transition-all duration-700" 
            title={`Chlorosis Yellow: ${ratios.chlorosisYellow}%`} 
          />
          <div 
            style={{ width: `${ratios.necrosisBrown}%` }} 
            className="bg-red-500 h-full transition-all duration-700" 
            title={`Necrosis / Black Spots: ${ratios.necrosisBrown}%`} 
          />
          <div 
            style={{ width: `${ratios.powderyWhite}%` }} 
            className="bg-purple-400 h-full rounded-r-full transition-all duration-700" 
            title={`Mildew Spores: ${ratios.powderyWhite}%`} 
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Chlorophyll: <strong>{ratios.healthyGreen}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Chlorosis: <strong>{ratios.chlorosisYellow}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Necrosis: <strong>{ratios.necrosisBrown}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <span>Mildew: <strong>{ratios.powderyWhite}%</strong></span>
          </div>
        </div>
      </div>

      {/* Heatmap Overlay Preview toggle (if available) */}
      {heatmapUrl && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">Diagnostic Lesion Heatmap Overlay</div>
              <div className="text-[11px] text-slate-400">View pixel-targeted lesion cluster highlights</div>
            </div>
          </div>
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showHeatmap ? "Hide Overlay" : "Inspect Heatmap"}</span>
          </button>
        </div>
      )}

      {showHeatmap && heatmapUrl && (
        <div className="rounded-2xl overflow-hidden border border-purple-500/30 bg-black flex justify-center p-2 animate-enter">
          <img src={heatmapUrl} alt="AI Heatmap diagnostic overlay" className="max-h-72 object-contain rounded-xl" />
        </div>
      )}

      {/* Action CTA Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-emerald-500/15">
        <div className="flex flex-wrap gap-2">
          
          <button
            onClick={() => onAskBotanist(result)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-emerald-400 hover:bg-emerald-950/60 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 transition-all"
          >
            <MessageSquareText className="w-4 h-4" />
            <span>Consult Dr. Flora (AI Botanist)</span>
          </button>

          <button
            onClick={() => onViewEncyclopedia(species.id)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>Species Care Profile</span>
          </button>

        </div>

        {/* Save to Tree Passport */}
        <button
          onClick={() => onSaveToTree(result)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          <span>{selectedTreeForLog ? `Log to ${selectedTreeForLog.name}` : "Save to Tree Passport"}</span>
        </button>
      </div>

    </div>
  );
}
