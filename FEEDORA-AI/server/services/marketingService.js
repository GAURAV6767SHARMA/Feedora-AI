import Campaign from '../models/Campaign.js';
import Business from '../models/Business.js';
import Review from '../models/Review.js';
import { GoogleGenAI } from '@google/genai';
import { isKeyValid } from './geminiService.js';
import { aggregateSentiment } from '../utils/sentimentAggregator.js';

export const generateMarketingCampaign = async ({
  businessId,
  platform = 'Instagram',
  language = 'English',
  tone = 'Warm & Engaging',
  objective = 'Attract new weekend diners',
  selectedInsight = ''
}) => {
  const business = await Business.findById(businessId);
  const reviews = await Review.find({ businessId }).exec();
  const aggregated = aggregateSentiment(reviews);

  const businessName = business?.name || 'LocalPulse Partner';
  const category = business?.category || 'local store';
  const topPref = aggregated.topPreferences?.[0]?.item || 'our signature specialties';

  // Fallback high-quality template library tailored to business category & selected language
  let fallbackResult = {
    platform,
    language,
    tone,
    objective,
    caption: '',
    hashtags: [],
    campaignIdea: '',
    callToAction: '',
    contentRationale: ''
  };

  if (language === 'Hinglish') {
    if (platform === 'WhatsApp') {
      fallbackResult.caption = `Namaste! ✨ Aap sabhi ke dher saare pyaar ke liye shukriya! Humare customers ka kehna hai: "${topPref} ka swad bilkul kamaal hai!"\n\nIss weekend apne friends aur family ke saath aaiye aur try kijiye humari fresh menu items. Aaj hi apni table book karein aur weekend memorable banayein!\n\n📍 ${businessName}, ${business?.location || 'Your Favorite Neighborhood Spot'}\n📞 Call / WhatsApp us for instant reservation!`;
      fallbackResult.callToAction = 'Book Table on WhatsApp Now';
    } else {
      fallbackResult.caption = `Craving something truly special this weekend? 🌟\n\nHumare regular customers ka all-time favorite: "${topPref}"! Ekdum fresh ingredients aur authentic swad ke saath ready kiya gaya hai.\n\nTag your foodie partner aur plan your visit today! 👇\n\n📍 Visit us at ${businessName}\n⏰ Open daily from 11 AM - 11 PM`;
      fallbackResult.callToAction = 'Tag a friend & Visit this Weekend';
    }
    fallbackResult.hashtags = ['#LocalFavorite', `#${businessName.replace(/\s+/g, '')}`, '#FoodieDelight', '#WeekendVibes', '#AuthenticTaste', '#BestInTown'];
    fallbackResult.campaignIdea = `Community Spotlight: "What Customers Love Most about ${businessName}"`;
    fallbackResult.contentRationale = `Uses verified positive customer sentiment around ${topPref} to craft high-conversion social proof in conversational Hinglish.`;
  } else if (language === 'Hindi') {
    fallbackResult.caption = `नमस्ते! 🌸\n\nक्या आपने अभी तक ${businessName} का प्रसिद्ध "${topPref}" चखा है?\nहमारे ग्राहकों की पहली पसंद और बेहतरीन स्वाद का अनुभव करने के लिए आज ही पधारें।\n\nअपने परिवार और दोस्तों के साथ एक सुखद समय बिताएं।\n\n📍 स्थान: ${businessName}, ${business?.location || 'मुख्य बाज़ार'}\n📞 संपर्क करें और पहले से बुकिंग कराएं!`;
    fallbackResult.hashtags = ['#स्थानीय_स्वाद', '#स्वादिष्ट', `#${businessName.replace(/\s+/g, '')}`, '#पारिवारिक_रेस्टोरेंट'];
    fallbackResult.callToAction = 'आज ही पधारें या टेबल बुक करें';
    fallbackResult.campaignIdea = `स्थानीय ग्राहक विश्वास और प्रामाणिक स्वाद उत्सव`;
    fallbackResult.contentRationale = `शुद्ध हिंदी में आत्मीय और पारिवारिक संवाद जो स्थानीय ग्राहकों को भावनात्मक रूप से जोड़ता है।`;
  } else {
    // English
    if (platform === 'WhatsApp') {
      fallbackResult.caption = `Hello from ${businessName}! ✨\n\nOur customers recently voted "${topPref}" as their favorite comfort treat! Prepared fresh daily with premium ingredients.\n\nPlanning a gathering this weekend? Reserve your spot in advance and skip the line!\n\n📍 Location: ${business?.location || 'Central Avenue'}\n📲 Reply to this message to book your reservation instantly.`;
      fallbackResult.callToAction = 'Reply "RESERVE" to secure your table';
    } else {
      fallbackResult.caption = `There is a reason our community keeps coming back for "${topPref}"! ✨\n\nCrafted fresh with authentic care, it’s the crowd favorite for good reason. Whether it's a family celebration or a weekend unwind, we’re ready to welcome you.\n\nDrop by today or reserve ahead! 👇\n\n📍 ${businessName} | ${business?.location || 'Neighborhood Flagship'}`;
      fallbackResult.callToAction = 'Save this post & visit us this week';
    }
    fallbackResult.hashtags = ['#LocalBusiness', `#${businessName.replace(/\s+/g, '')}`, '#CommunityFavorite', '#QualityFirst', '#WeekendPlans', '#CustomerLove'];
    fallbackResult.campaignIdea = `Social Proof Showcase: Spotlight on ${topPref}`;
    fallbackResult.contentRationale = `Translates verified top customer preference into authentic social proof without inventing promotions.`;
  }

  // Attempt live generation with Google Gemini API
  const apiKey = process.env.GEMINI_API_KEY;
  if (isKeyValid(apiKey)) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are LocalPulse Marketing Studio AI.
Generate a high-converting, authentic marketing campaign for this local business:
- Business Name: ${businessName}
- Category: ${category}
- Platform: ${platform}
- Target Language: ${language} (English, Hindi, or conversational Hinglish)
- Tone: ${tone}
- Objective: ${objective}
- Customer Evidence Context: Top preferred items: ${topPref}. Selected Insight: "${selectedInsight || 'Organic customer appreciation'}".

CRITICAL INSTRUCTIONS:
1. NEVER fabricate non-existent discount percentages (e.g., do NOT promise "50% off" unless instructed).
2. Ground the message in real customer enthusiasm and authentic quality.
3. If Hinglish is requested, use natural everyday Romanized Hindi + English blend.
4. Return ONLY valid JSON matching the schema below.

SCHEMA:
{
  "caption": "string",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "campaignIdea": "string",
  "callToAction": "string",
  "contentRationale": "string"
}`;

      const response = await Promise.race([
        ai.models.generateContent({
          model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: { responseMimeType: 'application/json' }
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Marketing AI generation timeout')), 12000))
      ]);

      const parsed = JSON.parse(response.text?.trim() || '{}');
      if (parsed.caption) {
        fallbackResult = {
          ...fallbackResult,
          ...parsed
        };
      }
    } catch (err) {
      console.warn('[Marketing Service] Gemini generation error, using curated template:', err.message);
    }
  }

  return fallbackResult;
};

export const saveCampaign = async (campaignData) => {
  return Campaign.create(campaignData);
};

export const getBusinessCampaigns = async (businessId) => {
  return Campaign.find({ businessId }).sort({ createdAt: -1 }).exec();
};

export const updateCampaignStatus = async (id, updateData) => {
  return Campaign.findByIdAndUpdate(id, updateData, { new: true });
};
