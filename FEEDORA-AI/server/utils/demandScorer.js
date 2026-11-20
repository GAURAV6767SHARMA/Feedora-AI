export const extractDemandSignalsFromText = (text = '') => {
  if (!text || typeof text !== 'string') return [];
  const lower = text.toLowerCase();
  const signals = [];

  // Grocery & Supermarket
  if (lower.includes('express counter') || (lower.includes('checkout') && (lower.includes('queue') || lower.includes('slow') || lower.includes('only one counter') || lower.includes('small purchases') || lower.includes('crowd')))) {
    signals.push('Express Checkout Counter (5 Items or Less)');
  }
  if (lower.includes('sugar-free') || lower.includes('sugar free') || lower.includes('diabetic')) {
    signals.push('Sugar-Free & Diabetic-Friendly Grocery Range');
  }
  if (lower.includes('delivery bag') || lower.includes('packaging checks') || lower.includes('bruised fruit') || lower.includes('leaking bottle') || lower.includes('cold items were packed') || (lower.includes('delivery') && lower.includes('cold'))) {
    signals.push('Cold-Chain Insulated Home Delivery Packaging');
  }
  if (lower.includes('household cleaning') || lower.includes('cleaning section') || (lower.includes('cleaning') && lower.includes('options'))) {
    signals.push('Expanded Household & Eco Cleaning Supplies');
  }
  if (lower.includes('fresh bread') || lower.includes('bakery') || lower.includes('croissant') || lower.includes('sourdough')) {
    signals.push('Fresh Artisanal Bakery & Daily Bread Drop');
  }
  if (lower.includes('empty shelves') || lower.includes('out of stock') || lower.includes('past its expiry') || lower.includes('stock rotation') || lower.includes('stock-control') || lower.includes('stock management') || lower.includes('close to expiry') || lower.includes('substituted items')) {
    signals.push('Real-Time Stock Availability & Expiry Quality Control');
  }

  // Restaurant & Cafe
  if (lower.includes('vegan') || lower.includes('dairy-free') || lower.includes('dairy free') || lower.includes('plant-based')) {
    signals.push('Vegan & Dairy-Free Menu Options');
  }
  if (lower.includes('gluten-free') || lower.includes('gluten free') || lower.includes('celiac')) {
    signals.push('Gluten-Free Pasta & Desserts');
  }
  if (lower.includes('oat milk') || lower.includes('almond milk') || lower.includes('matcha') || lower.includes('non-dairy choices') || lower.includes('non-dairy milk')) {
    signals.push('Iced Matcha Latte & Specialty Plant Milk Brews');
  }
  if (lower.includes('breakfast buffet') || lower.includes('morning breakfast') || lower.includes('subah ka breakfast') || lower.includes('breakfast platter')) {
    signals.push('Morning Breakfast Buffet & Early Bird Combos');
  }
  if (lower.includes('more vegetarian') || lower.includes('vegetarian options') || lower.includes('veg options')) {
    signals.push('Expanded Vegetarian & Plant-Based Menu Options');
  }
  if (lower.includes('dessert menu') || lower.includes('dessert options') || lower.includes('pastry selection') || lower.includes('more desserts')) {
    signals.push('Expanded Artisanal Dessert & Sweet Platter');
  }
  if (lower.includes('stay open a little later') || lower.includes('open late') || lower.includes('later hours')) {
    signals.push('Extended Evening & Late Night Operating Hours');
  }
  if (lower.includes('packaging leaked') || lower.includes('soup was completely cold') || lower.includes('dispatch checks') || lower.includes('leak-proof')) {
    signals.push('Tamper-Evident Leak-Proof Delivery Packaging');
  }

  // Salon & Wellness
  if (lower.includes('organic') && (lower.includes('spa') || lower.includes('shampoo') || lower.includes('chemical-free') || lower.includes('treatment'))) {
    signals.push('Organic Chemical-Free Hair Spa & Treatments');
  }
  if (lower.includes('online booking') || lower.includes('whatsapp') || lower.includes('portal') || lower.includes('booking was easy') || lower.includes('short wait after check-in')) {
    signals.push('Automated Online & WhatsApp Booking Portal');
  }
  if (lower.includes('nail colour') || lower.includes('neutral shades') || lower.includes('nail service') || lower.includes('nail polish') || lower.includes('manicure')) {
    signals.push('Expanded Neutral & Gel Nail Palette');
  }
  if (lower.includes('upsell') || lower.includes('expensive shampoo') || lower.includes('recommending expensive') || lower.includes('transparent pricing') || lower.includes('quoted price changed')) {
    signals.push('Transparent Fixed Pricing & Anti-Upsell Protocol');
  }

  // Apparel & Boutique
  if (lower.includes('plus size') || lower.includes('xxl') || lower.includes('3xl') || lower.includes('more sizes') || lower.includes('smaller sizes') || lower.includes('size chart') || lower.includes('in my size')) {
    signals.push('Plus Size & Petite Curated Collection (XS, XXL & 3XL)');
  }
  if (lower.includes('linen') || lower.includes('pure organic linen')) {
    signals.push('Pure Organic Linen Shirts Collection');
  }
  if (lower.includes('alteration') || lower.includes('tailoring') || lower.includes('on-the-spot') || lower.includes('minor alteration')) {
    signals.push('In-Store Same-Day Express Alteration Service');
  }
  if (lower.includes('formal wear') || lower.includes('workwear') || lower.includes('office wear')) {
    signals.push('Expanded Contemporary Formal & Workwear Line');
  }
  if (lower.includes('more colour') || lower.includes('colour options') || lower.includes('colours available') || lower.includes('color options')) {
    signals.push('Expanded Colour Palette & Seasonal Shades');
  }

  return [...new Set(signals)];
};

