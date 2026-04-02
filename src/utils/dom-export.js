import html2canvas from 'html2canvas'

// Render the label node to a canvas using html2canvas.
export async function captureLabel(elementId = 'label-inner') {
  const el = document.getElementById(elementId)
  if (!el) throw new Error('Label element not found')
  return await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: null, logging: false })
}

// Download the label as a PNG file.
export async function downloadPNG() {
  const canvas = await captureLabel()
  trigger(canvas.toDataURL('image/png'), 'upi-label.png')
}

// Download the label as a JPG file.
export async function downloadJPG() {
  const canvas = await captureLabel()
  trigger(canvas.toDataURL('image/jpeg', 0.95), 'upi-label.jpg')
}

// Open a print window with the label markup.
export function printLabel() {
  const el = document.getElementById('label-inner')
  if (!el) return
  const win = window.open('', '_blank')
  win.document.write(`<html><head><title>UPI Label</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
    <style>*{box-sizing:border-box;margin:0;padding:0}body{display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Outfit',sans-serif;background:#f5f5f5}@media print{body{background:white}@page{margin:0}}</style>
  </head><body>${el.outerHTML}</body></html>`)
  win.document.close()
  win.onload = () => { win.focus(); win.print() }
}

// Programmatically trigger a download in the browser.
function trigger(dataUrl, filename) {
  const a = document.createElement('a')
  a.href = dataUrl; a.download = filename; a.click()
}
