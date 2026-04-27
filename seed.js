const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://localhost:27017";

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db("productivity_hub");


    // CLEAR OLD DATA
    await db.collection("users").deleteMany({});
    await db.collection("projects").deleteMany({});
    await db.collection("tasks").deleteMany({});
    await db.collection("notes").deleteMany({});

    // USERS
    const users = [
      {
        _id: new ObjectId(),
        email: "ali@test.com",
        passwordHash: await bcrypt.hash("123", 10),
        name: "Ali",
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        email: "sara@test.com",
        passwordHash: await bcrypt.hash("456", 10),
        name: "Sara",
        createdAt: new Date()
      }
    ];

    await db.collection("users").insertMany(users);

    // PROJECTS
    const projects = [
      {
        _id: new ObjectId(),
        userId: users[0]._id,
        name: "Web App",
        archived: false,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        userId: users[0]._id,
        name: "Mobile App",
        archived: false,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        userId: users[1]._id,
        name: "AI Project",
        archived: false,
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        userId: users[1]._id,
        name: "Database Lab",
        archived: false,
        createdAt: new Date()
      }
    ];

    await db.collection("projects").insertMany(projects);

    // TASKS
    const tasks = [
      {
        _id: new ObjectId(),
        projectId: projects[0]._id,
        title: "Design UI",
        status: "todo",
        priority: 1,
        tags: ["ui"],
        subtasks: [
          { title: "Wireframe", done: false },
          { title: "Mockup", done: false }
        ],
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        projectId: projects[0]._id,
        title: "Setup Backend",
        status: "in-progress",
        priority: 2,
        tags: ["backend"],
        subtasks: [
          { title: "API setup", done: true }
        ],
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        projectId: projects[1]._id,
        title: "Login Screen",
        status: "todo",
        priority: 1,
        tags: ["mobile"],
        subtasks: [],
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        projectId: projects[2]._id,
        title: "Train Model",
        status: "todo",
        priority: 3,
        tags: ["ai"],
        subtasks: [],
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        projectId: projects[3]._id,
        title: "Schema Design",
        status: "done",
        priority: 1,
        tags: ["mongodb"],
        subtasks: [
          { title: "ER Diagram", done: true }
        ],
        createdAt: new Date()
      }
    ];

    await db.collection("tasks").insertMany(tasks);

    // NOTES
    const notes = [
      {
        _id: new ObjectId(),
        userId: users[0]._id,
        projectId: projects[0]._id,
        content: "Frontend ideas",
        tags: ["ui"],
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        userId: users[0]._id,
        content: "General notes",
        tags: ["personal"],
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        userId: users[1]._id,
        projectId: projects[2]._id,
        content: "AI notes",
        tags: ["ai"],
        createdAt: new Date()
      }
    ];

    await db.collection("notes").insertMany(notes);

    console.log("✅ Database seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await client.close();
  }
}

seed();
