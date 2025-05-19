const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4173;

// Add middleware to set security headers
app.use((req, res, next) => {
  // Set Content-Security-Policy header
  res.setHeader("Content-Security-Policy", "upgrade-insecure-requests");
  
  // Set HSTS header with complete configuration including preload
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  
  next();
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 