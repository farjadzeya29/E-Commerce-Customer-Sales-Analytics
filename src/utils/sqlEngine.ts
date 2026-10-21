import { INITIAL_CUSTOMERS, INITIAL_ORDERS, REGION_SUMMARIES, CATEGORY_BREAKDOWN, COHORT_DATA } from '../data/mockData';

export interface QueryResult {
  columns: string[];
  rows: (string | number | boolean | null)[][];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
}

export function executeSQLQuery(sql: string): QueryResult {
  const startTime = performance.now();
  const trimmed = sql.trim().toLowerCase();

  try {
    // 1. Template Match: 01. RFM Quintile Scoring Engine
    if (trimmed.includes('rfm') || (trimmed.includes('ntile(5)') && trimmed.includes('customers'))) {
      const rows = INITIAL_CUSTOMERS.map(c => [
        c.id,
        c.name,
        c.region,
        c.recencyDays,
        c.frequency,
        c.monetary,
        c.rfmScore,
        c.segment
      ]);
      return {
        columns: ['customer_id', 'customer_name', 'region', 'recency_days', 'total_orders', 'total_spend', 'rfm_combined', 'customer_segment'],
        rows,
        rowCount: rows.length,
        executionTimeMs: Math.round(performance.now() - startTime + 14)
      };
    }

    // 2. Template Match: Cohort Retention Matrix
    if (trimmed.includes('cohort') || trimmed.includes('month_0_pct')) {
      const rows = COHORT_DATA.map(c => [
        c.cohortMonth,
        c.initialCustomers,
        `${c.retention[0]}%`,
        c.retention[1] ? `${c.retention[1]}%` : '-',
        c.retention[2] ? `${c.retention[2]}%` : '-',
        c.retention[3] ? `${c.retention[3]}%` : '-',
        c.retention[5] ? `${c.retention[5]}%` : '-',
        c.retention[11] ? `${c.retention[11]}%` : '-'
      ]);
      return {
        columns: ['cohort_group', 'cohort_size', 'month_0_pct', 'month_1_pct', 'month_2_pct', 'month_3_pct', 'month_5_pct', 'month_11_pct'],
        rows,
        rowCount: rows.length,
        executionTimeMs: Math.round(performance.now() - startTime + 8)
      };
    }

    // 3. Template Match: Pareto Product & Category Profitability
    if (trimmed.includes('pareto') || (trimmed.includes('categories') && trimmed.includes('margin'))) {
      const rows = CATEGORY_BREAKDOWN.map(c => [
        c.category,
        `$${c.sales.toLocaleString()}`,
        `$${c.profit.toLocaleString()}`,
        `${c.margin}%`,
        `${c.share}%`,
        `+${c.growth}%`,
        c.topItem
      ]);
      return {
        columns: ['category', 'sales', 'profit', 'margin_pct', 'revenue_share_pct', 'yoy_growth_pct', 'best_seller_sku'],
        rows,
        rowCount: rows.length,
        executionTimeMs: Math.round(performance.now() - startTime + 6)
      };
    }

    // 4. Template Match: Regional Performance & Margin Leakage
    if (trimmed.includes('regions') || (trimmed.includes('region') && trimmed.includes('targetachievement'))) {
      const rows = REGION_SUMMARIES.map(r => [
        r.region,
        `$${r.sales.toLocaleString()}`,
        `$${r.profit.toLocaleString()}`,
        `${r.marginPercent}%`,
        r.customers,
        r.orders,
        `${r.avgShippingDays} days`,
        `${r.targetAchievement}%`
      ]);
      return {
        columns: ['region', 'sales', 'profit', 'profit_margin_pct', 'customers', 'orders', 'avg_shipping_days', 'target_achievement_pct'],
        rows,
        rowCount: rows.length,
        executionTimeMs: Math.round(performance.now() - startTime + 9)
      };
    }

    // 5. Template Match: High-Value At-Risk Churn Identification
    if (trimmed.includes('at-risk') || (trimmed.includes('churnrisk') && trimmed.includes('unrealized_revenue_at_risk'))) {
      const atRisk = INITIAL_CUSTOMERS.filter(c => c.segment === 'At-Risk / Churn Danger' || (c.recencyDays > 90 && c.monetary > 10000));
      const rows = atRisk.map(c => [
        c.id,
        c.name,
        c.email,
        c.region,
        c.recencyDays,
        c.frequency,
        `$${c.monetary.toLocaleString()}`,
        `${c.churnRisk}%`,
        c.preferredCategory,
        `$${Math.round(c.monetary * (c.churnRisk / 100)).toLocaleString()}`
      ]);
      return {
        columns: ['customer_id', 'name', 'email', 'region', 'days_inactive', 'lifetime_orders', 'lifetime_revenue', 'churn_probability_pct', 'preferred_category', 'unrealized_revenue_at_risk'],
        rows,
        rowCount: rows.length,
        executionTimeMs: Math.round(performance.now() - startTime + 11)
      };
    }

    // 6. Generic Table Query Dispatcher
    let dataset: any[] = [];
    if (trimmed.includes('from customers')) {
      dataset = INITIAL_CUSTOMERS;
    } else if (trimmed.includes('from orders')) {
      dataset = INITIAL_ORDERS;
    } else if (trimmed.includes('from regions')) {
      dataset = REGION_SUMMARIES;
    } else if (trimmed.includes('from categories')) {
      dataset = CATEGORY_BREAKDOWN;
    } else {
      // Default to customers table if not recognized
      dataset = INITIAL_CUSTOMERS;
    }

    // Parse simple WHERE filters
    let filtered = [...dataset];
    if (trimmed.includes("where region = 'west'")) {
      filtered = filtered.filter(item => item.region?.toLowerCase() === 'west');
    } else if (trimmed.includes("where region = 'east'")) {
      filtered = filtered.filter(item => item.region?.toLowerCase() === 'east');
    } else if (trimmed.includes("where region = 'south'")) {
      filtered = filtered.filter(item => item.region?.toLowerCase() === 'south');
    } else if (trimmed.includes("where region = 'north'")) {
      filtered = filtered.filter(item => item.region?.toLowerCase() === 'north');
    } else if (trimmed.includes("where region = 'central'")) {
      filtered = filtered.filter(item => item.region?.toLowerCase() === 'central');
    } else if (trimmed.includes("segment = 'high-value vip'")) {
      filtered = filtered.filter(item => item.segment === 'High-Value VIP');
    } else if (trimmed.includes("segment = 'at-risk / churn danger'")) {
      filtered = filtered.filter(item => item.segment === 'At-Risk / Churn Danger');
    }

    if (filtered.length === 0) {
      filtered = dataset.slice(0, 10);
    }

    // Columns
    const keys = Object.keys(filtered[0] || {});
    const rows = filtered.map(item => keys.map(k => {
      const v = item[k];
      if (typeof v === 'number' && k.toLowerCase().includes('monetary') || k.toLowerCase().includes('sales') || k.toLowerCase().includes('profit')) {
        return `$${v.toLocaleString()}`;
      }
      return v;
    }));

    return {
      columns: keys,
      rows,
      rowCount: rows.length,
      executionTimeMs: Math.round(performance.now() - startTime + 12)
    };
  } catch (err: any) {
    return {
      columns: ['error'],
      rows: [[err?.message || 'Syntax or evaluation error']],
      rowCount: 0,
      executionTimeMs: Math.round(performance.now() - startTime),
      error: err?.message || 'Query execution error'
    };
  }
}
