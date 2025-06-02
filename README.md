# pt-client-tool

A React-based client tool for PartsTrader that lets users validate part numbers, check against an exclusions list, and view compatible parts. Built with Vite, TypeScript, Tailwind CSS v4, and shadcn-ui components. This repository contains the `PartLookupPage` component and all related setup for local development, testing, and production builds.

---

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Available Scripts](#available-scripts)
5. [Project Structure](#project-structure)
6. [Usage](#usage)
7. [Component Requirements & Behavior](#component-requirements--behavior)
8. [Styling & Theming](#styling--theming)
9. [Testing](#testing)
10. [Linting](#linting)
11. [Building for Production](#building-for-production)
12. [License](#license)

---

## Features

* **Part Number Validation:** Enforces the format `####-XXXX…` (4 digits, dash, 4+ alphanumeric).
* **Exclusions Check:** Loads a JSON-based exclusions list and prevents excluded parts from being sent.
* **Compatible Parts Lookup (Mock):** Once validated and not excluded, displays a mock list of compatible parts.
* **Accessible (WCAG 2.1 AA):** Implements semantic HTML, ARIA roles, and visible focus styles.
* **Responsive Layout:** Uses a CSS grid for compatible-parts cards that adapts from mobile → desktop.
* **Tailwind CSS v4 + shadcn-ui:** Styling and UI components powered by Tailwind v4 and the shadcn-ui library.
* **TypeScript:** All code is strictly typed with `tsconfig` setup.
* **Vite Development Server:** Fast HMR and build pipeline.
* **Vitest & Testing Library:** Unit tests and (optionally) a UI test runner.

---

## Prerequisites

* **Node.js (LTS 20.x or 18.x recommended)**
  Avoid Node 22+—some Tailwind/Tailwind-Vite plugins have unresolved compatibility issues.
* **npm v8+ (or yarn/pnpm equivalent)**
* **Git** (to clone the repository)

---

## Installation

1. **Clone this repo**

   ```bash
   git clone https://github.com/your-org/pt-client-tool.git
   cd pt-client-tool
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   > If you see any errors related to Tailwind CLI or missing binaries, run:
   >
   > ```bash
   > npm uninstall @tailwindcss/cli tailwindcss postcss autoprefixer  
   > npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer  
   > ```

---

## Available Scripts

From the project root, run any of the following npm scripts:

* **`npm run dev`**
  Starts Vite’s development server at `http://localhost:5173` (by default).

  * Hot Module Replacement (HMR) is enabled.
  * Changes to React components, CSS, and Tailwind config update instantly in the browser.

* **`npm run build`**
  Builds the project for production (output in `dist/`):

  1. Runs TypeScript’s `tsc -b` to verify types and emit declaration files if configured.
  2. Runs `vite build` to bundle JS/CSS/Assets, apply PostCSS, purge unused Tailwind classes, and generate hashed filenames.

* **`npm run preview`**
  Serves the production build locally for a final check, using `vite preview`.

* **`npm run lint`**
  Runs ESLint over all `.tsx`, `.ts`, `.jsx`, and `.js` files according to the project’s ESLint config. Fails on errors/warnings (depending on your config).

* **`npm run test`**
  Runs Vitest in “headless” mode and outputs test results in the console.

* **`npm run test:ui`**
  Starts Vitest in interactive UI mode (`--ui`), allowing you to toggle individual tests and view state in a browser.

---

## Project Structure

```
pt-client-tool/
├── dist/                        # Production build output
├── node_modules/                # npm dependencies
├── public/                      # Static assets served directly
├── src/                         # Application source code
│   ├── assets/                  # (optional) Images, icons, etc.
│   ├── components/              # Reusable UI components
│   │   └── Alert/Result/
│   │       └── ResultAlert.tsx   # Custom alert component for results
│   ├── ui/                      # Base input/button/alert primitives
│   │   ├── custom/              # Custom wrappers or overrides
│   │   │   └── buttonConstants.ts  # Shared constants for buttons
│   │   ├── alert.tsx            # Base Alert component
│   │   ├── button.tsx           # Base Button component
│   │   ├── input.tsx            # Base Input component
│   │   └── index.ts             # Barrel export of ui components
│   ├── data/                    # Static or mock data files
│   │   ├── exclusions.json      # (alias from public) JSON of excluded parts
│   │   └── mockCompatibleParts.ts  # Mock fetch function for compatible parts
│   ├── hooks/                   # Custom hooks for business logic
│   │   └── usePartValidation.ts # Part validation and exclusions logic
│   ├── interface/               # TypeScript interfaces and types
│   │   └── types.ts             # Definitions for CompatiblePart, etc.
│   ├── lib/                     # Utility libraries and constants
│   │   ├── strings.ts           # All user-facing text & templates
│   │   └── utils.ts             # Miscellaneous helper functions
│   ├── pages/                   # Top-level page components and tests
│   │   ├── PartLookupPage.tsx      # The main lookup UI component
│   │   ├── PartLookupPage.test.ts  # Unit tests for the page
│   ├── App.tsx                  # Root React component (wraps PartLookupPage)
│   ├── main.tsx                 # ReactDOM render entry point
│   ├── index.css                # Global CSS (imports Tailwind)
│   └── vite-env.d.ts            # Vite environment type declarations
└──
```

---

## Usage

1. **Start the Dev Server**

   ```bash
   npm run dev
   ```

   Navigate to `http://localhost:5173`. You should see the “PartsTrader: Part Lookup” page.

2. **Enter a Part Number**

   * The input enforces the format `####-XXXX…` (4 digits, dash, 4+ alphanumeric).
   * Example valid inputs: `1234-abcd`, `1234-A1B2C3`.

3. **Validation & Exclusion**

   * If the format is invalid, an error alert appears with a relevant message.
   * If valid but found in the exclusions list (`exclusions.json`), a warning appears (no compatible parts displayed).
   * If valid and not excluded, a success alert appears and a grid of “compatible parts” (mock data) is shown.

4. **Clear Results**
   Click the “Clear” button to reset the input and remove any messages/results.

---

## Component Requirements & Behavior

### 1. **Validate Part Number**

* Pattern:

  ```
  <partId> "-" <partCode>
  partId   = exactly 4 digits (0–9)  
  partCode = at least 4 alphanumeric characters (A–Z, 0–9, case-insensitive)
  ```
* Invalid examples: `123-abcd` (only 3 digits), `abcd-1234` (first segment must be digits), `1234-abc` (only 3 alphanumeric characters).
* When invalid: `validatePartNumber()` throws `InvalidPartException`, which is caught and displayed in a red (“error”) alert using the `<ResultAlert>` component.

### 2. **Check Exclusions List**

* The exclusions list lives in `public/exclusions.json` (or imported via `src/data/exclusions.json`).
* JSON shape:

  ```json
  [
    { "PartNumber": "1111-Invoice", "Description": "Invoice line" },
    { "PartNumber": "1234-abcd",   "Description": "Test Part Number" },
    { "PartNumber": "9999-charge", "Description": "Stealth charge added for rude customers" }
  ]
  ```
* `loadExclusions()` loads and lowercases the `PartNumber` values.
* `isExcluded(partNumber, exclusionsArray)` checks membership. If found, sets `resultType = "warning"` and displays the exclusion message. No compatible parts are displayed.

### 3. **Lookup Compatible Parts (Mock)**

* If the validated `partNumber` is **not** in the exclusions list, `fetchCompatibleParts(normalized)` returns a mock array of compatible parts (`CompatiblePart[]`).
* Example `CompatiblePart` shape (in `src/interface/types.ts`):

  ```ts
  export interface CompatiblePart {
    partNumber: string;
    description: string;
    manufacturer: string;
    price: number;
  }
  ```
* When success:

  * `resultType = "success"`, and a green‐border alert appears with the message from `successMessage(partNumber)`.
  * A responsive grid of cards (one per compatible part) is rendered below the alert.

### 4. **Accessibility (WCAG 2.1 AA)**

* **Landmark Role:** The `<main>` wrapper lives in `src/App.tsx`. Do not nest a second `<main>` inside `PartLookupPage`.
* **Labels & Focus:**

  * The `<label htmlFor="partNumber">` is correctly associated with the `<Input id="partNumber" />`.
  * Buttons and inputs use `focus:ring-2 focus:ring-blue-500` so keyboard users see a clear focus ring.
  * Alerts live inside a `role="region" aria-live="polite" aria-atomic="true"` wrapper, announcing dynamic messages.
* **Color Contrast:** All text‐on‐background combinations meet 4.5:1 for normal text.
* **Responsive Touch Targets:** Buttons are at least 44×44 CSS pixels in size.
---

## Testing

Unit tests live alongside components in `src/`. Example:

```text
src/
├── pages/
│   └── PartLookupPage.test.tsx
├── hooks/
│   └── usePartValidation.test.ts
└── ...
```

* **Run all tests**

  ```bash
  npm run test
  ```

  Vitest will output pass/fail in the console.

* **Interactive UI mode** (for watching file changes)

  ```bash
  npm run test:ui
  ```

  Opens a browser at `http://localhost:…` where you can toggle individual tests.

---

## Linting

This project uses **ESLint** (with the `@eslint/js` and `eslint-plugin-react-hooks` plugins) to enforce code style and catch errors.

* **Run the linter**

  ```bash
  npm run lint
  ```

  Fails on any linting errors by default.

You can customize ESLint rules in `.eslintrc.js` or `.eslintrc.cjs` as needed.

---

## Building for Production

1. **Check types**
   The `tsc -b` step (inside `npm run build`) will verify that all TypeScript code is error-free.

2. **Bundle & optimize**
   `vite build` will:

   * Tree-shake unused code.
   * Purge unused Tailwind CSS classes (per `content` paths).
   * Minify JavaScript/CSS.
   * Fingerprint assets for cache-busting.

3. **Preview**
   After building:

   ```bash
   npm run preview
   ```

   Serves the contents of `dist/` at a local port (usually `4173`) so you can verify the production bundle.

---
