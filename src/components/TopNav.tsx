import React from 'react';
import { Download } from 'lucide-react';

export type ActiveTab = 'powerbi' | 'rfm' | 'sql' | 'python' | 'executive';

interface TopNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onExportData: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onTabChange,
  onExportData
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow-sm">
          BI
        </div>
        <span className="text-base font-bold tracking-tight text-slate-100 whitespace-nowrap">
          Vanguard Retail Analytics
        </span>
      </div>

      {/* Zone 2: 5 Concise Nav Links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
        <button
          onClick={() => onTabChange('powerbi')}
          className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
            activeTab === 'powerbi'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Power BI Dashboard
        </button>

        <button
          onClick={() => onTabChange('rfm')}
          className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
            activeTab === 'rfm'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          RFM Segmentation
        </button>

        <button
          onClick={() => onTabChange('sql')}
          className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
            activeTab === 'sql'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          SQL Console
        </button>

        <button
          onClick={() => onTabChange('python')}
          className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
            activeTab === 'python'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Python Notebook
        </button>

        <button
          onClick={() => onTabChange('executive')}
          className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
            activeTab === 'executive'
              ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Executive Summary
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onExportData}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-sm cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics</span>
        </button>
      </div>
    </header>
  );
};
