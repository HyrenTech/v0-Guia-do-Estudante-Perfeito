import { ArtDecoSunburst } from "@/components/art-deco-sunburst"
import { ArtDecoDivider } from "@/components/art-deco-divider"
import { SalesVideo } from "@/components/sales-video"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const CHECKOUT_URL = "https://pay.hotmart.com/V103763457H"

export default function Home() {
  return (
    <main className="min-h-screen bg-background scroll-smooth">
      {/* SEÇÃO 1 - HERO */}
      <section
        id="o-guia"
        className="relative min-h-[calc(100svh-72px)] lg:min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-12 pb-8"
      >
        <ArtDecoSunburst />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground mb-4 leading-tight text-balance font-semibold uppercase">
            TORNE-SE UM ESTUDANTE DE DIREITO{" "}
            <span className="text-gold-gradient font-bold">PERFEITO</span>
          </h1>

          <p className="text-xl md:text-2xl text-foreground mb-6 leading-tight text-balance">
            Você está desperdiçando sua Faculdade de Direito, <span className="text-gold-gradient font-bold">e nem percebe.</span>
          </p>

          {/* Video */}
          <SalesVideo className="w-full max-w-2xl md:max-w-3xl mx-auto aspect-video rounded-lg overflow-hidden shadow-2xl mb-4 border border-primary/20" />

          <p className="text-xs text-muted-foreground mb-6">
            Clique no vídeo para ativar o áudio.
          </p>

          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6">
            Aprenda a extrair o máximo da faculdade de Direito com o método usado pelos estudantes que se destacam — e construa uma carreira jurídica sólida.
          </p>

          {/* CTA */}
          <div className="mb-8">
            <Button asChild variant="cta" className="text-sm px-10 py-6">
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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
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
      </section>

      {/* SEÇÃO 2 - O PROBLEMA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <ArtDecoDivider variant="stepped" />

          <div className="text-center mb-12">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">O Problema</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 leading-tight text-balance font-medium">
              O Que Ninguém Te Ensina na Faculdade
            </h2>
          </div>

          <div className="text-center mb-10">
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
              <div key={i} className="group relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card/80 via-card/60 to-background/60 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] min-h-[96px] flex items-center justify-center">
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

          <div className="relative text-center py-12">
            <blockquote className="relative z-10">
              <p className="font-serif text-xl md:text-2xl leading-relaxed italic mb-6 text-primary font-semibold">
                &ldquo;Se o &lsquo;bom curso de Direito&rsquo; exigiria 50 anos para ser ministrado, como pode um aluno que só tem 5 não levar a sério a faculdade?&rdquo;
              </p>
              <cite className="text-muted-foreground text-sm">— Prof. Costa Machado</cite>
            </blockquote>
          </div>

          <p className="text-center text-lg text-muted-foreground mb-8">
            Os cinco anos da faculdade não comportam improviso, descuido ou estudo desordenado.
          </p>

          <p className="text-center text-primary italic text-lg mb-10">
            <strong>Mas existe um caminho diferente.</strong>
          </p>

        </div>
      </section>

      {/* SEÇÃO 3 - A SOLUÇÃO */}
      <section className="py-24 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <ArtDecoDivider variant="fan" />

          <div className="text-center mb-12">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">A Solução</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 leading-tight text-balance font-medium">
              O Que Separa os Estudantes Bem-Sucedidos dos Demais
            </h2>
          </div>

          <p className="text-lg text-muted-foreground text-center mb-10 max-w-3xl mx-auto">
            Durante 35 anos lecionando na USP — a catedral do Direito brasileiro — o Prof. Costa Machado identificou <strong className="text-foreground">o padrão que distingue</strong> os juristas de excelência daqueles que se perdem no caminho.
          </p>

          <div className="text-center mb-10">
            <p className="text-2xl text-gold-gradient font-serif font-bold">
              Método certo aplicado desde cedo.
            </p>
          </div>

          <div className="relative text-center py-8 mb-10">
            <blockquote className="relative z-10">
              <p className="font-serif text-xl md:text-2xl leading-relaxed italic text-primary">
                &ldquo;O objetivo deste curso é o de, por meio da conscientização, torná-lo autônomo.&rdquo;
              </p>
              <cite className="text-muted-foreground text-sm">— Prof. Costa Machado</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 - O MÉTODO */}
      <section id="metodo" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <ArtDecoDivider variant="chevron" />

          <div className="text-center mb-12">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">O Método</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 leading-tight text-balance font-medium">
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
              <div key={i} className="group relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card/80 via-card/60 to-background/60 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                  <div className="absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                </div>
                <div className="relative">
                  <h3 className="font-serif text-lg text-foreground mb-3 tracking-wide">{item.heading}</h3>
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
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 leading-tight text-balance font-medium">
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
              
              <h3 className="font-serif text-2xl text-muted-foreground mb-6 text-center">ANTES (Você Hoje)</h3>
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
              
              <h3 className="font-serif text-2xl text-primary mb-6 text-center">DEPOIS (Você Transformado)</h3>
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
              <p className="font-serif text-xl md:text-2xl leading-relaxed italic text-primary">
                &ldquo;Autonomia significa normas (nomos) para si próprio (auto). O aluno consciente e, por isso, autônomo, não precisa de ninguém para conduzi-lo no caminho do conhecimento.&rdquo;
              </p>
              <cite className="text-muted-foreground text-sm">— Prof. Costa Machado</cite>
            </blockquote>
          </div>

          <div className="text-center">
            <Button asChild variant="cta" className="text-sm px-10 py-6">
              <Link href={CHECKOUT_URL}>Comece agora</Link>
            </Button>
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
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-balance text-foreground">
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
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-primary/20 pt-7 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-2">Por apenas</p>
              <p className="font-serif text-5xl text-gold-gradient font-bold mb-5">R$ 97</p>

              <Button asChild variant="cta" className="px-8 py-6 text-sm mb-5 w-full max-w-[260px] mx-auto">
                <Link href={CHECKOUT_URL}>Comece agora</Link>
              </Button>

              <p className="text-xs text-muted-foreground">
                Acesso imediato • Transformação em 31 dias • Autonomia para toda a carreira
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO GARANTIA - 7 DIAS */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <ArtDecoDivider variant="fan" />
          
          <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
            {/* Badge Visual */}
            <div className="flex justify-center order-2 md:order-1">
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-primary" />
                {/* Inner ring */}
                <div className="absolute inset-4 rounded-full border-2 border-primary/60" />
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-primary text-xs md:text-sm tracking-widest uppercase font-medium">Dias de</span>
                  <span className="font-serif text-6xl md:text-8xl text-gold-gradient font-bold leading-none">7</span>
                  <span className="text-primary text-xs md:text-sm tracking-widest uppercase font-medium">Garantia</span>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="order-1 md:order-2">
              <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
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
          <ArtDecoDivider variant="chevron" />

          <div className="text-center mb-12">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">Autoridade</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-2 text-balance">
              Quem Construiu Este Sistema
            </h2>
          </div>

          <div className="relative p-6 md:p-10 border border-border bg-card">
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-primary" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-primary" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-primary" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-primary" />

            <div className="grid gap-8 md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] items-center">
              <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card/80 via-card/60 to-background/60 p-2 shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
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
                <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-6 text-center md:text-left">
                  Prof. Costa Machado
                </h3>

                <ul className="space-y-3 text-muted-foreground mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary mt-2 rotate-45 shrink-0" />
                    <span>Professor da Faculdade de Direito do Largo São Francisco (USP) — 1984 a 2019</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary mt-2 rotate-45 shrink-0" />
                    <span>Professor do Mestrado em Direitos Fundamentais (UNIFIEO) — 2000 a 2020</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary mt-2 rotate-45 shrink-0" />
                    <span>Coordenador de Processo Civil (EPD) — 2008 a 2013</span>
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
          <ArtDecoDivider variant="fan" />

          <div className="text-center mb-12">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">Prova Social</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 text-balance">
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
              <div key={i} className="group relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card/80 via-card/60 to-background/60 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                  <div className="absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                </div>
                <p className="relative font-serif text-lg text-foreground italic">&ldquo;{testimonial}&rdquo;</p>
                <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              </div>
            ))}
          </div>

          <p className="text-center text-muted-foreground italic">
            Esses relatos refletem transformações concretas em aprovações, carreiras e domínio técnico.
          </p>
        </div>
      </section>

      {/* SEÇÃO 10 - DECISÃO FINAL */}
      <section className="py-24 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <ArtDecoDivider variant="stepped" />

          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 leading-tight text-balance font-medium">
              A Escolha é Clara
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Caminho A */}
            <div className="relative p-8 bg-card border border-muted-foreground/30">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-muted-foreground/30" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-muted-foreground/30" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-muted-foreground/30" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-muted-foreground/30" />
              
              <h3 className="font-serif text-2xl text-muted-foreground mb-4 text-center">CAMINHO A:</h3>
              <p className="text-muted-foreground text-center">
                Continuar estudando sem direção. Formar-se na média. Levar anos para conquistar o que os bem preparados conquistam em meses.
              </p>
            </div>

            {/* Caminho B */}
            <div className="relative p-8 bg-card border-2 border-primary">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary" />
              
              <h3 className="font-serif text-2xl text-primary mb-4 text-center">CAMINHO B:</h3>
              <p className="text-foreground text-center">
                Implementar o método. Compreender a engenharia. Tornar-se o estudante que professores reconhecem, bancas aprovam e escritórios valorizam.
              </p>
            </div>
          </div>

          <div className="text-center mb-10">
            <p className="text-xl text-foreground mb-6">
              A diferença entre A e B? <strong className="text-primary">31 dias e R$ 97.</strong>
            </p>
            <p className="text-lg text-muted-foreground mb-4">
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

          <div className="text-center mb-10">
            <Button asChild variant="cta" className="px-12 py-7 text-base">
              <Link href={CHECKOUT_URL}>Comece agora</Link>
            </Button>
          </div>

          <div className="text-center border-t border-border pt-10">
            <p className="text-muted-foreground italic mb-4">
              <strong>P.S.:</strong> Enquanto você pondera, outros que compreendem a importância da preparação já começaram.
            </p>
            <p className="text-foreground">
              Em 31 dias, a diferença será perceptível.
            </p>
            <p className="text-primary font-medium">
              Em 5 anos, será significativa.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-primary" />
              <span className="font-serif text-xl text-foreground text-center">Guia de 31 Dias do Estudante de Direito Perfeito</span>
              <div className="w-12 h-px bg-primary" />
            </div>

            <p className="text-muted-foreground text-sm text-center max-w-xl">
              Um método executável em 31 dias para sair do estudo automático e instalar consciência, método e direção.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacidade" className="hover:text-primary transition-colors">Política de Privacidade</Link>
              <Link href="/termos" className="hover:text-primary transition-colors">Termos de Uso</Link>
              <Link href="/suporte" className="hover:text-primary transition-colors">Suporte/Contato</Link>
            </div>

            <p className="text-muted-foreground text-sm text-center">
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
