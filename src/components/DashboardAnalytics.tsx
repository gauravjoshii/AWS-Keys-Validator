import React, { useState, useMemo } from 'react';
import { ValidationResult, HistoricalData } from '../types/aws';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Shield, 
  AlertTriangle,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Users,
  Globe,
  Award
} from 'lucide-react';

interface DashboardAnalyticsProps {
  results: ValidationResult[];
  historicalData: HistoricalData[];
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ 
  results, 
  historicalData 
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const analytics = useMemo(() => {
    const validResults = results.filter(r => r.isValid);
    const invalidResults = results.filter(r => !r.isValid);
    
    const avgResponseTime = results.length > 0 
      ? Math.round(results.reduce((sum, r) => sum + r.responseTime, 0) / results.length)
      : 0;
    
    const uniqueAccounts = new Set(validResults.map(r => r.account).filter(Boolean)).size;
    const uniqueRegions = new Set(results.map(r => r.credentials.region)).size;
    
    const securityScore = results.length > 0 
      ? Math.round((validResults.length / results.length) * 100)
      : 0;
    
    const oldKeys = results.filter(r => {
      const keyAge = r.keyAge || 0;
      return keyAge > 90; // Keys older than 90 days
    }).length;
    
    const fastValidations = results.filter(r => r.responseTime < 1000).length;
    
    return {
      totalCredentials: results.length,
      validCredentials: validResults.length,
      invalidCredentials: invalidResults.length,
      successRate: results.length > 0 ? Math.round((validResults.length / results.length) * 100) : 0,
      avgResponseTime,
      uniqueAccounts,
      uniqueRegions,
      securityScore,
      oldKeys,
      fastValidations,
      performanceScore: results.length > 0 ? Math.round((fastValidations / results.length) * 100) : 0
    };
  }, [results]);

  const trendData = useMemo(() => {
    const filtered = historicalData.slice(-parseInt(timeRange));
    const current = filtered[filtered.length - 1];
    const previous = filtered[filtered.length - 2];
    
    if (!current || !previous) return null;
    
    const validTrend = ((current.validCount - previous.validCount) / Math.max(previous.validCount, 1)) * 100;
    const responseTrend = ((current.averageResponseTime - previous.averageResponseTime) / Math.max(previous.averageResponseTime, 1)) * 100;
    
    return {
      validTrend: Math.round(validTrend),
      responseTrend: Math.round(responseTrend)
    };
  }, [historicalData, timeRange]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-2 rounded-lg">
            <BarChart3 className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Comprehensive insights into your AWS credentials</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-4">
            <Shield className="text-green-600 dark:text-green-400" size={32} />
            {trendData && (
              <div className={`flex items-center gap-1 text-sm font-medium ${
                trendData.validTrend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {trendData.validTrend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(trendData.validTrend)}%
              </div>
            )}
          </div>
          <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
            {analytics.successRate}%
          </div>
          <div className="text-sm text-green-600 dark:text-green-300">Success Rate</div>
          <div className="text-xs text-green-500 dark:text-green-400 mt-1">
            {analytics.validCredentials} of {analytics.totalCredentials} valid
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <Zap className="text-blue-600 dark:text-blue-400" size={32} />
            {trendData && (
              <div className={`flex items-center gap-1 text-sm font-medium ${
                trendData.responseTrend <= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {trendData.responseTrend <= 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                {Math.abs(trendData.responseTrend)}%
              </div>
            )}
          </div>
          <div className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">
            {analytics.avgResponseTime}ms
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-300">Avg Response Time</div>
          <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
            {analytics.performanceScore}% under 1s
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-4">
            <Award className="text-purple-600 dark:text-purple-400" size={32} />
            <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Score
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-2">
            {analytics.securityScore}
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-300">Security Score</div>
          <div className="text-xs text-purple-500 dark:text-purple-400 mt-1">
            Based on validation results
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="text-orange-600 dark:text-orange-400" size={32} />
            <div className="text-sm font-medium text-orange-600 dark:text-orange-400">
              Alert
            </div>
          </div>
          <div className="text-3xl font-bold text-orange-700 dark:text-orange-400 mb-2">
            {analytics.oldKeys}
          </div>
          <div className="text-sm text-orange-600 dark:text-orange-300">Old Keys (90+ days)</div>
          <div className="text-xs text-orange-500 dark:text-orange-400 mt-1">
            Need rotation
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe size={20} />
            Infrastructure Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">AWS Accounts</span>
              <span className="font-bold text-gray-900 dark:text-white">{analytics.uniqueAccounts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Regions</span>
              <span className="font-bold text-gray-900 dark:text-white">{analytics.uniqueRegions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Total Credentials</span>
              <span className="font-bold text-gray-900 dark:text-white">{analytics.totalCredentials}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Fast Validations</span>
              <span className="font-bold text-green-600 dark:text-green-400">{analytics.fastValidations}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target size={20} />
            Performance Insights
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-300">Success Rate</span>
                <span className="font-medium text-gray-900 dark:text-white">{analytics.successRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.successRate}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-300">Performance Score</span>
                <span className="font-medium text-gray-900 dark:text-white">{analytics.performanceScore}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.performanceScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-300">Security Score</span>
                <span className="font-medium text-gray-900 dark:text-white">{analytics.securityScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.securityScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
            📊 {analytics.totalCredentials} credentials analyzed
          </span>
          {analytics.oldKeys > 0 && (
            <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-3 py-1 rounded-full font-medium">
              ⚠️ {analytics.oldKeys} keys need rotation
            </span>
          )}
          {analytics.successRate === 100 && (
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full font-medium">
              ✅ Perfect validation score!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};