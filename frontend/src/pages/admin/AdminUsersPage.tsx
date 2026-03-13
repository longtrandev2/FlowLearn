import { UsersTable } from "@/features/admin/components/UsersTable";
import { mockAdminUsers } from "@/features/admin/data/mockData";

const AdminUsersPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Quản lý Người dùng</h1>
      <UsersTable users={mockAdminUsers} />
    </div>
  );
};

export default AdminUsersPage;