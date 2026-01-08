// Admin SKU Management - CRUD for all 4 SKU types
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSKUs, createSKU, updateSKU, deleteSKU } from '../../store/skuSlice';
import SKUForm from './SKUForm';
import SKUTable from './SKUTable';
import SKULocalizationManager from './SKULocalizationManager';

export default function AdminSKUs() {
  const dispatch = useAppDispatch();
  const { items: skus, loading, error } = useAppSelector((state) => state.skus);

  const [showForm, setShowForm] = useState(false);
  const [editingSKU, setEditingSKU] = useState<any | null>(null);
  const [localizingSKU, setLocalizingSKU] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    gramsWeight: 0,
    price: 0,
    paymentMode: 'CLAIM' as 'CLAIM' | 'PAY' | 'GIFT_CARD' | 'ALLOCATION',
    requiresValidation: false,
    corsairThreshold: 10,
    impactMultiplier: 1.6,
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
      gramsWeight: sku.gramsWeight,
      price: sku.price,
      paymentMode: sku.paymentMode,
      requiresValidation: sku.requiresValidation,
      corsairThreshold: sku.corsairThreshold,
      impactMultiplier: sku.impactMultiplier,
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

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      gramsWeight: 0,
      price: 0,
      paymentMode: 'CLAIM',
      requiresValidation: false,
      corsairThreshold: 10,
      impactMultiplier: 1.6,
    });
    setEditingSKU(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-down duration-normal">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-fast">SKU Management</h1>
              <p className="text-gray-600 animate-on-load fade-left duration-light-slow">Manage all 4 business model types</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors animate-on-load zoom-in duration-normal"
            >
              {showForm ? 'Cancel' : '+ Create New SKU'}
            </button>
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
      </div>
    </div>
  );
}
