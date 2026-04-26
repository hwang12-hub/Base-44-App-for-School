import React from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const CATEGORY_COLORS = {
  academic: "bg-primary/10 text-primary",
  sports:   "bg-chart-3/10 text-chart-3",
  arts:     "bg-chart-4/10 text-chart-4",
  social:   "bg-accent/20 text-accent-foreground",
  holiday:  "bg-destructive/10 text-destructive",
  other:    "bg-secondary text-secondary-foreground",
};

export default function EventDetailModal({ event, isAdmin, onClose, onEdit, onDeleted }) {
  if (!event) return null;

  const handleDelete = async () => {
    if (!confirm("Delete this event?")) return;
    await base44.entities.Event.delete(event.id);
    toast.success("Event deleted.");
    onDeleted();
    onClose();
  };

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="text-lg leading-snug">{event.title}</DialogTitle>
            <Badge className={`capitalize flex-shrink-0 ${CATEGORY_COLORS[event.category] || CATEGORY_COLORS.other}`}>
              {event.category}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{format(new Date(event.date + "T00:00:00"), "EEEE, MMMM d, yyyy")}</span>
          </div>
          {(event.start_time || event.end_time) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{event.start_time}{event.end_time ? ` – ${event.end_time}` : ""}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
          {event.description && (
            <p className="text-sm text-foreground leading-relaxed border-t border-border pt-3 mt-3">{event.description}</p>
          )}
        </div>

        {isAdmin && (
          <div className="flex gap-2 pt-2 border-t border-border">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { onClose(); onEdit(event); }}>
              <Pencil className="w-3.5 h-3.5" /> Edit
            </Button>
            <Button variant="destructive" size="sm" className="gap-1.5" onClick={handleDelete}>
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}