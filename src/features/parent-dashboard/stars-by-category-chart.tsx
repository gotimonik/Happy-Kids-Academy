"use client";

import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { categories } from "@/data/categories";
import { useProgressStore } from "@/store/progress-store";

export function StarsByCategoryChart() {
  const starsByCategory = useProgressStore((state) => state.starsByCategory);

  const data = categories.map((category) => ({
    name: category.title,
    stars: starsByCategory[category.slug] ?? 0,
    color: category.color,
  }));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-2 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
        >
          <BarChart3 className="size-4" />
        </span>
        <h2 className="font-display font-bold">Stars by topic</h2>
      </div>
      <div className="h-64 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          {/* accessibilityLayer is Recharts' opt-in keyboard nav for the bar
              series — off here because it draws a focus rectangle around the
              whole series (looked like a stray border) and this chart is a
              read-only visual summary, not an interactive control. */}
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: -20, bottom: 24 }}
            accessibilityLayer={false}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
            <XAxis
              dataKey="name"
              angle={-35}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 11 }}
              height={50}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip cursor={{ fill: "var(--muted)" }} />
            <Bar dataKey="stars" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
