import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { User, BookOpen, GraduationCap } from "lucide-react";
import StarRating from "./StarRating";

export default function FeedbackCard({ feedback }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span className="font-medium">{feedback.parent_name || "Anonymous"}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {format(new Date(feedback.created_date), "MMM d, yyyy")}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm font-medium min-w-[100px]">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>{feedback.class_name}</span>
            </div>
            <StarRating value={feedback.class_rating} readonly size="sm" />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm font-medium min-w-[100px]">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span>{feedback.teacher_name}</span>
            </div>
            <StarRating value={feedback.teacher_rating} readonly size="sm" />
          </div>
        </div>

        {feedback.comments && (
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-lg p-3">
            "{feedback.comments}"
          </p>
        )}
      </CardContent>
    </Card>
  );
}