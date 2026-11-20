import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const SentimentDistributionChart = ({ sentimentSummary }) => {
  const data = [
    { name: 'Positive', value: sentimentSummary?.positive || 0, color: '#10B981' },
    { name: 'Negative', value: sentimentSummary?.negative || 0, color: '#F43F5E' },
    { name: 'Neutral', value: sentimentSummary?.neutral || 0, color: '#0EA5E9' },
    { name: 'Mixed', value: sentimentSummary?.mixed || 0, color: '#A855F7' },
  ].filter(d => d.value > 0);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-surface-card rounded-2xl border border-surface-border p-5 shadow-card flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary tracking-tight">Sentiment Breakdown</h3>
          <p className="text-xs text-text-secondary">Distribution across all reviews</p>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200 font-tabular">
          {total} classified
        </span>
      </div>

      <div className="flex-1 min-h-[200px] relative flex items-center justify-center">
        {total === 0 ? (
          <div className="text-xs text-text-secondary">No sentiment data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={78}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name) => [`${val} reviews (${total > 0 ? Math.round((val/total)*100) : 0}%)`, name]}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#EAE8E4',
                  borderRadius: '12px',
                  color: '#1C1917',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.08)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-surface-border mt-auto">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50/80 border border-stone-200/60 hover:bg-stone-100/80 transition-colors">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <span className="font-semibold text-text-primary font-tabular">
              {item.value} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentimentDistributionChart;
