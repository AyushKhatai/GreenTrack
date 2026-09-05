import React from 'react';
import {
  Sun,
  Droplets,
  Wind,
  Leaf,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Modal, SectionHeader, StatTile, StatusBadge } from '../ui';

export default function PlantDetailModal({
  plant,
  onClose,
  onDiagnoseThisPlant
}) {
  if (!plant) return null;

  return (
    <Modal
      open={!!plant}
      onClose={onClose}
      title={plant.name}
      subtitle={`${plant.scientificName} · ${plant.family}`}
      iconSlot={<span aria-hidden="true">🌿</span>}
      size="lg"
      footer={
        <>
          <StatTile
            label="Carbon offset"
            value={`${plant.co2Absorption}`}
            unit="kg CO₂ / yr"
            tone="healthy"
            className="!bg-transparent !border-0 !p-0"
          />
          <button
            onClick={() => {
              onClose();
              onDiagnoseThisPlant(plant);
            }}
            className="btn btn-primary"
          >
            <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Run diagnostic</span>
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <StatusBadge variant="neutral" label={plant.category} size="xs" />
          <StatusBadge variant="neutral" label={plant.difficulty} size="xs" />
        </div>

        <p className="text-body text-fg-muted leading-relaxed">
          {plant.description}
        </p>

        <section className="space-y-3">
          <SectionHeader
            eyebrow="Care specifications"
            title="Light, water, soil, growth"
            size="sm"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Spec icon={Sun} label="Sunlight" value={plant.sunlight} />
            <Spec icon={Droplets} label="Watering" value={plant.watering} />
            <Spec icon={Leaf} label="Soil" value={plant.soil} />
            <Spec icon={Wind} label="Growth" value={`${plant.growthRate} · Mature ${plant.matureHeight}`} />
          </div>
        </section>

        <section className="space-y-3">
          <SectionHeader
            eyebrow="Care tips"
            title="Best practices"
            size="sm"
          />
          <div className="space-y-2">
            {plant.careTips && plant.careTips.map((tip, idx) => (
              <div key={idx} className="card-inset p-3 flex items-start gap-2.5 text-body text-fg-muted">
                <CheckCircle2 className="w-4 h-4 text-status-healthy shrink-0 mt-0.5" strokeWidth={2} />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          <InfoBlock label="Pet toxicity" value={plant.petToxicity} />
          <InfoBlock label="Propagation" value={plant.propagation} />
        </div>
      </div>
    </Modal>
  );
}

function Spec({ icon: Icon, label, value }) {
  return (
    <div className="card-inset p-3">
      <div className="eyebrow text-fg-subtle flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5" strokeWidth={2} />
        {label}
      </div>
      <div className="text-body font-medium text-fg">{value}</div>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className="card-inset p-3">
      <div className="eyebrow text-fg-subtle mb-1">
        {label}
      </div>
      <p className="text-body text-fg-muted">{value}</p>
    </div>
  );
}