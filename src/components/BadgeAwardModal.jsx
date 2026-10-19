import React, { useEffect } from 'react';
import { BADGE_IMAGE_PATH, playBadgeFanfare } from '../utils/badge.js';
import { triggerStarConfetti } from './SparkleCanvas.jsx';
import { playChimeNote, playWoodBlockSound } from '../utils/audio.js';

export const BadgeAwardModal = ({
  isOpen,
  onClose,
  dreamCount,
  awardedDate,
  userName,
  isFirstUnlock = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      if (isFirstUnlock) {
        playBadgeFanfare();
        triggerStarConfetti();
        const t = setTimeout(() => triggerStarConfetti(), 450);
        return () => clearTimeout(t);
      }
    }
  }, [isOpen, isFirstUnlock]);

  if (!isOpen) return null;

  const handleCopyCertificate = () => {
    playWoodBlockSound(300);
    playChimeNote('C5', 0.5);
    const certText =
      `✨ OFFICIAL NURSERY CERTIFICATE ✨\n` +
      `Pip the Skull Baby proudly confers the 'Dream Engineer' Badge to: ${userName}\n` +
      `Rank: Class IV Dreamweaver · Nursery Room 07\n` +
      `Total Celestial Dreams Weaved: ${dreamCount.toLocaleString()}\n` +
      `Conferred Date: ${awardedDate}\n` +
      `“I build the dreams you fall asleep inside.” 🌙💤`;

    navigator.clipboard?.writeText(certText).catch(() => {});
    alert('📜 Certificate copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#FFFDF7] via-[#FFF9F2] to-[#faeaf2] rounded-3xl p-4 sm:p-7 shadow-2xl border-2 border-[#FFEAA7] text-center my-auto">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#F7B731]/30 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#FFE3E8]/60 blur-3xl pointer-events-none"></div>

        <button
          onClick={() => {
            playWoodBlockSound(220);
            onClose();
          }}
          className="absolute top-3.5 right-3.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-[#62535F] hover:text-[#80244a] flex items-center justify-center shadow-xs border border-[#F3E8DC] transition-all cursor-pointer z-10"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-base sm:text-lg">close</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFFAEB] border border-[#FFEAA7] text-[#5f4200] text-[10px] sm:text-xs shadow-xs mb-2 sm:mb-3">
          <span className="material-symbols-outlined text-[#F7B731] text-xs sm:text-sm">stars</span>
          <span>{isFirstUnlock ? 'ACHIEVEMENT UNLOCKED!' : 'OFFICIAL NURSERY CREDENTIALS'}</span>
        </div>

        <h2 className="font-headline font-bold text-xl sm:text-2xl md:text-3xl text-[#3F2837] tracking-tight">
          {isFirstUnlock ? 'Dream Engineer Badge Conferred!' : 'Official Dream Engineer Badge'}
        </h2>
        <p className="text-xs sm:text-sm text-[#62535F] mt-1 max-w-sm mx-auto">
          Conferred upon <strong className="text-[#80244a]">{userName}</strong> by Pip the Skull Baby for surpassing 1,220 bedtime dreams.
        </p>

        <div className="relative my-4 sm:my-6 flex flex-col items-center justify-center">
          <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-[#F7B731]/20 via-[#FFE3E8]/40 to-[#c9aeff]/30 animate-pulse blur-xl pointer-events-none"></div>

          <div className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full p-2 bg-gradient-to-b from-[#FFEAA7] via-[#FFF9F2] to-[#ffd9e2] shadow-[0_8px_30px_rgba(247,183,49,0.35)] ring-3 sm:ring-4 ring-[#FFEAA7]/60 group cursor-pointer transition-transform hover:scale-105">
            <img
              src={BADGE_IMAGE_PATH}
              alt="Official Dream Engineer Badge conferred by Pip the Skull Baby"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full shadow-inner"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/25 to-transparent pointer-events-none"></div>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white shadow-xs border border-[#F3E8DC] text-[10px] sm:text-[11px] font-bold text-[#80244a]">
              <span className="material-symbols-outlined text-xs text-[#F7B731]">verified</span>
              Authentic Imagen Asset · Badge No. #DE-07
            </span>
          </div>
        </div>

        <div className="bg-white/90 rounded-2xl p-4 sm:p-5 text-left border border-[#F3E8DC] shadow-sm mb-5">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#eedee6]">
            <div>
              <span className="text-[10px] text-[#69519a] block uppercase font-bold">TITLE CONFERRED</span>
              <span className="font-headline font-bold text-base text-[#3F2837]">Class IV Dream Engineer</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#62535F] block uppercase font-bold">DATE CONFERRED</span>
              <span className="text-xs font-semibold text-[#80244a]">{awardedDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-[#62535F]">
            <div className="bg-[#FFF9F2] p-2 rounded-lg">
              <span className="text-[10px] text-[#544247] uppercase block font-bold">Registry Room</span>
              <span className="font-semibold text-[#3F2837]">Room 07 · Cloud Pod</span>
            </div>
            <div className="bg-[#FFF9F2] p-2 rounded-lg">
              <span className="text-[10px] text-[#544247] uppercase block font-bold">Dream Quota</span>
              <span className="font-semibold text-[#80244a]">{dreamCount.toLocaleString()} Dreams Met</span>
            </div>
          </div>

          <p className="text-[11px] text-[#62535F] italic mt-2.5 pt-2 border-t border-[#eedee6]/40 leading-relaxed text-center">
            “Authorized to weave lullabies, calibrate nightlight lanterns, and safeguard sleeping ghostlings across the Midnight Nursery.”
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => {
              playBadgeFanfare();
              triggerStarConfetti();
            }}
            className="px-4 py-2 rounded-full bg-[#FFFAEB] hover:bg-[#FFEAA7] text-[#5f4200] font-headline font-bold text-xs ring-1 ring-[#FFEAA7] shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-[#F7B731]">music_note</span>
            <span>Replay Fanfare</span>
          </button>

          <button
            onClick={handleCopyCertificate}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#FFF9F2] text-[#80244a] border border-[#ffd9e2] font-semibold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            <span>Copy Certificate</span>
          </button>

          <button
            onClick={() => {
              playWoodBlockSound(240);
              onClose();
            }}
            className="px-5 py-2 rounded-full bg-[#80244a] hover:bg-[#9e3c62] text-white font-semibold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Snuggle In &amp; Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
