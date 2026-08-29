import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Sun, 
  Droplets, 
  Wind, 
  ShieldCheck, 
  AlertCircle, 
  Leaf, 
  Sparkles,
  ArrowRight,
  Eye
} from 'lucide-react';
import { PLANT_DATABASE, searchPlants } from '../../data/plantDatabase';

export default function PlantDirectory({ onSelectPlantForDiagnosis, onOpenPlantDetail }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPlants = searchPlants(searchQuery, selectedCategory);

  const categories = [
    { id: 'all', label: 'All Species' },
    { id: 'outdoor-tree', label: 'Urban & Shade Trees' },
    { id: 'indoor-plant', label: 'Indoor Foliage & Air Purifiers' },
    { id: 'indoor-outdoor', label: 'Medicinal & Succulents' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Botanical Encyclopedia & Care Almanac</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Urban Forestry & Botanical Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Explore care guides, light specifications, watering intervals, and carbon absorption capacities across 15+ verified plant and tree species.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-emerald-950/40 border border-emerald-500/15'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search plant, scientific name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs"
          />
        </div>

      </div>

      {/* Plants Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlants.map((plant) => (
          <div
            key={plant.id}
            className="glass-panel glass-panel-hover p-6 rounded-3xl flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🌿
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base group-hover:text-emerald-300 transition-colors">
                      {plant.name}
                    </h3>
                    <p className="text-xs text-slate-400 italic">
                      {plant.scientificName}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400">
                  {plant.badge || plant.difficulty}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {plant.description}
              </p>

              {/* Specs Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-[11px] text-slate-300 truncate">{plant.sunlight}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                  <Droplets className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="text-[11px] text-slate-300 truncate">{plant.watering}</span>
                </div>

              </div>

              {/* Carbon Sequestration Rating */}
              <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Carbon Offset:</span>
                </span>
                <span className="font-extrabold text-emerald-400">
                  {plant.co2Absorption} kg CO₂ / yr
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 mt-4 border-t border-emerald-500/10 flex items-center justify-between gap-2">
              <button
                onClick={() => onOpenPlantDetail(plant)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-800"
              >
                <Eye className="w-3.5 h-3.5 text-teal-400" />
                <span>Full Profile</span>
              </button>

              <button
                onClick={() => onSelectPlantForDiagnosis(plant)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all border border-emerald-500/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scan Species</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
