// scripts/state.js
import { loadData, saveData } from './storage.js';

let state = loadData();

//This function returns records for us
export function getAll() {
  return state;
}
//This function adds record to local storage
export function addRecord(rec) {
  state.push(rec);
  saveData(state);
  return rec;
}
//Update function as its name indicates updates existing records
export function updateRecord(id, updates) {
  const idx = state.findIndex(r => r.id === id);
  if (idx !== -1) {
    state[idx] = { ...state[idx], ...updates, updatedAt: new Date().toISOString() };
    saveData(state);
    return state[idx];
  }
  return null;
}

//This delete function deletes records
export function deleteRecord(id) {
  const idx = state.findIndex(r => r.id === id);
  if (idx !== -1) {
    state.splice(idx, 1);
    saveData(state);
    return true;
  }
  return false;
}
//This function replaces records with new array
export function replaceAll(newArray) {
  state = newArray;
  saveData(state);
}
//This one clears records from both state and local storage
export function clearState() {
  state = [];
  saveData(state);
}
