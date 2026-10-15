import { useEffect, useRef, useState } from 'react'
import { asCatalogVehicle, exampleVehicle, matchVehicle } from '../data/match'
import { formatPlate } from '../providers'
import { FIPE_TIPOS, fipeAnos, fipeMarcas, fipeModelos, fipeVeiculo, type FipeItem, type FipeTipo } from '../providers/fipe'
import type { VehicleInfo } from '../types'
import { Icon } from './icons'

export type LookupState =
  | { status: 'loading'; plate: string }
  | { status: 'found'; plate: string; vehicle: VehicleInfo }
  | { status: 'notfound'; plate: string; demo: boolean }
  | { status: 'error'; plate: string }

interface Props {
  state: LookupState | null
  onClose: () => void
  onOpenVehicle: (v: VehicleInfo) => void
  onPicked: (v: VehicleInfo) => void
  /** para onde o foco volta ao fechar (o botão de busca fica desabilitado enquanto consulta) */
  returnFocus?: () => void
}

const WIDE = new Set(['Marca', 'Modelo', 'Valor FIPE'])

const KIND_LABEL = { carro: 'Carro / utilitário', moto: 'Moto', caminhao: 'Caminhão', onibus: 'Ônibus', trator: 'Trator' }

export function VehicleModal({ state, onClose, onOpenVehicle, onPicked, returnFocus }: Props) {
  const back = useRef(returnFocus)
  back.current = returnFocus
  const box = useRef<HTMLDivElement>(null)
  const open = state !== null

  // foco preso dentro do modal, Esc fecha, foco volta para quem abriu
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    box.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !box.current) return
      const f = [...box.current.querySelectorAll<HTMLElement>('button, select, input, a[href], [tabindex]:not([tabindex="-1"])')].filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
      )
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === box.current)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('no-scroll')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('no-scroll')
      if (back.current) back.current()
      else prev?.focus?.()
    }
  }, [open, onClose])

  if (!state) return null
  const plate = formatPlate(state.plate)

  return (
    <div className="modal-layer">
      <div className="scrim on" onClick={onClose} aria-hidden="true" />
      <div ref={box} className="modal" role="dialog" aria-modal="true" aria-labelledby="vm-title" aria-describedby="vm-desc" tabIndex={-1}>
        <header className="modal-head">
          <span className="mini-plate">{plate}</span>
          <h2 id="vm-title">{state.status === 'found' ? (state.vehicle.source === 'fipe' ? 'Veículo informado' : 'Veículo da placa') : state.status === 'loading' ? 'Consultando placa' : 'Informe o veículo'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar">
            <Icon name="close" />
          </button>
        </header>

        <div className="modal-body" aria-live="polite">
          {state.status === 'loading' && (
            <div className="vm-loading" id="vm-desc">
              <span className="spinner" aria-hidden="true" /> Buscando os dados de {plate}…
            </div>
          )}

          {state.status === 'found' && <Found v={state.vehicle} onOpenVehicle={onOpenVehicle} onClose={onClose} />}

          {(state.status === 'notfound' || state.status === 'error') && (
            <>
              <p id="vm-desc" className="vm-explain">
                {state.status === 'error'
                  ? 'A consulta da placa falhou agora. '
                  : state.demo
                    ? `${plate} não é uma placa de exemplo, e este protótipo ainda não consulta placa real: os sites gratuitos bloqueiam consulta automatizada e as bases oficiais são pagas ou exigem convênio. `
                    : `Não achamos ${plate} na consulta. `}
                Informe o veículo abaixo e buscamos os dados na Tabela FIPE.
              </p>
              <FipePicker plate={state.plate} onPicked={onPicked} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Found({ v, onOpenVehicle, onClose }: { v: VehicleInfo; onOpenVehicle: (v: VehicleInfo) => void; onClose: () => void }) {
  const match = matchVehicle(v)
  const kind = v.kind ?? match?.model.kind
  const ex = exampleVehicle()
  const yearTxt = v.yearFab && v.yearFab !== v.year ? `${v.yearFab}/${v.year}` : String(v.year)
  const place = [v.city, v.uf].filter(Boolean).join(' / ')
  const rows: [string, string | undefined][] = [
    ['Marca', v.brand],
    ['Modelo', v.model],
    [v.yearFab ? 'Ano fab./modelo' : 'Ano modelo', yearTxt],
    ['Tipo', kind ? KIND_LABEL[kind] : undefined],
    ['Cor', v.color],
    ['Combustível', v.fuel],
    ['Motor', v.engine || undefined],
    ['Cidade / UF', place || undefined],
    ['Código FIPE', v.fipeCode],
    ['Valor FIPE', v.fipeValue ? `${v.fipeValue}${v.fipeMonth ? ` (${v.fipeMonth})` : ''}` : undefined],
  ]

  const shown = rows.filter(([, val]) => val)
  // marca, modelo e valor ocupam a linha toda; se sobrar meia célula, ela também, para não ficar buraco
  const halves = shown.filter(([k]) => !WIDE.has(k))
  const oddLast = halves.length % 2 ? halves.at(-1)![0] : null

  return (
    <>
      <dl className="vm-data" id="vm-desc">
        {shown.map(([k, val]) => (
            <div key={k} className={WIDE.has(k) || k === oddLast ? 'wide' : undefined}>
              <dt>{k}</dt>
              <dd>{val}</dd>
            </div>
          ))}
      </dl>
      <p className="vm-source small">
        <Icon name="info" size={14} />
        <span>
          Fonte: {v.sourceName ?? 'consulta'}
          {v.source === 'demo' && <span className="tag tag-demo">exemplo</span>}
          {v.source === 'fipe' && <span className="tag tag-real">FIPE real</span>}
          <br />
          Dados públicos do veículo, sem dados do proprietário.
        </span>
      </p>

      {match ? (
        <div className="vm-fit ok">
          <p>
            {match.exact ? (
              <>
                <b>A Hübner tem peças para este veículo.</b> Veja na vista 3D o que encaixa.
              </>
            ) : (
              <>
                <b>A Hübner fabrica peças para {kind === 'onibus' ? 'ônibus' : kind === 'trator' ? 'tratores' : 'caminhões'}.</b> O 3D mostra um{' '}
                {match.model.brand} {match.model.model} de exemplo, não o seu modelo exato.
              </>
            )}
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => onOpenVehicle(match.exact ? v : asCatalogVehicle(match.model))}>
            <Icon name="cube" /> {match.exact ? 'Ver peças em 3D' : 'Ver peças em 3D (exemplo)'}
          </button>
        </div>
      ) : (
        <div className="vm-fit">
          <p>
            <b>Não temos peça para este veículo.</b> A Hübner fabrica para veículos pesados e montadoras (caminhão, ônibus, trator), não para
            {kind === 'moto' ? ' moto' : ' carro de passeio'}.
          </p>
          <div className="vm-actions">
            {ex && (
              <button className="btn btn-secondary" onClick={() => onOpenVehicle(asCatalogVehicle(ex))}>
                <Icon name="cube" /> Ver exemplo de {ex.kind === 'caminhao' ? 'caminhão' : ex.kind}
              </button>
            )}
            <button className="btn btn-ghost" onClick={onClose}>
              Buscar outra placa
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function FipePicker({ plate, onPicked }: { plate: string; onPicked: (v: VehicleInfo) => void }) {
  const [tipo, setTipo] = useState<FipeTipo>('caminhoes')
  const [marcas, setMarcas] = useState<FipeItem[]>([])
  const [marca, setMarca] = useState('')
  const [modelos, setModelos] = useState<FipeItem[]>([])
  const [modelo, setModelo] = useState('')
  const [anos, setAnos] = useState<FipeItem[]>([])
  const [ano, setAno] = useState('')
  const [busy, setBusy] = useState<'' | 'marcas' | 'modelos' | 'anos' | 'valor'>('')
  const [err, setErr] = useState('')

  // cada etapa carrega a seguinte; trocar uma etapa limpa as de baixo
  useEffect(() => {
    const ac = new AbortController()
    setMarcas([]), setMarca(''), setModelos([]), setModelo(''), setAnos([]), setAno(''), setErr('')
    setBusy('marcas')
    fipeMarcas(tipo, ac.signal)
      .then(setMarcas)
      .catch((e) => !ac.signal.aborted && setErr(msg(e)))
      .finally(() => !ac.signal.aborted && setBusy(''))
    return () => ac.abort()
  }, [tipo])

  useEffect(() => {
    setModelos([]), setModelo(''), setAnos([]), setAno('')
    if (!marca) return
    const ac = new AbortController()
    setBusy('modelos')
    fipeModelos(tipo, marca, ac.signal)
      .then(setModelos)
      .catch((e) => !ac.signal.aborted && setErr(msg(e)))
      .finally(() => !ac.signal.aborted && setBusy(''))
    return () => ac.abort()
  }, [tipo, marca])

  useEffect(() => {
    setAnos([]), setAno('')
    if (!modelo) return
    const ac = new AbortController()
    setBusy('anos')
    fipeAnos(tipo, marca, modelo, ac.signal)
      .then((a) => {
        setAnos(a)
        if (a.length === 1) setAno(a[0].codigo)
      })
      .catch((e) => !ac.signal.aborted && setErr(msg(e)))
      .finally(() => !ac.signal.aborted && setBusy(''))
    return () => ac.abort()
  }, [tipo, marca, modelo])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!ano) return
    setBusy('valor')
    setErr('')
    try {
      onPicked(await fipeVeiculo(tipo, marca, modelo, ano, plate))
    } catch (e) {
      setErr(msg(e))
      setBusy('')
    }
  }

  return (
    <form className="manual vm-picker" onSubmit={submit} aria-busy={busy !== ''}>
      <fieldset className="seg">
        <legend className="sr-only">Tipo de veículo</legend>
        {FIPE_TIPOS.map((t) => (
          <label key={t.id} className={tipo === t.id ? 'on' : ''}>
            <input type="radio" name="fipe-tipo" value={t.id} checked={tipo === t.id} onChange={() => setTipo(t.id)} />
            {t.label}
          </label>
        ))}
      </fieldset>
      <label>
        Marca
        <select value={marca} onChange={(e) => setMarca(e.target.value)} disabled={!marcas.length}>
          <option value="">{busy === 'marcas' ? 'Carregando marcas…' : 'Escolha a marca'}</option>
          {marcas.map((m) => (
            <option key={m.codigo} value={m.codigo}>
              {m.nome}
            </option>
          ))}
        </select>
      </label>
      <label>
        Modelo
        <select value={modelo} onChange={(e) => setModelo(e.target.value)} disabled={!modelos.length}>
          <option value="">{busy === 'modelos' ? 'Carregando modelos…' : marca ? 'Escolha o modelo' : 'Escolha a marca primeiro'}</option>
          {modelos.map((m) => (
            <option key={m.codigo} value={m.codigo}>
              {m.nome}
            </option>
          ))}
        </select>
      </label>
      <label>
        Ano e combustível
        <select value={ano} onChange={(e) => setAno(e.target.value)} disabled={!anos.length}>
          <option value="">{busy === 'anos' ? 'Carregando anos…' : modelo ? 'Escolha o ano' : 'Escolha o modelo primeiro'}</option>
          {anos.map((a) => (
            <option key={a.codigo} value={a.codigo}>
              {a.nome.replace(/^32000/, 'Zero km')}
            </option>
          ))}
        </select>
      </label>
      {err && (
        <p className="form-msg error" role="alert">
          {err}. Tente de novo em instantes.
        </p>
      )}
      <button className="btn btn-primary" type="submit" disabled={!ano || busy === 'valor'}>
        {busy === 'valor' ? (
          <>
            <span className="spinner" aria-hidden="true" /> Buscando na FIPE…
          </>
        ) : (
          'Ver dados do veículo'
        )}
      </button>
    </form>
  )
}

const msg = (e: unknown) => (e instanceof Error && /Limite/.test(e.message) ? e.message : 'Não conseguimos falar com a Tabela FIPE')
