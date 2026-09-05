import React, { useState } from 'react';
import {
  Sparkles,
  Eye,
  Layers,
  MessageSquareText,
  Save,
  Activity,
  BookOpen,
  Stethoscope
} from 'lucide-react';
import { SectionHeader, StatNumber, StatusBadge, statusVariant } from '../ui';

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

  const scoreMeta = (() => {
    if (healthScore >= 85) return { variant: 'healthy',   label: 'Healthy' };
    if (healthScore >= 60) return { variant: 'attention', label: 'Caution' };
    return { variant: 'critical', label: 'Critical' };
  })();

  return (
    <div className="card-elevated p-6 animate-enter space-y-6">

      {/* Top header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-line">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope className="w-3.5 h-3.5 text-status-healthy" strokeWidth={2} />
            <span className="eyebrow text-fg-subtle">Diagnostic complete</span>
            <StatusBadge variant="neutral" label={`${confidence}% confidence`} size="xs" />
          </div>
          <h2 className="text-h1 text-fg">
            {species.name}
          </h2>
          <p className="text-body text-fg-muted italic mt-1">
            {species.scientificName} · {species.family}
          </p>
        </div>

        <div className="card-inset flex items-center gap-4 px-4 py-3">
          <div>
            <div className="eyebrow text-fg-subtle">Health score</div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <StatNumber value={healthScore} size="lg" tone={scoreMeta.variant} />
              <span className="text-fg-subtle text-body">/ 100</span>
            </div>
          </div>
          <div className="w-px h-8 bg-line-elev" />
          <div>
            <div className="eyebrow text-fg-subtle">Status</div>
            <div className="mt-1">
              <StatusBadge variant={scoreMeta.variant} label={scoreMeta.label} />
            </div>
          </div>
        </div>
      </div>

      {/* Disease banner */}
      <div className="card-inset p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="eyebrow text-fg-subtle">Detected condition</div>
            <h3 className="text-h3 text-fg mt-1.5">
              {disease.name}
            </h3>
          </div>
          <StatusBadge
            variant={statusVariant(disease.severity)}
            label={disease.severity}
          />
        </div>
        <p className="text-body text-fg-muted leading-relaxed">
          <strong className="text-fg font-semibold">Primary pathology:</strong> {disease.causes}
        </p>
      </div>

      {/* Pigment analysis */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-body">
          <span className="font-medium text-fg flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-status-healthy" strokeWidth={2} />
            Leaf pigment & lesion density
          </span>
          <span className="text-fg-subtle text-[11px]">
            {lesionCount > 0 ? `${lesionCount} lesion clusters detected` : "Clean blade morphology"}
          </span>
        </div>

        <div className="h-2 rounded-full bg-surface-1 overflow-hidden flex border border-line-elev">
          <div
            style={{ width: `${ratios.healthyGreen}%`, background: '#22c55e' }}
            className="h-full transition-all duration-500"
            title={`Chlorophyll: ${ratios.healthyGreen}%`}
          />
          <div
            style={{ width: `${ratios.chlorosisYellow}%`, background: '#eab308' }}
            className="h-full transition-all duration-500"
            title={`Chlorosis: ${ratios.chlorosisYellow}%`}
          />
          <div
            style={{ width: `${ratios.necrosisBrown}%`, background: '#ef4444' }}
            className="h-full transition-all duration-500"
            title={`Necrosis: ${ratios.necrosisBrown}%`}
          />
          <div
            style={{ width: `${ratios.powderyWhite}%`, background: '#a855f7' }}
            className="h-full transition-all duration-500"
            title={`Mildew: ${ratios.powderyWhite}%`}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
          <Legend color="#22c55e" label="Chlorophyll" value={ratios.healthyGreen} />
          <Legend color="#eab308" label="Chlorosis" value={ratios.chlorosisYellow} />
          <Legend color="#ef4444" label="Necrosis" value={ratios.necrosisBrown} />
          <Legend color="#a855f7" label="Mildew" value={ratios.powderyWhite} />
        </div>
      </div>

      {/* Heatmap toggle */}
      {heatmapUrl && (
        <div className="card-inset p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-fg-muted" strokeWidth={2} />
            <div>
              <div className="font-medium text-fg text-[13px]">Lesion heatmap overlay</div>
              <div className="text-[11px] text-fg-subtle">Pixel-targeted lesion clusters</div>
            </div>
          </div>
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="btn btn-secondary"
            style={{ height: '28px', padding: '0 10px', fontSize: '12px' }}
          >
            <Eye className="w-3.5 h-3.5" strokeWidth={2} />
            <span>{showHeatmap ? "Hide" : "Inspect"}</span>
          </button>
        </div>
      )}

      {showHeatmap && heatmapUrl && (
        <div className="rounded-md overflow-hidden border border-line-elev bg-black flex justify-center p-2 animate-enter">
          <img src={heatmapUrl} alt="AI Heatmap" className="max-h-72 object-contain rounded" />
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-line">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onAskBotanist(result)}
            className="btn btn-secondary"
          >
            <MessageSquareText className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Ask Dr. Flora</span>
          </button>

          <button
            onClick={() => onViewEncyclopedia(species.id)}
            className="btn btn-secondary"
          >
            <BookOpen className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Care profile</span>
          </button>
        </div>

        <button
          onClick={() => onSaveToTree(result)}
          className="btn btn-primary"
        >
          <Save className="w-3.5 h-3.5" strokeWidth={2} />
          <span>{selectedTreeForLog ? `Log to ${selectedTreeForLog.name}` : "Save to passport"}</span>
        </button>
      </div>
    </div>
  );
}

function Legend({ color, label, value }) {
  return (
    <div className="flex items-center gap-1.5 text-fg-muted">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="truncate">{label}: <strong className="text-fg nums">{value}%</strong></span>
    </div>
  );
}