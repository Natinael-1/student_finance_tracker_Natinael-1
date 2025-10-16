// scripts/main.js
import { addRecord, getAll, deleteRecord, updateRecord, replaceAll } from './state.js';
import { cleanDescription, validate } from './validators.js';
import { compileRegex } from './search.js';
import { loadSettings, saveSettings } from './storage.js';


import {regexDescription, regexAmount, regexDate, regexCategory, regexDuplicateWord,validateField} from './validators.js';
// ✅ Global regex storage for highlighting
let currentSearchRegex = null;

function highlightMatch(text) {
  if (!currentSearchRegex) return text;
  return text.replace(currentSearchRegex, match => `<mark>${match}</mark>`);
}
//variables declared for persitent sorting

let currentSortKey = null;     
let currentSortDirection = 'asc';  // or 'desc'





let editingId = null;


document.getElementById('year').textContent = new Date().getFullYear();

// Load current records from state
const data = getAll();
renderDashboard(data);

// simple nav handler
document.querySelectorAll('.top-nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.nav;
    document.querySelectorAll('.screen').forEach(s => s.hidden = true);
    const section = document.getElementById(target);
    section.hidden = false;
    document.getElementById('main').focus();

    // ✅ When switching to Records, refresh the list
    
    if (target === 'records') {
      let data = getAll();
    if (currentSortKey) {
      data = sortRecords(data, currentSortKey, currentSortDirection);
    }

    renderRecords(data);
  }

    /*if (target === 'records') {
      renderRecords(getAll());
    }*/
  });
});
// Track sort order for each field
const sortState = {
  date: 'asc',
  amount: 'asc',
  category: 'asc',
  description: 'asc'
};

document.getElementById('sort-controls').addEventListener('click', (e) => {
  if (!e.target.dataset.sort) return;

  const field = e.target.dataset.sort;
  const allRecs = getAll();

  // Toggle direction
  const direction = sortState[field] === 'asc' ? 'desc' : 'asc';
  sortState[field] = direction;
  // Save sort so it persists
currentSortKey = field;
currentSortDirection = direction;

const sorted = sortRecords(allRecs, field, direction);
renderRecords(sorted);
  /*const sorted = sortRecords(allRecs, field, direction);
  renderRecords(sorted);*/
});


// === Live Regex Search ===
const searchInput = document.getElementById('search-input');
const caseToggle = document.getElementById('case-insensitive');

searchInput.addEventListener('input', handleSearch);
caseToggle.addEventListener('change', handleSearch);
function handleSearch() {
  const allRecords = getAll();
  const pattern = searchInput.value.trim();

  const flags = caseToggle.checked ? 'i' : '';
  const re = compileRegex(pattern, flags);
  currentSearchRegex = re; // ✅ store it globally

  if (!re) {
    currentSearchRegex = null;
    renderRecords(allRecords);
    return;
  }

  const filtered = allRecords.filter(rec => {
    return (
      re.test(rec.description) ||
      re.test(String(rec.amount)) ||
      re.test(rec.category) ||
      re.test(rec.date)
    );
  });

  renderRecords(filtered);
}
 //form: quick submit test
 // ✅ Make sure normalizeDateInput and cleanDescription exist above this block

