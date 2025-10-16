
const KEY = 'ft:data:v1';
//This loadData() function handles loading data from local storage
export function loadData() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null') || [];
  } catch {
    return [];
  }
}
//As its name indicates, this function saves data to local storage
export function saveData(arr) {
  try {
    localStorage.setItem(KEY, JSON.stringify(arr));
    return true;
  } catch {
    return false;
  }
}
//This one removes saved data from local storage
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
  


