import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sprout, 
  MapPin, 
  Crosshair, 
  CheckCircle2, 
  Sparkles, 
  User, 
  Ruler,
  Leaf,
  Search,
  Map as MapIcon,
  Loader2
} from 'lucide-react';
import L from 'leaflet';
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

  // Search & Map Picker State
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(false);

  const miniMapRef = useRef(null);
  const miniMapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (initialCoords) {
      setLat(initialCoords.lat);
      setLng(initialCoords.lng);
      reverseGeocode(initialCoords.lat, initialCoords.lng);
    } else if (isOpen) {
      getDeviceGPS();
    }
  }, [initialCoords, isOpen]);

  // Initialize or update Mini Map when toggled
  useEffect(() => {
    if (!showMiniMap || !miniMapRef.current) return;

    if (miniMapInstanceRef.current) {
      miniMapInstanceRef.current.remove();
      miniMapInstanceRef.current = null;
    }

    const map = L.map(miniMapRef.current, {
      center: [lat, lng],
      zoom: 14,
      zoomControl: true
    });

    L.tileLayer('https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: 'custom-tree-pin',
      html: `<div style="background:#10b981; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #ffffff; box-shadow:0 0 12px rgba(16,185,129,0.8); font-size:14px;">🌱</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker([lat, lng], { icon: pinIcon, draggable: true }).addTo(map);
    markerRef.current = marker;

    marker.on('dragend', async (e) => {
      const newPos = e.target.getLatLng();
      setLat(newPos.lat);
      setLng(newPos.lng);
      await reverseGeocode(newPos.lat, newPos.lng);
    });

    map.on('click', async (e) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      marker.setLatLng([clickLat, clickLng]);
      setLat(clickLat);
      setLng(clickLng);
      await reverseGeocode(clickLat, clickLng);
    });

    miniMapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (miniMapInstanceRef.current) {
        miniMapInstanceRef.current.remove();
        miniMapInstanceRef.current = null;
      }
    };
  }, [showMiniMap]);

  // Update marker position when lat/lng change
  useEffect(() => {
    if (markerRef.current && miniMapInstanceRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      miniMapInstanceRef.current.setView([lat, lng], miniMapInstanceRef.current.getZoom());
    }
  }, [lat, lng]);

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await res.json();
      if (data && data.display_name) {
        const parts = [
          data.address?.road, 
          data.address?.suburb || data.address?.neighbourhood, 
          data.address?.city || data.address?.town || data.address?.county, 
          data.address?.state
        ].filter(Boolean);
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

  // Google Maps / OpenStreetMap live search query
  const handleLocationInputChange = (e) => {
    const val = e.target.value;
    setAddress(val);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (val.trim().length < 3) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearchingLocation(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&addressdetails=1&limit=5`
        );
        const results = await res.json();
        setSearchSuggestions(results || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Location search failed:", err);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 350);
  };

  const handleSelectSuggestion = (place) => {
    const newLat = parseFloat(place.lat);
    const newLng = parseFloat(place.lon);
    setLat(newLat);
    setLng(newLng);
    setAddress(place.display_name);
    setShowSuggestions(false);
    setSearchSuggestions([]);

    if (miniMapInstanceRef.current) {
      miniMapInstanceRef.current.setView([newLat, newLng], 15);
      if (markerRef.current) {
        markerRef.current.setLatLng([newLat, newLng]);
      }
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
      planter: planter.trim() || 'Ayush Khatai',
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

    // Celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#059669', '#6ee7b7', '#f59e0b']
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-emerald-500/30 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-enter my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Register New Sapling</h3>
              <p className="text-xs text-slate-400">Mint a Digital Twin with Google Maps-style location & QR tag</p>
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

          {/* Location Search with Google Maps-style Autocomplete & Mini Map */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Location & Coordinates
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowMiniMap(!showMiniMap)}
                  className={`text-[11px] font-semibold flex items-center gap-1 transition-all ${
                    showMiniMap ? 'text-teal-300 underline' : 'text-slate-400 hover:text-emerald-300'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>{showMiniMap ? "Hide Map" : "Pick on Map"}</span>
                </button>

                <button
                  type="button"
                  onClick={getDeviceGPS}
                  disabled={isFetchingGPS}
                  className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>{isFetchingGPS ? "Acquiring..." : "GPS"}</span>
                </button>
              </div>
            </div>

            {/* Search Input with Icon */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                {isSearchingLocation ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                ) : (
                  <Search className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <input
                type="text"
                required
                placeholder="Search landmark, park, college campus, or street..."
                value={address}
                onChange={handleLocationInputChange}
                onFocus={() => { if (searchSuggestions.length > 0) setShowSuggestions(true); }}
                className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-xs"
              />
            </div>

            {/* Floating Google Maps-style Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl p-2 z-50 animate-enter max-h-56 overflow-y-auto space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Matching Locations
                </div>
                {searchSuggestions.map((place, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(place)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-950/60 border border-transparent hover:border-emerald-500/30 transition-all flex items-start gap-2.5 group"
                  >
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="truncate text-xs">
                      <div className="font-bold text-white group-hover:text-emerald-300 truncate">
                        {place.display_name.split(',')[0]}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {place.display_name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Mini Map Picker View */}
            {showMiniMap && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-emerald-500/30 relative">
                <div className="h-44 w-full" ref={miniMapRef} />
                <div className="absolute bottom-2 left-2 z-[400] bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  👆 Click map or drag pin to position sapling
                </div>
              </div>
            )}

            <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center justify-between">
              <span>Coordinates: {lat.toFixed(4)}° N, {lng.toFixed(4)}° E</span>
              {showSuggestions && (
                <button
                  type="button"
                  onClick={() => setShowSuggestions(false)}
                  className="text-slate-400 hover:text-white underline text-[10px]"
                >
                  Close Suggestions
                </button>
              )}
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
