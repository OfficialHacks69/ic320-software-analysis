import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY not set');
  process.exit(1);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.post('/api/ai', async (req, res) => {
  const { question } = req.body;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${GEMINI_API_KEY}`;
    const result = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: { text: question }, temperature: 0.7, maxOutputTokens: 200 })
    });
    const data = await result.json();
    res.json({ answer: data?.candidates?.[0]?.output || 'No valid response' });
  } catch (e) {
    res.status(500).json({ error: 'Error fetching response', detail: e.message });
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));