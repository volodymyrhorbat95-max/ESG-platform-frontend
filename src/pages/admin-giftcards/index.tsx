// Admin Gift Card Management - Bulk create, view, and invalidate codes
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchGiftCards,
  createBulkGiftCards,
  generateGiftCards,
  invalidateGiftCard,
  invalidateGiftCardsBulk,
} from '../../store/giftCardSlice';
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
  const [uploadMode, setUploadMode] = useState<'generate' | 'manual'>('generate');
  const [quantity, setQuantity] = useState(10);
  const [bulkCodes, setBulkCodes] = useState('');
  const [selectedSKU, setSelectedSKU] = useState('');
  const [filter, setFilter] = useState<'all' | 'redeemed' | 'available'>('all');
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchSKUs());
    dispatch(fetchGiftCards());
  }, [dispatch]);

  // Clear selected codes when filter changes
  useEffect(() => {
    setSelectedCodes([]);
  }, [filter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSKU) {
      alert('Please select a SKU');
      return;
    }

    try {
      if (uploadMode === 'generate') {
        if (quantity <= 0 || quantity > 1000) {
          alert('Quantity must be between 1 and 1000');
          return;
        }
        await dispatch(generateGiftCards({ quantity, skuId: selectedSKU })).unwrap();
        alert(`Successfully generated ${quantity} gift card codes`);
      } else {
        // Parse codes (one per line or comma-separated)
        const codesArray = bulkCodes
          .split(/[\n,]/)
          .map((code) => code.trim())
          .filter((code) => code.length > 0);

        if (codesArray.length === 0) {
          alert('No valid codes found');
          return;
        }

        await dispatch(createBulkGiftCards({ codes: codesArray, skuId: selectedSKU })).unwrap();
        alert(`Successfully created ${codesArray.length} gift card codes`);
      }

      // Reset form
      setQuantity(10);
      setBulkCodes('');
      setSelectedSKU('');
      setShowBulkUpload(false);
      dispatch(fetchGiftCards());
    } catch (err) {
      console.error('Failed to create gift cards:', err);
      alert('Failed to create gift cards');
    }
  };

  const handleInvalidate = async (code: string) => {
    if (!window.confirm(`Are you sure you want to invalidate code "${code}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await dispatch(invalidateGiftCard(code)).unwrap();
      setSelectedCodes((prev) => prev.filter((c) => c !== code));
      dispatch(fetchGiftCards());
    } catch (err) {
      console.error('Failed to invalidate gift card:', err);
      alert('Failed to invalidate gift card');
    }
  };

  const handleBulkInvalidate = async () => {
    if (selectedCodes.length === 0) {
      alert('Please select codes to invalidate');
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to invalidate ${selectedCodes.length} codes? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await dispatch(invalidateGiftCardsBulk(selectedCodes)).unwrap();
      setSelectedCodes([]);
      dispatch(fetchGiftCards());
      alert(`Successfully invalidated ${selectedCodes.length} codes`);
    } catch (err) {
      console.error('Failed to invalidate gift cards:', err);
      alert('Failed to invalidate gift cards');
    }
  };

  const handleSelectCode = (code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      // Select all available (non-redeemed) codes in filtered list
      const availableCodes = filteredCodes.filter((c) => !c.isRedeemed).map((c) => c.code);
      setSelectedCodes(availableCodes);
    } else {
      setSelectedCodes([]);
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
    <div className=" py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-down duration-normal">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-fast">
                Gift Card Management
              </h1>
              <p className="text-gray-600 animate-on-load fade-left duration-light-slow">
                Bulk create codes and inventory tracking
              </p>
            </div>
            <button
              onClick={() => setShowBulkUpload(!showBulkUpload)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors animate-on-load zoom-in duration-normal"
            >
              {showBulkUpload ? 'Cancel' : '+ Create Codes'}
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
              mode={uploadMode}
              quantity={quantity}
              bulkCodes={bulkCodes}
              selectedSKU={selectedSKU}
              skus={skus}
              loading={giftCardLoading}
              onModeChange={setUploadMode}
              onQuantityChange={setQuantity}
              onBulkCodesChange={setBulkCodes}
              onSKUChange={setSelectedSKU}
              onSubmit={handleSubmit}
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

        {/* Bulk Actions */}
        {selectedCodes.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex justify-between items-center animate-on-load fade-up duration-fast">
            <span className="text-orange-800 font-medium">
              {selectedCodes.length} code{selectedCodes.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCodes([])}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Selection
              </button>
              <button
                onClick={handleBulkInvalidate}
                disabled={giftCardLoading}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
              >
                {giftCardLoading ? 'Invalidating...' : `Invalidate ${selectedCodes.length} Codes`}
              </button>
            </div>
          </div>
        )}

        {/* Gift Card List */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-on-load fade-up duration-slow">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-on-load fade-left duration-normal">
            Gift Card Codes
          </h2>
          <div className="animate-on-load fade-right duration-light-slow">
            <GiftCardTable
              codes={filteredCodes}
              loading={giftCardLoading}
              selectedCodes={selectedCodes}
              onInvalidate={handleInvalidate}
              onSelectCode={handleSelectCode}
              onSelectAll={handleSelectAll}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
