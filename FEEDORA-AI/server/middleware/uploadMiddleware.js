import multer from 'multer';

// Use memory storage for fast, clean in-memory CSV parsing without temp disk clutter
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow text/csv, application/vnd.ms-excel, or files ending with .csv
  if (
    file.mimetype === 'text/csv' ||
    file.mimetype === 'application/vnd.ms-excel' ||
    file.mimetype === 'text/plain' ||
    file.originalname.toLowerCase().endsWith('.csv')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Please upload a valid CSV file (.csv)'), false);
  }
};

export const uploadCsv = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB maximum file size
  },
  fileFilter
}).single('file');
