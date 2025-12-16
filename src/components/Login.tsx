import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, Loader2, UserPlus, CheckCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSwitchToSignup: () => void;
  loading?: boolean;
  error?: string | null;
}

export function Login({ onLogin, onSwitchToSignup, loading, error }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creatingTestUsers, setCreatingTestUsers] = useState(false);
  const [testUsersMessage, setTestUsersMessage] = useState<string | null>(null);
  const [testUserError, setTestUserError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onLogin(email, password);
    
    if (!success && !testUsersMessage) {
      // Подсказка, если вход не удался
      setTestUserError(true);
    }
  };

  const handleCreateTestUsers = async () => {
    setCreatingTestUsers(true);
    setTestUsersMessage(null);
    setTestUserError(false);

    try {
      console.log('Создание тестовых пользователей...');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9d167e02/create-test-user`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      console.log('Результат создания тестовых пользователей:', data);

      if (response.ok) {
        setTestUsersMessage(
          `✓ Тестовые пользователи созданы!\\n\\nАдминистратор:\\nEmail: admin@test.com\\nПароль: admin123456\\n\\nСотрудник:\\nEmail: employee@test.com\\nПароль: employee123456`
        );
        // Автоматически заполняем поля для входа
        setEmail('admin@test.com');
        setPassword('admin123456');
      } else {
        console.error('Ошибка от сервера:', data);
        setTestUsersMessage(`Ошибка: ${data.error}`);
      }
    } catch (err) {
      console.error('Ошибка создания тестовых пользователей:', err);
      setTestUsersMessage(`Ошибка при создании тестовых пользователей: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
    } finally {
      setCreatingTestUsers(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Вход в систему</CardTitle>
          <CardDescription className="text-center">
            Система оценки компетенций 360°
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {testUsersMessage && (
              <Alert className="border-purple-500 bg-purple-50">
                <AlertDescription className="whitespace-pre-line text-sm">
                  {testUsersMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Подсказка с тестовыми учетными данными */}
            {!testUsersMessage && (
              <Alert className="border-blue-300 bg-blue-50">
                <AlertDescription className="text-xs text-blue-800">
                  <div className="mb-2">💡 <strong>Быстрый старт:</strong></div>
                  <div className="space-y-1">
                    <div>1. Нажмите "Создать тестовых пользователей"</div>
                    <div>2. Или зарегистрируйте нового пользователя</div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Войти
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
              onClick={handleCreateTestUsers}
              disabled={loading || creatingTestUsers}
            >
              {creatingTestUsers ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Создать тестовых пользователей
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Нет аккаунта? </span>
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-purple-600 hover:text-purple-700 font-medium"
                disabled={loading}
              >
                Зарегистрироваться
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}