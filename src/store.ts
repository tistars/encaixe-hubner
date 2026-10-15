import { useCallback, useEffect, useState } from 'react'
import type { CartItem } from './types'

const CART_SLOT = 'encaixe.carrinho.v1'

function read(): CartItem[] {
  try {
    const v = JSON.parse(localStorage.getItem(CART_SLOT) ?? '[]')
    return Array.isArray(v) ? v.filter((i) => i && typeof i.partId === 'string' && i.qty > 0) : []
  } catch {
    return []
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(read)

  useEffect(() => {
    localStorage.setItem(CART_SLOT, JSON.stringify(items))
  }, [items])

  const add = useCallback((vehicleId: string, partId: string, qty: number) => {
    setItems((cur) => {
      const i = cur.findIndex((c) => c.partId === partId && c.vehicleId === vehicleId)
      if (i < 0) return [...cur, { vehicleId, partId, qty }]
      const next = [...cur]
      next[i] = { ...next[i], qty: Math.min(99, next[i].qty + qty) }
      return next
    })
  }, [])

  const setQty = useCallback((vehicleId: string, partId: string, qty: number) => {
    setItems((cur) =>
      qty <= 0
        ? cur.filter((c) => !(c.partId === partId && c.vehicleId === vehicleId))
        : cur.map((c) => (c.partId === partId && c.vehicleId === vehicleId ? { ...c, qty: Math.min(99, qty) } : c)),
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])
  const count = items.reduce((s, i) => s + i.qty, 0)

  return { items, add, setQty, clear, count }
}

export function useReducedMotion() {
  const [r, setR] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return
    const fn = () => setR(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return r
}
