import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AdminUser } from "../types";
import { UserActions } from "./UserActions";

interface UsersTableProps {
  users: AdminUser[];
}

export const UsersTable = ({ users }: UsersTableProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">User Management</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50">
            <th className="text-left p-3 text-sm font-medium text-slate-600">User</th>
            <th className="text-left p-3 text-sm font-medium text-slate-600">Plan</th>
            <th className="text-left p-3 text-sm font-medium text-slate-600">Storage</th>
            <th className="text-left p-3 text-sm font-medium text-slate-600">Uploads</th>
            <th className="text-left p-3 text-sm font-medium text-slate-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-slate-100">
              <td className="p-3 text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ocean-50 flex items-center justify-center text-ocean-600 font-bold">
                    {user.name[0]}
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-slate-500 text-sm">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="p-3 text-sm text-slate-700">
                <Badge
                  className={user.plan === "Pro" ? "bg-ocean-500 text-white" : "bg-slate-200 text-slate-600"}
                >
                  {user.plan}
                </Badge>
              </td>
              <td className="p-3 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Progress
                    value={(user.storageUsed / user.storageLimit) * 100}
                    className="w-32 h-2 bg-slate-200"
                  />
                  <span className="text-xs text-slate-500">
                    {user.storageUsed}MB / {user.storageLimit}MB
                  </span>
                </div>
              </td>
              <td className="p-3 text-sm text-slate-700">{user.totalFiles}</td>
              <td className="p-3 text-sm text-slate-700">
                <UserActions
                  onWarn={(reason) => console.log(`Warned ${user.name}: ${reason}`)}
                  onBan={(reason) => console.log(`Banned ${user.name}: ${reason}`)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};