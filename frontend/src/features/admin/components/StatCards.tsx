import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Droplets, FileText, DollarSign, Users } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

const StatCard = ({ icon, label, value, className }: StatCardProps) => {
  return (
    <Card
      className={cn(
        "flex items-center gap-4 p-4 bg-white shadow-sm rounded-lg border border-slate-200",
        className
      )}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-ocean-50 text-ocean-600">
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold text-slate-800">{value}</div>
        <div className="text-sm text-slate-500">{label}</div>
      </div>
    </Card>
  );
};

export const StatCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={<Users size={24} />}
        label="Total Users"
        value={"1,234"}
      />
      <StatCard
        icon={<FileText size={24} />}
        label="Total Documents"
        value={"567"}
      />
      <StatCard
        icon={<Droplets size={24} />}
        label="AI Tokens Used"
        value={"89,000"}
      />
      <StatCard
        icon={<DollarSign size={24} />}
        label="Revenue"
        value={"$12,345"}
      />
    </div>
  );
};