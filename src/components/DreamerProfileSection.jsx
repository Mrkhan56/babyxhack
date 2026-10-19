import React, { useState, useEffect } from 'react';
import {
  BADGE_IMAGE_PATH,
  getMilestoneInfo,
  getUserProfile,
  saveUserProfile,
  getBadgeAwardedDate,
  markBadgeAwarded,
  hasSeenBadgeCelebration,
  markBadgeCelebrationSeen,
  resetBadgeCelebrationForTesting,
  DREAM_ENGINEER_THRESHOLD,
} from '../utils/badge.js';
import { BadgeAwardModal } from './BadgeAwardModal.jsx';
import { playChimeNote, playWoodBlockSound, playHeartPopSound } from '../utils/audio.js';
import { triggerStarConfetti } from './SparkleCanvas.jsx';

export const DreamerProfileSection = ({
  dreamCount,
  onIncrementDreams,
  onSelectTab,
}) => {
  const [profile, setProfile] = useState(getUserProfile);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [isFirstUnlock, setIsFirstUnlock] = useState(false);

  const milestone = getMilestoneInfo(dreamCount);
  const awardedDate = getBadgeAwardedDate() || (milestone.isUnlocked ? markBadgeAwarded() : '');

  useEffect(() => {
    if (milestone.isUnlocked && !hasSeenBadgeCelebration()) {
      markBadgeAwarded();
      markBadgeCelebrationSeen();
      setIsFirstUnlock(true);
      setShowAwardModal(true);
    }
  }, [milestone.isUnlocked]);

  const handleSaveName = (e) => {
    if (e) e.preventDefault();
    if (!tempName.trim()) return;
    const updated = saveUserProfile({ name: tempName.trim() });
    setProfile(updated);
    setIsEditingName(false);
    playWoodBlockSound(300);
    playChimeNote('C5', 0.4);
  };

  const handleQuickWeave = (amount = 5) => {
    playHeartPopSound();
    for (let i = 0; i < amount; i++) {
      onIncrementDreams();
    }
    triggerStarConfetti();
  };

  const handleResetForTesting = () => {
    resetBadgeCelebrationForTesting();
    const target = DREAM_ENGINEER_THRESHOLD - 5;
    localStorage.setItem('pip_dream_count', target.toString());
    window.location.reload();
  };

  return (
    <section className="w-full bg-gradient-to-br from-[#FFFDF7] via-white to-[#faeaf2] rounded-3xl p-4 sm:p-7 lg:p-10 shadow-lg border border-[#F3E8DC] relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#FFE3E8]/50 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#FFEAA7]/40 blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd9e2] text-[#7f234a] text-[11px] sm:text-xs font-bold shadow-xs">
            <span className="material-symbols-outlined text-[14px]">account_circle</span>
            DREAMER PROFILE &amp; CREDENTIALS
          </span>
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold shadow-xs border"
            style={{
              backgroundColor: milestone.isUnlocked ? '#FFFAEB' : '#fff0f7',
              borderColor: milestone.isUnlocked ? '#FFEAA7' : '#eedee6',
              color: milestone.rankColor,
            }}
          >
            <span className="material-symbols-outlined text-[13px]">
              {milestone.isUnlocked ? 'verified' : 'hourglass_top'}
            </span>
            {milestone.rankTitle} ({milestone.rankBadge})
          </span>
        </div>

        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3 sm:px-3.5 py-1.5 rounded-full shadow-xs border border-[#F3E8DC] self-start sm:self-auto">
          <span className="text-[10px] sm:text-[11px] text-[#62535F]">Threshold for Dream Engineer:</span>
          <span className="font-headline font-bold text-xs text-[#80244a] flex items-center gap-1">
            <span>{DREAM_ENGINEER_THRESHOLD.toLocaleString()} Dreams</span>
            <span className="material-symbols-outlined text-[13px] text-[#F7B731]">stars</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch relative z-10">
        <div className="lg:col-span-6 flex flex-col justify-between gap-5 sm:gap-6">
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="bg-white/95 rounded-2xl p-4 sm:p-6 shadow-sm border border-[#F3E8DC] flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  <div className="relative">
                    <div
                      className={`w-16 h-16 rounded-full overflow-hidden p-0.5 shadow-md ${
                        milestone.isUnlocked
                          ? 'ring-4 ring-[#F7B731] bg-gradient-to-tr from-[#F7B731] via-[#FFEAA7] to-[#80244a]'
                          : 'ring-2 ring-[#ffd9e2] bg-[#faeaf2]'
                      }`}
                    >
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaDQR41KBT5zoavfKSFBGwlp0fySzOYb-MBqRjz57rCw8Jk_coZIHiscgpp04m3-rq7ujbo3ya4-wwVkQAJ3kHkWcA0Dn7dTzxb3RBrRc6SEHrj-altRfxyrWlxvZNvp64eOGUuoopsu5j9s8D8hMsdD7655E4zp1GEVifaNlKPtjovPm_tMcMrT2IsVkHqiCXrMMOWUmpdYyfg1o4GDaLusjysVX7HsANrYuTa0YzodrAiKD9fAY7kM6si2Rh6uoSlw"
                        alt="User Profile Avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    {milestone.isUnlocked && (
                      <span
                        title="Official Dream Engineer Badge Holder"
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#80244a] text-[#FFEAA7] border-2 border-white flex items-center justify-center shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[13px]">workspace_premium</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    {isEditingName ? (
                      <form onSubmit={handleSaveName} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          maxLength={24}
                          className="px-2.5 py-1 text-sm font-headline font-bold text-[#3F2837] bg-[#FFF9F2] border border-[#80244a] rounded-lg focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="px-2.5 py-1 bg-[#80244a] text-white rounded-lg text-xs font-semibold hover:bg-[#9e3c62]"
                        >
                          Save
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="font-headline font-bold text-xl sm:text-2xl text-[#3F2837] tracking-tight truncate">
                          {profile.name}
                        </h3>
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="text-[#62535F] hover:text-[#80244a] p-1 rounded transition-colors"
                          title="Edit your Dreamer display name"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                      </div>
                    )}
                    <span className="text-xs font-semibold text-[#80244a] flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F7B731]"></span>
                      {milestone.rankTitle}
                    </span>
                    <span className="text-[11px] text-[#62535F]">
                      Midnight Nursery · Stationed in Room 07
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${
                      milestone.isUnlocked
                        ? 'bg-[#FFFAEB] text-[#5f4200] border border-[#FFEAA7]'
                        : 'bg-[#fff0f7] text-[#62535F] border border-[#eedee6]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">
                      {milestone.isUnlocked ? 'star' : 'lock'}
                    </span>
                    {milestone.isUnlocked ? 'BADGE AWARDED' : 'BADGE LOCKED'}
                  </span>
                </div>
              </div>

              <div className="mt-2 bg-[#FFF9F2] p-4 rounded-xl border border-[#F3E8DC] flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#62535F] font-bold uppercase">
                    DREAM ACCUMULATION METER
                  </span>
                  <span className="font-headline font-bold text-[#80244a]">
                    {dreamCount.toLocaleString()} / {DREAM_ENGINEER_THRESHOLD.toLocaleString()} Dreams
                  </span>
                </div>

                <div className="w-full h-3 bg-[#faeaf2] rounded-full overflow-hidden p-0.5 border border-[#eedee6] relative">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#69519a] via-[#80244a] to-[#F7B731] transition-all duration-500 shadow-sm"
                    style={{ width: `${milestone.progressPercent}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#62535F]">
                  <span>
                    {milestone.isUnlocked ? (
                      <strong className="text-[#5f4200] font-semibold">✨ Requirement Surpassed!</strong>
                    ) : (
                      <span>
                        <strong className="text-[#80244a] font-semibold">{milestone.needed} more dreams</strong> needed to unlock!
                      </span>
                    )}
                  </span>
                  <span className="font-mono font-bold text-[#544247]">{milestone.progressPercent}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 rounded-2xl p-4 sm:p-5 border border-[#F3E8DC] flex flex-col gap-3">
              <span className="text-[10px] text-[#80244a] uppercase font-bold">
                Earn Dreams &amp; Trigger Dynamic Award:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => handleQuickWeave(5)}
                  className="px-3.5 py-2 rounded-full bg-[#80244a] hover:bg-[#9e3c62] text-white text-xs font-semibold shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <span>Weave Bedtime Dreams (+5)</span>
                </button>

                {onSelectTab && (
                  <button
                    onClick={() => onSelectTab('dreamcatcher-arcade')}
                    className="px-3.5 py-2 rounded-full bg-[#FFFAEB] hover:bg-[#FFEAA7] text-[#5f4200] border border-[#FFEAA7] text-xs font-semibold shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm text-[#F7B731]">sports_esports</span>
                    <span>Play Dreamcatcher Arcade (+10)</span>
                  </button>
                )}

                <button
                  onClick={handleResetForTesting}
                  title="Reset dreams to 1,215 to re-test the live celebration"
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-[#FFF9F2] text-[#62535F] text-[11px] border border-[#eedee6] transition-colors ml-auto cursor-pointer"
                >
                  Test Unlock Flow
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#FFF9F2] p-4 rounded-xl border border-[#F3E8DC] flex flex-col gap-1.5">
            <span className="text-[10px] text-[#5f4200] font-bold uppercase">
              OFFICIAL DREAM ENGINEER PERKS &amp; PRIVILEGES:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#62535F] pt-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-sm text-[#F7B731] shrink-0">stars</span>
                <span className="truncate">Exclusive Imagen Badge</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-sm text-[#80244a] shrink-0">verified</span>
                <span className="truncate">Class IV Dreamweaver</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-sm text-[#69519a] shrink-0">celebration</span>
                <span className="truncate">Starlight Confetti Fanfare</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-sm text-[#5f4200] shrink-0">local_fire_department</span>
                <span className="truncate">Lantern Calibration</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col items-center justify-between bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md border border-[#F3E8DC] relative overflow-hidden group">
          <div className="absolute inset-0 bg-radial from-[#FFEAA7]/30 via-transparent to-transparent pointer-events-none"></div>

          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 relative z-10">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-8 h-8 rounded-full bg-[#FFE3E8] flex items-center justify-center text-[#80244a] shadow-xs shrink-0">
                <span className="material-symbols-outlined text-base">military_tech</span>
              </span>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] text-[#69519a] block font-bold uppercase">IMAGEN GENERATED ARTIFACT</span>
                <h4 className="font-headline font-bold text-sm sm:text-base text-[#3F2837] truncate">Dream Engineer Medallion</h4>
              </div>
            </div>

            {milestone.isUnlocked ? (
              <span className="px-3 py-1 rounded-full bg-[#FFFAEB] border border-[#FFEAA7] text-[#5f4200] text-[10px] font-bold flex items-center gap-1 shadow-xs self-start sm:self-auto shrink-0">
                <span className="material-symbols-outlined text-xs text-[#F7B731]">stars</span>
                AWARDED
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-[#faeaf2] border border-[#eedee6] text-[#62535F] text-[9px] sm:text-[10px] font-bold flex items-center gap-1 self-start sm:self-auto shrink-0">
                <span className="material-symbols-outlined text-xs">lock</span>
                LOCKED ({milestone.needed} DREAMS TO GO)
              </span>
            )}
          </div>

          <div className="relative my-2 sm:my-3 flex flex-col items-center justify-center w-full max-w-[240px] sm:max-w-[280px] aspect-square">
            {milestone.isUnlocked ? (
              <div
                onClick={() => {
                  playChimeNote('C5', 0.5);
                  setIsFirstUnlock(false);
                  setShowAwardModal(true);
                }}
                className="relative w-full h-full rounded-2xl p-3 bg-gradient-to-b from-[#FFF9F2] via-white to-[#faeaf2] border-2 border-[#FFEAA7] shadow-[0_12px_36px_rgba(247,183,49,0.28)] flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 group/badge"
              >
                <img
                  src={BADGE_IMAGE_PATH}
                  alt="Official Dream Engineer Badge generated with Imagen"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter drop-shadow-md rounded-xl"
                />

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs text-[#80244a] p-1.5 rounded-full shadow-md opacity-0 group-hover/badge:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-base">zoom_in</span>
                </div>

                <div className="absolute -bottom-2 inset-x-4 bg-[#80244a] text-white text-[11px] font-bold py-1 px-3 rounded-full text-center shadow-md flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-xs text-[#F7B731]">verified</span>
                  <span>Click to Inspect Certificate</span>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full rounded-2xl p-3 bg-[#fff0f7] border-2 border-dashed border-[#eedee6] flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="filter blur-xs opacity-35 grayscale contrast-125 w-full h-full">
                  <img
                    src={BADGE_IMAGE_PATH}
                    alt="Locked Dream Engineer Badge preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-white/60 backdrop-blur-[2px]">
                  <div className="w-12 h-12 rounded-full bg-[#FFE3E8] text-[#80244a] flex items-center justify-center shadow-md mb-2">
                    <span className="material-symbols-outlined text-2xl">lock</span>
                  </div>
                  <span className="font-headline font-bold text-sm text-[#3F2837]">
                    Locked Badge Medallion
                  </span>
                  <p className="text-xs text-[#62535F] mt-1 max-w-[200px]">
                    Reach <strong className="text-[#80244a] font-bold">1,220 dreams</strong> to dynamically award this badge to your profile!
                  </p>
                  <button
                    onClick={() => handleQuickWeave(10)}
                    className="mt-3 px-3 py-1.5 rounded-full bg-[#80244a] hover:bg-[#9e3c62] text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    Weave +10 Dreams Now
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="w-full mt-4 pt-3 border-t border-[#eedee6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#62535F]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#F7B731] text-sm">event</span>
              <span>{milestone.isUnlocked ? `Conferred on ${awardedDate}` : 'Awaiting 1,220 Dreams'}</span>
            </div>

            {milestone.isUnlocked && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playChimeNote('E5', 0.5);
                    setIsFirstUnlock(false);
                    setShowAwardModal(true);
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#faeaf2] hover:bg-[#FFE3E8] text-[#80244a] font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">badge</span>
                  <span>View Dossier</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <BadgeAwardModal
        isOpen={showAwardModal}
        onClose={() => setShowAwardModal(false)}
        dreamCount={dreamCount}
        awardedDate={awardedDate}
        userName={profile.name}
        isFirstUnlock={isFirstUnlock}
      />
    </section>
  );
};
