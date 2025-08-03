import React, { useState, useRef } from 'react';
import { Upload, Plus, FileText, Trash2, Play } from 'lucide-react';
import { AWSCredentials } from '../types/aws';
import Papa from 'papaparse';

interface CredentialsInputProps {
  onCredentialsChange: (credentials: AWSCredentials[]) => void;
  credentials: AWSCredentials[];
  onValidateIndividual?: (credential: AWSCredentials) => void;
}

export const CredentialsInput: React.FC<CredentialsInputProps> = ({
  onCredentialsChange,
  credentials,
  onValidateIndividual
}) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'bulk' | 'upload'>('bulk');
  const [bulkInput, setBulkInput] = useState('');
  const [manualForm, setManualForm] = useState({
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: '',
    region: 'us-east-1'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleBulkInput = () => {
    try {
      const lines = bulkInput.trim().split('\n').filter(line => line.trim());
      const newCredentials: AWSCredentials[] = [];

      lines.forEach((line, index) => {
        const parts = line.split(',').map(part => part.trim());
        
        if (parts.length >= 2) {
          newCredentials.push({
            id: generateId(),
            accessKeyId: parts[0],
            secretAccessKey: parts[1],
            sessionToken: parts[2] || undefined,
            region: parts[3] || 'us-east-1'
          });
        }
      });

      onCredentialsChange([...credentials, ...newCredentials]);
      setBulkInput('');
    } catch (error) {
      alert('Error parsing bulk input. Please check the format.');
    }
  };

  const handleManualAdd = () => {
    if (manualForm.accessKeyId && manualForm.secretAccessKey) {
      const newCredential: AWSCredentials = {
        id: generateId(),
        accessKeyId: manualForm.accessKeyId,
        secretAccessKey: manualForm.secretAccessKey,
        sessionToken: manualForm.sessionToken || undefined,
        region: manualForm.region
      };

      onCredentialsChange([...credentials, newCredential]);
      setManualForm({
        accessKeyId: '',
        secretAccessKey: '',
        sessionToken: '',
        region: 'us-east-1'
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const newCredentials: AWSCredentials[] = results.data
            .filter((row: any) => row.accessKeyId && row.secretAccessKey)
            .map((row: any) => ({
              id: generateId(),
              accessKeyId: row.accessKeyId || row.access_key_id || row.AccessKeyId,
              secretAccessKey: row.secretAccessKey || row.secret_access_key || row.SecretAccessKey,
              sessionToken: row.sessionToken || row.session_token || row.SessionToken || undefined,
              region: row.region || row.Region || 'us-east-1'
            }));

          onCredentialsChange([...credentials, ...newCredentials]);
        } catch (error) {
          alert('Error parsing CSV file. Please check the format.');
        }
      },
      error: () => {
        alert('Error reading file. Please ensure it\'s a valid CSV file.');
      }
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeCredential = (id: string) => {
    onCredentialsChange(credentials.filter(cred => cred.id !== id));
  };

  const clearAll = () => {
    onCredentialsChange([]);
    setBulkInput('');
  };

  const lineCount = bulkInput.trim() ? bulkInput.trim().split('\n').filter(line => line.trim()).length : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">AWS Credentials Input</h2>
        {credentials.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Clear All ({credentials.length})</span>
            <span className="sm:hidden">Clear ({credentials.length})</span>
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
        {[
          { id: 'bulk', label: 'Bulk Input', icon: FileText },
          { id: 'manual', label: 'Manual Entry', icon: Plus },
          { id: 'upload', label: 'CSV Upload', icon: Upload }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 border-b-2 transition-all duration-200 font-medium whitespace-nowrap text-sm sm:text-base ${
              activeTab === id
                ? 'border-orange-500 text-orange-600 bg-orange-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'bulk' && (
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Bulk Credentials Input
            </label>
            <div className="relative group">
              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder={`Enter credentials in format:
ACCESS_KEY_ID,SECRET_ACCESS_KEY,SESSION_TOKEN(optional),REGION(optional)

Example:
AKIAIOSFODNN7EXAMPLE,wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY,token123,us-west-2
AKIAI44QH8DHBEXAMPLE,je7MtGbClwBF/2Zp9Utk/h3yCo8nvbEXAMPLEKEY,,eu-west-1`}
                rows={10}
                className="w-full rounded-xl border-2 border-gray-200 px-3 sm:px-4 py-3 sm:py-4 text-xs leading-relaxed focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none resize-none font-mono bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-gray-50 hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-lg group-hover:shadow-md"
                style={{ 
                  wordBreak: 'break-all',
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word'
                }}
              />
              {lineCount > 0 && (
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                  {lineCount} {lineCount === 1 ? 'line' : 'lines'}
                </div>
              )}
            </div>
            
            {/* Improved Help Section */}
            <div className="mt-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-3 sm:p-4 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="font-bold text-blue-900 text-sm">📋 Format Guidelines:</div>
                  <div className="text-xs text-blue-800 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <div>
                        Each line: <code className="bg-white/70 px-2 py-1 rounded text-xs font-mono border">ACCESS_KEY,SECRET_KEY,TOKEN,REGION</code>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <div>Session token and region are <span className="font-semibold text-indigo-700">optional</span></div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <div>Default region: <code className="bg-white/70 px-2 py-1 rounded text-xs font-mono border">us-east-1</code></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Add Button */}
          <button
            onClick={handleBulkInput}
            disabled={!bulkInput.trim()}
            className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:from-orange-600 hover:via-orange-700 hover:to-red-600 disabled:from-gray-300 disabled:via-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-500 font-bold text-sm sm:text-base shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] disabled:transform-none disabled:shadow-sm flex items-center justify-center gap-3 group relative overflow-hidden animate-pulse disabled:animate-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Plus size={20} className="group-hover:rotate-180 transition-transform duration-500 relative z-10" />
            <span className="relative z-10">
              {lineCount > 0 
                ? `🚀 Add ${lineCount} Credential${lineCount === 1 ? '' : 's'} - Ready to Validate!` 
                : '📝 Add Credentials to Get Started'
              }
            </span>
          </button>
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Access Key ID *
              </label>
              <input
                type="text"
                value={manualForm.accessKeyId}
                onChange={(e) => setManualForm(prev => ({ ...prev, accessKeyId: e.target.value }))}
                placeholder="AKIAIOSFODNN7EXAMPLE"
                className="w-full rounded-xl border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none font-mono hover:border-gray-300 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Secret Access Key *
              </label>
              <input
                type="password"
                value={manualForm.secretAccessKey}
                onChange={(e) => setManualForm(prev => ({ ...prev, secretAccessKey: e.target.value }))}
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCY..."
                className="w-full rounded-xl border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none font-mono hover:border-gray-300 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Session Token (Optional)
              </label>
              <input
                type="text"
                value={manualForm.sessionToken}
                onChange={(e) => setManualForm(prev => ({ ...prev, sessionToken: e.target.value }))}
                placeholder="IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3Qtc..."
                className="w-full rounded-xl border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none font-mono hover:border-gray-300 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Region
              </label>
              <select
                value={manualForm.region}
                onChange={(e) => setManualForm(prev => ({ ...prev, region: e.target.value }))}
                className="w-full rounded-xl border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none hover:border-gray-300 transition-all duration-200"
              >
                <option value="us-east-1">US East (N. Virginia)</option>
                <option value="us-west-2">US West (Oregon)</option>
                <option value="eu-west-1">Europe (Ireland)</option>
                <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                <option value="ap-northeast-1">Asia Pacific (Tokyo)</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleManualAdd}
            disabled={!manualForm.accessKeyId || !manualForm.secretAccessKey}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:shadow-none flex items-center justify-center gap-3"
          >
            <Plus size={20} />
            Add Single Credential
          </button>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 cursor-pointer group"
               onClick={() => fileInputRef.current?.click()}>
            <Upload className="mx-auto h-16 w-16 text-gray-400 group-hover:text-orange-500 transition-colors duration-300 mb-6" />
            <div>
              <button
                type="button"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 sm:px-8 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold text-sm sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Choose CSV File
              </button>
              <p className="text-xs sm:text-sm text-gray-600 mt-4 max-w-md mx-auto px-4">
                Upload a CSV file with columns: <strong>accessKeyId</strong>, <strong>secretAccessKey</strong>, <strong>sessionToken</strong> (optional), <strong>region</strong> (optional)
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Enhanced Credentials Preview */}
      {credentials.length > 0 && (
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Loaded Credentials ({credentials.length})
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-2 sm:space-y-3 bg-gray-50 rounded-xl p-3 sm:p-4">
            {credentials.slice(0, 5).map((cred) => (
              <div key={cred.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <span className="font-mono text-sm text-gray-800 font-medium">
                      {cred.accessKeyId.substring(0, 12)}...
                    </span>
                    <span className="text-xs text-gray-500 ml-2 sm:ml-3 bg-gray-100 px-2 py-1 rounded-full">
                      {cred.region}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onValidateIndividual && (
                    <button
                      onClick={() => onValidateIndividual(cred)}
                      className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-xs font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                      title="Validate this credential"
                    >
                      <Play size={12} />
                      <span className="hidden sm:inline">Validate</span>
                    </button>
                  )}
                  <button
                    onClick={() => removeCredential(cred.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                    title="Remove this credential"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {credentials.length > 5 && (
              <div className="text-center text-xs sm:text-sm text-gray-500 py-3 bg-white rounded-lg">
                <strong>+ {credentials.length - 5} more credentials</strong>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};