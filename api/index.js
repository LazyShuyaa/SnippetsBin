const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

/**
 * The API stays up even if MongoDB is unreachable, so the front end can show a
 * helpful error instead of an opaque network failure. Mongoose buffers
 * operations and resolves them once the connection is (re)established.
 */
let databaseReady = false;

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000,
  })
  .then(() => {
    databaseReady = true;
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const snippetSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    language: { type: String, required: true },
    uniqueCode: { type: String, unique: true, required: true },
    expiresAt: { type: Date, default: null }
  },
  { timestamps: true }
);

snippetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Snippet = mongoose.model('Snippet', snippetSchema);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const generateUniqueCode = () => uuidv4().slice(0, 5).toLowerCase();

/** Shape a document for the API response. */
const serialize = (snippet) => ({
  code: snippet.code,
  language: snippet.language,
  uniqueCode: snippet.uniqueCode,
  // `toISOString()` already ends in "Z" — never append a second one.
  expiresAt: snippet.expiresAt ? snippet.expiresAt.toISOString() : null,
  createdAt: snippet.createdAt ? snippet.createdAt.toISOString() : null
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    database: databaseReady ? 'connected' : 'disconnected'
  });
});

app.get('/api/snippets/:uniqueCode', async (req, res) => {
  const { uniqueCode } = req.params;
  try {
    const snippet = await Snippet.findOne({ uniqueCode: uniqueCode.toLowerCase() });
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    res.status(200).json(serialize(snippet));
  } catch (error) {
    console.error('Error finding snippet:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/snippets', async (req, res) => {
  const { code, language, expireTime } = req.body || {};

  if (!code || !language || expireTime === undefined) {
    return res.status(400).json({ message: 'Missing required fields: code, language, or expireTime' });
  }

  let expiresAt = null;

  if (expireTime !== 0 && expireTime !== 'never') {
    const expireTimeInt = parseInt(expireTime, 10);
    if (isNaN(expireTimeInt) || expireTimeInt <= 0) {
      return res.status(400).json({ message: 'Invalid expireTime' });
    }
    expiresAt = new Date(Date.now() + expireTimeInt * 60000);
  }

  try {
    // Retry on the (unlikely) collision with an existing short code.
    let snippet;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      snippet = new Snippet({
        code,
        language,
        uniqueCode: generateUniqueCode(),
        expiresAt
      });
      try {
        await snippet.save();
        break;
      } catch (error) {
        if (error?.code === 11000 && attempt < 4) continue; // duplicate key
        throw error;
      }
    }

    res.status(201).json(serialize(snippet));
  } catch (error) {
    console.error('Error saving snippet:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = app;
