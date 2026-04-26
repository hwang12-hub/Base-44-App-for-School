{
  "name": "EventSubscription",
  "type": "object",
  "properties": {
    "parent_email": {
      "type": "string",
      "description": "Email of the subscribing parent"
    },
    "parent_name": {
      "type": "string",
      "description": "Name of the subscribing parent"
    },
    "subscribed_categories": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of event categories subscribed to (e.g. sports, arts)"
    },
    "subscribed_event_ids": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of specific event IDs subscribed to"
    }
  },
  "required": [
    "parent_email"
  ]
}