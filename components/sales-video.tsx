"use client"

import { useMemo, useRef, useState } from "react"

type SalesVideoProps = {
  className?: string
}

export function SalesVideo({ className }: SalesVideoProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [isMuted, setIsMuted] = useState(true)

  const src = useMemo(() => {
    const videoId = "NqgJrDv7yG8"
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      controls: "0",
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
      loop: "1",
      playlist: videoId,
      iv_load_policy: "3",
      cc_load_policy: "0",
      enablejsapi: "1",
    })
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
  }, [])

  const sendCommand = (command: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: command, args: [] }),
      "*",
    )
  }

  const handleToggleMute = () => {
    if (isMuted) {
      sendCommand("unMute")
    } else {
      sendCommand("mute")
    }
    sendCommand("playVideo")
    setIsMuted(!isMuted)
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <iframe
        ref={iframeRef}
        width="100%"
        height="100%"
        src={src}
        title="Vídeo de Vendas"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
      <button
        type="button"
        onClick={handleToggleMute}
        className={`absolute inset-0 z-10 flex items-center justify-center text-sm md:text-base font-medium tracking-wide transition-all duration-300 ${
          isMuted ? "bg-background/40 text-foreground" : "pointer-events-none opacity-0"
        }`}
        aria-label={isMuted ? "Ativar áudio do vídeo" : "Áudio ativado"}
      >
        <span className="rounded-full border border-primary/60 bg-background/80 px-5 py-2 text-primary">
          Clique para ativar o áudio
        </span>
      </button>
    </div>
  )
}
