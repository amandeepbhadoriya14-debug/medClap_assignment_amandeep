"use client";

import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export function RoleDonut({ data }) {
  const [active, setActive] = useState(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const center =
    active !== null
      ? { value: `${data[active].value}%`, label: data[active].label, color: data[active].color }
      : { value: `${total}%`, label: "Total", color: null };

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7">
      <div className="relative size-[180px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={3}
              cornerRadius={6}
              strokeWidth={0}
              animationBegin={150}
              animationDuration={1500}
              animationEasing="ease-out"
              onMouseEnter={(_, index) => setActive(index)}
              onMouseLeave={() => setActive(null)}
            >
              {data.map((d, index) => (
                <Cell
                  key={d.label}
                  fill={d.color}
                  opacity={active === null || active === index ? 1 : 0.35}
                  style={{ transition: "opacity 150ms", outline: "none", cursor: "pointer" }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-semibold tracking-tight tabular-nums text-slate-900 dark:text-white"
            style={center.color ? { color: center.color } : undefined}
          >
            {center.value}
          </span>
          <span className="max-w-[88px] truncate text-center text-[11px] font-medium uppercase tracking-wide text-slate-400">
            {center.label}
          </span>
        </div>
      </div>

      <div className="w-full space-y-3">
        {data.map((d, index) => (
          <div
            key={d.label}
            className="flex cursor-pointer items-center justify-between gap-4 rounded-lg px-1 py-0.5 transition-colors hover:bg-muted/50 dark:hover:bg-white/[0.04]"
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
          >
            <div className="flex items-center gap-2.5">
              <span className="size-3 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {d.label}
              </span>
            </div>
            <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
              {d.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
