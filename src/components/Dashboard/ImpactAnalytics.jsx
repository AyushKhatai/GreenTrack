import React from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Filler 
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Leaf, Car, Zap, CloudRain, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler
);

export default function ImpactAnalytics({ aggregateImpact, trees = [] }) {
  // Health Distribution Data
  const doughnutData = {
    labels: ['Optimal Vigor', 'Needs Attention', 'Critical / Blight'],
    datasets: [
      {
        data: aggregateImpact.healthDistribution || [5, 1, 1],
        backgroundColor: [
          '#10b981', // emerald-500
          '#f59e0b', // amber-500
          '#ef4444', // red-500
        ],
        borderColor: '#071912',
        borderWidth: 3,
        hoverOffset: 6
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
          padding: 14,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(7, 25, 18, 0.95)',
        titleColor: '#10b981',
        bodyColor: '#f1f5f9',
        borderColor: 'rgba(52, 211, 153, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12
      }
    },
    cutout: '72%'
  };

  // Carbon Trajectory Line Chart
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const baseCo2 = aggregateImpact.totalCo2Kg || 120;
  const lineData = {
    labels: months,
    datasets: [
      {
        fill: true,
        label: 'CO₂ Sequestered (kg)',
        data: [
          Math.round(baseCo2 * 0.35),
          Math.round(baseCo2 * 0.50),
          Math.round(baseCo2 * 0.65),
          Math.round(baseCo2 * 0.80),
          Math.round(baseCo2 * 0.92),
          Math.round(baseCo2)
        ],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        tension: 0.4,
        pointBackgroundColor: '#34d399',
        pointBorderColor: '#071912',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(7, 25, 18, 0.95)',
        titleColor: '#34d399',
        bodyColor: '#f1f5f9',
        borderColor: 'rgba(52, 211, 153, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 10, family: 'Plus Jakarta Sans' } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 10, family: 'Plus Jakarta Sans' } }
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 2-Column Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Carbon Offset Trajectory Line Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                Carbon Sequestration Trajectory
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Cumulative carbon captured as sapling root & canopy biomass matures
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Live Photosynthesis Model
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Health Distribution Doughnut */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
                Canopy Health Ratio
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              AI Diagnostic breakdown across tracked trees
            </p>
          </div>

          <div className="h-56 relative flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute flex flex-col items-center justify-center pointer-events-none mb-6">
              <span className="text-2xl font-black text-white">
                {aggregateImpact.survivalRate}%
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Survival
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-emerald-500/10 text-xs">
            <div className="bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/20">
              <div className="font-bold text-emerald-400">{aggregateImpact.healthyCount}</div>
              <div className="text-[10px] text-slate-400">Healthy</div>
            </div>
            <div className="bg-amber-950/40 p-2 rounded-xl border border-amber-500/20">
              <div className="font-bold text-amber-400">{aggregateImpact.attentionCount}</div>
              <div className="text-[10px] text-slate-400">Attention</div>
            </div>
            <div className="bg-red-950/40 p-2 rounded-xl border border-red-500/20">
              <div className="font-bold text-red-400">{aggregateImpact.criticalCount}</div>
              <div className="text-[10px] text-slate-400">Critical</div>
            </div>
          </div>
        </div>

      </div>

      {/* Environmental Equivalencies Bar */}
      <div className="glass-panel p-6 rounded-3xl">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Real-World Ecological Footprint Equivalents
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-emerald-500/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {aggregateImpact.carKmOffset.toLocaleString()} km
              </div>
              <div className="text-xs text-slate-400">Gasoline vehicle emissions cancelled</div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-teal-500/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {Math.round(aggregateImpact.totalCo2Kg / 0.008).toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">Smartphone full battery charges</div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-cyan-500/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {aggregateImpact.totalStormwaterGal.toLocaleString()} gal
              </div>
              <div className="text-xs text-slate-400">Urban stormwater runoff filtered</div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-amber-500/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {aggregateImpact.totalO2Kg} kg
              </div>
              <div className="text-xs text-slate-400">Pure clean Oxygen released</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