export const calculateDemandSignals = (reviews = []) => {
  if (!reviews || reviews.length === 0) return [];

  // Group demand signals and feature requests
  const signalMap = new Map();

  // Sort reviews chronologically
  const sorted = [...reviews].sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));
  const midPoint = Math.floor(sorted.length / 2);
  const earlierBatch = sorted.slice(0, midPoint);
  const recentBatch = sorted.slice(midPoint);

  const processReview = (r, isRecent) => {
    let combinedRequests = [
      ...(Array.isArray(r.featureRequests) ? r.featureRequests : []),
      ...(Array.isArray(r.demandSignals) ? r.demandSignals : [])
    ];

    // Fall back to text extraction if reviews have not been analyzed or have empty signals
    if (combinedRequests.length === 0 && r.reviewText) {
      combinedRequests = extractDemandSignalsFromText(r.reviewText);
    }

    const seenInReview = new Set();

    for (const req of combinedRequests) {
      if (!req || typeof req !== 'string' || req.trim().length < 3) continue;
      const key = req.trim();
      const normKey = key.toLowerCase();

      if (seenInReview.has(normKey)) continue;
      seenInReview.add(normKey);

      if (!signalMap.has(normKey)) {
        signalMap.set(normKey, {
          title: key,
          totalMentions: 0,
          uniqueReviews: 0,
          earlierMentions: 0,
          recentMentions: 0,
          supportingReviews: [],
          reviewIds: []
        });
      }

      const item = signalMap.get(normKey);
      item.totalMentions++;
      item.uniqueReviews++;
      if (isRecent) item.recentMentions++;
      else item.earlierMentions++;

      if (item.supportingReviews.length < 4 && r.reviewText) {
        item.supportingReviews.push({
          reviewId: String(r._id || r.id),
          text: r.reviewText,
          date: r.date || r.createdAt,
          rating: r.rating
        });
        item.reviewIds.push(String(r._id || r.id));
      }
    }
  };

  earlierBatch.forEach(r => processReview(r, false));
  recentBatch.forEach(r => processReview(r, true));

  let signals = Array.from(signalMap.values()).filter(s => s.totalMentions >= 2);
  if (signals.length === 0) {
    signals = Array.from(signalMap.values()).filter(s => s.totalMentions >= 1);
  }

  if (signals.length === 0) {
    return [];
  }

  const maxMentions = Math.max(...signals.map(s => s.totalMentions), 1);
  const maxUnique = Math.max(...signals.map(s => s.uniqueReviews), 1);

  return signals.map(sig => {
    // F: Normalized frequency (0 - 100)
    const F = (sig.totalMentions / maxMentions) * 100;

    // N: Normalized unique customer count (0 - 100)
    const N = (sig.uniqueReviews / maxUnique) * 100;

    // G: Growth trend (Period-over-period)
    let trend = 'Insufficient history';
    let G = 50;

    if (sorted.length >= 10) {
      if (sig.earlierMentions === 0 && sig.recentMentions > 0) {
        trend = 'Rising';
        G = 95;
      } else if (sig.recentMentions > sig.earlierMentions * 1.25) {
        trend = 'Rising';
        G = 85;
      } else if (sig.recentMentions < sig.earlierMentions * 0.75) {
        trend = 'Declining';
        G = 30;
      } else {
        trend = 'Stable';
        G = 50;
      }
    }

    // Heuristic Demand Score: 0.4F + 0.3G + 0.3N
    const demandScore = Math.min(100, Math.round(0.4 * F + 0.3 * G + 0.3 * N));

    // Confidence Level
    let confidence = 'Exploratory (Emerging signal)';
    if (sig.uniqueReviews >= 6) {
      confidence = 'High (Broad customer recurrence)';
    } else if (sig.uniqueReviews >= 3) {
      confidence = 'Moderate (Multiple mentions across dates)';
    }

    // Suggested experiments & metrics based on signal title
    let suggestedExperiment = `Run a 14-day test introducing "${sig.title}" on weekends to measure direct customer uptake.`;
    let estimatedRevenue = '₹45,000 – ₹70,000 / mo';
    let grossMargin = '68%';
    let pilotCost = '₹7,500';
    let paybackHorizon = '14 Days';
    let competitorGap = '78% Local Gap';
    let category = 'Menu Innovation';

    const tLower = sig.title.toLowerCase();
    if (tLower.includes('checkout') || tLower.includes('counter')) {
      category = 'Checkout Velocity';
      estimatedRevenue = '₹45,000 – ₹70,000 / mo';
      grossMargin = '85%';
      pilotCost = '₹3,500';
      paybackHorizon = '8 Days';
      competitorGap = '82% Local Gap';
      suggestedExperiment = 'Designate Register 1 as Express Counter (5 items or less) during peak 6 PM–9 PM hours to cut basket abandonment.';
    } else if (tLower.includes('stock') || tLower.includes('expiry') || tLower.includes('inventory')) {
      category = 'Inventory Optimization';
      estimatedRevenue = '₹60,000 – ₹95,000 / mo';
      grossMargin = '72%';
      pilotCost = '₹6,000';
      paybackHorizon = '14 Days';
      competitorGap = '80% Local Gap';
      suggestedExperiment = 'Deploy digital handheld stock audits at 10 AM daily to eliminate out-of-stock essentials and rotate expiring stock.';
    } else if (tLower.includes('sugar-free') || tLower.includes('diabetic')) {
      category = 'Dietary & Wellness';
      estimatedRevenue = '₹35,000 – ₹55,000 / mo';
      grossMargin = '75%';
      pilotCost = '₹5,500';
      paybackHorizon = '11 Days';
      competitorGap = '79% Local Gap';
      suggestedExperiment = 'Create a dedicated 12-SKU Sugar-Free & Diabetic-Friendly shelf display near the front aisle.';
    } else if (tLower.includes('delivery') || tLower.includes('packaging') || tLower.includes('cold-chain')) {
      category = 'Fulfillment Quality';
      estimatedRevenue = '₹50,000 – ₹80,000 / mo';
      grossMargin = '78%';
      pilotCost = '₹4,500';
      paybackHorizon = '10 Days';
      competitorGap = '75% Local Gap';
      suggestedExperiment = 'Introduce insulated foil pouches and separate chill packs for chilled dairy and produce in delivery orders.';
    } else if (tLower.includes('cleaning') || tLower.includes('household')) {
      category = 'Assortment Expansion';
      estimatedRevenue = '₹30,000 – ₹50,000 / mo';
      grossMargin = '64%';
      pilotCost = '₹7,000';
      paybackHorizon = '16 Days';
      competitorGap = '71% Local Gap';
      suggestedExperiment = 'Introduce 5 leading eco-friendly surface cleaners and bulk refill detergents on end-aisle racks.';
    } else if (tLower.includes('bakery') || tLower.includes('bread')) {
      category = 'Fresh Daily Category';
      estimatedRevenue = '₹40,000 – ₹65,000 / mo';
      grossMargin = '68%';
      pilotCost = '₹5,000';
      paybackHorizon = '12 Days';
      competitorGap = '84% Local Gap';
      suggestedExperiment = 'Partner with a local artisan bakery to receive morning deliveries of sourdough and fresh sandwich loaves.';
    } else if (tLower.includes('nail') || tLower.includes('palette')) {
      category = 'Service Enrichment';
      estimatedRevenue = '₹30,000 – ₹45,000 / mo';
      grossMargin = '80%';
      pilotCost = '₹4,000';
      paybackHorizon = '10 Days';
      competitorGap = '78% Local Gap';
      suggestedExperiment = 'Introduce a 12-shade nude and earth-tone gel polish collection with swatch ring display at reception.';
    } else if (tLower.includes('formal') || tLower.includes('workwear')) {
      category = 'Category Expansion';
      estimatedRevenue = '₹45,000 – ₹75,000 / mo';
      grossMargin = '68%';
      pilotCost = '₹10,000';
      paybackHorizon = '18 Days';
      competitorGap = '76% Local Gap';
      suggestedExperiment = 'Dedicate a central display rack to tailored workwear blazers and wrinkle-resistant formal shirts.';
    } else if (tLower.includes('size') || tLower.includes('xxl') || tLower.includes('3xl')) {
      category = 'Size Inclusivity';
      estimatedRevenue = '₹65,000 – ₹95,000 / mo';
      grossMargin = '66%';
      pilotCost = '₹9,000';
      paybackHorizon = '16 Days';
      competitorGap = '88% Local Gap';
      suggestedExperiment = 'Curate a focused 15-piece sample rack at the store entrance with a customer interest log.';
    } else if (tLower.includes('pricing') || tLower.includes('upsell')) {
      category = 'Customer Trust & Retention';
      estimatedRevenue = '₹40,000 – ₹65,000 / mo';
      grossMargin = '88%';
      pilotCost = '₹2,500';
      paybackHorizon = '6 Days';
      competitorGap = '83% Local Gap';
      suggestedExperiment = 'Publish an upfront all-inclusive service menu card and replace staff sales commissions with 5-star review bonuses.';
    } else if (tLower.includes('hours') || tLower.includes('late')) {
      category = 'Capacity Expansion';
      estimatedRevenue = '₹40,000 – ₹60,000 / mo';
      grossMargin = '74%';
      pilotCost = '₹4,000';
      paybackHorizon = '9 Days';
      competitorGap = '80% Local Gap';
      suggestedExperiment = 'Extend operating hours by 90 minutes on Thursday through Sunday with a focused evening menu.';
    } else if (tLower.includes('dessert') || tLower.includes('sweet')) {
      category = 'High-Margin Add-On';
      estimatedRevenue = '₹35,000 – ₹55,000 / mo';
      grossMargin = '76%';
      pilotCost = '₹5,000';
      paybackHorizon = '11 Days';
      competitorGap = '78% Local Gap';
      suggestedExperiment = 'Introduce 2 signature fusion desserts with tabletop presentation cards to lift dessert attachment rates.';
    } else if (tLower.includes('vegetarian') || tLower.includes('veg options')) {
      category = 'Menu Innovation';
      estimatedRevenue = '₹45,000 – ₹70,000 / mo';
      grossMargin = '70%';
      pilotCost = '₹6,500';
      paybackHorizon = '13 Days';
      competitorGap = '73% Local Gap';
      suggestedExperiment = 'Add 3 chef-crafted vegetarian starters and a seasonal vegetable handi curry to the evening menu.';
    } else if (tLower.includes('alteration') || tLower.includes('tailoring')) {
      category = 'Conversion & Retention';
      estimatedRevenue = '₹35,000 – ₹55,000 / mo';
      grossMargin = '84%';
      pilotCost = '₹3,500';
      paybackHorizon = '8 Days';
      competitorGap = '74% Local Gap';
      suggestedExperiment = 'Provide complimentary 20-minute trouser hemming and sleeve adjustment for any purchase over ₹1,500.';
    } else if (tLower.includes('breakfast') || tLower.includes('buffet')) {
      estimatedRevenue = '₹85,000 – ₹1,20,000 / mo';
      grossMargin = '72%';
      pilotCost = '₹12,000';
      paybackHorizon = '18 Days';
      competitorGap = '84% Local Gap';
      category = 'Daypart Expansion';
      suggestedExperiment = 'Introduce a limited breakfast board for 2 weeks to test early-morning customer traffic.';
    } else if (tLower.includes('matcha') || tLower.includes('oat') || tLower.includes('milk')) {
      estimatedRevenue = '₹35,000 – ₹55,000 / mo';
      grossMargin = '78%';
      pilotCost = '₹6,500';
      paybackHorizon = '12 Days';
      competitorGap = '91% Local Gap';
      category = 'High-Margin Beverage';
      suggestedExperiment = 'Introduce Iced Matcha Latte and Oat Milk Cappuccino on dine-in and delivery menus.';
    } else if (tLower.includes('vegan') || tLower.includes('dairy-free')) {
      estimatedRevenue = '₹50,000 – ₹80,000 / mo';
      grossMargin = '68%';
      pilotCost = '₹8,000';
      paybackHorizon = '15 Days';
      competitorGap = '76% Local Gap';
      category = 'Dietary Inclusion';
      suggestedExperiment = 'Introduce a limited "Plant-Based Special" menu board for 2 weeks and track re-orders.';
    } else if (tLower.includes('gluten')) {
      estimatedRevenue = '₹40,000 – ₹65,000 / mo';
      grossMargin = '70%';
      pilotCost = '₹7,500';
      paybackHorizon = '16 Days';
      competitorGap = '82% Local Gap';
      category = 'Wellness & Specialty';
      suggestedExperiment = 'Introduce 3 certified gluten-free mains and gluten-free desserts with designated prep equipment.';
    } else if (tLower.includes('booking') || tLower.includes('whatsapp') || tLower.includes('portal')) {
      estimatedRevenue = '₹60,000 – ₹90,000 / mo';
      grossMargin = '92%';
      pilotCost = '₹3,500';
      paybackHorizon = '7 Days';
      competitorGap = '65% Local Gap';
      category = 'Digital Automation';
      suggestedExperiment = 'Test a direct WhatsApp booking link with automated confirmation slots for 7 days.';
    }

    return {
      title: sig.title,
      demandScore,
      trend,
      confidence,
      category,
      estimatedRevenue,
      grossMargin,
      pilotCost,
      paybackHorizon,
      competitorGap,
      uniqueReviews: sig.uniqueReviews,
      totalMentions: sig.totalMentions,
      earlierMentions: sig.earlierMentions,
      recentMentions: sig.recentMentions,
      supportingReviews: sig.supportingReviews,
      reviewIds: sig.reviewIds,
      suggestedExperiment
    };
  }).sort((a, b) => b.demandScore - a.demandScore);
};
