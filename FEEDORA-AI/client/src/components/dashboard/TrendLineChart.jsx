import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const TrendLineChart = ({ trends }) => {
  const chartData = (trends && trends.length > 0)
    ? trends.map(t => ({
        period: t.period,
        rating: t.avgRating,
        reviews: t.total,
        positive: t.positive,
        negative: t.negative
      }))
    : [];

  return (
    <div className="bg-surface-card rounded-2xl border border-surface-border p-5 shadow-card flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-text-primary tracking-tight">Review Volume & Sentiment Trend</h3>
          <p className="text-xs text-text-secondary">Chronological review influx over time</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-text-secondary font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            Total Volume
          </span>
          <span className="flex items-center gap-1.5 text-text-secondary font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            Positive
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-[220px]">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-text-secondary">
            Insufficient date range for time series trend
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="totalVolumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E05638" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#E05638" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="posSentimentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE8E4" />
              <XAxis dataKey="period" stroke="#78716C" fontSize={11} tickLine={false} />
              <YAxis stroke="#78716C" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#EAE8E4',
                  borderRadius: '12px',
                  color: '#1C1917',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.08)'
                }}
              />
              <Area type="monotone" dataKey="reviews" name="Total Reviews" stroke="#E05638" strokeWidth={2} fillOpacity={1} fill="url(#totalVolumeGradient)" />
              <Area type="monotone" dataKey="positive" name="Positive" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#posSentimentGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TrendLineChart;
