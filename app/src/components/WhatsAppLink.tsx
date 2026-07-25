import type { ReactNode } from 'react'
import { fireConversion } from '../lib/gtag'

export interface WhatsAppLinkProps {
  href: string
  text?: string
  className?: string
  children?: ReactNode
}

/**
 * Every WhatsApp CTA on the site routes through this component so the
 * Google Ads conversion (fireConversion) fires on click, matching the
 * live bundle's onClick={qt} pattern applied to each WhatsApp <a>.
 */
export default function WhatsAppLink({ href, text, className, children }: WhatsAppLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={fireConversion}
      className={className}
    >
      {children ?? text}
    </a>
  )
}
