import { ArtDecoSunburst } from "@/components/art-deco-sunburst"
import { ArtDecoDivider } from "@/components/art-deco-divider"
import { ServiceCard } from "@/components/service-card"
import { Navbar } from "@/components/navbar"
import { FAQAccordion } from "@/components/faq-accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-background scroll-smooth">
      <Navbar />

      {/* Hero Section */}
      <section id="o-guia" className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20">
        <ArtDecoSunburst />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Decorative top element */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-px bg-primary" />
              <div className="w-3 h-3 rotate-45 border border-primary" />
              <div className="w-16 h-px bg-primary" />
            </div>
          </div>

          <p className="text-primary tracking-[0.3em] uppercase text-sm mb-6">
            O Guia de 31 Dias do Estudante de Direito Perfeito
          </p>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-tight text-balance">
            A formação do estudante de Direito não é um detalhe. <span className="text-gold-gradient">É uma responsabilidade.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Este Guia nasce dessa premissa: tratar a formação em Direito como algo sério — e organizá-la em um método executável em 31 dias. Em 31 dias, com cerca de 10 minutos por dia, você percorre uma sequência clara e organizada de lições para sair do estudo automático e instalar consciência, método e direção.
          </p>

          {/* Quote */}
          <blockquote className="font-serif text-xl md:text-2xl text-primary italic mb-8">
            &ldquo;A coisa mais importante que eu tenho a fazer é dar esta palestra.&rdquo;
          </blockquote>

          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Não é mais conteúdo. Não é promessa de resultado. É um método aplicado à rotina real da faculdade.
          </p>

          {/* CTA */}
          <div className="mb-8">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wider uppercase text-sm px-8 py-6 transition-all duration-300">
              <Link href="/checkout">Quero começar agora — Dia 1</Link>
            </Button>
          </div>

          {/* Microcopy */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-12">
            <span>Acesso por 1 ano</span>
            <span className="text-primary">•</span>
            <span>Acesso liberado após a confirmação do pagamento</span>
            <span className="text-primary">•</span>
            <span>Assista pelo celular ou computador</span>
          </div>

          {/* Badges/Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              "31 vídeos (lições)",
              "6 módulos (sequência lógica)",
              "Acesso por 1 ano",
              "Certificado de conclusão (10 horas)"
            ].map((badge, i) => (
              <div key={i} className="p-4 border border-border text-center">
                <p className="text-sm text-foreground">{badge}</p>
              </div>
            ))}
          </div>

          {/* Decorative bottom element */}
          <div className="flex justify-center mt-12">
            <div className="flex flex-col items-center gap-2">
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary to-primary" />
              <div className="w-2 h-2 rotate-45 bg-primary" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
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

      {/* Autonomia Section */}
      <section id="autonomia" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <ArtDecoDivider variant="stepped" />

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">Objetivo</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 leading-tight text-balance">
                O objetivo deste curso é, por meio da conscientização, torná-lo autônomo.
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed text-lg">
                O objetivo central deste Guia é dar autonomia ao estudante de Direito.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary mt-2 rotate-45 shrink-0" />
                  <span>Sair do estudo improvisado;</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary mt-2 rotate-45 shrink-0" />
                  <span>Aproveitar melhor aulas, professores e materiais;</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary mt-2 rotate-45 shrink-0" />
                  <span>Entender o curso como ele realmente é;</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary mt-2 rotate-45 shrink-0" />
                  <span>Construir uma base sólida para a faculdade e a carreira jurídica.</span>
                </li>
              </ul>
              <p className="text-primary italic border-l-2 border-primary pl-4">
                Aqui, consciência vem antes da técnica. Sem consciência, nenhum método se sustenta — e o estudo vira repetição sem direção.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Método Section */}
      <section id="metodo" className="py-24 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">O Método</p>
            <blockquote className="font-serif text-2xl md:text-3xl text-foreground italic mb-6">
              &ldquo;Autonomia significa normas (nomos) para si próprio (auto).&rdquo;
            </blockquote>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Autonomia é saber conduzir o próprio estudo, mesmo quando ninguém está dizendo o que fazer.
            </p>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Ao longo dos 31 dias, o Guia instala um sistema simples, em três camadas — em que cada etapa sustenta a seguinte e todas se acumulam ao longo do processo:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              title="Consciência"
              description=""
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                </svg>
              }
            >
              <ul className="text-left text-sm text-muted-foreground space-y-2 mt-4">
                <li>• Compreensão da engenharia da faculdade de Direito;</li>
                <li>• Identificação de erros invisíveis do estudo automático;</li>
                <li>• Leitura mais clara do papel do aluno no próprio aprendizado.</li>
              </ul>
            </ServiceCard>
            <ServiceCard
              title="Método"
              description=""
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" />
                  <path d="M9 12h6M9 16h6" />
                </svg>
              }
            >
              <ul className="text-left text-sm text-muted-foreground space-y-2 mt-4">
                <li>• Atenção em aula;</li>
                <li>• Registro adequado (cadernos, códigos, leitura);</li>
                <li>• Consolidação do que foi estudado.</li>
              </ul>
            </ServiceCard>
            <ServiceCard
              title="Direção diária"
              description=""
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              }
            >
              <ul className="text-left text-sm text-muted-foreground space-y-2 mt-4">
                <li>• Sequência fechada de 31 dias;</li>
                <li>• Execução curta e objetiva;</li>
                <li>• Sem depender de motivação.</li>
              </ul>
            </ServiceCard>
          </div>

          <div className="text-center mt-16">
            <blockquote className="font-serif text-xl md:text-2xl text-primary italic">
              &ldquo;Constância não nasce de vontade. Nasce de um plano pequeno que você cumpre.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* Contraste Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <ArtDecoDivider variant="fan" />

          <div className="relative text-center py-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-primary/20 font-serif text-9xl leading-none">
              &ldquo;
            </div>

            <blockquote className="relative z-10">
              <p className="font-serif text-xl md:text-2xl text-foreground leading-relaxed italic mb-8">
                Se o bom curso de Direito exigiria 50 anos para ser ministrado, como pode um aluno que só tem 5 não levar a sério a faculdade?
              </p>
            </blockquote>

            <p className="text-muted-foreground text-lg mb-6">
              O Direito é vasto. O tempo é curto. Os cinco anos da faculdade não comportam improviso, descuido ou estudo desordenado.
            </p>

            <p className="text-primary italic mb-8">
              Este Guia não cria urgência artificial — ele cria postura.
            </p>

            <ul className="inline-flex flex-col items-start gap-3 text-muted-foreground">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-primary rotate-45" />
                <span>A faculdade é base, não detalhe;</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-primary rotate-45" />
                <span>Estudar mal agora cobra juros depois;</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-primary rotate-45" />
                <span>Consciência e método precisam começar cedo.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* O que é / O que não é Section */}
      <section className="py-24 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">Definição</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground text-balance">
              O que é — e o que não é — este Guia
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative p-8 bg-card border border-border">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary" />
              
              <h3 className="font-serif text-2xl text-foreground mb-6 text-center">Este Guia é:</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary mt-2 rotate-45 shrink-0" />
                  <span>Um método em 31 dias;</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary mt-2 rotate-45 shrink-0" />
                  <span>Construído a partir de palestras reais do Prof. Costa Machado;</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary mt-2 rotate-45 shrink-0" />
                  <span>Organizado didaticamente pelo próprio professor;</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary mt-2 rotate-45 shrink-0" />
                  <span>Composto por vídeos curtos e objetivos.</span>
                </li>
              </ul>
            </div>

            <div className="relative p-8 bg-card border border-border">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary" />
              
              <h3 className="font-serif text-2xl text-foreground mb-6 text-center">Este Guia não é:</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-muted-foreground mt-2 rotate-45 shrink-0" />
                  <span>Curso de legislação, peças ou questões;</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-muted-foreground mt-2 rotate-45 shrink-0" />
                  <span>Promessa de aprovação;</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-muted-foreground mt-2 rotate-45 shrink-0" />
                  <span>Maratona de aulas;</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-muted-foreground mt-2 rotate-45 shrink-0" />
                  <span>Atalho acadêmico.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* O que você recebe Section */}
      <section id="o-que-recebe" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <ArtDecoDivider variant="chevron" />
          
          <div className="text-center mb-16">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">Conteúdo</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground text-balance">
              O que você recebe (na prática)
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            {[
              { value: "31", label: "vídeos (lições)" },
              { value: "6", label: "módulos em sequência" },
              { value: "1", label: "ano de acesso" },
              { value: "10h", label: "certificado" }
            ].map((item, i) => (
              <div key={i} className="relative p-6 bg-card border border-border text-center">
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary" />
                <p className="font-serif text-3xl text-primary mb-2">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wider uppercase text-sm px-8 py-6 transition-all duration-300">
              <Link href="/checkout">Quero começar — Dia 1</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* O que você desenvolve Section */}
      <section className="py-24 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">Resultados</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground text-balance">
              O que você desenvolve ao longo dos 31 dias
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              "Mais autonomia nos estudos;",
              "Mais clareza sobre o curso de Direito;",
              "Melhor aproveitamento das aulas;",
              "Hábito de registrar e consolidar conteúdos;",
              "Uso mais consciente de códigos e materiais;",
              "Direção diária para estudar sem improviso."
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 border border-border bg-card">
                <div className="w-2 h-2 bg-primary mt-1.5 rotate-45 shrink-0" />
                <p className="text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <ArtDecoDivider variant="fan" />

          <div className="text-center mb-16">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">Depoimentos</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 text-balance">
              O que alunos relatam após as palestras
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Os relatos abaixo vêm de estudantes que participaram das palestras do Prof. Costa Machado — experiências reais que deram origem ao conteúdo, à abordagem e à estrutura deste Guia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Fui aluna do Costa Machado! E sempre ouço: que oportunidade você teve, que privilégio!",
              "Simplesmente a melhor palestra da minha vida. Direito é vida.",
              "Palestrante nota máxima. É uma experiência que vale muito a pena.",
              "Foi um curso maravilhoso. Obrigada por compartilhar seus conhecimentos.",
              "Ouvir seus conselhos foi fantástico. Gratidão por aquele momento."
            ].map((testimonial, i) => (
              <div key={i} className="relative p-6 bg-card border border-border">
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary" />
                <p className="font-serif text-lg text-foreground italic">&ldquo;{testimonial}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professor Section */}
      <section id="professor" className="py-24 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">Instrutor</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-2 text-balance">
              Quem conduz o Guia
            </h2>
          </div>

          <div className="relative p-8 md:p-12 border border-border bg-card">
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-primary" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-primary" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-primary" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-primary" />

            <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-6 text-center">
              Professor Costa Machado
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

            <p className="text-sm text-muted-foreground italic text-center border-t border-border pt-6">
              O Guia se baseia na palestra &ldquo;A consciência que o aluno de Direito não tem&rdquo;, apresentada a milhares de estudantes em universidades brasileiras.
            </p>
          </div>
        </div>
      </section>

      {/* Oferta Section */}
      <section id="oferta" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <ArtDecoSunburst />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <ArtDecoDivider variant="chevron" />
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">Investimento</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 text-balance">Oferta</h2>
          </div>

          <div className="relative p-8 md:p-12 border border-border bg-card">
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-primary" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-primary" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-primary" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-primary" />

            <div className="text-center">
              <p className="font-serif text-4xl md:text-5xl text-gold-gradient mb-2">R$ 97,00</p>
              <p className="text-muted-foreground mb-2">à vista</p>
              <p className="text-muted-foreground mb-8">ou 12x de R$ 9,68</p>

              <p className="text-foreground mb-8">
                Inclui acesso às aulas e materiais pelo período de 1 ano.
              </p>

              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wider uppercase text-sm px-8 py-6 transition-all duration-300 mb-6">
                <Link href="/checkout">Quero começar agora — Dia 1</Link>
              </Button>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span>Compra segura</span>
                <span className="text-primary">•</span>
                <span>Acesso liberado após o pagamento</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Garantia Section */}
      <section className="py-24 px-6 bg-card/50">
        <div className="max-w-2xl mx-auto">
          <div className="relative p-8 md:p-12 border border-primary text-center">
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-primary" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-primary" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-primary" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-primary" />

            <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4">Garantia de 7 dias</h3>
            <p className="text-muted-foreground">
              Experimente por 7 dias. Se não for para você, solicite o reembolso dentro do prazo.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <ArtDecoDivider variant="stepped" />

          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 text-balance">
            Comece agora com direção
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Se você quer parar de estudar no automático e assumir o controle da sua formação jurídica, este Guia foi feito para você.
          </p>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wider uppercase text-sm px-8 py-6 transition-all duration-300">
            <Link href="/checkout">Quero começar agora — Dia 1</Link>
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-card/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-4">Dúvidas</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground text-balance">
              Perguntas Frequentes
            </h2>
          </div>

          <FAQAccordion />
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

            <div className="text-sm text-muted-foreground text-center">
              <p>suporte@SEUDOMINIO.com</p>
              <p>WhatsApp: +55 (11) 99999-9999</p>
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
