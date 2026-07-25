export const WHATSAPP_NUMBER = '557996491276'

export const waUrl = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

export const WA = {
  general: waUrl('Olá, vi seu site e gostaria de mais informações.'),
  blog: waUrl('Olá, vi seu blog e gostaria de mais informações.'),
}
