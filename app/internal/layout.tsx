import type { ReactNode } from "react"

import { InternalContainer, InternalNav } from "@/app/internal/_components/internal-ui"

export default function InternalLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(180,140,60,0.18),_transparent_55%),linear-gradient(180deg,_#08090c_0%,_#0d1118_100%)] text-zinc-100">
      <InternalContainer>
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Internal Ads Ops</p>
          <h1 className="mt-2 text-2xl font-semibold">Painel de Operação de Mídia</h1>
        </header>
        <InternalNav />
        {children}
      </InternalContainer>
    </main>
  )
}
