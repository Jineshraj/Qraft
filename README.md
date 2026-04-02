# Qraft UPI QR

A reusable React package for generating UPI QR labels and a complete 3-step studio UI.

## Installation

```bash
npm install qraft-upi-qr
```

## Quick Usage

### QraftWidget (stateless)

```jsx
import { QraftWidget } from 'qraft-upi-qr'
import 'qraft-upi-qr/dist/style.css'

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
import 'qraft-upi-qr/dist/style.css'

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
