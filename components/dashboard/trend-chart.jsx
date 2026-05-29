"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AXIS = "#94a3b8";

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 text-xs shadow-lg dark:border-white/[0.1]">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="mt-0.5 text-muted-foreground">
        <span className="font-medium text-[#18a8b3]">{payload[0].value}</span> new signups
      </p>
    </div>
  );
}

export function TrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2db3bf" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#2db3bf" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={AXIS} strokeOpacity={0.25} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{ fill: AXIS, fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          tick={{ fill: AXIS, fontSize: 12 }}
        />
        <Tooltip
          content={<TrendTooltip />}
          cursor={{ stroke: "#2db3bf", strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#2db3bf"
          strokeWidth={3}
          fill="url(#trendFill)"
          dot={false}
          activeDot={{ r: 5, fill: "#fff", stroke: "#2db3bf", strokeWidth: 2.5 }}
          animationBegin={150}
          animationDuration={1500}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
