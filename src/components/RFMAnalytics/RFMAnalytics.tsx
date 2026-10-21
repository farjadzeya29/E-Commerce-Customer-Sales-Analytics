import React, { useState, useMemo } from 'react';
import { Customer, CustomerSegment } from '../../types/analytics';
import { INITIAL_CUSTOMERS } from '../../data/mockData';
import { computeSegmentSummaries, simulateRetentionCampaign, SegmentSummary } from '../../utils/rfmEngine';
import { ShieldAlert, Award, UserCheck, Flame, AlertCircle, ArrowUpRight, DollarSign, Calculator, ChevronRight, X, Clock, ShoppingCart, RefreshCw } from 'lucide-react';

interface RFMAnalyticsProps {
  onSelectCustomer?: (customer: Customer) => void;
  selectedCustomer?: Customer | null;
  onCloseCustomerDrawer?: () => void;
}

export const RFMAnalytics: React.FC<RFMAnalyticsProps> = ({
  onSelectCustomer,
  selectedCustomer,
  onCloseCustomerDrawer
}) => {
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulation Controls
  const [simSegment, setSimSegment] = useState<CustomerSegment>('At-Risk / Churn Danger');
  const [simWinBackPct, setSimWinBackPct] = useState<number>(30);
  const [simBudget, setSimBudget] = useState<number>(6000);
  const [simAov, setSimAov] = useState<number>(1150);

  const segmentSummaries = useMemo(() => {
    return computeSegmentSummaries(INITIAL_CUSTOMERS);
  }, []);

  const simulation = useMemo(() => {
    return simulateRetentionCampaign(
      simSegment,
      INITIAL_CUSTOMERS,
      simWinBackPct,
      simBudget,
      simAov
    );
  }, [simSegment, simWinBackPct, simBudget, simAov]);

  const filteredCustomers = useMemo(() => {
    return INITIAL_CUSTOMERS.filter(c => {
      if (selectedSegmentFilter !== 'All' && c.segment !== selectedSegmentFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedSegmentFilter, searchQuery]);

  // Selected Segment Details for Playbook
  const activeSegmentData = useMemo(() => {
    return segmentSummaries.find(s => s.segment === simSegment) || segmentSummaries[3];
  }, [segmentSummaries, simSegment]);

  return (
    <div className="space-y-6">
      {/* RFM Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Customer RFM Segmentation & Retention Strategy</span>
              <span className="text-xs font-normal text-slate-400">Recency · Frequency · Monetary Modeling</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Mathematical scoring divides customers into quintiles (1–5) based on purchase recency, transaction cadence, and lifetime spend to identify high-margin accounts in immediate churn danger.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter Segment:</span>
            <select
              value={selectedSegmentFilter}
              onChange={(e) => setSelectedSegmentFilter(e.target.value)}
              aria-label="Filter customer segment"
              className="bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 transition-colors"
            >
              <option value="All">All Customer Segments ({INITIAL_CUSTOMERS.length})</option>
              {segmentSummaries.map(s => (
                <option key={s.segment} value={s.segment}>{s.segment} ({s.count})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Segment Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {segmentSummaries.map((summary) => {
          const isSelected = simSegment === summary.segment;

          return (
            <div
              key={summary.segment}
              onClick={() => {
                setSimSegment(summary.segment);
                setSelectedSegmentFilter(summary.segment);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected 
                  ? 'bg-slate-800/90 border-amber-500/70 ring-1 ring-amber-500/30' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: summary.color }}></div>
                    <span className="text-xs font-bold text-white">{summary.segment}</span>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${summary.badgeBg}`}>
                    {summary.urgency} Urgency
                  </span>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold font-mono tabular-nums text-white">
                      ${(summary.totalRevenue / 1000).toFixed(1)}K
                    </span>
                    <span className="text-[11px] text-slate-400 ml-1.5 font-mono">
                      ({summary.revenuePct}% of rev)
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-300 font-mono">
                    {summary.count} Accounts
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Avg Inactive Days:</span>
                  <span className={`font-mono tabular-nums ${summary.avgRecencyDays > 100 ? 'text-amber-400 font-semibold' : 'text-slate-300'}`}>
                    {summary.avgRecencyDays}d
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Order Cadence:</span>
                  <span className="text-slate-300 font-mono tabular-nums">{summary.avgFrequency} orders</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Churn Risk:</span>
                  <span className={`font-mono tabular-nums font-semibold ${summary.avgChurnRisk > 70 ? 'text-red-400' : summary.avgChurnRisk > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {summary.avgChurnRisk}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2D RFM Scatter Matrix Visualization (Recency vs Monetary) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white">2D RFM Distribution Matrix (Recency vs. Monetary Spend)</h2>
            <p className="text-xs text-slate-400 mt-0.5">Bubble size indicates purchase frequency. Click any bubble to inspect customer 360 profile.</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> High-Value VIP</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Loyal</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> At-Risk Danger</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Hibernating</span>
          </div>
        </div>

        {/* 2D Canvas Map */}
        <div className="relative h-80 bg-slate-950/70 border border-slate-800 rounded-lg p-6 overflow-hidden">
          {/* Axis Labels */}
          <div className="absolute top-3 left-4 text-[10px] text-slate-400 uppercase tracking-wider font-mono">
            ▲ High Spend ($30K)
          </div>
          <div className="absolute bottom-2 left-4 text-[10px] text-slate-400 uppercase tracking-wider font-mono">
            ▼ Low Spend ($0)
          </div>
          <div className="absolute bottom-2 left-32 text-[10px] text-slate-400 uppercase tracking-wider font-mono">
            ◀ Recent Activity (0-30 Days)
          </div>
          <div className="absolute bottom-2 right-4 text-[10px] text-slate-400 uppercase tracking-wider font-mono">
            Lapsed Inactivity (300+ Days) ▶
          </div>

          {/* Quadrant Guidelines */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none opacity-15">
            <div className="border-r border-b border-slate-400"></div>
            <div className="border-b border-slate-400"></div>
            <div className="border-r border-slate-400"></div>
            <div></div>
          </div>

          {/* Quadrant Descriptions */}
          <div className="absolute top-7 left-14 text-[11px] font-medium text-emerald-400/50 pointer-events-none">
            High Spend · Recent (VIPs)
          </div>
          <div className="absolute top-7 right-14 text-[11px] font-medium text-amber-400/50 pointer-events-none text-right">
            High Spend · Lapsed (At-Risk Churn Danger)
          </div>

          {/* Customer Bubbles */}
          <div className="relative w-full h-full">
            {INITIAL_CUSTOMERS.map((c) => {
              // Map recency (0 to 380 days) to X (5% to 92%)
              const xPct = Math.min(92, Math.max(5, (c.recencyDays / 380) * 88 + 5));
              // Map monetary ($500 to $29,000) to Y (8% to 88% from top)
              const yPct = Math.min(88, Math.max(8, 100 - ((c.monetary / 29000) * 80 + 10)));
              
              // Bubble radius based on frequency
              const size = Math.max(16, Math.min(34, c.frequency * 1.3));
              const isSelected = selectedCustomer?.id === c.id;

              let color = '#3b82f6';
              if (c.segment === 'High-Value VIP') color = '#10b981';
              else if (c.segment === 'Loyal Champions') color = '#06b6d4';
              else if (c.segment === 'At-Risk / Churn Danger') color = '#f59e0b';
              else if (c.segment === 'Hibernating / Attention') color = '#a855f7';
              else if (c.segment === 'Lost / Inactive') color = '#ef4444';

              return (
                <div
                  key={c.id}
                  onClick={() => onSelectCustomer && onSelectCustomer(c)}
                  style={{
                    left: `${xPct}%`,
                    top: `${yPct}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className={`absolute rounded-full cursor-pointer transition-transform hover:scale-135 hover:z-30 shadow-md group flex items-center justify-center ${
                    isSelected ? 'ring-4 ring-white z-20 scale-125' : 'ring-1 ring-slate-900/50'
                  }`}
                >
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 bg-slate-950 border border-slate-700 rounded-md p-2 text-xs text-white whitespace-nowrap shadow-xl pointer-events-none z-50">
                    <div className="font-bold">{c.name}</div>
                    <div className="text-slate-400 text-[10px]">{c.segment} · {c.region}</div>
                    <div className="mt-1 font-mono text-[11px] text-amber-400">
                      Spend: ${c.monetary.toLocaleString()} · {c.frequency} orders
                    </div>
                    <div className="font-mono text-[10px] text-slate-300">
                      Inactive: {c.recencyDays} days · Churn Risk: {c.churnRisk}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Targeted Retention Strategy Playbook & Interactive ROI Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retention Strategy Playbook */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeSegmentData.color }}></div>
                <h3 className="text-sm font-bold text-white">{activeSegmentData.segment} Playbook</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{activeSegmentData.strategyTitle}</p>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded border ${activeSegmentData.badgeBg}`}>
              {activeSegmentData.urgency} Priority
            </span>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-300">Tailored Action Protocol:</span>
            <ul className="space-y-2">
              {activeSegmentData.recommendedTactics.map((tactic, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center shrink-0 text-[10px] font-mono mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{tactic}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 space-y-1.5">
            <div className="flex justify-between">
              <span>Primary Execution Channel:</span>
              <span className="font-medium text-slate-200">{activeSegmentData.recommendedChannel}</span>
            </div>
            <div className="flex justify-between">
              <span>Recommended Engagement Cadence:</span>
              <span className="font-medium text-slate-200">
                {activeSegmentData.urgency === 'Critical' ? 'Immediate 48h Sprint' : 'Weekly Automated Cycle'}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Retention Campaign ROI Simulator */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Retention Campaign ROI Simulator</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Calculate financial payback of targeted win-back intervention</p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-semibold">
              {simulation.roiMultiplier}x ROI
            </span>
          </div>

          {/* Parameter Sliders */}
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Target Win-Back Rate (%):</span>
                <span className="font-mono font-bold text-amber-400">{simWinBackPct}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={simWinBackPct}
                onChange={(e) => setSimWinBackPct(Number(e.target.value))}
                aria-label="Target Win-Back Rate"
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Intervention Budget ($):</span>
                <span className="font-mono font-bold text-amber-400">${simBudget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="1000"
                value={simBudget}
                onChange={(e) => setSimBudget(Number(e.target.value))}
                aria-label="Intervention Budget"
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Est. Re-activation AOV ($):</span>
                <span className="font-mono font-bold text-amber-400">${simAov.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="2500"
                step="50"
                value={simAov}
                onChange={(e) => setSimAov(Number(e.target.value))}
                aria-label="Estimated Reactivation AOV"
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          {/* Financial Payback Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-2">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400">Re-activated Accounts:</span>
                <div className="text-base font-bold font-mono text-white">
                  {simulation.reActivatedCustomers} of {simulation.totalSegmentCustomers}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Recovered Gross Revenue:</span>
                <div className="text-base font-bold font-mono text-emerald-400">
                  ${simulation.recoveredRevenue.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Incremental Net Profit:</span>
                <div className="text-base font-bold font-mono text-white">
                  ${simulation.incrementalProfit.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Net Profit (After Budget):</span>
                <div className="text-base font-bold font-mono text-amber-400">
                  ${simulation.netCampaignProfit.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Breakeven Threshold:</span>
              <span className="text-slate-200 font-mono">{simulation.breakEvenCustomers} accounts needed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Customer Profile Database</h3>
            <p className="text-xs text-slate-400 mt-0.5">Showing {filteredCustomers.length} accounts</p>
          </div>
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3 font-medium">Customer ID & Name</th>
                <th className="py-2.5 px-3 font-medium">Region</th>
                <th className="py-2.5 px-3 font-medium">Segment</th>
                <th className="py-2.5 px-3 font-medium text-center">RFM Score</th>
                <th className="py-2.5 px-3 font-medium text-right">Recency</th>
                <th className="py-2.5 px-3 font-medium text-right">Frequency</th>
                <th className="py-2.5 px-3 font-medium text-right">Lifetime Spend</th>
                <th className="py-2.5 px-3 font-medium text-right">Churn Risk</th>
                <th className="py-2.5 px-3 font-medium text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums text-slate-300">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-sans">
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="text-[11px] text-slate-400">{c.email}</div>
                  </td>
                  <td className="py-2.5 px-3 font-sans">{c.region}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="text-slate-200">{c.segment}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 bg-slate-800 rounded text-amber-400 font-mono text-[11px]">
                      {c.rfmScore}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">{c.recencyDays}d</td>
                  <td className="py-2.5 px-3 text-right">{c.frequency}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400">${c.monetary.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={c.churnRisk > 70 ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                      {c.churnRisk}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <button
                      onClick={() => onSelectCustomer && onSelectCustomer(c)}
                      className="px-2.5 py-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/30 transition-colors cursor-pointer"
                    >
                      360° Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer 360 Slideout Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex justify-end">
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-amber-400">{selectedCustomer.id}</span>
                <h2 className="text-lg font-bold text-white">{selectedCustomer.name}</h2>
                <div className="text-xs text-slate-400">{selectedCustomer.email} · {selectedCustomer.region} Region</div>
              </div>
              <button
                onClick={onCloseCustomerDrawer}
                aria-label="Close drawer"
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segment Badge */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400">Assigned Segment:</span>
                <div className="font-semibold text-white text-sm">{selectedCustomer.segment}</div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400">RFM Quintile:</span>
                <div className="font-mono text-amber-400 font-bold text-sm">{selectedCustomer.rfmScore}</div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Lifetime Revenue:</span>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                  ${selectedCustomer.monetary.toLocaleString()}
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Lifetime Orders:</span>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  {selectedCustomer.frequency} orders
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Days Since Last Order:</span>
                <div className="text-lg font-bold font-mono text-amber-400 mt-1">
                  {selectedCustomer.recencyDays} days ago
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Churn Risk Probability:</span>
                <div className={`text-lg font-bold font-mono mt-1 ${selectedCustomer.churnRisk > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {selectedCustomer.churnRisk}%
                </div>
              </div>
            </div>

            {/* Detailed RFM Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">RFM Dimension Scores:</span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Recency (R) Score:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div style={{ width: `${(selectedCustomer.rScore / 5) * 100}%` }} className="h-full bg-amber-400"></div>
                    </div>
                    <span className="font-mono text-white">{selectedCustomer.rScore} / 5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Frequency (F) Score:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div style={{ width: `${(selectedCustomer.fScore / 5) * 100}%` }} className="h-full bg-cyan-400"></div>
                    </div>
                    <span className="font-mono text-white">{selectedCustomer.fScore} / 5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Monetary (M) Score:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div style={{ width: `${(selectedCustomer.mScore / 5) * 100}%` }} className="h-full bg-emerald-400"></div>
                    </div>
                    <span className="font-mono text-white">{selectedCustomer.mScore} / 5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Retention Intervention */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-amber-400">Recommended Next Best Action</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedCustomer.segment === 'At-Risk / Churn Danger'
                  ? `Immediate win-back outreach required. Trigger an executive voucher of $150 towards ${selectedCustomer.preferredCategory} and assign a personal account review.`
                  : selectedCustomer.segment === 'High-Value VIP'
                  ? `Maintain concierge service. Ensure zero freight charges and early release invites for upcoming Q4 catalog.`
                  : `Trigger personalized cross-sell recommendations for ${selectedCustomer.preferredCategory} with a 10% next-order velocity incentive.`}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onCloseCustomerDrawer}
                className="w-full py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
