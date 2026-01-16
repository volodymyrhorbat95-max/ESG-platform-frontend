// Admin SKU Management - CRUD for all 4 SKU types
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSKUs, createSKU, updateSKU, deleteSKU, toggleSKUActive } from '../../store/skuSlice';
import SKUForm from './SKUForm';
import SKUTable from './SKUTable';
import SKULocalizationManager from './SKULocalizationManager';
import ImpactPreviewCalculator from './ImpactPreviewCalculator';
import BulkImportModal from './BulkImportModal';

export default function AdminSKUs() {
  const dispatch = useAppDispatch();
  const { items: skus, loading, error } = useAppSelector((state) => state.skus);

  const [showForm, setShowForm] = useState(false);
  const [editingSKU, setEditingSKU] = useState<any | null>(null);
  const [localizingSKU, setLocalizingSKU] = useState<any | null>(null);
  const [previewingSKU, setPreviewingSKU] = useState<any | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    price: 0,
    paymentMode: 'CLAIM' as 'CLAIM' | 'PAY' | 'GIFT_CARD' | 'ALLOCATION',
    requiresValidation: false,
    corsairThreshold: 10.00, // Global threshold - fixed at €10
    impactMultiplier: 1.0, // Default 1.0 - only change for special campaigns (e.g., 10x hero brand)
    productWeight: undefined as number | undefined, // Section 5.1: Actual grams for physical products
    description: '', // Section 5.1: Merchant-facing description
  });

  useEffect(() => {
    dispatch(fetchSKUs());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSKU) {
        await dispatch(updateSKU({ id: editingSKU.id, updates: formData })).unwrap();
      } else {
        await dispatch(createSKU(formData)).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error('Failed to save SKU:', err);
    }
  };

  const handleEdit = (sku: any) => {
    setEditingSKU(sku);
    setFormData({
      code: sku.code,
      name: sku.name,
      price: sku.price,
      paymentMode: sku.paymentMode,
      requiresValidation: sku.requiresValidation,
      corsairThreshold: sku.corsairThreshold || 10.00, // Default to €10 if not set
      impactMultiplier: sku.impactMultiplier,
      productWeight: sku.productWeight,
      description: sku.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this SKU?')) {
      try {
        await dispatch(deleteSKU(id)).unwrap();
      } catch (err) {
        console.error('Failed to delete SKU:', err);
      }
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await dispatch(toggleSKUActive({ id, isActive })).unwrap();
    } catch (err) {
      console.error('Failed to toggle SKU status:', err);
    }
  };

  const handleDuplicate = (sku: any) => {
    // Populate form with existing SKU data but with modified code
    const newCode = `${sku.code}-COPY`;
    setFormData({
      code: newCode,
      name: `${sku.name} (Copy)`,
      price: sku.price,
      paymentMode: sku.paymentMode,
      requiresValidation: sku.requiresValidation,
      corsairThreshold: sku.corsairThreshold || 10.00,
      impactMultiplier: sku.impactMultiplier,
      productWeight: sku.productWeight,
      description: sku.description || '',
    });
    setEditingSKU(null); // Not editing, creating new
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      price: 0,
      paymentMode: 'CLAIM',
      requiresValidation: false,
      corsairThreshold: 10.00, // Global threshold - fixed at €10
      impactMultiplier: 1.0, // Default 1.0 - only change for special campaigns (e.g., 10x hero brand)
      productWeight: undefined,
      description: '',
    });
    setEditingSKU(null);
    setShowForm(false);
  };

  return (
    <div className=" py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-down duration-normal">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-fast">SKU Management</h1>
              <p className="text-gray-600 animate-on-load fade-left duration-light-slow">Manage all 4 business model types</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkImport(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors animate-on-load zoom-in duration-normal flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Import CSV
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors animate-on-load zoom-in duration-normal"
              >
                {showForm ? 'Cancel' : '+ Create New SKU'}
              </button>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="animate-on-load fade-up duration-normal">
            <SKUForm
              formData={formData}
              editingSKU={editingSKU}
              loading={loading}
              onFormDataChange={setFormData}
              onSubmit={handleSubmit}
              onCancel={resetForm}
            />
          </div>
        )}

        {/* SKU List */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-on-load fade-up duration-slow">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-on-load fade-right duration-normal">All SKUs</h2>
          <div className="animate-on-load fade-left duration-light-slow">
            <SKUTable
              skus={skus}
              loading={loading}
              error={error}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onManageLocalizations={setLocalizingSKU}
              onToggleActive={handleToggleActive}
              onDuplicate={handleDuplicate}
              onPreviewImpact={setPreviewingSKU}
            />
          </div>
        </div>

        {/* SKU Localization Manager Modal */}
        {localizingSKU && (
          <SKULocalizationManager
            skuId={localizingSKU.id}
            skuCode={localizingSKU.code}
            skuName={localizingSKU.name}
            basePrice={Number(localizingSKU.price)}
            onClose={() => setLocalizingSKU(null)}
          />
        )}

        {/* Impact Preview Calculator Modal - Section 9.3 */}
        {previewingSKU && (
          <ImpactPreviewCalculator
            isOpen={!!previewingSKU}
            onClose={() => setPreviewingSKU(null)}
            sku={previewingSKU}
          />
        )}

        {/* Bulk Import Modal - Section 9.3 */}
        <BulkImportModal
          isOpen={showBulkImport}
          onClose={() => setShowBulkImport(false)}
          onSuccess={() => {
            dispatch(fetchSKUs());
            setShowBulkImport(false);
          }}
        />
      </div>
    </div>
  );
}
