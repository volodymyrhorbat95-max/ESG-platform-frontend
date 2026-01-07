// SKU Localization Manager - Manage multi-market SKU localizations
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchSKULocalizations,
  createSKULocalization,
  updateSKULocalization,
  deleteSKULocalization,
  clearLocalizations,
} from '../../store/skuLocalizationSlice';

interface SKULocalizationManagerProps {
  skuId: string;
  skuCode: string;
  skuName: string;
  basePrice: number;
  onClose: () => void;
}

// Common locales with display names
const LOCALE_OPTIONS = [
  { code: 'en-US', name: 'English (US)', currency: 'USD' },
  { code: 'en-GB', name: 'English (UK)', currency: 'GBP' },
  { code: 'de-DE', name: 'German (Germany)', currency: 'EUR' },
  { code: 'fr-FR', name: 'French (France)', currency: 'EUR' },
  { code: 'it-IT', name: 'Italian (Italy)', currency: 'EUR' },
  { code: 'es-ES', name: 'Spanish (Spain)', currency: 'EUR' },
  { code: 'nl-NL', name: 'Dutch (Netherlands)', currency: 'EUR' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)', currency: 'EUR' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', currency: 'BRL' },
  { code: 'ja-JP', name: 'Japanese (Japan)', currency: 'JPY' },
  { code: 'zh-CN', name: 'Chinese (China)', currency: 'CNY' },
  { code: 'ko-KR', name: 'Korean (Korea)', currency: 'KRW' },
];

export default function SKULocalizationManager({
  skuId,
  skuCode,
  skuName,
  basePrice,
  onClose,
}: SKULocalizationManagerProps) {
  const dispatch = useAppDispatch();
  const { items: localizations, loading, error } = useAppSelector((state) => state.skuLocalizations);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    locale: '',
    localizedName: '',
    localizedDescription: '',
    localizedTerminology: '',
    currency: 'EUR',
    localizedPrice: basePrice,
  });

  useEffect(() => {
    dispatch(fetchSKULocalizations(skuId));
    return () => {
      dispatch(clearLocalizations());
    };
  }, [dispatch, skuId]);

  const resetForm = () => {
    setFormData({
      locale: '',
      localizedName: '',
      localizedDescription: '',
      localizedTerminology: '',
      currency: 'EUR',
      localizedPrice: basePrice,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(
          updateSKULocalization({
            id: editingId,
            updates: formData,
          })
        ).unwrap();
      } else {
        await dispatch(
          createSKULocalization({
            skuId,
            localization: formData,
          })
        ).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error('Failed to save localization:', err);
    }
  };

  const handleEdit = (loc: any) => {
    setFormData({
      locale: loc.locale,
      localizedName: loc.localizedName,
      localizedDescription: loc.localizedDescription || '',
      localizedTerminology: loc.localizedTerminology || '',
      currency: loc.currency,
      localizedPrice: loc.localizedPrice,
    });
    setEditingId(loc.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this localization?')) {
      try {
        await dispatch(deleteSKULocalization(id)).unwrap();
      } catch (err) {
        console.error('Failed to delete localization:', err);
      }
    }
  };

  const handleLocaleChange = (localeCode: string) => {
    const localeOption = LOCALE_OPTIONS.find((l) => l.code === localeCode);
    setFormData({
      ...formData,
      locale: localeCode,
      currency: localeOption?.currency || 'EUR',
    });
  };

  const existingLocales = localizations.map((l) => l.locale);
  const availableLocales = LOCALE_OPTIONS.filter((l) => !existingLocales.includes(l.code) || l.code === formData.locale);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Market Localizations</h2>
            <p className="text-gray-600">
              SKU: {skuCode} - {skuName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Add New Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mb-6 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors cursor-pointer"
            >
              + Add Market Localization
            </button>
          )}

          {/* Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {editingId ? 'Edit Localization' : 'New Market Localization'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Locale Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Market / Locale *
                  </label>
                  <select
                    value={formData.locale}
                    onChange={(e) => handleLocaleChange(e.target.value)}
                    required
                    disabled={!!editingId}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Select a market...</option>
                    {availableLocales.map((loc) => (
                      <option key={loc.code} value={loc.code}>
                        {loc.name} ({loc.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency *</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="EUR">EUR - Euro</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="BRL">BRL - Brazilian Real</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="CNY">CNY - Chinese Yuan</option>
                    <option value="KRW">KRW - Korean Won</option>
                    <option value="CHF">CHF - Swiss Franc</option>
                  </select>
                </div>

                {/* Localized Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localized Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.localizedName}
                    onChange={(e) => setFormData({ ...formData, localizedName: e.target.value })}
                    required
                    placeholder={skuName}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Localized Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Local Price ({formData.currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.localizedPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, localizedPrice: parseFloat(e.target.value) || 0 })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Localized Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localized Description
                  </label>
                  <textarea
                    value={formData.localizedDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, localizedDescription: e.target.value })
                    }
                    placeholder="Product description in the local language..."
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Localized Terminology */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Local Terminology / Marketing Copy
                  </label>
                  <textarea
                    value={formData.localizedTerminology}
                    onChange={(e) =>
                      setFormData({ ...formData, localizedTerminology: e.target.value })
                    }
                    placeholder="Local terminology, impact messaging, or marketing copy..."
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 cursor-pointer"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Localization' : 'Create Localization'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Localizations Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Market</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Localized Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Currency
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && localizations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Loading localizations...
                    </td>
                  </tr>
                ) : localizations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No localizations configured yet. Add one to expand to new markets.
                    </td>
                  </tr>
                ) : (
                  localizations.map((loc) => {
                    const localeInfo = LOCALE_OPTIONS.find((l) => l.code === loc.locale);
                    return (
                      <tr key={loc.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">
                            {localeInfo?.name || loc.locale}
                          </div>
                          <div className="text-sm text-gray-500">{loc.locale}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{loc.localizedName}</div>
                          {loc.localizedDescription && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {loc.localizedDescription}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{loc.currency}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {loc.localizedPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              loc.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {loc.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(loc)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(loc.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Integration Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Integration Usage</h4>
            <p className="text-sm text-gray-700">
              Use localized SKU data by adding the <code className="bg-blue-100 px-1 rounded">locale</code>{' '}
              parameter to your landing page URL:
            </p>
            <code className="block mt-2 p-2 bg-white rounded text-sm text-gray-800 border border-blue-200">
              ?sku={skuCode}&locale=it-IT
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
