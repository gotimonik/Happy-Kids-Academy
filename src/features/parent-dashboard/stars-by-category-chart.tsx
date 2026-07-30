"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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
    <div className="h-72 w-full rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="mb-2 font-display font-bold">Stars by topic</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 24 }}>
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
          <Bar dataKey="stars" radius={[6, 6, 0, 0]} fill="#6C5CE7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
