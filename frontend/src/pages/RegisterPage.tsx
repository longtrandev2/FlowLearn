import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useEffect } from 'react';

export default function RegisterPage() {
  useEffect(() => {
    document.title = 'Sign Up — FlowLearn';
  }, []);

  return <RegisterForm />;
}