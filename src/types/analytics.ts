export type CustomerSegment = 
  | 'High-Value VIP' 
  | 'Loyal Champions' 
  | 'Potential Loyalists' 
  | 'At-Risk / Churn Danger' 
  | 'Hibernating / Attention' 
  | 'Lost / Inactive';

export interface Customer {
  id: string;
  name: string;
  email: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central';
  segment: CustomerSegment;
  recencyDays: number;
  frequency: number;
  monetary: number;
  aov: number;
  rScore: number; // 1-5
  fScore: number; // 1-5
  mScore: number; // 1-5
  rfmScore: string; // e.g. "555", "144"
  firstOrderDate: string;
  lastOrderDate: string;
  churnRisk: number; // 0-100%
  preferredCategory: string;
  discountAffinity: number; // %
  returnRate: number; // %
}

export interface Order {
  id: string;
  orderDate: string;
  customerId: string;
  customerName: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central';
  category: 'Electronics' | 'Furniture' | 'Office Supplies' | 'Apparel' | 'Home & Living';
  subCategory: string;
  productName: string;
  sales: number;
  profit: number;
  marginPercent: number;
  quantity: number;
  discount: number;
  shippingMode: 'Same Day' | 'First Class' | 'Second Class' | 'Standard Class';
  shippingDays: number;
  returned: boolean;
}

export interface RegionSummary {
  region: 'North' | 'South' | 'East' | 'West' | 'Central';
  sales: number;
  profit: number;
  marginPercent: number;
  customers: number;
  orders: number;
  avgShippingDays: number;
  targetAchievement: number; // %
}

export interface MonthlyTrend {
  month: string;
  monthLabel: string;
  sales: number;
  profit: number;
  orders: number;
  targetSales: number;
  customers: number;
}

export interface CohortRow {
  cohortMonth: string;
  initialCustomers: number;
  retention: number[]; // Retention percentages for months 0 through 11
}

export interface FilterState {
  dateRange: 'All' | '2025' | '2026' | 'Last 90 Days' | 'Last 180 Days';
  region: string; // 'All' or specific region
  category: string; // 'All' or specific category
  segment: string; // 'All' or specific segment
  searchQuery: string;
}

export interface SQLQueryTemplate {
  id: string;
  name: string;
  description: string;
  sql: string;
}

export interface NotebookCell {
  id: string;
  type: 'code' | 'markdown';
  executionCount?: number;
  code?: string;
  markdown?: string;
  outputType?: 'dataframe' | 'chart' | 'text' | 'metrics';
  outputData?: any;
}
