import { z } from 'zod';

export const businessCreateSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters').max(100),
  category: z.enum(['restaurant', 'salon', 'clothing', 'cafe', 'retail', 'services', 'other']).default('restaurant'),
  description: z.string().max(500).optional().default(''),
  location: z.string().max(100).optional().default('Bangalore, India'),
  preferredLanguage: z.enum(['English', 'Hindi', 'Hinglish']).default('English'),
  ownerId: z.string().optional().default('demo-owner-1')
});

export const businessUpdateSchema = businessCreateSchema.partial();

export const reviewInputSchema = z.object({
  businessId: z.string().min(1, 'Business ID is required'),
  reviewText: z.string().min(3, 'Review text must be at least 3 characters').max(3000),
  rating: z.number().int().min(1).max(5),
  date: z.string().or(z.date()).optional(),
  source: z.string().optional().default('Manual Entry'),
  language: z.string().optional().default('English')
});

export const aiReviewItemSchema = z.object({
  reviewId: z.string(),
  sentiment: z.enum(['positive', 'negative', 'neutral', 'mixed']),
  language: z.string().default('English'),
  topics: z.array(z.object({
    name: z.string(),
    sentiment: z.string(),
    evidence: z.string().optional().default('')
  })).default([]),
  complaints: z.array(z.string()).default([]),
  preferences: z.array(z.string()).default([]),
  featureRequests: z.array(z.string()).default([]),
  demandSignals: z.array(z.string()).default([])
});

export const marketingGenerateSchema = z.object({
  businessId: z.string().min(1, 'Business ID is required'),
  platform: z.enum(['Instagram', 'WhatsApp', 'Facebook', 'SMS', 'Reels']).default('Instagram'),
  language: z.enum(['English', 'Hindi', 'Hinglish']).default('English'),
  tone: z.string().default('Warm & Engaging'),
  objective: z.string().min(3, 'Objective is required'),
  selectedInsight: z.string().optional()
});

export const campaignUpdateSchema = z.object({
  caption: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'saved', 'scheduled', 'published']).optional()
});

export const recommendationUpdateSchema = z.object({
  status: z.enum(['pending', 'in-progress', 'completed'])
});
