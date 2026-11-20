import Papa from 'papaparse';
import crypto from 'crypto';

export const computeNormalizedHash = (text) => {
  if (!text) return '';
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  return crypto.createHash('sha256').update(cleaned).digest('hex');
};

export const parseReviewsCsv = (csvString, existingHashes = new Set()) => {
  const result = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.trim().toLowerCase()
  });

  const parsed = [];
  const errors = [];
  let duplicatesCount = 0;
  let rejectedCount = 0;

  if (result.errors && result.errors.length > 0) {
    for (const err of result.errors) {
      errors.push(`CSV Syntax error at row ${err.row}: ${err.message}`);
    }
  }

  const rows = result.data;
  if (rows.length > 1000) {
    throw new Error(`Upload exceeds maximum limit of 1,000 reviews. Found ${rows.length} rows.`);
  }

  const seenInBatch = new Set();

  rows.forEach((row, index) => {
    const rowNum = index + 2; // +1 for 0-index, +1 for header row
    const reviewText = (row.review || row.reviewtext || row.text || row.feedback || '').trim();
    const rawRating = row.rating || row.stars || row.score;
    const rawDate = row.date || row.createdat || row.time;
    const source = (row.source || 'CSV Upload').trim();
    const language = (row.language || 'English').trim();

    if (!reviewText) {
      errors.push(`Row ${rowNum}: Review text is missing.`);
      rejectedCount++;
      return;
    }

    if (reviewText.length < 3) {
      errors.push(`Row ${rowNum}: Review text too short (min 3 chars).`);
      rejectedCount++;
      return;
    }

    const rating = parseInt(rawRating, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      errors.push(`Row ${rowNum}: Invalid rating "${rawRating}". Must be an integer between 1 and 5.`);
      rejectedCount++;
      return;
    }

    let parsedDate = new Date();
    if (rawDate) {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        parsedDate = d;
      }
    }

    const hash = computeNormalizedHash(reviewText);

    if (seenInBatch.has(hash) || existingHashes.has(hash)) {
      duplicatesCount++;
      return;
    }

    seenInBatch.add(hash);

    parsed.push({
      reviewText,
      rating,
      date: parsedDate,
      source: source || 'CSV Upload',
      language: language || 'English',
      normalizedTextHash: hash,
      analysisStatus: 'pending'
    });
  });

  return {
    items: parsed,
    importedCount: parsed.length,
    rejectedCount,
    duplicatesCount,
    errors: errors.slice(0, 10) // return up to 10 representative errors
  };
};
