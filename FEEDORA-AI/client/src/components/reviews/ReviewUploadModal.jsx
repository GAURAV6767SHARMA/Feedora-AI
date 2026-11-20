import React, { useState } from 'react';
import Modal from '../common/Modal';
import { UploadCloud, CheckCircle2, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import toast from 'react-hot-toast';

export const ReviewUploadModal = ({ isOpen, onClose, businessId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.toLowerCase().endsWith('.csv')) {
        toast.error('Please select a valid .csv file');
        return;
      }
      setFile(selected);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please choose a CSV file first');
      return;
    }

    setUploading(true);
    const toastId = toast.loading('Uploading and validating CSV dataset...');
    try {
      const res = await reviewService.uploadCsv(businessId, file);
      toast.success(res.message || 'CSV parsed successfully!', { id: toastId });
      setResult(res.data);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      toast.error(err.message || 'Upload failed', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Customer Reviews via CSV">
      {!result ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 leading-relaxed">
            <p className="font-semibold text-text-primary mb-1">Supported Format:</p>
            <p>CSV with headers: <code className="px-1.5 py-0.5 rounded bg-white text-primary font-mono border border-stone-200">review,rating,date</code></p>
            <p className="mt-1">Optional headers: <code className="px-1 py-0.5 rounded bg-white text-stone-500 font-mono border border-stone-200">source,language</code></p>
            <p className="mt-1.5 text-[11px] text-stone-400">Max file size: 5 MB • Max rows: 1,000</p>
            <div className="pt-2 mt-2 border-t border-stone-200">
              <a
                href="/feedora_sample_reviews.csv"
                download="feedora_commercial_reviews_165.csv"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover hover:underline transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download Ready-to-Upload Sample Dataset (165 Reviews .csv)</span>
              </a>
            </div>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-stone-300 hover:border-primary/60 rounded-2xl p-8 text-center transition-colors bg-stone-50/50">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              id="csvFileInput"
              className="hidden"
            />
            <label htmlFor="csvFileInput" className="cursor-pointer flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-text-primary mb-1">
                {file ? file.name : 'Choose CSV file to upload'}
              </span>
              <span className="text-xs text-stone-500">
                {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Click to browse files on your computer'}
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || uploading}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{uploading ? 'Processing...' : 'Upload & Validate'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-stone-700">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Import Successful</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Total Rows: <span className="font-semibold text-text-primary font-tabular">{result.totalRows || 0}</span></div>
              <div>Valid Reviews: <span className="font-semibold text-emerald-700 font-tabular">{result.validRows || 0}</span></div>
              <div>Duplicate Rows: <span className="font-semibold text-stone-500 font-tabular">{result.duplicates || 0}</span></div>
              <div>Invalid Rows: <span className="font-semibold text-rose-700 font-tabular">{result.invalidRows || 0}</span></div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              Upload Another
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ReviewUploadModal;
