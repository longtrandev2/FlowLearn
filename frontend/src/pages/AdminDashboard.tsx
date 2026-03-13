import { AdminLayout } from "@/features/admin/layouts/AdminLayout";
import { StatCards } from "@/features/admin/components/StatCards";
import { ActivityChart } from "@/features/admin/components/ActivityChart";
import { UsersTable } from "@/features/admin/components/UsersTable";
import { mockAdminUsers } from "@/features/admin/data/mockData";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stat Cards */}
        <StatCards />

        {/* Activity Chart */}
        <ActivityChart />

        {/* Users Table */}
        <UsersTable users={mockAdminUsers} />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;