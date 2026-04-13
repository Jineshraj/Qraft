# Qraft UPI QR

A professional, zero-config React package for generating, displaying, and downloading beautiful UPI QR labels. Comes with a standalone drop-in widget, headless export utilities, and a fully-featured 3-step studio wizard.

## Installation

```bash
npm install qraft-upi-qr
```

## ✨ Why Qraft?

- **🚀 Zero-Config Styling**: `qraft-upi-qr` automatically injects its own styles upon import. You do not need to import any CSS files manually.
- **🎨 Complete Branding Freedom**: Embed your own logo at the top of your label, add business headings, and pick from diverse custom layout frames.
- **🖼️ Headless & Invisible Exports**: Build complex UIs that generate and download physical standee stickers in the background with a single click.

---

## 1. Quick Usage (The Widget)

`QraftWidget` is a **stateless**, presentational QR label component. You pass props (UPI ID, colors, logo, etc.) and it instantly renders a styled, ready-to-export label.

```jsx
import { QraftWidget } from 'qraft-upi-qr'

export default function Demo() {
  return (
    <QraftWidget
      upiId="merchant@okaxis"
      payeeName="Green Leaf Store"
      amount={299}
      transactionNote="Thanks for your order"
      colorPreset="forest"
    />
  )
}
```

> **Note for Next.js / SSR Users**: Since this package relies on DOM APIs to inject styles and generate images, ensure you import and use `QraftWidget` and `QraftStudio` inside a client component by adding `"use client";` at the top of your file.

---

## 2. Advanced Customization & Branding

Qraft goes far beyond basic QR codes. You can completely customize the visual architecture to match your application's brand identity.

### Add Subheadings & Logos
Put your business front and center.
```jsx
<QraftWidget
  upiId="merchant@okaxis"
  amount={500}
  bizName="Starbucks Coffee"
  tagline="Sip & Relax"
  logoUrl="https://yourdomain.com/logo.png" // Displays cleanly at the top of the label!
/>
```

### Custom Colors & Frames
Use built-in presets or pass absolute Hex codes. Choose from different shapes and layouts using the `frame` prop.
```jsx
<QraftWidget
  upiId="merchant@okaxis"
  primaryColor="#ff0055" // Accent UI color
  bgColor="#1a1a1a"      // Dark mode background
  textColor="#ffffff"    // White text
  qrColor="#000000"      // The color of the QR dots
  frame="bordered"       // Options: 'minimal', 'bordered', 'badge', 'receipt'
  size="lg"              // Options: 'sm', 'md', 'lg', 'sq'
/>
```

---

## 3. The "Hidden Widget" Headless Download Trick 🔥

One of the most powerful features of Qraft is the ability to generate labels dynamically from your database and download them without ever showing the widget to the user.

We export standard DOM utility functions (`downloadPNG`, `downloadJPG`) so you can build your own custom buttons!

```jsx
import { useRef } from 'react';
import { QraftWidget, downloadPNG } from 'qraft-upi-qr';

export default function ProductDownloadPage({ product }) {
  const qrRef = useRef(null);

  return (
    <div>
      <h1>{product.name}</h1>
      
      {/* 1. Your completely custom UI button */}
      <button onClick={() => downloadPNG(qrRef, `${product.name}-QR`)}>
        Download QR Label
      </button>

      {/* 2. Render the widget OFF-SCREEN */}
      <div style={{ position: 'absolute', left: '-9999px' }}>
         <div ref={qrRef}>
            <QraftWidget
              upiId="merchant@okaxis"
              bizName="My E-Commerce Store"
              amount={product.price}
              transactionNote={`Payment for ${product.name}`}
              colorPreset="gold"
              frame="receipt" // Perfect for product tags!
            />
         </div>
      </div>
    </div>
  );
}
```

---

## 4. QraftStudio (The Complete Wizard)

If you actually *want* an entire UI with sliders, color pickers, and internal buttons, you can use the stateful `QraftStudio`. It handles everything inside a beautiful 3-step wizard (Payment → Branding → Design).

```jsx
import { QraftStudio } from 'qraft-upi-qr'

export default function Demo() {
  return <QraftStudio />
}
```

### Studio Built-in Actions:
- **PNG / JPG**: Export the label image directly.
- **Print**: Opens a print dialog with the label.
- **Share**: Copies a URL containing encoded state parameters.
- **Reset**: Clears the wizard back to defaults.

---

## Props Reference

### QraftWidget Props

| Prop | Type | Description |
| --- | --- | --- |
| `upiId` | `string` | UPI ID to encode into the QR. |
| `payeeName` / `payee`| `string` | Display name for the payee. |
| `amount` | `string \| number` | Fixed amount (optional). |
| `transactionNote` / `note`| `string` | Note shown to payer in UPI apps. |
| `bizName` | `string` | Business name shown on the label. |
| `tagline` | `string` | Short tagline under business name. |
| `logoUrl` | `string` | Logo image URL (preferred). |
| `colorPreset` | `string` | `forest`, `ocean`, `grape`, `flame`, `rose`, `slate`, `gold`, `teal`. |
| `primaryColor` | `string` | Accent color (overrides preset). |
| `bgColor` | `string` | Background color (overrides preset). |
| `textColor` | `string` | Text color (overrides preset). |
| `qrColor` | `string` | QR foreground color (overrides preset). |
| `frame` | `string` | Frame style: `minimal`, `bordered`, `badge`, `receipt`. |
| `size` | `string` | Size: `sm`, `md`, `lg`, `sq`. |

### QraftStudio Props

| Prop | Type | Description |
| --- | --- | --- |
| `defaultValue` | `object` | Initial state (uncontrolled mode). |
| `value` | `object` | Full state (controlled mode). |
| `onChange` | `(state) => void` | Fired on any state update (controlled mode). |

---

## 🎨 Preset Colors (Quick Visual)

| Preset | Accent | Background | Text | QR |
| --- | --- | --- | --- | --- |
| `forest` | `#16a34a` | `#f0fdf4` | `#14532d` | `#14532d` |
| `ocean` | `#0ea5e9` | `#f0f9ff` | `#0c4a6e` | `#0c4a6e` |
| `grape` | `#7c3aed` | `#faf5ff` | `#3b0764` | `#3b0764` |
| `flame` | `#ea580c` | `#fff7ed` | `#7c2d12` | `#7c2d12` |
| `rose` | `#e11d48` | `#fff1f2` | `#881337` | `#881337` |
| `slate` | `#475569` | `#f8fafc` | `#0f172a` | `#0f172a` |
| `gold` | `#d97706` | `#fffbeb` | `#78350f` | `#78350f` |
| `teal` | `#0d9488` | `#f0fdfa` | `#134e4a` | `#134e4a` |

---

## Core Javascript Utilities (Headless SDK)

Beyond the React components, we export pure Javascript functions that you can use anywhere:

```js
import { 
  generateUPIString, 
  generateQRDataURL,
  downloadPNG,
  downloadJPG,
  printLabel,
  captureLabel 
} from 'qraft-upi-qr'

// Generate Raw Payment Links
const upi = generateUPIString({ upiId: 'merchant@okaxis', payee: 'Green Leaf Store' })
const dataUrl = await generateQRDataURL(upi)
```

## License

MIT
