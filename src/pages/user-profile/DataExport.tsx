// Data Export Component (GDPR Compliance)
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { exportUserData } from '../../store/userSlice';

interface DataExportProps {
  userId: string;
}

export default function DataExport({ userId }: DataExportProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.users);

  const handleExport = async () => {
    await dispatch(exportUserData(userId));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Download Your Data</h2>
      <p className="text-gray-600 mb-6">
        Download all your personal data in JSON format. This includes your profile information,
        account details, and terms acceptance record.
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <button
        onClick={handleExport}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Preparing Download...' : 'Download My Data (JSON)'}
      </button>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>GDPR Compliance:</strong> You have the right to access your personal data at any time.
          This export includes all information we store about you.
        </p>
      </div>
    </div>
  );
}
