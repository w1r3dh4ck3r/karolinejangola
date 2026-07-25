import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FaqItem } from '../data/faq'

export interface AccordionProps {
  items: FaqItem[]
}

/**
 * One-open-at-a-time FAQ accordion. Markup/classes match the live bundle's
 * FAQ component exactly (assets/index-NAF8EB0S.js): border-b dividers, a
 * sans-serif question row, and a ChevronDown that rotates 180deg on open.
 * aria-expanded/aria-controls/role are kept even though the bundle's own
 * button omits them — a11y is additive, not a fidelity regression.
 */
export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <div className="w-full">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `faq-panel-${index}`
        const buttonId = `faq-button-${index}`
        return (
          <div key={item.q} className="border-b border-border/60">
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between py-5 text-left font-sans text-base text-foreground transition-colors hover:text-sage"
            >
              <span>{item.q}</span>
              <ChevronDown
                aria-hidden="true"
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={buttonId} className="pb-5 font-sans text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
