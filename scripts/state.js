// scripts/state.js
import { loadData, saveData } from './storage.js';

let state = loadData(); // internal array holding all transactions

export function getAll() {
  return state;
}

export function addRecord(rec) {
  state.push(rec);
  saveData(state);
  return rec;
}

export function updateRecord(id, updates) {
  const idx = state.findIndex(r => r.id === id);
  if (idx !== -1) {
    state[idx] = { ...state[idx], ...updates, updatedAt: new Date().toISOString() };
    saveData(state);
    return state[idx];
  }
  return null;
}

export function deleteRecord(id) {
  const idx = state.findIndex(r => r.id === id);
  if (idx !== -1) {
    state.splice(idx, 1);
    saveData(state);
    return true;
  }
  return false;
}

export function replaceAll(newArray) {
  state = newArray;
  saveData(state);
}

export function clearState() {
  state = [];
  saveData(state);
}
