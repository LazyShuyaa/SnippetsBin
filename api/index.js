const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const snippetSchema = new mongoose.Schema({
  code: { type: String, required: true },
  language: { type: String, required: true },
  uniqueCode: { type: String, unique: true, required: true },
  expiresAt: { type: Date, default: null }
});

snippetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Snippet = mongoose.model('Snippet', snippetSchema);

app.use(cors());
app.use(express.json());

const generateUniqueCode = () => uuidv4().slice(0, 5);

app.get('/api/snippets/:uniqueCode', async (req, res) => {
  const { uniqueCode } = req.params;
  try {
    const snippet = await Snippet.findOne({ uniqueCode });
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    res.status(200).json({
      code: snippet.code,
      language: snippet.language,
      uniqueCode: snippet.uniqueCode,
      expiresAt: snippet.expiresAt ? snippet.expiresAt.toISOString() + 'Z' : null
    });
  } catch (error) {
    console.error('Error finding snippet:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/snippets', async (req, res) => {
  const { code, language, expireTime } = req.body;

  if (!code || !language || expireTime === undefined) {
    return res.status(400).json({ message: 'Missing required fields: code, language, or expireTime' });
  }

  const uniqueCode = generateUniqueCode();
  let expiresAt = null;

  if (expireTime !== 0 && expireTime !== 'never') {
    const expireTimeInt = parseInt(expireTime, 10);
    if (isNaN(expireTimeInt) || expireTimeInt <= 0) {
      return res.status(400).json({ message: 'Invalid expireTime' });
    }
    expiresAt = new Date(Date.now() + expireTimeInt * 60000);
  }

  const snippet = new Snippet({
    code,
    language,
    uniqueCode,
    expiresAt
  });

  try {
    await snippet.save();
    res.status(201).json({
      code: snippet.code,
      language: snippet.language,
      uniqueCode: snippet.uniqueCode,
      expiresAt: snippet.expiresAt ? snippet.expiresAt.toISOString() + 'Z' : null
    });
  } catch (error) {
    console.error('Error saving snippet:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
