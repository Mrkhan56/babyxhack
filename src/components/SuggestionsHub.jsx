import React, { useState, useEffect } from 'react';
import {
  playChimeNote,
  playTone,
  playHeartPopSound,
  playWoodBlockSound,
  playVictoryFanfare,
} from '../utils/audio.js';
import { triggerStarConfetti } from './SparkleCanvas.jsx';

const DEFAULT_SUGGESTIONS = [
  {
    id: 'sug-1',
    title: "Add a Moon Fluff Cloud Glider vehicle for Pip's nocturnal dream deliveries",
    author: 'Little Luna',
    category: 'Invention Ideas',
    status: 'In Workshop',
    votes: 94,
    date: '2 hours ago',
  },
  {
    id: 'sug-2',
    title: 'Gentle Midnight Rain & Soft Wind pentatonic preset in the Lullaby Synthesizer',
    author: 'Barnaby Hedgehog',
    category: 'Bedtime Lullabies',
    status: 'Delivered ✨',
    votes: 142,
    date: 'Yesterday',
  },
  {
    id: 'sug-3',
    title: 'Slow-Motion Lavender Dream Cloud power-up in Dreamcatcher Arcade',
    author: 'Captain Paws',
    category: 'Arcade Upgrades',
    status: 'Delivered ✨',
    votes: 118,
    date: '3 days ago',
  },
  {
    id: 'sug-4',
    title: "Barnaby's glowing firefly feeding counter in Chapter 2 of the Storybook",
    author: 'Firefly Keeper',
    category: 'Storybook Quests',
    status: 'Delivered ✨',
    votes: 106,
    date: '4 days ago',
  },
  {
    id: 'sug-5',
    title: 'Pillow Fort Thermal Scanner to find and block chilly bedtime drafts',
    author: 'Cozy Bear',
    category: 'Invention Ideas',
    status: 'Testing',
    votes: 79,
    date: '5 days ago',
  },
  {
    id: 'sug-6',
    title: 'Ambient Nightlight Dimmer with Day/Night bedroom preview across all nursery gadgets',
    author: 'Night Owl Guild',
    category: 'Nursery Comfort',
    status: 'Delivered ✨',
    votes: 88,
    date: '6 days ago',
  },
  {
    id: 'sug-7',
    title: 'Fluffy Ear Muffs & Knitted Scarf equipment for Pip when flying through cold dream clouds',
    author: 'Granny Stitch',
    category: 'Invention Ideas',
    status: 'In Workshop',
    votes: 65,
    date: '1 week ago',
  },
  {
    id: 'sug-8',
    title: 'Deep Ocean Whale Song & Starlight Chimes lullaby scale option',
    author: 'Marina Wave',
    category: 'Bedtime Lullabies',
    status: 'Under Review',
    votes: 52,
    date: '1 week ago',
  },
  {
    id: 'sug-9',
    title: 'Chapter 4 Storybook Chapter: "The Lost Cloud Sheep of Slumber Meadow"',
    author: 'Bookworm Willow',
    category: 'Storybook Quests',
    status: 'Testing',
    votes: 83,
    date: '2 weeks ago',
  },
];

