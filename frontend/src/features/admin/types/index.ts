export interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: "Free" | "Pro";
  storageUsed: number; // in MB
  storageLimit: number; // in MB
  totalFiles: number;
  status: "Active" | "Warned" | "Banned";
  warningCount: number;
}