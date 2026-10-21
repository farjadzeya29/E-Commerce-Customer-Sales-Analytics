import React, { useState } from 'react';
import { TopNav, ActiveTab } from './components/TopNav';
import { PowerBIDashboard } from './components/PowerBIDashboard/PowerBIDashboard';
import { RFMAnalytics } from './components/RFMAnalytics/RFMAnalytics';
import { SQLConsole } from './components/SQLConsole/SQLConsole';
import { PythonNotebook } from './components/PythonNotebook/PythonNotebook';
import { ExecutiveReport } from './components/ExecutiveReport/ExecutiveReport';
import { Customer } from './types/analytics';
import { INITIAL_CUSTOMERS, INITIAL_ORDERS } from './data/mockData';
import { X, Download, FileSpreadsheet, FileCode, Check } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('powerbi');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportedStatus, setExportedStatus] = useState<string | null>(null);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    if (activeTab !== 'rfm') {
      setActiveTab('rfm');
    }
  };

  const handleExportCustomersCSV = () => {
    const headers = ['id', 'name', 'email', 'region', 'segment', 'recencyDays', 'frequency', 'monetary', 'aov', 'rfmScore', 'churnRisk', 'preferredCategory'];
    const rows = INITIAL_CUSTOMERS.map(c => [
      c.id,
      `"${c.name}"`,
      `"${c.email}"`,
      c.region,
      `"${c.segment}"`,
      c.recencyDays,
      c.frequency,
      c.monetary,
      c.aov,
      c.rfmScore,
      c.churnRisk,
      `"${c.preferredCategory}"`
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    downloadBlob(csv, `vanguard_customers_rfm_${Date.now()}.csv`, 'text/csv');
    setExportedStatus('Customer RFM dataset exported successfully');
    setTimeout(() => setExportedStatus(null), 3000);
  };

  const handleExportOrdersCSV = () => {
    const headers = ['id', 'orderDate', 'customerId', 'customerName', 'region', 'category', 'subCategory', 'productName', 'sales', 'profit', 'marginPercent', 'shippingDays'];
    const rows = INITIAL_ORDERS.map(o => [
      o.id,
      o.orderDate,
      o.customerId,
      `"${o.customerName}"`,
      o.region,
      `"${o.category}"`,
      `"${o.subCategory}"`,
      `"${o.productName}"`,
      o.sales,
      o.profit,
      o.marginPercent,
      o.shippingDays
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    downloadBlob(csv, `vanguard_orders_transactions_${Date.now()}.csv`, 'text/csv');
    setExportedStatus('Orders transaction log exported successfully');
    setTimeout(() => setExportedStatus(null), 3000);
  };

  const downloadBlob = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type: `${type};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* Strict 3-Zone Top Bar */}
      <TopNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExportData={() => setShowExportModal(true)}
      />

      {/* Main Analytical Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {activeTab === 'powerbi' && (
          <PowerBIDashboard
            onSelectCustomer={handleSelectCustomer}
            onNavigateToRFM={() => setActiveTab('rfm')}
          />
        )}

        {activeTab === 'rfm' && (
          <RFMAnalytics
            selectedCustomer={selectedCustomer}
            onSelectCustomer={(c) => setSelectedCustomer(c)}
            onCloseCustomerDrawer={() => setSelectedCustomer(null)}
          />
        )}

        {activeTab === 'sql' && (
          <SQLConsole />
        )}

        {activeTab === 'python' && (
          <PythonNotebook />
        )}

        {activeTab === 'executive' && (
          <ExecutiveReport
            onNavigateToRFM={() => setActiveTab('rfm')}
            onNavigateToPowerBI={() => setActiveTab('powerbi')}
          />
        )}
      </main>

      {/* Quiet Professional Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Vanguard E-Commerce Customer & Sales Analytics</span>
            <span aria-hidden="true">·</span>
            <span>SQL · Python · Power BI</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>RFM Quintile Segmentation Engine</span>
            <span aria-hidden="true">·</span>
            <span>Targeted Retention Playbook</span>
          </div>
        </div>
      </footer>

      {/* Export Analytics Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Export Analytics Data</h3>
                <p className="text-xs text-slate-400 mt-0.5">Download raw datasets for external modeling or reporting</p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {exportedStatus && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{exportedStatus}</span>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleExportCustomersCSV}
                className="w-full flex items-center justify-between p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors">
                      Customer RFM Dataset (.CSV)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Scores, recency days, monetary spend, and segment labels
                    </div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
              </button>

              <button
                onClick={handleExportOrdersCSV}
                className="w-full flex items-center justify-between p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      Transaction Orders Log (.CSV)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Line-item sales, discounts, margins, and shipping duration
                    </div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
