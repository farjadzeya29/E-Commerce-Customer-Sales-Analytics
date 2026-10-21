import React, { useState, useEffect } from 'react';
import { Play, Database, Download, Check, Copy, FileCode, Clock, Table, ChevronRight } from 'lucide-react';
import { SQL_TEMPLATES } from '../../data/mockData';
import { executeSQLQuery, QueryResult } from '../../utils/sqlEngine';
import { SQLQueryTemplate } from '../../types/analytics';

export const SQLConsole: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<SQLQueryTemplate>(SQL_TEMPLATES[0]);
  const [sqlCode, setSqlCode] = useState<string>(SQL_TEMPLATES[0].sql);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeSchemaTable, setActiveSchemaTable] = useState<string>('customers');

  // Execute query on mount or template change
  useEffect(() => {
    handleRunQuery(sqlCode);
  }, []);

  const handleSelectTemplate = (template: SQLQueryTemplate) => {
    setSelectedTemplate(template);
    setSqlCode(template.sql);
    handleRunQuery(template.sql);
  };

  const handleRunQuery = (codeToRun: string = sqlCode) => {
    const res = executeSQLQuery(codeToRun);
    setQueryResult(res);
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    if (!queryResult || queryResult.rows.length === 0) return;
    const header = queryResult.columns.join(',');
    const body = queryResult.rows.map(r => r.map(val => `"${val ?? ''}"`).join(',')).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(`${header}\n${body}`);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `sql_query_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const schemas = [
    {
      name: 'customers',
      desc: 'Account profiles, RFM quintile scores, recency days, churn risk',
      fields: ['id (VARCHAR)', 'name (VARCHAR)', 'region (VARCHAR)', 'recencyDays (INT)', 'frequency (INT)', 'monetary (DECIMAL)', 'rfmScore (VARCHAR)', 'segment (VARCHAR)', 'churnRisk (INT)']
    },
    {
      name: 'orders',
      desc: 'Line-item retail transactions, discount rates, shipping SLAs',
      fields: ['id (VARCHAR)', 'orderDate (DATE)', 'customerId (VARCHAR)', 'category (VARCHAR)', 'sales (DECIMAL)', 'profit (DECIMAL)', 'marginPercent (FLOAT)', 'shippingDays (INT)']
    },
    {
      name: 'regions',
      desc: 'Territory volume, profit margins, quota target achievement',
      fields: ['region (VARCHAR)', 'sales (DECIMAL)', 'profit (DECIMAL)', 'marginPercent (FLOAT)', 'avgShippingDays (FLOAT)', 'targetAchievement (FLOAT)']
    },
    {
      name: 'categories',
      desc: 'Merchandise taxonomy, gross margins, YoY sales velocity',
      fields: ['category (VARCHAR)', 'sales (DECIMAL)', 'profit (DECIMAL)', 'margin (FLOAT)', 'share (FLOAT)', 'growth (FLOAT)']
    },
    {
      name: 'cohorts',
      desc: '12-month cohort customer retention percentages',
      fields: ['cohortMonth (VARCHAR)', 'initialCustomers (INT)', 'retention (ARRAY<INT>)']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>SQL Analytics Workbench & Query Runner</span>
              <span className="text-xs font-normal text-slate-400">PostgreSQL / BigQuery Dialect</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Execute window functions, RFM quintile calculations, Pareto 80/20 category distributions, and multi-month cohort retention models with zero latency.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRunQuery()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-slate-900" />
              <span>Run SQL Query</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Query Catalog Sidebar & Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Template Catalog (1 Col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <FileCode className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Pre-Built SQL Queries</h2>
          </div>

          <div className="space-y-2">
            {SQL_TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplate.id === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-amber-500/70 text-white'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold truncate">{tmpl.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Database Schema Navigator */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-cyan-400" /> Schemas</span>
              <span className="text-[10px] text-slate-500">5 Tables</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {schemas.map(s => (
                <button
                  key={s.name}
                  onClick={() => setActiveSchemaTable(s.name)}
                  className={`px-2 py-1 text-[11px] rounded transition-colors cursor-pointer ${
                    activeSchemaTable === s.name ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {/* Schema fields view */}
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1">
              <div className="text-amber-400 font-bold mb-1 font-sans">{activeSchemaTable}:</div>
              {schemas.find(s => s.name === activeSchemaTable)?.fields.map((f, i) => (
                <div key={i} className="text-slate-400 truncate">• {f}</div>
              ))}
            </div>
          </div>
        </div>

        {/* SQL Editor & Results Area (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* SQL Editor Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{selectedTemplate.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">ANSI SQL</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySQL}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy SQL'}</span>
                </button>
                <button
                  onClick={() => handleRunQuery()}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-slate-900" />
                  <span>Execute</span>
                </button>
              </div>
            </div>

            <textarea
              value={sqlCode}
              onChange={(e) => setSqlCode(e.target.value)}
              aria-label="SQL query editor"
              rows={11}
              className="w-full bg-slate-950/80 p-4 font-mono text-xs text-amber-200/90 leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              spellCheck={false}
            />

            <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Tip: Edit SQL code freely or pick any template on the left.</span>
              <span className="font-mono">Shortcuts: Click Execute to run</span>
            </div>
          </div>

          {/* Execution Result Area */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-4">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5 text-amber-400" />
                  <span>Query Execution Result</span>
                </span>
                {queryResult && (
                  <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Status: 200 OK
                    </span>
                    <span>Rows: <strong className="text-white">{queryResult.rowCount}</strong></span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {queryResult.executionTimeMs} ms
                    </span>
                  </div>
                )}
              </div>

              {queryResult && queryResult.rows.length > 0 && (
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              )}
            </div>

            {/* Table Grid */}
            <div className="overflow-x-auto max-h-96">
              {queryResult && queryResult.rows.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 sticky top-0">
                    <tr>
                      {queryResult.columns.map((col, idx) => (
                        <th key={idx} className="py-2.5 px-3.5 font-medium whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums text-slate-300">
                    {queryResult.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-800/50 transition-colors">
                        {row.map((val, cIdx) => (
                          <td key={cIdx} className="py-2 px-3.5 whitespace-nowrap">
                            {val === null || val === undefined ? (
                              <span className="text-slate-600 italic">null</span>
                            ) : typeof val === 'number' ? (
                              val.toLocaleString()
                            ) : (
                              String(val)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No records returned or query still running.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
