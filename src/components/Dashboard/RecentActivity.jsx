import React, { useState } from 'react';
import {
  TreePine,
  MapPin,
  Eye,
  Sparkles,
  Droplets,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { StatusBadge, statusVariant, EmptyState } from '../ui';

export default function RecentActivity({
  trees = [],
  onSelectTree,
  onRunAIScan,
  onWaterTree,
  onViewMap
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTrees = trees.filter(tree => {
    const matchesSearch = !searchTerm ||
      tree.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tree.speciesName && tree.speciesName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tree.planter && tree.planter.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tree.address && tree.address.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || tree.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const hasNoTrees = trees.length === 0;

  return (
    <div className="card overflow-hidden">
      <div className="p-5 border-b border-line flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <TreePine className="w-3.5 h-3.5 text-fg-subtle" strokeWidth={2} aria-hidden="true" />
            <span className="eyebrow text-fg-subtle">Sapling passports</span>
          </div>
          <h3 className="text-h3 text-fg">All registered trees</h3>
          <p className="text-body text-fg-muted mt-1">
            {filteredTrees.length} of {trees.length} trees · Real-time GPS + AI records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-fg-subtle absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={2} aria-hidden="true" />
            <label htmlFor="recent-search" className="sr-only">
              Search trees
            </label>
            <input
              id="recent-search"
              type="text"
              placeholder="Search trees…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full h-8 pl-9 pr-3 text-[12px]"
            />
          </div>

          <div className="tabs" role="tablist" aria-label="Filter by status">
            {['all', 'Healthy', 'Needs Attention', 'Critical'].map((s) => (
              <button
                key={s}
                role="tab"
                aria-selected={statusFilter === s}
                onClick={() => setStatusFilter(s)}
                className={`tab ${statusFilter === s ? 'tab-active' : ''}`}
              >
                {s === 'all' ? 'All' : s === 'Needs Attention' ? 'Attention' : s}
              </button>
            ))}
          </div>

          <button
            onClick={onViewMap}
            className="btn btn-secondary text-[12px] focus-ring"
            aria-label="Open the GIS map"
          >
            Map
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>

      {hasNoTrees ? (
        <div className="p-5">
          <EmptyState
            icon={TreePine}
            title="No trees registered yet"
            description="Add your first sapling to start tracking its growth, watering schedule, and carbon impact."
          />
        </div>
      ) : filteredTrees.length === 0 ? (
        <div className="p-5">
          <EmptyState
            size="sm"
            icon={Search}
            title="No trees match your filter"
            description="Try a different search term or status filter."
            action={
              searchTerm || statusFilter !== 'all'
                ? {
                    label: 'Clear filters',
                    onClick: () => { setSearchTerm(''); setStatusFilter('all'); },
                  }
                : undefined
            }
          />
        </div>
      ) : (
        <>
          {/* Mobile / tablet stacked cards (below md) */}
          <ul className="md:hidden divide-y divide-line">
            {filteredTrees.map((tree) => (
              <li key={tree.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-md bg-surface-2 border border-line-elev flex items-center justify-center text-[16px] shrink-0"
                    aria-hidden="true"
                  >
                    {tree.planterAvatar || '🌳'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-medium text-fg truncate">{tree.name}</div>
                        <div className="text-[11px] text-fg-subtle truncate italic">
                          {tree.speciesName}
                        </div>
                      </div>
                      <StatusBadge
                        variant={statusVariant(tree.status)}
                        label={tree.status === 'Needs Attention' ? 'Attention' : tree.status}
                      />
                    </div>

                    <div className="mt-2 space-y-1 text-[12px] text-fg-muted">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="w-3 h-3 text-fg-subtle shrink-0" strokeWidth={2} aria-hidden="true" />
                        <span className="truncate" title={tree.address}>{tree.address}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-fg-muted truncate">
                          {tree.planter} · <span className="text-fg-subtle">{tree.planterRole || 'Guardian'}</span>
                        </span>
                        <span className="text-fg nums shrink-0 ml-2">
                          {tree.co2OffsetKg || 12.5} kg
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5">
                      <button
                        onClick={() => onWaterTree(tree.id)}
                        title="Log watering"
                        aria-label={`Log watering for ${tree.name}`}
                        className="icon-btn icon-btn-xs"
                      >
                        <Droplets className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => onRunAIScan(tree)}
                        title="Run AI diagnostic"
                        aria-label={`Run AI diagnostic for ${tree.name}`}
                        className="icon-btn icon-btn-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => onSelectTree(tree)}
                        className="btn btn-secondary ml-auto"
                        style={{ height: '28px', padding: '0 10px', fontSize: '12px' }}
                        aria-label={`View ${tree.name} passport`}
                      >
                        <Eye className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop table (md and up) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="text-fg-subtle border-b border-line">
                <tr>
                  <th className="px-5 py-3 font-medium text-caption" scope="col">Tree</th>
                  <th className="px-5 py-3 font-medium text-caption" scope="col">Location</th>
                  <th className="px-5 py-3 font-medium text-caption" scope="col">Planter</th>
                  <th className="px-5 py-3 font-medium text-caption" scope="col">Status</th>
                  <th className="px-5 py-3 font-medium text-caption" scope="col">CO₂</th>
                  <th className="px-5 py-3 font-medium text-caption text-right" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredTrees.map((tree) => (
                  <tr
                    key={tree.id}
                    className="hover:bg-surface-1 transition-colors group"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-surface-2 border border-line-elev flex items-center justify-center text-[14px] shrink-0" aria-hidden="true">
                          {tree.planterAvatar || '🌳'}
                        </div>
                        <div>
                          <div className="font-medium text-fg group-hover:text-status-healthy transition-colors">
                            {tree.name}
                          </div>
                          <div className="text-[11px] text-fg-subtle">
                            {tree.speciesName}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 text-fg-muted max-w-[220px]">
                        <MapPin className="w-3 h-3 text-fg-subtle shrink-0" strokeWidth={2} aria-hidden="true" />
                        <span className="truncate" title={tree.address}>{tree.address}</span>
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <div className="text-fg-muted">{tree.planter}</div>
                      <div className="text-[11px] text-fg-subtle">{tree.planterRole || 'Guardian'}</div>
                    </td>

                    <td className="px-5 py-3">
                      <StatusBadge
                        variant={statusVariant(tree.status)}
                        label={tree.status === 'Needs Attention' ? 'Attention' : tree.status}
                      />
                    </td>

                    <td className="px-5 py-3 text-fg nums">
                      {tree.co2OffsetKg || 12.5} kg
                    </td>

                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onWaterTree(tree.id)}
                          title="Log watering"
                          aria-label={`Log watering for ${tree.name}`}
                          className="icon-btn icon-btn-xs"
                        >
                          <Droplets className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                        </button>

                        <button
                          onClick={() => onRunAIScan(tree)}
                          title="Run AI diagnostic"
                          aria-label={`Run AI diagnostic for ${tree.name}`}
                          className="icon-btn icon-btn-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                        </button>

                        <button
                          onClick={() => onSelectTree(tree)}
                          className="btn btn-secondary"
                          style={{ height: '28px', padding: '0 10px', fontSize: '12px' }}
                          aria-label={`View ${tree.name} passport`}
                        >
                          <Eye className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                          <span>View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}