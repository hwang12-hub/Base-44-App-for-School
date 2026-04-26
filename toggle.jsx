import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AISummary({ feedbacks }) {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateSummary = async () => {
    setIsLoading(true);
    const feedbackText = feedbacks.map((f) =>
      `Parent: ${f.parent_name || "Anonymous"} | Class: ${f.class_name} (${f.class_rating}/5) | Teacher: ${f.teacher_name} (${f.teacher_rating}/5) | Comments: ${f.comments || "None"}`
    ).join("\n");

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an education analyst. Analyze the following parent feedback data and provide a clear, actionable summary. Include:

1. **Overall Satisfaction** — General sentiment and average ratings
2. **Top Strengths** — What parents appreciate most
3. **Areas for Improvement** — Common concerns or suggestions
4. **Teacher Performance** — Highlights per teacher if applicable
5. **Recommendations** — Actionable next steps for the school

Here is the feedback data:
${feedbackText}

Keep the summary concise, professional, and use bullet points where helpful.`,
    });

    setSummary(result);
    setIsLoading(false);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Insights
          </CardTitle>
          <Button
            onClick={generateSummary}
            disabled={isLoading || feedbacks.length === 0}
            size="sm"
            className="gap-2"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {summary ? "Refresh" : "Generate Summary"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Analyzing feedback...</p>
          </div>
        )}

        {!isLoading && summary && (
          <div className="prose prose-sm max-w-none text-foreground">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-semibold mt-3 mb-1.5 text-primary">{children}</h2>,
                p: ({ children }) => <p className="my-1.5 text-sm leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="my-1.5 ml-4 list-disc space-y-1">{children}</ul>,
                li: ({ children }) => <li className="text-sm">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        )}

        {!isLoading && !summary && (
          <p className="text-sm text-muted-foreground text-center py-6">
            {feedbacks.length === 0
              ? "No feedback data to analyze yet."
              : "Click \"Generate Summary\" to get AI-powered insights from all parent feedback."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}