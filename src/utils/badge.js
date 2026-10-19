import { playChimeNote, playTone } from './audio.js';

export const DREAM_ENGINEER_THRESHOLD = 1220;
export const BADGE_IMAGE_PATH = '/src/assets/images/dream_engineer_badge_1792396957094.jpg';

const STORAGE_PROFILE_KEY = 'pip_user_dreamer_profile_v1';
const STORAGE_AWARDED_DATE_KEY = 'pip_badge_dream_engineer_awarded_date';
const STORAGE_CELEBRATION_SEEN_KEY = 'pip_badge_celebration_seen_1220';
const STORAGE_VISIT_COUNT_KEY = 'pip_visitor_visit_count_v1';
const STORAGE_LAST_VISIT_KEY = 'pip_visitor_last_visit_v1';

export function getUserProfile() {
  if (typeof window === 'undefined') {
    return {
      name: 'Starlight Dreamer',
      avatarSeed: 'cloud',
      favoriteComfort: 'Moon Fluff Pillow',
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }

  return {
    name: 'Starlight Dreamer',
    avatarSeed: 'cloud',
    favoriteComfort: 'Moon Fluff Pillow',
  };
}

export function saveUserProfile(profile) {
  const current = getUserProfile();
  const updated = { ...current, ...profile };
  try {
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(updated));
  } catch {
    // Non-fatal
  }
  return updated;
}

export function getBadgeAwardedDate() {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_AWARDED_DATE_KEY);
  } catch {
    return null;
  }
}

export function markBadgeAwarded() {
  const existing = getBadgeAwardedDate();
  if (existing) return existing;

  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  try {
    localStorage.setItem(STORAGE_AWARDED_DATE_KEY, dateStr);
  } catch {
    // Non-fatal
  }
  return dateStr;
}

export function hasSeenBadgeCelebration() {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_CELEBRATION_SEEN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markBadgeCelebrationSeen() {
  try {
    localStorage.setItem(STORAGE_CELEBRATION_SEEN_KEY, 'true');
  } catch {
    // Non-fatal
  }
}

export function resetBadgeCelebrationForTesting() {
  try {
    localStorage.removeItem(STORAGE_CELEBRATION_SEEN_KEY);
    localStorage.removeItem(STORAGE_AWARDED_DATE_KEY);
  } catch {}
}

// -------------------------------------------------------------
// RETURNING VISITOR MEMORY & CUSTOM GREETINGS (Tier 3)
// -------------------------------------------------------------
export function trackVisitorArrival() {
  if (typeof window === 'undefined') {
    return { isReturning: false, visitCount: 1, customGreeting: 'Welcome to Midnight Nursery Room 07!' };
  }

  try {
    const storedCount = parseInt(localStorage.getItem(STORAGE_VISIT_COUNT_KEY) || '0', 10);
    const lastVisit = localStorage.getItem(STORAGE_LAST_VISIT_KEY);
    const newCount = storedCount + 1;
    localStorage.setItem(STORAGE_VISIT_COUNT_KEY, newCount.toString());
    localStorage.setItem(STORAGE_LAST_VISIT_KEY, new Date().toISOString());

    const profile = getUserProfile();
    const isReturning = storedCount > 0;

    let customGreeting = `*Happy chime!* Welcome to Midnight Nursery Room 07, ${profile.name}!`;
    if (isReturning) {
      if (newCount >= 5) {
        customGreeting = `*Warm snort-giggle!* Welcome back, friend ${profile.name}! Visit #${newCount}! Pip fluffed your favorite ${profile.favoriteComfort} and kept the starlight lantern glowing!`;
      } else {
        customGreeting = `*Yawn-giggle!* Pip remembers you, ${profile.name}! Welcome back to Nursery 07 for sweet bedtime dreams!`;
      }
    }

    return {
      isReturning,
      visitCount: newCount,
      lastVisit,
      customGreeting,
    };
  } catch {
    return { isReturning: false, visitCount: 1, customGreeting: 'Welcome to Midnight Nursery Room 07!' };
  }
}

export function getMilestoneInfo(dreamCount) {
  const isUnlocked = dreamCount >= DREAM_ENGINEER_THRESHOLD;
  const needed = Math.max(0, DREAM_ENGINEER_THRESHOLD - dreamCount);

  const baseStart = 1200;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((dreamCount - baseStart) / (DREAM_ENGINEER_THRESHOLD - baseStart)) * 100))
  );

  let rankTitle = 'Apprentice Dreamer';
  let rankColor = '#69519a';
  let rankBadge = 'Class I';

  if (dreamCount >= 1250) {
    rankTitle = 'Master Dream Architect';
    rankColor = '#80244a';
    rankBadge = 'Class V';
  } else if (isUnlocked) {
    rankTitle = 'Official Dream Engineer';
    rankColor = '#80244a';
    rankBadge = 'Class IV';
  } else if (dreamCount >= 1210) {
    rankTitle = 'Senior Dream Apprentice';
    rankColor = '#5f4200';
    rankBadge = 'Class II';
  }

  return {
    isUnlocked,
    needed,
    threshold: DREAM_ENGINEER_THRESHOLD,
    progressPercent: isUnlocked ? 100 : progressPercent,
    rankTitle,
    rankColor,
    rankBadge,
  };
}

export function playBadgeFanfare() {
  const notes = [
    { n: 'C4', delay: 0 },
    { n: 'E4', delay: 100 },
    { n: 'G4', delay: 200 },
    { n: 'C5', delay: 300 },
    { n: 'E5', delay: 420 },
    { n: 'G5', delay: 560 },
    { n: 'C6', delay: 720 },
  ];

  notes.forEach(({ n, delay }) => {
    setTimeout(() => {
      playChimeNote(n, 0.9, 0.28);
    }, delay);
  });

  setTimeout(() => {
    playTone(1046.5, 'triangle', 1.2, 0.22);
  }, 740);
}
