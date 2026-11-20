import React from 'react';
import StatCard from '../common/StatCard';
import { MessageSquare, Star, Smile, Frown, Meh, Split } from 'lucide-react';

export const MetricsGrid = ({ summary }) => {
  const total = summary?.total || 0;
  const avgRating = summary?.averageRating || 0;
  const pos = summary?.sentimentSummary?.positivePercent || 0;
  const neg = summary?.sentimentSummary?.negativePercent || 0;
  const neu = summary?.sentimentSummary?.neutralPercent || 0;
  const mix = summary?.sentimentSummary?.mixedPercent || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard
        title="Total Reviews"
        value={total.toLocaleString()}
        subtitle="Analyzed corpus"
        icon={MessageSquare}
        color="blue"
      />
      <StatCard
        title="Avg Rating"
        value={`${avgRating.toFixed(1)} ★`}
        subtitle="Overall customer score"
        icon={Star}
        color="amber"
      />
      <StatCard
        title="Positive"
        value={`${pos}%`}
        subtitle={`${summary?.sentimentSummary?.positive || 0} reviews`}
        icon={Smile}
        color="green"
        trend={{
          text: '+12%',
          isPositive: true
        }}
      />
      <StatCard
        title="Negative"
        value={`${neg}%`}
        subtitle={`${summary?.sentimentSummary?.negative || 0} reviews`}
        icon={Frown}
        color="red"
        trend={{
          text: '-5%',
          isPositive: false
        }}
      />
      <StatCard
        title="Neutral"
        value={`${neu}%`}
        subtitle={`${summary?.sentimentSummary?.neutral || 0} reviews`}
        icon={Meh}
        color="teal"
      />
      <StatCard
        title="Mixed"
        value={`${mix}%`}
        subtitle={`${summary?.sentimentSummary?.mixed || 0} reviews`}
        icon={Split}
        color="indigo"
      />
    </div>
  );
};

export default MetricsGrid;
