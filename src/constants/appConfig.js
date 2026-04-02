export const PRESETS = [
  { name: 'Forest',  primary: '#16a34a', bg: '#f0fdf4', text: '#14532d', qr: '#14532d' },
  { name: 'Ocean',   primary: '#0ea5e9', bg: '#f0f9ff', text: '#0c4a6e', qr: '#0c4a6e' },
  { name: 'Grape',   primary: '#7c3aed', bg: '#faf5ff', text: '#3b0764', qr: '#3b0764' },
  { name: 'Flame',   primary: '#ea580c', bg: '#fff7ed', text: '#7c2d12', qr: '#7c2d12' },
  { name: 'Rose',    primary: '#e11d48', bg: '#fff1f2', text: '#881337', qr: '#881337' },
  { name: 'Slate',   primary: '#475569', bg: '#f8fafc', text: '#0f172a', qr: '#0f172a' },
  { name: 'Gold',    primary: '#d97706', bg: '#fffbeb', text: '#78350f', qr: '#78350f' },
  { name: 'Teal',    primary: '#0d9488', bg: '#f0fdfa', text: '#134e4a', qr: '#134e4a' },
]

export const PRESET_MAP = Object.fromEntries(
  PRESETS.map((p) => [p.name.toLowerCase(), p])
)

// Frame style options for the label.
export const FRAMES = [
  { id: 'minimal',  label: 'Clean',    desc: 'Floating card' },
  { id: 'bordered', label: 'Bold',     desc: 'Thick border' },
  { id: 'badge',    label: 'Banner',   desc: 'Header strip' },
  { id: 'receipt',  label: 'Receipt',  desc: 'Dashed edge' },
]

// Output size presets for the label.
export const SIZES = [
  { id: 'sm', label: 'S', w: '270', h: '~340' },
  { id: 'md', label: 'M', w: '330', h: '~410' },
  { id: 'lg', label: 'L', w: '400', h: '~500' },
  { id: 'sq', label: 'SQ', w: '360', h: '360' },
]

// Step metadata for the wizard top bar.
export const STEPS = [
  { id: 'upi',     icon: '1', label: 'Payment' },
  { id: 'brand',   icon: '2', label: 'Branding' },
  { id: 'design',  icon: '3', label: 'Design' },
]
