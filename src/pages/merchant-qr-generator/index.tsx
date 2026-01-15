// Merchant QR Code Generator Page
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { generateQRCode, generateBulkQRCodes, clearQRCodes } from '../../store/qrcodeSlice';
import { fetchSKUs } from '../../store/skuSlice';
import QRCodeDisplay from './QRCodeDisplay';
import SKUSelector from './SKUSelector';

export default function MerchantQRGenerator() {
  const { merchantId } = useParams<{ merchantId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { generatedQRCodes, loading, error } = useAppSelector((state) => state.qrcode);
  const { items: skus, loading: skusLoading } = useAppSelector((state) => state.skus);

  const [selectedSKU, setSelectedSKU] = useState('');
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedSKUs, setSelectedSKUs] = useState<string[]>([]);
  const [format, setFormat] = useState<'png' | 'svg' | 'pdf'>('png');
  const [includeLogo, setIncludeLogo] = useState(false);

  useEffect(() => {
    dispatch(fetchSKUs());
    return () => {
      dispatch(clearQRCodes());
    };
  }, [dispatch]);

  const handleGenerateSingle = async () => {
    if (!merchantId || !selectedSKU) return;
    await dispatch(generateQRCode({ merchantId, skuCode: selectedSKU, format, includeLogo }));
  };

  const handleGenerateBulk = async () => {
    if (!merchantId || selectedSKUs.length === 0) return;
    await dispatch(generateBulkQRCodes({ merchantId, skuCodes: selectedSKUs, format, includeLogo }));
  };

  const handleDownloadQR = (qrCode: any) => {
    const link = document.createElement('a');

    if (qrCode.format === 'svg') {
      // For SVG, create blob from string
      const blob = new Blob([qrCode.qrCodeData], { type: qrCode.mimeType });
      const url = URL.createObjectURL(blob);
      link.href = url;
    } else {
      // For PNG and PDF (already base64 data URLs)
      link.href = qrCode.qrCodeData;
    }

    link.download = qrCode.downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (qrCode.format === 'svg') {
      URL.revokeObjectURL(link.href);
    }
  };

  const activeSKUs = skus.filter(sku => sku.isActive);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-up duration-normal">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-fast">QR Code Generator</h1>
                <p className="text-gray-600 animate-on-load fade-left duration-light-slow">Generate QR codes for your products and services</p>
              </div>
              <button
                onClick={() => navigate(`/merchant/${merchantId}`)}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors animate-on-load zoom-in duration-slow"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-right duration-light-slow">
            <div className="flex gap-4">
              <button
                onClick={() => setBulkMode(false)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors animate-on-load zoom-in duration-fast ${
                  !bulkMode
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Single QR Code
              </button>
              <button
                onClick={() => setBulkMode(true)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors animate-on-load zoom-in duration-normal ${
                  bulkMode
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Bulk Generation
              </button>
            </div>
          </div>

          {/* Format & Options Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-left duration-normal">
            <h2 className="text-xl font-bold text-gray-800 mb-4 animate-on-load fade-down duration-fast">Export Format & Options</h2>

            {/* Format Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">File Format</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setFormat('png')}
                  className={`py-3 px-4 rounded-lg font-semibold transition-colors animate-on-load zoom-in duration-very-fast ${
                    format === 'png'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  PNG
                </button>
                <button
                  onClick={() => setFormat('svg')}
                  className={`py-3 px-4 rounded-lg font-semibold transition-colors animate-on-load zoom-in duration-fast ${
                    format === 'svg'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  SVG
                </button>
                <button
                  onClick={() => setFormat('pdf')}
                  className={`py-3 px-4 rounded-lg font-semibold transition-colors animate-on-load zoom-in duration-normal ${
                    format === 'pdf'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  PDF
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {format === 'png' && '• Best for screen display and digital use (512x512px)'}
                {format === 'svg' && '• Scalable vector format ideal for professional printing'}
                {format === 'pdf' && '• Print-ready document with QR code and instructions'}
              </p>
            </div>

            {/* Logo Option */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeLogo"
                checked={includeLogo}
                onChange={(e) => setIncludeLogo(e.target.checked)}
                className="mr-2 w-4 h-4"
              />
              <label htmlFor="includeLogo" className="text-sm text-gray-700">
                Include CSR26 logo (uses higher error correction)
              </label>
            </div>
          </div>

          {/* Generator Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-left duration-slow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {bulkMode ? 'Select Multiple SKUs' : 'Select SKU'}
            </h2>

            {skusLoading ? (
              <p className="text-gray-600 animate-on-load fade-up duration-normal">Loading SKUs...</p>
            ) : (
              <SKUSelector
                skus={activeSKUs}
                bulkMode={bulkMode}
                selectedSKU={selectedSKU}
                selectedSKUs={selectedSKUs}
                onSingleSelect={setSelectedSKU}
                onBulkSelect={setSelectedSKUs}
              />
            )}

            <button
              onClick={bulkMode ? handleGenerateBulk : handleGenerateSingle}
              disabled={loading || (!bulkMode && !selectedSKU) || (bulkMode && selectedSKUs.length === 0)}
              className="mt-6 w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed animate-on-load zoom-in duration-very-slow"
            >
              {loading ? 'Generating...' : `Generate QR Code${bulkMode ? 's' : ''} (${format.toUpperCase()})`}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-on-load fade-up duration-fast">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>

          {/* Generated QR Codes */}
          {generatedQRCodes.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 animate-on-load fade-up duration-slow">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Generated QR Codes</h2>
              <QRCodeDisplay
                qrCodes={generatedQRCodes}
                onDownload={handleDownloadQR}
              />
            </div>
          )}

          {/* Usage Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6 animate-on-load flip-up duration-very-slow">
            <h3 className="font-semibold text-blue-800 mb-3">How to Use QR Codes</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Print and display QR codes at point-of-sale</li>
              <li>• Customers scan with their phone camera</li>
              <li>• They're redirected to checkout with pre-filled merchant and SKU</li>
              <li>• Transaction is automatically linked to your merchant wallet</li>
              <li>• <strong>PNG:</strong> Digital use and screen display</li>
              <li>• <strong>SVG:</strong> Professional printing (scalable to any size)</li>
              <li>• <strong>PDF:</strong> Print-ready with specifications (recommended 3cm x 3cm minimum)</li>
            </ul>
          </div>
        </div>
    </div>
  );
}
