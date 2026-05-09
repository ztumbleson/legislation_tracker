// 
// main.js
// 05-09-2026
// Main node/express app running on the server
//

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const legislatorsRouter = require('./endpoints/LegislatorsRouter');
const legislationRouter = require('./endpoints/LegislationRouter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/legislators', legislatorsRouter);
app.use('/legislation', legislationRouter);

// Global error handler — catches any unhandled errors thrown in route handlers
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
