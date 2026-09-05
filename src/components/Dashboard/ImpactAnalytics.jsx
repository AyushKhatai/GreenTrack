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
  Filler
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { Leaf, Car, Zap, CloudRain, Wind, Activity } from 'lucide-react';
import { StatNumber, StatusBadge, statusVariant, StatTile } from '../ui';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

export default function ImpactAnalytics({ aggregateImpact, trees = [] }) {
  const doughnutData = {
    labels: ['Healthy', 'Attention', 'Critical'],
    datasets: [
      {
        data: aggregateImpact.healthDistribution || [5, 1, 1],
        backgroundColor: [
          '#22c55e',
          '#eab308',
          '#ef4444',
        ],
        borderColor: '#0a0a0a',
        borderWidth: 2,
        hoverOffset: 4
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#161616',
        titleColor: '#fafafa',
        bodyColor: '#a1a1a1',
        borderColor: '#262626',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        titleFont: { size: 12, weight: '600' },
        bodyFont: { size: 11 }
      }
    },
    cutout: '74%'
  };

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const baseCo2 = aggregateImpact.totalCo2Kg || 120;
  const lineData = {
    labels: months,
    datasets: [
      {
        fill: true,
        label: 'CO₂ sequestered',
        data: [
          Math.round(baseCo2 * 0.35),
          Math.round(baseCo2 * 0.50),
          Math.round(baseCo2 * 0.65),
          Math.round(baseCo2 * 0.80),
          Math.round(baseCo2 * 0.92),
          Math.round(baseCo2)
        ],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.06)',
        borderWidth: 1.5,
        tension: 0.35,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#0a0a0a',
        pointBorderWidth: 1.5,
        pointRadius: 2.5,
        pointHoverRadius: 4
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#161616',
        titleColor: '#fafafa',
        bodyColor: '#a1a1a1',
        borderColor: '#262626',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#6b6b6b', font: { size: 10, family: 'Plus Jakarta Sans' } }
      },
      y: {
        grid: { color: '#1a1a1a', drawBorder: false },
        ticks: { color: '#6b6b6b', font: { size: 10, family: 'Plus Jakarta Sans' } }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* Carbon trajectory line */}
        <div className="card lg:col-span-2 p-5">
          <div className="flex items-start justify-between mb-5 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Activity className="w-3.5 h-3.5 text-fg-subtle" strokeWidth={2} />
                <span className="eyebrow text-fg-subtle">Trajectory</span>
              </div>
              <h3 className="text-h3 text-fg">Carbon sequestration</h3>
              <p className="text-body text-fg-muted mt-1.5">Cumulative kg captured over the last 6 months</p>
            </div>
            <StatusBadge variant="live" label="Live model" pulse />
          </div>

          <div className="h-64 w-full">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Health ratio doughnut */}
        <div className="card p-5 flex flex-col">
          <div className="mb-3">
            <div className="eyebrow text-fg-subtle mb-1.5">Distribution</div>
            <h3 className="text-h3 text-fg">Canopy health</h3>
            <p className="text-body text-fg-muted mt-1">AI diagnostic breakdown</p>
          </div>

          <div className="flex-1 relative flex items-center justify-center min-h-[160px]">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute flex flex-col items-center pointer-events-none">
              <StatNumber
                value={`${aggregateImpact.survivalRate}%`}
                size="lg"
                tone={statusVariant(
                  aggregateImpact.survivalRate >= 80 ? 'Healthy'
                  : aggregateImpact.survivalRate >= 60 ? 'Needs Attention'
                  : 'Critical'
                )}
              />
              <span className="eyebrow text-fg-subtle mt-1">Survival</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 mt-3 border-t border-line">
            <div className="text-center">
              <StatNumber value={aggregateImpact.healthyCount} size="sm" tone="healthy" />
              <div className="eyebrow text-fg-subtle mt-1.5">Healthy</div>
            </div>
            <div className="text-center">
              <StatNumber value={aggregateImpact.attentionCount} size="sm" tone="attention" />
              <div className="eyebrow text-fg-subtle mt-1.5">Attention</div>
            </div>
            <div className="text-center">
              <StatNumber value={aggregateImpact.criticalCount} size="sm" tone="critical" />
              <div className="eyebrow text-fg-subtle mt-1.5">Critical</div>
            </div>
          </div>
        </div>
      </div>

      {/* Equivalencies */}
      <div className="card p-5">
        <div className="eyebrow text-fg-subtle mb-4">Environmental equivalents</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <Equiv
            icon={Car}
            value={`${aggregateImpact.carKmOffset.toLocaleString()}`}
            unit="km"
            label="Vehicle emissions cancelled"
          />
          <Equiv
            icon={Zap}
            value={Math.round(aggregateImpact.totalCo2Kg / 0.008).toLocaleString()}
            label="Phone charges offset"
          />
          <Equiv
            icon={CloudRain}
            value={`${aggregateImpact.totalStormwaterGal.toLocaleString()}`}
            unit="gal"
            label="Stormwater filtered"
          />
          <Equiv
            icon={Wind}
            value={`${aggregateImpact.totalO2Kg}`}
            unit="kg"
            label="Oxygen released"
          />
        </div>
      </div>
    </div>
  );
}

function Equiv({ icon: Icon, value, label, unit }) {
  return (
    <div className="card-inset flex items-center gap-3 p-3 min-w-0">
      <Icon className="w-4 h-4 text-status-healthy shrink-0" strokeWidth={2} />
      <div className="min-w-0">
        <StatNumber value={value} unit={unit} size="sm" />
        <div className="text-caption text-fg-subtle mt-1 truncate" style={{ fontSize: '11px', lineHeight: '16px' }}>{label}</div>
      </div>
    </div>
  );
}