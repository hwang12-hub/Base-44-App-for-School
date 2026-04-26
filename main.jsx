{
  "name": "EventAnnouncement",
  "type": "object",
  "properties": {
    "event_id": {
      "type": "string",
      "description": "ID of the related event"
    },
    "event_title": {
      "type": "string",
      "description": "Title of the related event (denormalized for display)"
    },
    "message": {
      "type": "string",
      "description": "Announcement text"
    }
  },
  "required": [
    "event_id",
    "message"
  ]
}