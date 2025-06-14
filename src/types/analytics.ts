
export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{ path: string; views: number }>;
  deviceTypes: Array<{ type: string; count: number }>;
  errors: Array<{ message: string; count: number; lastOccurred: Date }>;
}

export interface Recommendation {
  id: string;
  type: 'performance' | 'seo' | 'usability' | 'content';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  implemented: boolean;
}
