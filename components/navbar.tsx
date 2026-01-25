"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: "O Guia", href: "#o-guia" },
    { label: "Autonomia", href: "#autonomia" },
    { label: "O Método", href: "#metodo" },
    { label: "O que você recebe", href: "#o-que-recebe" },
    { label: "Professor", href: "#professor" },
    { label: "Oferta", href: "#oferta" },
    { label: "FAQ", href: "#faq" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link href="#o-guia" className="font-serif text-lg text-foreground hover:text-primary transition-colors">
            Guia 31 Dias
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wider uppercase text-xs px-6 transition-all duration-300">
              <Link href="/checkout">Quero começar — Dia 1</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wider uppercase text-xs px-6 mt-2 transition-all duration-300 w-full">
                <Link href="/checkout">Quero começar — Dia 1</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
