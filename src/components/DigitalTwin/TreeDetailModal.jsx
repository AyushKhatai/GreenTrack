import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  TreePine, 
  MapPin, 
  Calendar, 
  User, 
  Droplets, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Scissors, 
  Download, 
  Trash2, 
  PlusCircle, 
  Wind,
  Layers,
  Leaf
} from 'lucide-react';
import { calculateTreeImpact } from '../../services/carbonCalculator';

export default function TreeDetailModal({ 
  tree, 
  onClose, 
  onWaterTree, 
  onRunAIScan, 
  onDeleteTree,
  onAddCustomEvent 
}) {
  const [activeTab, setActiveTab] = useState('passport'); // 'passport' | 'timeline' | 'qr'
  const [newEventNote, setNewEventNote] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);

  if (!tree) return null;

  const impact = calculateTreeImpact(tree);

  const handleAddEventSubmit = (e) => {
    e.preventDefault();
    if (!newEventNote.trim()) return;

    onAddCustomEvent(tree.id, {
      type: "Care Log",
      title: "Field Care Update",
      note: newEventNote.trim(),
      icon: "Droplets",
      author: tree.planter || "Guardian",
      aiVerified: false
    });

    setNewEventNote('');
    setShowAddEvent(false);
  };

  const getStatusBadge = (status) => {
    if (status === 'Healthy') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> Optimal Vigor (Healthy)
        </span>
      );
    }
    if (status === 'Needs Attention') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" /> Needs Attention
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
        <AlertOctagon className="w-4 h-4" /> Critical / Blight
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-emerald-500/30 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-enter my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 border-b border-emerald-500/20 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-3xl shrink-0 shadow-lg">
              🌳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  {tree.qrCodeToken || `GT-ID-${tree.id}`}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                  Digital Twin v2.0
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                {tree.name}
              </h2>
              <p className="text-xs text-slate-400 italic">
                {tree.speciesName}
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

        {/* Tab Navigation */}
        <div className="px-6 border-b border-emerald-500/15 bg-slate-950 flex items-center gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('passport')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'passport'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TreePine className="w-4 h-4" />
            <span>Passport & Impact</span>
          </button>
          
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'timeline'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Growth Timeline ({tree.history ? tree.history.length : 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'qr'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Physical QR Tag</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* TAB 1: PASSPORT & IMPACT */}
          {activeTab === 'passport' && (
            <div className="space-y-6">
              
              {/* Status & Location Pill */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Current Health Status
                  </div>
                  {getStatusBadge(tree.status)}
                </div>

                <div className="sm:text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Geo-Location
                  </div>
                  <div className="text-xs font-semibold text-slate-200 flex items-center sm:justify-end gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{tree.address}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {tree.lat ? `${tree.lat.toFixed(4)}°N, ${tree.lng.toFixed(4)}°E` : "GPS verified"}
                  </div>
                </div>
              </div>

              {/* Carbon & Environmental Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-emerald-500/10 text-center">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Total CO₂ Offset</div>
                  <div className="text-xl font-extrabold text-emerald-400 mt-1">
                    {impact.cumulativeCo2Kg} kg
                  </div>
                  <div className="text-[10px] text-slate-500">Sequestration</div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-2xl border border-emerald-500/10 text-center">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Oxygen Output</div>
                  <div className="text-xl font-extrabold text-teal-400 mt-1">
                    {impact.annualO2Kg} kg/yr
                  </div>
                  <div className="text-[10px] text-slate-500">Photosynthesis</div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-2xl border border-emerald-500/10 text-center">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Canopy Height</div>
                  <div className="text-xl font-extrabold text-white mt-1">
                    {tree.heightMeters || 2.4} m
                  </div>
                  <div className="text-[10px] text-slate-500">Diameter: {tree.canopyDiameterMeters || 1.8}m</div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-2xl border border-emerald-500/10 text-center">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Tree Age</div>
                  <div className="text-xl font-extrabold text-amber-400 mt-1">
                    {impact.ageYears} yrs
                  </div>
                  <div className="text-[10px] text-slate-500">Planted {new Date(tree.datePlanted).toLocaleDateString()}</div>
                </div>

              </div>

              {/* Planter Info & Field Notes */}
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-400" />
                    Dedicated Tree Guardian
                  </span>
                  <span className="text-emerald-400 font-bold">{tree.planter} ({tree.planterRole || "Guardian"})</span>
                </div>
                {tree.notes && (
                  <p className="text-xs text-slate-400 pt-2 border-t border-slate-800 leading-relaxed">
                    <strong className="text-slate-300">Field Notes:</strong> {tree.notes}
                  </p>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: GROWTH TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Chronological Care & Growth Passport
                </h4>
                <button
                  onClick={() => setShowAddEvent(!showAddEvent)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Log New Event</span>
                </button>
              </div>

              {/* Add Event Form */}
              {showAddEvent && (
                <form onSubmit={handleAddEventSubmit} className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3 animate-enter">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Watered with 10L, pruned dried side shoots, applied mulch..."
                    value={newEventNote}
                    onChange={(e) => setNewEventNote(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddEvent(false)}
                      className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                    >
                      Save Log
                    </button>
                  </div>
                </form>
              )}

              {/* Timeline Items */}
              <div className="border-l-2 border-emerald-500/30 ml-4 pl-6 space-y-6 relative">
                {tree.history && [...tree.history].reverse().map((event, idx) => (
                  <div key={event.id || idx} className="relative group">
                    
                    {/* Timeline icon node */}
                    <div className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 border-slate-950 shadow-md ${
                      event.aiVerified 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-emerald-500 text-slate-950'
                    }`}>
                      {event.aiVerified ? <Sparkles className="w-3.5 h-3.5" /> : <Droplets className="w-3.5 h-3.5" />}
                    </div>

                    {/* Timeline card */}
                    <div className="bg-slate-900/80 p-4 rounded-2xl border border-emerald-500/15 group-hover:border-emerald-500/30 transition-all space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          {event.title || event.type}
                          {event.aiVerified && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              AI Verified
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {event.note}
                      </p>
                      {event.author && (
                        <div className="text-[10px] text-slate-500">
                          Logged by: {event.author}
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: PHYSICAL QR TAG */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center text-center space-y-4">
              
              <div className="p-6 rounded-3xl bg-white border-4 border-emerald-500 shadow-2xl">
                <QRCodeSVG
                  value={`https://greentrack.ai/tree/${tree.qrCodeToken || tree.id}`}
                  size={180}
                  level="H"
                  includeMargin={true}
                  fgColor="#022c22"
                />
              </div>

              <div>
                <div className="text-base font-extrabold text-white">
                  Physical Digital Twin QR Token
                </div>
                <div className="text-xs font-mono text-emerald-400 font-bold mt-0.5">
                  Token: {tree.qrCodeToken || `GT-${tree.id}`}
                </div>
                <p className="text-xs text-slate-400 max-w-sm mt-2">
                  Print and attach this weather-proof QR tag to the sapling's protective bamboo cage. Anyone in the community can scan it to view this digital history.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Quick Actions */}
        <div className="p-5 sm:p-6 border-t border-emerald-500/15 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
          
          <button
            onClick={() => onDeleteTree(tree.id)}
            className="p-2.5 rounded-xl bg-red-950/30 text-red-400 hover:bg-red-950/60 border border-red-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Archive Tree Record"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete Record</span>
          </button>

          <div className="flex items-center gap-2">
            
            <button
              onClick={() => onWaterTree(tree.id)}
              className="px-4 py-2.5 rounded-xl bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <Droplets className="w-4 h-4 text-blue-400" />
              <span>Log Watering</span>
            </button>

            <button
              onClick={() => onRunAIScan(tree)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>Run AI Health Check</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
