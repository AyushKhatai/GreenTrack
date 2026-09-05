import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  TreePine,
  MapPin,
  Calendar,
  User,
  Droplets,
  Sparkles,
  Trash2,
  PlusCircle,
  QrCode
} from 'lucide-react';
import { calculateTreeImpact } from '../../services/carbonCalculator';
import { Modal, SectionHeader, StatTile, StatusBadge, statusVariant } from '../ui';

export default function TreeDetailModal({
  tree,
  onClose,
  onWaterTree,
  onRunAIScan,
  onDeleteTree,
  onAddCustomEvent
}) {
  const [activeTab, setActiveTab] = useState('passport');
  const [newEventNote, setNewEventNote] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);

  if (!tree) return null;

  const impact = calculateTreeImpact(tree);

  const handleAddEventSubmit = (e) => {
    e.preventDefault();
    if (!newEventNote.trim()) return;

    onAddCustomEvent(tree.id, {
      type: "Care Log",
      title: "Field care update",
      note: newEventNote.trim(),
      icon: "Droplets",
      author: tree.planter || "Guardian",
      aiVerified: false
    });

    setNewEventNote('');
    setShowAddEvent(false);
  };

  return (
    <Modal
      open={!!tree}
      onClose={onClose}
      title={tree.name}
      subtitle={tree.speciesName}
      iconSlot={<span aria-hidden="true">🌳</span>}
      size="xl"
      footer={
        <>
          <button
            onClick={() => onDeleteTree(tree.id)}
            className="btn btn-secondary"
            title="Delete record"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
            <span className="hidden sm:inline">Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onWaterTree(tree.id)}
              className="btn btn-secondary"
            >
              <Droplets className="w-3.5 h-3.5" strokeWidth={2} />
              <span>Water</span>
            </button>

            <button
              onClick={() => onRunAIScan(tree)}
              className="btn btn-primary"
            >
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
              <span>AI scan</span>
            </button>
          </div>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <span
            className="text-caption text-fg-subtle font-mono"
            style={{ fontSize: '10px', lineHeight: '14px' }}
          >
            {tree.qrCodeToken || `GT-ID-${tree.id}`}
          </span>
          <StatusBadge variant="ai" label="Digital twin" size="xs" />
        </div>

        <div className="border-b border-line flex items-center gap-1 -mx-1">
          <TabButton id="passport" label="Passport" icon={TreePine} active={activeTab} setActive={setActiveTab} />
          <TabButton id="timeline" label={`Timeline (${tree.history ? tree.history.length : 0})`} icon={Calendar} active={activeTab} setActive={setActiveTab} />
          <TabButton id="qr" label="QR tag" icon={QrCode} active={activeTab} setActive={setActiveTab} />
        </div>

        {activeTab === 'passport' && (
          <div className="space-y-5">
            <div className="card-inset p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="eyebrow text-fg-subtle mb-1.5">Current status</div>
                <StatusBadge
                  variant={statusVariant(tree.status)}
                  label={tree.status === 'Needs Attention' ? 'Attention' : tree.status}
                />
              </div>

              <div className="sm:text-right">
                <div className="eyebrow text-fg-subtle mb-1.5">Location</div>
                <div className="text-body font-medium text-fg flex items-center sm:justify-end gap-1">
                  <MapPin className="w-3.5 h-3.5 text-status-healthy" strokeWidth={2} />
                  <span>{tree.address}</span>
                </div>
                <div
                  className="text-caption text-fg-subtle font-mono nums mt-1"
                  style={{ fontSize: '10px', lineHeight: '14px' }}
                >
                  {tree.lat ? `${tree.lat.toFixed(4)}°, ${tree.lng.toFixed(4)}°` : "GPS verified"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <StatTile label="CO₂ offset" value={`${impact.cumulativeCo2Kg}`} unit="kg" />
              <StatTile label="Oxygen" value={`${impact.annualO2Kg}`} unit="kg/yr" />
              <StatTile label="Height" value={`${tree.heightMeters || 2.4}`} unit="m" sub={`Ø ${tree.canopyDiameterMeters || 1.8}m`} />
              <StatTile label="Age" value={`${impact.ageYears}`} unit="yrs" sub={`Planted ${new Date(tree.datePlanted).toLocaleDateString()}`} />
            </div>

            <div className="card-inset p-4 space-y-2">
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-medium text-fg-muted flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-status-healthy" strokeWidth={2} />
                  Dedicated guardian
                </span>
                <span className="text-fg font-medium">{tree.planter} <span className="text-fg-subtle">·</span> {tree.planterRole || 'Guardian'}</span>
              </div>
              {tree.notes && (
                <p className="text-[12px] text-fg-muted pt-2 border-t border-line leading-relaxed">
                  <strong className="text-fg font-semibold">Notes:</strong> {tree.notes}
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <SectionHeader
                eyebrow="Growth timeline"
                title="Every watering, scan, and care event"
                size="sm"
              />
              <button
                onClick={() => setShowAddEvent(!showAddEvent)}
                className="btn btn-secondary"
                style={{ height: '28px', padding: '0 10px', fontSize: '12px' }}
              >
                <PlusCircle className="w-3.5 h-3.5" strokeWidth={2} />
                <span>{showAddEvent ? "Cancel" : "Log event"}</span>
              </button>
            </div>

            {showAddEvent && (
              <form onSubmit={handleAddEventSubmit} className="card-inset p-3 space-y-2 modal-panel">
                <input
                  type="text"
                  required
                  placeholder="e.g. Watered with 10L, pruned side shoots…"
                  value={newEventNote}
                  onChange={(e) => setNewEventNote(e.target.value)}
                  className="input w-full h-9 px-3 text-[13px]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddEvent(false)}
                    className="btn btn-secondary"
                    style={{ height: '32px', padding: '0 12px', fontSize: '12px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ height: '32px', padding: '0 12px', fontSize: '12px' }}
                  >
                    Save log
                  </button>
                </div>
              </form>
            )}

            <div className="border-l-2 border-line-elev ml-3 pl-5 space-y-4 relative">
              {tree.history && [...tree.history].reverse().map((event, idx) => (
                <div key={event.id || idx} className="relative group">

                  <div className={`absolute -left-[27px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 border-page ${
                    event.aiVerified
                      ? 'bg-status-mildew text-white'
                      : 'bg-status-healthy text-fg'
                  }`}>
                    {event.aiVerified ? <Sparkles className="w-3 h-3" strokeWidth={2} /> : <Droplets className="w-3 h-3" strokeWidth={2} />}
                  </div>

                  <div className="card-inset p-3 group-hover:border-line-elev transition-colors space-y-1.5">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="font-medium text-fg flex items-center gap-1.5">
                        {event.title || event.type}
                        {event.aiVerified && (
                          <StatusBadge variant="verified" label="AI verified" size="xs" />
                        )}
                      </span>
                      <span
                        className="text-caption text-fg-subtle font-mono nums"
                        style={{ fontSize: '10px', lineHeight: '14px' }}
                      >
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[12px] text-fg-muted leading-relaxed">
                      {event.note}
                    </p>
                    {event.author && (
                      <div className="text-caption text-fg-subtle">
                        By {event.author}
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'qr' && (
          <div className="flex flex-col items-center text-center space-y-4 py-4">
            <div className="p-4 rounded-md bg-white border-4 border-status-healthy">
              <QRCodeSVG
                value={`https://greentrack.ai/tree/${tree.qrCodeToken || tree.id}`}
                size={180}
                level="H"
                includeMargin={true}
                fgColor="#022c22"
              />
            </div>

            <div>
              <div className="text-h3 text-fg">
                Physical QR tag
              </div>
              <div className="text-body font-mono text-status-healthy font-medium mt-1 nums">
                {tree.qrCodeToken || `GT-${tree.id}`}
              </div>
              <p className="text-body text-fg-muted max-w-sm mt-2 leading-relaxed">
                Print and attach this weather-proof tag to the sapling's protective cage. Anyone in the community can scan it to view this digital history.
              </p>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
}

function TabButton({ id, label, icon: Icon, active, setActive }) {
  const isActive = active === id;
  return (
    <button
      onClick={() => setActive(id)}
      className={`flex items-center gap-2 h-10 px-3 text-[12px] font-medium border-b-2 transition-colors ${
        isActive
          ? 'border-status-healthy text-fg'
          : 'border-transparent text-fg-muted hover:text-fg'
      }`}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}