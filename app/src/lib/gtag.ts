export const CONVERSION_SEND_TO = 'AW-16583121961/shGzCIOqipYcEKm4ueM9'

export function fireConversion(): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', { send_to: CONVERSION_SEND_TO })
  }
}
