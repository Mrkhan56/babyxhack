import React from 'react';

export const Footer = ({ onSelectTab, deliveredCount = 42819 }) => {
  return (
    <footer className="w-full bg-[#faeaf2]/70 border-t border-[#F3E8DC] mt-16 py-10 transition-colors">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Dispatch Info */}
          <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#80244a] text-xl">nightlight</span>
              <span className="font-headline font-bold text-lg text-[#80244a]">
                Midnight Nursery Dispatch
              </span>
              <span className="bg-[#FFEAA7] text-[#5f4200] text-[9px] px-2 py-0.5 rounded-full font-bold">
                Junior Dream Lab
              </span>
            </div>
            <p className="text-xs text-[#62535F] max-w-md">
              Official Midnight Nursery Portfolio · Crafted with star milk, cozy flannel, and sweet pentatonic lullabies.
            </p>
          </div>

          {/* 88x31 Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="w-[88px] h-[31px] bg-[#21191F] text-[#FFEAA7] font-mono text-[9px] tracking-widest font-bold uppercase rounded shadow-xs flex items-center justify-center text-center px-1 border border-[#FFEAA7]/20 select-none">
              88x31 BADGE
            </div>
            <div className="w-[88px] h-[31px] bg-[#9E3C62] text-white font-mono text-[9px] tracking-tight font-bold uppercase rounded shadow-xs flex items-center justify-center text-center px-1 border border-white/20 select-none">
              DREAM ★ MAKER
            </div>
            <div className="w-[88px] h-[31px] bg-[#69519a] text-white font-mono text-[9px] tracking-tight font-bold uppercase rounded shadow-xs flex items-center justify-center text-center px-1 select-none">
              DREAM SAFE
            </div>
            <div className="w-[88px] h-[31px] bg-[#FFFAEB] text-[#7d5800] font-mono text-[9px] tracking-tight font-bold uppercase rounded shadow-xs flex items-center justify-center text-center px-1 border border-[#F7B731]/30 select-none">
              100% SNOOZY
            </div>
          </div>
        </div>

        {/* Secondary Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#eedee6] text-xs text-[#62535F]">
          <p>© 2026 Pip the Skull Baby. All midnight dreams licensed under Sleepy Creative Commons.</p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full shadow-xs border border-[#F3E8DC]">
              <span className="text-[10px] text-[#544247]">Delivered:</span>
              <span className="font-headline font-bold text-xs text-[#80244a] font-mono">
                {deliveredCount.toLocaleString()}
              </span>
              <span className="material-symbols-outlined text-[#F7B731] text-[13px]">star</span>
            </div>

            <button
              onClick={() => onSelectTab('bedtime-wall')}
              className="text-[#69519a] hover:text-[#80244a] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">edit_note</span>
              Sign the Bedtime Wall
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
