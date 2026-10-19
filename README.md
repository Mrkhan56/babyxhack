# 🌙 Pip the Skull Baby — Dreamweaver Portfolio

> *"Cute · Gentle · Never Scary"*

An immersive, interactive digital portfolio and bedtime sanctuary celebrating **Pip the Skull Baby** — the gentle nocturnal guardian who floats on clouds and weaves starlight into soothing lullabies and sweet dreams.

---

## ✨ About the Website

The Pip Portfolio is an interactive sensory experience built with a warm **Cozy Midnight Nursery** aesthetic. It replaces traditional corporate portfolio tropes with storybook charm, musical toys, and playful micro-interactions:

- **Interactive Portrait**: Pip floats on a pillowy cloud bed with smoothly tracking glowing amber eyes that follow the visitor's cursor, customizable nursery mood lighting (*Daylight Nap*, *Golden Dusk*, *Midnight Slumber*, *Dream Realm*), and a clickable nightcap bow easter egg.
- **Web Audio Pentatonic Synthesizer**: Custom real-time Web Audio API sound engine that generates soothing glockenspiel chimes, pentatonic tones, resonant wood blocks, and bedtime melodies with full toggleable sound effects.
- **Live Bedtime Guestbook (Wish Wall)**: A persistent guestbook where visitors leave bedtime wishes, starry affirmations, and send hearts in real-time.
- **Dreamcatcher Arcade**: A 60 FPS HTML5 Canvas arcade mini-game where players collect falling stardust, catch sleepy dream bubbles, and dodge alarm clocks.
- **Interactive Storybook Folio**: A beautifully styled storybook featuring custom illustrated bedtime lore with smooth page navigation and narrative immersion.
- **Nightlight Mode**: A toggleable flashlight cursor system that dims the page into a cozy dark nursery with a glowing radial spotlight following the cursor.
- **Pip's Dream Forge & AI Whisperer**: A conversational modal powered by Gemini AI allowing visitors to chat with Pip and generate custom bedtime dream inventions.
- **Dreamer Memory & Badges**: Persistent localStorage visitor tracking with customizable greetings, secret click counters, and an unlockable **Dream Engineer Badge**.

---

## 🛠️ Technology Stack & Architecture

### Frontend
- **Framework**: React 19 (Pure JSX / JavaScript)
- **Bundler & Dev Server**: Vite 8 (ESM)
- **Styling**: Tailwind CSS & Vanilla CSS Design Tokens (warm cream `#FFFDF9`, pastel rose `#FFE3E8`, velvet plum `#80244a`, golden amber `#F59E0B`)
- **Audio Engine**: Pure Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`, custom ADSR envelopes)
- **Canvas Systems**: HTML5 2D Canvas for star confetti bursts and arcade mini-game rendering
- **Typography & Icons**: Material Symbols & Outfit / Google Fonts

### Backend & API
- **Server**: Express 5 on Node.js (ES Modules)
- **Persistence**: File-backed JSON database (`data/wishes.json`) with auto-initialization and atomic writes
- **AI Integration**: Google Gen AI SDK (`@google/genai`) with Gemini models and offline fallback engine

---

## 🔄 Technology Changes & Migrations

1. **Complete TypeScript to JavaScript Migration**:
   - Converted all `.tsx` and `.ts` components, utilities, and configuration files across the codebase to pure JavaScript (`.jsx` and `.js`).
   - Simplified project architecture by running native Node.js ESM (`"type": "module"`) without intermediate transpile steps.
2. **Express Backend Integration**:
   - Created a consolidated full-stack runtime (`server.js`) pairing Express API routes directly with Vite's development middleware.
   - Implemented persistent REST endpoints for the bedtime guestbook:
     - `GET /api/wishes` — Retrieve all stored community wishes
     - `POST /api/wishes` — Submit a new wish with sentiment analysis
     - `POST /api/wishes/:id/love` — Increment heart reactions
     - `POST /api/pip-chat` — AI bedtime chat endpoint
3. **Visual & Performance Optimization**:
   - Streamlined rendering with high-fidelity 2D illustration mechanics and smooth reactive parallax tilting.
   - Ultra-lean client bundle size (~402 kB), delivering instant 60 FPS animation performance and responsive touch controls on mobile and desktop.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (bundled with Node)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mrkhan56/babyxhack.git
   cd babyxhack
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```env
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: The app will run smoothly with local fallback responses even without an API key).*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   Visit [http://localhost:3000](http://localhost:3000) to explore Pip's nursery.

---

## 📂 Project Structure

```
babyxhack/
├── data/
│   └── wishes.json             # Persistent bedtime guestbook data
├── public/
│   └── favicon & static assets
├── src/
│   ├── assets/                 # Custom generated badge artwork
│   ├── components/
│   │   ├── screens/            # Full-page tab views (Arcade, Storybook, Guestbook, About)
│   │   ├── AIForgeInvention.jsx # Dream invention generator
│   │   ├── FlashlightCursor.jsx # Interactive nightlight overlay
│   │   ├── PipChatModal.jsx    # Bedtime AI conversational modal
│   │   ├── PipInteractivePortrait.jsx # 2D parallax & eye-tracking portrait
│   │   ├── SparkleCanvas.jsx   # Particle confetti engine
│   │   └── SuggestionsHub.jsx  # Interactive music block chime toy
│   ├── utils/
│   │   ├── audio.js            # Web Audio API pentatonic sound engine
│   │   └── badge.js            # Visitor memory & badge achievement tracking
│   ├── App.jsx                 # Main application layout & state
│   ├── main.jsx                # React entrypoint
│   └── index.css               # Design tokens & bedtime animations
├── server.js                   # Node.js Express backend & Vite middleware
├── package.json
└── vite.config.js
```

---

## 📜 License
Created with love for the Midnight Nursery community.
