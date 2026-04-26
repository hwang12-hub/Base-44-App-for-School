import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const TYPE_LABELS = {
  new_event: "New Event",
  event_updated: "Event Updated",
  announcement: "Announcement",
};

const TYPE_COLORS = {
  new_event: "bg-primary/10 text-primary",
  event_updated: "bg-chart-2/20 text-chart-2",
  announcement: "bg-destructive/10 text-destructive",
};

export default function NotificationBell({ parentEmail }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    if (!parentEmail) return;
    const data = await base44.entities.InAppNotification.filter({ parent_email: parentEmail }, "-created_date", 20);
    setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [parentEmail]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    const unreadOnes = notifications.filter((n) => !n.read);
    await Promise.all(unreadOnes.map((n) => base44.entities.InAppNotification.update(n.id, { read: true })));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = async (notif) => {
    if (notif.read) return;
    await base44.entities.InAppNotification.update(notif.id, { read: true });
    setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, read: true } : n));
  };

  if (!parentEmail) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen((p) => !p); if (!open) fetchNotifications(); }}
        className="relative p-2 rounded-xl hover:bg-muted transition-colors"
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="font-semibold text-sm">Notifications</span>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No notifications yet</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n)}
                    className={cn(
                      "px-4 py-3 border-b border-border/50 cursor-pointer hover:bg-muted/50 transition-colors",
                      !n.read && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />}
                      <div className={cn("flex-1", n.read && "pl-3.5")}>
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", TYPE_COLORS[n.type] || "bg-muted text-muted-foreground")}>
                            {TYPE_LABELS[n.type] || n.type}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{format(new Date(n.created_date), "MMM d, h:mm a")}</span>
                        </div>
                        <p className="text-sm font-medium leading-tight">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}