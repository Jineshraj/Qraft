# Qraft - Architecture & Package Transition Plan (v3)

## 1. Project Overview

**Qraft** is transitioning from a standalone React web application into a professional, reusable, and highly customizable `npm` package.

**Goal:** Developers can run `npm install qraft` to seamlessly integrate our UPI logic, standalone QR components, or the entire stateful 3-step UI wizard into their own React applications.

---

## 2. Target Library Architecture

To guarantee flexibility for consumers, we are strictly decoupling the core logic from the React UI layer. The final `src/` directory will be organized as follows:

```text
src/
├── core/                   # Pure logic (No React dependency)
│   ├── upi.js              # generateUPIString(state)
│   └── qr.js               # generateQRDataURL(state)
├── components/             # React UI Layer
│   ├── QraftWidget.jsx     # Pure UI component for the QR card
│   └── QraftStudio.jsx     # Stateful 3-step wizard component
├── hooks/
│   └── useQraftState.js    # Internal state management for the Studio
├── utils/
│   └── dom-export.js       # html2canvas utilities (optional UI exports)
└── index.js                # Public API Exports
```

---

## 3. The npm Package Vision (The Public API)

### A. QraftWidget (Stateless Presentational UI)

A pure presentational component. It wraps the rendered card in a `forwardRef` to allow developers full control over DOM capture/animations.

```typescript
type QraftWidgetProps = {
  upiId: string;
  payeeName?: string;
  amount?: number;
  transactionNote?: string;
  theme?: "light" | "dark";
  colorPreset?: "orange" | "blue" | "green" | "purple" | "red";
  logoUrl?: string;
  fallbackLogoUrl?: string; // Fallback state
  isLoading?: boolean; // Loading state
  onError?: (err: Error) => void; // UPI Validation catching
};

// Implementation target:
// export const QraftWidget = forwardRef<HTMLDivElement, QraftWidgetProps>((props, ref) => { ... })
```

### B. QraftStudio (Stateful Wizard)

The complete 3-step wizard. It exposes a robust API supporting both **Controlled** (for Redux/Zustand integration) and **Uncontrolled** (quick drop-in) patterns.

```typescript
type QraftState = {
  upiId: string;
  payeeName: string;
  amount: number;
  // ... other internal state fields
};

type QraftStudioProps = {
  // Uncontrolled mode
  defaultValue?: Partial<QraftState>;

  // Controlled mode
  value?: QraftState;
  onChange?: (state: QraftState) => void;

  // Extensibility Hooks
  renderFooter?: (state: QraftState) => React.ReactNode;
  onExport?: (dataUrl: string) => void;
};
```

### C. Core Logic (Headless)

For backend usage or developers building completely custom renderers who only need our engine.

```javascript
import { generateUPIString, generateQRDataURL } from "qraft";
```

---

## 4. CSS Strategy (Theming)

We will use **CSS Custom Properties** (variables) to prevent class clashes and allow dead-simple theming without overriding strict CSS classes.

Developers import the base styles: `import 'qraft/dist/style.css';`
And override via their own CSS:

```css
:root {
  --qraft-primary: #ff6a00;
  --qraft-bg: #0f0f0f;
  --qraft-text: #ffffff;
  --qraft-radius: 12px;
}
```

---

## 5. Execution Roadmap

## Progress Checklist

- [x] Phase 1: Refactor into `core/`, `components/`, `hooks/`, `utils/`, `index.js`
- [x] Phase 1: Convert `App.jsx` -> `QraftStudio.jsx` (controlled + uncontrolled)
- [x] Phase 1: Convert `QRLabel.jsx` -> `QraftWidget.jsx` (prop-driven)
- [x] Phase 1: Implement `generateQRDataURL` (no html2canvas)
- [x] Phase 2: Vite library mode + externalize `react`/`react-dom`
- [x] Phase 2: Generate `.d.ts` files
- [x] Phase 3: Update `package.json` exports/entrypoints
- [x] Phase 4: Rewrite README with usage, props, theming
- [ ] Phase 5: Build, pack, publish (SemVer)

### Phase 1: Refactoring the Code for Props

- Reorganize files into `core/`, `components/`, etc.
- Refactor `App.jsx` into `QraftStudio.jsx` to implement the controlled/uncontrolled API.
- Refactor `QRLabel.jsx` into `QraftWidget.jsx` with strict prop types.
- Implement `generateQRDataURL` to bypass `html2canvas` fragility.

### Phase 2: Build Tool Configuration (Vite)

- Update `vite.config.js` to enable **Library Mode** (`build.lib`).
- **Crucial:** We must mark `react` and `react-dom` as **external** so they are not bundled into the final package. This is done by listing them as `peerDependencies`.
- Generate `.d.ts` declaration files using `tsc` to provide robust TypeScript support.

### Phase 3: The `package.json` Surgery

- Update `"main"`, `"module"`, `"exports"`, and `"types"`.
- Ensure `"files": ["dist"]` is set.

### Phase 4: Documentation (README.md)

Before publishing, the README must be rewritten to include:

- **Installation** (`npm install qraft`)
- **Basic Usage** (Code snippets for Widget and Studio)
- **Props Table** (Clear definitions of our new Types)
- **Styling Guide** (How to use the CSS variables)
- **Troubleshooting** (e.g., handling CORS with logos)

### Phase 5: Versioning & Publishing

We will follow Semantic Versioning (SemVer):

1.  Update `package.json` version using `npm version minor` (e.g., `0.1.0` for initial beta).
2.  Run `npm run build` and `npm pack` to locally verify the tarball exactly as a user would download it.
3.  `npm publish`
