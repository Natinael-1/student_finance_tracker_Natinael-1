// scripts/validators.js
export const re = {
  desc: /^\S(?:.*\S)?$/, // no leading/trailing spaces
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/, // money
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, // YYYY-MM-DD
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,

  // advanced: duplicate consecutive word (back-reference)
  dupWord: /\b(\w+)\s+\1\b/i
};

export function cleanDescription(s) {
  return s.trim().replace(/\s{2,}/g, ' ');
}

export function validate(record) {
  const errors = {};
  if (!re.desc.test(cleanDescription(record.description || ''))) errors.description = 'Invalid description';
  if (!re.amount.test(String(record.amount || ''))) errors.amount = 'Invalid amount';
  if (!re.date.test(record.date || '')) errors.date = 'Invalid date';
  if (!re.category.test(record.category || '')) errors.category = 'Invalid category';
  return errors;
}
//These regex checkers are for validating user input
// No leading/trailing spaces
export const regexDescription = /^\S(?:.*\S)?$/;

// Amount: integers or decimals up to 2 digits
export const regexAmount = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

// Date: YYYY-MM-DD
export const regexDate = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// Category: letters, spaces, hyphens only
export const regexCategory = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

// Advanced regex: duplicate word detection
export const regexDuplicateWord = /\b(\w+)\s+\1\b/;

// Utility
export function validateField(value, pattern) {
  return pattern.test(value);
}
