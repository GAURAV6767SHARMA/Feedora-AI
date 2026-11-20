import { test, describe } from 'node:test';
import assert from 'node:assert';
import { parseReviewsCsv, computeNormalizedHash } from '../utils/csvParser.js';
import { aggregateSentiment } from '../utils/sentimentAggregator.js';
import { calculateDemandSignals } from '../utils/demandScorer.js';
import { businessCreateSchema, reviewInputSchema, aiReviewItemSchema } from '../utils/validators.js';

describe('LocalPulse AI Unit Test Suite', () => {

  describe('1. CSV Parsing & Validation', () => {
    test('parses standard valid CSV rows correctly', () => {
      const csv = `review,rating,date\n"Great butter chicken and naan!",5,2024-08-01\n"Slow delivery service.",2,2024-08-02`;
      const result = parseReviewsCsv(csv);
      assert.strictEqual(result.importedCount, 2);
      assert.strictEqual(result.rejectedCount, 0);
      assert.strictEqual(result.duplicatesCount, 0);
      assert.strictEqual(result.items[0].rating, 5);
      assert.strictEqual(result.items[1].rating, 2);
    });

    test('rejects rows with invalid ratings outside 1-5', () => {
      const csv = `review,rating,date\n"Good food",6,2024-08-01\n"Bad food",0,2024-08-02\n"Valid review",4,2024-08-03`;
      const result = parseReviewsCsv(csv);
      assert.strictEqual(result.importedCount, 1);
      assert.strictEqual(result.rejectedCount, 2);
      assert.strictEqual(result.errors.length, 2);
    });

    test('skips empty rows and too short reviews', () => {
      const csv = `review,rating,date\n"Hi",5,2024-08-01\n"",4,2024-08-02\n"Delicious biryani with rich aroma",5,2024-08-03`;
      const result = parseReviewsCsv(csv);
      assert.strictEqual(result.importedCount, 1);
      assert.strictEqual(result.rejectedCount, 2);
    });
  });

  describe('2. Duplicate Review Detection', () => {
    test('computes identical normalized hashes for same content with varying case and spaces', () => {
      const text1 = 'Amazing Butter Chicken & Naan!';
      const text2 = 'amazing  butter chicken & naan! ';
      assert.strictEqual(computeNormalizedHash(text1), computeNormalizedHash(text2));
    });

    test('filters out duplicate reviews within the batch and existing hashes', () => {
      const existing = new Set([computeNormalizedHash('Old existing review')]);
      const csv = `review,rating,date\n"Old existing review",5,2024-08-01\n"New unique review",4,2024-08-02\n"New unique review",4,2024-08-02`;
      const result = parseReviewsCsv(csv, existing);
      assert.strictEqual(result.importedCount, 1);
      assert.strictEqual(result.duplicatesCount, 2);
    });
  });

  describe('3. Sentiment Calculation & Aggregation', () => {
    test('calculates correct percentages and average ratings', () => {
      const reviews = [
        { rating: 5, sentiment: 'positive' },
        { rating: 5, sentiment: 'positive' },
        { rating: 3, sentiment: 'neutral' },
        { rating: 1, sentiment: 'negative' }
      ];
      const agg = aggregateSentiment(reviews);
      assert.strictEqual(agg.total, 4);
      assert.strictEqual(agg.averageRating, 3.5);
      assert.strictEqual(agg.sentimentSummary.positivePercent, 50);
      assert.strictEqual(agg.sentimentSummary.negativePercent, 25);
      assert.strictEqual(agg.sentimentSummary.neutralPercent, 25);
      assert.strictEqual(agg.sentimentSummary.mixedPercent, 0);
    });

    test('aggregates recurring complaints and preferences with evidence', () => {
      const reviews = [
        { reviewText: 'Late delivery by 40 mins', complaints: ['Slow delivery'] },
        { reviewText: 'Food arrived cold, late delivery', complaints: ['Slow delivery'] },
        { reviewText: 'Best dal makhani ever', preferences: ['Dal Makhani'] }
      ];
      const agg = aggregateSentiment(reviews);
      assert.strictEqual(agg.topComplaints.length, 1);
      assert.strictEqual(agg.topComplaints[0].category, 'Slow delivery');
      assert.strictEqual(agg.topComplaints[0].count, 2);
      assert.strictEqual(agg.topPreferences[0].item, 'Dal Makhani');
    });
  });

  describe('4. Demand Radar Scoring Engine', () => {
    test('computes demand score according to 0.4F + 0.3G + 0.3N heuristic', () => {
      const reviews = [
        { _id: '1', reviewText: 'Please introduce vegan dessert options', date: '2024-08-01', featureRequests: ['Vegan Dessert', 'Gluten Free Bread'] },
        { _id: '2', reviewText: 'Loved the food, need vegan dessert', date: '2024-08-05', featureRequests: ['Vegan Dessert'] },
        { _id: '3', reviewText: 'Vegan dessert would be awesome', date: '2024-09-01', featureRequests: ['Vegan Dessert'] },
        { _id: '4', reviewText: 'Can you add vegan dessert?', date: '2024-09-10', featureRequests: ['Vegan Dessert'] },
        { _id: '5', reviewText: 'Need gluten free bread please', date: '2024-09-15', featureRequests: ['Gluten Free Bread'] }
      ];

      const signals = calculateDemandSignals(reviews);
      assert.ok(signals.length >= 1);
      const veganSignal = signals.find(s => s.title.toLowerCase().includes('vegan'));
      assert.ok(veganSignal);
      assert.strictEqual(veganSignal.totalMentions, 4);
      assert.ok(veganSignal.demandScore > 0 && veganSignal.demandScore <= 100);
      assert.ok(veganSignal.supportingReviews.length > 0);
    });
  });

  describe('5. Zod Input & Output Schema Validation', () => {
    test('validates business creation schema', () => {
      const valid = { name: 'Café Nirvana', category: 'cafe', location: 'Goa' };
      const parsed = businessCreateSchema.parse(valid);
      assert.strictEqual(parsed.name, 'Café Nirvana');
      assert.strictEqual(parsed.category, 'cafe');

      assert.throws(() => {
        businessCreateSchema.parse({ name: 'A' }); // name too short
      });
    });

    test('validates AI review output structure', () => {
      const aiOutput = {
        reviewId: 'rev-101',
        sentiment: 'mixed',
        language: 'Hinglish',
        topics: [{ name: 'Food Quality', sentiment: 'positive', evidence: 'Biryani was awesome' }],
        complaints: ['Slow delivery'],
        preferences: ['Biryani'],
        featureRequests: ['Breakfast buffet'],
        demandSignals: ['Breakfast buffet']
      };
      const validated = aiReviewItemSchema.parse(aiOutput);
      assert.strictEqual(validated.sentiment, 'mixed');
      assert.strictEqual(validated.language, 'Hinglish');
    });
  });

  describe('6. Offline Intelligent Fallback Engine', () => {
    test('extracts complaints and preferences from raw customer review text', async () => {
      const { fallbackAnalyzeReviews, generateOwnerReply } = await import('../services/geminiService.js');
      const sampleReviews = [
        {
          reviewText: 'Food was delicious but the delivery was delayed by 45 minutes and soup leaked.',
          rating: 2
        },
        {
          reviewText: 'Best cold coffee and ambience in Indiranagar! Please introduce iced matcha latte.',
          rating: 5
        }
      ];

      const analyzed = fallbackAnalyzeReviews(sampleReviews);
      assert.strictEqual(analyzed.length, 2);
      assert.strictEqual(analyzed[0].sentiment, 'mixed');
      assert.ok(analyzed[0].complaints.length > 0);
      assert.strictEqual(analyzed[1].sentiment, 'positive');
      assert.ok(analyzed[1].demandSignals.length > 0);

      const reply = await generateOwnerReply({
        reviewText: sampleReviews[0].reviewText,
        rating: 2,
        sentiment: 'negative',
        customerName: 'Rahul',
        businessName: 'The Bangalore Bistro',
        tone: 'Empathetic & Solution-Oriented'
      });
      assert.ok(reply.replyText && reply.replyText.length > 20);
      assert.ok(reply.provider);
    });
  });

});
