export const WHATSAPP_NUMBER = '557996491276'

export const waUrl = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

export const WA = {
  general: waUrl('Olá, vi seu site e gostaria de mais informações.'),
  paraMim: waUrl('Olá, vim pelo site e gostaria de atendimento para mim.'),
  paraFilho: waUrl('Olá, vim pelo site e gostaria de atendimento para meu filho/a.'),
  blog: waUrl('Olá, vi seu blog e gostaria de mais informações.'),
}
