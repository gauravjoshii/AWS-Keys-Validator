import React from 'react';

export type PermissionProbeResult = {
  service: string;
  action: string;
  status: 'allowed' | 'denied' | 'error';
  message?: string;
};

interface PermissionProbeProps {
  results: PermissionProbeResult[];
  loading: boolean;
  onStart: () => void;
}

export const PermissionProbe: React.FC<PermissionProbeProps> = ({ results, loading, onStart }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Permission Discovery</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl shadow"
          onClick={onStart}
          disabled={loading}
        >
          {loading ? 'Probing...' : 'Probe Permissions'}
        </button>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
        This tool attempts safe, read-only API calls to common AWS services to discover what permissions your key has. No data ever leaves your browser.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left">Service</th>
              <th className="px-2 py-1 text-left">Action</th>
              <th className="px-2 py-1 text-left">Status</th>
              <th className="px-2 py-1 text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td className="px-2 py-1 font-medium">{r.service}</td>
                <td className="px-2 py-1">{r.action}</td>
                <td className="px-2 py-1">
                  {r.status === 'allowed' ? (
                    <span className="text-green-600 font-bold">✅ Allowed</span>
                  ) : r.status === 'denied' ? (
                    <span className="text-red-600 font-bold">❌ Denied</span>
                  ) : (
                    <span className="text-yellow-600 font-bold">⚠️ Error</span>
                  )}
                </td>
                <td className="px-2 py-1 text-xs text-gray-500">{r.message || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
