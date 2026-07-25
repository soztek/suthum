import type { SVGProps, ReactElement } from "react";

/** Kategori slug'ına göre ince çizgi ikonu. Tümü aynı stilde (stroke, currentColor). */

const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Peynir(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M2.8 16 L14.5 7.5 L21.2 11 L21.2 16 Z" />
      <path d="M2.8 16 L2.8 18 L21.2 18 L21.2 16" />
      <circle cx="8.5" cy="13.8" r="0.9" />
      <circle cx="13.5" cy="12.6" r="0.9" />
      <circle cx="17.5" cy="14.4" r="0.8" />
    </svg>
  );
}

function Bal(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M6.5 9 H17.5" />
      <path d="M7.4 9 V17 a2 2 0 0 0 2 2 h5.2 a2 2 0 0 0 2 -2 V9" />
      <path d="M9.5 12.2 c1.6 -1.4 3.4 -1.4 5 0" />
      <path d="M12 3 V6.4" />
      <path d="M10.4 4.6 H13.6" />
    </svg>
  );
}

function SutTereyagi(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M10 3 H14 V5.2 L15.5 8 a1 1 0 0 1 0.2 0.6 V19 a1 1 0 0 1 -1 1 H9.3 a1 1 0 0 1 -1 -1 V8.6 a1 1 0 0 1 0.2 -0.6 L10 5.2 Z" />
      <path d="M8.5 11.4 H15.5" />
      <path d="M8.5 15 H15.5" />
    </svg>
  );
}

function EtSarkuteri(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="14" cy="10" r="4.3" />
      <path d="M11 13 L7.4 16.6" />
      <circle cx="6.2" cy="17.5" r="1.5" />
      <circle cx="8.1" cy="19" r="1.5" />
    </svg>
  );
}

function Yoresel(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M12 21 V7" />
      <path d="M12 8 c-2.2 0 -3.2 -2 -2.8 -4 2 0.4 2.8 2 2.8 4 Z" />
      <path d="M12 8 c2.2 0 3.2 -2 2.8 -4 -2 0.4 -2.8 2 -2.8 4 Z" />
      <path d="M12 13 c-2.2 0 -3.2 -2 -2.8 -4 2 0.4 2.8 2 2.8 4 Z" />
      <path d="M12 13 c2.2 0 3.2 -2 2.8 -4 -2 0.4 -2.8 2 -2.8 4 Z" />
    </svg>
  );
}

function Paketler(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M3.6 7.6 L12 3.6 L20.4 7.6 V16.4 L12 20.4 L3.6 16.4 Z" />
      <path d="M3.6 7.6 L12 11.6 L20.4 7.6" />
      <path d="M12 11.6 V20.4" />
      <path d="M7.8 5.6 L16.2 9.6" />
    </svg>
  );
}

function Indirim(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M20 11.5 L12.5 4 H5 V11.5 L12.5 19 Z" />
      <circle cx="8.4" cy="7.9" r="1.1" />
    </svg>
  );
}

function Bag(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M6.5 8 H17.5 L16.6 19 a1 1 0 0 1 -1 1 H8.4 a1 1 0 0 1 -1 -1 Z" />
      <path d="M9 8 a3 3 0 0 1 6 0" />
    </svg>
  );
}

const MAP: Record<string, (p: SVGProps<SVGSVGElement>) => ReactElement> = {
  "peynir-cesitleri": Peynir,
  "bal-cesitleri": Bal,
  "sut-tereyagi": SutTereyagi,
  "et-sarkuteri": EtSarkuteri,
  "yoresel-urunler": Yoresel,
  paketler: Paketler,
  "indirimli-urunler": Indirim,
};

export function CategoryIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const Icon = MAP[slug] ?? Bag;
  return <Icon className={className} />;
}
