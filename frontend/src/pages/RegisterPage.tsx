import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { motion } from 'framer-motion';

// ============================================================
// RegisterPage — Trang đăng ký
// Được render bên trong <AuthLayout /> thông qua <Outlet />
// ============================================================
export default function RegisterPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <RegisterForm />
    </motion.div>
  );
}