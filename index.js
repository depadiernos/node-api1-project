// implement your API here
const express = require("express");
const cors = require("cors");
let db = require("./data/db");

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;
const host = "127.0.0.1"; // another way to say "localhost"

app.listen(port, host, (req, res) => {
  console.log(`Server running at http://${host}:${port}`);
});

app.post("/api/users", async (req, res) => {
  if (!req.body.name || !req.body.bio) {
    return res.status(400).json({ error: "Missing user name or bio" });
  }
  try {
    const user = await db.insert(req.body);
    const newUser = await db.findById(user.id);
    return res.status(200).json(newUser);
  } catch (err) {
    return res.status(500).json({
      errorMessage: "There was an error while saving the user to the database"
    });
  }
});

app.get("/api/users", async (req, res) => {
  const users = await db.find();
  res.json(users);
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await db.findById(req.params.id);
    if (user === undefined) {
      return res
        .status(404)
        .json({ message: "The user with the specified ID does not exist" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({
      errorMessage: "The user information could not be retrieved."
    });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const deletedRecords = await db.remove(req.params.id);
    if (deletedRecords === 0) {
      return res
        .status(404)
        .json({ message: "The user with the specified ID does not exist" });
    }
    return res.status(200).json({ deleted: deletedRecords });
  } catch (err) {
    return res.status(500).json({
      errorMessage: "The user could not be removed."
    });
  }
});

app.put("/api/users/:id", async (req, res) => {
  if (!req.body.name || !req.body.bio) {
    return res
      .status(400)
      .json({ error: "Please provide name and bio for the user" });
  }
  try {
    const user = await db.update(req.params.id, req.body);

    if (user === undefined) {
      return res
        .status(404)
        .json({ message: "The user with the specified ID does not exist" });
    }
    const newUser = await db.findById(req.params.id)
    return res.status(200).json(newUser);
  } catch (err) {
    return res.status(500).json({
      errorMessage: "The user information could not be modified."
    });
  }
});
