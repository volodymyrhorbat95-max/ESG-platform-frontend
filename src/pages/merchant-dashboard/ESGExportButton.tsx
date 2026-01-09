// ESG Export Button Component
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { exportMerchantESGReport } from '../../store/merchantSlice';

interface ESGExportButtonProps {
  merchantId: string;
}

export default function ESGExportButton({ merchantId }: ESGExportButtonProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.merchants);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleExport = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date must be before end date');
      return;
    }

    await dispatch(exportMerchantESGReport({ merchantId, startDate, endDate }));
    setShowDatePicker(false);
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDatePicker(!showDatePicker)}
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed animate-on-load zoom-in duration-normal"
        disabled={loading}
      >
        {loading ? 'Exporting...' : 'Download ESG Report'}
      </button>

      {showDatePicker && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-6 z-10 min-w-[320px] animate-on-load fade-down duration-fast">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2 animate-on-load fade-right duration-very-fast">Select Report Period</h3>
            <p className="text-sm text-gray-600 mb-4 animate-on-load fade-left duration-fast">
              Choose the date range for your ESG impact report
            </p>
          </div>

          <div className="space-y-4">
            <div className="animate-on-load fade-up duration-normal">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="animate-on-load fade-down duration-light-slow">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-on-load flip-down duration-slow">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-3 mt-6 animate-on-load zoom-out duration-very-slow">
            <button
              onClick={handleExport}
              disabled={loading || !startDate || !endDate}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Exporting...' : 'Download PDF'}
            </button>
            <button
              onClick={() => {
                setShowDatePicker(false);
                setStartDate('');
                setEndDate('');
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
