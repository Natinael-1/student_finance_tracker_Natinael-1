
export const re = {
  desc: /^\S(?:.*\S)?$/, // to prevent spaces from both side
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/, //validates amount section
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, // YYYY-MM-DD
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,

  // This one uses a concept lookahead and lookbehind to validate duplicate words
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

// The regex here is now stored as a variable. Helps us for reusabilirry
export const regexDescription = /^\S(?:.*\S)?$/;

// allowing decimal value
export const regexAmount = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

// Date format: YYYY-MM-DD
export const regexDate = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// for category
export const regexCategory = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

// This one is for detecting duplicate words
export const regexDuplicateWord = /\b(\w+)\s+\1\b/;


export function validateField(value, pattern) {
  return pattern.test(value);
}
