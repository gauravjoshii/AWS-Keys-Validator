import React from 'react';
import { Shield, Key, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { NotificationCenter } from './NotificationCenter';
import { NotificationSettings } from '../types/aws';

interface HeaderProps {
  notificationSettings: NotificationSettings;
  onNotificationSettingsChange: (settings: NotificationSettings) => void;
}

export const Header: React.FC<HeaderProps> = ({
  notificationSettings,
  onNotificationSettingsChange
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg shadow-lg">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                AWS Key Validator Pro
              </h1>
              <p className="text-gray-300 text-sm">Enterprise-grade credential validation & management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-orange-400">
              <Key size={20} />
              <span className="font-medium hidden sm:inline">Enterprise Security</span>
            </div>
            
            <NotificationCenter
              settings={notificationSettings}
              onSettingsChange={onNotificationSettingsChange}
            />
            
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};