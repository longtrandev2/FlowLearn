import { LoginForm } from '@/features/auth/components/LoginForm';
import { useEffect } from 'react';

export default function LoginPage() {
  useEffect(() => {
    document.title = 'Sign In — FlowLearn';
  }, []);

  return <LoginForm />;
}