import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, BookOpen, GraduationCap, TrendingUp } from "lucide-react";

export default function StatsOverview({ feedbacks }) {
  const total = feedbacks.length;
  const avgClass = total > 0
    ? (feedbacks.reduce((sum, f) => sum + (f.class_rating || 0), 0) / total).toFixed(1)
    : "—";
  const avgTeacher = total > 0
    ? (feedbacks.reduce((sum, f) => sum + (f.teacher_rating || 0), 0) / total).toFixed(1)
    : "—";
  const withComments = feedbacks.filter((f) => f.comments).length;

  const stats = [
    { label: "Total Responses", value: total, icon: MessageSquare, color: "text-primary bg-primary/10" },
    { label: "Avg Class Rating", value: avgClass, icon: BookOpen, color: "text-accent bg-accent/10" },
    { label: "Avg Teacher Rating", value: avgTeacher, icon: GraduationCap, color: "text-chart-3 bg-chart-3/10" },
    { label: "With Comments", value: withComments, icon: TrendingUp, color: "text-chart-4 bg-chart-4/10" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}