# Qraft UPI QR

A reusable React package for generating UPI QR labels and a complete 3-step studio UI.

## Installation

```bash
npm install qraft-upi-qr
```

## Quick Usage

> **🚀 Zero-Config Styling**: `qraft-upi-qr` automatically injects its own styles upon import. You do not need to import any CSS files manually!

## What You Get (Two Types)

**1) QraftWidget**  
A **stateless**, presentational QR label component. You pass props (UPI ID, colors, logo, etc.) and it renders a ready-to-export label.

**2) QraftStudio**  
A **stateful** 3-step wizard (Payment → Branding → Design) with built‑in actions (PNG/JPG export, Print, Share link, Reset).

### QraftWidget (stateless)

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

### QraftStudio (stateful wizard)

```jsx
import { QraftStudio } from 'qraft-upi-qr'

export default function Demo() {
  return <QraftStudio />
}
```

## Controlled Mode (Studio)

```jsx
import { useState } from 'react'
import { QraftStudio } from 'qraft-upi-qr'

export default function Controlled() {
  const [value, setValue] = useState({
    upiId: 'merchant@okaxis',
    payee: 'Green Leaf Store',
    amount: '',
    note: '',
    bizName: '',
    tagline: '',
    logoDataUrl: null,
    primaryColor: '#16a34a',
    bgColor: '#f0fdf4',
    textColor: '#14532d',
    qrColor: '#14532d',
    frame: 'minimal',
    size: 'md',
  })

  return <QraftStudio value={value} onChange={setValue} />
}
```

## Studio Actions (Buttons)

The Studio UI includes these built‑in actions:

- **PNG / JPG**: Export the label image.
- **Print**: Opens a print dialog with the label.
- **Share**: Copies a URL containing encoded state parameters.
- **Reset**: Clears the wizard back to defaults.

If you only want a UI without these actions, use `QraftWidget` and build your own controls.

## Props Reference

### QraftWidget Props

| Prop | Type | Description |
| --- | --- | --- |
| `upiId` | `string` | UPI ID to encode into the QR. |
| `payeeName` | `string` | Display name for the payee. |
| `payee` | `string` | Alias for `payeeName`. |
| `amount` | `string \| number` | Fixed amount (optional). |
| `transactionNote` | `string` | Note shown to payer in UPI apps. |
| `note` | `string` | Alias for `transactionNote`. |
| `bizName` | `string` | Business name shown on the label. |
| `tagline` | `string` | Short tagline under business name. |
| `logoUrl` | `string` | Logo image URL (preferred). |
| `logoDataUrl` | `string` | Logo as data URL (legacy alias). |
| `colorPreset` | `string` | One of `forest`, `ocean`, `grape`, `flame`, `rose`, `slate`, `gold`, `teal`. |
| `primaryColor` | `string` | Accent color (overrides preset). |
| `bgColor` | `string` | Background color (overrides preset). |
| `textColor` | `string` | Text color (overrides preset). |
| `qrColor` | `string` | QR foreground color (overrides preset). |
| `frame` | `string` | Frame style: `minimal`, `bordered`, `badge`, `receipt`. |
| `size` | `string` | Size: `sm`, `md`, `lg`, `sq`. |
| `state` | `object` | Legacy full state object (overrides individual props). |

### QraftStudio Props

| Prop | Type | Description |
| --- | --- | --- |
| `defaultValue` | `object` | Initial state (uncontrolled mode). |
| `value` | `object` | Full state (controlled mode). |
| `onChange` | `(state) => void` | Fired on any state update (controlled mode). |

## Preset Colors (Quick Visual)

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

## Core Utilities (Headless)

```js
import { generateUPIString, generateQRDataURL } from 'qraft-upi-qr'

const upi = generateUPIString({ upiId: 'merchant@okaxis', payee: 'Green Leaf Store' })
const dataUrl = await generateQRDataURL(upi)
```

## Styling

Qraft uses CSS variables to make theming easy. Override them in your app:

```css
:root {
  --accent: #16a34a;
  --bg: #0f0f0f;
  --text: #ffffff;
  --radius-md: 12px;
}
```

## Troubleshooting

- Logos hosted on other domains may require CORS headers to render in exports.
- For print/export issues, ensure the component is visible in the DOM.

## License

MIT
