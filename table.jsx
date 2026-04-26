import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TeacherRatingsChart({ feedbacks }) {
  const grouped = {};
  feedbacks.forEach((f) => {
    if (!grouped[f.teacher_name]) grouped[f.teacher_name] = { class: [], teacher: [] };
    grouped[f.teacher_name].class.push(f.class_rating);
    grouped[f.teacher_name].teacher.push(f.teacher_rating);
  });

  const data = Object.entries(grouped).map(([teacher, vals]) => ({
    teacher,
    "Class Avg": parseFloat((vals.class.reduce((a, b) => a + b, 0) / vals.class.length).toFixed(2)),
    "Teacher Avg": parseFloat((vals.teacher.reduce((a, b) => a + b, 0) / vals.teacher.length).toFixed(2)),
  }));

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Ratings by Teacher</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="teacher" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Class Avg" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Teacher Avg" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}