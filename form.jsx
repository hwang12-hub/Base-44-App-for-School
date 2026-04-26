import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

const SESSION_KEY = "edu_chat_session";

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem(SESSION_KEY, id); }
  return id;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! 👋 I'm the EduFeedback assistant. Ask me anything about school events, policies, or general inquiries!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const sessionId = getSessionId();

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Save user message
    await base44.entities.ChatMessage.create({ session_id: sessionId, role: "user", content: userMsg.content });

    // Build history for context (last 6 messages)
    const history = [...messages, userMsg].slice(-6).map((m) => `${m.role === "user" ? "Parent" : "Assistant"}: ${m.content}`).join("\n");

    // Fetch recent feedback data for context
    const feedbacks = await base44.entities.Feedback.list("-created_date", 20);
    const feedbackSummary = feedbacks.length > 0
      ? feedbacks.map((f) => `Class: ${f.class_name}, Teacher: ${f.teacher_name}, Class Rating: ${f.class_rating}/5, Teacher Rating: ${f.teacher_rating}/5${f.comments ? `, Comment: "${f.comments}"` : ""}`).join("\n")
      : "No feedback data yet.";

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a helpful school assistant chatbot for EduFeedback, a parent communication platform. 
Your job is to answer parent questions about school events, policies, feedback, and general inquiries in a friendly, concise manner.

SCHOOL KNOWLEDGE BASE:
- School hours: Monday–Friday, 8:00 AM – 3:00 PM
- Office hours: 7:30 AM – 4:00 PM
- Absence policy: Parents must notify the school by 8:30 AM via phone or app
- Uniform policy: Full uniform required Mon–Thu; casual Friday (school colors only)
- Parent-teacher meetings: Scheduled each term via the app
- Lunch: School provides hot meals; parents can also send packed lunches
- Emergency contact: +1-800-EDU-SCHOOL | admin@edufeedback.edu
- Upcoming events: Sports Day (May 10), Science Fair (May 24), End of Term (June 15)
- Feedback: Parents can submit feedback on classes and teachers via the Feedback Form

RECENT PARENT FEEDBACK DATA:
${feedbackSummary}

CONVERSATION HISTORY:
${history}

Parent's latest question: ${userMsg.content}

Reply helpfully and concisely. If you don't know something specific, direct them to contact the school office.`,
    });

    const assistantMsg = { role: "assistant", content: result };
    setMessages((prev) => [...prev, assistantMsg]);
    await base44.entities.ChatMessage.create({ session_id: sessionId, role: "assistant", content: result });
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[340px] sm:w-[380px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: "480px" }}
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary-foreground/20 rounded-lg">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-foreground">School Assistant</p>
                  <p className="text-xs text-primary-foreground/70">Always here to help</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  )}>
                    {msg.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-1 last:mb-0 leading-relaxed">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc ml-4 mb-1">{children}</ul>,
                          li: ({ children }) => <li className="mb-0.5">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        }}
                      >{msg.content}</ReactMarkdown>
                    ) : (
                      <p className="leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-3 border-t border-border flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 text-sm"
                disabled={loading}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || loading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((p) => !p)}
        className="w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}