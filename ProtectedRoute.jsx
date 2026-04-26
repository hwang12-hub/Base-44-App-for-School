{
  "name": "ChatMessage",
  "type": "object",
  "properties": {
    "session_id": {
      "type": "string",
      "description": "Unique session identifier for the conversation"
    },
    "role": {
      "type": "string",
      "enum": [
        "user",
        "assistant"
      ],
      "description": "Who sent the message"
    },
    "content": {
      "type": "string",
      "description": "Message content"
    }
  },
  "required": [
    "session_id",
    "role",
    "content"
  ]
}