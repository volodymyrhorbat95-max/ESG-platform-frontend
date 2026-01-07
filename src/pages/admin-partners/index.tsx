// Admin Partner Management - CRUD for partners with attribution tracking
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPartners, createPartner, updatePartner, deletePartner } from '../../store/partnerSlice';
import PartnerForm from './PartnerForm';
import PartnerTable from './PartnerTable';

export default function AdminPartners() {
  const dispatch = useAppDispatch();
  const { partners, loading, error } = useAppSelector((state) => state.partners);

  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactPerson: '',
    phone: '',
    billingAddress: '',
  });

  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPartner) {
        await dispatch(updatePartner({ id: editingPartner.id, updates: formData })).unwrap();
      } else {
        await dispatch(createPartner(formData)).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error('Failed to save partner:', err);
    }
  };

  const handleEdit = (partner: any) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      email: partner.email,
      contactPerson: partner.contactPerson,
      phone: partner.phone || '',
      billingAddress: partner.billingAddress || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to deactivate this partner? This will not delete historical transactions.')) {
      try {
        await dispatch(deletePartner(id)).unwrap();
      } catch (err) {
        console.error('Failed to deactivate partner:', err);
      }
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    alert('Partner ID copied to clipboard!');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      contactPerson: '',
      phone: '',
      billingAddress: '',
    });
    setEditingPartner(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Partner Management</h1>
              <p className="text-gray-600">Manage partners for transaction attribution and monthly invoicing</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors cursor-pointer"
            >
              {showForm ? 'Cancel' : '+ Add New Partner'}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Partner Attribution System</h3>
          <p className="text-sm text-gray-700">
            When you create a partner, they receive a unique Partner ID. Use this ID in checkout URLs
            (<code className="bg-white px-1 rounded">?partner=ID</code>) or QR codes to automatically
            attribute transactions. Monthly reports can be generated from the Export page filtered by partner.
          </p>
        </div>

        {showForm && (
          <PartnerForm
            formData={formData}
            editingPartner={editingPartner}
            loading={loading}
            onFormDataChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        )}

        {/* Partner List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">All Partners</h2>
          <PartnerTable
            partners={partners}
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
