import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sprout, 
  MapPin, 
  Crosshair, 
  CheckCircle2, 
  Sparkles, 
  User, 
  Ruler,
  Leaf
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PLANT_DATABASE } from '../../data/plantDatabase';

export default function PlantNewModal({ 
  isOpen, 
  onClose, 
  onAddTree, 
  initialCoords = null 
}) {
  const [name, setName] = useState('');
  const [speciesId, setSpeciesId] = useState(PLANT_DATABASE[0].id);
  const [planter, setPlanter] = useState('Ayush Khatai');
  const [planterRole, setPlanterRole] = useState('Tree Guardian');
  const [lat, setLat] = useState(13.0827);
  const [lng, setLng] = useState(80.2707);
  const [address, setAddress] = useState('');
  const [heightMeters, setHeightMeters] = useState(1.2);
  const [isFetchingGPS, setIsFetchingGPS] = useState(false);

  useEffect(() => {
    if (initialCoords) {
      setLat(initialCoords.lat);
      setLng(initialCoords.lng);
      reverseGeocode(initialCoords.lat, initialCoords.lng);
    } else if (isOpen) {
      getDeviceGPS();
    }
  }, [initialCoords, isOpen]);

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await res.json();
      if (data && data.display_name) {
        const parts = [data.address.road, data.address.suburb, data.address.city || data.address.town, data.address.state].filter(Boolean);
        setAddress(parts.join(', ') || data.display_name);
      } else {
        setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    } catch (e) {
      setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    }
  };

  const getDeviceGPS = () => {
    setIsFetchingGPS(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const latitude = pos.coords.latitude;
          const longitude = pos.coords.longitude;
          setLat(latitude);
          setLng(longitude);
          await reverseGeocode(latitude, longitude);
          setIsFetchingGPS(false);
        },
        () => {
          setIsFetchingGPS(false);
          setAddress("Cubbon Park, Bengaluru, Karnataka");
        }
      );
    } else {
      setIsFetchingGPS(false);
    }
  };

  if (!isOpen) return null;

  const selectedSpecies = PLANT_DATABASE.find(p => p.id === speciesId) || PLANT_DATABASE[0];

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTreeData = {
      name: name.trim() || `${selectedSpecies.name} Sapling`,
      speciesId: selectedSpecies.id,
      speciesName: `${selectedSpecies.name} (${selectedSpecies.scientificName})`,
      planter: planter.trim() || 'Eco Guardian',
      planterRole: planterRole,
      planterAvatar: "🌿",
      lat: +lat,
      lng: +lng,
      address: address || "Urban Plantation Site",
      heightMeters: +heightMeters,
      canopyDiameterMeters: +(heightMeters * 0.7).toFixed(1),
      co2OffsetKg: +(selectedSpecies.co2Absorption * 0.4).toFixed(1),
      status: "Healthy",
      healthScore: 95
    };

    onAddTree(newTreeData);

    // Trigger celebratory eco-confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#059669', '#6ee7b7', '#f59e0b']
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-emerald-500/30 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-enter my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Register New Sapling</h3>
              <p className="text-xs text-slate-400">Mint a Digital Twin with real-time GPS & QR tag</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          
          {/* Tree Name / Identifier */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Tree Identity / Custom Nickname
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Green Corridor Neem #24"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-xs"
            />
          </div>

          {/* Species Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Botanical Species
            </label>
            <select
              value={speciesId}
              onChange={(e) => setSpeciesId(e.target.value)}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-xs"
            >
              {PLANT_DATABASE.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name} ({p.scientificName}) — {p.category}
                </option>
              ))}
            </select>

            {/* Species Highlight pill */}
            <div className="mt-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                <span>Annual Carbon Sequestration: <b>{selectedSpecies.co2Absorption} kg/yr</b></span>
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-400">
                {selectedSpecies.difficulty} Care
              </span>
            </div>
          </div>

          {/* GPS Coordinates & Address */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                GPS Location & Address
              </label>
              <button
                type="button"
                onClick={getDeviceGPS}
                disabled={isFetchingGPS}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>{isFetchingGPS ? "Acquiring GPS..." : "Acquire GPS"}</span>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Location address or park name"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-xs"
              />
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">
              Coordinates: {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
            </div>
          </div>

          {/* Planter & Height Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Planter / Guardian Name
              </label>
              <input
                type="text"
                required
                placeholder="Your Name"
                value={planter}
                onChange={(e) => setPlanter(e.target.value)}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Sapling Height (Meters)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.2"
                max="30"
                required
                value={heightMeters}
                onChange={(e) => setHeightMeters(e.target.value)}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all mt-6"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>Mint Tree Digital Twin & Register</span>
          </button>

        </form>

      </div>
    </div>
  );
}
