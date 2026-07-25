import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { WA } from '../lib/whatsapp'
import WhatsAppLink from './WhatsAppLink'

// Bundle-extracted from assets/index-NAF8EB0S.js (array `bs`): only 4 of
// the 6 sections get a nav link — #sobre and #para-quem are not linked.
// Absolute paths (`/#...`) so anchors work from blog pages too.
const NAV_LINKS = [
  { label: 'Tratamentos', href: '/#tratamentos' },
  { label: 'Depoimentos', href: '/#depoimentos' },
  { label: 'Dúvidas', href: '/#faq' },
  { label: 'Contato', href: '/#contato' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  // Not confirmed against the live bundle (inventory flags mobile-menu
  // interactivity as UNVERIFIED) — standard accessible behavior added
  // here: Escape closes the open menu. Confirm in Task 11.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-12">
        <Link className="font-serif text-xl text-foreground" to="/">
          Karoline Jangola
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
          <Link
            className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
            to="/blog"
          >
            Blog
          </Link>
          <WhatsAppLink
            className="rounded-lg bg-primary px-5 py-2 font-sans text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.97]"
            href={WA.general}
            text="Agendar"
          />
        </div>
        <button
          aria-label="Menu"
          aria-expanded={open}
          className="p-2 text-foreground md:hidden"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-b border-border bg-background px-6 pb-6 pt-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              className="block py-3 font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            className="block py-3 font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setOpen(false)}
            to="/blog"
          >
            Blog
          </Link>
          <WhatsAppLink
            className="mt-2 inline-block rounded-lg bg-primary px-5 py-2 font-sans text-sm font-medium text-primary-foreground"
            href={WA.general}
            text="Agendar"
          />
        </div>
      )}
    </nav>
  )
}
