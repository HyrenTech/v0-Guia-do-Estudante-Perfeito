"use client"

import { useEffect, useMemo, useState } from "react"
import type { CSSProperties } from "react"

import { ArtDecoSunburst } from "@/components/art-deco-sunburst"
import { SalesVideo } from "@/components/sales-video"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const CHECKOUT_URL = "https://pay.hotmart.com/V103763457H"
const MODULE_ACCENTS = [
  "from-primary/35 via-primary/10 to-transparent",
  "from-secondary/35 via-secondary/10 to-transparent",
  "from-chart-3/35 via-chart-3/10 to-transparent",
  "from-chart-4/35 via-chart-4/10 to-transparent",
  "from-chart-5/35 via-chart-5/10 to-transparent",
  "from-primary/25 via-primary/10 to-transparent",
  "from-secondary/25 via-secondary/10 to-transparent",
]

const LESSON_MODULES = [
  {
    module: "Módulo 1",
    title: "Como o Guia Funciona",
    lessons: [{ number: "01", title: "Como o Guia de 31 Dias Funciona" }],
  },
  {
    module: "Módulo 2",
    title: "Coisas que não falaram a você sobre o curso de Direito",
    lessons: [
      { number: "02", title: "Parabéns pela decisão de cursar Direito." },
      { number: "03", title: "Graduação: Os 5 anos mais importantes da sua vida!" },
      { number: "04", title: "A palestra mais importante da minha vida." },
      { number: "05", title: "O Direito melhora as pessoas, de qualquer jeito." },
      { number: "06", title: "O Direito é difícil, mas a faculdade é fácil!" },
    ],
  },
  {
    module: "Módulo 3",
    title: "A consciência que o aluno de Direito não tem",
    lessons: [
      { number: "07", title: "Por que falar de uma consciência?" },
      { number: "08", title: "O bom curso de Direito deveria ser ministrado em 50 anos!" },
      { number: "09", title: "Cuidado com a facilidade da faculdade de Direito!" },
      { number: "10", title: "Consciência gerando autonomia para o sucesso." },
    ],
  },
  {
    module: "Módulo 4",
    title: "Compromissos na faculdade que geram sucesso profissional",
    lessons: [
      { number: "11", title: "50 anos em 5 e o aluno não aparece na faculdade?" },
      { number: "12", title: "Compromisso do aluno consigo mesmo. Alguns exemplos extremos." },
      { number: "13", title: "Aproveitando ao máximo a faculdade: as aulas vagas." },
      { number: "14", title: "Discriminação contra o professor?" },
      { number: "15", title: "O problema do aluno dorminhoco." },
      { number: "16", title: "Sobre o problema de não prestar atenção" },
      { number: "17", title: "Mas, por que prestar atenção não basta? Registrar é preciso." },
      { number: "18", title: "O aluno registrador perfeito. Como?" },
      { number: "19", title: "Para que um caderno de 200 páginas?" },
    ],
  },
  {
    module: "Módulo 5",
    title: "Compromissos fora da faculdade que geram sucesso profissional",
    lessons: [
      { number: "20", title: "A coisa que só a Faculdade de Direito tem!" },
      { number: "21", title: "A importância de dominar os códigos jurídicos." },
      { number: "22", title: "Que aluno de Direito leu os códigos mais importantes?" },
      {
        number: "23",
        title: "Valorize os códigos físicos e o exemplo do Prof. Costa Machado de começar tudo de novo.",
      },
      { number: "24", title: "Sobre o Vade-mécum e o aluno de Direito: benção ou maldição?" },
      { number: "26", title: "O exemplo de sucesso do Professor Damásio de Jesus." },
      { number: "27", title: "A leitura das melhores obras pelo aluno de Direito perfeito" },
      { number: "28", title: "Leitura, Estudo e Conhecimento: O caminho do sucesso." },
      { number: "29", title: "Fuja do Estágio! Você precisa é de livros!" },
    ],
  },
  {
    module: "Módulo 6",
    title: "Conclusões de esperança e otimismo para quem cursa Direito",
    lessons: [
      { number: "30", title: "As estatísticas sobre o resultado dessas lições." },
      { number: "31", title: "Morro de inveja de vocês! Eu faria Direito tudo de novo! Vale a Pena!" },
    ],
  },
  {
    module: "Módulo 7",
    title: "Vídeo-Biografia do Professor Costa Machado",
    lessons: [{ number: "—", title: "Vídeo-Biografia - Professor Costa Machado" }],
  },
]

