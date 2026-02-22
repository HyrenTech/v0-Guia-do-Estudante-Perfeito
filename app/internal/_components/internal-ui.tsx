import Link from "next/link"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function InternalContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
}

export function InternalCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/45 p-5 backdrop-blur">
      <header className="mb-3">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle ? <p className="text-sm text-zinc-400">{subtitle}</p> : null}
      </header>
      {children}
    </section>
  )
}

export function KpiItem({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-zinc-500">{hint}</p> : null}
    </div>
  )
}

export function InternalTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="min-w-full divide-y divide-white/10 text-sm">
        <thead className="bg-zinc-950/80 text-zinc-300">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-left font-medium whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-black/40 text-zinc-100">{children}</tbody>
      </table>
    </div>
  )
}

export function StatusPill({ status }: { status: string }) {
  const normalized = status.toLowerCase()
  const active = normalized === "active" || normalized === "success" || normalized === "open"

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-1 text-xs font-medium",
        active ? "bg-emerald-500/15 text-emerald-300" : "bg-zinc-500/20 text-zinc-300"
      )}
    >
      {status}
    </span>
  )
}

export function InternalNav() {
  const items = [
    { href: "/internal/dashboard", label: "Dashboard" },
    { href: "/internal/campaigns", label: "Campanhas" },
    { href: "/internal/ads", label: "Anúncios" },
    { href: "/internal/alerts", label: "Alertas" },
    { href: "/internal/integrations", label: "Integrações" },
  ]

  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-200 transition hover:bg-white/10"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 p-6 text-sm text-zinc-400">{message}</div>
  )
}
