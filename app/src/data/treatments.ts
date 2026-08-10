import type { IconName } from './content'

export interface Treatment {
  icon: IconName
  title: string
  body: string
  href?: string
}

export const treatments: Treatment[] = [
  {
    icon: 'heart',
    title: 'Ansiedade',
    body: 'Às vezes a ansiedade aparece como medo, choro fácil, noites mal dormidas ou uma preocupação que não passa. No acompanhamento, ajudo seu filho ou filha a entender o que sente e a lidar com isso, no tempo de cada um.',
    href: '/atendimento/ansiedade-infantil',
  },
  {
    icon: 'brain',
    title: 'TDAH',
    body: 'Sou mãe de um filho com TDAH, então conheço de perto esses desafios. Meu trabalho é o fortalecimento emocional de crianças e adolescentes com TDAH, caminhando junto com a família. Não faço diagnóstico nem laudo.',
    href: '/atendimento/terapia-para-tdah',
  },
  {
    icon: 'users',
    title: 'Relacionamentos e vida social',
    body: 'Muitas crianças e adolescentes têm dificuldade para fazer amigos, vivem conflitos em casa ou na escola, ou se sentem sozinhos. Trabalho para que seu filho ou filha construa vínculos mais firmes no dia a dia.',
    href: '/atendimento/dificuldades-de-relacionamento',
  },
  {
    icon: 'leaf',
    title: 'TEA (autismo)',
    body: 'Acompanho crianças e adolescentes autistas no seu desenvolvimento e no fortalecimento emocional, sempre respeitando o ritmo de cada um. Não realizo testes nem emito laudo; meu foco é acolher e caminhar junto. Sou mãe de uma filha com TEA.',
    href: '/atendimento/apoio-emocional-tea',
  },
  {
    icon: 'sparkles',
    title: 'Autoestima e comportamento',
    body: 'Quando aparecem baixa autoestima, mudanças de comportamento ou insegurança, costuma ser sinal de que algo precisa de atenção. Ajudo seu filho ou filha a reconhecer o próprio valor e a expressar o que sente de um jeito saudável.',
    href: '/atendimento/autoestima',
  },
]
