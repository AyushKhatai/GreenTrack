import React from 'react';
import {
  Calendar,
  Leaf,
  FlaskConical,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SectionHeader, StatusBadge } from '../ui';

export default function TreatmentPlan({ disease, species }) {
  if (!disease) return null;

  return (
    <div className="card-elevated p-6 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-4 border-b border-line">
        <div>
          <div className="eyebrow text-fg-subtle flex items-center gap-1.5 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-status-healthy" strokeWidth={2} />
            Prescription
          </div>
          <h3 className="text-h2 text-fg">
            7-day recovery protocol
          </h3>
        </div>
        <span className="chip">{disease.name}</span>
      </div>

      {/* Timeline */}
      <section className="space-y-3">
        <SectionHeader
          eyebrow="Timeline"
          title="Day-by-day protocol"
          size="sm"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {disease.sevenDayPlan.map((step, idx) => (
            <div
              key={idx}
              className="card-inset p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="chip chip-accent">
                  {step.day}
                </span>
                <span className="eyebrow text-fg-subtle">
                  {step.status}
                </span>
              </div>
              <p className="text-body text-fg-muted leading-relaxed">
                {step.action}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Remedies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="card-inset p-4 space-y-3">
          <div className="flex items-center gap-2 text-status-healthy font-medium text-[13px]">
            <Leaf className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Organic remedy</span>
          </div>
          <p className="text-body text-fg-muted leading-relaxed">
            {disease.organicRemedy}
          </p>
          <div className="text-[11px] text-fg-subtle flex items-center gap-1.5 pt-2 border-t border-line">
            <CheckCircle2 className="w-3 h-3 text-status-healthy" strokeWidth={2} />
            Safe for pollinators & soil biome
          </div>
        </div>

        <div className="card-inset p-4 space-y-3">
          <div className="flex items-center gap-2 text-fg-muted font-medium text-[13px]">
            <FlaskConical className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Chemical fallback</span>
          </div>
          <p className="text-body text-fg-muted leading-relaxed">
            {disease.chemicalRemedy}
          </p>
          <div className="text-[11px] text-fg-subtle flex items-center gap-1.5 pt-2 border-t border-line">
            <AlertCircle className="w-3 h-3" strokeWidth={2} />
            Use only in advanced blight
          </div>
        </div>
      </div>

      {/* Prevention */}
      <div className="card-inset p-4 space-y-2">
        <h4 className="eyebrow text-fg-subtle flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-status-healthy" strokeWidth={2} />
          Long-term prevention
        </h4>
        <p className="text-body text-fg-muted leading-relaxed">
          {disease.prevention}
        </p>
      </div>
    </div>
  );
}
