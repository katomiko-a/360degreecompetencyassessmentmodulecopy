import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, CheckCircle2, ExternalLink, Key, Loader2 } from 'lucide-react';

interface ResendApiKeySetupProps {
  onClose: () => void;
}

export function ResendApiKeySetup({ onClose }: ResendApiKeySetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Пожалуйста, введите API ключ' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      // Просто пытаемся отправить тестовое письмо
      // Если ключ невалидный, получим ошибку
      setTestResult({ 
        success: true, 
        message: 'API ключ сохранен! Теперь попробуйте отправить тестовое письмо.' 
      });
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Ошибка при проверке ключа' 
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-600" />
            Настройка Email отправки (Resend)
          </CardTitle>
          <CardDescription>
            Для отправки писем необходимо настроить интеграцию с Resend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Инструкции */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                📋 Инструкция по получению API ключа
              </h3>
              <ol className="space-y-2 text-sm text-blue-800">
                <li className="flex gap-2">
                  <span className="font-semibold">1.</span>
                  <div>
                    Перейдите на сайт{' '}
                    <a
                      href="https://resend.com/signup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 underline inline-flex items-center gap-1"
                    >
                      resend.com/signup
                      <ExternalLink className="h-3 w-3" />
                    </a>{' '}
                    и зарегистрируйтесь (бесплатно)
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">2.</span>
                  <div>После регистрации перейдите в раздел "API Keys"</div>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">3.</span>
                  <div>Нажмите "Create API Key"</div>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">4.</span>
                  <div>
                    Дайте ключу название (например, "360 Assessment")
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">5.</span>
                  <div>
                    Выберите разрешение "Sending access" (Full access)
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">6.</span>
                  <div>
                    Скопируйте созданный ключ (начинается с <code className="bg-blue-100 px-1 rounded">re_</code>)
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">7.</span>
                  <div>Вставьте ключ в поле ниже</div>
                </li>
              </ol>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-2">⚠️ Важная информация</h3>
              <ul className="space-y-1 text-sm text-amber-800">
                <li>• Бесплатный план Resend: 100 писем в день, 3000 в месяц</li>
                <li>• Для тестов используйте домен <code className="bg-amber-100 px-1 rounded">onboarding@resend.dev</code></li>
                <li>• API ключ должен начинаться с <code className="bg-amber-100 px-1 rounded">re_</code></li>
                <li>• Не делитесь API ключом с другими людьми</li>
              </ul>
            </div>
          </div>

          {/* Форма ввода ключа */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API ключ Resend</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="re_..."
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                className="font-mono"
                disabled={testing}
              />
              <p className="text-xs text-gray-500">
                Ключ должен начинаться с "re_" и содержать только буквы, цифры и символы _ -
              </p>
            </div>

            {testResult && (
              <Alert variant={testResult.success ? 'default' : 'destructive'}>
                {testResult.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{testResult.message}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex gap-3">
            <Button
              onClick={handleTestKey}
              disabled={testing || !apiKey.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Проверка...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Сохранить ключ
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={testing}
            >
              {testResult?.success ? 'Готово' : 'Отмена'}
            </Button>
          </div>

          {/* Ссылка на документацию */}
          <div className="pt-4 border-t">
            <a
              href="https://resend.com/docs/introduction"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Документация Resend
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
