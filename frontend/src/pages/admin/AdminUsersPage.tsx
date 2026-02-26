import { UsersTable } from "@/features/admin/components/UsersTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { mockAdminUsers } from "@/features/admin/data/mockData";

const AdminUsersPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Người dùng</h1>
        <UsersTable users={mockAdminUsers} />
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;