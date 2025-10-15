// scripts/storage.js
const KEY = 'ft:data:v1';

export function loadData() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null') || [];
  } catch {
    return [];
  }
}

export function saveData(arr) {
  try {
    localStorage.setItem(KEY, JSON.stringify(arr));
    return true;
  } catch {
    return false;
  }
}

export function clearData() {
  localStorage.removeItem(KEY);
}

const SETTINGS_KEY = 'app:settings';

export function loadSettings() {
  return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
  


