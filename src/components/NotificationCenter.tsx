import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Settings, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { NotificationSettings } from '../types/aws';

interface NotificationCenterProps {
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  settings,
  onSettingsChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [testNotification, setTestNotification] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const sendTestNotification = async () => {
    setTestNotification('sending');
    
    // Simulate API call
    setTimeout(() => {
      setTestNotification('success');
      setTimeout(() => setTestNotification('idle'), 3000);
    }, 2000);
  };

  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: '3 credentials failed validation',
      message: 'Invalid access keys detected in us-east-1 region',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'success',
      title: 'Scheduled validation completed',
      message: '47 credentials validated successfully',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'info',
      title: 'Weekly security report ready',
      message: 'Your AWS security summary is available',
      time: '1 day ago',
      unread: false
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Bell size={20} />
        {notifications.filter(n => n.unread).length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {notifications.filter(n => n.unread).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    notification.type === 'warning' ? 'bg-orange-100 dark:bg-orange-900/30' :
                    notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    {notification.type === 'warning' && <AlertTriangle className="text-orange-600 dark:text-orange-400" size={16} />}
                    {notification.type === 'success' && <Check className="text-green-600 dark:text-green-400" size={16} />}
                    {notification.type === 'info' && <Bell className="text-blue-600 dark:text-blue-400" size={16} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {notification.title}
                      </h4>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock size={12} />
                      {notification.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Settings size={16} />
                Notification Settings
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <input
                      type="email"
                      value={settings.email || ''}
                      onChange={(e) => handleSettingChange('email', e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Slack Webhook URL
                  </label>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-gray-400" />
                    <input
                      type="url"
                      value={settings.slackWebhook || ''}
                      onChange={(e) => handleSettingChange('slackWebhook', e.target.value)}
                      placeholder="https://hooks.slack.com/..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Alert on Failures
                  </span>
                  <button
                    onClick={() => handleSettingChange('alertOnFailures', !settings.alertOnFailures)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.alertOnFailures ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.alertOnFailures ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Scheduled Reports
                  </span>
                  <button
                    onClick={() => handleSettingChange('enableScheduled', !settings.enableScheduled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.enableScheduled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.enableScheduled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {settings.enableScheduled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Report Frequency
                    </label>
                    <select
                      value={settings.scheduleInterval}
                      onChange={(e) => handleSettingChange('scheduleInterval', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}

                <button
                  onClick={sendTestNotification}
                  disabled={testNotification === 'sending'}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    testNotification === 'success' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : testNotification === 'error'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                  } disabled:opacity-50`}
                >
                  {testNotification === 'sending' && 'Sending Test...'}
                  {testNotification === 'success' && '✅ Test Sent Successfully!'}
                  {testNotification === 'error' && '❌ Test Failed'}
                  {testNotification === 'idle' && 'Send Test Notification'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};