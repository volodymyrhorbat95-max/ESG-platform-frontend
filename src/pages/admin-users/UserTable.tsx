// User Table Component - Display all users with actions
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  registrationLevel: 'minimal' | 'standard' | 'full';
  corsairConnectFlag: boolean;
  createdAt: string;
}

interface UserTableProps {
  users: User[];
  loading: boolean;
  onViewDetails: (userId: string) => void;
}

export default function UserTable({ users, loading, onViewDetails }: UserTableProps) {
  if (loading && users.length === 0) {
    return (
      <div className="text-center py-12 animate-on-load fade-up duration-normal">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600 animate-on-load zoom-in duration-fast">Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 animate-on-load zoom-out duration-normal">No users found</div>
    );
  }

  const getRegistrationBadge = (level: string) => {
    switch (level) {
      case 'full':
        return 'bg-green-100 text-green-800';
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'minimal':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto animate-on-load fade-up duration-normal">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-very-fast">Email</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-fast">Name</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-normal">Registration</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-light-slow">Corsair Connect</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-slow">Created</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 animate-on-load fade-down duration-slow">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 animate-on-load fade-up duration-normal">
              <td className="py-3 px-4 text-sm text-gray-800">{user.email}</td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {user.firstName || user.lastName
                  ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                  : '-'}
              </td>
              <td className="py-3 px-4 text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRegistrationBadge(
                    user.registrationLevel
                  )}`}
                >
                  {user.registrationLevel}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                {user.corsairConnectFlag ? (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                    Yes
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => onViewDetails(user.id)}
                  className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
