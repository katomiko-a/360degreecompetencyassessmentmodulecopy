import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { signup } from '../utils/api';

interface SignupProps {
  onSwitchToLogin: () => void;
}

export function Signup({ onSwitchToLogin }: SignupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'employee'>('employee');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await signup({
        email,
        password,
        name,
        role,
        department,
      });

      setSuccess(true);
      
      // Переключаемся на страницу входа через 2 секунды
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err) {
      console.error('Ошибка при регистрации:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Регистрация</CardTitle>
          <CardDescription className="text-center">
            Создайте аккаунт для доступа к системе оценки 360°
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

            {success && (
              <Alert className="border-green-500 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Регистрация успешна! Перенаправление на страницу входа...
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                type="text"
                placeholder="Иван Иванов"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading || success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || success}
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
                minLength={6}
                disabled={loading || success}
              />
              <p className="text-xs text-gray-500">Минимум 6 символов</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Роль</Label>
              <Select 
                value={role} 
                onValueChange={(value: 'admin' | 'employee') => setRole(value)}
                disabled={loading || success}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Сотрудник</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Отдел (необязательно)</Label>
              <Input
                id="department"
                type="text"
                placeholder="Например: HR, IT, Маркетинг"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={loading || success}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading || success}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Зарегистрироваться
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Уже есть аккаунт? </span>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-purple-600 hover:text-purple-700 font-medium"
                disabled={loading || success}
              >
                Войти
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
