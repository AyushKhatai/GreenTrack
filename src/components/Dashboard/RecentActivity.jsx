import React, { useState } from 'react';
import { 
  TreePine, 
  MapPin, 
  Eye, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Sparkles, 
  Droplets, 
  Search, 
  ArrowUpRight 
} from 'lucide-react';

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

  const getStatusBadge = (status) => {
    if (status === 'Healthy') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" /> Optimal Vigor
        </span>
      );
    }
    if (status === 'Needs Attention') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5" /> Needs Attention
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
        <AlertOctagon className="w-3.5 h-3.5" /> Critical / Blight
      </span>
    );
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden">
      
      {/* Header & Filter Controls */}
      <div className="p-5 sm:p-6 border-b border-emerald-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <TreePine className="w-5 h-5 text-emerald-400" />
            Active Sapling Passports
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time tree status, GPS locations, and AI diagnostic records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tree, species, planter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full pl-9 pr-3 py-2 rounded-xl text-xs"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-emerald-500/20 text-xs">
            {['all', 'Healthy', 'Needs Attention', 'Critical'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  statusFilter === s
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>

          <button
            onClick={onViewMap}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20 hover:bg-emerald-900/40 transition-all"
          >
            <span>GIS Map</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table of Trees */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-emerald-500/10">
            <tr>
              <th className="px-6 py-3.5">Tree Identity & Species</th>
              <th className="px-6 py-3.5">Geo-Location</th>
              <th className="px-6 py-3.5">Planter</th>
              <th className="px-6 py-3.5">Health Status</th>
              <th className="px-6 py-3.5">CO₂ Offset</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-500/10">
            {filteredTrees.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  <TreePine className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
                  <p className="font-semibold">No tree records matching query</p>
                  <p className="text-[11px] text-slate-500">Try adjusting your search terms or filter</p>
                </td>
              </tr>
            ) : (
              filteredTrees.map((tree) => (
                <tr 
                  key={tree.id} 
                  className="hover:bg-emerald-950/20 transition-colors group"
                >
                  {/* Tree Name & Species */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-base shrink-0">
                        {tree.planterAvatar || "🌳"}
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {tree.name}
                        </div>
                        <div className="text-[11px] text-slate-400 italic">
                          {tree.speciesName}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Location Address */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-300 max-w-[200px] truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate" title={tree.address}>{tree.address}</span>
                    </div>
                  </td>

                  {/* Planter */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-200">{tree.planter}</div>
                    <div className="text-[10px] text-emerald-400/80">{tree.planterRole || "Guardian"}</div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    {getStatusBadge(tree.status)}
                  </td>

                  {/* CO2 Offset */}
                  <td className="px-6 py-4 font-semibold text-teal-300">
                    {tree.co2OffsetKg || 12.5} kg
                  </td>

                  {/* Quick Action Buttons */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onWaterTree(tree.id)}
                        title="Log Watering"
                        className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                      >
                        <Droplets className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onRunAIScan(tree)}
                        title="Run AI Health Diagnostic"
                        className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors border border-purple-500/20"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onSelectTree(tree)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold transition-all border border-emerald-500/30 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Passport</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
