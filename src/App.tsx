import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { getPart, getVehicle } from './data/catalog'
import { formatPlate } from './providers'
import { useCart, useReducedMotion } from './store'
import type { Part, VehicleInfo } from './types'
import { CartDrawer } from './ui/Cart'
import { CategoryView } from './ui/CategoryView'
import { Icon } from './ui/icons'
import { PartPanel } from './ui/PartPanel'
import { PlateSearch } from './ui/PlateSearch'
import type { ViewerHandle } from './three/Viewer3D'

const Viewer3D = lazy(() => import('./three/Viewer3D'))

export default function App() {
  const [vehicle, setVehicle] = useState<VehicleInfo | null>(null)
  const [tab, setTab] = useState<'3d' | 'lista'>('3d')
  const [selected, setSelected] = useState<string | null>(null)
  const [exploded, setExploded] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const cart = useCart()
  const reducedMotion = useReducedMotion()
  const viewer = useRef<ViewerHandle>(null)

  const model = vehicle ? getVehicle(vehicle.vehicleId) : undefined
  const part = vehicle && selected ? getPart(vehicle.vehicleId, selected) : undefined

  // ao abrir um veículo, ele chega montado e "explode" sozinho logo depois
  useEffect(() => {
    if (!vehicle) return
    setExploded(0)
    setSelected(null)
    const t = window.setTimeout(() => setExploded(1), reducedMotion ? 0 : 900)
    return () => window.clearTimeout(t)
  }, [vehicle, reducedMotion])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2400)
    return () => window.clearTimeout(t)
  }, [toast])

  const add = useCallback(
    (p: Part, qty: number) => {
      if (!vehicle) return
      cart.add(vehicle.vehicleId, p.id, qty)
      setToast(`${qty} × ${p.name} no carrinho`)
    },
    [cart, vehicle],
  )

  const closePart = useCallback(() => setSelected(null), [])
  const hubnerCount = model?.parts.filter((p) => p.hubner).length ?? 0

  return (
    <div className="app">
      <div className="demo-bar" role="note">
        Demonstração · placas, códigos, preços e disponibilidade são <b>dados de exemplo</b>
      </div>

      <header className="topbar">
        <button className="brand" onClick={() => setVehicle(null)} aria-label="Encaixe, voltar ao início">
          <span className="logo" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="28" height="28">
              <path d="M4 10l12-6 12 6v12l-12 6-12-6z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
              <path d="M16 16l12-6M16 16v12M16 16L4 10" stroke="currentColor" strokeWidth="2.2" opacity=".45" />
              <circle cx="16" cy="16" r="3.2" fill="var(--accent)" />
            </svg>
          </span>
          <span className="brand-name">Encaixe</span>
          <span className="brand-sub">peças Hübner</span>
        </button>
        <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label={`Abrir carrinho, ${cart.count} itens`}>
          <Icon name="cart" />
          <span className="cart-label">Carrinho</span>
          {cart.count > 0 && (
            <span className="badge" key={cart.count} data-testid="cart-count">
              {cart.count}
            </span>
          )}
        </button>
      </header>

      {!vehicle || !model ? (
        <main className="home">
          <PlateSearch onFound={setVehicle} />
          <ul className="how" aria-label="Como funciona">
            <li>
              <span>1</span>
              <div>
                <b>Placa</b>
                <p>Identifica marca, modelo, ano e motor.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <b>Vista explodida</b>
                <p>Em laranja, o que a Hübner fabrica. Em cinza, o resto.</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <b>Pedido</b>
                <p>Escolha a quantidade e feche o pedido com o distribuidor.</p>
              </div>
            </li>
          </ul>
        </main>
      ) : (
        <main className="vehicle-page">
          <section className="vehicle-bar" aria-label="Veículo identificado">
            <div className="vb-main">
              {vehicle.plate && <span className="mini-plate">{formatPlate(vehicle.plate)}</span>}
              <div>
                <h1>
                  {vehicle.brand} {vehicle.model}
                </h1>
                <p className="muted small">
                  {vehicle.year} · {vehicle.engine} · <b className="accent-text">{hubnerCount} peças Hübner</b>
                  {vehicle.source !== 'api' && <span className="tag tag-demo">exemplo</span>}
                </p>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setVehicle(null)}>
              Trocar veículo
            </button>
          </section>

          <div className="tabs" role="tablist" aria-label="Modo de navegação">
            <button role="tab" aria-selected={tab === '3d'} className={tab === '3d' ? 'on' : ''} onClick={() => setTab('3d')}>
              <Icon name="cube" size={18} /> Vista 3D
            </button>
            <button role="tab" aria-selected={tab === 'lista'} className={tab === 'lista' ? 'on' : ''} onClick={() => setTab('lista')}>
              <Icon name="grid" size={18} /> Por categoria
            </button>
          </div>

          {tab === '3d' ? (
            <section className="stage-wrap">
              <div className="stage" data-testid="stage">
                <Suspense
                  fallback={
                    <div className="stage-loading">
                      <span className="spinner" /> Montando o veículo em 3D…
                    </div>
                  }
                >
                  <Viewer3D
                    ref={viewer}
                    vehicle={model}
                    exploded={exploded}
                    autoRotate={autoRotate && !selected}
                    selectedId={selected}
                    onSelect={setSelected}
                    reducedMotion={reducedMotion}
                  />
                </Suspense>

                <div className="legend" aria-label="Legenda">
                  <span>
                    <i className="dot on" /> Hübner · toque para ver
                  </span>
                  <span>
                    <i className="dot off" /> Fora do catálogo
                  </span>
                </div>

                <div className="controls" role="toolbar" aria-label="Controles da vista 3D">
                  <button className="ctl primary" onClick={() => setExploded((e) => (e > 0.5 ? 0 : 1))} aria-pressed={exploded > 0.5}>
                    <Icon name={exploded > 0.5 ? 'assemble' : 'explode'} size={18} />
                    {exploded > 0.5 ? 'Montar' : 'Explodir'}
                  </button>
                  <label className="ctl slider">
                    <span className="sr-only">Nível de explosão</span>
                    <input type="range" min={0} max={1} step={0.01} value={exploded} onChange={(e) => setExploded(Number(e.target.value))} />
                  </label>
                  <button className={`ctl ${autoRotate ? 'active' : ''}`} onClick={() => setAutoRotate((a) => !a)} aria-pressed={autoRotate} aria-label="Girar automaticamente">
                    <Icon name="rotate" size={18} />
                  </button>
                  <button
                    className="ctl"
                    onClick={() => {
                      setSelected(null)
                      viewer.current?.resetCamera()
                    }}
                    aria-label="Centralizar câmera"
                  >
                    <Icon name="center" size={18} />
                  </button>
                </div>
                <p className="hint small">Arraste para girar · pinça ou roda para zoom</p>
              </div>

              {/* lista acessível das peças clicáveis (teclado e leitor de tela) */}
              <div className="quick-parts" aria-label="Peças Hübner deste veículo">
                {model.parts
                  .filter((p) => p.hubner)
                  .map((p) => (
                    <button key={p.id} className={`qp ${selected === p.id ? 'on' : ''}`} onClick={() => setSelected(p.id)}>
                      <Icon name={p.icon} size={16} /> {p.name}
                    </button>
                  ))}
              </div>
            </section>
          ) : (
            <CategoryView model={model} onOpen={(p) => setSelected(p.id)} onAdd={(p) => add(p, 1)} />
          )}

          {part && part.hubner && <PartPanel part={part} vehicle={vehicle} model={model} onClose={closePart} onAdd={(q) => add(part, q)} />}
        </main>
      )}

      <CartDrawer open={cartOpen} items={cart.items} onClose={() => setCartOpen(false)} setQty={cart.setQty} clear={cart.clear} />

      <div className={`toast ${toast ? 'on' : ''}`} role="status" aria-live="polite">
        {toast && (
          <>
            <Icon name="check" size={18} /> {toast}
            <button className="link-btn" onClick={() => setCartOpen(true)}>
              Ver carrinho
            </button>
          </>
        )}
      </div>

      <footer className="foot small muted">
        Protótipo independente feito pela Stars Aceleradora para conversa com o Grupo Hübner. Não é site oficial da Hübner.
      </footer>
    </div>
  )
}
