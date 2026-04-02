import { useState } from 'react'
import { decodeShareParams } from '../core/upi'

export const DEFAULT_STATE = {
  upiId:        'merchant@okaxis',
  payee:        'Green Leaf Store',
  amount:       '',
  note:         'Thank you for shopping!',
  bizName:      'Green Leaf Store',
  tagline:      'Fresh · Local · Organic',
  logoDataUrl:  null,
  primaryColor: '#16a34a',
  bgColor:      '#f0fdf4',
  textColor:    '#14532d',
  qrColor:      '#14532d',
  frame:        'minimal',
  size:         'md',
}

// Internal hook for the Studio wizard's uncontrolled state.
export function useQraftState(defaultValue) {
  const [state, setState] = useState(() => {
    const fromUrl = typeof window !== 'undefined' ? decodeShareParams(window.location.search) : null
    const base = fromUrl ? { ...DEFAULT_STATE, ...fromUrl } : { ...DEFAULT_STATE }
    return defaultValue ? { ...base, ...defaultValue } : base
  })

  const update = (key, value) => setState(prev => ({ ...prev, [key]: value }))
  const updateMany = (partial) => setState(prev => ({ ...prev, ...partial }))
  const reset = () => setState(DEFAULT_STATE)

  return { state, update, updateMany, reset }
}
