import { StatCards } from "@/features/admin/components/StatCards";
import { ActivityChart } from "@/features/admin/components/ActivityChart";
import { AdminLayout } from "@/components/admin/AdminLayout";

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stat Cards */}
        <StatCards />

        {/* Activity Chart */}
        <ActivityChart />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;