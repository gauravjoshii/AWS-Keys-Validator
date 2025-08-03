
import { useState } from 'react';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import { EC2Client, DescribeInstancesCommand } from '@aws-sdk/client-ec2';
import { IAMClient, ListUsersCommand } from '@aws-sdk/client-iam';
import { LambdaClient, ListFunctionsCommand } from '@aws-sdk/client-lambda';
import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { CloudWatchClient, ListMetricsCommand } from '@aws-sdk/client-cloudwatch';
import { RDSClient, DescribeDBInstancesCommand } from '@aws-sdk/client-rds';
import { SNSClient, ListTopicsCommand } from '@aws-sdk/client-sns';
import { SQSClient, ListQueuesCommand } from '@aws-sdk/client-sqs';
import { Header } from './components/Header';
import { CredentialsInput } from './components/CredentialsInput';
import { ValidationProgress } from './components/ValidationProgress';
import { ValidationResults } from './components/ValidationResults';
import { UserGuide } from './components/UserGuide';
import { StatsOverview } from './components/StatsOverview';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { AWSCredentials, ValidationResult, NotificationSettings, HistoricalData } from './types/aws';
import { AWSValidator } from './services/awsValidator';
import { PermissionProbe, PermissionProbeResult } from './components/PermissionProbe';
import { Play, RotateCcw, Key, Shield, Download, BookOpen, X, BarChart3, KeyRound } from 'lucide-react';

type TabType = 'validate' | 'permissions' | 'analytics' | 'guide';

