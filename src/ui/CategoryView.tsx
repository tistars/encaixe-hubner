import { useMemo, useState } from 'react'
import { brl, CATEGORIES, categoryName } from '../data/catalog'
import type { CategoryId, Part, VehicleModel } from '../types'
import { Icon } from './icons'

const plural = (n: number) => `${n} ${n === 1 ? 'peça' : 'peças'}`

interface Props {
  model: VehicleModel
  onOpen: (p: Part) => void
  onAdd: (p: Part) => void
}

export function CategoryView({ model, onOpen, onAdd }: Props) {
  const [cat, setCat] = useState<CategoryId | 'todas'>('todas')
  const [q, setQ] = useState('')
  const [onlyHubner, setOnlyHubner] = useState(true)

  const counts = useMemo(() => {
    const m = new Map<string, number>()
    for (const p of model.parts) if (p.hubner) m.set(p.category, (m.get(p.category) ?? 0) + 1)
    return m
  }, [model])

  const list = model.parts
    .filter((p) => (cat === 'todas' ? true : p.category === cat))
    .filter((p) => (onlyHubner ? p.hubner : true))
    .filter((p) => (q ? (p.name + ' ' + (p.code ?? '')).toLowerCase().includes(q.toLowerCase()) : true))
    .sort((a, b) => Number(b.hubner) - Number(a.hubner))

  const cats = CATEGORIES.filter((c) => model.parts.some((p) => p.category === c.id))

  return (
    <section className="catalog" aria-label="Peças por categoria">
      <div className="cat-grid" role="tablist" aria-label="Categorias">
        <button role="tab" aria-selected={cat === 'todas'} className={`cat ${cat === 'todas' ? 'on' : ''}`} onClick={() => setCat('todas')}>
          <span className="cat-icon">
            <Icon name="grid" size={26} />
          </span>
          <span className="cat-name">Todas</span>
          <span className="cat-count">{plural([...counts.values()].reduce((a, b) => a + b, 0))}</span>
        </button>
        {cats.map((c) => (
          <button key={c.id} role="tab" aria-selected={cat === c.id} className={`cat ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}>
            <span className="cat-icon">
              <Icon name={c.icon} size={26} />
            </span>
            <span className="cat-name">{c.name}</span>
            <span className="cat-count">{plural(counts.get(c.id) ?? 0)}</span>
          </button>
        ))}
      </div>

      <div className="filters">
        <label className="search">
          <Icon name="search" size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou código" aria-label="Buscar peça" />
        </label>
        <label className="toggle">
          <input type="checkbox" checked={onlyHubner} onChange={(e) => setOnlyHubner(e.target.checked)} />
          <span>Só peças Hübner</span>
        </label>
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <p>
            <b>Nenhuma peça aqui</b>
          </p>
          <p className="muted small">
            {onlyHubner ? 'A Hübner não tem peça desta categoria para este veículo na demonstração.' : 'Tente outra busca.'}
          </p>
        </div>
      ) : (
        <ul className="part-list">
          {list.map((p) => (
            <li key={p.id} className={`part-card ${p.hubner ? '' : 'off'}`}>
              <button className="part-card-main" disabled={!p.hubner} onClick={() => onOpen(p)} aria-label={p.hubner ? `Ver ${p.name}` : `${p.name}: fora do catálogo Hübner`}>
                <span className="part-icon" aria-hidden="true">
                  <Icon name={p.icon} size={26} />
                </span>
                <span className="pc-text">
                  <span className="pc-cat">{categoryName(p.category)}</span>
                  <b>{p.name}</b>
                  {p.hubner ? (
                    <span className="small muted">
                      {p.code} · <span className={`avail ${p.availability}`}>{p.availability === 'linha' ? 'Em linha' : 'Sob encomenda'}</span>
                    </span>
                  ) : (
                    <span className="small muted">Fora do catálogo Hübner</span>
                  )}
                </span>
              </button>
              {p.hubner && (
                <div className="pc-buy">
                  <b>{brl(p.price ?? 0)}</b>
                  <button className="btn btn-primary btn-sm" onClick={() => onAdd(p)} aria-label={`Adicionar ${p.name} ao carrinho`}>
                    <Icon name="plus" size={16} /> Adicionar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <p className="muted small center">Códigos, preços e disponibilidade são dados de exemplo.</p>
    </section>
  )
}
