import React from 'react';
import { DreamerProfileSection } from './DreamerProfileSection.jsx';
import { playWoodBlockSound } from '../utils/audio.js';

export const ProfileModal = ({
  isOpen,
  onClose,
  dreamCount,
  onIncrementDreams,
  onSelectTab,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl my-auto max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl">
        <button
          onClick={() => {
            playWoodBlockSound(220);
            onClose();
          }}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#62535F] hover:text-[#80244a] flex items-center justify-center shadow-md border border-[#F3E8DC] transition-all cursor-pointer"
          aria-label="Close profile modal"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <DreamerProfileSection
          dreamCount={dreamCount}
          onIncrementDreams={onIncrementDreams}
          onSelectTab={(tab) => {
            onClose();
            onSelectTab(tab);
          }}
        />
      </div>
    </div>
  );
};
