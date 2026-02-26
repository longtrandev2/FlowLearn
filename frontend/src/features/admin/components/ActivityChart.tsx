import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { name: "Mon", users: 120, uploads: 50 },
  { name: "Tue", users: 200, uploads: 80 },
  { name: "Wed", users: 150, uploads: 60 },
  { name: "Thu", users: 170, uploads: 90 },
  { name: "Fri", users: 220, uploads: 100 },
  { name: "Sat", users: 300, uploads: 150 },
  { name: "Sun", users: 250, uploads: 120 },
];

export const ActivityChart = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">
        Weekly Activity
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="users" stroke="#0284c7" strokeWidth={2} />
          <Line type="monotone" dataKey="uploads" stroke="#34d399" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};