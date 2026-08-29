import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Layers, 
  Crosshair, 
  Plus, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Search,
  Trees
} from 'lucide-react';

export default function TreeGISMap({ 
  trees = [], 
  onSelectTree, 
  onOpenPlantModalWithCoords 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [activeTileLayer, setActiveTileLayer] = useState('voyager');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tileMenuOpen, setTileMenuOpen] = useState(false);

  const tileLayers = {
    voyager: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [13.0827, 80.2707], // Default center (Chennai / India corridor)
      zoom: 5,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer(tileLayers[activeTileLayer] || tileLayers.voyager, {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19
    }).addTo(map);

    // Handle map click to drop planting pin
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      const popup = L.popup()
        .setLatLng([lat, lng])
        .setContent(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; text-align: center;">
            <div style="font-size: 11px; color: #10b981; font-weight: 700; margin-bottom: 2px;">📍 GPS COORDINATES</div>
            <div style="font-size: 12px; color: #cbd5e1; font-weight: 600; margin-bottom: 8px;">${lat.toFixed(4)}, ${lng.toFixed(4)}</div>
            <button id="plant-here-btn" style="background: #10b981; color: #020b08; border: none; font-weight: 800; font-size: 11px; padding: 6px 12px; border-radius: 8px; cursor: pointer;">
              🌱 Plant Sapling Here
            </button>
          </div>
        `)
        .openOn(map);

      setTimeout(() => {
        const btn = document.getElementById('plant-here-btn');
        if (btn) {
          btn.onclick = () => {
            map.closePopup();
            onOpenPlantModalWithCoords(lat, lng);
          };
        }
      }, 100);
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    
    // Clear old tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    L.tileLayer(tileLayers[activeTileLayer], {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19
    }).addTo(map);
  }, [activeTileLayer]);

  // Update Markers based on trees and filters
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    const filtered = trees.filter(tree => {
      const matchStatus = selectedStatusFilter === 'all' || tree.status === selectedStatusFilter;
      const matchQuery = !searchQuery || 
        tree.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tree.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tree.planter.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchQuery;
    });

    const bounds = [];

    filtered.forEach(tree => {
      if (!tree.lat || !tree.lng) return;

      let pinClass = "pin-healthy";
      let iconHtml = '<i class="fa-solid fa-tree"></i>';

      if (tree.status === "Needs Attention") {
        pinClass = "pin-attention";
        iconHtml = '<i class="fa-solid fa-triangle-exclamation"></i>';
      } else if (tree.status === "Critical") {
        pinClass = "pin-critical";
        iconHtml = '<i class="fa-solid fa-skull"></i>';
      }

      const customIcon = L.divIcon({
        className: 'bg-transparent',
        html: `<div class="custom-tree-pin ${pinClass}">${iconHtml}</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      });

      const marker = L.marker([tree.lat, tree.lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 220px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${
              tree.status === 'Healthy' ? '#10b981' : tree.status === 'Needs Attention' ? '#f59e0b' : '#ef4444'
            };">${tree.status}</span>
            <span style="font-size: 10px; color: #94a3b8;">${tree.healthScore || 90}% Score</span>
          </div>
          <div style="font-size: 14px; font-weight: 800; color: #ffffff; margin-bottom: 2px;">${tree.name}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px; font-style: italic;">${tree.speciesName || "Native Tree"}</div>
          <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 8px;">📍 ${tree.address}</div>
          <div style="display: flex; gap: 4px; font-size: 10px; color: #6ee7b7; margin-bottom: 10px; background: rgba(16,185,129,0.1); padding: 4px 8px; border-radius: 6px;">
            <span>🌳 Planter: <b>${tree.planter}</b></span>
            <span>•</span>
            <span>CO₂: <b>${tree.co2OffsetKg || 12}kg</b></span>
          </div>
          <button id="view-tree-btn-${tree.id}" style="width: 100%; background: #10b981; color: #020b08; border: none; font-weight: 800; font-size: 11px; padding: 7px; border-radius: 8px; cursor: pointer;">
            🌿 Open Digital Twin Passport
          </button>
        </div>
      `);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-tree-btn-${tree.id}`);
        if (btn) {
          btn.onclick = () => onSelectTree(tree);
        }
      });

      markersRef.current.push(marker);
      bounds.push([tree.lat, tree.lng]);
    });

    // Fit map bounds if there are markers
    if (bounds.length > 0 && mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
    }
  }, [trees, selectedStatusFilter, searchQuery]);

  const locateUser = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          mapInstanceRef.current.flyTo([pos.coords.latitude, pos.coords.longitude], 14, {
            duration: 1.5
          });
        },
        (err) => alert("Could not retrieve GPS location.")
      );
    }
  };

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-3xl space-y-4">
      
      {/* Top Map Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            GIS Interactive Tree Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click anywhere on the map to pin-drop and register a new tree in the field
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Location */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search map location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input pl-8 pr-3 py-1.5 rounded-xl text-xs w-44 sm:w-56"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-emerald-500/20 text-xs">
            {['all', 'Healthy', 'Needs Attention', 'Critical'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedStatusFilter === s
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>

          {/* Tile Layer Selector */}
          <div className="relative">
            <button
              onClick={() => setTileMenuOpen(!tileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900/90 text-slate-300 border border-emerald-500/20 hover:text-emerald-300 transition-all flex items-center gap-1 text-xs font-semibold"
              title="Change Map Tiles"
            >
              <Layers className="w-4 h-4" />
            </button>

            {tileMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-emerald-500/30 shadow-2xl p-2 z-50 animate-enter text-xs space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold text-emerald-400 uppercase">Map Themes</div>
                {['dark', 'voyager', 'light', 'osm'].map((t) => (
                  <button
                    key={t}
                    onClick={() => { setActiveTileLayer(t); setTileMenuOpen(false); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg capitalize font-medium ${
                      activeTileLayer === t ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* GPS Locate Me Button */}
          <button
            onClick={locateUser}
            className="p-2 rounded-xl bg-slate-900/90 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-950/40 hover:border-emerald-400 transition-all"
            title="Locate Current Position"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map View Canvas */}
      <div className="relative w-full h-[540px] sm:h-[620px] rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Legend */}
        <div className="absolute bottom-4 left-4 z-[400] bg-slate-950/85 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-emerald-500/30 text-xs space-y-1.5 shadow-xl hidden sm:block">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Canopy Status</div>
          <div className="flex items-center gap-2 text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span>Optimal Vigor (Healthy)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
            <span>Needs Attention</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <span>Critical / Disease</span>
          </div>
        </div>

        {/* Pin Drop Tip */}
        <div className="absolute top-4 left-4 z-[400] bg-emerald-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30 text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5 shadow-lg">
          <Plus className="w-3.5 h-3.5" />
          <span>Click anywhere to plant a new sapling</span>
        </div>
      </div>

    </div>
  );
}
