import { Customer, CustomerSegment } from '../types/analytics';

export interface SegmentSummary {
  segment: CustomerSegment;
  count: number;
  customerPct: number;
  totalRevenue: number;
  revenuePct: number;
  avgRecencyDays: number;
  avgFrequency: number;
  avgMonetary: number;
  avgAov: number;
  avgChurnRisk: number;
  color: string;
  badgeBg: string;
  badgeText: string;
  strategyTitle: string;
  recommendedTactics: string[];
  recommendedChannel: string;
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
}

export function computeSegmentSummaries(customers: Customer[]): SegmentSummary[] {
  const totalCustomers = customers.length;
  const totalRevenueAll = customers.reduce((acc, c) => acc + c.monetary, 0);

  const segmentConfig: Record<CustomerSegment, {
    color: string;
    badgeBg: string;
    badgeText: string;
    strategyTitle: string;
    recommendedTactics: string[];
    recommendedChannel: string;
    urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  }> = {
    'High-Value VIP': {
      color: '#10b981', // Emerald
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      badgeText: 'text-emerald-400',
      strategyTitle: 'White-Glove VIP Concierge & Early Access',
      recommendedTactics: [
        'Dedicated account concierge & zero-friction 24/7 priority support',
        'Early product launch previews & exclusive invite-only member drops',
        'Complimentary next-day freight shipping without order minimums',
        'Avoid blanket discount erosion; reward with premium experiential gifts'
      ],
      recommendedChannel: 'Direct Account Executive / Personalized Email',
      urgency: 'Low'
    },
    'Loyal Champions': {
      color: '#06b6d4', // Cyan
      badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      badgeText: 'text-cyan-400',
      strategyTitle: 'Tiered Loyalty Progression & Advocacy',
      recommendedTactics: [
        'Gamified tier progression with milestone reward accelerators',
        'Review and community referral incentives ($50 mutual credits)',
        'Personalized category recommendations based on repeat purchase history',
        'Annual anniversary gift pack with co-branded merchandise'
      ],
      recommendedChannel: 'Automated Lifecycle Email + Mobile App Push',
      urgency: 'Medium'
    },
    'Potential Loyalists': {
      color: '#3b82f6', // Blue
      badgeBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      badgeText: 'text-blue-400',
      strategyTitle: 'Cross-Sell Bundling & 2nd/3rd Order Velocity',
      recommendedTactics: [
        'Contextual accessory cross-sell triggers within 14 days of receipt',
        'Time-sensitive second purchase incentive (15% off complementary catalog)',
        'Educational onboarding guides demonstrating high-ROI product utility',
        'Customer satisfaction check-in surveys to preempt early churn'
      ],
      recommendedChannel: 'Targeted Drip Sequence + In-App Slices',
      urgency: 'Medium'
    },
    'At-Risk / Churn Danger': {
      color: '#f59e0b', // Amber
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      badgeText: 'text-amber-400',
      strategyTitle: 'Proactive High-Value Win-Back Intervention',
      recommendedTactics: [
        'Immediate outreach to accounts inactive > 90 days with $10K+ lifetime spend',
        'Exclusive "We Miss You" win-back package with $150 credit on $500+',
        'Personalized check-in from Regional Director to unearth service friction',
        'Survey asking if product lines or procurement cycles have changed'
      ],
      recommendedChannel: 'Executive Outreach + Priority Direct Mail Voucher',
      urgency: 'Critical'
    },
    'Hibernating / Attention': {
      color: '#a855f7', // Purple
      badgeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      badgeText: 'text-purple-400',
      strategyTitle: 'Re-Engagement Campaign & Clearance Catalog',
      recommendedTactics: [
        'Automated 3-stage re-activation sequence with escalating value',
        'Feature newly released seasonal collections & clearance flash sales',
        'Subscription or replenishment reminder based on estimated wear cycle',
        'Unsubscribe clean-up audit if inactive past 270 days to protect deliverability'
      ],
      recommendedChannel: 'Email Marketing Blast + Retargeting Ads',
      urgency: 'High'
    },
    'Lost / Inactive': {
      color: '#ef4444', // Red
      badgeBg: 'bg-red-500/10 border-red-500/30 text-red-400',
      badgeText: 'text-red-400',
      strategyTitle: 'Low-Cost Sunset Audit & Exit Intelligence',
      recommendedTactics: [
        'One-time annual win-back blowout promo (aggressive margin breakeven)',
        'Exit inquiry: "Why did you stop purchasing? Help us improve"',
        'Suppress from high-cost paid audience lists to avoid ad waste',
        'Archive records to clean CRM and preserve analytical hygiene'
      ],
      recommendedChannel: 'Automated Sunset Email / Programmatic Audience Exclusion',
      urgency: 'Low'
    }
  };

  const segments: CustomerSegment[] = [
    'High-Value VIP',
    'Loyal Champions',
    'Potential Loyalists',
    'At-Risk / Churn Danger',
    'Hibernating / Attention',
    'Lost / Inactive'
  ];

  return segments.map(seg => {
    const list = customers.filter(c => c.segment === seg);
    const count = list.length;
    const totalRev = list.reduce((a, b) => a + b.monetary, 0);
    const avgRecency = count > 0 ? Math.round(list.reduce((a, b) => a + b.recencyDays, 0) / count) : 0;
    const avgFreq = count > 0 ? +(list.reduce((a, b) => a + b.frequency, 0) / count).toFixed(1) : 0;
    const avgMon = count > 0 ? Math.round(totalRev / count) : 0;
    const avgAov = count > 0 ? Math.round(list.reduce((a, b) => a + b.aov, 0) / count) : 0;
    const avgChurn = count > 0 ? Math.round(list.reduce((a, b) => a + b.churnRisk, 0) / count) : 0;
    const conf = segmentConfig[seg];

    return {
      segment: seg,
      count,
      customerPct: totalCustomers > 0 ? +(count / totalCustomers * 100).toFixed(1) : 0,
      totalRevenue: totalRev,
      revenuePct: totalRevenueAll > 0 ? +(totalRev / totalRevenueAll * 100).toFixed(1) : 0,
      avgRecencyDays: avgRecency,
      avgFrequency: avgFreq,
      avgMonetary: avgMon,
      avgAov: avgAov,
      avgChurnRisk: avgChurn,
      ...conf
    };
  });
}

