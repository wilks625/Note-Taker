// DEPENDENCIES
const express = require("express");
const path = require("path");
const fs = require("fs");

// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server
// Tells node that we are creating an "express" server
const app = express();

// Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// These routes give our server a "map" of how to respond when users visit or request data from various URLs.
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "/db/db.json"), function (error, response) {
    const notes = JSON.parse(response);
    console.log(notes);
    res.json(notes);
  });
});

app.post("/api/notes", function (req, res) {
  fs.readFile(path.join(__dirname, "/db/db.json"), function (error, response) {
    const notes = JSON.parse(response);
    const noteRequest = req.body;
    const newNoteID = notes.length + 1;
    const newNote = {
      id: newNoteID,
      title: noteRequest.title,
      text: noteRequest.text,
    };
    if (error) {
      console.log(error);
    }
    notes.push(newNote);
    res.json(newNote);
    fs.writeFile(
      path.join(__dirname, "/db/db.json"),
      JSON.stringify(notes, null, 2),
      function (err) {
        if (err) throw err;
      }
    );
  });
});

// // LISTENER
// // The below code effectively "starts" our server
app.listen(PORT, () => {
  console.log(`app is running on ${PORT}.`);
});
