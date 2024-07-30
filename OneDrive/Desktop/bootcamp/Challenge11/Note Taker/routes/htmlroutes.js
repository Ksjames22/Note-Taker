// routes/htmlroutes.js
const path = require('path');

module.exports = (app) => {
  // Route for /notes to serve notes.html
  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
  });

  // Catch-all route to serve index.html for all other routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
};
