Student Finance Tracker

“Use but never forget to save!”

A simple and accessible personal finance tracker that helps users record, view, and analyze their spending habits.
This project is part of a web development course, meeting milestones for semantic structure, validation, data persistence, and accessibility.

 Theme

Finance & Budget Management —
Track your expenses and spending trends using a clean, mobile-first web app that stores data locally (no backend needed).
Each transaction includes a description, amount, category, and date — visualized in dashboards and sortable tables.

 Features
Feature	Description
Add Transactions	Add new expense records with live validation and instant feedback.
Edit & Delete	Modify or remove records from the local dataset.
Regex Search	Powerful search with regex support, including case-insensitive matching and live highlighting.
Sorting	Sort records by date, amount, category, or description.
Dashboard	Shows total records, total amount spent, and top spending category.
7-Day Chart	Displays recent spending trends visually.
Spending Cap	Set a monthly budget cap and get live feedback if you exceed it.
Import / Export	Save and load your financial data in JSON format.
Currency Settings	Customize base and conversion currencies.
Accessible Design	Keyboard navigation, ARIA live regions, and visible skip links included.
Persistent Storage	Uses browser localStorage to retain data between sessions.
Regex Catalog

The app validates and searches data using custom regular expressions.

Field	Regex Pattern	Explanation	. Example Valid	. Example Invalid
Description		No leading or trailing spaces	Lunch at cafe	" Lunch "
Amount		Integers or decimals (max 2 decimals)	12, 15.50
Date	
Category		Only letters, spaces, or hyphens	Food, Study Supplies	123Food, @@Food
Duplicate Word Check		Detects consecutive duplicate words	"coffee mug"	"coffee coffee mug"

  Accessibility (A11y) Notes

. Skip link — “Skip to main content” visible on focus

. ARIA roles — banner, main, contentinfo, and aria-live regions

. Semantic HTML — Each section labeled with aria-labelledby

. Keyboard Navigation — All interactive elements reachable by keyboard

. Focus Indicator — Custom :focus-visible styling for clarity

. Contrast — Meets WCAG AA color contrast for text/buttons

  How to Run Locally

Clone this repository:

git clone https://github.com/Natinael-1/student-finance-tracker.git


Open the folder in VS Code or any text editor.

Serve it locally (any of these work):

With VS Code Live Server extension

Or simply open index.html directly in your browser.

Your data is stored automatically in localStorage (no server needed).

  How to Run Tests

Open tests.html in your browser.

JavaScript assertions check:

Regex pattern validity

Field validation errors

Record rendering

Open your console (Ctrl + Shift + I) → see “. Passed” or “. Failed” logs.

Project Structure

File	Purpose
index.html	Main interface
scripts/main.js	App logic, events, rendering
scripts/state.js	Record state management
scripts/storage.js	LocalStorage operations
scripts/validators.js	Regex + input validation
scripts/search.js	Safe regex compiler
styles/style.css	Layout, responsive design
seed.json	13 sample transaction records
README.md	Documentation & project info

======HERE ARE LINKS TO Design=====
1. Phone view
https://www.figma.com/design/1cmjIR8Tqn2GyxU9wIQ9st/Finance-tracker?node-id=31-2&t=GC78fwDVLdUU3The-0  
2.Desktop view  
https://www.figma.com/design/1cmjIR8Tqn2GyxU9wIQ9st/Finance-tracker?node-id=63-953&t=GC78fwDVLdUU3The-0
3 Tablet view  
https://www.figma.com/design/1cmjIR8Tqn2GyxU9wIQ9st/Finance-tracker?node-id=43-278&t=GC78fwDVLdUU3The-0
