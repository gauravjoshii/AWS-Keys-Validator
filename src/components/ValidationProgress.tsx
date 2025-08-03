import React from 'react';
import { CheckCircle, XCircle, Clock, Activity } from 'lucide-react';

interface ValidationProgressProps {
  stats: {
    total: number;
    valid: number;
    invalid: number;
    pending: number;
    completed: number;
    validPercentage: number;
    invalidPercentage: number;
    completedPercentage: number;
  };
  isValidating: boolean;
}

export const ValidationProgress: React.FC<ValidationProgressProps> = ({ stats, isValidating }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Validation Progress</h2>
        {isValidating && (
          <div className="flex items-center gap-2 text-orange-600">
            <Activity className="animate-spin" size={20} />
            <span className="font-medium text-sm sm:text-base">Validating...</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{stats.completedPercentage}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, stats.completedPercentage))}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Activity className="text-gray-600" size={24} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <div className="text-2xl font-bold text-green-700">{stats.valid}</div>
          <div className="text-sm text-green-600">Valid ({stats.validPercentage}%)</div>
        </div>

        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <XCircle className="text-red-600" size={24} />
          </div>
          <div className="text-2xl font-bold text-red-700">{stats.invalid}</div>
          <div className="text-sm text-red-600">Invalid ({stats.invalidPercentage}%)</div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="text-blue-600" size={24} />
          </div>
          <div className="text-2xl font-bold text-blue-700">{stats.pending}</div>
          <div className="text-sm text-blue-600">Pending</div>
        </div>
      </div>

      {/* Detailed Progress */}
      {stats.total > 0 && (
        <div className="mt-4 sm:mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Valid Keys</span>
            <span className="font-medium text-green-700">{stats.valid}/{stats.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, stats.validPercentage))}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Invalid Keys</span>
            <span className="font-medium text-red-700">{stats.invalid}/{stats.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, stats.invalidPercentage))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};