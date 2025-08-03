import React from 'react';
import { ValidationResult } from '../types/aws';
import { 
  TrendingUp, 
  Clock, 
  Globe, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Zap,
  Shield
} from 'lucide-react';

interface StatsOverviewProps {
  results: ValidationResult[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ results }) => {
  const validResults = results.filter(r => r.isValid);
  const invalidResults = results.filter(r => !r.isValid);
  
  const avgResponseTime = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.responseTime, 0) / results.length)
    : 0;
    
  const uniqueAccounts = new Set(validResults.map(r => r.account).filter(Boolean)).size;
  const uniqueRegions = new Set(results.map(r => r.credentials.region)).size;
  
  const fastestValidation = results.length > 0 
    ? Math.min(...results.map(r => r.responseTime))
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">📊 Validation Overview</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Zap size={16} />
          <span>Real-time Analytics</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="text-green-600" size={24} />
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
              {results.length > 0 ? Math.round((validResults.length / results.length) * 100) : 0}%
            </span>
          </div>
          <div className="text-2xl font-bold text-green-700">{validResults.length}</div>
          <div className="text-sm text-green-600">Valid Keys</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="text-red-600" size={24} />
            <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">
              {results.length > 0 ? Math.round((invalidResults.length / results.length) * 100) : 0}%
            </span>
          </div>
          <div className="text-2xl font-bold text-red-700">{invalidResults.length}</div>
          <div className="text-sm text-red-600">Invalid Keys</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-blue-600" size={24} />
            <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
              avg
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{avgResponseTime}</div>
          <div className="text-sm text-blue-600">ms Response</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Globe className="text-purple-600" size={24} />
            <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded-full">
              unique
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-700">{uniqueAccounts}</div>
          <div className="text-sm text-purple-600">AWS Accounts</div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-gray-600" size={18} />
            <h3 className="font-semibold text-gray-900">Performance</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Fastest Response:</span>
              <span className="font-medium text-gray-900">{fastestValidation}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Response:</span>
              <span className="font-medium text-gray-900">{avgResponseTime}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Processed:</span>
              <span className="font-medium text-gray-900">{results.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="text-gray-600" size={18} />
            <h3 className="font-semibold text-gray-900">Security</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate:</span>
              <span className="font-medium text-green-600">
                {results.length > 0 ? Math.round((validResults.length / results.length) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Regions Tested:</span>
              <span className="font-medium text-gray-900">{uniqueRegions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Accounts Found:</span>
              <span className="font-medium text-gray-900">{uniqueAccounts}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-gray-600" size={18} />
            <h3 className="font-semibold text-gray-900">Issues</h3>
          </div>
          <div className="space-y-2 text-sm">
            {invalidResults.length > 0 ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Invalid Keys:</span>
                  <span className="font-medium text-red-600">{invalidResults.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Error Rate:</span>
                  <span className="font-medium text-red-600">
                    {Math.round((invalidResults.length / results.length) * 100)}%
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-2">
                <CheckCircle2 className="text-green-500 mx-auto mb-1" size={20} />
                <span className="text-green-600 font-medium">All Keys Valid!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            💡 Tip: Export results for detailed analysis
          </span>
          {validResults.length > 0 && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
              ✅ {validResults.length} credentials ready to use
            </span>
          )}
          {invalidResults.length > 0 && (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
              ⚠️ {invalidResults.length} credentials need attention
            </span>
          )}
        </div>
      </div>
    </div>
  );
};