function App() {
  // Security Trust Modal state
  const [showTrustModal, setShowTrustModal] = useState(true);
  const [credentials, setCredentials] = useState<AWSCredentials[]>([]);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enableScheduled: false,
    scheduleInterval: 'weekly',
    alertOnFailures: true
  });
  const [activeTab, setActiveTab] = useState<TabType>('validate');
  const [probeResults, setProbeResults] = useState<PermissionProbeResult[]>([]);
  const [probeLoading, setProbeLoading] = useState(false);

  // Example: List of safe, read-only AWS actions to probe
  const probeActions = [
    { service: 'S3', action: 'ListBuckets' },
    { service: 'EC2', action: 'DescribeInstances' },
    { service: 'IAM', action: 'ListUsers' },
    { service: 'Lambda', action: 'ListFunctions' },
    { service: 'STS', action: 'GetCallerIdentity' },
    { service: 'DynamoDB', action: 'ListTables' },
    { service: 'CloudWatch', action: 'ListMetrics' },
    { service: 'RDS', action: 'DescribeDBInstances' },
    { service: 'SNS', action: 'ListTopics' },
    { service: 'SQS', action: 'ListQueues' },
  ];

  // Permission probing logic (client-side, safe, read-only) using AWS SDK v3
  const handleProbePermissions = async () => {
    if (!credentials[0]) return;
    setProbeLoading(true);
    const creds = credentials[0];
    const region = 'us-east-1';
    const results: PermissionProbeResult[] = [];
    for (const { service, action } of probeActions) {
      try {
        let client, command;
        switch (service) {
          case 'S3':
            client = new S3Client({
              region,
              credentials: {
                accessKeyId: creds.accessKeyId,
                secretAccessKey: creds.secretAccessKey,
                sessionToken: creds.sessionToken || undefined,
              },
            });
            command = new ListBucketsCommand({});
            await client.send(command);
            break;
          case 'EC2':
            client = new EC2Client({
              region,
              credentials: {
                accessKeyId: creds.accessKeyId,
                secretAccessKey: creds.secretAccessKey,
                sessionToken: creds.sessionToken || undefined,
              },
            });
            command = new DescribeInstancesCommand({ MaxResults: 1 });
            await client.send(command);
            break;
          case 'IAM':
            client = new IAMClient({
              region,
              credentials: {
                accessKeyId: creds.accessKeyId,
                secretAccessKey: creds.secretAccessKey,
                sessionToken: creds.sessionToken || undefined,
              },
            });
            command = new ListUsersCommand({ MaxItems: 1 });
            await client.send(command);
            break;
          case 'Lambda':
            client = new LambdaClient({
              region,
              credentials: {
                accessKeyId: creds.accessKeyId,
                secretAccessKey: creds.secretAccessKey,
                sessionToken: creds.sessionToken || undefined,
              },
            });
            command = new ListFunctionsCommand({ MaxItems: 1 });
            await client.send(command);
            break;
          case 'STS':
            client = new STSClient({
              region,
              credentials: {
                accessKeyId: creds.accessKeyId,
                secretAccessKey: creds.secretAccessKey,
                sessionToken: creds.sessionToken || undefined,
              },
            });
            command = new GetCallerIdentityCommand({});
            await client.send(command);
            break;
          case 'DynamoDB':
            client = new DynamoDBClient({
              region,
              credentials: {
                accessKeyId: creds.accessKeyId,
                secretAccessKey: creds.secretAccessKey,
                sessionToken: creds.sessionToken || undefined,
              },
            });
            command = new ListTablesCommand({ Limit: 1 });
            await client.send(command);
            break;
          case 'CloudWatch':
            client = new CloudWatchClient({
              region,
              credentials: {
                accessKeyId: creds.accessKeyId,
                secretAccessKey: creds.secretAccessKey,
                sessionToken: creds.sessionToken || undefined,
              },
            });
            command = new ListMetricsCommand({});
            await client.send(command);
            break;
          case 'RDS':
            client = new RDSClient({
              region,
              credentials: {
                accessKeyId: creds.accessKeyId,
                secretAccessKey: creds.secretAccessKey,
                sessionToken: creds.sessionToken || undefined,
              },
            });
            command = new DescribeDBInstancesCommand({ MaxRecords: 1 });
            await client.send(command);
            break;
          case 'SNS':
            client = new SNSClient({
              region,
              credentials: {
                accessKeyId: creds.accessKeyId,
                secretAccessKey: creds.secretAccessKey,
                sessionToken: creds.sessionToken || undefined,
              },
            });
            command = new ListTopicsCommand({});
            await client.send(command);
            break;
          case 'SQS':
            client = new SQSClient({
              region,
              credentials: {
                accessKeyId: creds.accessKeyId,
                secretAccessKey: creds.secretAccessKey,
                sessionToken: creds.sessionToken || undefined,
              },
            });
            command = new ListQueuesCommand({});
            await client.send(command);
            break;
          default:
            throw new Error('Unknown service');
        }
        results.push({ service, action, status: 'allowed' });
      } catch (err: any) {
        if (err && err.name && (err.name === 'AccessDenied' || err.name === 'UnauthorizedOperation' || err.name === 'AccessDeniedException')) {
          results.push({ service, action, status: 'denied', message: err.message });
        } else {
          results.push({ service, action, status: 'error', message: err.message || String(err) });
        }
      }
    }
    setProbeResults(results);
    setProbeLoading(false);
  };

  const [historicalData] = useState<HistoricalData[]>([
    { date: '2024-01-01', validCount: 45, invalidCount: 5, totalCount: 50, averageResponseTime: 850 },
    { date: '2024-01-02', validCount: 48, invalidCount: 2, totalCount: 50, averageResponseTime: 720 },
    { date: '2024-01-03', validCount: 47, invalidCount: 3, totalCount: 50, averageResponseTime: 680 },
  ]);
  const [stats, setStats] = useState({
    total: 0,
    valid: 0,
    invalid: 0,
    pending: 0,
    completed: 0,
    validPercentage: 0,
    invalidPercentage: 0,
    completedPercentage: 0,
    averageResponseTime: 0,
    securityScore: 0,
    oldKeys: 0,
    unusedKeys: 0
  });

  const validator = AWSValidator.getInstance();

  const validateIndividualCredential = async (credential: AWSCredentials) => {
    try {
      const result = await validator.validateCredentials(credential);
      setResults(prevResults => {
        const existingIndex = prevResults.findIndex(r => r.id === credential.id);
        const newResults = [...prevResults];
        if (existingIndex >= 0) {
          newResults[existingIndex] = result;
        } else {
          newResults.push(result);
        }
        return newResults;
      });
      // Update stats after state update
      setResults(currentResults => {
        const total = credentials.length;
        const completed = currentResults.length;
        const valid = currentResults.filter(r => r.isValid).length;
        const invalid = currentResults.filter(r => !r.isValid).length;
        const pending = Math.max(0, total - completed);
        setStats({
          total,
          valid,
          invalid,
          pending,
          completed,
          validPercentage: total > 0 ? Math.round((valid / total) * 100) : 0,
          invalidPercentage: total > 0 ? Math.round((invalid / total) * 100) : 0,
          completedPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
          averageResponseTime: 0,
          securityScore: 0,
          oldKeys: 0,
          unusedKeys: 0
        });
        return currentResults;
      });
    } catch (error) {
      console.error('Individual validation error:', error);
    }
  };

  const startValidation = async () => {
    if (credentials.length === 0) return;
    setIsValidating(true);
    setResults([]);
    try {
      await validator.validateBatch(
        credentials,
        (newResults, newStats) => {
          setResults(newResults);
          setStats(newStats);
        },
        3
      );
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const resetAll = () => {
    setCredentials([]);
    setResults([]);
    setStats({
      total: 0,
      valid: 0,
      invalid: 0,
      pending: 0,
      completed: 0,
      validPercentage: 0,
      invalidPercentage: 0,
      completedPercentage: 0,
      averageResponseTime: 0,
      securityScore: 0,
      oldKeys: 0,
      unusedKeys: 0
    });
  };
  return (
    <div>
      {/* Security/Trust Modal */}
      {showTrustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fade-in">
          <div className="bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 border-4 border-orange-500 rounded-2xl shadow-2xl max-w-2xl w-full p-10 relative animate-slide-up">
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-orange-100 dark:hover:bg-gray-800 transition-colors border border-orange-200 dark:border-gray-700"
              onClick={() => setShowTrustModal(false)}
              aria-label="Close security notice"
            >
              <X size={28} className="text-orange-500" />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-orange-200 rounded-full p-3 border-2 border-orange-400"><Shield className="text-orange-600" size={36} /></span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-700 tracking-tight">Critical Security Notice</h2>
            </div>
            <div className="space-y-4 text-base sm:text-lg">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="font-bold text-green-700">Your AWS credentials are <u>never</u> sent, stored, or transmitted anywhere.</span>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900 border-l-4 border-orange-500 p-3 rounded">
                <span className="font-semibold text-orange-700">All validation and API calls happen <u>entirely in your browser</u> using the official AWS SDK for JavaScript.</span>
                <ul className="list-disc ml-6 mt-2 text-orange-800 text-sm">
                  <li>No data ever leaves your device—not even to our own servers.</li>
                  <li>There is <b>no backend, cloud, or logging service</b> involved.</li>
                  <li>We <b>do not</b> store, log, or share any user-provided information.</li>
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-3 rounded text-blue-900 dark:text-blue-100 text-sm">
                <b>Why is this important?</b> <br />
                <ul className="list-disc ml-6 mt-1">
                  <li>Protects your organization from accidental credential leaks.</li>
                  <li>Ensures compliance with strict security and privacy policies.</li>
                  <li>Gives you full control—<b>only you</b> can see or use your keys.</li>
                </ul>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-500 p-3 rounded text-yellow-900 dark:text-yellow-100 text-sm">
                <b>Best Practices:</b>
                <ul className="list-disc ml-6 mt-1">
                  <li>Use this tool <b>only in secure environments</b> (never on public/shared computers).</li>
                  <li>Never share your AWS keys with untrusted parties.</li>
                  <li>Rotate and delete unused credentials regularly.</li>
                  <li>Review your AWS IAM policies and permissions often.</li>
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-3 rounded text-red-900 dark:text-red-100 text-sm">
                <b>Warning:</b> <br />
                <ul className="list-disc ml-6 mt-1">
                  <li>We <b>cannot</b> recover your credentials if lost or deleted.</li>
                  <li>Any misuse of your keys is your responsibility.</li>
                  <li>If you have questions about data handling, <a href="#" className="underline text-red-700 dark:text-red-200">review our documentation</a> or contact us.</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition-all border-2 border-orange-700"
                onClick={() => setShowTrustModal(false)}
                autoFocus
              >
                I Understand &amp; Accept
              </button>
            </div>
          </div>
        </div>
      )}
      <Header 
        notificationSettings={notificationSettings}
        onNotificationSettingsChange={setNotificationSettings}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold shadow ${activeTab === 'validate' ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
            onClick={() => setActiveTab('validate')}
          >
            <KeyRound size={18} /> Validate
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold shadow ${activeTab === 'permissions' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
            onClick={() => setActiveTab('permissions')}
          >
            <Shield size={18} /> Permissions
          </button>
        </div>
        {/* Tab Content */}
        {activeTab === 'validate' && (
          <>
            {/* Action Bar - Responsive */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <button
                onClick={startValidation}
                disabled={credentials.length === 0 || isValidating}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none text-sm sm:text-base animate-pulse disabled:animate-none"
              >
                <Play size={18} />
                <span className="hidden sm:inline">
                  {isValidating ? 'Validating...' : `Validate ${credentials.length} Credentials`}
                </span>
                <span className="sm:hidden">
                  {isValidating ? 'Validating...' : `Validate (${credentials.length})`}
                </span>
              </button>
              <button
                onClick={() => setShowAnalytics(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <BarChart3 size={18} />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Stats</span>
              </button>
              <button
                onClick={() => setShowGuide(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <BookOpen size={18} />
                <span className="hidden sm:inline">User Guide</span>
                <span className="sm:hidden">Guide</span>
              </button>
      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
              <button
                onClick={() => setShowAnalytics(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <DashboardAnalytics results={results} historicalData={historicalData} />
            </div>
          </div>
        </div>
      )}
      {/* User Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AWS Key Validator Guide</h2>
              <button
                onClick={() => setShowGuide(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <UserGuide />
          </div>
        </div>
      )}
              {results.length > 0 && (
                <button
                  onClick={resetAll}
                  className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  <RotateCcw size={18} />
                  <span className="hidden sm:inline">Reset All</span>
                  <span className="sm:hidden">Reset</span>
                </button>
              )}
              <div className="flex-1" />
              {credentials.length > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {credentials.length} loaded
                  </span>
                  {results.length > 0 && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                      {stats.completed} validated
                    </span>
                  )}
                </div>
              )}
            </div>
            {/* Main Content - Single Column Responsive Layout */}
            <div className="space-y-6 sm:space-y-8 animate-fade-in">
              {/* Stats Overview */}
              {results.length > 0 && (
                <div className="w-full">
                  <StatsOverview results={results} />
                </div>
              )}
              {/* Credentials Input Section */}
              <div className="w-full">
                <CredentialsInput
                  credentials={credentials}
                  onCredentialsChange={setCredentials}
                  onValidateIndividual={validateIndividualCredential}
                />
              </div>
              {/* Progress Section */}
              {(isValidating || results.length > 0) && (
                <div className="w-full">
                  <ValidationProgress stats={stats} isValidating={isValidating} />
                </div>
              )}
              {/* Results Section */}
              <div className="w-full">
                <ValidationResults results={results} />
              </div>
              {/* Features Info - Only show when no data */}
              {credentials.length === 0 && results.length === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
                  <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up">
                    <div className="bg-orange-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <Key className="text-orange-600" size={20} />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Bulk Validation</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                      Validate up to 100+ AWS credentials simultaneously with real-time progress tracking and detailed results.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="bg-green-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <Shield className="text-green-600" size={20} />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure Processing</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                      All validation happens client-side using AWS STS. Your credentials never leave your browser.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 md:col-span-2 lg:col-span-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <Download className="text-blue-600" size={20} />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Export Results</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                      Download validation results as CSV with detailed information including ARNs, accounts, and error messages.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {activeTab === 'permissions' && (
          <div className="animate-fade-in">
            <PermissionProbe
              results={probeResults}
              loading={probeLoading}
              onStart={handleProbePermissions}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;