export interface SimulationResult {
  segmentName: string;
  totalSegmentCustomers: number;
  totalSegmentRevenue: number;
  winBackTargetPct: number;
  campaignBudget: number;
  reActivatedCustomers: number;
  recoveredRevenue: number;
  grossMarginPct: number;
  incrementalProfit: number;
  netCampaignProfit: number;
  roiMultiplier: number;
  breakEvenCustomers: number;
}

export function simulateRetentionCampaign(
  segment: CustomerSegment,
  customers: Customer[],
  winBackTargetPct: number = 25,
  campaignBudget: number = 5000,
  averageReactivationOrderValue?: number
): SimulationResult {
  const targetCustomers = customers.filter(c => c.segment === segment);
  const count = targetCustomers.length;
  const totalRev = targetCustomers.reduce((acc, c) => acc + c.monetary, 0);
  const avgAov = averageReactivationOrderValue || (count > 0 ? Math.round(totalRev / Math.max(1, targetCustomers.reduce((a, b) => a + b.frequency, 0))) : 850);
  
  const reActivatedCustomers = Math.round(count * (winBackTargetPct / 100));
  // High value customers typically repeat multiple times post re-activation (1.8x multiplier)
  const recoveredRevenue = reActivatedCustomers * avgAov * 1.8;
  const grossMarginPct = 24.5; // Average retail margin
  const incrementalProfit = recoveredRevenue * (grossMarginPct / 100);
  const netCampaignProfit = incrementalProfit - campaignBudget;
  const roiMultiplier = campaignBudget > 0 ? +(incrementalProfit / campaignBudget).toFixed(2) : 0;
  const marginPerCust = avgAov * 1.8 * (grossMarginPct / 100);
  const breakEvenCustomers = marginPerCust > 0 ? Math.ceil(campaignBudget / marginPerCust) : 0;

  return {
    segmentName: segment,
    totalSegmentCustomers: count,
    totalSegmentRevenue: totalRev,
    winBackTargetPct,
    campaignBudget,
    reActivatedCustomers,
    recoveredRevenue: Math.round(recoveredRevenue),
    grossMarginPct,
    incrementalProfit: Math.round(incrementalProfit),
    netCampaignProfit: Math.round(netCampaignProfit),
    roiMultiplier,
    breakEvenCustomers
  };
}
