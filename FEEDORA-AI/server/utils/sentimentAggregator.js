export const aggregateSentiment = (reviews = []) => {
  const total = reviews.length;
  if (total === 0) {
    return {
      total: 0,
      averageRating: 0,
      sentimentSummary: {
        positive: 0,
        negative: 0,
        neutral: 0,
        mixed: 0,
        unprocessed: 0,
        positivePercent: 0,
        negativePercent: 0,
        neutralPercent: 0,
        mixedPercent: 0
      },
      topTopics: [],
      topComplaints: [],
      topPreferences: [],
      monthlyTrends: []
    };
  }

  let ratingSum = 0;
  const sentimentCounts = {
    positive: 0,
    negative: 0,
    neutral: 0,
    mixed: 0,
    unprocessed: 0
  };

  const topicMap = new Map();
  const complaintMap = new Map();
  const preferenceMap = new Map();
  const dateBucketMap = new Map();

  for (const r of reviews) {
    ratingSum += (r.rating || 0);

    const sent = r.sentiment || 'unprocessed';
    if (sentimentCounts[sent] !== undefined) {
      sentimentCounts[sent]++;
    } else {
      sentimentCounts.neutral++;
    }

    // Topics aggregation
    if (Array.isArray(r.topics)) {
      for (const t of r.topics) {
        if (!t.name) continue;
        const key = t.name.trim();
        if (!topicMap.has(key)) {
          topicMap.set(key, { count: 0, positive: 0, negative: 0, neutral: 0 });
        }
        const item = topicMap.get(key);
        item.count++;
        if (t.sentiment === 'positive') item.positive++;
        else if (t.sentiment === 'negative') item.negative++;
        else item.neutral++;
      }
    }

    // Complaints aggregation
    if (Array.isArray(r.complaints)) {
      for (const c of r.complaints) {
        if (!c || c.trim().length === 0) continue;
        const key = c.trim();
        if (!complaintMap.has(key)) {
          complaintMap.set(key, { count: 0, evidence: [] });
        }
        const item = complaintMap.get(key);
        item.count++;
        if (item.evidence.length < 3 && r.reviewText) {
          item.evidence.push(r.reviewText);
        }
      }
    }

    // Preferences aggregation
    if (Array.isArray(r.preferences)) {
      for (const p of r.preferences) {
        if (!p || p.trim().length === 0) continue;
        const key = p.trim();
        if (!preferenceMap.has(key)) {
          preferenceMap.set(key, { count: 0, evidence: [] });
        }
        const item = preferenceMap.get(key);
        item.count++;
        if (item.evidence.length < 3 && r.reviewText) {
          item.evidence.push(r.reviewText);
        }
      }
    }

    // Time-based aggregation (by Month-Year)
    const reviewDate = r.date ? new Date(r.date) : new Date(r.createdAt || Date.now());
    const yearMonth = `${reviewDate.getFullYear()}-${String(reviewDate.getMonth() + 1).padStart(2, '0')}`;
    if (!dateBucketMap.has(yearMonth)) {
      dateBucketMap.set(yearMonth, {
        period: yearMonth,
        total: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
        mixed: 0,
        ratingSum: 0
      });
    }
    const bucket = dateBucketMap.get(yearMonth);
    bucket.total++;
    bucket.ratingSum += (r.rating || 0);
    if (sent === 'positive') bucket.positive++;
    else if (sent === 'negative') bucket.negative++;
    else if (sent === 'mixed') bucket.mixed++;
    else bucket.neutral++;
  }

  const averageRating = Number((ratingSum / total).toFixed(2));

  const positivePercent = Math.round((sentimentCounts.positive / total) * 100);
  const negativePercent = Math.round((sentimentCounts.negative / total) * 100);
  const neutralPercent = Math.round((sentimentCounts.neutral / total) * 100);
  const mixedPercent = Math.round((sentimentCounts.mixed / total) * 100);

  // Format top topics
  const topTopics = Array.from(topicMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Format top complaints
  const topComplaints = Array.from(complaintMap.entries())
    .map(([category, data]) => ({ category, count: data.count, sampleEvidence: data.evidence }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Format top preferences
  const topPreferences = Array.from(preferenceMap.entries())
    .map(([item, data]) => ({ item, count: data.count, sampleEvidence: data.evidence }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Format chronological trends
  const monthlyTrends = Array.from(dateBucketMap.values())
    .sort((a, b) => a.period.localeCompare(b.period))
    .map(b => ({
      ...b,
      avgRating: Number((b.ratingSum / (b.total || 1)).toFixed(2))
    }));

  return {
    total,
    averageRating,
    sentimentSummary: {
      ...sentimentCounts,
      positivePercent,
      negativePercent,
      neutralPercent,
      mixedPercent
    },
    topTopics,
    topComplaints,
    topPreferences,
    monthlyTrends
  };
};
