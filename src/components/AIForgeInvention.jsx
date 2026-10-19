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

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_HISTORY_KEY);
    } catch {}
    playTone(320, 'triangle', 0.25, 0.15);
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || loading) return;

    setLoading(true);
    setError(null);
    playChimeNote('C5', 0.4);

    try {
      const response = await fetch('/api/dream-invention/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: cleanPrompt }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'The workshop gears got sleepy! Please try again.');
      }

      const data = await response.json();
      setInvention(data);
      saveToHistory(data, cleanPrompt);
      playVictoryFanfare();
      triggerStarConfetti();
    } catch (err) {
      console.error('Failed to generate invention:', err);
      setError(err?.message || 'Pip was taking a nap! Please try again in a moment.');
      playTone(220, 'triangle', 0.3, 0.15);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sample) => {
    setPrompt(sample);
    playBubblePopSound(true);
  };

  const handleSelectFromHistory = (item) => {
    setInvention(item.invention);
    setPrompt(item.prompt);
    playChimeNote('G4', 0.4);
    const blueprintEl = document.getElementById('blueprint-display');
    if (blueprintEl) {
      blueprintEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
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
    <section className="w-full bg-gradient-to-br from-[#FFF9F2] via-white to-[#FFF0F5] rounded-3xl p-6 sm:p-8 shadow-md border-2 border-[#FFE3E8] relative overflow-hidden flex flex-col gap-8">
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#FFE3E8]/40 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#FFEAA7]/30 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F3E8DC] pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#80244a] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-base">auto_awesome</span>
              </span>
              <span className="text-xs text-[#80244a] font-bold uppercase tracking-wider">
                Pip's Starlight AI Forge · Powered by Gemini
              </span>
            </div>
            <h2 className="font-headline font-bold text-2xl sm:text-3xl text-[#3F2837] tracking-tight">
              Design a Custom Dream Invention
            </h2>
            <p className="text-xs sm:text-sm text-[#62535F] max-w-2xl leading-relaxed">
              Describe any bedtime gadget, cozy contraption, or soothing machine. Gemini will translate your prompt into an official Midnight Nursery patent blueprint with custom materials and cozy mechanics!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#F3E8DC] shadow-xs self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[11px] font-bold text-[#3F2837] uppercase">
              Workshop Status: Online
            </span>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="dream-prompt" className="text-xs font-bold text-[#3F2837] flex items-center justify-between">
              <span>What would you like Pip to invent for your bedtime?</span>
              <span className="text-[11px] text-[#62535F] font-normal">{prompt.length} / 200</span>
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
                className="w-full bg-white rounded-2xl pl-4 pr-32 py-3.5 text-xs sm:text-sm text-[#3F2837] border-2 border-[#F3E8DC] focus:outline-none focus:border-[#80244a] focus:ring-2 focus:ring-[#ffd9e2] transition-all shadow-inner disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="absolute right-2 top-2 bottom-2 px-4 bg-[#80244a] hover:bg-[#6c1b3d] disabled:bg-[#d6c4cc] text-white text-xs font-headline font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed active:scale-95"
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
                    <span className="material-symbols-outlined text-sm">flare</span>
                    <span>Forge Invention</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] uppercase text-[#62535F] font-bold mr-1">
              Need inspiration?
            </span>
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="text-[11px] px-3 py-1 bg-white hover:bg-[#FFE3E8] text-[#62535F] hover:text-[#80244a] rounded-full border border-[#F3E8DC] hover:border-[#ffd9e2] transition-all cursor-pointer shadow-2xs"
              >
                {sample}
              </button>
            ))}
          </div>
        </form>

        {error && (
          <div className="bg-[#FFF0F2] border border-[#ffccd5] rounded-2xl p-4 flex items-center gap-3 text-xs text-[#ba1a1a]">
            <span className="material-symbols-outlined text-lg">error</span>
            <div className="flex-1">
              <span className="font-bold">Nursery Workshop Notice:</span> {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-[#ba1a1a] hover:underline font-bold text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {invention && (
          <div
            id="blueprint-display"
            className="mt-2 bg-white rounded-2xl p-6 sm:p-7 border-2 border-[#ffd9e2] shadow-lg animate-in fade-in duration-500 flex flex-col gap-4 relative"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F3E8DC] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#F7B731]">verified</span>
                <span className="text-xs text-[#80244a] font-bold uppercase">
                  OFFICIAL PATENT · {invention.modelNumber}
                </span>
                <span className="bg-[#FFFAEB] text-[#5f4200] text-[10px] px-2 py-0.5 rounded-full border border-[#FFEAA7] font-bold">
                  {invention.cozinessRating}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyBlueprint}
                  className="px-3 py-1 text-xs bg-[#FFF9F2] hover:bg-[#faeaf2] text-[#80244a] font-semibold rounded-full border border-[#F3E8DC] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">
                    {savedSuccess ? 'check' : 'content_copy'}
                  </span>
                  {savedSuccess ? 'Blueprint Copied!' : 'Copy Blueprint'}
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-headline font-bold text-xl sm:text-2xl text-[#3F2837]">
                {invention.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#544247] leading-relaxed mt-2 bg-[#FFFDF7] p-4 rounded-xl border border-[#F3E8DC]/80">
                {invention.description}
              </p>
            </div>

            {invention.materials && invention.materials.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-[#62535F] uppercase font-bold">
                  Workshop Materials:
                </span>
                {invention.materials.map((mat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[11px] bg-[#FFE3E8] text-[#80244a] px-2.5 py-0.5 rounded-full font-semibold"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#80244a]"></span>
                    {mat}
                  </span>
                ))}
              </div>
            )}

            {invention.pipWhisper && (
              <div className="flex items-start gap-2.5 bg-[#FFF5F8] p-3.5 rounded-xl border border-[#ffd9e2]">
                <span className="material-symbols-outlined text-[#80244a] text-lg shrink-0 mt-0.5">
                  chat_bubble
                </span>
                <div className="text-xs text-[#80244a] leading-relaxed font-medium italic">
                  <span className="font-bold not-italic">Pip whispers:</span> "{invention.pipWhisper}"
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 pt-4 border-t border-[#F3E8DC]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#FFF0F5] text-[#80244a] flex items-center justify-center border border-[#ffd9e2]">
              <span className="material-symbols-outlined text-base">history</span>
            </span>
            <div>
              <h3 className="font-headline font-bold text-base text-[#3F2837] flex items-center gap-2">
                <span>Recent Inventions Archive</span>
                <span className="bg-[#FFE3E8] text-[#80244a] text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {history.length} / 5 Saved in LocalStorage
                </span>
              </h3>
              <p className="text-[11px] text-[#62535F]">
                Your personal log of dream gadgets forged in Pip's Midnight Nursery.
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-[11px] text-[#8a7a85] hover:text-[#ba1a1a] flex items-center gap-1 self-start sm:self-center px-2.5 py-1 rounded-lg hover:bg-[#FFF0F2] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs">delete_sweep</span>
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-6 text-center border border-dashed border-[#ffd9e2] flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-3xl text-[#d4b8c7]">draw</span>
            <p className="text-xs text-[#62535F] max-w-md">
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
                      ? 'bg-[#FFF5F8] border-[#80244a] ring-2 ring-[#ffd9e2] shadow-sm'
                      : 'bg-white hover:bg-[#FFFDF7] border-[#F3E8DC] hover:border-[#ffd9e2] shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-[#80244a] bg-[#FFE3E8] px-1.5 py-0.5 rounded">
                          #{index + 1} {item.invention.modelNumber || 'PATENT'}
                        </span>
                        <span className="text-[10px] text-[#8a7a85]">
                          {formatTimeAgo(item.timestamp)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleCopyHistoryItem(item, e)}
                        title="Copy Blueprint"
                        className="p-1 rounded-md text-[#8a7a85] hover:text-[#80244a] hover:bg-[#faeaf2] transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">
                          {isCopied ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>

                    <h4 className="font-headline font-bold text-sm text-[#3F2837] group-hover:text-[#80244a] transition-colors line-clamp-1">
                      {item.invention.title}
                    </h4>

                    <p className="text-[11px] text-[#62535F] line-clamp-2 leading-relaxed">
                      {item.invention.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F3E8DC]/80 text-[10px]">
                    <span className="text-[#5f4200] bg-[#FFFAEB] px-2 py-0.5 rounded-full border border-[#FFEAA7] font-semibold truncate max-w-[130px]">
                      {item.invention.cozinessRating}
                    </span>
                    <span className="text-[#80244a] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
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
