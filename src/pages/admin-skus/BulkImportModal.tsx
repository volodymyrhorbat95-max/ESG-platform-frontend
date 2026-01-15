// Bulk SKU Import Modal - Section 9.3
// Allows admin to upload CSV file and bulk import SKUs
import { useState } from 'react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BulkImportModal({ isOpen, onClose, onSuccess }: BulkImportModalProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ success: any[]; errors: any[] } | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setError('Please upload a CSV file');
        return;
      }
      setCsvFile(file);
      setError('');
      setResults(null);
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const skus = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const sku: any = {};

      headers.forEach((header, index) => {
        const value = values[index];
        if (header === 'price' || header === 'corsairThreshold' || header === 'impactMultiplier' || header === 'productWeight') {
          sku[header] = value ? parseFloat(value) : undefined;
        } else if (header === 'requiresValidation') {
          sku[header] = value?.toLowerCase() === 'true';
        } else {
          sku[header] = value || undefined;
        }
      });

      skus.push(sku);
    }

    return skus;
  };

  const handleImport = async () => {
    if (!csvFile) {
      setError('Please select a CSV file');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const text = await csvFile.text();
      const skus = parseCSV(text);

      const token = localStorage.getItem('csr26_admin_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/skus/bulk-import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ skus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Import failed');
      }

      const data = await response.json();
      setResults(data.data);

      if (data.data.errors.length === 0) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCsvFile(null);
    setResults(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-on-load fade-in duration-fast">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-on-load zoom-in duration-normal">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 animate-on-load fade-down duration-fast">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bulk Import SKUs</h2>
            <p className="text-sm text-gray-600">Upload a CSV file to import multiple SKUs at once</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* CSV Format Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 animate-on-load fade-up duration-normal">
          <h3 className="font-semibold text-blue-800 mb-2">CSV Format Requirements:</h3>
          <p className="text-sm text-blue-700 mb-2">Required columns (comma-separated):</p>
          <code className="text-xs text-blue-900 block bg-blue-100 p-2 rounded">
            code,name,price,paymentMode,requiresValidation,corsairThreshold,impactMultiplier,productWeight,description
          </code>
          <p className="text-xs text-blue-600 mt-2">
            • paymentMode must be: CLAIM, PAY, GIFT_CARD, or ALLOCATION<br />
            • requiresValidation must be: true or false<br />
            • Price and thresholds must be numbers
          </p>
        </div>

        {/* File Upload */}
        <div className="mb-6 animate-on-load fade-right duration-light-slow">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select CSV File:
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {csvFile && (
            <p className="text-sm text-green-600 mt-2">
              Selected: {csvFile.name}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-on-load zoom-in duration-fast">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Import Results */}
        {results && (
          <div className="mb-6 animate-on-load fade-up duration-normal">
            <h3 className="font-semibold text-gray-800 mb-3">Import Results:</h3>

            {results.success.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                <p className="text-green-800 font-semibold mb-2">
                  ✓ Successfully imported {results.success.length} SKUs
                </p>
                <div className="max-h-40 overflow-y-auto">
                  {results.success.slice(0, 10).map((sku: any, index: number) => (
                    <p key={index} className="text-sm text-green-700">
                      • {sku.code} - {sku.name}
                    </p>
                  ))}
                  {results.success.length > 10 && (
                    <p className="text-sm text-green-600 italic">
                      ... and {results.success.length - 10} more
                    </p>
                  )}
                </div>
              </div>
            )}

            {results.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold mb-2">
                  ✗ {results.errors.length} errors occurred:
                </p>
                <div className="max-h-40 overflow-y-auto">
                  {results.errors.map((err: any, index: number) => (
                    <p key={index} className="text-sm text-red-700">
                      Row {err.row} ({err.code}): {err.error}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 animate-on-load fade-up duration-normal">
          <button
            onClick={handleClose}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {results && results.errors.length === 0 ? 'Done' : 'Cancel'}
          </button>
          <button
            onClick={handleImport}
            disabled={!csvFile || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {loading ? 'Importing...' : 'Import CSV'}
          </button>
        </div>
      </div>
    </div>
  );
}
