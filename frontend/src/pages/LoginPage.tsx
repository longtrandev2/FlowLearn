import { LoginForm } from '@/features/auth/components/LoginForm';
import { motion } from 'framer-motion';

// ============================================================
// LoginPage — Trang đăng nhập
// Được render bên trong <AuthLayout /> thông qua <Outlet />
// ============================================================
export default function LoginPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <LoginForm />
    </motion.div>
  );
}