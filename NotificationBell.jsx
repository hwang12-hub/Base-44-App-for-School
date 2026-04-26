{
  "name": "Event",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Name of the school event"
    },
    "description": {
      "type": "string",
      "description": "Details about the event"
    },
    "date": {
      "type": "string",
      "format": "date",
      "description": "Date of the event"
    },
    "start_time": {
      "type": "string",
      "description": "Start time of the event (e.g. 09:00)"
    },
    "end_time": {
      "type": "string",
      "description": "End time of the event (e.g. 11:00)"
    },
    "category": {
      "type": "string",
      "enum": [
        "academic",
        "sports",
        "arts",
        "social",
        "holiday",
        "other"
      ],
      "default": "other",
      "description": "Category of the event"
    },
    "location": {
      "type": "string",
      "description": "Location or venue of the event"
    }
  },
  "required": [
    "title",
    "date"
  ]
}