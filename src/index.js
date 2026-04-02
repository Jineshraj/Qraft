// Base styles for widget/studio (emitted to dist/style.css in library build).
import './index.css'

// 1. Export the full Studio Wizard (named export for tree-shaking)
export { default as QraftStudio } from "./components/QraftStudio";

// 2. Export the standalone Widget (named export for tree-shaking)
export { default as QraftWidget } from "./components/QraftWidget";

// 3. Export pure logic utilities for custom UIs/backends
export {
  buildUPIString,
  generateUPIString,
  encodeShareParams,
  decodeShareParams,
} from "./core/upi";

export { generateQRDataURL } from "./core/qr";

// 4. Export DOM/Export utilities (guarded for SSR internally)
export {
  downloadPNG,
  downloadJPG,
  printLabel,
  captureLabel,
} from "./utils/dom-export";
