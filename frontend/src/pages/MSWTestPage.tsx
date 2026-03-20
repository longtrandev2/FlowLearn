import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const API_BASE = 'https://api.flowlearn.io/api/v1';

export function MSWTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async (endpoint: string, options?: RequestInit) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, options);
      const data = await response.json();
      setResult({
        status: response.status,
        data,
        endpoint,
      });
    } catch (error) {
      setResult({
        error: String(error),
        endpoint,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">MSW API Test Page</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Authentication Tests */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Authentication</h2>
          <div className="space-y-2">
            <Button
              onClick={() =>
                testAPI('/sessions/admin', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    email: 'admin@flowlearn.io',
                    password: 'test',
                  }),
                })
              }
              className="w-full"
            >
              Test Admin Login
            </Button>
            <Button
              onClick={() =>
                testAPI('/sessions', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'test',
                  }),
                })
              }
              className="w-full"
              variant="outline"
            >
              Test User Login
            </Button>
          </div>
        </Card>

        {/* User Management Tests */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <div className="space-y-2">
            <Button
              onClick={() => testAPI('/admin/users')}
              className="w-full"
            >
              Get All Users
            </Button>
            <Button
              onClick={() => testAPI('/admin/users?status=ACTIVE&limit=5')}
              className="w-full"
              variant="outline"
            >
              Get Active Users (5)
            </Button>
            <Button
              onClick={() => testAPI('/admin/users?status=BANNED')}
              className="w-full"
              variant="outline"
            >
              Get Banned Users
            </Button>
            <Button
              onClick={() => testAPI('/admin/users?search=nguyen')}
              className="w-full"
              variant="outline"
            >
              Search "nguyen"
            </Button>
          </div>
        </Card>

        {/* User Details */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">User Details</h2>
          <div className="space-y-2">
            <Button
              onClick={() => testAPI('/admin/users/1')}
              className="w-full"
            >
              Get Admin User (ID: 1)
            </Button>
            <Button
              onClick={() => testAPI('/admin/users/5')}
              className="w-full"
              variant="outline"
            >
              Get Banned User (ID: 5)
            </Button>
            <Button
              onClick={() => testAPI('/admin/users/999')}
              className="w-full"
              variant="destructive"
            >
              Get Non-existent User (404)
            </Button>
          </div>
        </Card>

        {/* User Actions */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">User Actions</h2>
          <div className="space-y-2">
            <Button
              onClick={() =>
                testAPI('/admin/users/4/warn', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    reason: 'Test warning',
                    sendEmail: true,
                  }),
                })
              }
              className="w-full"
              variant="outline"
            >
              Warn User (ID: 4)
            </Button>
            <Button
              onClick={() =>
                testAPI('/admin/users/7/ban', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    reason: 'Test ban',
                    sendEmail: true,
                  }),
                })
              }
              className="w-full"
              variant="destructive"
            >
              Ban User (ID: 7)
            </Button>
            <Button
              onClick={() =>
                testAPI('/admin/users/5/unban', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    reason: 'Test unban',
                  }),
                })
              }
              className="w-full"
            >
              Unban User (ID: 5)
            </Button>
          </div>
        </Card>
      </div>

      {/* Results Display */}
      {loading && (
        <div className="text-center py-4">
          <p>Loading...</p>
        </div>
      )}

      {result && !loading && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Response</h3>
          <div className="space-y-2">
            <p>
              <strong>Endpoint:</strong> {result.endpoint}
            </p>
            {result.status && (
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={
                    result.status >= 200 && result.status < 300
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {result.status}
                </span>
              </p>
            )}
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(result.data || result.error, null, 2)}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
}
