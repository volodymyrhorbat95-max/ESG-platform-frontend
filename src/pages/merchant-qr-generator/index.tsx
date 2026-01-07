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

  useEffect(() => {
    dispatch(fetchSKUs());
    return () => {
      dispatch(clearQRCodes());
    };
  }, [dispatch]);

  const handleGenerateSingle = async () => {
    if (!merchantId || !selectedSKU) return;
    await dispatch(generateQRCode({ merchantId, skuCode: selectedSKU }));
  };

  const handleGenerateBulk = async () => {
    if (!merchantId || selectedSKUs.length === 0) return;
    await dispatch(generateBulkQRCodes({ merchantId, skuCodes: selectedSKUs }));
  };

  const handleDownloadQR = (qrCode: any) => {
    const link = document.createElement('a');
    link.href = qrCode.qrCodeDataUrl;
    link.download = qrCode.downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeSKUs = skus.filter(sku => sku.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">QR Code Generator</h1>
              <p className="text-gray-600">Generate QR codes for your products and services</p>
            </div>
            <button
              onClick={() => navigate(`/merchant/${merchantId}`)}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setBulkMode(false)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                !bulkMode
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Single QR Code
            </button>
            <button
              onClick={() => setBulkMode(true)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                bulkMode
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Bulk Generation
            </button>
          </div>
        </div>

        {/* Generator Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {bulkMode ? 'Select Multiple SKUs' : 'Select SKU'}
          </h2>

          {skusLoading ? (
            <p className="text-gray-600">Loading SKUs...</p>
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
            className="mt-6 w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : `Generate QR Code${bulkMode ? 's' : ''}`}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Generated QR Codes */}
        {generatedQRCodes.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Generated QR Codes</h2>
            <QRCodeDisplay
              qrCodes={generatedQRCodes}
              onDownload={handleDownloadQR}
            />
          </div>
        )}

        {/* Usage Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
          <h3 className="font-semibold text-blue-800 mb-3">How to Use QR Codes</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Print and display QR codes at point-of-sale</li>
            <li>• Customers scan with their phone camera</li>
            <li>• They're redirected to checkout with pre-filled merchant and SKU</li>
            <li>• Transaction is automatically linked to your merchant wallet</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
