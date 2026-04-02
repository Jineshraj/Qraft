import QRCode from 'qrcode'
import { buildUPIString } from './upi'

// Generate a QR code data URL from a UPI string or a state object.
export async function generateQRDataURL(input, options = {}) {
  const data = typeof input === 'string' ? input : buildUPIString(input)
  const {
    width = 256,
    margin = 1,
    colorDark = '#000000',
    colorLight = '#ffffff',
    errorCorrectionLevel = 'M',
  } = options

  return QRCode.toDataURL(data || 'upi://pay?pa=pay@upi', {
    width,
    margin,
    errorCorrectionLevel,
    color: { dark: colorDark, light: colorLight },
  })
}
