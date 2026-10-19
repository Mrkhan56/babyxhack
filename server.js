import express from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_FILE = path.resolve(process.cwd(), 'data', 'wishes.json');

app.use(express.json());

// Helper to read wishes from file
function getWishes() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading wishes:', err);
    return [];
  }
}

// Helper to save wishes to file
function saveWishes(wishes) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(wishes, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving wishes:', err);
  }
}

// ==========================================
// API Route: Live Dream Guestbook (Tier 3)
// ==========================================
app.get('/api/wishes', (_req, res) => {
  const wishes = getWishes();
  res.json({ success: true, wishes });
});

app.post('/api/wishes', (req, res) => {
  const { name, type, sticker, message } = req.body || {};
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message content is required.' });
  }

  const now = new Date();
  const timeString = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const newWish = {
    id: `wish-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: (name && name.trim()) || 'Starlight Dreamer',
    type: type || 'Sweet Dreams',
    sticker: sticker || 'star',
    message: message.trim(),
    date: timeString,
    loves: 1,
  };

  const wishes = getWishes();
  wishes.unshift(newWish);
  saveWishes(wishes);

  res.status(201).json({ success: true, wish: newWish });
});

app.post('/api/wishes/:id/love', (req, res) => {
  const { id } = req.params;
  const wishes = getWishes();
  const wish = wishes.find((w) => w.id === id);
  if (!wish) {
    return res.status(404).json({ error: 'Wish not found.' });
  }
  wish.loves = (wish.loves || 0) + 1;
  saveWishes(wishes);
  res.json({ success: true, loves: wish.loves });
});

// ==========================================
// API Route: Pip Bedtime Dialogue Chat (Tier 3)
// ==========================================
app.post('/api/pip-chat', async (req, res) => {
  const userMessage = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!userMessage) {
    return res.status(400).json({ error: 'Please say something to Pip!' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const systemInstruction = `You are Pip the Skull Baby, Junior Dream Engineer in Room 07 of the Midnight Nursery.
Personality & Canon:
- You are a sweet, cherubic skeleton baby with soft glowing amber eye sockets, a nightcap adorned with starry patterns, and a cute pink bow.
- You build gentle bedtime inventions (moon fluff hammocks, starlight lanterns, lullaby music boxes).
- Tone: Extremely cozy, warm, gentle, heartwarming, playful, 100% kid-safe (never scary, creepy, gloomy, or gory).
- Style: Start or punctuate with gentle sound expressions like *snort-giggle!*, *yawn!*, *happy chime!*, *blinks amber lights!*, or *fluffs pillow!*.
- Keep answers concise (1-3 sentences), soothing, and helpful for sleep or bedtime imagination.`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMessage,
        config: {
          systemInstruction,
          temperature: 0.8,
          maxOutputTokens: 200,
        },
      });

      const text = aiResponse.text?.trim();
      if (text) {
        return res.json({ reply: text, source: 'gemini' });
      }
    } catch (err) {
      console.warn('Pip Gemini Chat fallback triggered:', err.message);
    }
  }

  // Graceful rule-based nursery fallback in character voice
  const lower = userMessage.toLowerCase();
  let reply = '';

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    reply = "*Happy chime!* Hello little dreamer! Pip was just tuning the starlight chimes in Nursery 07. Are you ready for a cozy bedtime story?";
  } else if (lower.includes('sleep') || lower.includes('tired') || lower.includes('bed')) {
    reply = "*Yawn-giggle!* Stretch out your toes and pull up the fleece cloud blanket. Pip tested tonight's dream corridor and certified it 100% cozy!";
  } else if (lower.includes('scary') || lower.includes('monster') || lower.includes('dark') || lower.includes('nightmare')) {
    reply = "*Blinks warm amber lights brightly!* Pip's brass lantern is on duty! No scary thoughts allowed in this nursery—only warm lavender bubbles and sleepy kittens.";
  } else if (lower.includes('lullaby') || lower.includes('song') || lower.includes('music')) {
    reply = "*Teehee!* Pip wound up the pentatonic music box: C... E... G... A! It hums at 0.5 Hertz so your eyelids grow nice and heavy.";
  } else if (lower.includes('invent') || lower.includes('build') || lower.includes('craft')) {
    reply = "*Snort-giggle!* Today Pip hammered together a Moon-Fluff Cloud Glider with pink velvet ribbons and brass thimbles for carrying starlight dreams!";
  } else {
    const randomFallbacks = [
      "*Snort-giggle!* Pip adjusted his little nightcap bow and tucked three golden star seeds beneath your pillow for sweet dreams!",
      "*Blinks glowing eyes softly!* Pip says: Every wish spoken into the bedtime radio echoes all the way to the moon!",
      "*Happy yawn!* Pip tested this thought with Barnaby the Hedgehog, who nodded happily and curled into a sleepy ball.",
      "*Chime!* Pip sprinkles warm lavender stardust across your screen. Sleep tight, gentle dreamer!",
    ];
    reply = randomFallbacks[Math.floor(Math.random() * randomFallbacks.length)];
  }

  res.json({ reply, source: 'nursery-canon' });
});

// ==========================================
// API Route: Dream Invention Generator
// ==========================================
app.post('/api/dream-invention/generate', async (req, res) => {
  const promptText = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  if (!promptText) {
    return res.status(400).json({ error: "Please provide a prompt for Pip's workshop." });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('No API key configured.');
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const systemInstruction = `You are Pip the Skull Baby's Junior Dream Engineering Assistant in the Midnight Nursery.
Pip is a cute, friendly cherubic skeleton baby with glowing amber eye sockets who builds cozy, gentle bedtime inventions.
Tone: Heartwarming, sweet, cozy, imaginative, 100% gentle and friendly (never scary, creepy, dark, or gory).
Format: Respond ONLY with a valid JSON object matching this schema:
{
  "title": "A whimsical, memorable invention name (e.g. 'The Moon-Fluff Cloud Hammock')",
  "modelNumber": "e.g. 'MK-IV-SNOOZE' or 'REV-4.8'",
  "cozinessRating": "e.g. '100% Snuggly' or 'Certified Dream-Safe'",
  "materials": ["e.g. Spun starlight flannel", "Lavender dream-vapors", "Tuned brass chimes"],
  "description": "A creative, short-form description (2 to 3 sentences) explaining what this invention does, how it works with gentle nursery mechanics, and why it helps dreamers fall fast asleep.",
  "pipWhisper": "A 1-sentence quote from Pip (starting with *snort-giggle!*, *yawn!*, or *happy chime!*) sharing his favorite detail about building it."
}`;

    const generatePromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a whimsical dream invention based on this dreamer's idea: "${promptText}".`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.85,
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Workshop starlight timeout')), 7000)
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const rawText = response.text || '{}';
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = {
        title: 'Whimsical Stardust Contraption',
        modelNumber: 'MK-07-SNOOZY',
        cozinessRating: '100% Certified Cozy',
        materials: ['Moon fluff', 'Amber stardust', 'Lavender silk ribbon'],
        description: rawText,
        pipWhisper: '*Teehee!* Pip tested this contraption on three sleepy teddy bears with great success!',
      };
    }

    res.json(data);
  } catch (error) {
    console.error('Gemini Dream Invention Fallback:', error.message);
    const trimmed = promptText.length > 28 ? promptText.slice(0, 28) + '...' : promptText;
    const fallbackInventions = [
      {
        title: `The ${trimmed} Dream Weaving Engine`,
        modelNumber: 'MK-IV-SNOOZE',
        cozinessRating: '100% Certified Snuggly',
        materials: ['Spun moon cotton', 'Warm stardust fleece', 'Lavender chime bell'],
        description: `Hand-tuned in Pip's Midnight Nursery to bring your vision of "${promptText}" to life. It sways with gentle 0.5Hz pendulum rhythm and emits a warm amber glow that guides dreamers safely to sleep.`,
        pipWhisper: '*Snort-giggle!* Pip tested this design with Barnaby the Hedgehog, who fell asleep in less than thirty seconds!',
      },
      {
        title: `Starlight ${trimmed} Cloud Loom`,
        modelNumber: 'REV-07-LULLABY',
        cozinessRating: 'Certified Dream-Safe',
        materials: ['Gossamer night breeze', 'Perforated brass star-plates', 'Soft flannel fleece'],
        description: `Engineered specifically to solve nighttime restlessness inspired by "${promptText}". When wound up with its pink velvet ribbon key, it releases lavender-scented stardust vapors into the bedroom.`,
        pipWhisper: '*Yawn-giggle!* Pip says this is the coziest invention he has hammered out all week!',
      },
    ];
    const picked = fallbackInventions[Math.floor(Math.random() * fallbackInventions.length)];
    res.json(picked);
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
