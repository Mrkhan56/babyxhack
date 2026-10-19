import React, { useState, useEffect } from 'react';
import { SCREEN_TABS } from './types.js';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { SparkleCanvas } from './components/SparkleCanvas.jsx';
import { ProfileModal } from './components/ProfileModal.jsx';
import { FlashlightCursor } from './components/FlashlightCursor.jsx';
import { PipChatModal } from './components/PipChatModal.jsx';
import { RetroDreamTaskbar } from './components/RetroDreamTaskbar.jsx';
import { isSoundEnabled, startAmbientLullaby } from './utils/audio.js';

// Screens
import { PortfolioHome } from './components/screens/PortfolioHome.jsx';
import { AboutPipScreen } from './components/screens/AboutPipScreen.jsx';
import { DreamInventionsScreen } from './components/screens/DreamInventionsScreen.jsx';
import { DreamcatcherArcadeScreen } from './components/screens/DreamcatcherArcadeScreen.jsx';
import { BedtimeStorybookScreen } from './components/screens/BedtimeStorybookScreen.jsx';
import { BedtimeWallScreen } from './components/screens/BedtimeWallScreen.jsx';

export default function App() {
  const [currentTab, setCurrentTab] = useState('portfolio-home');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [flashlightActive, setFlashlightActive] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [mood, setMood] = useState(() => {
    return localStorage.getItem('pip_mood') || 'day';
  });

  const [dreamCount, setDreamCount] = useState(() => {
    const saved = localStorage.getItem('pip_dream_count');
    return saved ? parseInt(saved, 10) : 1204;
  });

  const handleIncrementDreams = () => {
    setDreamCount((prev) => {
      const next = prev + 1;
      localStorage.setItem('pip_dream_count', next.toString());
      return next;
    });
  };

  const handleSelectTab = (tab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMoodChange = (newMood) => {
    setMood(newMood);
    localStorage.setItem('pip_mood', newMood);
  };

  // Sync hash routing if user pastes or uses browser back/forward
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = [
        'portfolio-home',
        'about-pip',
        'dream-inventions',
        'dreamcatcher-arcade',
        'bedtime-storybook',
        'bedtime-wall',
      ];
      if (validTabs.includes(hash)) {
        setCurrentTab(hash);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when tab changes
  useEffect(() => {
    if (window.location.hash.replace('#', '') !== currentTab) {
      window.location.hash = currentTab;
    }
  }, [currentTab]);

  // If sound was previously saved as enabled in localStorage, start ambient lullaby on first user gesture
  useEffect(() => {
    if (isSoundEnabled()) {
      const handleFirstInteraction = () => {
        startAmbientLullaby();
      };
      window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
      window.addEventListener('keydown', handleFirstInteraction, { once: true });
      return () => {
        window.removeEventListener('pointerdown', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
      };
    }
  }, []);

  // Compute theme classes based on current mood (all adhering to Pip's midnight dreamscape)
  const themeClasses = {
    day: 'bg-[#140C24] text-[#F3E8FF]',
    night: 'bg-[#0A0614] text-[#E2E8F0]',
    dream: 'bg-[#1A0E2E] text-[#F3E8FF]',
  }[mood] || 'bg-[#140C24] text-[#F3E8FF]';

  return (
    <div className={`min-h-screen ${themeClasses} flex flex-col font-body selection:bg-[#FCE7F3] selection:text-[#80244a] relative transition-colors duration-700`}>
      {/* Sparkle particle overlay */}
      <SparkleCanvas />

      {/* Tier 2 Flashlight nightlight cursor overlay with hidden secrets */}
      <FlashlightCursor
        isEnabled={flashlightActive}
        onToggle={() => setFlashlightActive(!flashlightActive)}
      />

      {/* Main App Navigation Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        dreamCount={dreamCount}
        onOpenProfile={() => setProfileModalOpen(true)}
        mood={mood}
        onMoodChange={handleMoodChange}
        flashlightActive={flashlightActive}
        onToggleFlashlight={() => setFlashlightActive(!flashlightActive)}
        onOpenChat={() => setChatOpen(true)}
      />

      {/* Main Content Area - responsive padding clears fixed header and bottom taskbar */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-3 sm:px-6 pt-28 lg:pt-24 pb-20">
        {currentTab === 'portfolio-home' && (
          <PortfolioHome
            onSelectTab={handleSelectTab}
            onIncrementDreams={handleIncrementDreams}
            dreamCount={dreamCount}
            mood={mood}
            onOpenChat={() => setChatOpen(true)}
            onOpenProfile={() => setProfileModalOpen(true)}
          />
        )}

        {currentTab === 'about-pip' && (
          <AboutPipScreen
            onSelectTab={handleSelectTab}
            onIncrementDreams={handleIncrementDreams}
            dreamCount={dreamCount}
          />
        )}

        {currentTab === 'dream-inventions' && (
          <DreamInventionsScreen
            onSelectTab={handleSelectTab}
          />
        )}

        {currentTab === 'dreamcatcher-arcade' && (
          <DreamcatcherArcadeScreen
            onSelectTab={handleSelectTab}
            onIncrementDreams={handleIncrementDreams}
          />
        )}

        {currentTab === 'bedtime-storybook' && (
          <BedtimeStorybookScreen
            onSelectTab={handleSelectTab}
            onIncrementDreams={handleIncrementDreams}
          />
        )}

        {currentTab === 'bedtime-wall' && (
          <BedtimeWallScreen
            onSelectTab={handleSelectTab}
            onIncrementDreams={handleIncrementDreams}
            dreamCount={dreamCount}
          />
        )}
      </main>

      {/* Global Bedtime Dispatch Footer */}
      <Footer
        onSelectTab={handleSelectTab}
        deliveredCount={42819 + (dreamCount - 1204)}
      />

      {/* Retro DreamOS 98 Bottom Taskbar (inspired by hax-baby-1 and hello-world-pip) */}
      <RetroDreamTaskbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        dreamCount={dreamCount}
        mood={mood}
        onMoodChange={handleMoodChange}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenChat={() => setChatOpen(true)}
      />

      {/* Tier 3 Interactive Pip AI dialogue drawer */}
      <PipChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />

      {/* Interactive Dreamer Profile & Dynamic Imagen Badge Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        dreamCount={dreamCount}
        onIncrementDreams={handleIncrementDreams}
        onSelectTab={handleSelectTab}
      />
    </div>
  );
}
