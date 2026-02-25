import { Clock } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { mockStudyData } from '../data/mockData';

// ── Custom Tooltip ──

interface TooltipPayloadItem {
  value: number;
  payload: { label: string };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
      <p className="font-semibold">{payload[0].payload.label}</p>
    </div>
  );
}

// ── Chart Component ──

export default function StudyTimeChart() {
  // Find the max value day index for highlight
  const maxIdx = mockStudyData.reduce(
    (maxI, d, i, arr) => (d.hours > arr[maxI].hours ? i : maxI),
    0,
  );

  // Use a custom shape to apply highlight color to the max bar
  const data = mockStudyData.map((d, i) => ({
    ...d,
    fill: i === maxIdx ? '#0284c7' : '#7dd3fc', // ocean-600 vs ocean-300
  }));

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Clock size={16} className="text-ocean-500" /> Study Time
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Weekly Activity</p>
        </div>
        <select className="text-[11px] border border-slate-200 rounded-lg px-2.5 py-1 bg-slate-50 outline-none text-slate-600 hover:border-ocean-300 transition-colors duration-200 cursor-pointer">
          <option>This Week</option>
          <option>Last Week</option>
        </select>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#cbd5e1' }}
              tickFormatter={(v: number) => `${v}h`}
              domain={[0, 'dataMax + 1']}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: '#f0f9ff', radius: 6 }}
            />
            <Bar
              dataKey="hours"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
