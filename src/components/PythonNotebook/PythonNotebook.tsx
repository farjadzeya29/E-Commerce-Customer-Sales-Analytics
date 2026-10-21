import React, { useState } from 'react';
import { Play, RotateCcw, Check, Sparkles, Sliders, ChevronDown, ChevronRight, BarChart2, Layers } from 'lucide-react';
import { COHORT_DATA, CATEGORY_BREAKDOWN } from '../../data/mockData';

export const PythonNotebook: React.FC = () => {
  const [executedCells, setExecutedCells] = useState<Record<string, boolean>>({
    cell1: true,
    cell2: true,
    cell3: true,
    cell4: true,
    cell5: true
  });

  const [executing, setExecuting] = useState<string | null>(null);
  const [kClusters, setKClusters] = useState<number>(4);
  const [churnCutoffDays, setChurnCutoffDays] = useState<number>(90);

  const runCell = (cellId: string) => {
    setExecuting(cellId);
    setTimeout(() => {
      setExecutedCells(prev => ({ ...prev, [cellId]: true }));
      setExecuting(null);
    }, 400);
  };

  const runAllCells = () => {
    setExecuting('all');
    setTimeout(() => {
      setExecutedCells({
        cell1: true,
        cell2: true,
        cell3: true,
        cell4: true,
        cell5: true
      });
      setExecuting(null);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Notebook Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Python Data Science Environment (Pandas & Scikit-Learn)</span>
              <span className="text-xs font-normal text-slate-400">Jupyter Runtime Kernel · Python 3.11</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              End-to-end data pipeline: Transaction preprocessing, log-transformed RFM feature engineering, K-Means unsupervised clustering, and churn risk feature importance analysis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runAllCells}
              disabled={executing !== null}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-slate-900" />
              <span>{executing === 'all' ? 'Running Notebook...' : 'Run All Cells'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notebook Cells Container */}
      <div className="space-y-4">
        {/* Cell 1: Environment & Imports */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-amber-400">In [{executedCells.cell1 ? '1' : ' '}]</span>
              <span className="text-slate-400">01_dependencies_and_ingestion.py</span>
            </div>
            <button
              onClick={() => runCell('cell1')}
              disabled={executing === 'cell1'}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span>Run</span>
            </button>
          </div>

          <div className="p-4 bg-slate-950/70 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto">
            <span className="text-purple-400">import</span> pandas <span className="text-purple-400">as</span> pd<br />
            <span className="text-purple-400">import</span> numpy <span className="text-purple-400">as</span> np<br />
            <span className="text-purple-400">from</span> sklearn.preprocessing <span className="text-purple-400">import</span> StandardScaler, RobustScaler<br />
            <span className="text-purple-400">from</span> sklearn.cluster <span className="text-purple-400">import</span> KMeans<br />
            <span className="text-purple-400">from</span> sklearn.ensemble <span className="text-purple-400">import</span> RandomForestClassifier<br />
            <span className="text-purple-400">import</span> matplotlib.pyplot <span className="text-purple-400">as</span> plt<br />
            <br />
            <span className="text-slate-500"># Load enterprise transactional store</span><br />
            df_orders = pd.read_parquet(<span className="text-emerald-300">"s3://retail-dw/ecommerce_orders_2024_2026.parquet"</span>)<br />
            df_orders[<span className="text-emerald-300">'order_date'</span>] = pd.to_datetime(df_orders[<span className="text-emerald-300">'order_date'</span>])<br />
            print(<span className="text-emerald-300">f"Ingested </span>&#123;len(df_orders):,&#125;<span className="text-emerald-300"> transactions across 1,248 accounts. Date range: </span>&#123;df_orders['order_date'].min().date()&#125;<span className="text-emerald-300"> to </span>&#123;df_orders['order_date'].max().date()&#125;<span className="text-emerald-300">"</span>)
          </div>

          {executedCells.cell1 && (
            <div className="p-3 bg-slate-950 border-t border-slate-800/80 font-mono text-[11px] text-emerald-400">
              Ingested 10,660 transactions across 1,248 accounts. Date range: 2024-01-10 to 2026-10-15
            </div>
          )}
        </div>

        {/* Cell 2: RFM Calculation & Skewness Transformation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-amber-400">In [{executedCells.cell2 ? '2' : ' '}]</span>
              <span className="text-slate-400">02_rfm_feature_pipeline.py</span>
            </div>
            <button
              onClick={() => runCell('cell2')}
              disabled={executing === 'cell2'}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span>Run</span>
            </button>
          </div>

          <div className="p-4 bg-slate-950/70 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto">
            <span className="text-slate-500"># Set analytical evaluation snapshot date</span><br />
            SNAPSHOT_DATE = df_orders[<span className="text-emerald-300">'order_date'</span>].max() + pd.Timedelta(days=1)<br />
            <br />
            rfm = df_orders.groupby(<span className="text-emerald-300">'customer_id'</span>).agg(&#123;<br />
            &nbsp;&nbsp;<span className="text-emerald-300">'order_date'</span>: <span className="text-purple-400">lambda</span> x: (SNAPSHOT_DATE - x.max()).days,<br />
            &nbsp;&nbsp;<span className="text-emerald-300">'order_id'</span>: <span className="text-emerald-300">'nunique'</span>,<br />
            &nbsp;&nbsp;<span className="text-emerald-300">'sales'</span>: <span className="text-emerald-300">'sum'</span><br />
            &#125;).rename(columns=&#123;<br />
            &nbsp;&nbsp;<span className="text-emerald-300">'order_date'</span>: <span className="text-emerald-300">'recency'</span>,<br />
            &nbsp;&nbsp;<span className="text-emerald-300">'order_id'</span>: <span className="text-emerald-300">'frequency'</span>,<br />
            &nbsp;&nbsp;<span className="text-emerald-300">'sales'</span>: <span className="text-emerald-300">'monetary'</span><br />
            &#125;)<br />
            <br />
            <span className="text-slate-500"># Apply log transformation to eliminate extreme monetary right-skewness</span><br />
            rfm_log = np.log1p(rfm[[<span className="text-emerald-300">'recency'</span>, <span className="text-emerald-300">'frequency'</span>, <span className="text-emerald-300">'monetary'</span>]])<br />
            scaler = StandardScaler()<br />
            rfm_scaled = scaler.fit_transform(rfm_log)<br />
            print(<span className="text-emerald-300">"Log-transformed feature skewness reduced from +3.82 to +0.14"</span>)
          </div>

          {executedCells.cell2 && (
            <div className="p-3 bg-slate-950 border-t border-slate-800/80 font-mono text-[11px] text-slate-300">
              <span className="text-emerald-400">Log-transformed feature skewness reduced from +3.82 to +0.14</span>
              <div className="mt-2 text-slate-400">
                Summary Stats (Scaled Features): Mean = [0.00, 0.00, 0.00], Std = [1.00, 1.00, 1.00]
              </div>
            </div>
          )}
        </div>

        {/* Cell 3: K-Means Clustering & Interactive K-Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-amber-400">In [{executedCells.cell3 ? '3' : ' '}]</span>
              <span className="text-slate-400">03_kmeans_unsupervised_clustering.py</span>
            </div>
            <button
              onClick={() => runCell('cell3')}
              disabled={executing === 'cell3'}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span>Run</span>
            </button>
          </div>

          <div className="p-4 bg-slate-950/70 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto">
            <span className="text-slate-500"># Model optimization: Fit K-Means with k={kClusters}</span><br />
            kmeans = KMeans(n_clusters={kClusters}, init=<span className="text-emerald-300">'k-means++'</span>, n_init=20, random_state=42)<br />
            rfm[<span className="text-emerald-300">'cluster'</span>] = kmeans.fit_predict(rfm_scaled)<br />
            <br />
            cluster_centers = pd.DataFrame(<br />
            &nbsp;&nbsp;scaler.inverse_transform(kmeans.cluster_centers_),<br />
            &nbsp;&nbsp;columns=[<span className="text-emerald-300">'recency_mean'</span>, <span className="text-emerald-300">'freq_mean'</span>, <span className="text-emerald-300">'monetary_mean'</span>]<br />
            )<br />
            print(cluster_centers.round(1))
          </div>

          {/* Interactive K Selector Widget */}
          <div className="p-4 bg-slate-950 border-t border-slate-800/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-white">Interactive Cluster Centroid Tuning:</span>
                <span className="text-xs text-amber-400 font-mono font-bold">k = {kClusters}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[3, 4, 5, 6].map(k => (
                  <button
                    key={k}
                    onClick={() => {
                      setKClusters(k);
                      runCell('cell3');
                    }}
                    className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors cursor-pointer ${
                      kClusters === k ? 'bg-amber-400 text-slate-950 font-bold border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    k={k}
                  </button>
                ))}
              </div>
            </div>

            {/* Centroids Table */}
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Cluster ID</th>
                    <th className="py-2 px-3">Persona Classification</th>
                    <th className="py-2 px-3 text-right">Recency (Days)</th>
                    <th className="py-2 px-3 text-right">Frequency (Orders)</th>
                    <th className="py-2 px-3 text-right">Monetary ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 tabular-nums text-slate-300">
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-emerald-400 font-bold">Cluster 0</td>
                    <td className="py-2 px-3 font-sans text-white">High-Value VIPs</td>
                    <td className="py-2 px-3 text-right">14.2d</td>
                    <td className="py-2 px-3 text-right">18.4</td>
                    <td className="py-2 px-3 text-right text-emerald-400">$21,840</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-cyan-400 font-bold">Cluster 1</td>
                    <td className="py-2 px-3 font-sans text-white">Loyal Champions</td>
                    <td className="py-2 px-3 text-right">24.6d</td>
                    <td className="py-2 px-3 text-right">11.8</td>
                    <td className="py-2 px-3 text-right text-cyan-400">$9,420</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-amber-400 font-bold">Cluster 2</td>
                    <td className="py-2 px-3 font-sans text-white">At-Risk Churn Danger</td>
                    <td className="py-2 px-3 text-right text-amber-400">146.8d</td>
                    <td className="py-2 px-3 text-right">14.2</td>
                    <td className="py-2 px-3 text-right text-amber-400">$16,400</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-purple-400 font-bold">Cluster 3</td>
                    <td className="py-2 px-3 font-sans text-white">Hibernating / Attention</td>
                    <td className="py-2 px-3 text-right">195.4d</td>
                    <td className="py-2 px-3 text-right">3.8</td>
                    <td className="py-2 px-3 text-right text-purple-400">$2,750</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Silhouette Coefficient: <strong className="text-emerald-400">0.684</strong> · Calinski-Harabasz Score: <strong className="text-white">1,482.1</strong>
            </div>
          </div>
        </div>

        {/* Cell 4: Churn Prediction & Feature Importance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-amber-400">In [{executedCells.cell4 ? '4' : ' '}]</span>
              <span className="text-slate-400">04_churn_risk_feature_importance.py</span>
            </div>
            <button
              onClick={() => runCell('cell4')}
              disabled={executing === 'cell4'}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span>Run</span>
            </button>
          </div>

          <div className="p-4 bg-slate-950/70 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto">
            <span className="text-slate-500"># Define churn definition threshold: Inactive past {churnCutoffDays} days</span><br />
            rfm[<span className="text-emerald-300">'is_churn'</span>] = (rfm[<span className="text-emerald-300">'recency'</span>] &gt; {churnCutoffDays}).astype(int)<br />
            <br />
            features = [<span className="text-emerald-300">'recency'</span>, <span className="text-emerald-300">'frequency'</span>, <span className="text-emerald-300">'monetary'</span>, <span className="text-emerald-300">'discount_affinity'</span>, <span className="text-emerald-300">'return_rate'</span>]<br />
            clf = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)<br />
            clf.fit(X_train, y_train)<br />
            <br />
            importances = pd.Series(clf.feature_importances_, index=features).sort_values(ascending=False)<br />
            print(<span className="text-emerald-300">"Model ROC-AUC Score: 0.912"</span>)
          </div>

          {executedCells.cell4 && (
            <div className="p-4 bg-slate-950 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Random Forest Churn Feature Importances (MDI)</span>
                <span className="text-xs text-emerald-400 font-mono">ROC-AUC: 0.912 · F1: 0.884</span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { name: 'Purchase Recency (Days Inactive)', weight: 42.4, color: 'bg-amber-400' },
                  { name: 'Cadence (Days Between Orders)', weight: 24.1, color: 'bg-cyan-400' },
                  { name: 'Discount Affinity Rate %', weight: 16.8, color: 'bg-purple-400' },
                  { name: 'Return / Refund Frequency', weight: 11.2, color: 'bg-red-400' },
                  { name: 'Average Basket Depth', weight: 5.5, color: 'bg-slate-400' }
                ].map((feat) => (
                  <div key={feat.name} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">{feat.name}</span>
                      <span className="font-mono text-slate-200">{feat.weight}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div style={{ width: `${feat.weight}%` }} className={`h-full ${feat.color}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cell 5: Cohort Retention Heatmap Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-amber-400">In [{executedCells.cell5 ? '5' : ' '}]</span>
              <span className="text-slate-400">05_cohort_retention_heatmap.py</span>
            </div>
            <button
              onClick={() => runCell('cell5')}
              disabled={executing === 'cell5'}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span>Run</span>
            </button>
          </div>

          <div className="p-4 bg-slate-950/70 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto">
            <span className="text-slate-500"># Generate Seaborn triangular cohort survivorship matrix</span><br />
            cohort_matrix = df_orders.pivot_table(index=<span className="text-emerald-300">'cohort_month'</span>, columns=<span className="text-emerald-300">'period_month'</span>, values=<span className="text-emerald-300">'customer_id'</span>, aggfunc=<span className="text-emerald-300">'nunique'</span>)<br />
            retention_rate = cohort_matrix.divide(cohort_matrix.iloc[:, 0], axis=0) * 100<br />
            plt.figure(figsize=(12, 6))<br />
            sns.heatmap(retention_rate, annot=True, fmt=<span className="text-emerald-300">'.0f'</span>, cmap=<span className="text-emerald-300">'YlGnBu'</span>)
          </div>

          {/* Seaborn Heatmap Table Output */}
          <div className="p-4 bg-slate-950 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Monthly Cohort Retention Matrix (% Surviving Active)</span>
              <span className="text-[11px] text-slate-400 font-mono">12 Cohorts Tracked</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-[11px] font-mono">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-1.5 px-2 text-left">Cohort</th>
                    <th className="py-1.5 px-2">Size</th>
                    <th className="py-1.5 px-2">M0</th>
                    <th className="py-1.5 px-2">M1</th>
                    <th className="py-1.5 px-2">M2</th>
                    <th className="py-1.5 px-2">M3</th>
                    <th className="py-1.5 px-2">M4</th>
                    <th className="py-1.5 px-2">M5</th>
                    <th className="py-1.5 px-2">M6</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {COHORT_DATA.slice(0, 7).map((c) => (
                    <tr key={c.cohortMonth}>
                      <td className="py-1.5 px-2 text-left font-sans text-slate-300">{c.cohortMonth}</td>
                      <td className="py-1.5 px-2 text-slate-400">{c.initialCustomers}</td>
                      <td className="py-1.5 px-2 bg-emerald-950/60 text-emerald-300 font-bold">{c.retention[0]}%</td>
                      <td className="py-1.5 px-2 bg-emerald-900/40 text-emerald-400">{c.retention[1]}%</td>
                      <td className="py-1.5 px-2 bg-teal-900/30 text-teal-300">{c.retention[2]}%</td>
                      <td className="py-1.5 px-2 bg-cyan-900/20 text-cyan-300">{c.retention[3]}%</td>
                      <td className="py-1.5 px-2 bg-cyan-950/20 text-slate-400">{c.retention[4] || '-'}%</td>
                      <td className="py-1.5 px-2 text-slate-500">{c.retention[5] || '-'}%</td>
                      <td className="py-1.5 px-2 text-slate-600">{c.retention[6] || '-'}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-slate-400 pt-1">
              Key finding: Month 1 to Month 2 shows the steepest decay (52% &rarr; 44%); implementing targeted 30-day cross-sell stabilizes baseline retention by +6.8%.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
