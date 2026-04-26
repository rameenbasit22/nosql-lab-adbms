# Schema Design — Personal Productivity Hub

---

## 1. Collections Overview

- **users** — Stores account information for each user including login credentials and profile details. Each user can own multiple projects.
- **projects** — Stores projects created by users. Each project belongs to one user and can contain multiple tasks.
- **tasks** — Stores tasks belonging to projects. Each task includes status, priority, tags, and embedded subtasks.
- **notes** — Stores notes created by users. Notes can be standalone or optionally linked to a project.

---

## 2. Document Shapes

### users
{
  _id: ObjectId,
  email: string (required, unique),
  passwordHash: string (required),
  name: string (required),
  createdAt: Date (required)
}

### projects
{
  _id: ObjectId,
  userId: ObjectId (required, reference to users),
  name: string (required),
  archived: boolean (default: false),
  createdAt: Date (required)
}

### tasks
{
  _id: ObjectId,
  projectId: ObjectId (required, reference to projects),
  title: string (required),
  status: string (required, enum: "todo" | "in-progress" | "done"),
  priority: number (required),
  tags: [string],
  subtasks: [
    {
      title: string (required),
      done: boolean (required)
    }
  ],
  createdAt: Date (required)
}

### notes
{
  _id: ObjectId,
  userId: ObjectId (required, reference to users),
  projectId: ObjectId (optional, reference to projects),
  content: string (required),
  tags: [string],
  createdAt: Date (required)
}

---

## 3. Embed vs Reference — Decisions

| Relationship                  | Type        | Reason |
|------------------------------|------------|--------|
| Subtasks inside a task       | Embed       | Subtasks depend fully on the parent task and are not useful independently. |
| Tags on a task               | Embed       | Tags are small, simple values tightly coupled with tasks. |
| Project → Task ownership     | Reference   | Tasks can be queried independently and may scale in large numbers. |
| Note → optional Project link | Reference   | Notes can exist with or without a project, requiring flexibility. |

---

## 4. Schema Flexibility Example

The `projectId` field in the notes collection is optional and only exists when a note is linked to a project. Standalone notes do not include this field.

This is acceptable in MongoDB because it supports flexible schemas, allowing documents in the same collection to have different structures without enforcing strict rules.