import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { setAccessToken, login as apiLogin, type User } from '../utils/api';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Проверка текущей сессии при загрузке
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Ошибка при получении сессии:', sessionError);
        setError(sessionError.message);
        setLoading(false);
        return;
      }

      if (session) {
        setAccessToken(session.access_token);
        // Пытаемся получить профиль через API
        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-9d167e02/profile`,
            {
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          
          if (response.ok) {
            const { profile } = await response.json();
            setUser(profile);
          }
        } catch (err) {
          console.error('Ошибка при получении профиля:', err);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при проверке сессии:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      setLoading(true);
      setError(null);

      console.log('Попытка входа через серверный endpoint...');

      // Используем серверный endpoint для входа
      const { accessToken, profile } = await apiLogin({ email, password });

      setAccessToken(accessToken);
      setUser(profile);

      console.log('Успешный вход:', profile);

      setLoading(false);
      return true;
    } catch (err) {
      console.error('Ошибка при входе:', err);
      // Переводим ошибки на русский
      let errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Неверный email или пароль. Проверьте введенные данные или создайте тестовых пользователей.';
      } else if (errorMessage.includes('Email not confirmed')) {
        errorMessage = 'Email не подтвержден';
      }
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }

  async function signOut() {
    try {
      setLoading(true);
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        console.error('Ошибка при выходе:', signOutError);
        setError(signOutError.message);
      }

      setAccessToken(null);
      setUser(null);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при выходе:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      setLoading(false);
    }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    checkSession,
    isAuthenticated: !!user,
  };
}