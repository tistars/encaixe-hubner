import { useEffect, useRef, useState } from 'react'
import { brl, getPart, getVehicle } from '../data/catalog'
import type { CartItem } from '../types'
import { Icon } from './icons'
import { QtyStepper } from './PartPanel'

interface Props {
  open: boolean
  items: CartItem[]
  onClose: () => void
  setQty: (vehicleId: string, partId: string, qty: number) => void
  clear: () => void
}

export function CartDrawer({ open, items, onClose, setQty, clear }: Props) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'done'>('cart')
  const [order, setOrder] = useState('')
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      panel.current?.focus()
      if (step === 'done') setStep('cart')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])

  const rows = items
    .map((i) => ({ ...i, part: getPart(i.vehicleId, i.partId), vehicle: getVehicle(i.vehicleId) }))
    .filter((r) => r.part)
  const total = rows.reduce((s, r) => s + (r.part!.price ?? 0) * r.qty, 0)

  return (
    <>
      <div className={`scrim ${open ? 'on' : ''}`} onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        className={`drawer ${open ? 'on' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
        hidden={!open}
      >
        <header className="drawer-head">
          {step === 'checkout' ? (
            <button className="icon-btn" onClick={() => setStep('cart')} aria-label="Voltar ao carrinho">
              <Icon name="back" />
            </button>
          ) : null}
          <h2 id="cart-title">{step === 'cart' ? 'Carrinho' : step === 'checkout' ? 'Finalizar pedido' : 'Pedido enviado'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar carrinho">
            <Icon name="close" />
          </button>
        </header>

        {step === 'cart' && (
          <>
            {rows.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">
                  <Icon name="cart" size={36} />
                </div>
                <p>
                  <b>Carrinho vazio</b>
                </p>
                <p className="muted small">Toque numa peça em destaque na vista 3D ou escolha por categoria.</p>
                <button className="btn btn-secondary" onClick={onClose}>
                  Ver peças
                </button>
              </div>
            ) : (
              <>
                <ul className="cart-list">
                  {rows.map((r) => (
                    <li key={r.vehicleId + r.partId} className="cart-row">
                      <div className="part-icon sm" aria-hidden="true">
                        <Icon name={r.part!.icon} size={22} />
                      </div>
                      <div className="cart-info">
                        <b>{r.part!.name}</b>
                        <span className="muted small">
                          {r.part!.code} · {r.vehicle?.brand} {r.vehicle?.model}
                        </span>
                        <span className="small">{brl((r.part!.price ?? 0) * r.qty)}</span>
                      </div>
                      <div className="cart-actions">
                        <QtyStepper value={r.qty} onChange={(n) => setQty(r.vehicleId, r.partId, n)} label={`Quantidade de ${r.part!.name}`} />
                        <button className="icon-btn danger" onClick={() => setQty(r.vehicleId, r.partId, 0)} aria-label={`Remover ${r.part!.name}`}>
                          <Icon name="trash" size={18} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <footer className="drawer-foot">
                  <div className="total">
                    <span>Total</span>
                    <b data-testid="cart-total">{brl(total)}</b>
                  </div>
                  <p className="muted small">Preços de exemplo. Nenhum valor real da Hübner.</p>
                  <button className="btn btn-primary btn-lg" onClick={() => setStep('checkout')}>
                    Finalizar pedido
                  </button>
                </footer>
              </>
            )}
          </>
        )}

        {step === 'checkout' && (
          <form
            className="checkout"
            onSubmit={(e) => {
              e.preventDefault()
              setOrder('DEMO-' + Math.random().toString(36).slice(2, 7).toUpperCase())
              setStep('done')
              clear()
            }}
          >
            <div className="notice">
              <Icon name="info" size={18} /> Checkout de demonstração: nada é cobrado e nenhum pedido chega à Hübner.
            </div>
            <label>
              Nome
              <input required autoComplete="name" name="nome" />
            </label>
            <label>
              Empresa / oficina
              <input autoComplete="organization" name="empresa" />
            </label>
            <label>
              E-mail
              <input required type="email" autoComplete="email" name="email" />
            </label>
            <label>
              Entrega
              <select name="entrega" defaultValue="retirar">
                <option value="retirar">Retirar no distribuidor</option>
                <option value="transportadora">Transportadora</option>
              </select>
            </label>
            <div className="total">
              <span>{rows.reduce((s, r) => s + r.qty, 0)} itens</span>
              <b>{brl(total)}</b>
            </div>
            <button className="btn btn-primary btn-lg" type="submit">
              Confirmar pedido de demonstração
            </button>
          </form>
        )}

        {step === 'done' && (
          <div className="empty done">
            <div className="empty-icon ok">
              <Icon name="check" size={36} />
            </div>
            <p>
              <b>Pedido {order} registrado</b>
            </p>
            <p className="muted small">É uma simulação: nenhum pagamento foi feito e nada foi enviado. Num app real, aqui o pedido iria para o distribuidor.</p>
            <button className="btn btn-secondary" onClick={onClose}>
              Voltar às peças
            </button>
          </div>
        )}
      </div>
    </>
  )
}
