// Admin Merchant Management - CRUD for merchants with Stripe Connect linking
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMerchants, createMerchant, updateMerchant, deleteMerchant } from '../../store/merchantSlice';
import MerchantForm from './MerchantForm';
import MerchantTable from './MerchantTable';

export default function AdminMerchants() {
  const dispatch = useAppDispatch();
  const { items: merchants, loading, error } = useAppSelector((state) => state.merchants);

  const [showForm, setShowForm] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    stripeAccountId: '',
  });

  useEffect(() => {
    dispatch(fetchMerchants());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        stripeAccountId: formData.stripeAccountId || null,
      };

      if (editingMerchant) {
        await dispatch(updateMerchant({ id: editingMerchant.id, updates: submitData })).unwrap();
      } else {
        await dispatch(createMerchant(submitData)).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error('Failed to save merchant:', err);
    }
  };

  const handleEdit = (merchant: any) => {
    setEditingMerchant(merchant);
    setFormData({
      name: merchant.name,
      email: merchant.email,
      stripeAccountId: merchant.stripeAccountId || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to deactivate this merchant? This will not delete historical transactions.')) {
      try {
        await dispatch(deleteMerchant(id)).unwrap();
      } catch (err) {
        console.error('Failed to deactivate merchant:', err);
      }
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    alert('Merchant ID copied to clipboard!');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      stripeAccountId: '',
    });
    setEditingMerchant(null);
    setShowForm(false);
  };

  // Stats
  const totalMerchants = merchants.length;
  const activeMerchants = merchants.filter((m) => m.isActive).length;
  const stripeConnected = merchants.filter((m) => m.stripeAccountId).length;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-on-load fade-down duration-normal">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-on-load fade-right duration-fast">Merchant Management</h1>
              <p className="text-gray-600 animate-on-load fade-left duration-light-slow">Manage merchants and Stripe Connect accounts for split payments</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors cursor-pointer animate-on-load zoom-in duration-slow"
            >
              {showForm ? 'Cancel' : '+ Add New Merchant'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white animate-on-load fade-up duration-fast">
            <p className="text-sm opacity-90 mb-2">Total Merchants</p>
            <p className="text-4xl font-bold">{totalMerchants}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white animate-on-load fade-up duration-normal">
            <p className="text-sm opacity-90 mb-2">Active Merchants</p>
            <p className="text-4xl font-bold">{activeMerchants}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white animate-on-load fade-up duration-light-slow">
            <p className="text-sm opacity-90 mb-2">Stripe Connected</p>
            <p className="text-4xl font-bold">{stripeConnected}</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 animate-on-load zoom-in duration-slow">
          <h3 className="font-semibold text-purple-800 mb-2">Stripe Split Payments</h3>
          <p className="text-sm text-gray-700">
            When a merchant has a connected Stripe account, payments are automatically split:
            <strong className="text-purple-700"> 90% to merchant, 10% platform fee</strong>.
            The merchant ID (<code className="bg-white px-1 rounded">?merchant=ID</code>) in checkout URLs
            enables wallet tracking and split payments.
          </p>
        </div>

        {showForm && (
          <div className="animate-on-load fade-up duration-normal">
            <MerchantForm
              formData={formData}
              editingMerchant={editingMerchant}
              loading={loading}
              onFormDataChange={setFormData}
              onSubmit={handleSubmit}
              onCancel={resetForm}
            />
          </div>
        )}

        {/* Merchant List */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-on-load fade-up duration-very-slow">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">All Merchants</h2>
          <MerchantTable
            merchants={merchants}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCopyId={handleCopyId}
          />
        </div>
      </div>
    </div>
  );
}
