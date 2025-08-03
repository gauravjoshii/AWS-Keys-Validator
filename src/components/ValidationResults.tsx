import React, { useState, useMemo } from 'react';
import { ValidationResult } from '../types/aws';
import { 
  CheckCircle, 
  XCircle, 
  Download, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Activity,
  Copy,
  ExternalLink,
  Clock,
  User,
  Building,
  Globe,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Zap
} from 'lucide-react';
import { saveAs } from 'file-saver';

interface ValidationResultsProps {
  results: ValidationResult[];
}

export const ValidationResults: React.FC<ValidationResultsProps> = ({ results }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'invalid'>('all');
  const [showSecrets, setShowSecrets] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'status' | 'responseTime' | 'account'>('status');

  const filteredResults = useMemo(() => {
    let filtered = results.filter(result => {
      const matchesSearch = 
        result.credentials.accessKeyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.arn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.account?.includes(searchTerm) ||
        result.errorMessage?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = 
        filterStatus === 'all' || 
        (filterStatus === 'valid' && result.isValid) ||
        (filterStatus === 'invalid' && !result.isValid);

      return matchesSearch && matchesFilter;
    });

    // Sort results
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'status':
          if (a.isValid === b.isValid) return 0;
          return a.isValid ? -1 : 1;
        case 'responseTime':
          return a.responseTime - b.responseTime;
        case 'account':
          const accountA = a.account || '';
          const accountB = b.account || '';
          return accountA.localeCompare(accountB);
        default:
          return 0;
      }
    });
  }, [results, searchTerm, filterStatus]);

  const exportResults = () => {
    const csvContent = [
      ['Access Key ID', 'Secret Access Key', 'Status', 'ARN', 'Account', 'User ID', 'Region', 'Error Message', 'Response Time (ms)'],
      ...results.map(result => [
        result.credentials.accessKeyId,
        result.credentials.secretAccessKey,
        result.isValid ? 'Valid' : 'Invalid',
        result.arn || '',
        result.account || '',
        result.userId || '',
        result.credentials.region || '',
        result.errorMessage || '',
        result.responseTime.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `aws-validation-results-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const maskSecret = (secret: string) => {
    if (showSecrets) return secret;
    return secret.substring(0, 8) + '•'.repeat(secret.length - 8);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Activity className="mx-auto" size={48} />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
        <p className="text-gray-600">Add AWS credentials and start validation to see results here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
              <Activity className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Validation Results</h2>
              <p className="text-sm text-gray-600">Detailed analysis of your AWS credentials</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none appearance-none bg-white text-sm w-full sm:w-auto"
              >
                <option value="status">Sort by Status</option>
                <option value="responseTime">Sort by Speed</option>
                <option value="account">Sort by Account</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by key, ARN, account..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm w-full sm:w-auto"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none appearance-none bg-white text-sm w-full sm:w-auto"
              >
                <option value="all">All Results</option>
                <option value="valid">Valid Only</option>
                <option value="invalid">Invalid Only</option>
              </select>
            </div>

            {/* Toggle Secrets */}
            <button
              onClick={() => setShowSecrets(!showSecrets)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              {showSecrets ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="hidden sm:inline">{showSecrets ? 'Hide' : 'Show'} Secrets</span>
              <span className="sm:hidden">{showSecrets ? 'Hide' : 'Show'}</span>
            </button>

            {/* Export */}
            <button
              onClick={exportResults}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        <div className="mt-4 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Showing {filteredResults.length} of {results.length} results</span>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {results.filter(r => r.isValid).length} Valid
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {results.filter(r => !r.isValid).length} Invalid
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="divide-y divide-gray-100">
        {filteredResults.map((result) => {
          const isExpanded = expandedRows.has(result.id);
          return (
            <div key={result.id} className="hover:bg-gray-50 transition-all duration-200">
              {/* Main Row */}
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Status Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                      result.isValid 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {result.isValid ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <XCircle size={16} className="text-red-600" />
                      )}
                      {result.isValid ? 'Valid' : 'Invalid'}
                    </div>

                    {/* Key Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-medium text-gray-900 truncate">
                          {result.credentials.accessKeyId}
                        </span>
                        <button
                          onClick={() => copyToClipboard(result.credentials.accessKeyId)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy Access Key"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                      
                      {/* Quick Info */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Globe size={12} />
                          {result.credentials.region}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {result.responseTime}ms
                        </span>
                        {result.account && (
                          <span className="flex items-center gap-1">
                            <Building size={12} />
                            {result.account}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {result.isValid && (
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                        <Zap size={12} className="text-green-600" />
                        <span className="text-xs font-medium text-green-700">Active</span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => toggleRowExpansion(result.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    >
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      Details
                    </button>
                  </div>
                </div>

                {/* Error Message for Invalid */}
                {!result.isValid && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Validation Failed</p>
                        <p className="text-sm text-red-700 mt-1">{result.errorMessage}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* Credential Details */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <User size={16} />
                        Credential Details
                      </h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Access Key ID</label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-sm font-mono bg-white px-3 py-2 rounded-lg border flex-1">
                              {result.credentials.accessKeyId}
                            </code>
                            <button
                              onClick={() => copyToClipboard(result.credentials.accessKeyId)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Secret Access Key</label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-sm font-mono bg-white px-3 py-2 rounded-lg border flex-1">
                              {maskSecret(result.credentials.secretAccessKey)}
                            </code>
                            <button
                              onClick={() => copyToClipboard(result.credentials.secretAccessKey)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>

                        {result.credentials.sessionToken && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Session Token</label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="text-sm font-mono bg-white px-3 py-2 rounded-lg border flex-1">
                                {showSecrets ? result.credentials.sessionToken : maskSecret(result.credentials.sessionToken)}
                              </code>
                              <button
                                onClick={() => copyToClipboard(result.credentials.sessionToken!)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Region</label>
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-2 bg-white px-3 py-2 rounded-lg border text-sm">
                              <Globe size={14} />
                              {result.credentials.region}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AWS Details */}
                    {result.isValid && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Building size={16} />
                          AWS Identity
                        </h4>
                        
                        <div className="space-y-3">
                          {result.arn && (
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">ARN</label>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="text-sm font-mono bg-white px-3 py-2 rounded-lg border flex-1 break-all">
                                  {result.arn}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(result.arn!)}
                                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                                >
                                  <Copy size={14} />
                                </button>
                              </div>
                            </div>
                          )}

                          {result.account && (
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Account ID</label>
                              <div className="mt-1">
                                <span className="inline-flex items-center gap-2 bg-white px-3 py-2 rounded-lg border text-sm font-mono">
                                  <Building size={14} />
                                  {result.account}
                                </span>
                              </div>
                            </div>
                          )}

                          {result.userId && (
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">User ID</label>
                              <div className="mt-1">
                                <span className="inline-flex items-center gap-2 bg-white px-3 py-2 rounded-lg border text-sm font-mono">
                                  <User size={14} />
                                  {result.userId}
                                </span>
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Validation Time</label>
                            <div className="mt-1">
                              <span className="inline-flex items-center gap-2 bg-white px-3 py-2 rounded-lg border text-sm">
                                <Clock size={14} />
                                {formatTimestamp(result.validatedAt)}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Response Time</label>
                            <div className="mt-1">
                              <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${
                                result.responseTime < 1000 
                                  ? 'bg-green-50 text-green-700 border-green-200' 
                                  : result.responseTime < 3000 
                                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                  : 'bg-red-50 text-red-700 border-red-200'
                              }`}>
                                <Zap size={14} />
                                {result.responseTime}ms
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredResults.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No results match your current filters.</p>
        </div>
      )}
    </div>
  );
};