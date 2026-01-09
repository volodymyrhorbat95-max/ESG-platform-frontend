// Admin Config Page - Manage global configuration (CURRENT_CSR_PRICE)
// CRITICAL: Follows end-to-end data flow - NO direct API calls
// Flow: dispatch → Redux → API → Backend → Database → Redux → useSelector → UI

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllConfigs, updateConfigValue } from '../../store/configSlice';
import CSRPriceSection from './CSRPriceSection';
import PlatformFeeSection from './PlatformFeeSection';
import StripeConfigNote from './StripeConfigNote';
import CalculationExamples from './CalculationExamples';

export default function AdminConfig() {
  const dispatch = useAppDispatch();
  const { configs, currentCSRPrice, loading, error } = useAppSelector((state) => state.config);
  const token = localStorage.getItem('csr26_admin_token') || '';

  // CSR Price state
  const [editMode, setEditMode] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');

  // Platform fee state
  const [editFeeMode, setEditFeeMode] = useState(false);
  const [newFee, setNewFee] = useState('');
  const [feeDescription, setFeeDescription] = useState('');
  const [feeValidationError, setFeeValidationError] = useState('');

  // Get platform fee from configs
  const platformFeeConfig = configs.find((c) => c.key === 'PLATFORM_FEE_PERCENTAGE');
  const platformFee = platformFeeConfig ? parseFloat(platformFeeConfig.value) : null;

  // Step 1: Fetch all configs on mount (following critical rule)
  useEffect(() => {
    if (token) {
      dispatch(fetchAllConfigs(token));
    }
  }, [dispatch, token]);

  // Step 2: Set form values when config is loaded
  useEffect(() => {
    if (currentCSRPrice !== null) {
      setNewPrice(currentCSRPrice.toString());
    }
    const csrConfig = configs.find((c) => c.key === 'CURRENT_CSR_PRICE');
    if (csrConfig) {
      setDescription(csrConfig.description || '');
    }
    // Set platform fee values
    if (platformFee !== null) {
      setNewFee((platformFee * 100).toString()); // Convert decimal to percentage
    }
    if (platformFeeConfig) {
      setFeeDescription(platformFeeConfig.description || '');
    }
  }, [currentCSRPrice, configs, platformFee, platformFeeConfig]);

  // CSR Price handlers
  const handleUpdate = async () => {
    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setValidationError('Price must be a positive number');
      return;
    }

    setValidationError('');

    const result = await dispatch(
      updateConfigValue({
        key: 'CURRENT_CSR_PRICE',
        value: newPrice,
        description: description || undefined,
        token,
      })
    );

    if (updateConfigValue.fulfilled.match(result)) {
      setEditMode(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    if (currentCSRPrice !== null) {
      setNewPrice(currentCSRPrice.toString());
    }
    setValidationError('');
  };

  // Platform fee handlers
  const handleFeeUpdate = async () => {
    const feeNum = parseFloat(newFee);
    if (isNaN(feeNum) || feeNum < 0 || feeNum > 100) {
      setFeeValidationError('Fee must be between 0 and 100');
      return;
    }

    setFeeValidationError('');

    const result = await dispatch(
      updateConfigValue({
        key: 'PLATFORM_FEE_PERCENTAGE',
        value: (feeNum / 100).toString(), // Convert percentage to decimal
        description: feeDescription || undefined,
        token,
      })
    );

    if (updateConfigValue.fulfilled.match(result)) {
      setEditFeeMode(false);
    }
  };

  const handleFeeCancel = () => {
    setEditFeeMode(false);
    if (platformFee !== null) {
      setNewFee((platformFee * 100).toString());
    }
    setFeeValidationError('');
  };

  if (loading && configs.length === 0) {
    return (
      <div className=" flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-down duration-normal">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-fast">Global Configuration</h1>
          <p className="text-gray-600 animate-on-load fade-left duration-light-slow">
            Manage system-wide settings. Changes to CURRENT_CSR_PRICE affect all future transaction calculations.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-on-load zoom-in duration-fast">
            <p className="text-red-800 font-medium">Error: {error}</p>
          </div>
        )}

        {/* CSR Price Section */}
        <CSRPriceSection
          currentCSRPrice={currentCSRPrice}
          description={description}
          editMode={editMode}
          newPrice={newPrice}
          validationError={validationError}
          loading={loading}
          onEditModeChange={setEditMode}
          onPriceChange={setNewPrice}
          onDescriptionChange={setDescription}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
        />

        {/* Platform Fee Section */}
        <PlatformFeeSection
          platformFee={platformFee}
          feeDescription={feeDescription}
          editFeeMode={editFeeMode}
          newFee={newFee}
          feeValidationError={feeValidationError}
          loading={loading}
          onEditModeChange={setEditFeeMode}
          onFeeChange={setNewFee}
          onDescriptionChange={setFeeDescription}
          onUpdate={handleFeeUpdate}
          onCancel={handleFeeCancel}
        />

        {/* Stripe Configuration Note */}
        <StripeConfigNote />

        {/* Calculation Examples */}
        {currentCSRPrice !== null && (
          <CalculationExamples currentCSRPrice={currentCSRPrice} />
        )}
      </div>
    </div>
  );
}
