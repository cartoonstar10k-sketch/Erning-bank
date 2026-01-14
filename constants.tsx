
import React from 'react';

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
];

export const COUNTRIES = [
  'Global', 'United States', 'India', 'United Kingdom', 'Canada', 'Australia', 'Nigeria', 'Pakistan', 'Brazil', 'Germany'
];

export const INITIAL_USER_STATE = {
  balance: 0,
  level: 1,
  xp: 0,
  language: 'en',
  country: 'Global',
  tasksCompleted: 0
};

export const UI_STRINGS: Record<string, any> = {
  en: {
    welcome: "Welcome back, Questmaster",
    currentLevel: "Level",
    totalEarnings: "Total Earnings",
    tasksAvailable: "Tasks Available",
    bigPrizes: "Grand Rewards",
    startTask: "Start Quest",
    withdraw: "Cash Out",
    paisa: "Paisa"
  },
  hi: {
    welcome: "वापसी पर स्वागत है, क्वेस्टमास्टर",
    currentLevel: "स्तर",
    totalEarnings: "कुल कमाई",
    tasksAvailable: "उपलब्ध कार्य",
    bigPrizes: "बड़े पुरस्कार",
    startTask: "क्वेस्ट शुरू करें",
    withdraw: "पैसे निकालें",
    paisa: "पैसा"
  }
};
