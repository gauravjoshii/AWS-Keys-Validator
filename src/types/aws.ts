export interface AWSCredentials {
  id: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  region?: string;
  tags?: string[];
  notes?: string;
  createdAt?: Date;
  lastValidated?: Date;
  expirationDate?: Date;
  isFavorite?: boolean;
  teamId?: string;
  projectId?: string;
}

export interface ValidationResult {
  id: string;
  credentials: AWSCredentials;
  isValid: boolean;
  arn?: string;
  userId?: string;
  account?: string;
  errorMessage?: string;
  validatedAt: Date;
  responseTime: number;
  permissions?: string[];
  lastUsed?: Date;
  securityScore?: number;
  keyAge?: number;
}

export interface ValidationStats {
  total: number;
  valid: number;
  invalid: number;
  pending: number;
  completed: number;
  averageResponseTime: number;
  securityScore: number;
  oldKeys: number;
  unusedKeys: number;
}

export type ValidationStatus = 'pending' | 'validating' | 'completed' | 'error';

export interface HistoricalData {
  date: string;
  validCount: number;
  invalidCount: number;
  totalCount: number;
  averageResponseTime: number;
}

export interface NotificationSettings {
  email?: string;
  slackWebhook?: string;
  enableScheduled: boolean;
  scheduleInterval: 'daily' | 'weekly' | 'monthly';
  alertOnFailures: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  defaultRegion: string;
  autoSave: boolean;
  showAdvancedFeatures: boolean;
}

export interface Team {
  id: string;
  name: string;
  members: string[];
  permissions: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  teamId: string;
  tags: string[];
}