const FAQ_ITEMS = [
  {
    question: "Tem garantia? Qual?",
    answer: "Sim. Garantia total de 7 dias.",
  },
  {
    question: "Isso é preparatório para OAB?",
    answer:
      "Não. O guia é um método para elevar o seu desempenho na graduação e construir autonomia de estudo. Ele pode ajudar indiretamente, mas não substitui um curso preparatório específico para a OAB.",
  },
  {
    question: "Em quanto tempo por dia eu preciso estudar?",
    answer:
      "As lições foram pensadas para cerca de 10 minutos por dia, com foco em consistência e aplicação diária.",
  },
  {
    question: "São aulas longas ou curtas?",
    answer: "Curtas e objetivas, feitas para caber na sua rotina diária sem sobrecarregar.",
  },
  {
    question: "O guia é para qual fase da faculdade?",
    answer:
      "Funciona em qualquer fase. Quanto mais cedo você aplicar o método, maior o impacto — mas ele também serve para quem já está avançado.",
  },
  {
    question: "Como acesso os vídeos?",
    answer: "O acesso é online pela área do aluno. Após a compra, você recebe as instruções de login por e-mail.",
  },
  {
    question: "Por quanto tempo tenho acesso?",
    answer: "Você tem acesso por 1 ano.",
  },
  {
    question: "O certificado é válido para horas complementares?",
    answer:
      "É um curso livre. Muitas faculdades aceitam como horas complementares, mas isso depende da política de cada instituição.",
  },
  {
    question: "Como emitir o certificado? Ele vem assinado?",
    answer:
      "Após concluir o curso, o certificado fica disponível na área do aluno para download. Ele é emitido digitalmente pela plataforma.",
  },
  {
    question: "Minha faculdade aceita certificado de curso livre?",
    answer:
      "Algumas aceitam, outras não. Recomendamos confirmar diretamente com a coordenação do seu curso.",
  },
  {
    question: "O que exatamente eu vou aprender nesses 31 dias?",
    answer:
      "Você aprende consciência e método de estudo, compromisso com a rotina, atenção e registro em aula, leitura estratégica de códigos e construção de autonomia acadêmica.",
  },
  {
    question: "Qual a diferença entre “ver aula” e “aplicar método”?",
    answer:
      "Ver aula é consumir conteúdo. Aplicar método é executar práticas diárias: registrar, revisar, construir rotina e transformar informação em conhecimento durável.",
  },
]

