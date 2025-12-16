import React from 'react';
import { Home, FileText, Target, Settings, User, Users, ClipboardList, Bell, LogOut } from 'lucide-react';
import type { View, UserRole } from '../App';

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onLogout?: () => void;
  userName?: string;
}

export function Navigation({ currentView, onNavigate, userRole, onRoleChange, onLogout, userName }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentView === 'dashboard'
                  ? 'text-purple-600 bg-purple-100 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className={currentView === 'dashboard' ? 'font-medium' : ''}>Главная</span>
            </button>

            <button 
              onClick={() => onNavigate('surveys')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentView === 'surveys'
                  ? 'text-purple-600 bg-purple-100 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ClipboardList className="w-5 h-5" />
              <span className={currentView === 'surveys' ? 'font-medium' : ''}>Анкеты</span>
            </button>

            <button 
              onClick={() => onNavigate('participants')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentView === 'participants'
                  ? 'text-purple-600 bg-purple-100 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className={currentView === 'participants' ? 'font-medium' : ''}>Участники</span>
            </button>

            <button 
              onClick={() => onNavigate('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentView === 'settings'
                  ? 'text-purple-600 bg-purple-100 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className={currentView === 'settings' ? 'font-medium' : ''}>Настройки</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('notifications')}
              className={`relative p-2.5 rounded-lg transition-all ${
                currentView === 'notifications'
                  ? 'text-purple-600 bg-purple-100 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <button
              onClick={() => onNavigate('profile')}
              className={`flex items-center gap-2 rounded-lg p-2 transition-all ${
                currentView === 'profile'
                  ? 'bg-purple-100 shadow-sm'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentView === 'profile'
                  ? 'bg-purple-500'
                  : 'bg-purple-100'
              }`}>
                <User className={`w-5 h-5 ${
                  currentView === 'profile'
                    ? 'text-white'
                    : 'text-purple-600'
                }`} />
              </div>
              <div className="text-right">
                <div className={`text-sm ${
                  currentView === 'profile'
                    ? 'text-purple-600 font-medium'
                    : 'text-gray-900'
                }`}>{userName || 'Пользователь'}</div>
                <div className="text-gray-500 text-xs">{userRole === 'admin' ? 'Администратор' : 'Сотрудник'}</div>
              </div>
            </button>
            
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2.5 rounded-lg transition-all text-gray-600 hover:text-red-600 hover:bg-red-50"
                title="Выйти"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}