import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Layers,
  Crosshair,
  Plus,
  Sparkles,
  Search,
  Loader2,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { StatusBadge, useToast, EmptyState } from '../ui';

export default function TreeGISMap({
  trees = [],
  onSelectTree,
  onOpenPlantModalWithCoords
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const searchPinRef = useRef(null);

  const [activeTileLayer, setActiveTileLayer] = useState('dark');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tileMenuOpen, setTileMenuOpen] = useState(false);

  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTreeId, setActiveTreeId] = useState(null);
  const searchTimeoutRef = useRef(null);

  const { toast } = useToast();

  const tileLayers = {
    dark: {
      name: 'Dark',
      url: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    },
    voyager: {
      name: 'Voyager',
      url: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    },
    satellite: {
      name: 'Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &copy; USGS, NOAA',
      subdomains: 'abc',
      maxZoom: 19
    },
    street: {
      name: 'Standard',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap',
      subdomains: 'abc',
      maxZoom: 19
    },
    light: {
      name: 'Light',
      url: 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    },
    topo: {
      name: 'Terrain',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenTopoMap',
      subdomains: 'abc',
      maxZoom: 17
    }
  };

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  if (mapboxToken && mapboxToken.trim()) {
    tileLayers.mapboxSatellite = {
      name: 'Mapbox Sat',
      url: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken.trim()}`,
      attribution: '&copy; Mapbox &copy; OpenStreetMap',
      maxZoom: 22
    };
    tileLayers.mapboxOutdoors = {
      name: 'Mapbox Nature',
      url: `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken.trim()}`,
      attribution: '&copy; Mapbox &copy; OpenStreetMap',
      maxZoom: 22
    };
  }

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [13.0827, 80.2707],
      zoom: 5,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const initialLayer = tileLayers[activeTileLayer] || tileLayers.dark;
    const tileLayer = L.tileLayer(initialLayer.url, {
      attribution: initialLayer.attribution,
      subdomains: initialLayer.subdomains || 'abc',
      maxZoom: initialLayer.maxZoom || 19
    }).addTo(map);

    tileLayerInstanceRef.current = tileLayer;

    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      const popup = L.popup()
        .setLatLng([lat, lng])
        .setContent(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 8px; min-width: 180px;">
            <div style="font-size: 10px; color: #6b6b6b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px;">Coordinates</div>
            <div style="font-size: 12px; color: #fafafa; font-weight: 500; margin-bottom: 8px;">${lat.toFixed(4)}°, ${lng.toFixed(4)}°</div>
            <button id="plant-here-btn" title="Plant a sapling at these coordinates" aria-label="Plant sapling at these coordinates" style="background: #22c55e; color: #052e16; border: none; font-weight: 600; font-size: 12px; padding: 8px 12px; border-radius: 6px; cursor: pointer; width: 100%;">
              Plant sapling here
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

    setTimeout(() => { mapInstanceRef.current?.invalidateSize(); }, 200);
    setTimeout(() => { mapInstanceRef.current?.invalidateSize(); }, 600);

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerInstanceRef.current) {
      map.removeLayer(tileLayerInstanceRef.current);
    }

    const currentLayer = tileLayers[activeTileLayer] || tileLayers.dark;
    const newTileLayer = L.tileLayer(currentLayer.url, {
      attribution: currentLayer.attribution,
      subdomains: currentLayer.subdomains || 'abc',
      maxZoom: currentLayer.maxZoom || 19
    }).addTo(map);

    tileLayerInstanceRef.current = newTileLayer;
  }, [activeTileLayer]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

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

      let pinClass = "tree-pin-healthy";
      let glyph = "";
      let statusLabel = tree.status;

      if (tree.status === "Needs Attention") {
        pinClass = "tree-pin-attention";
        glyph = "!";
      } else if (tree.status === "Critical") {
        pinClass = "tree-pin-critical";
        glyph = "×";
      }

      const isActive = activeTreeId === tree.id;
      const wrapperClass = `tree-pin-wrap${isActive ? ' tree-pin-wrap--active' : ''}`;

      const customIcon = L.divIcon({
        className: 'bg-transparent',
        html: `<div class="${wrapperClass}"><div class="tree-pin ${pinClass}${isActive ? ' tree-pin--active' : ''}"><span class="tree-pin-glyph">${glyph}</span></div></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8]
      });

      const marker = L.marker([tree.lat, tree.lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 220px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 600; text-transform: uppercase; color: ${
              tree.status === 'Healthy' ? '#22c55e' : tree.status === 'Needs Attention' ? '#eab308' : '#ef4444'
            }; letter-spacing: 0.04em;">${statusLabel}</span>
            <span style="font-size: 10px; color: #6b6b6b;">${tree.healthScore || 90}%</span>
          </div>
          <div style="font-size: 14px; font-weight: 600; color: #fafafa; margin-bottom: 2px;">${tree.name}</div>
          <div style="font-size: 11px; color: #6b6b6b; margin-bottom: 6px; font-style: italic;">${tree.speciesName || "Native Tree"}</div>
          <div style="font-size: 11px; color: #a1a1a1; margin-bottom: 8px;">📍 ${tree.address}</div>
          <div style="display: flex; gap: 4px; font-size: 10px; color: #a1a1a1; margin-bottom: 10px; background: #161616; padding: 6px 8px; border-radius: 6px; border: 1px solid #262626;">
            <span>${tree.planter}</span>
            <span style="color: #6b6b6b;">·</span>
            <span>${tree.co2OffsetKg || 12} kg CO₂</span>
          </div>
          <button id="view-tree-btn-${tree.id}" title="Open ${tree.name} passport" aria-label="Open ${tree.name} passport" style="width: 100%; background: #22c55e; color: #052e16; border: none; font-weight: 600; font-size: 12px; padding: 8px; border-radius: 6px; cursor: pointer;">
            Open passport
          </button>
        </div>
      `);

      marker.on('popupopen', () => {
        setActiveTreeId(tree.id);
        const btn = document.getElementById(`view-tree-btn-${tree.id}`);
        if (btn) {
          btn.onclick = () => onSelectTree(tree);
        }
      });
      marker.on('popupclose', () => {
        setActiveTreeId(prev => (prev === tree.id ? null : prev));
      });

      markersRef.current.push(marker);
      bounds.push([tree.lat, tree.lng]);
    });

    if (bounds.length > 0 && mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
    }
  }, [trees, selectedStatusFilter, searchQuery, activeTreeId]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!val || val.trim().length < 2) {
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

  const handleSelectPlace = (place) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    setSearchQuery(place.display_name.split(',')[0]);
    setShowSuggestions(false);
    setSearchSuggestions([]);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1.5 });

      if (searchPinRef.current) {
        mapInstanceRef.current.removeLayer(searchPinRef.current);
      }

      const searchPinIcon = L.divIcon({
        className: 'bg-transparent',
        html: `<div class="tree-pin tree-pin-healthy" style="width:18px; height:18px; border-width:3px;"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      const pin = L.marker([lat, lng], { icon: searchPinIcon }).addTo(mapInstanceRef.current);
      pin.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 6px; min-width: 180px;">
          <div style="font-size: 11px; color: #fafafa; font-weight: 600; margin-bottom: 4px;">${place.display_name.split(',')[0]}</div>
          <div style="font-size: 10px; color: #6b6b6b; margin-bottom: 8px;">${lat.toFixed(4)}°, ${lng.toFixed(4)}°</div>
          <button id="search-plant-btn" title="Plant sapling here" aria-label="Plant sapling here" style="background: #22c55e; color: #052e16; border: none; font-weight: 600; font-size: 12px; padding: 7px 12px; border-radius: 6px; cursor: pointer; width: 100%;">
            Plant sapling here
          </button>
        </div>
      `).openPopup();

      setTimeout(() => {
        const btn = document.getElementById('search-plant-btn');
        if (btn) {
          btn.onclick = () => {
            pin.closePopup();
            onOpenPlantModalWithCoords(lat, lng);
          };
        }
      }, 100);

      searchPinRef.current = pin;
    }
  };

  const locateUser = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          mapInstanceRef.current.flyTo([pos.coords.latitude, pos.coords.longitude], 14, { duration: 1.5 });
        },
        (err) => toast('Could not retrieve GPS location.', { variant: 'error', title: 'Location unavailable' })
      );
    }
  };

  return (
    <div className="card-elevated overflow-hidden space-y-0">

      <div className="p-5 border-b border-line flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-status-healthy" strokeWidth={2} />
            <span className="eyebrow text-fg-subtle">GIS tree tracker</span>
            <StatusBadge variant="neutral" label="Free tiles" size="xs" icon={Sparkles} />
          </div>
          <h2 className="text-h2 text-fg">Sapling registry on the map</h2>
          <p className="text-body text-fg-muted mt-1.5">
            Search any place or click the map to plant a sapling
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6b6b6b] absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={2} aria-hidden="true" />
            <label htmlFor="map-search" className="sr-only">
              Search a location
            </label>
            <input
              id="map-search"
              type="text"
              placeholder="Search location…"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
              className="input h-8 pl-9 pr-8 text-[12px] w-48 sm:w-64"
              aria-label="Search a location"
            />
            {isSearchingLocation && (
              <Loader2 className="w-3.5 h-3.5 text-emerald-500 animate-spin absolute right-3 top-1/2 -translate-y-1/2" strokeWidth={2} />
            )}

            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 surface shadow-lg p-1 z-[1000] animate-enter max-h-60 overflow-y-auto">
                <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-[#6b6b6b] flex items-center gap-1 font-medium">
                  <Navigation className="w-3 h-3" strokeWidth={2} /> Locations
                </div>
                {searchSuggestions.map((place, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPlace(place)}
                    className="w-full text-left px-2.5 py-2 rounded-md hover:bg-[#161616] transition-colors flex items-start gap-2 text-[#a1a1a1]"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" strokeWidth={2} />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-white truncate text-[12px]">
                        {place.display_name.split(',')[0]}
                      </div>
                      <div className="text-[10px] text-[#6b6b6b] truncate">
                        {place.display_name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="tabs" role="tablist" aria-label="Filter by tree status">
            {['all', 'Healthy', 'Attention', 'Critical'].map((s) => (
              <button
                key={s}
                role="tab"
                aria-selected={selectedStatusFilter === s}
                onClick={() => setSelectedStatusFilter(s)}
                className={`tab ${selectedStatusFilter === s ? 'tab-active' : ''}`}
              >
                {s === 'all' ? 'All' : s === 'Needs Attention' ? 'Attn' : s}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              onClick={() => setTileMenuOpen(!tileMenuOpen)}
              aria-expanded={tileMenuOpen}
              aria-haspopup="menu"
              className="btn btn-secondary h-8 text-[12px] focus-ring"
              title="Map theme"
            >
              <Layers className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
              <span>{tileLayers[activeTileLayer]?.name}</span>
            </button>

            {tileMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 surface shadow-lg p-1 z-[1000] animate-enter" role="menu">
                <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-[#6b6b6b] font-medium">
                  Themes
                </div>
                {Object.entries(tileLayers).map(([key, config]) => (
                  <button
                    key={key}
                    role="menuitemradio"
                    aria-checked={activeTileLayer === key}
                    onClick={() => { setActiveTileLayer(key); setTileMenuOpen(false); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors flex items-center justify-between focus-ring ${
                      activeTileLayer === key
                        ? 'bg-emerald-500 text-[#052e16]'
                        : 'text-[#a1a1a1] hover:bg-[#161616]'
                    }`}
                  >
                    <span>{config.name}</span>
                    {activeTileLayer === key && <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={locateUser}
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-[#a1a1a1] hover:text-white hover:bg-[#161616] border border-[#262626] focus-ring"
            title="Locate me"
            aria-label="Locate me on the map"
          >
            <Crosshair className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative w-full h-[560px] sm:h-[640px] bg-[#0a0a0a]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Empty state overlay when there are no trees yet */}
        {trees.length === 0 && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center bg-[#0a0a0a]/85 backdrop-blur-sm pointer-events-none">
            <div className="pointer-events-auto max-w-sm w-full px-5">
              <EmptyState
                icon={Plus}
                title="No saplings on the map yet"
                description="Plant your first sapling to drop a pin on the map and start tracking its growth."
              />
            </div>
          </div>
        )}

        {/* Tip */}
        <div className="absolute top-4 left-4 z-[400] bg-[#0a0a0a]/80 backdrop-blur-sm px-3 py-1.5 rounded-md border border-[#262626] text-[11px] text-[#a1a1a1] font-medium flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} aria-hidden="true" />
          <span>Click anywhere to plant a sapling</span>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[400] bg-[#0a0a0a]/85 backdrop-blur-sm px-3.5 py-2.5 rounded-md border border-[#262626] text-[11px] space-y-1.5 hidden sm:block">
          <div className="text-[10px] uppercase tracking-wider text-[#6b6b6b] font-medium">
            Status
          </div>
          <div className="flex items-center gap-2 text-[#a1a1a1]">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
            <span>Healthy</span>
          </div>
          <div className="flex items-center gap-2 text-[#a1a1a1]">
            <span className="w-2 h-2 rounded-full bg-[#eab308]" />
            <span>Attention</span>
          </div>
          <div className="flex items-center gap-2 text-[#a1a1a1]">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span>Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
}