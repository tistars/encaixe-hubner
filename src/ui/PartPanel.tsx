import { useEffect, useRef, useState } from 'react'
import { brl, categoryName } from '../data/catalog'
import type { Part, VehicleInfo, VehicleModel } from '../types'
import { Icon } from './icons'

interface Props {
  part: Part
  vehicle: VehicleInfo
  model: VehicleModel
  onClose: () => void
  onAdd: (qty: number) => void
}

export function QtyStepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="qty" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} aria-label="Diminuir quantidade" disabled={value <= 1}>
        <Icon name="minus" size={16} />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(Math.min(99, value + 1))} aria-label="Aumentar quantidade">
        <Icon name="plus" size={16} />
      </button>
    </div>
  )
}

export function PartPanel({ part, vehicle, model, onClose, onAdd }: Props) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setQty(1)
    setAdded(false)
    closeRef.current?.focus({ preventScroll: true })
  }, [part.id])

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])

  return (
    <aside className="sheet part-panel" role="dialog" aria-modal="false" aria-labelledby="part-title">
      <div className="sheet-grip" aria-hidden="true" />
      <header className="part-head">
        <div className="part-icon" aria-hidden="true">
          <Icon name={part.icon} size={34} />
        </div>
        <div>
          <p className="eyebrow">{categoryName(part.category)}</p>
          <h2 id="part-title">{part.name}</h2>
          <p className="code">
            Código <b>{part.code}</b> <span className="tag tag-demo">exemplo</span>
          </p>
        </div>
        <button ref={closeRef} className="icon-btn" onClick={onClose} aria-label="Fechar detalhes da peça">
          <Icon name="close" />
        </button>
      </header>

      {part.description && <p className="part-desc">{part.description}</p>}

      <dl className="facts">
        <div>
          <dt>Compatibilidade</dt>
          <dd>
            {model.brand} {model.model} · {model.years[0]}–{model.years.at(-1)}
            <span className="tag tag-demo">exemplo</span>
            {vehicle.year && <small className="muted">Seu veículo: {vehicle.year}, {vehicle.engine}</small>}
          </dd>
        </div>
        <div>
          <dt>Disponibilidade</dt>
          <dd>
            <span className={`avail ${part.availability}`}>{part.availability === 'linha' ? 'Em linha' : 'Sob encomenda'}</span>
            <span className="tag tag-demo">exemplo · não é estoque real</span>
          </dd>
        </div>
        <div>
          <dt>Família de produto</dt>
          <dd>
            {part.realFamily ? (
              <>
                {part.realFamily} <span className="tag tag-real">público</span>
              </>
            ) : (
              <>
                Família presumida para a demonstração <span className="tag tag-demo">exemplo</span>
              </>
            )}
          </dd>
        </div>
        {part.price != null && (
          <div>
            <dt>Preço</dt>
            <dd>
              <b className="price">{brl(part.price)}</b> <span className="tag tag-demo">exemplo</span>
            </dd>
          </div>
        )}
      </dl>

      <div className="buy-row">
        <QtyStepper value={qty} onChange={setQty} label={`Quantidade de ${part.name}`} />
        <button
          className={`btn btn-primary grow ${added ? 'is-added' : ''}`}
          onClick={() => {
            onAdd(qty)
            setAdded(true)
            window.setTimeout(() => setAdded(false), 1600)
          }}
        >
          {added ? (
            <>
              <Icon name="check" /> Adicionado
            </>
          ) : (
            <>
              <Icon name="cart" /> Adicionar ao carrinho
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
