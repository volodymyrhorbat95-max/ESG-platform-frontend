// Admin Gift Card Management - Bulk upload and inventory tracking
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchGiftCards, createBulkGiftCards } from '../../store/giftCardSlice';
import { fetchSKUs } from '../../store/skuSlice';
import StatsCards from './StatsCards';
import BulkUploadForm from './BulkUploadForm';
import FilterButtons from './FilterButtons';
import GiftCardTable from './GiftCardTable';

export default function AdminGiftCards() {
  const dispatch = useAppDispatch();
  const { codes, loading: giftCardLoading } = useAppSelector((state) => state.giftCards);
  const { items: skus } = useAppSelector((state) => state.skus);

  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkCodes, setBulkCodes] = useState('');
  const [selectedSKU, setSelectedSKU] = useState('');
  const [filter, setFilter] = useState<'all' | 'redeemed' | 'available'>('all');

  useEffect(() => {
    dispatch(fetchSKUs());
    dispatch(fetchGiftCards());
  }, [dispatch]);

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSKU || !bulkCodes.trim()) {
      alert('Please select a SKU and enter codes');
      return;
    }

    // Parse codes (one per line or comma-separated)
    const codesArray = bulkCodes
      .split(/[\n,]/)
      .map((code) => code.trim())
      .filter((code) => code.length > 0);

    if (codesArray.length === 0) {
      alert('No valid codes found');
      return;
    }

    try {
      await dispatch(
        createBulkGiftCards({
          codes: codesArray,
          skuId: selectedSKU,
        })
      ).unwrap();

      alert(`Successfully created ${codesArray.length} gift card codes`);
      setBulkCodes('');
      setSelectedSKU('');
      setShowBulkUpload(false);
      dispatch(fetchGiftCards());
    } catch (err) {
      console.error('Failed to create gift cards:', err);
      alert('Failed to create gift cards');
    }
  };

  // Filter gift cards
  const filteredCodes = codes.filter((code) => {
    if (filter === 'redeemed') return code.isRedeemed;
    if (filter === 'available') return !code.isRedeemed;
    return true;
  });

  // Stats
  const totalCodes = codes.length;
  const redeemedCodes = codes.filter((c) => c.isRedeemed).length;
  const availableCodes = totalCodes - redeemedCodes;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-down duration-normal">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-fast">Gift Card Management</h1>
              <p className="text-gray-600 animate-on-load fade-left duration-light-slow">Bulk upload and inventory tracking</p>
            </div>
            <button
              onClick={() => setShowBulkUpload(!showBulkUpload)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors animate-on-load zoom-in duration-normal"
            >
              {showBulkUpload ? 'Cancel' : '+ Bulk Upload Codes'}
            </button>
          </div>
        </div>

        <div className="animate-on-load zoom-in duration-light-slow">
          <StatsCards
            totalCodes={totalCodes}
            availableCodes={availableCodes}
            redeemedCodes={redeemedCodes}
          />
        </div>

        {showBulkUpload && (
          <div className="animate-on-load fade-up duration-normal">
            <BulkUploadForm
              bulkCodes={bulkCodes}
              selectedSKU={selectedSKU}
              skus={skus}
              loading={giftCardLoading}
              onBulkCodesChange={setBulkCodes}
              onSKUChange={setSelectedSKU}
              onSubmit={handleBulkUpload}
              onCancel={() => setShowBulkUpload(false)}
            />
          </div>
        )}

        <div className="animate-on-load fade-right duration-normal">
          <FilterButtons
            filter={filter}
            totalCodes={totalCodes}
            availableCodes={availableCodes}
            redeemedCodes={redeemedCodes}
            onFilterChange={setFilter}
          />
        </div>

        {/* Gift Card List */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-on-load fade-up duration-slow">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-on-load fade-left duration-normal">Gift Card Codes</h2>
          <div className="animate-on-load fade-right duration-light-slow">
            <GiftCardTable codes={filteredCodes} loading={giftCardLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
