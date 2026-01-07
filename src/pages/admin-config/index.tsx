// Admin Config Page - Manage global configuration (CURRENT_CSR_PRICE)
// CRITICAL: Follows end-to-end data flow - NO direct API calls
// Flow: dispatch → Redux → API → Backend → Database → Redux → useSelector → UI

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllConfigs, updateConfigValue } from '../../store/configSlice';

export default function AdminConfig() {
  const dispatch = useAppDispatch();
  const { configs, currentCSRPrice, loading, error } = useAppSelector((state) => state.config);
  const token = localStorage.getItem('csr26_admin_token') || '';

  const [editMode, setEditMode] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');

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
  }, [currentCSRPrice, configs]);

  const handleUpdate = async () => {
    // Validation
    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setValidationError('Price must be a positive number');
      return;
    }

    setValidationError('');

    // Dispatch update (following critical rule)
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

  if (loading && configs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Global Configuration</h1>
          <p className="text-gray-600">
            Manage system-wide settings. Changes to CURRENT_CSR_PRICE affect all future transaction calculations.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">Error: {error}</p>
          </div>
        )}

        {/* CURRENT_CSR_PRICE Configuration */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Current CSR Price</h2>
              <p className="text-sm text-gray-600 mt-1">Price per kilogram of plastic removed (in EUR)</p>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Edit Price
              </button>
            )}
          </div>

          {!editMode ? (
            // View Mode
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Current Price</p>
                <p className="text-6xl font-bold text-green-600 mb-2">
                  €{currentCSRPrice !== null ? currentCSRPrice.toFixed(2) : '0.00'}
                </p>
                <p className="text-xl text-gray-700">per kilogram</p>

                {description && (
                  <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700">{description}</p>
                  </div>
                )}

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800 font-medium">
                    ⚠️ This price is used for all CLAIM, PAY, and GIFT_CARD transaction calculations
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  New Price (EUR/kg) *
                </label>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  min="0"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className={`w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    validationError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.11"
                />
                {validationError && <p className="text-red-500 text-sm mt-1">{validationError}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Current price per kg of plastic removed (in EUR). Used for dynamic impact calculation."
                />
              </div>

              {/* Warning */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold mb-2">⚠️ Critical Warning</p>
                <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                  <li>This change affects ALL FUTURE transaction calculations</li>
                  <li>Existing transactions remain unchanged (already calculated)</li>
                  <li>
                    Impact formula: <code className="bg-red-100 px-1 rounded">kg = amount ÷ CURRENT_CSR_PRICE</code>
                  </li>
                  <li>Example: €25 at €0.11/kg = 227.27kg | €25 at €0.15/kg = 166.67kg</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Calculation Examples */}
        {currentCSRPrice !== null && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Calculation Examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">€2.50 Transaction</p>
                <p className="text-2xl font-bold text-gray-800">{(2.5 / currentCSRPrice).toFixed(2)} kg</p>
                <p className="text-xs text-gray-500 mt-1">2.50 ÷ {currentCSRPrice.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">€10.00 Transaction</p>
                <p className="text-2xl font-bold text-gray-800">{(10 / currentCSRPrice).toFixed(2)} kg</p>
                <p className="text-xs text-gray-500 mt-1">10.00 ÷ {currentCSRPrice.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">€25.00 Transaction</p>
                <p className="text-2xl font-bold text-gray-800">{(25 / currentCSRPrice).toFixed(2)} kg</p>
                <p className="text-xs text-gray-500 mt-1">25.00 ÷ {currentCSRPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
