const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Import and use the routes
require('./routes/htmlroutes')(app);

// API Routes
app.get('/api/notes', (req, res) => {
  const filePath = path.join(__dirname, 'db/db.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read notes file.' });
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  const filePath = path.join(__dirname, 'db/db.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read notes file.' });
    }

    let db = JSON.parse(data);

    if (!req.body.title || !req.body.text) {
      return res.status(400).json({ error: 'Note title and text are required.' });
    }

    const userNote = {
      title: req.body.title,
      text: req.body.text,
      id: uniqid(),
    };

    db.push(userNote);

    fs.writeFile(filePath, JSON.stringify(db, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Unable to save note.' });
      }
      res.json(userNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const filePath = path.join(__dirname, 'db/db.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read notes file.' });
    }

    let db = JSON.parse(data);
    const noteId = req.params.id;

    const deleteNotes = db.filter(item => item.id !== noteId);

    fs.writeFile(filePath, JSON.stringify(deleteNotes, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Unable to delete note.' });
      }
      res.json({ message: 'Note deleted successfully.', deletedNoteId: noteId });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
