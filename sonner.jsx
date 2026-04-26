import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const CATEGORIES = [
  { value: "academic", label: "Academic" },
  { value: "sports", label: "Sports" },
  { value: "arts", label: "Arts" },
  { value: "social", label: "Social" },
  { value: "holiday", label: "Holiday" },
  { value: "other", label: "Other" },
];

export default function EventFormModal({ open, onClose, event, onSaved }) {
  const [form, setForm] = useState({ title: "", description: "", date: "", start_time: "", end_time: "", category: "other", location: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setForm({ title: event.title || "", description: event.description || "", date: event.date || "", start_time: event.start_time || "", end_time: event.end_time || "", category: event.category || "other", location: event.location || "" });
    } else {
      setForm({ title: "", description: "", date: "", start_time: "", end_time: "", category: "other", location: "" });
    }
  }, [event, open]);

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) { toast.error("Title and date are required."); return; }
    setSaving(true);
    if (event) {
      await base44.entities.Event.update(event.id, form);
      toast.success("Event updated!");
    } else {
      await base44.entities.Event.create(form);
      toast.success("Event created!");
    }
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Add New Event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 py-2">
          <div>
            <Label>Title *</Label>
            <Input placeholder="e.g. Science Fair" value={form.title} onChange={(e) => update("title", e.target.value)} className="mt-1.5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date *</Label>
              <Input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start Time</Label>
              <Input type="time" value={form.start_time} onChange={(e) => update("start_time", e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>End Time</Label>
              <Input type="time" value={form.end_time} onChange={(e) => update("end_time", e.target.value)} className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>Location</Label>
            <Input placeholder="e.g. Main Hall" value={form.location} onChange={(e) => update("location", e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea placeholder="Tell parents more about this event..." value={form.description} onChange={(e) => update("description", e.target.value)} className="mt-1.5 min-h-[80px]" />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {event ? "Save Changes" : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}