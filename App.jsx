{
  "name": "Feedback",
  "type": "object",
  "properties": {
    "class_name": {
      "type": "string",
      "description": "Name of the class"
    },
    "teacher_name": {
      "type": "string",
      "description": "Name of the teacher"
    },
    "class_rating": {
      "type": "number",
      "description": "Rating for the class (1-5)"
    },
    "teacher_rating": {
      "type": "number",
      "description": "Rating for the teacher (1-5)"
    },
    "comments": {
      "type": "string",
      "description": "Additional feedback comments from parents"
    },
    "parent_name": {
      "type": "string",
      "description": "Name of the parent"
    }
  },
  "required": [
    "class_name",
    "teacher_name",
    "class_rating",
    "teacher_rating"
  ]
}