export const SuggestionsHub = ({ onIncrementDreams }) => {
  const [suggestions, setSuggestions] = useState(() => {
    const saved = localStorage.getItem('pip_dream_suggestions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_SUGGESTIONS;
      }
    }
    return DEFAULT_SUGGESTIONS;
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('Invention Ideas');
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('pip_dream_suggestions', JSON.stringify(suggestions));
  }, [suggestions]);

  const handleVote = (id) => {
    setSuggestions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextVoted = !item.userVoted;
          const nextVotes = nextVoted ? item.votes + 1 : item.votes - 1;
          if (nextVoted) {
            playHeartPopSound();
            triggerStarConfetti();
            if (onIncrementDreams) onIncrementDreams();
          } else {
            playWoodBlockSound(220);
          }
          return { ...item, votes: nextVotes, userVoted: nextVoted };
        }
        return item;
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newSuggestion = {
      id: `sug-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim() || 'Anonymous Dreamer',
      category: newCategory,
      status: 'Under Review',
      votes: 1,
      date: 'Just now',
      userVoted: true,
    };

    setSuggestions((prev) => [newSuggestion, ...prev]);
    setNewTitle('');
    setNewAuthor('');
    setFormSuccess(true);
    playVictoryFanfare();
    triggerStarConfetti();
    if (onIncrementDreams) onIncrementDreams();

    setTimeout(() => {
      setFormSuccess(false);
      setIsFormOpen(false);
    }, 1800);
  };

  const categories = [
    'All',
    'Invention Ideas',
    'Bedtime Lullabies',
    'Storybook Quests',
    'Arcade Upgrades',
    'Nursery Comfort',
  ];

  const statuses = ['All', 'Delivered ✨', 'In Workshop', 'Testing', 'Under Review'];

  const filteredSuggestions = suggestions.filter((item) => {
    const matchCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchStatus = activeStatus === 'All' || item.status === activeStatus;
    return matchCategory && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered ✨':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Workshop':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Testing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-rose-100 text-[#80244a] border-rose-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Invention Ideas':
        return 'precision_manufacturing';
      case 'Bedtime Lullabies':
        return 'music_note';
      case 'Storybook Quests':
        return 'auto_stories';
      case 'Arcade Upgrades':
        return 'sports_esports';
      case 'Nursery Comfort':
        return 'bedtime';
      default:
        return 'lightbulb';
    }
  };

  return (
    <section className="w-full bg-[#FFFDF7] rounded-3xl p-6 sm:p-8 border border-[#F3E8DC] shadow-sm flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F3E8DC] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#80244a] text-2xl">recommend</span>
            <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#80244a]">
              Dream &amp; Invention Suggestions Box
            </h2>
            <span className="bg-[#FFEAA7] text-[#5f4200] text-[10px] px-2.5 py-0.5 rounded-full font-bold">
              {suggestions.length} Ideas
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#62535F] mt-1 max-w-2xl">
            Help Pip build the coziest dreams! Submit ideas for new inventions, lullaby melodies, arcade power-ups, or bedtime story chapters. Vote for your favorites to see them built in Pip's workshop.
          </p>
        </div>

        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            playChimeNote('E5', 0.2);
          }}
          className="self-start md:self-auto px-4 py-2.5 bg-[#80244a] hover:bg-[#6c1b3d] text-white font-headline text-xs sm:text-sm font-bold rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">
            {isFormOpen ? 'close' : 'add_circle'}
          </span>
          {isFormOpen ? 'Close Form' : 'Submit a Suggestion'}
        </button>
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#FFF5F8] border border-[#FCE7F3] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 animate-in fade-in duration-300 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-sm sm:text-base text-[#80244a] flex items-center gap-2">
              <span className="material-symbols-outlined text-base">edit_note</span>
              Tell Pip Your Idea!
            </h3>
            <span className="text-[11px] text-[#62535F]">
              Pip reads every single wish before naptime
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-[11px] uppercase text-[#62535F] font-bold">
                Suggestion / Idea
              </label>
              <input
                type="text"
                required
                maxLength={120}
                placeholder="e.g. Add a warm milk cup sound effect to the lullaby lab"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white border border-[#F3E8DC] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#422C38] focus:outline-none focus:border-[#80244a]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase text-[#62535F] font-bold">
                Your Dreamer Name
              </label>
              <input
                type="text"
                placeholder="e.g. Starlight Dreamer"
                maxLength={30}
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full bg-white border border-[#F3E8DC] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#422C38] focus:outline-none focus:border-[#80244a]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] uppercase text-[#62535F] font-bold">Category:</span>
              {[
                'Invention Ideas',
                'Bedtime Lullabies',
                'Storybook Quests',
                'Arcade Upgrades',
                'Nursery Comfort',
              ].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setNewCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    newCategory === cat
                      ? 'bg-[#80244a] text-white border-[#80244a] font-bold'
                      : 'bg-white text-[#62535F] border-[#F3E8DC] hover:border-[#80244a]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-[#80244a] hover:bg-[#6c1b3d] text-white text-xs font-bold rounded-full shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>{formSuccess ? '✨ Posted to Workshop!' : 'Post Suggestion (+1 Dream)'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter Chips Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFF9F2] p-3 rounded-2xl border border-[#F3E8DC]">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[11px] text-[#62535F] font-bold uppercase mr-1">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-[#80244a] text-white border-[#80244a] font-bold shadow-2xs'
                  : 'bg-white text-[#62535F] border-[#F3E8DC] hover:border-[#ffd9e2]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[11px] text-[#62535F] font-bold uppercase mr-1">Status:</span>
          {statuses.map((stat) => (
            <button
              key={stat}
              onClick={() => setActiveStatus(stat)}
              className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer border ${
                activeStatus === stat
                  ? 'bg-[#80244a] text-white border-[#80244a] font-bold shadow-2xs'
                  : 'bg-white text-[#62535F] border-[#F3E8DC] hover:border-[#ffd9e2]'
              }`}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>

      {/* Suggestions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuggestions.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-[#F3E8DC] shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#80244a] bg-[#FFE3E8] px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-xs">
                    {getCategoryIcon(item.category)}
                  </span>
                  {item.category}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              <h4 className="font-headline font-bold text-sm text-[#3F2837] leading-snug">
                {item.title}
              </h4>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F3E8DC] text-xs text-[#62535F]">
              <div className="flex flex-col">
                <span className="font-semibold text-[#3F2837]">{item.author}</span>
                <span className="text-[10px] text-stone-400">{item.date}</span>
              </div>

              <button
                onClick={() => handleVote(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  item.userVoted
                    ? 'bg-[#FFE3E8] text-[#80244a] border-[#ffd9e2] shadow-2xs scale-105'
                    : 'bg-white hover:bg-[#FFF9F2] text-[#62535F] border-[#F3E8DC]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-sm ${
                    item.userVoted ? 'text-[#80244a]' : 'text-stone-400'
                  }`}
                >
                  favorite
                </span>
                <span>{item.votes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