const form = document.getElementById('txn-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // === 1. Get raw values from inputs (only once each) ===
  const rawDesc = document.getElementById('desc').value;
  const rawAmt = document.getElementById('amount').value;
  const rawCat = document.getElementById('category').value;
  const rawDate = document.getElementById('date').value; // single declaration

  // === 2. Prepare error fields ===
  const errDesc = document.getElementById('err-desc');
  const errAmount = document.getElementById('err-amount');
  const errCategory = document.getElementById('err-category');
  const errDate = document.getElementById('err-date');

  let valid = true;

  // === Description Validation ===
  if (!regexDescription.test(rawDesc)) {
    errDesc.textContent = "No leading/trailing spaces allowed.";
    valid = false;
  } else if (regexDuplicateWord.test(rawDesc.toLowerCase())) {
    errDesc.textContent = "Duplicate words detected (e.g. 'coffee coffee').";
    valid = false;
  } else {
    errDesc.textContent = "";
  }
  const cleanedDesc = cleanDescription(rawDesc);

  // === Amount Validation ===
  if (!validateField(rawAmt, regexAmount)) {
    errAmount.textContent = "Enter a valid amount (e.g. 10.50).";
    valid = false;
  } else {
    errAmount.textContent = "";
  }

  // === Category Validation ===
  if (!validateField(rawCat.trim(), regexCategory)) {
    errCategory.textContent = "Only letters, spaces, or hyphens allowed.";
    valid = false;
  } else {
    errCategory.textContent = "";
  }

  // === Date Validation (from native <input type="date">) ===
  const dateValue = String(rawDate).trim(); // use this variable for validation/storage
  if (!regexDate.test(dateValue)) {
    errDate.textContent = "Please select a valid date (YYYY-MM-DD).";
    valid = false;
  } else {
    errDate.textContent = "";
  }

  // === STOP if invalid ===
  if (!valid) {
    document.getElementById('form-status').textContent = "Fix errors before saving.";
    return;
  }

  // === Build record with cleaned values ===
  const now = new Date().toISOString();
  const rec = {
    description: cleanedDesc,
    amount: rawAmt,
    category: rawCat.trim(),
    date: dateValue
  };

  if (editingId) {
    updateRecord(editingId, rec);
    editingId = null;
    document.getElementById('form-status').textContent = 'Record updated!';
  } else {
    rec.id = 'rec_' + Date.now();
    rec.createdAt = now;
    rec.updatedAt = now;
    addRecord(rec);
    document.getElementById('form-status').textContent = 'Record added!';
  }

  renderDashboard(getAll());
  renderRecords(getAll());
  form.reset();
});
function getDashboardStats(data) {
  const totalRecords = data.length;

  const totalAmount = data.reduce((sum, rec) => {
    const val = parseFloat(rec.amount);
    return isNaN(val) ? sum : sum + val;
  }, 0);

  const categoryCounts = {};
  data.forEach(r => {
    const cat = r.category || 'Unknown';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  let topCategory = 'N/A';
  let maxCount = 0;
  for (const c in categoryCounts) {
    if (categoryCounts[c] > maxCount) {
      maxCount = categoryCounts[c];
      topCategory = c;
    }
  }

  const last7 = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    last7[key] = 0;
  }

  data.forEach(rec => {
    const k = (rec.date || '').slice(0, 10);
    if (last7.hasOwnProperty(k)) {
      last7[k] += parseFloat(rec.amount) || 0;
    }
  });

  const last7Array = Object.entries(last7).sort(([a], [b]) => a.localeCompare(b));

  return { totalRecords, totalAmount, topCategory, last7Array };
}
function renderDashboard(data) {
  const stats = getDashboardStats(data);

  document.getElementById('stat-total-records').textContent =
    `Total Records: ${stats.totalRecords}`;

  document.getElementById('stat-total-amount').textContent =
    `Total Amount: $${stats.totalAmount.toFixed(2)}`;
    // Adding monthly cap calculator
    const settings = loadSettings();
    const cap = settings.cap;

  if (cap !== undefined && !isNaN(cap)) {
    const remaining = cap - stats.totalAmount;
    const liveMessageElem = document.getElementById('cap-live');

    if (!liveMessageElem) {
      // create live region if not exists
      const p = document.createElement('p');
      p.id = 'cap-live';
      p.setAttribute('role', 'status');
      p.setAttribute('aria-live', 'polite');
      document.getElementById('dashboard').appendChild(p);
    }

    const messageElem = document.getElementById('cap-live');
    if (remaining >= 0) {
      messageElem.textContent = `You are $${remaining.toFixed(2)} under your cap.`;
    } else {
      messageElem.setAttribute('aria-live', 'assertive');
      messageElem.textContent = `You are $${Math.abs(remaining).toFixed(2)} OVER your cap!`;
    }
  }
  document.getElementById('stat-top-category').textContent =
    `Top Category: ${stats.topCategory}`;

  const chartDiv = document.getElementById('stat-chart');
  chartDiv.innerHTML = '';

  const amounts = stats.last7Array.map(([, amt]) => amt);
  const maxAmt = Math.max(...amounts, 1);

  stats.last7Array.forEach(([dateStr, amt]) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    const heightPercent = (amt / maxAmt) * 100;
    bar.style.height = heightPercent + '%';
    bar.title = `${dateStr}: $${amt.toFixed(2)}`;
    chartDiv.appendChild(bar);
  });
}
//sorter function
function sortRecords(records, field, direction = 'asc') {
  const sorted = [...records];

  sorted.sort((a, b) => {
    let valA = a[field];
    let valB = b[field];

    // Convert numeric string to number if needed
    if (field === 'amount') {
      valA = parseFloat(valA);
      valB = parseFloat(valB);
    }

    // Compare strings case-insensitively
    if (typeof valA === 'string' && typeof valB === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

function renderRecords(data) {
  const container = document.getElementById('records-list');
  container.innerHTML = '';

  if (!data.length) {
    container.innerHTML = `
      <tr><td colspan="6" style="text-align:center;">No records found.</td></tr>
    `;
    return;
  }

  data.forEach((rec, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${highlightMatch(rec.description)}</td>
      <td>$${highlightMatch(String(rec.amount))}</td>
      <td>${highlightMatch(rec.category)}</td>
      <td>${highlightMatch(rec.date)}</td>
      <td>
        <button data-id="${rec.id}" data-action="edit">Edit</button>
        <button data-id="${rec.id}" data-action="delete">Delete</button>
      </td>
    `;

    container.appendChild(row);
  });
}



/*function renderRecords(data) {
  const container = document.getElementById('records-list');
  container.innerHTML = '';

  if (!data.length) {
    container.innerHTML = '<p>No records found.</p>';
    return;
  }

  data.forEach(rec => {
    const card = document.createElement('div');
    card.className = 'record-card';

    const info = document.createElement('div');
    info.className = 'record-info';
    
    info.innerHTML = `
          <strong>${highlightMatch(rec.description)}</strong><br>
          Amount: ${highlightMatch(String(rec.amount))}<br>
          Category: ${highlightMatch(rec.category)}<br>
          Date: ${highlightMatch(rec.date)}`;

    const actions = document.createElement('div');
    actions.className = 'record-actions';
    actions.innerHTML = `
      <button data-id="${rec.id}" data-action="edit">Edit</button>
      <button data-id="${rec.id}" data-action="delete">Delete</button>
    `;

    card.appendChild(info);
    card.appendChild(actions);
    container.appendChild(card);
  });
}*/



// Delete button handler (event delegation)
document.getElementById('records-list').addEventListener('click', (e) => {
  const btn = e.target;
  if (btn.dataset.action === 'delete') {
    const id = btn.dataset.id;

    // Confirm before deleting
    const ok = confirm('Delete this record?');
    if (!ok) return;

    const removed = deleteRecord(id);
    if (removed) {
      // Refresh the UI using updated records
      renderRecords(getAll());
      renderDashboard(getAll());
    }
  }
  // Edit button handler
    if (btn.dataset.action === 'edit') {
    const id = btn.dataset.id;
    const record = getAll().find(r => r.id === id);
    if (!record) return;

    // Populate form fields
    const form = document.getElementById('txn-form');
    form.description.value = record.description;
    form.amount.value = record.amount;
    form.category.value = record.category;
    form.date.value = record.date;

    // Track which record we're editing
    editingId = id;

    // Switch to Add/Edit section
    document.querySelectorAll('.screen').forEach(s => s.hidden = true);
    document.getElementById('add').hidden = false;
    /*const mainEl = document.getElementById('main');
    if (mainEl) mainEl.focus();*/ 
    document.getElementById('main').focus();

    // Update form status text
    document.getElementById('form-status').textContent = 'Editing record...';
   }

});
// ✅ ALL other code above (nav handlers, render functions, etc.)

// ✅ Add this EXACTLY at the very bottom:

document.addEventListener('DOMContentLoaded', () => {

  // === Load existing settings on startup ===
  const settings = loadSettings();
  if (settings.baseCurrency) {
    document.getElementById('base-currency').value = settings.baseCurrency;
    document.getElementById('currency1').value = settings.currency1;
    document.getElementById('rate1').value = settings.rate1;
    document.getElementById('currency2').value = settings.currency2;
    document.getElementById('rate2').value = settings.rate2;
  }

  // === Handle currency save ===
  const currencyForm = document.getElementById('currency-form');
  if (currencyForm) {
    currencyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newSettings = {
        baseCurrency: document.getElementById('base-currency').value,
        currency1: document.getElementById('currency1').value,
        rate1: parseFloat(document.getElementById('rate1').value),
        currency2: document.getElementById('currency2').value,
        rate2: parseFloat(document.getElementById('rate2').value),
      };
      saveSettings(newSettings);
      alert('Currency settings saved!');

    });
  }

  // === Export JSON ===
  const exportBtn = document.getElementById('export-json');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const data = getAll();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'records_export.json';
      a.click();

      URL.revokeObjectURL(url);
    });
  }

  // === Import JSON ===
  const importInput = document.getElementById('import-json');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          if (!Array.isArray(jsonData)) {
            throw new Error("Invalid JSON: must be an array of records.");
          }

          replaceAll(jsonData);
          renderRecords(getAll());
          renderDashboard(getAll());

          document.getElementById('import-status').textContent = 'Import successful!';
        } catch (err) {
          document.getElementById('import-status').textContent = 'Import failed: ' + err.message;
        }
      };
      reader.readAsText(file);
    });
  }


  //for adding capital
  if (settings.cap !== undefined) {
  document.getElementById('cap-amount').value = settings.cap;
}

// === Save cap when form is submitted ===
document.getElementById('cap-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const capValue = parseFloat(document.getElementById('cap-amount').value);

  if (isNaN(capValue) || capValue < 0) {
    document.getElementById('cap-status').textContent =
      'Please enter a valid number.';
    return;
  }

  const updatedSettings = {
    ...loadSettings(),
    cap: capValue
  };

  saveSettings(updatedSettings);
  document.getElementById('cap-status').textContent = 'Cap saved!';
});


});  // ✅ THIS time it closes properly!

// ✅ END OF main.js








