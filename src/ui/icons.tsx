import type { SVGProps } from 'react'

/* Ícones próprios (traço 1.75, 24×24). Desenhados para este projeto — licença MIT do repositório. */

type P = SVGProps<SVGSVGElement> & { name: string; size?: number }

const paths: Record<string, React.ReactNode> = {
  motor: (
    <>
      <path d="M5 9h3l2-2h5l1 2h2v3h2v-2h1v6h-1v-2h-2v3h-3l-2 2H8l-1-2H5z" />
      <path d="M3 11v4M9 4h5M11.5 4v3" />
    </>
  ),
  cabecote: (
    <>
      <rect x="3" y="10" width="18" height="6" rx="1" />
      <path d="M6 10V7M10 10V7M14 10V7M18 10V7M5 16v3h14v-3" />
    </>
  ),
  carter: (
    <>
      <path d="M3 7h18M4 7l1 5h9l1 5h4l1-10" />
      <circle cx="17" cy="17" r="0.8" />
    </>
  ),
  volante: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1 1M17.4 17.4l1 1M5.6 18.4l1-1M17.4 6.6l1-1" />
    </>
  ),
  arrefecimento: (
    <>
      <path d="M12 3v12" />
      <circle cx="12" cy="17.5" r="3.5" />
      <path d="M12 6h3M12 9h2M12 12h3" />
    </>
  ),
  transmissao: (
    <>
      <circle cx="8" cy="9" r="4" />
      <circle cx="16.5" cy="15.5" r="3" />
      <path d="M8 3v2M8 13v2M2 9h2M12 9h2M16.5 11v1.5M16.5 18.5V20M12.5 15.5H14M19 15.5h1.5" />
    </>
  ),
  freios: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M5 7.5a8 8 0 0 1 4-3.5M19 7.5a8 8 0 0 0-4-3.5" />
    </>
  ),
  suspensao: (
    <>
      <path d="M12 2v3M12 19v3" />
      <path d="M8 5h8l-8 2.5h8l-8 2.5h8l-8 2.5h8l-8 2.5h8l-8 2.5h8" />
    </>
  ),
  manga: (
    <>
      <path d="M9 3h4v18H9z" />
      <path d="M13 12h6M9 17l-5 2" />
      <circle cx="11" cy="5" r="0.8" />
    </>
  ),
  travessa: (
    <>
      <path d="M3 8l4 4h10l4-4M7 12v5h10v-5" />
      <circle cx="5" cy="15" r="1.5" />
      <circle cx="19" cy="15" r="1.5" />
    </>
  ),
  rodas: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
    </>
  ),
  pneu: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
    </>
  ),
  estrutura: (
    <>
      <path d="M3 8h18M3 16h18M6 8v8M12 8v8M18 8v8M6 8l6 8M12 8l6 8" />
    </>
  ),
  carroceria: (
    <>
      <path d="M2 16V8h11v8M13 11h4l3 3v2" />
      <circle cx="6" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2l2.4 11h10.2L20 8H6.2" />
      <circle cx="9" cy="19" r="1.4" />
      <circle cx="17" cy="19" r="1.4" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
  explode: (
    <>
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M4 4l3 3M20 4l-3 3M4 20l3-3M20 20l-3-3" />
    </>
  ),
  assemble: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
    </>
  ),
  rotate: <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4" />,
  center: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </>
  ),
  cube: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.5" />
    </>
  ),
  back: <path d="M15 5l-7 7 7 7" />,
}

export function Icon({ name, size = 20, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name] ?? paths.cube}
    </svg>
  )
}
