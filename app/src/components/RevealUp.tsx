import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export interface RevealUpProps {
  children: ReactNode
  className?: string
}

/**
 * Wraps content and applies the `animate-reveal-up` class (see
 * src/styles/index.css) once the element scrolls into view, matching the
 * hero/sobre/testimonial reveal behavior on the live site.
 */
export default function RevealUp({ children, className = '' }: RevealUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`${className} ${revealed ? 'animate-reveal-up' : 'opacity-0'}`.trim()}>
      {children}
    </div>
  )
}
