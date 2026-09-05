import React, { useState } from 'react';
import {
  Search,
  Sun,
  Droplets,
  Wind,
  Eye,
  Sparkles
} from 'lucide-react';
import { PLANT_DATABASE, searchPlants } from '../../data/plantDatabase';
import { StatNumber, EmptyState } from '../ui';

export default function PlantDirectory({ onSelectPlantForDiagnosis, onOpenPlantDetail }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPlants = searchPlants(searchQuery, selectedCategory);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'outdoor-tree', label: 'Trees' },
    { id: 'indoor-plant', label: 'Indoor' },
    { id: 'indoor-outdoor', label: 'Medicinal' }
  ];

  return (
    <div className="space-y-6">

      {/* Filter bar — relies on PageHero above; no redundant header. */}
      <div className="card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <p className="text-body text-fg-muted max-w-sm leading-relaxed">
          {PLANT_DATABASE.length}+ verified species with care guides, light specs, and carbon absorption.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <div className="tabs" role="tablist" aria-label="Filter by category">
            {categories.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`tab ${selectedCategory === cat.id ? 'tab-active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-fg-subtle absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={2} aria-hidden="true" />
            <label htmlFor="species-search" className="sr-only">
              Search species
            </label>
            <input
              id="species-search"
              type="text"
              placeholder="Search species…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full h-8 pl-9 pr-3 text-[12px]"
            />
          </div>
        </div>
      </div>

      {/* Plants grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPlants.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Search}
              title="No species match"
              description="Try a different category or clear the search."
              action={
                searchQuery || selectedCategory !== 'all'
                  ? {
                      label: 'Clear filters',
                      onClick: () => { setSearchQuery(''); setSelectedCategory('all'); },
                    }
                  : undefined
              }
            />
          </div>
        ) : (
          filteredPlants.map((plant) => (
            <div
              key={plant.id}
              className="card p-5 flex flex-col justify-between group transition-colors hover:border-line-elev"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-md flex items-center justify-center text-[18px] shrink-0"
                      style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border-25)' }}
                      aria-hidden="true"
                    >
                      🌿
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-h3 text-fg truncate group-hover:text-status-healthy transition-colors">
                        {plant.name}
                      </h3>
                      <p className="text-[11px] text-fg-subtle truncate italic">
                        {plant.scientificName}
                      </p>
                    </div>
                  </div>

                  <span className="chip shrink-0">
                    {plant.badge || plant.difficulty}
                  </span>
                </div>

                <p className="text-body text-fg-muted leading-relaxed line-clamp-2">
                  {plant.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="card-inset flex items-center gap-2 px-2.5 py-2">
                    <Sun className="w-3.5 h-3.5 text-fg-muted shrink-0" strokeWidth={2} aria-hidden="true" />
                    <span className="text-fg-muted truncate">{plant.sunlight}</span>
                  </div>

                  <div className="card-inset flex items-center gap-2 px-2.5 py-2">
                    <Droplets className="w-3.5 h-3.5 text-fg-muted shrink-0" strokeWidth={2} aria-hidden="true" />
                    <span className="text-fg-muted truncate">{plant.watering}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-body py-2 border-t border-line">
                  <span className="text-fg-subtle flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-status-healthy" strokeWidth={2} aria-hidden="true" />
                    Carbon offset
                  </span>
                  <StatNumber value={plant.co2Absorption} unit="kg / yr" size="xs" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-4 mt-2 border-t border-line">
                <button
                  onClick={() => onOpenPlantDetail(plant)}
                  className="btn btn-secondary"
                  style={{ height: '32px', padding: '0 12px', fontSize: '12px', flex: 1 }}
                  aria-label={`Open ${plant.name} profile`}
                >
                  <Eye className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => onSelectPlantForDiagnosis(plant)}
                  className="btn btn-primary"
                  style={{ height: '32px', padding: '0 12px', fontSize: '12px', flex: 1 }}
                  aria-label={`Run diagnostic on ${plant.name}`}
                >
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                  <span>Scan</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
