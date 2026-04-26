import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

const CATEGORY_COLORS = {
  academic: "bg-primary text-primary-foreground",
  sports:   "bg-chart-3 text-white",
  arts:     "bg-chart-4 text-white",
  social:   "bg-accent text-accent-foreground",
  holiday:  "bg-destructive text-destructive-foreground",
  other:    "bg-secondary text-secondary-foreground",
};

const CATEGORY_DOT = {
  academic: "bg-primary",
  sports:   "bg-chart-3",
  arts:     "bg-chart-4",
  social:   "bg-accent",
  holiday:  "bg-destructive",
  other:    "bg-muted-foreground",
};

export default function EventCalendar({ events, onSelectEvent }) {
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState(null);

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let day = calStart;
  while (day <= calEnd) { days.push(day); day = addDays(day, 1); }

  const getEventsForDay = (d) =>
    events.filter((e) => isSameDay(new Date(e.date + "T00:00:00"), d));

  const selectedEvents = selected ? getEventsForDay(selected) : [];

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{format(current, "MMMM yyyy")}</h2>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={() => setCurrent(subMonths(current, 1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrent(new Date())}>Today</Button>
          <Button variant="outline" size="icon" onClick={() => setCurrent(addMonths(current, 1))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 text-center">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
          <div key={d} className="text-xs font-medium text-muted-foreground py-2">{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-t border-l border-border rounded-xl overflow-hidden">
        {days.map((d, i) => {
          const dayEvents = getEventsForDay(d);
          const isToday = isSameDay(d, new Date());
          const isSelected = selected && isSameDay(d, selected);
          const inMonth = isSameMonth(d, current);

          return (
            <div
              key={i}
              onClick={() => setSelected(isSelected ? null : d)}
              className={cn(
                "min-h-[80px] border-b border-r border-border p-1.5 cursor-pointer transition-colors",
                !inMonth && "bg-muted/30",
                isSelected && "bg-primary/8",
                inMonth && !isSelected && "hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1",
                isToday && "bg-primary text-primary-foreground",
                !isToday && !inMonth && "text-muted-foreground/50",
                !isToday && inMonth && "text-foreground"
              )}>
                {format(d, "d")}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 2).map((e) => (
                  <div
                    key={e.id}
                    onClick={(ev) => { ev.stopPropagation(); onSelectEvent(e); }}
                    className={cn("text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80", CATEGORY_COLORS[e.category] || CATEGORY_COLORS.other)}
                  >
                    {e.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-muted-foreground px-1">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Events */}
      {selected && selectedEvents.length > 0 && (
        <div className="border border-border rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">{format(selected, "EEEE, MMMM d")}</h3>
          {selectedEvents.map((e) => (
            <div key={e.id} className="flex items-start gap-3 cursor-pointer group" onClick={() => onSelectEvent(e)}>
              <div className={cn("w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0", CATEGORY_DOT[e.category] || CATEGORY_DOT.other)} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm group-hover:text-primary transition-colors">{e.title}</p>
                {(e.start_time || e.location) && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {e.start_time && `${e.start_time}${e.end_time ? ` – ${e.end_time}` : ""}`}
                    {e.start_time && e.location && " · "}
                    {e.location}
                  </p>
                )}
              </div>
              <Badge variant="secondary" className="text-xs capitalize flex-shrink-0">{e.category}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}