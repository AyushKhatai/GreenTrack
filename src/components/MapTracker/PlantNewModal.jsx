import React, { useState, useEffect, useRef } from 'react';
import {
  Sprout,
  MapPin,
  Crosshair,
  Sparkles,
  Search,
  Map as MapIcon,
  Loader2,
  Leaf,
  Tag,
  User,
  Ruler
} from 'lucide-react';
import L from 'leaflet';
import { confettiMajor } from '../../services/confetti';
import { PLANT_DATABASE } from '../../data/plantDatabase';
import { Modal, SectionHeader, StatusBadge } from '../ui';

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

    L.tileLayer('https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: 'bg-transparent',
      html: `<div class="tree-pin tree-pin-healthy" style="width:18px; height:18px; border-width:3px;"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
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

    setTimeout(() => { map.invalidateSize(); }, 200);

    return () => {
      if (miniMapInstanceRef.current) {
        miniMapInstanceRef.current.remove();
        miniMapInstanceRef.current = null;
      }
    };
  }, [showMiniMap]);

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

  const handleLocationInputChange = (e) => {
    const val = e.target.value;
    setAddress(val);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

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

    confettiMajor();

    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Plant a new tree"
      subtitle="Mint a digital passport with GPS + QR tag"
      icon={Sprout}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* IDENTITY */}
        <section className="space-y-3">
          <SectionHeader
            eyebrow="Identity"
            title="Name your sapling"
            description="A short label so you can find it on the map and in the field."
            icon={Tag}
            size="sm"
          />
          <div>
            <label className="block eyebrow text-fg-subtle mb-1.5">
              Tree name
            </label>
            <input
              type="text"
              required
              data-autofocus
              placeholder="e.g. Green Corridor Neem #24"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full h-9 px-3 text-[13px]"
            />
          </div>
        </section>

        {/* SPECIES */}
        <section className="space-y-3">
          <SectionHeader
            eyebrow="Species"
            title="What did you plant?"
            description="Used to model CO₂ absorption and care requirements."
            icon={Leaf}
            size="sm"
          />
          <div>
            <label className="block eyebrow text-fg-subtle mb-1.5">
              Species
            </label>
            <select
              value={speciesId}
              onChange={(e) => setSpeciesId(e.target.value)}
              className="input w-full h-9 px-3 text-[13px]"
            >
              {PLANT_DATABASE.map((p) => (
                <option key={p.id} value={p.id} className="bg-surface-2 text-fg">
                  {p.name} ({p.scientificName})
                </option>
              ))}
            </select>

            <div className="mt-2 p-2.5 rounded-md border border-line bg-surface-inset text-[12px] text-fg-muted flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
                <span>CO₂: <b className="text-fg">{selectedSpecies.co2Absorption} kg/yr</b></span>
              </span>
              <StatusBadge variant="neutral" label={selectedSpecies.difficulty} size="xs" />
            </div>
          </div>
        </section>

        {/* LOCATION */}
        <section className="space-y-3">
          <SectionHeader
            eyebrow="Location"
            title="Where is it planted?"
            description="Used for the GIS pin, neighborhood analytics, and the QR tag."
            icon={MapPin}
            size="sm"
          />
          <div className="relative">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block eyebrow text-fg-subtle">
                Address or landmark
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowMiniMap(!showMiniMap)}
                  className="text-[11px] font-medium text-fg-muted hover:text-accent flex items-center gap-1 transition-colors focus-ring rounded"
                >
                  <MapIcon className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>{showMiniMap ? "Hide map" : "Pick on map"}</span>
                </button>

                <button
                  type="button"
                  onClick={getDeviceGPS}
                  disabled={isFetchingGPS}
                  className="text-[11px] font-medium text-accent hover:text-accent-hover flex items-center gap-1 transition-colors focus-ring rounded"
                >
                  <Crosshair className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>{isFetchingGPS ? "Acquiring…" : "GPS"}</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fg-subtle">
                {isSearchingLocation ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" strokeWidth={2} />
                ) : (
                  <Search className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
                )}
              </div>
              <input
                type="text"
                required
                placeholder="Search landmark, park, or street…"
                value={address}
                onChange={handleLocationInputChange}
                onFocus={() => { if (searchSuggestions.length > 0) setShowSuggestions(true); }}
                className="input w-full h-9 pl-9 pr-3 text-[13px]"
              />
            </div>

            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 surface shadow-lg p-1 z-50 modal-panel max-h-56 overflow-y-auto">
                <div className="px-2 py-1.5 eyebrow text-fg-subtle">
                  Matching locations
                </div>
                {searchSuggestions.map((place, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(place)}
                    className="w-full text-left p-2.5 rounded-md hover:bg-surface-1 transition-colors flex items-start gap-2.5 group"
                  >
                    <MapPin className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" strokeWidth={2} />
                    <div className="min-w-0">
                      <div className="font-medium text-fg text-[12px] truncate">
                        {place.display_name.split(',')[0]}
                      </div>
                      <div className="text-[10px] text-fg-subtle truncate">
                        {place.display_name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showMiniMap && (
              <div className="mt-3 rounded-md overflow-hidden border border-line relative">
                <div className="h-44 w-full" ref={miniMapRef} />
                <div className="absolute bottom-2 left-2 z-[400] bg-surface-page/85 backdrop-blur-sm px-2.5 py-1 rounded-md border border-line text-[10px] text-fg-muted font-medium">
                  Click or drag pin to position
                </div>
              </div>
            )}

            <div className="text-[10px] text-fg-subtle font-mono mt-1.5 nums">
              {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
            </div>
          </div>
        </section>

        {/* CARE */}
        <section className="space-y-3">
          <SectionHeader
            eyebrow="Care"
            title="Guardian + initial size"
            description="Used for XP, accountability, and the growth trajectory model."
            icon={User}
            size="sm"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block eyebrow text-fg-subtle mb-1.5">
                Planter
              </label>
              <input
                type="text"
                required
                placeholder="Your name"
                value={planter}
                onChange={(e) => setPlanter(e.target.value)}
                className="input w-full h-9 px-3 text-[13px]"
              />
            </div>

            <div>
              <label className="block eyebrow text-fg-subtle mb-1.5">
                Height (m)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.2"
                max="30"
                required
                value={heightMeters}
                onChange={(e) => setHeightMeters(e.target.value)}
                className="input w-full h-9 px-3 text-[13px]"
              />
            </div>
          </div>
        </section>

        <button
          type="submit"
          className="btn btn-primary w-full h-10"
        >
          <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Register tree</span>
        </button>
      </form>
    </Modal>
  );
}