{
  "name": "InAppNotification",
  "type": "object",
  "properties": {
    "parent_email": {
      "type": "string",
      "description": "Email of the recipient parent"
    },
    "title": {
      "type": "string",
      "description": "Notification title"
    },
    "message": {
      "type": "string",
      "description": "Notification body"
    },
    "event_id": {
      "type": "string",
      "description": "Related event ID"
    },
    "type": {
      "type": "string",
      "enum": [
        "new_event",
        "event_updated",
        "announcement"
      ],
      "description": "Type of notification"
    },
    "read": {
      "type": "boolean",
      "default": false,
      "description": "Whether the parent has read this notification"
    }
  },
  "required": [
    "parent_email",
    "title",
    "message",
    "type"
  ]
}