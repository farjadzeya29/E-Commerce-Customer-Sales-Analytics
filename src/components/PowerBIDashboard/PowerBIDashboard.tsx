import React, { useState, useMemo } from 'react';
import { Filter, RotateCcw, TrendingUp, DollarSign, Users, ShoppingBag, Truck, Percent, ChevronRight } from 'lucide-react';
import { Customer, Order, RegionSummary, MonthlyTrend, FilterState } from '../../types/analytics';
import { INITIAL_CUSTOMERS, INITIAL_ORDERS, REGION_SUMMARIES, MONTHLY_TRENDS, CATEGORY_BREAKDOWN } from '../../data/mockData';

interface PowerBIDashboardProps {
  onSelectCustomer?: (customer: Customer) => void;
  onNavigateToRFM?: () => void;
}

export const PowerBIDashboard: React.FC<PowerBIDashboardProps> = ({ onSelectCustomer, onNavigateToRFM }) => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'All',
    region: 'All',
    category: 'All',
    segment: 'All',
    searchQuery: ''
  });

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'categories' | 'regions'>('overview');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Derived filtered data
  const filteredCustomers = useMemo(() => {
    return INITIAL_CUSTOMERS.filter(c => {
      if (filters.region !== 'All' && c.region !== filters.region) return false;
      if (filters.segment !== 'All' && c.segment !== filters.segment) return false;
      if (filters.category !== 'All' && c.preferredCategory !== filters.category) return false;
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query);
      }
      return true;
    });
  }, [filters]);

  const filteredOrders = useMemo(() => {
    return INITIAL_ORDERS.filter(o => {
      if (filters.region !== 'All' && o.region !== filters.region) return false;
      if (filters.category !== 'All' && o.category !== filters.category) return false;
      return true;
    });
  }, [filters]);

  // Aggregate KPIs based on filters
  const metrics = useMemo(() => {
    const totalSales = filteredCustomers.reduce((acc, c) => acc + c.monetary, 0);
    const totalOrders = filteredCustomers.reduce((acc, c) => acc + c.frequency, 0);
    const avgAov = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
    const estProfit = Math.round(totalSales * 0.228); // 22.8% benchmark net margin
    const activeCustCount = filteredCustomers.length;
    const avgRecency = activeCustCount > 0 ? Math.round(filteredCustomers.reduce((a, b) => a + b.recencyDays, 0) / activeCustCount) : 0;
    const avgChurnRisk = activeCustCount > 0 ? Math.round(filteredCustomers.reduce((a, b) => a + b.churnRisk, 0) / activeCustCount) : 0;

    return {
      totalSales,
      estProfit,
      marginPercent: 22.8,
      totalOrders,
      avgAov,
      activeCustCount,
      avgRecency,
      avgChurnRisk
    };
  }, [filteredCustomers]);

  const resetFilters = () => {
    setFilters({
      dateRange: 'All',
      region: 'All',
      category: 'All',
      segment: 'All',
      searchQuery: ''
    });
    setSelectedMonth(null);
  };

  const hasActiveFilters = filters.region !== 'All' || filters.category !== 'All' || filters.segment !== 'All' || filters.dateRange !== 'All';

  return (
    <div className="space-y-6">
      {/* Power BI Workspace Header & Slicers Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Executive Sales & Customer KPI Dashboard</span>
              <span className="text-xs font-normal text-slate-400">Power BI Service Mode</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-dimensional cross-filtered analytics connecting transactional revenue, profitability, and customer behavior.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-md border border-amber-500/30 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Slicers</span>
              </button>
            )}

            {/* View Sub-Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveSubTab('overview')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeSubTab === 'overview' ? 'bg-slate-800 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Executive Overview
              </button>
              <button
                onClick={() => setActiveSubTab('categories')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeSubTab === 'categories' ? 'bg-slate-800 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Category Matrix
              </button>
              <button
                onClick={() => setActiveSubTab('regions')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeSubTab === 'regions' ? 'bg-slate-800 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Regional & SLA
              </button>
            </div>
          </div>
        </div>

        {/* Power BI Interactive Slicers Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
          {/* Slicer: Region */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3 text-amber-400" /> Region Slicer
            </label>
            <select
              value={filters.region}
              onChange={(e) => setFilters(f => ({ ...f, region: e.target.value }))}
              aria-label="Filter by region"
              className="bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 transition-colors"
            >
              <option value="All">All Regions (West, East, Central, South, North)</option>
              <option value="West">West Region ($1.28M · 25% Margin)</option>
              <option value="East">East Region ($1.05M · 23% Margin)</option>
              <option value="Central">Central Region ($785K · 20% Margin)</option>
              <option value="South">South Region ($498K · 17% Margin)</option>
              <option value="North">North Region ($228K · 26% Margin)</option>
            </select>
          </div>

          {/* Slicer: Product Category */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Product Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
              aria-label="Filter by product category"
              className="bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 transition-colors"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics (43.7% Revenue)</option>
              <option value="Furniture">Furniture (27.3% Revenue)</option>
              <option value="Office Supplies">Office Supplies (13.5% Revenue)</option>
              <option value="Home & Living">Home & Living (9.9% Revenue)</option>
              <option value="Apparel">Apparel (5.5% Revenue)</option>
            </select>
          </div>

          {/* Slicer: Customer Segment */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              RFM Customer Segment
            </label>
            <select
              value={filters.segment}
              onChange={(e) => setFilters(f => ({ ...f, segment: e.target.value }))}
              aria-label="Filter by customer segment"
              className="bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 transition-colors"
            >
              <option value="All">All Customer Segments</option>
              <option value="High-Value VIP">High-Value VIP (5-5-5 / 4-5-5)</option>
              <option value="Loyal Champions">Loyal Champions (4-4-4)</option>
              <option value="Potential Loyalists">Potential Loyalists (4-3-3)</option>
              <option value="At-Risk / Churn Danger">At-Risk / Churn Danger (1-5-5)</option>
              <option value="Hibernating / Attention">Hibernating / Attention (1-2-2)</option>
              <option value="Lost / Inactive">Lost / Inactive (1-1-1)</option>
            </select>
          </div>

          {/* Slicer: Date Period */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Time Horizon
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(f => ({ ...f, dateRange: e.target.value as any }))}
              aria-label="Filter by time horizon"
              className="bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 transition-colors"
            >
              <option value="All">Full History (18 Months Cohort)</option>
              <option value="2026">CY 2026 To Date</option>
              <option value="2025">CY 2025 Full Year</option>
              <option value="Last 90 Days">Trailing 90 Days</option>
              <option value="Last 180 Days">Trailing 180 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Power BI KPI Ribbon (High-Density Cards with Tabular Numerals) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Total Sales */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Total Gross Sales</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
              ${(metrics.totalSales / 1000).toFixed(1)}K
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono tabular-nums flex items-center">
              +18.4% YoY
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            vs. Target Plan: <span className="text-slate-200 font-mono tabular-nums">104.2% achieved</span>
          </div>
        </div>

        {/* Card 2: Net Profit & Margin */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Total Net Profit</span>
            <Percent className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
              ${(metrics.estProfit / 1000).toFixed(1)}K
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono tabular-nums">
              {metrics.marginPercent}% margin
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            South margin drag: <span className="text-amber-400 font-mono tabular-nums">17.0%</span>
          </div>
        </div>

        {/* Card 3: Active Accounts & Churn Vulnerability */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Active Customer Accounts</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
              {metrics.activeCustCount}
            </span>
            <span className="text-[11px] text-slate-400">
              Avg Inactive: <span className="text-slate-200 font-mono tabular-nums">{metrics.avgRecency}d</span>
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Avg Churn Vulnerability:</span>
            <span className={`font-mono tabular-nums font-semibold ${metrics.avgChurnRisk > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {metrics.avgChurnRisk}%
            </span>
          </div>
        </div>

        {/* Card 4: Orders & AOV */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Average Order Value (AOV)</span>
            <ShoppingBag className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
              ${metrics.avgAov}
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono tabular-nums">
              +6.2% QoQ
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Total Orders Logged: <span className="text-slate-200 font-mono tabular-nums">{metrics.totalOrders}</span>
          </div>
        </div>
      </div>

      {/* Main Content Sub-Tab Views */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Sales & Profit Trend (2 Cols) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-white">Monthly Revenue & Net Profit Trend</h2>
                <p className="text-xs text-slate-400 mt-0.5">Dual-axis performance trajectory vs Target baseline</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-amber-400 rounded-sm"></div>
                  <span>Gross Sales ($)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-emerald-400 rounded-sm"></div>
                  <span>Net Profit ($)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-slate-500"></div>
                  <span>Target Plan</span>
                </div>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="mt-6 h-64 flex items-end gap-2.5 pt-6 pb-2">
              {MONTHLY_TRENDS.slice(-10).map((m) => {
                const maxVal = 460000;
                const salesHeight = Math.round((m.sales / maxVal) * 100);
                const profitHeight = Math.round(((m.profit * 3.8) / maxVal) * 100);
                const isSelected = selectedMonth === m.month;

                return (
                  <div
                    key={m.month}
                    onClick={() => setSelectedMonth(isSelected ? null : m.month)}
                    className={`flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative transition-opacity ${
                      selectedMonth && !isSelected ? 'opacity-35' : 'opacity-100'
                    }`}
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-slate-950 border border-slate-700 rounded-md p-1.5 text-[10px] text-white whitespace-nowrap shadow-xl z-20 pointer-events-none">
                      <div className="font-bold">{m.monthLabel}</div>
                      <div className="text-amber-400 font-mono tabular-nums">Sales: ${m.sales.toLocaleString()}</div>
                      <div className="text-emerald-400 font-mono tabular-nums">Profit: ${m.profit.toLocaleString()}</div>
                    </div>

                    {/* Bars */}
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Sales bar */}
                      <div
                        style={{ height: `${salesHeight}%` }}
                        className={`w-1/2 rounded-t transition-all ${
                          isSelected ? 'bg-amber-300 ring-2 ring-amber-400' : 'bg-amber-400/80 group-hover:bg-amber-400'
                        }`}
                      ></div>
                      {/* Profit bar */}
                      <div
                        style={{ height: `${profitHeight}%` }}
                        className={`w-1/2 rounded-t transition-all ${
                          isSelected ? 'bg-emerald-300 ring-2 ring-emerald-400' : 'bg-emerald-400/80 group-hover:bg-emerald-400'
                        }`}
                      ></div>
                    </div>

                    <span className="text-[10px] text-slate-400 mt-2 font-mono truncate w-full text-center">
                      {m.month.split('-')[1]}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
              <span>Trailing 10-Month Performance Track</span>
              <span>Click any bar to isolate time period</span>
            </div>
          </div>

          {/* Regional Performance Slices (1 Col) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-sm font-bold text-white">Regional Margin Distribution</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Volume share and profit margin by territory</p>
                </div>
              </div>

              <div className="mt-4 space-y-3.5">
                {REGION_SUMMARIES.map((r) => {
                  const maxSales = 1300000;
                  const pct = Math.round((r.sales / maxSales) * 100);
                  const isSelected = filters.region === r.region;

                  return (
                    <div
                      key={r.region}
                      onClick={() => setFilters(f => ({ ...f, region: f.region === r.region ? 'All' : r.region }))}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-slate-800 border-amber-500/50' 
                          : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{r.region} Region</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono tabular-nums text-slate-200">${(r.sales / 1000).toFixed(0)}K</span>
                          <span className={`font-mono tabular-nums text-[11px] ${r.marginPercent >= 23 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {r.marginPercent}% margin
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full rounded-full ${isSelected ? 'bg-amber-400' : 'bg-slate-500'}`}
                        ></div>
                      </div>

                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{r.customers} Accounts · {r.avgShippingDays}d avg delivery</span>
                        <span>{r.targetAchievement}% of Target</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Lowest Margin: South (17%)</span>
              <button
                onClick={() => setFilters(f => ({ ...f, region: 'South' }))}
                className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
              >
                Inspect South
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Category Matrix View */}
      {activeSubTab === 'categories' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white">Merchandise Category Profitability & Volume Analysis</h2>
              <p className="text-xs text-slate-400 mt-0.5">80/20 Pareto revenue concentration across product families</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">5 Active Product Portfolios</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {CATEGORY_BREAKDOWN.map((c) => {
              const isSelected = filters.category === c.category;

              return (
                <div
                  key={c.category}
                  onClick={() => setFilters(f => ({ ...f, category: f.category === c.category ? 'All' : c.category }))}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected ? 'bg-slate-800 border-amber-500/60 ring-1 ring-amber-500/40' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-200">{c.category}</span>
                    <div className="mt-2 text-xl font-bold text-white font-mono tabular-nums">
                      ${(c.sales / 1000).toFixed(0)}K
                    </div>
                    <div className="mt-1 text-xs text-emerald-400 font-mono tabular-nums">
                      +{(c.profit / 1000).toFixed(0)}K Net Profit ({c.margin}%)
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
                    <div className="flex justify-between">
                      <span>Market Share:</span>
                      <span className="text-slate-200 font-mono">{c.share}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>YoY Velocity:</span>
                      <span className="text-emerald-400 font-mono">+{c.growth}%</span>
                    </div>
                    <div className="pt-1 text-[10px] text-slate-400 truncate">
                      Best seller: <span className="text-slate-300">{c.topItem}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Category Table */}
          <div className="border border-slate-800 rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-950 text-xs font-semibold text-slate-300 border-b border-slate-800">
              Product Category Performance Ledger
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Category Name</th>
                  <th className="py-2.5 px-4 font-medium text-right">Total Revenue</th>
                  <th className="py-2.5 px-4 font-medium text-right">Net Profit</th>
                  <th className="py-2.5 px-4 font-medium text-right">Profit Margin</th>
                  <th className="py-2.5 px-4 font-medium text-right">Revenue Share</th>
                  <th className="py-2.5 px-4 font-medium text-right">YoY Growth</th>
                  <th className="py-2.5 px-4 font-medium">Flagship Product Line</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums text-slate-300">
                {CATEGORY_BREAKDOWN.map((row) => (
                  <tr key={row.category} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-4 font-sans font-medium text-white">{row.category}</td>
                    <td className="py-2.5 px-4 text-right">${row.sales.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right text-emerald-400">${row.profit.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right">{row.margin}%</td>
                    <td className="py-2.5 px-4 text-right">{row.share}%</td>
                    <td className="py-2.5 px-4 text-right text-emerald-400">+{row.growth}%</td>
                    <td className="py-2.5 px-4 font-sans text-slate-400">{row.topItem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Regional & Logistics SLA */}
      {activeSubTab === 'regions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white">Regional Territory & Fulfillment Efficiency</h2>
              <p className="text-xs text-slate-400 mt-0.5">Shipping transit latency, discount leakage, and quota attainment</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* SLA Delivery Performance */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>Shipping Lead Time (Days)</span>
              </div>
              <p className="text-xs text-slate-400">Transit duration affects re-order rate and post-purchase churn probability.</p>

              <div className="space-y-2 pt-2">
                {REGION_SUMMARIES.map(r => (
                  <div key={r.region} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{r.region}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${(r.avgShippingDays / 4.5) * 100}%` }}
                          className={`h-full ${r.avgShippingDays <= 2.5 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                        ></div>
                      </div>
                      <span className="font-mono tabular-nums text-slate-200">{r.avgShippingDays}d</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quota Attainment */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Annual Quota Attainment %</span>
              </div>
              <p className="text-xs text-slate-400">Territories with &gt;100% quota qualify for expansion staffing.</p>

              <div className="space-y-2 pt-2">
                {REGION_SUMMARIES.map(r => (
                  <div key={r.region} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{r.region}</span>
                    <span className={`font-mono tabular-nums font-semibold ${r.targetAchievement >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {r.targetAchievement}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Regional Findings Card */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200">Logistics Diagnostic Insight</span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  South region experiences the highest shipping latency (<span className="text-amber-400 font-mono">3.8 days</span>) 
                  and highest promotional discounts (<span className="text-amber-400 font-mono">18.4%</span>), driving margin compression 
                  to 17.0% compared to West's 25.0%.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={onNavigateToRFM}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  <span>View Customer Retention Matrix</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Customer Inspection Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Active Segment Sample (Filtered)</h3>
            <p className="text-xs text-slate-400 mt-0.5">Showing accounts matching active slicer parameters</p>
          </div>
          <button
            onClick={onNavigateToRFM}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>Open Full RFM Matrix</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2 px-3 font-medium">Customer</th>
                <th className="py-2 px-3 font-medium">Region</th>
                <th className="py-2 px-3 font-medium">RFM Segment</th>
                <th className="py-2 px-3 font-medium text-right">Recency</th>
                <th className="py-2 px-3 font-medium text-right">Frequency</th>
                <th className="py-2 px-3 font-medium text-right">Monetary Spend</th>
                <th className="py-2 px-3 font-medium text-right">Churn Risk</th>
                <th className="py-2 px-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums text-slate-300">
              {filteredCustomers.slice(0, 6).map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-sans">
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="text-[11px] text-slate-400">{c.email}</div>
                  </td>
                  <td className="py-2.5 px-3 font-sans">{c.region}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="text-slate-200">{c.segment}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right">{c.recencyDays}d ago</td>
                  <td className="py-2.5 px-3 text-right">{c.frequency} orders</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400">${c.monetary.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={c.churnRisk > 70 ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                      {c.churnRisk}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <button
                      onClick={() => onSelectCustomer && onSelectCustomer(c)}
                      className="px-2 py-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/30 transition-colors cursor-pointer"
                    >
                      Inspect 360
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
