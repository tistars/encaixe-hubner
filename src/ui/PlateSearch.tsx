import { useMemo, useState } from 'react'
import { DEMO_PLATES, formatPlate, isValidPlate, normalizePlate, plateProvider } from '../providers'
import { ENABLED_VEHICLES, VEHICLES } from '../data/catalog'
import type { VehicleInfo } from '../types'
import { Icon } from './icons'

interface Props {
  onFound: (v: VehicleInfo) => void
  initialPlate?: string
}

export function PlateSearch({ onFound, initialPlate = '' }: Props) {
  const [plate, setPlate] = useState(initialPlate)
  const [state, setState] = useState<'idle' | 'loading' | 'notfound' | 'invalid' | 'error'>('idle')
  const [manual, setManual] = useState(false)

  const examples = Object.entries(DEMO_PLATES).filter(([, v]) => ENABLED_VEHICLES.includes(v.vehicleId))

  async function search(raw = plate) {
    const p = normalizePlate(raw)
    setPlate(p)
    if (!isValidPlate(p)) return setState('invalid')
    setState('loading')
    try {
      const v = await plateProvider.lookup(p)
      if (!v || !ENABLED_VEHICLES.includes(v.vehicleId)) return setState('notfound')
      setState('idle')
      onFound(v)
    } catch {
      setState('error')
    }
  }

  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="eyebrow">Peças por placa · Grupo Hübner</p>
      <h1 id="hero-title">
        Digite a placa.
        <br />
        <span className="grad">Veja a peça que encaixa.</span>
      </h1>
      <p className="lead">O veículo aparece em 3D, desmontado. O que a Hübner fabrica para ele fica em destaque: toque e adicione ao pedido.</p>

      <form
        className="plate-form"
        onSubmit={(e) => {
          e.preventDefault()
          search()
        }}
      >
        <label className="plate" htmlFor="placa">
          <span className="plate-band" aria-hidden="true">
            <span>BRASIL</span>
            <span className="flag" />
          </span>
          <input
            id="placa"
            value={plate}
            onChange={(e) => {
              setPlate(e.target.value.toUpperCase().slice(0, 8))
              if (state !== 'loading') setState('idle')
            }}
            placeholder="ABC1D23"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            inputMode="text"
            maxLength={8}
            aria-label="Placa do veículo"
            aria-invalid={state === 'invalid'}
            aria-describedby="placa-msg"
          />
        </label>
        <button className="btn btn-primary btn-lg" type="submit" disabled={state === 'loading'}>
          {state === 'loading' ? (
            <>
              <span className="spinner" aria-hidden="true" /> Consultando…
            </>
          ) : (
            <>
              <Icon name="search" /> Buscar peças
            </>
          )}
        </button>
      </form>

      <p id="placa-msg" className={`form-msg ${state}`} role="status" aria-live="polite">
        {state === 'invalid' && 'Placa inválida. Use o formato ABC1234 ou ABC1D23.'}
        {state === 'notfound' && `Não achamos ${formatPlate(plate)} na base de demonstração. Use uma placa de exemplo ou informe o veículo.`}
        {state === 'error' && 'A consulta falhou. Tente de novo ou informe o veículo manualmente.'}
      </p>

      <div className="examples">
        <span className="muted small">Placas de exemplo:</span>
        {examples.map(([p, v]) => (
          <button key={p} type="button" className="chip" onClick={() => search(p)} title={`${v.brand} ${v.model}`}>
            <b>{formatPlate(p)}</b>
            <span>{v.model.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      <button type="button" className="link-btn" onClick={() => setManual((m) => !m)} aria-expanded={manual}>
        {manual ? 'Fechar' : 'Sem placa? Informe marca, modelo e ano'}
      </button>
      {manual && <ManualPicker onPick={onFound} />}

      <p className="provider-note small muted">
        <Icon name="info" size={14} /> Fonte da placa: {plateProvider.name}
        {plateProvider.isDemo && ' — sem consulta a base oficial.'}
      </p>
    </section>
  )
}

function ManualPicker({ onPick }: { onPick: (v: VehicleInfo) => void }) {
  const list = VEHICLES.filter((v) => ENABLED_VEHICLES.includes(v.id))
  const brands = [...new Set(list.map((v) => v.brand))]
  const [brand, setBrand] = useState(brands[0])
  const models = useMemo(() => list.filter((v) => v.brand === brand), [brand, list])
  const [modelId, setModelId] = useState(models[0]?.id)
  const model = list.find((v) => v.id === modelId) ?? models[0]
  const [year, setYear] = useState(model?.years.at(-1))

  return (
    <form
      className="manual"
      onSubmit={(e) => {
        e.preventDefault()
        if (!model || !year) return
        onPick({ brand: model.brand, model: model.model, year, engine: model.engine, vehicleId: model.id, source: 'manual' })
      }}
    >
      <label>
        Marca
        <select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value)
            const m = list.find((v) => v.brand === e.target.value)
            setModelId(m?.id)
            setYear(m?.years.at(-1))
          }}
        >
          {brands.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </label>
      <label>
        Modelo
        <select
          value={model?.id}
          onChange={(e) => {
            setModelId(e.target.value)
            setYear(list.find((v) => v.id === e.target.value)?.years.at(-1))
          }}
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.model}
            </option>
          ))}
        </select>
      </label>
      <label>
        Ano
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {model?.years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </label>
      <button className="btn btn-secondary" type="submit">
        Ver peças
      </button>
    </form>
  )
}
