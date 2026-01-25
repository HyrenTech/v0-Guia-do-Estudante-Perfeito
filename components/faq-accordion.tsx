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
    question: "Quanto tempo por dia?",
    answer: "Cerca de 10 minutos por dia, seguindo a sequência do Guia."
  },
  {
    question: "Quantas aulas são?",
    answer: "31 vídeos (lições), organizados em sequência."
  },
  {
    question: "Por quanto tempo tenho acesso?",
    answer: "Por 1 ano, incluindo aulas e materiais."
  },
  {
    question: "O Guia promete aprovação?",
    answer: "Não. É um método para instalar autonomia de estudo e postura na formação jurídica."
  },
  {
    question: "Como funciona a garantia?",
    answer: "Você pode solicitar reembolso em até 7 dias, dentro do prazo da garantia."
  },
  {
    question: "Posso assistir pelo celular?",
    answer: "Sim."
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
