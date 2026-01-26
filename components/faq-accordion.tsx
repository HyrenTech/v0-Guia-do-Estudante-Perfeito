"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
  {
    question: "Para quem este Guia é indicado?",
    answer: "Para estudantes de Direito de qualquer semestre que querem sair do estudo automático e desenvolver autonomia com consciência, método e direção."
  },
  {
    question: "Preciso de conhecimento prévio?",
    answer: "Não. O Guia é para qualquer semestre. Se você estuda Direito e quer melhorar a forma como estuda, é para você."
  },
  {
    question: "Quanto tempo por dia?",
    answer: "Cerca de 10-15 minutos por dia, seguindo a sequência do Guia. É executável, não é maratona."
  },
  {
    question: "Quantas aulas são?",
    answer: "31 vídeos (lições), organizados em 6 módulos em sequência lógica."
  },
  {
    question: "Por quanto tempo tenho acesso?",
    answer: "Por 1 ano, incluindo aulas, materiais e atualizações. Acesso vitalício ao seu progresso."
  },
  {
    question: "O Guia promete aprovação?",
    answer: "Não. É um método para instalar autonomia de estudo, consciência e postura na formação jurídica — que são a base para qualquer desempenho depois."
  },
  {
    question: "Como acesso o material?",
    answer: "Via plataforma online (acesso web + aplicativo para celular). Você assiste quando quiser, quantas vezes quiser."
  },
  {
    question: "Qual é a garantia?",
    answer: "Garantia de 7 dias: experimente. Se não for para você, solicite reembolso integral dentro de 7 dias — sem perguntas."
  },
  {
    question: "Posso assistir pelo celular?",
    answer: "Sim. App nativo + web responsivo. Você estuda em qualquer lugar."
  }
]

export function FAQAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border-border"
        >
          <AccordionTrigger className="text-left font-serif text-lg text-foreground hover:text-primary py-6">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-6">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
