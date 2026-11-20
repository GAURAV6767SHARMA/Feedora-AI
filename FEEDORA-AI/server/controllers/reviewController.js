import Review from '../models/Review.js';
import Business from '../models/Business.js';
import { reviewInputSchema } from '../utils/validators.js';
import { parseReviewsCsv, computeNormalizedHash } from '../utils/csvParser.js';
import { generateOwnerReply, fallbackAnalyzeReviews } from '../services/geminiService.js';

export const uploadReviewsCsv = async (req, res, next) => {
  try {
    const businessId = req.body.businessId || req.query.businessId;
    if (!businessId) {
      return res.status(400).json({ success: false, error: 'businessId is required' });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, error: 'No CSV file uploaded' });
    }

    const csvContent = req.file.buffer.toString('utf-8');

    // Fetch existing hashes for duplicate detection
    const existingReviews = await Review.find({ businessId }).select('normalizedTextHash').exec();
    const existingHashes = new Set(existingReviews.map(r => r.normalizedTextHash).filter(Boolean));

    const parseResult = parseReviewsCsv(csvContent, existingHashes);

    if (parseResult.items.length > 0) {
      const itemsToInsert = parseResult.items.map(item => ({
        ...item,
        businessId
      }));
      await Review.insertMany(itemsToInsert);
    }

    res.status(201).json({
      success: true,
      message: `CSV processing complete. ${parseResult.importedCount} reviews imported.`,
      data: {
        importedCount: parseResult.importedCount,
        rejectedCount: parseResult.rejectedCount,
        duplicatesCount: parseResult.duplicatesCount,
        validationErrors: parseResult.errors
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const validated = reviewInputSchema.parse(req.body);
    const hash = computeNormalizedHash(validated.reviewText);

    // Duplicate check
    const existing = await Review.findOne({ businessId: validated.businessId, normalizedTextHash: hash });
    if (existing) {
      return res.status(409).json({ success: false, error: 'This review has already been submitted for this business.' });
    }

    const newReview = await Review.create({
      ...validated,
      normalizedTextHash: hash,
      date: validated.date ? new Date(validated.date) : new Date(),
      analysisStatus: 'pending'
    });

    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const { businessId, search, sentiment, topic, source, page = 1, limit = 20, sort = 'newest' } = req.query;

    if (!businessId) {
      return res.status(400).json({ success: false, error: 'businessId is required' });
    }

    const query = { businessId };

    if (sentiment && sentiment !== 'all') {
      query.sentiment = sentiment;
    }

    if (source && source !== 'all') {
      query.source = source;
    }

    let allMatches = await Review.find(query).exec();

    // In-memory text search if provided
    if (search && search.trim()) {
      const s = search.toLowerCase();
      allMatches = allMatches.filter(r => (r.reviewText || '').toLowerCase().includes(s));
    }

    // In-memory topic filter if provided
    if (topic && topic !== 'all') {
      allMatches = allMatches.filter(r => 
        Array.isArray(r.topics) && r.topics.some(t => t.name?.toLowerCase().includes(topic.toLowerCase()))
      );
    }

    // Sorting
    allMatches.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt).getTime();
      const dateB = new Date(b.date || b.createdAt).getTime();
      if (sort === 'oldest') return dateA - dateB;
      if (sort === 'highest') return (b.rating || 0) - (a.rating || 0);
      if (sort === 'lowest') return (a.rating || 0) - (b.rating || 0);
      return dateB - dateA; // default newest
    });

    const total = allMatches.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = allMatches.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: paginated,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }
    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const draftReviewReply = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tone } = req.body;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    const business = await Business.findById(review.businessId);
    const replyData = await generateOwnerReply({
      reviewText: review.reviewText,
      rating: review.rating,
      sentiment: review.sentiment,
      customerName: review.customerName || 'Customer',
      businessName: business?.name || 'Our Team',
      tone: tone || 'Empathetic & Solution-Oriented'
    });

    res.json({ success: true, data: replyData });
  } catch (error) {
    next(error);
  }
};

export const saveReviewReply = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ownerReply } = req.body;
    if (!ownerReply || !ownerReply.trim()) {
      return res.status(400).json({ success: false, error: 'Reply text is required' });
    }

    const updated = await Review.findByIdAndUpdate(id, {
      ownerReply: ownerReply.trim(),
      ownerRepliedAt: new Date()
    }, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    res.json({ success: true, message: 'Reply saved successfully', data: updated });
  } catch (error) {
    next(error);
  }
};

export const submitPublicReview = async (req, res, next) => {
  try {
    const { businessId, customerName, rating, reviewText } = req.body;
    if (!businessId || !reviewText || !rating) {
      return res.status(400).json({ success: false, error: 'businessId, rating, and reviewText are required' });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found' });
    }

    const hash = computeNormalizedHash(reviewText);
    const existing = await Review.findOne({ businessId, normalizedTextHash: hash });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Thank you! You have already submitted this review.' });
    }

    // Immediate real-time analysis
    const analyzed = fallbackAnalyzeReviews([{
      _id: 'temp',
      reviewText,
      rating: parseInt(rating, 10)
    }])[0];

    const newReview = await Review.create({
      businessId,
      customerName: (customerName || 'Verified Guest').trim(),
      reviewText: reviewText.trim(),
      rating: parseInt(rating, 10),
      source: 'QR Table Feedback',
      normalizedTextHash: hash,
      sentiment: analyzed.sentiment,
      language: analyzed.language,
      topics: analyzed.topics,
      complaints: analyzed.complaints,
      preferences: analyzed.preferences,
      featureRequests: analyzed.featureRequests,
      demandSignals: analyzed.demandSignals,
      urgency: rating <= 2 ? 'high' : 'low',
      analysisStatus: 'analyzed',
      date: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! The management team has received your thoughts.',
      data: newReview
    });
  } catch (error) {
    next(error);
  }
};

export const getUrgentReviews = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const all = await Review.find({ businessId }).sort({ date: -1 }).exec();
    const urgent = all.filter(r => (r.rating <= 2 || r.urgency === 'critical' || r.urgency === 'high') && !r.ownerReply);
    res.json({ success: true, data: urgent });
  } catch (error) {
    next(error);
  }
};

