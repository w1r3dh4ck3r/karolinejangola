import { useState } from 'react'
import type { FaqItem } from '../data/faq'

export interface AccordionProps {
  items: FaqItem[]
}

/**
 * One-open-at-a-time FAQ accordion. The live compiled CSS has no
 * accordion open/close keyframes, so a plain show/hide (no animated
 * height) is faithful — see docs/reference/current-site-inventory.md.
 */
export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <div className="divide-y divide-border">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `faq-panel-${index}`
        const buttonId = `faq-button-${index}`
        return (
          <div key={item.q}>
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left font-serif text-lg text-foreground"
            >
              <span>{item.q}</span>
              <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={buttonId} className="pb-5 font-sans text-muted-foreground">
                {item.a}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
