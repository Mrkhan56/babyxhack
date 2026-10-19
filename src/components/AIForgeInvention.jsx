import React, { useState, useEffect } from 'react';
import {
  playChimeNote,
  playEasterEggChime,
  playTone,
  playBubblePopSound,
  playHeartPopSound,
  playVictoryFanfare,
} from '../utils/audio.js';
import { triggerStarConfetti } from './SparkleCanvas.jsx';

const STORAGE_HISTORY_KEY = 'pip_dream_inventions_history';

const SAMPLE_PROMPTS = [
  'A teapot that brews warm starlight chamomile tea',
  'A cloud glider that drops gentle lullaby sprinkles',
  'Snooze slippers that float silently over creaky floors',
  'A nightcap woven from moonlight that chases away nightmares',
  'A brass pocket watch that slows down time when counting sheep',
];

export const AIForgeInvention = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [invention, setInvention] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedHistoryId, setCopiedHistoryId] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, 5));
        }
      }
    } catch (e) {
      console.warn('Could not read invention history from localStorage:', e);
    }
  }, []);

  const saveToHistory = (newInvention, promptUsed) => {
    const newItem = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      prompt: promptUsed,
      timestamp: Date.now(),
      invention: newInvention,
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, 5);
      try {
        localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save invention to localStorage:', err);
      }
      return updated;
    });
  };

  const handleSelectSample = (sampleText) => {
    setPrompt(sampleText);
    playBubblePopSound(true);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    playEasterEggChime();

    try {
      const response = await fetch('/api/invent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Server returned error ${response.status}`);
      }

      const data = await response.json();
      if (!data.invention) {
        throw new Error('Malformed invention response');
      }

      setInvention(data.invention);
      saveToHistory(data.invention, prompt.trim());
      playVictoryFanfare();
      triggerStarConfetti();

      setTimeout(() => {
        const el = document.getElementById('blueprint-display');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 150);
    } catch (err) {
      console.warn('Backend invention generation failed, using magical dream forge fallback:', err);
      const fallbackInvention = {
        title: `The Starlight ${prompt.trim().split(' ').slice(-2).join(' ')} Box`,
        modelNumber: `MK-0${Math.floor(Math.random() * 90 + 10)}`,
        cozinessRating: '99.8% Snuggle Factor',
        description: `Handcrafted in Pip's Midnight Nursery in response to: "${prompt.trim()}". Infused with sleepy lavender vapors, cold stardust filaments, and quiet acoustic pendulum wind-up springs.`,
        materials: ['Woven Cloud Shavings', 'Celestial Brass Gears', 'Amber Firefly Glass', 'Lilac Wool'],
        pipWhisper: 'I wound the springs extra gentle so it whispers the sweetest dreams!',
      };

      setInvention(fallbackInvention);
      saveToHistory(fallbackInvention, prompt.trim());
      playVictoryFanfare();
      triggerStarConfetti();
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_HISTORY_KEY);
    } catch {}
    playBubblePopSound();
  };

  const handleSelectFromHistory = (item) => {
    setInvention(item.invention);
    playChimeNote('C5', 0.6);
  };

  const handleCopyBlueprint = () => {
    if (!invention) return;
    const textToCopy = `✨ Pip's Dream Blueprint: ${invention.title} (${invention.modelNumber})\nCoziness: ${invention.cozinessRating}\nMaterials: ${invention.materials.join(', ')}\n\n${invention.description}\n\nPip whispers: "${invention.pipWhisper}"`;
    navigator.clipboard?.writeText(textToCopy);
    setSavedSuccess(true);
    playHeartPopSound();
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCopyHistoryItem = (item, e) => {
    e.stopPropagation();
    const textToCopy = `✨ Pip's Dream Blueprint: ${item.invention.title} (${item.invention.modelNumber})\nCoziness: ${item.invention.cozinessRating}\nMaterials: ${item.invention.materials.join(', ')}\n\n${item.invention.description}\n\nPip whispers: "${item.invention.pipWhisper}"`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedHistoryId(item.id);
    playHeartPopSound();
    setTimeout(() => setCopiedHistoryId(null), 1800);
  };

  const formatTimeAgo = (time) => {
    const elapsedSeconds = Math.floor((Date.now() - time) / 1000);
    if (elapsedSeconds < 60) return 'Just now';
    const mins = Math.floor(elapsedSeconds / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <section className="w-full bg-[#231538]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#69519A]/40 relative overflow-hidden flex flex-col gap-8 text-white">
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-pink-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#80244A] text-[#FFEAA7] flex items-center justify-center shadow-md border border-pink-400/40">
                <span className="material-symbols-outlined text-base">auto_awesome</span>
              </span>
              <span className="text-xs text-[#FFEAA7] font-bold uppercase tracking-wider">
                Pip's Starlight AI Forge · Powered by Gemini
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-pink-300 tracking-tight">
              Design a Custom Dream Invention
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 max-w-2xl leading-relaxed font-sans">
              Describe any bedtime gadget, cozy contraption, or soothing machine. Gemini will translate your prompt into an official Midnight Nursery patent blueprint with custom materials and cozy mechanics!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#1A1028]/95 px-3.5 py-1.5 rounded-full border border-white/10 shadow-inner self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[11px] font-bold text-purple-200 uppercase">
              Workshop Status: Online
            </span>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="dream-prompt" className="text-xs font-bold text-purple-200 flex items-center justify-between">
              <span>What would you like Pip to invent for your bedtime?</span>
              <span className="text-[11px] text-purple-400 font-normal">{prompt.length} / 200</span>
            </label>
            <div className="relative">
              <input
                id="dream-prompt"
                type="text"
                required
                maxLength={200}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A flying pillow that catches sleepy stars, or warm milk slippers..."
                disabled={loading}
                className="w-full bg-[#1A1028] rounded-2xl pl-4 pr-36 py-3.5 text-xs sm:text-sm text-white placeholder-purple-400/50 border-2 border-white/15 focus:outline-none focus:border-pink-400 transition-all shadow-inner disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="absolute right-2 top-2 bottom-2 px-4 bg-[#80244A] hover:bg-[#9e3c62] disabled:bg-purple-900/40 text-white text-xs font-headline font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed active:scale-95 border border-pink-400/30"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">
                      progress_activity
                    </span>
                    <span>Forging...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm text-[#FFEAA7]">flare</span>
                    <span>Forge Invention</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] uppercase text-purple-300 font-bold mr-1">
              Need inspiration?
            </span>
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="text-[11px] px-3 py-1 bg-[#1A1028] hover:bg-[#2D1B4E] text-purple-200 hover:text-white rounded-full border border-white/10 transition-all cursor-pointer shadow-xs"
              >
                {sample}
              </button>
            ))}
          </div>
        </form>

        {error && (
          <div className="bg-red-900/30 border border-red-500/40 rounded-2xl p-4 flex items-center gap-3 text-xs text-red-200">
            <span className="material-symbols-outlined text-lg">error</span>
            <div className="flex-1">
              <span className="font-bold">Nursery Workshop Notice:</span> {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-300 hover:underline font-bold text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {invention && (
          <div
            id="blueprint-display"
            className="mt-2 bg-[#1A1028]/95 rounded-2xl p-6 sm:p-7 border-2 border-pink-400/40 shadow-2xl animate-in fade-in duration-500 flex flex-col gap-4 relative"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#F7B731]">verified</span>
                <span className="text-xs text-[#FFEAA7] font-bold uppercase">
                  OFFICIAL PATENT · {invention.modelNumber}
                </span>
                <span className="bg-[#80244A]/60 text-pink-200 text-[10px] px-2.5 py-0.5 rounded-full border border-pink-400/30 font-bold">
                  {invention.cozinessRating}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyBlueprint}
                  className="px-3.5 py-1 text-xs bg-[#2D1B4E] hover:bg-[#3D255E] text-[#FFEAA7] font-semibold rounded-full border border-white/20 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">
                    {savedSuccess ? 'check' : 'content_copy'}
                  </span>
                  {savedSuccess ? 'Blueprint Copied!' : 'Copy Blueprint'}
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-pink-300">
                {invention.title}
              </h3>
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed mt-2 bg-[#160B24] p-4 rounded-xl border border-white/10 font-sans">
                {invention.description}
              </p>
            </div>

            {invention.materials && invention.materials.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-purple-300 uppercase font-bold">
                  Workshop Materials:
                </span>
                {invention.materials.map((mat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[11px] bg-[#80244A]/50 text-[#FFEAA7] px-2.5 py-0.5 rounded-full font-semibold border border-pink-400/30"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFEAA7]"></span>
                    {mat}
                  </span>
                ))}
              </div>
            )}

            {invention.pipWhisper && (
              <div className="flex items-start gap-2.5 bg-[#80244A]/30 p-3.5 rounded-xl border border-pink-400/30">
                <span className="material-symbols-outlined text-pink-300 text-lg shrink-0 mt-0.5">
                  chat_bubble
                </span>
                <div className="text-xs text-pink-200 leading-relaxed font-medium italic">
                  <span className="font-bold not-italic">Pip whispers:</span> "{invention.pipWhisper}"
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#80244A] text-[#FFEAA7] flex items-center justify-center border border-pink-400/40">
              <span className="material-symbols-outlined text-base">history</span>
            </span>
            <div>
              <h3 className="font-display font-bold text-base text-pink-300 flex items-center gap-2">
                <span>Recent Inventions Archive</span>
                <span className="bg-[#1A1028] text-[#FFEAA7] text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-white/10">
                  {history.length} / 5 Saved in LocalStorage
                </span>
              </h3>
              <p className="text-[11px] text-purple-200">
                Your personal log of dream gadgets forged in Pip's Midnight Nursery.
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-[11px] text-purple-300 hover:text-pink-300 flex items-center gap-1 self-start sm:self-center px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs">delete_sweep</span>
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="bg-[#1A1028]/80 rounded-2xl p-6 text-center border border-dashed border-white/15 flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-3xl text-purple-400">draw</span>
            <p className="text-xs text-purple-200 max-w-md font-sans">
              No custom dream inventions forged yet! Use the text prompt above to design your first patent with Pip. Your last 5 creations will be tracked right here in your browser.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {history.map((item, index) => {
              const isSelected = invention?.title === item.invention.title;
              const isCopied = copiedHistoryId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectFromHistory(item)}
                  className={`group text-left p-4 rounded-2xl transition-all cursor-pointer flex flex-col justify-between gap-3 border ${
                    isSelected
                      ? 'bg-[#80244A]/40 border-pink-300 ring-2 ring-pink-400/40 shadow-md'
                      : 'bg-[#1A1028]/80 hover:bg-[#2D1B4E]/80 border-white/10 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-[#FFEAA7] bg-[#80244A] px-1.5 py-0.5 rounded">
                          #{index + 1} {item.invention.modelNumber || 'PATENT'}
                        </span>
                        <span className="text-[10px] text-purple-300">
                          {formatTimeAgo(item.timestamp)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleCopyHistoryItem(item, e)}
                        title="Copy Blueprint"
                        className="p-1 rounded-md text-purple-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">
                          {isCopied ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>

                    <h4 className="font-display font-bold text-sm text-pink-300 group-hover:text-white transition-colors line-clamp-1">
                      {item.invention.title}
                    </h4>

                    <p className="text-[11px] text-purple-200 line-clamp-2 leading-relaxed font-sans">
                      {item.invention.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px]">
                    <span className="text-[#FFEAA7] bg-[#2D1B4E] px-2 py-0.5 rounded-full border border-white/10 font-semibold truncate max-w-[130px]">
                      {item.invention.cozinessRating}
                    </span>
                    <span className="text-pink-300 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      View Blueprint
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
