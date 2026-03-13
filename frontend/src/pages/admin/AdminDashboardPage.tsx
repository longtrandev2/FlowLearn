import { StatCards } from "@/features/admin/components/StatCards";
import { ActivityChart } from "@/features/admin/components/ActivityChart";

const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <StatCards />

      {/* Activity Chart */}
      <ActivityChart />
    </div>
  );
};

export default AdminDashboardPage;