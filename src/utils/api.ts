import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9d167e02`;

// Типы данных
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  department?: string;
}

export interface Campaign {
  id: string;
  name: string;
  project: string;
  deadline?: string;
  participants: Participant[];
  surveyId?: string;
  status: 'draft' | 'published' | 'completed';
  createdBy: string;
  createdAt: string;
  completed: number;
  totalParticipants: number;
}

export interface Participant {
  userId: string;
  name: string;
  role: string;
}

export interface Survey {
  id: string;
  campaignId: string;
  title: string;
  competencies: Competency[];
  createdBy: string;
  createdAt: string;
}

export interface Competency {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  scale: number;
}

export interface Response {
  id: string;
  campaignId: string;
  evaluatorId: string;
  evaluatedUserId: string;
  evaluatorRole: 'self' | 'manager' | 'peer' | 'subordinate' | 'client';
  responses: { [competencyId: string]: number };
  submittedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'new_response' | 'campaign_published' | 'deadline_reminder';
  message: string;
  campaignId?: string;
  read: boolean;
  createdAt: string;
}

export interface Report {
  campaignId: string;
  userId: string;
  campaign: Campaign;
  survey: Survey;
  responsesCount: number;
  responsesByRole: { [role: string]: number };
  competencyAverages: {
    [competencyId: string]: {
      name: string;
      overall: number;
      byRole: { [role: string]: number };
    };
  };
  gapAnalysis: {
    [competencyId: string]: {
      name: string;
      selfScore: number;
      othersScore: number;
      gap: number;
    };
  };
  recommendations: string[];
  generatedAt: string;
}

// Хранилище токена доступа
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

// Базовая функция для API запросов
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Используем accessToken если есть, иначе publicAnonKey
  const authToken = accessToken || publicAnonKey;
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Неизвестная ошибка' }));
    console.error(`API ошибка при запросе ${endpoint}:`, error);
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ==================== AUTH API ====================

export async function signup(data: {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'employee';
  department?: string;
}): Promise<{ success: boolean; user: User }> {
  return apiRequest('/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<{ success: boolean; accessToken: string; profile: User }> {
  return apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getProfile(): Promise<{ profile: User }> {
  return apiRequest('/profile');
}

export async function getUsers(): Promise<{ users: User[] }> {
  return apiRequest('/users');
}

// ==================== CAMPAIGNS API ====================

export async function getCampaigns(): Promise<{ campaigns: Campaign[] }> {
  return apiRequest('/campaigns');
}

export async function getCampaign(id: string): Promise<{ campaign: Campaign }> {
  return apiRequest(`/campaigns/${id}`);
}

export async function createCampaign(data: {
  name: string;
  project: string;
  deadline?: string;
  participants?: Participant[];
  surveyId?: string;
}): Promise<{ success: boolean; campaign: Campaign }> {
  return apiRequest('/campaigns', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCampaign(
  id: string,
  data: Partial<Campaign>
): Promise<{ success: boolean; campaign: Campaign }> {
  return apiRequest(`/campaigns/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCampaign(id: string): Promise<{ success: boolean }> {
  return apiRequest(`/campaigns/${id}`, {
    method: 'DELETE',
  });
}

// ==================== SURVEYS API ====================

export async function getSurvey(campaignId: string): Promise<{ survey: Survey }> {
  return apiRequest(`/surveys/${campaignId}`);
}

export async function createSurvey(data: {
  campaignId: string;
  title: string;
  competencies: Competency[];
}): Promise<{ success: boolean; survey: Survey }> {
  return apiRequest('/surveys', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSurvey(
  id: string,
  data: Partial<Survey>
): Promise<{ success: boolean; survey: Survey }> {
  return apiRequest(`/surveys/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ==================== RESPONSES API ====================

export async function getResponses(
  campaignId: string
): Promise<{ responses: Response[] }> {
  return apiRequest(`/responses/${campaignId}`);
}

export async function createResponse(data: {
  campaignId: string;
  evaluatedUserId: string;
  evaluatorRole: 'self' | 'manager' | 'peer' | 'subordinate' | 'client';
  responses: { [competencyId: string]: number };
}): Promise<{ success: boolean; response: Response }> {
  return apiRequest('/responses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ==================== REPORTS API ====================

export async function getReport(
  campaignId: string,
  userId: string
): Promise<{ report: Report }> {
  return apiRequest(`/reports/${campaignId}/${userId}`);
}

// ==================== NOTIFICATIONS API ====================

export async function getNotifications(): Promise<{ notifications: Notification[] }> {
  return apiRequest('/notifications');
}

export async function markNotificationAsRead(
  id: string
): Promise<{ success: boolean }> {
  return apiRequest(`/notifications/${id}/read`, {
    method: 'PUT',
  });
}

export async function createNotification(data: {
  userId: string;
  type?: string;
  message: string;
  campaignId?: string;
}): Promise<{ success: boolean; notification: Notification }> {
  return apiRequest('/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function sendTestEmail(data: {
  email: string;
  template: {
    subject: string;
    body: string;
  };
}): Promise<{ success: boolean; message: string; emailId: string }> {
  return apiRequest('/send-test-email', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function sendBulkEmail(data: {
  userIds: string[];
  template: {
    subject: string;
    body: string;
  };
}): Promise<{ 
  success: boolean; 
  message: string; 
  results: any[];
  errors?: any[];
}> {
  return apiRequest('/send-bulk-email', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ==================== HEALTH CHECK ====================

export async function healthCheck(): Promise<{ status: string; timestamp: string }> {
  return apiRequest('/health');
}