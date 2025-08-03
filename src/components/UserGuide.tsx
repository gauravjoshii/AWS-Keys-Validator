import React from 'react';
import { 
  Key, 
  Upload, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Download, 
  Clock,
  AlertTriangle,
  Zap,
  Globe,
  FileText,
  Plus,
  Eye,
  Filter
} from 'lucide-react';

export const UserGuide: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Quick Start */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <Zap className="text-green-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">🚀 Quick Start Guide</h3>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">1</div>
              <h4 className="font-semibold text-gray-900 mb-1">Add Credentials</h4>
              <p className="text-sm text-gray-600">Use bulk input, manual entry, or CSV upload</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">2</div>
              <h4 className="font-semibold text-gray-900 mb-1">Start Validation</h4>
              <p className="text-sm text-gray-600">Click validate to test all credentials</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">3</div>
              <h4 className="font-semibold text-gray-900 mb-1">Export Results</h4>
              <p className="text-sm text-gray-600">Download detailed CSV report</p>
            </div>
          </div>
        </div>
      </section>

      {/* Input Methods */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Key className="text-blue-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">📝 Input Methods</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="text-orange-500" size={20} />
              <h4 className="font-semibold text-gray-900">Bulk Input</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Paste multiple credentials at once</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <code className="text-xs text-gray-700">
                ACCESS_KEY,SECRET_KEY,TOKEN,REGION<br/>
                AKIA...,wJal...,token123,us-west-2
              </code>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Plus className="text-green-500" size={20} />
              <h4 className="font-semibold text-gray-900">Manual Entry</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Add credentials one by one with form validation</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Access Key ID (required)</li>
              <li>• Secret Access Key (required)</li>
              <li>• Session Token (optional)</li>
              <li>• Region selection</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Upload className="text-purple-500" size={20} />
              <h4 className="font-semibold text-gray-900">CSV Upload</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Upload CSV files with headers</p>
            <div className="text-xs text-gray-600">
              <strong>Required columns:</strong><br/>
              accessKeyId, secretAccessKey<br/>
              <strong>Optional:</strong> sessionToken, region
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Shield className="text-purple-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">✨ Key Features</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-500 mt-0.5" size={16} />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Bulk Validation</h4>
                <p className="text-xs text-gray-600">Validate up to 100+ credentials simultaneously with progress tracking</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Shield className="text-blue-500 mt-0.5" size={16} />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Client-Side Security</h4>
                <p className="text-xs text-gray-600">All validation happens in your browser - credentials never leave your device</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <Clock className="text-orange-500 mt-0.5" size={16} />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Real-Time Progress</h4>
                <p className="text-xs text-gray-600">Live progress tracking with detailed statistics and response times</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <Download className="text-purple-500 mt-0.5" size={16} />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Export Results</h4>
                <p className="text-xs text-gray-600">Download comprehensive CSV reports with ARNs, accounts, and error details</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
              <Filter className="text-indigo-500 mt-0.5" size={16} />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Advanced Filtering</h4>
                <p className="text-xs text-gray-600">Search and filter results by status, ARN, account, or error messages</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
              <Eye className="text-pink-500 mt-0.5" size={16} />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Secret Management</h4>
                <p className="text-xs text-gray-600">Toggle visibility of sensitive information with secure masking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Understanding Results */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-yellow-100 p-2 rounded-lg">
            <AlertTriangle className="text-yellow-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">📊 Understanding Results</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={18} />
              Valid Credentials
            </h4>
            <div className="bg-green-50 p-4 rounded-lg space-y-2">
              <p className="text-sm text-gray-700"><strong>ARN:</strong> Amazon Resource Name identifying the user/role</p>
              <p className="text-sm text-gray-700"><strong>Account:</strong> AWS account ID (12-digit number)</p>
              <p className="text-sm text-gray-700"><strong>User ID:</strong> Unique identifier for the IAM user</p>
              <p className="text-sm text-gray-700"><strong>Response Time:</strong> Validation speed in milliseconds</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <XCircle className="text-red-500" size={18} />
              Invalid Credentials
            </h4>
            <div className="bg-red-50 p-4 rounded-lg space-y-2">
              <p className="text-sm text-gray-700"><strong>Invalid Access Key:</strong> Key doesn't exist or is malformed</p>
              <p className="text-sm text-gray-700"><strong>Invalid Secret:</strong> Secret key doesn't match access key</p>
              <p className="text-sm text-gray-700"><strong>Token Expired:</strong> Session token has expired</p>
              <p className="text-sm text-gray-700"><strong>Access Denied:</strong> Insufficient permissions for STS calls</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Globe className="text-indigo-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">🎯 Best Practices</h3>
        </div>
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">🔒 Security Tips</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Use temporary credentials when possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Regularly rotate access keys</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Apply principle of least privilege</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Monitor credential usage with CloudTrail</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">⚡ Performance Tips</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Validate in batches of 50-100 credentials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Use appropriate AWS regions for faster response</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Export results for offline analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Filter results to focus on specific issues</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-2 rounded-lg">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">🔧 Troubleshooting</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">❌ Common Issues</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-mono">NetworkError</span>
                <span className="text-gray-700">Check internet connection and firewall settings</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-mono">TimeoutError</span>
                <span className="text-gray-700">Reduce batch size or check network stability</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-mono">AccessDenied</span>
                <span className="text-gray-700">Ensure credentials have STS:GetCallerIdentity permission</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};