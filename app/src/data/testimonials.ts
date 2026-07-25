export interface Testimonial {
  name: string
  role: string
  quote: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Roseane',
    role: 'Mãe de paciente',
    quote:
      'Estou sentindo uma diferença imensa na minha filha depois que ela começou a fazer terapia. Eu tinha muito preconceito com terapia online, achava que não funcionava. Hoje vejo que era puro preconceito. Terapia online funciona, sim! Sou muito grata pelo excelente trabalho e por todo cuidado com a minha filha.',
  },
  {
    name: 'Ana Carolina',
    role: 'Paciente adulta',
    quote:
      'Você está me mostrando quem sou eu mesma. Sem ter necessidade de acreditar em migalhas, traições e enganações. Sou grata a Deus por ter colocado você no meu caminho.',
  },
  {
    name: 'Lívia',
    role: 'Paciente adulta',
    quote:
      'Sou muito grata por ti. Fez que pudesse ir atrás da minha paz. Sei que está difícil, mas creio que tudo vai ser organizado na minha cabeça e serei feliz com a minha própria companhia. Você me trouxe leveza, o que eu estava precisando.',
  },
]
