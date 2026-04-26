import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";

export default function RatingsOverTimeChart({ feedbacks }) {
  // Group feedbacks by date and compute daily averages
  const grouped = {};
  feedbacks.forEach((f) => {
    const day = format(new Date(f.created_date), "MMM d");
    if (!grouped[day]) grouped[day] = { class: [], teacher: [] };
    grouped[day].class.push(f.class_rating);
    grouped[day].teacher.push(f.teacher_rating);
  });

  const data = Object.entries(grouped).map(([date, vals]) => ({
    date,
    "Class Rating": parseFloat((vals.class.reduce((a, b) => a + b, 0) / vals.class.length).toFixed(2)),
    "Teacher Rating": parseFloat((vals.teacher.reduce((a, b) => a + b, 0) / vals.teacher.length).toFixed(2)),
  }));

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Ratings Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length < 2 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Not enough data to show trends yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="Class Rating" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Teacher Rating" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}