export default function Home() {
  const [showScrollHint, setShowScrollHint] = useState(false)

  const lessonCards = useMemo(
    () =>
      LESSON_MODULES.flatMap((module, moduleIndex) =>
        module.lessons.map((lesson) => ({
          ...lesson,
          module: module.module,
          moduleTitle: module.title,
          theme: MODULE_ACCENTS[moduleIndex % MODULE_ACCENTS.length],
        }))
      ),
    []
  )
  const lessonTrack = useMemo(() => [...lessonCards, ...lessonCards], [lessonCards])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let ticking = false
    const update = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--scroll-y", String(window.scrollY))
        ticking = false
      })
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  useEffect(() => {
    let timer = window.setTimeout(() => setShowScrollHint(true), 2800)
    const onScroll = () => {
      setShowScrollHint(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setShowScrollHint(true), 2800)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <main className="min-h-screen bg-background scroll-smooth test-page">
      {/* SEÇÃO 1 - HERO */}
      <section
        id="o-guia"
        className="relative min-h-[calc(100svh-72px)] lg:min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-12 pb-8"
      >
        <ArtDecoSunburst className="parallax-sunburst" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1
            className="font-roboto-700 text-3xl md:text-5xl lg:text-6xl text-foreground mb-4 leading-tight text-balance uppercase"
            data-reveal
            style={{ "--reveal-delay": "0.05s" } as CSSProperties}
          >
            TORNE-SE UM ESTUDANTE DE DIREITO{" "}
            <span className="text-gold-gradient font-bold sheen-text">PERFEITO</span>
          </h1>

          <p
            className="text-xl md:text-2xl text-foreground mb-6 leading-tight text-balance"
            data-reveal
            style={{ "--reveal-delay": "0.12s" } as CSSProperties}
          >
            Você está desperdiçando sua Faculdade de Direito,{" "}
            <span className="text-gold-gradient font-bold sheen-text">e nem percebe.</span>
          </p>

          {/* Video */}
          <div
            className="relative w-full max-w-2xl md:max-w-3xl mx-auto"
            data-reveal
            style={{ "--reveal-delay": "0.2s" } as CSSProperties}
          >
            <SalesVideo className="w-full aspect-video rounded-lg overflow-hidden shadow-2xl mb-4 border border-primary/20 apple-card lift-on-hover" />
            <div className="video-hint glass-hint">Ativar áudio</div>
          </div>

          <p
            className="text-xs text-muted-foreground mb-6"
            data-reveal
            style={{ "--reveal-delay": "0.26s" } as CSSProperties}
          >
            Clique no vídeo para ativar o áudio.
          </p>

          <p
            className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6"
            data-reveal
            style={{ "--reveal-delay": "0.32s" } as CSSProperties}
          >
            Aprenda a extrair o máximo da faculdade de Direito com o método usado pelos estudantes que se destacam — e construa uma carreira jurídica sólida.
          </p>

          {/* CTA */}
          <div className="mb-8" data-reveal style={{ "--reveal-delay": "0.38s" } as CSSProperties}>
            <Button asChild variant="cta" className="font-roboto text-sm px-10 py-6 cta-depth focus-ring">
              <Link href={CHECKOUT_URL}>Comece agora</Link>
            </Button>
          </div>

          {/* Decorative bottom element */}
          <div className="hidden md:flex justify-center mt-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary to-primary" />
              <div className="w-2 h-2 rotate-45 bg-primary" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        {showScrollHint ? (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block scroll-hint">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
              <path
                d="M12 5v14M5 12l7 7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ) : null}
      </section>

      {/* SEÇÃO 2 - O PROBLEMA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12" data-reveal style={{ "--reveal-delay": "0.05s" } as CSSProperties}>
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">O Problema</p>
            <h2 className="font-roboto text-3xl md:text-4xl text-foreground mb-6 leading-tight text-balance">
              O Que Ninguém Te Ensina na Faculdade
            </h2>
          </div>

          <div className="text-center mb-10" data-reveal style={{ "--reveal-delay": "0.12s" } as CSSProperties}>
            <p className="text-xl text-foreground font-medium mb-8">
              <strong>
                A maioria dos estudantes de Direito{" "}
                <span className="text-gold-gradient font-bold">não sabe como estudar Direito.</span>
              </strong>
            </p>
            <p className="text-lg text-muted-foreground mb-8">O resultado é previsível:</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            {[
              "Formam-se sem base sólida",
              "Levam anos para conquistar aprovações",
              "Permanecem em posições aquém do seu potencial",
              "Não alcançam a carreira que imaginaram no primeiro dia de aula"
            ].map((item, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card/80 via-card/60 to-background/60 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] min-h-[96px] flex items-center justify-center lift-on-hover"
                data-reveal
                style={{ "--reveal-delay": `${0.18 + i * 0.05}s` } as CSSProperties}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                  <div className="absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                </div>
                <div className="relative text-center">
                  <p className="text-foreground/90 text-base md:text-lg font-semibold">{item}</p>
                </div>
                <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              </div>
            ))}
          </div>

          <div className="relative text-center py-12" data-reveal style={{ "--reveal-delay": "0.12s" } as CSSProperties}>
            <blockquote className="relative z-10">
              <p className="font-roboto text-xl md:text-2xl leading-relaxed italic mb-6 text-primary">
                &ldquo;Se o &lsquo;bom curso de Direito&rsquo; exigiria 50 anos para ser ministrado, como pode um aluno que só tem 5 não levar a sério a faculdade?&rdquo;
              </p>
              <cite className="text-muted-foreground text-sm">— Prof. Costa Machado</cite>
            </blockquote>
          </div>

          <p className="text-center text-lg text-muted-foreground mb-8" data-reveal style={{ "--reveal-delay": "0.16s" } as CSSProperties}>
            Os cinco anos da faculdade não comportam improviso, descuido ou estudo desordenado.
          </p>

          <p className="text-center text-primary italic text-lg mb-10" data-reveal style={{ "--reveal-delay": "0.2s" } as CSSProperties}>
            <strong>Mas existe um caminho diferente.</strong>
          </p>

        </div>
      </section>

      <div className="section-divider" aria-hidden />

      {/* SEÇÃO 2.5 - AULAS DO CURSO */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10" data-reveal style={{ "--reveal-delay": "0.06s" } as CSSProperties}>
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">Aulas do Curso</p>
            <h2 className="font-roboto text-3xl md:text-4xl text-foreground mb-4 text-balance">
              Tudo o que Você Aprenderá
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-roboto-700">
              Uma visão rápida dos temas, organizados por módulos, com lições curtas e diretas para os seus 31 dias.
            </p>
          </div>
        </div>

        <div className="marquee">
          <div className="marquee-track gap-5 px-6">
            {lessonTrack.map((lesson, index) => (
              <div
                key={`${lesson.module}-${lesson.number}-${index}`}
                className="relative w-[224px] md:w-[256px] aspect-[2/3] shrink-0 rounded-[34px] md:rounded-[38px] card-bg-v2 shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden lift-on-hover"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/5 to-black/40" />
                <div className={`absolute -right-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br ${lesson.theme} blur-3xl opacity-50`} />
                <div className="absolute -left-12 -bottom-12 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />

                <div className="relative h-full p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <span className="text-[11px] uppercase tracking-[0.3em] text-primary font-roboto-700">
                      {lesson.module}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-roboto-700">Aula {lesson.number}</span>
                  </div>

                  <p className="text-foreground text-[1.4rem] md:text-[1.75rem] leading-[1.15] font-roboto text-balance px-1">
                    <span className="text-gold-gradient">{lesson.title.split(" ").slice(0, 2).join(" ")}</span>{" "}
                    {lesson.title.split(" ").slice(2).join(" ")}
                  </p>

                  <div className="mt-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="marquee-progress" aria-hidden>
          <div className="marquee-progress-bar" />
        </div>
      </section>

      {/* SEÇÃO 3 - A SOLUÇÃO */}
      <section className="py-24 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12" data-reveal style={{ "--reveal-delay": "0.05s" } as CSSProperties}>
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">A Solução</p>
            <h2 className="font-roboto text-3xl md:text-4xl text-foreground mb-6 leading-tight text-balance">
              O Que Separa os Estudantes Bem-Sucedidos dos Demais
            </h2>
          </div>

          <p
            className="font-roboto text-lg text-muted-foreground text-center mb-10 max-w-3xl mx-auto"
            data-reveal
            style={{ "--reveal-delay": "0.12s" } as CSSProperties}
          >
            Durante 35 anos lecionando na USP — a catedral do Direito brasileiro — o Prof. Costa Machado identificou <strong className="text-foreground">o padrão que distingue</strong> os juristas de excelência daqueles que se perdem no caminho.
          </p>

          <div className="text-center mb-10" data-reveal style={{ "--reveal-delay": "0.16s" } as CSSProperties}>
            <p className="text-2xl text-gold-gradient font-roboto">
              Método certo aplicado desde cedo.
            </p>
          </div>

          <div className="relative text-center py-8 mb-10" data-reveal style={{ "--reveal-delay": "0.2s" } as CSSProperties}>
            <blockquote className="relative z-10">
              <p className="font-roboto text-xl md:text-2xl leading-relaxed italic text-primary">
                &ldquo;O objetivo deste curso é o de, por meio da conscientização, torná-lo autônomo.&rdquo;
              </p>
              <cite className="text-muted-foreground text-sm">— Prof. Costa Machado</cite>
            </blockquote>
          </div>
        </div>
      </section>

      <div className="section-divider" aria-hidden />

      {/* SEÇÃO 4 - O MÉTODO */}
      <section id="metodo" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-12" data-reveal style={{ "--reveal-delay": "0.05s" } as CSSProperties}>
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">O Método</p>
            <h2 className="font-roboto text-3xl md:text-4xl text-foreground mb-6 leading-tight text-balance">
              Por Que 31 Dias?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Porque transformação real não vem de maratonas motivacionais de fim de semana. Vem de <strong className="text-foreground">construções diárias</strong> que reprogramam como seu cérebro processa Direito.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                heading: "SEMANA 1 (Dias 1-7): Consciência",
                description: "Compreensão da engenharia da faculdade de Direito."
              },
              {
                heading: "SEMANA 2 (Dias 8-15): Método",
                description: "Instalação da arquitetura mental adequada."
              },
              {
                heading: "SEMANA 3 (Dias 16-23): Consolidação",
                description: "Implementação do sistema que torna conhecimento permanente."
              },
              {
                heading: "SEMANA 4+ (Dias 24-31): Autonomia",
                description: "Direção própria consolidada. Método que independe de motivação."
              }
            ].map((item, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card/80 via-card/60 to-background/60 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] lift-on-hover"
                data-reveal
                style={{ "--reveal-delay": `${0.12 + i * 0.05}s` } as CSSProperties}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                  <div className="absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                </div>
                <div className="relative">
                  <h3 className="font-roboto text-lg text-foreground mb-3 tracking-wide">{item.heading}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              </div>
            ))}
          </div>

          <p className="text-center text-lg text-muted-foreground italic">
            Cada dia constrói sobre o anterior. Sem excessos. Apenas o essencial.
          </p>
        </div>
      </section>

      {/* SEÇÃO 5 - TRANSFORMAÇÃO */}
      <section className="py-24 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">Transformação</p>
            <h2 className="font-roboto text-3xl md:text-4xl text-foreground mb-6 leading-tight text-balance">
              O Que Muda em 31 Dias
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* ANTES */}
            <div className="relative p-8 bg-card border border-border">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-muted-foreground/50" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-muted-foreground/50" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-muted-foreground/50" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-muted-foreground/50" />
              
              <h3 className="font-roboto text-2xl text-muted-foreground mb-6 text-center">ANTES (Você Hoje)</h3>
              <ul className="space-y-4 text-muted-foreground">
                {[
                  "Assiste aulas sem saber como prestar atenção",
                  "Faz anotações que nunca revisita",
                  "Estuda na véspera e esquece rapidamente",
                  "Não sabe se está progredindo ou apenas ocupado",
                  "Depende de motivação constante"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-muted-foreground mt-2 rotate-45 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DEPOIS */}
            <div className="relative p-8 bg-card border-2 border-primary shadow-[0_0_24px_rgba(214,162,58,0.25)]">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary" />
              
              <h3 className="font-roboto text-2xl text-primary mb-6 text-center">DEPOIS (Você Transformado)</h3>
              <ul className="space-y-4 text-foreground">
                {[
                  { text: "Aproveita cada aula com máxima eficiência" },
                  { text: "Registra informação que se torna conhecimento durável" },
                  { text: "Consolida aprendizado enquanto os outros esquecem" },
                  { text: "Opera com clareza, sem depender de orientação externa" },
                  { text: "Autonomia jurídica real — você conduz seu próprio caminho", emphasis: true }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary mt-2 rotate-45 shrink-0" />
                    <span>
                      {item.emphasis ? <strong className="text-foreground">{item.text}</strong> : item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative text-center py-8 mb-10">
            <blockquote className="relative z-10">
              <p className="font-roboto text-xl md:text-2xl leading-relaxed italic text-primary">
                &ldquo;Autonomia significa normas (nomos) para si próprio (auto). O aluno consciente e, por isso, autônomo, não precisa de ninguém para conduzi-lo no caminho do conhecimento.&rdquo;
              </p>
              <cite className="text-muted-foreground text-sm">— Prof. Costa Machado</cite>
            </blockquote>
          </div>

        </div>
      </section>

      {/* SEÇÃO 9 - OFERTA */}
      <section id="oferta" className="py-24 px-6 bg-card/50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <ArtDecoSunburst />
        </div>

        <div className="max-w-md mx-auto relative z-10">
          <div className="relative rounded-3xl border border-primary/30 bg-gradient-to-b from-card/80 via-card/60 to-background/60 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
            <div className="text-center mb-7">
              <h3 className="font-roboto text-2xl md:text-3xl text-balance text-foreground">
                TORNE-SE UM ESTUDANTE DE DIREITO{" "}
                <span className="text-gold-gradient font-bold">PERFEITO</span>
              </h3>
              <div className="mt-3 h-px w-16 bg-gradient-to-r from-transparent via-primary/70 to-transparent mx-auto" />
            </div>

            <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
              Tudo o que você receberá:
            </p>

            <ul className="space-y-3 mb-10 text-left max-w-[280px] mx-auto">
              {[
                "31 Vídeos Estratégicos",
                "6 Módulos de Transformação",
                "Sistema Completo de Estudo",
                "Acesso por 1 Ano",
                "Certificado de 10 Horas",
                "Garantia de 7 Dias"
              ].map((item, i) => (
                <li key={i} className="flex items-center justify-start gap-3">
                  <span className="text-primary font-bold text-lg">✓</span>
                  <span className="text-foreground font-roboto">{item}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-primary/20 pt-7 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-2">Por apenas</p>
              <p className="font-roboto text-5xl text-gold-gradient mb-5">R$ 97</p>

              <Button asChild variant="cta" className="font-roboto px-8 py-6 text-sm mb-5 w-full max-w-[260px] mx-auto">
                <Link href={CHECKOUT_URL}>Comece agora</Link>
              </Button>

              <p className="font-roboto text-xs text-muted-foreground">
                Acesso imediato • Transformação em 31 dias • Autonomia para toda a carreira
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO GARANTIA - 7 DIAS */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          
          <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
            {/* Badge Visual */}
            <div className="flex justify-center order-1">
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-primary" />
                {/* Inner ring */}
                <div className="absolute inset-4 rounded-full border-2 border-primary/60" />
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-primary text-xs md:text-sm tracking-widest uppercase font-medium">Dias de</span>
                  <span className="font-roboto text-6xl md:text-8xl text-gold-gradient leading-none">7</span>
                  <span className="text-primary text-xs md:text-sm tracking-widest uppercase font-medium">Garantia</span>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="order-2 text-center md:text-left">
              <h3 className="font-roboto text-3xl md:text-4xl text-foreground mb-6">
                Garantia de 7 Dias
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Você pode acessar o produto, assistir as aulas, ler o manual e, se não ficar satisfeito, basta solicitar o reembolso e devolveremos todo seu dinheiro —{" "}
                <strong className="text-gold-gradient font-semibold">sem perguntas.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 8 - AUTORIDADE */}
      <section id="professor" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12" data-reveal style={{ "--reveal-delay": "0.06s" } as CSSProperties}>
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">Autoridade</p>
            <h2 className="font-roboto text-3xl md:text-4xl text-foreground mb-2 text-balance">
              O Criador do Guia de 31 Dias
            </h2>
          </div>

          <div className="relative p-6 md:p-10 border border-border bg-card" data-reveal style={{ "--reveal-delay": "0.12s" } as CSSProperties}>
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-primary" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-primary" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-primary" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-primary" />

            <div className="grid gap-8 md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] items-center">
              <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card/80 via-card/60 to-background/60 p-2 shadow-[0_12px_32px_rgba(0,0,0,0.35)] lift-on-hover">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                  <Image
                    src="/prof-costa-machado.png"
                    alt="Prof. Costa Machado"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 320px, (min-width: 768px) 280px, 100vw"
                    priority
                  />
                </div>
                <div className="absolute inset-x-6 bottom-3 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              </div>

              <div>
                <h3 className="font-roboto text-2xl md:text-3xl text-foreground mb-6 text-center md:text-left">
                  Prof. Costa Machado
                </h3>

                <ul className="space-y-3 text-muted-foreground mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary mt-2 rotate-45 shrink-0" />
                    <span className="font-roboto">Professor da Faculdade de Direito do Largo São Francisco (USP) — 1984 a 2019</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary mt-2 rotate-45 shrink-0" />
                    <span className="font-roboto">Professor do Mestrado em Direitos Fundamentais (UNIFIEO) — 2000 a 2020</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary mt-2 rotate-45 shrink-0" />
                    <span className="font-roboto">Coordenador de Processo Civil (EPD) — 2008 a 2013</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary mt-2 rotate-45 shrink-0" />
                    <span>Advogado, parecerista e consultor jurídico</span>
                  </li>
                </ul>

                <p className="text-muted-foreground text-center md:text-left mb-4">
                  Ele acompanhou a formação de milhares de alunos. Os que se destacaram e os que ficaram pelo caminho.
                </p>
                <p className="text-primary italic text-center md:text-left font-medium mb-2">
                  E identificou exatamente o que distingue os dois grupos.
                </p>
                <p className="text-muted-foreground text-center md:text-left">
                  Este Guia é esse conhecimento organizado em forma aplicável.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SEÇÃO 7 - PROVA SOCIAL */}
      <section className="py-24 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-12" data-reveal style={{ "--reveal-delay": "0.05s" } as CSSProperties}>
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">Prova Social</p>
            <h2 className="font-roboto text-3xl md:text-4xl text-foreground mb-6 text-balance">
              O Que Alunos Relatam
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              "Fui aluna do Costa Machado. Todo mundo me diz: que privilégio você teve.",
              "Simplesmente a melhor palestra da minha vida. Direito é vida.",
              "Palestrante nota máxima. É uma experiência que vale muito a pena.",
              "Foi um curso maravilhoso. Gratidão por compartilhar seus conhecimentos.",
              "Ouvir seus conselhos foi fantástico. Gratidão por aquele momento."
            ].map((testimonial, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card/80 via-card/60 to-background/60 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] lift-on-hover"
                data-reveal
                style={{ "--reveal-delay": `${0.12 + i * 0.05}s` } as CSSProperties}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                  <div className="absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                </div>
                <p className="relative font-roboto text-lg text-foreground italic">&ldquo;{testimonial}&rdquo;</p>
                <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              </div>
            ))}
          </div>

          <p className="text-center text-muted-foreground italic" data-reveal style={{ "--reveal-delay": "0.12s" } as CSSProperties}>
            Esses relatos refletem transformações concretas em aprovações, carreiras e domínio técnico.
          </p>
        </div>
      </section>

      {/* SEÇÃO 10 - DECISÃO FINAL */}
      <section className="py-24 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12" data-reveal style={{ "--reveal-delay": "0.05s" } as CSSProperties}>
            <h2 className="font-roboto text-3xl md:text-4xl text-foreground mb-6 leading-tight text-balance">
              A Escolha é Clara
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Caminho A */}
            <div
              className="relative p-8 bg-card border border-muted-foreground/30 lift-on-hover"
              data-reveal
              style={{ "--reveal-delay": "0.1s" } as CSSProperties}
            >
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-muted-foreground/30" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-muted-foreground/30" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-muted-foreground/30" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-muted-foreground/30" />
              
              <h3 className="font-roboto text-2xl text-muted-foreground mb-4 text-center">CAMINHO A:</h3>
              <p className="text-muted-foreground text-center">
                Continuar estudando sem direção. Formar-se na média. Levar anos para conquistar o que os bem preparados conquistam em meses.
              </p>
            </div>

            {/* Caminho B */}
            <div
              className="relative p-8 bg-card border-2 border-primary lift-on-hover"
              data-reveal
              style={{ "--reveal-delay": "0.16s" } as CSSProperties}
            >
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary" />
              
              <h3 className="font-roboto text-2xl text-primary mb-4 text-center">CAMINHO B:</h3>
              <p className="text-foreground text-center">
                Implementar o método. Compreender a engenharia. Tornar-se o estudante que professores reconhecem, bancas aprovam e escritórios valorizam.
              </p>
            </div>
          </div>

          <div className="text-center mb-10">
            <p className="text-xl text-foreground mb-6">
              A diferença entre A e B? <strong className="font-roboto text-primary">31 dias e R$ 97.</strong>
            </p>
            <p className="font-roboto text-lg text-muted-foreground mb-4">
              Você tem 5 anos de faculdade pela frente.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Cada dia sem método é tempo e investimento desperdiçados.
            </p>
            <p className="text-primary italic text-lg mb-2">
              A pergunta não é &ldquo;vale a pena?&rdquo;
            </p>
            <p className="text-primary font-medium text-xl mb-6">
              A pergunta é: &ldquo;quanto estou perdendo ao não fazer isso?&rdquo;
            </p>
          </div>

          <div className="text-center mb-10" data-reveal style={{ "--reveal-delay": "0.1s" } as CSSProperties}>
            <Button asChild variant="cta" className="font-roboto px-12 py-7 text-base cta-depth focus-ring">
              <Link href={CHECKOUT_URL}>Comece agora</Link>
            </Button>
          </div>

          <div className="text-center border-t border-border pt-10">
            <p className="text-muted-foreground italic mb-4">
              <strong>P.S.:</strong> Enquanto você pondera, outros que compreendem a importância da preparação já começaram.
            </p>
            <p className="font-roboto text-foreground">
              Em 31 dias, a diferença será perceptível.
            </p>
            <p className="font-roboto text-primary">
              Em 5 anos, será significativa.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO FAQ */}
      <section id="faq" className="py-24 px-6 bg-background">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12" data-reveal style={{ "--reveal-delay": "0.05s" } as CSSProperties}>
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">FAQ</p>
            <h2 className="font-roboto text-3xl md:text-4xl text-foreground mb-6 text-balance">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-6">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={item.question}
                className="rounded-2xl border border-primary/20 bg-gradient-to-br from-card/80 via-card/60 to-background/60 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                data-reveal
                style={{ "--reveal-delay": `${0.1 + i * 0.04}s` } as CSSProperties}
              >
                <h3 className="text-lg md:text-xl text-gold-gradient font-roboto mb-3">{item.question}</h3>
                <p className="text-muted-foreground leading-relaxed font-roboto-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-primary" />
              <span className="font-roboto text-xl text-foreground text-center">Guia de 31 Dias do Estudante de Direito Perfeito</span>
              <div className="w-12 h-px bg-primary" />
            </div>

            <p className="font-roboto text-muted-foreground text-sm text-center max-w-xl">
              Um método executável em 31 dias para sair do estudo automático e instalar consciência, método e direção.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacidade" className="hover:text-primary transition-colors">Política de Privacidade</Link>
              <Link href="/termos" className="hover:text-primary transition-colors">Termos de Uso</Link>
              <Link href="/suporte" className="hover:text-primary transition-colors">Suporte/Contato</Link>
            </div>

            <p className="font-roboto text-muted-foreground text-sm text-center">
              &copy; 2026 Todos os direitos reservados.
            </p>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-primary" style={{ opacity: 1 - i * 0.15 }} />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
