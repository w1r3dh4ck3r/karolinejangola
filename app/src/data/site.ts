export interface SiteConfig {
  whatsappNumber: string
  email: string
  instagram: {
    url: string
    handle: string
  }
  heroImage: string
  portraitImage: string
  conversionSendTo: string
  formspree: string
  visitorWebhook: string
}

export const site: SiteConfig = {
  whatsappNumber: '557996491276',
  email: 'karoljangola@gmail.com',
  instagram: {
    url: 'https://www.instagram.com/psicanalista_karolinejangola',
    handle: '@psicanalista_karolinejangola',
  },
  heroImage: '/assets/hero-therapy-CgSB5jl3.webp',
  portraitImage: '/assets/therapist-portrait-DhhPXLzJ.avif',
  conversionSendTo: 'AW-16583121961/shGzCIOqipYcEKm4ueM9',
  formspree: 'https://formspree.io/f/xeevlzlb',
  visitorWebhook: 'https://n8n.w1r3d.dev/webhook/visitor',
}
