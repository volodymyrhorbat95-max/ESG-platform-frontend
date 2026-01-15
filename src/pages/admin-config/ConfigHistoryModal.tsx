// Config History Modal Component
// Displays change history for a specific configuration setting
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchConfigHistory } from '../../store/configSlice';

interface ConfigHistoryModalProps {
  configKey: string;
  configName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfigHistoryModal({
  configKey,
  configName,
  isOpen,
  onClose,
}: ConfigHistoryModalProps) {
  const dispatch = useAppDispatch();
  const { configHistory, historyLoading } = useAppSelector((state) => state.config);
  const token = localStorage.getItem('csr26_admin_token') || '';

  useEffect(() => {
    if (isOpen && token) {
      dispatch(fetchConfigHistory({ key: configKey, token }));
    }
  }, [isOpen, configKey, token, dispatch]);

  if (!isOpen) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatValue = (value: string | null) => {
    if (value === null) return '(not set)';
    return value;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-on-load fade-down duration-fast">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden animate-on-load zoom-in duration-normal">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white animate-on-load fade-right duration-fast">
                Change History
              </h2>
              <p className="text-blue-100 text-sm mt-1 animate-on-load fade-left duration-light-slow">
                {configName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-colors p-2 rounded-lg hover:bg-white/10 animate-on-load zoom-in duration-light-slow"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          {historyLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading history...</p>
              </div>
            </div>
          ) : configHistory.length === 0 ? (
            <div className="text-center py-12 animate-on-load fade-up duration-normal">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">No change history yet</p>
              <p className="text-gray-500 text-sm mt-2">Changes to this configuration will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {configHistory.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`bg-gray-50 rounded-lg p-4 border-l-4 ${
                    entry.oldValue === null ? 'border-green-500' : 'border-blue-500'
                  } animate-on-load fade-up duration-normal`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {entry.oldValue === null ? (
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                          CREATED
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                          UPDATED
                        </span>
                      )}
                      <span className="text-gray-600 text-sm font-medium">
                        by {entry.changedBy}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {formatDateTime(entry.changedAt)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {entry.oldValue !== null && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1 font-medium">Previous Value</p>
                        <p className="text-sm text-gray-700 bg-white px-3 py-2 rounded border border-gray-200 font-mono">
                          {formatValue(entry.oldValue)}
                        </p>
                      </div>
                    )}
                    <div className={entry.oldValue === null ? 'col-span-2' : ''}>
                      <p className="text-xs text-gray-600 mb-1 font-medium">New Value</p>
                      <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded border border-gray-300 font-mono font-semibold">
                        {formatValue(entry.newValue)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors animate-on-load zoom-in duration-light-slow"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
