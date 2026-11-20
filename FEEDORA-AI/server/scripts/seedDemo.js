import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Business from '../models/Business.js';
import Review from '../models/Review.js';
import Recommendation from '../models/Recommendation.js';
import Campaign from '../models/Campaign.js';
import { parseReviewsCsv } from '../utils/csvParser.js';
import { runReviewAnalysis } from '../services/reviewAnalysisService.js';
import { connectDB } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seedInitialDemoIfEmpty = async () => {
  const count = await Review.countDocuments();
  if (count > 0) {
    return;
  }
  console.log('[Seed] Database has 0 reviews. Auto-seeding Demo Businesses and Synthetic Reviews...');
  try {
    await seedDemoData('restaurant');
    await seedDemoData('salon');
    await seedDemoData('clothing');
  } catch (err) {
    console.warn('[Seed] Error during auto-seeding:', err.message);
  }
};

export const seedDemoData = async (datasetType = 'restaurant') => {
  const rootDir = path.resolve(__dirname, '..', '..');
  const csvPath = path.join(rootDir, 'datasets', `${datasetType}.csv`);

  if (!fs.existsSync(csvPath)) {
    throw new Error(`Dataset file not found: ${csvPath}`);
  }

  // Create or retrieve business
  let businessInfo = {
    _id: `demo-${datasetType}-1`,
    ownerId: 'demo-user-1',
    name: 'The Spice Garden Bistro',
    category: 'restaurant',
    description: 'Authentic North Indian family dining bistro specializing in charcoal tandoori, handi curries, and weekend specials.',
    location: 'Indiranagar, Bangalore, India',
    preferredLanguage: 'English',
    isDemo: true
  };

  if (datasetType === 'salon') {
    businessInfo = {
      _id: `demo-${datasetType}-1`,
      ownerId: 'demo-user-1',
      name: 'Luxe Aura Hair & Wellness Studio',
      category: 'salon',
      description: 'Boutique hair styling, skincare rituals, bridal artistry, and luxury spa treatments.',
      location: 'Koramangala, Bangalore, India',
      preferredLanguage: 'English',
      isDemo: true
    };
  } else if (datasetType === 'clothing') {
    businessInfo = {
      _id: `demo-${datasetType}-1`,
      ownerId: 'demo-user-1',
      name: 'Vastra Heritage Boutique',
      category: 'clothing',
      description: 'Artisanal ethnic wear, pure linen casuals, festive silks, and bespoke tailoring.',
      location: 'Jayanagar, Bangalore, India',
      preferredLanguage: 'English',
      isDemo: true
    };
  }

  // Remove legacy placeholder ID if present
  if (datasetType === 'restaurant') {
    await Business.deleteMany({ _id: 'demo-business-1' });
    await Review.deleteMany({ businessId: 'demo-business-1' });
  }

  // Upsert business
  let business = await Business.findById(businessInfo._id);
  if (!business) {
    business = await Business.create(businessInfo);
  }

  // Read CSV and parse
  const csvData = fs.readFileSync(csvPath, 'utf8');
  const parsed = parseReviewsCsv(csvData);

  // Clear existing reviews for this business
  await Review.deleteMany({ businessId: businessInfo._id });

  const reviewsToInsert = parsed.items.map(item => ({
    ...item,
    businessId: businessInfo._id,
    isDemo: true
  }));

  await Review.insertMany(reviewsToInsert);
  console.log(`[Seed] Ingested ${reviewsToInsert.length} reviews for ${businessInfo.name}.`);

  // Run AI analysis
  await runReviewAnalysis(businessInfo._id, true);
  console.log(`[Seed] AI Review Analysis & Demand Scoring completed.`);

  // Create sample recommendations
  await Recommendation.deleteMany({ businessId: businessInfo._id });
  await Recommendation.insertMany([
    {
      businessId: businessInfo._id,
      title: 'Deploy Tamper-Evident Induction Seals & 12-Min Dispatch Buffer',
      pillar: 'Revenue Leakage & Churn Recovery',
      financialImpact: '+₹48,000 / month Net Recovery',
      capitalRequired: '₹4,200 (Foil Liners & Thermal Bags)',
      paybackHorizon: '10 Days',
      effort: 'Quick Win (Immediate ROI)',
      problem: 'Recurring complaints about lukewarm gravies and leaked container lids on Swiggy & Zomato.',
      reason: 'Delivery accounts for ~40% of peak orders. Damaged packaging directly drives 1-star ratings and costly platform refund clawbacks.',
      action: 'Transition all curries to heat-sealed foil containers and enforce a 12-minute kitchen expediting window during peak Friday-Sunday rush.',
      priority: 'high',
      status: 'in-progress',
      expectedOutcome: 'Reduce packaging-related refund claims by 75% and lift delivery ratings from 3.6 to 4.4★.',
      confidence: 'High (Verified across 18 customer reviews)',
      limitations: 'Pack unit cost increases slightly by ₹3.80 per box, offset by eliminated refunds.',
      sopSteps: [
        'Source 500ml and 750ml leak-proof foil-lined containers with airtight locking seals.',
        'Train kitchen expeditor to run 3-point seal check before handing order to courier.',
        'Track 14-day defect rate on merchant platform dashboard.'
      ]
    },
    {
      businessId: businessInfo._id,
      title: 'Launch Weekend Morning Breakfast & Filter Coffee Buffet Pilot',
      pillar: 'Daypart & Capacity Expansion',
      financialImpact: '+₹95,000 / month Gross Margin',
      capitalRequired: '₹12,000 (Prep Batch & Menu Signage)',
      paybackHorizon: '18 Days',
      effort: 'Strategic High-Yield Pilot',
      problem: 'High customer inquiry volume for breakfast and South/North Indian morning combos while kitchen sits unmonetized.',
      reason: 'Emerging demand signal detected in Demand Radar with score 88/100 and rising trend among young families and residents.',
      action: 'Pilot an 8:00 AM – 11:30 AM weekend breakfast board featuring freshly steamed idlis, crisp dosas, and artisanal filter coffee for 4 consecutive weekends.',
      priority: 'high',
      status: 'pending',
      expectedOutcome: 'Monetize zero-revenue morning kitchen overhead and capture ₹22,000+ per weekend day.',
      confidence: 'High (14 unique customer review inquiries)',
      limitations: 'Requires kitchen crew shift rotation starting at 6:30 AM.',
      sopSteps: [
        'Finalize a high-velocity 6-item morning buffet menu with fast table turnover.',
        'Set competitive ₹199 per head introductory price point.',
        'Broadcast announcement to local customer WhatsApp directory.'
      ]
    },
    {
      businessId: businessInfo._id,
      title: 'Introduce Barista Oat Milk & Iced Matcha Specialty Line',
      pillar: 'High-Margin Beverage Upsell',
      financialImpact: '+₹36,000 / month (76% Gross Margin)',
      capitalRequired: '₹6,500 (Ceremonial Matcha & Barista Oat Milk)',
      paybackHorizon: '12 Days',
      effort: 'Quick Win (Low Friction)',
      problem: 'Repeated customer requests for dairy-free coffee options, oat milk, and iced matcha lattes.',
      reason: 'Beverage additions carry a 70%+ gross margin profile and attract health-conscious professionals with zero kitchen prep disruption.',
      action: 'Stock barista-grade oat milk and launch two signature chilled drinks (Iced Oat Milk Latte and Ceremonial Matcha Brew) on both dine-in and Swiggy menus.',
      priority: 'medium',
      status: 'completed',
      expectedOutcome: 'Increase afternoon beverage attachment rate by 22% with high average order value.',
      confidence: 'High (11 documented review requests)',
      limitations: 'Oat milk has a 10-day shelf life after opening; manage initial order quantities tightly.',
      sopSteps: [
        'Partner with regional oat milk distributor for wholesale tier pricing.',
        'Create 2 signature iced drink recipes with standardized 60-second prep cards.',
        'Promote with tabletop tent cards and social media feature.'
      ]
    },
    {
      businessId: businessInfo._id,
      title: 'Calibrate Hall Air Conditioning & Balance Ambient Acoustics',
      pillar: 'Dwell Time & Average Order Value',
      financialImpact: '+₹52,000 / month (+18% Dwell Time AOV)',
      capitalRequired: '₹14,000 (Duct Servicing & Diffusers)',
      paybackHorizon: '25 Days',
      effort: 'Operational Hygiene',
      problem: 'Inadequate cooling and loud ambient music reported in rear and mezzanine dining zones.',
      reason: 'Thermal discomfort and excessive noise cause diners to rush through meals, declining high-margin desserts, second beverages, and repeat family dinners.',
      action: 'Service central HVAC filters, install directional airflow diffusers in hot spots, and calibrate background playlist to 65–68 decibels.',
      priority: 'high',
      status: 'in-progress',
      expectedOutcome: 'Eliminate ambient environment friction, leading to a 15% lift in dessert/drink upsells.',
      confidence: 'High (16 customer complaints logged)',
      limitations: 'Requires 4 hours of off-peak maintenance on Monday morning.',
      sopSteps: [
        'Complete comprehensive AC duct cleaning and compressor pressure testing.',
        'Install digital sound level limiter on dining room amplifier.',
        'Conduct daily shift checks 15 minutes before lunch opening.'
      ]
    },
    {
      businessId: businessInfo._id,
      title: 'Streamline Table Pay Flow via Contactless QR Checkout',
      pillar: 'Table Turnover & Friction Elimination',
      financialImpact: '+₹62,000 / month (+15% Table Turn Velocity)',
      capitalRequired: '₹3,000 (Laminated QR Table Stands)',
      paybackHorizon: '7 Days',
      effort: 'Quick Win (Instant ROI)',
      problem: 'Bottlenecks and 10+ minute waits for paper bills at cashier desk during peak 8:30 PM–10:00 PM dinner rush.',
      reason: 'Exit friction soured an otherwise delightful dinner, and occupied tables remained blocked while patrons waited to settle checks.',
      action: 'Place engraved QR table stands allowing guests to view live digital checks, tip service staff, and pay instantly via UPI/Card.',
      priority: 'medium',
      status: 'pending',
      expectedOutcome: 'Reduce end-of-meal checkout latency from 12 minutes to under 60 seconds, freeing up 2 extra turns per table on weekends.',
      confidence: 'High (12 customer reviews noting slow billing)',
      limitations: 'Requires POS integration or standalone verified UPI QR stands.',
      sopSteps: [
        'Generate unique dynamic QR codes for each table number.',
        'Brief front-of-house service staff to introduce table payment when clearing main plates.',
        'Incentivize digital checkout with instant ₹50 dessert coupon on next visit.'
      ]
    },
    {
      businessId: businessInfo._id,
      title: 'Introduce Certified Gluten-Free & Allergy-Conscious Category',
      pillar: 'Customer Inflow & Group Booking Acquisition',
      financialImpact: '+₹42,000 / month New Patron Inflow',
      capitalRequired: '₹7,500 (Gluten-Free Flour & Utensil Kit)',
      paybackHorizon: '16 Days',
      effort: 'Moderate Strategic Differentiation',
      problem: 'Families and dining parties avoiding booking because one member requires gluten-free or celiac-safe meals.',
      reason: 'Dietary restriction customers determine group restaurant choice. Winning the restricted diner secures the entire 4–6 person table booking.',
      action: 'Introduce 3 certified gluten-free mains (millet-flour rotis and gluten-free pastas) prepared with separate cookware.',
      priority: 'low',
      status: 'pending',
      expectedOutcome: 'Capture 15–20 high-value group reservations per month previously lost to specialty cafes.',
      confidence: 'Moderate (9 explicit review inquiries)',
      limitations: 'Strict cross-contamination protocols must be enforced in kitchen prep areas.',
      sopSteps: [
        'Designate a separate dry prep surface for gluten-free flour blending.',
        'Add dietary filter tags to digital menus and Google Business profile.',
        'Train wait staff to proactively ask about table dietary requirements.'
      ]
    }
  ]);

  // Create sample saved campaign
  await Campaign.deleteMany({ businessId: businessInfo._id });
  await Campaign.insertMany([
    {
      businessId: businessInfo._id,
      platform: 'Instagram',
      language: 'English',
      tone: 'Warm & Engaging',
      objective: 'Weekend Family Dining',
      caption: 'There’s a reason our community keeps coming back for our slow-cooked Dal Makhani and clay oven Butter Naan! ✨ Made fresh daily with authentic spices and genuine hospitality.\n\nTag your weekend dinner crew below! 👇',
      hashtags: ['#SpiceGardenBistro', '#BangaloreFoodies', '#NorthIndianCuisine', '#WeekendVibes'],
      campaignIdea: 'Signature Dish Spotlight: Customer Favorites',
      callToAction: 'Save this post & visit us this Friday-Sunday',
      contentRationale: 'Grounds messaging in verified 5-star customer feedback regarding food quality.',
      status: 'saved'
    }
  ]);

  console.log(`[Seed] Seed process finished successfully!`);
  return business;
};

// If run directly from command line
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const type = process.argv[2] || 'restaurant';
  connectDB().then(() => {
    seedDemoData(type)
      .then(() => process.exit(0))
      .catch(err => {
        console.error('Seed error:', err);
        process.exit(1);
      });
  });
}
