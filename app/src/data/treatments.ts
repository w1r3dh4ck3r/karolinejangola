import type { IconName } from './content'

export interface Treatment {
  icon: IconName
  title: string
  body: string
}

export const treatments: Treatment[] = [
  {
    icon: 'heart',
    title: 'Ansiedade',
    body: 'Medos, preocupação constante, dificuldade para dormir ou crises de choro — a ansiedade fala alto na infância e adolescência. Acompanho seu filho ou filha para reconhecer e lidar com esses sentimentos, no tempo de cada um.',
  },
  {
    icon: 'brain',
    title: 'TDAH',
    body: 'Um acompanhamento voltado ao fortalecimento emocional de crianças e adolescentes com TDAH — não faço diagnóstico nem laudo. Como mãe de um filho com TDAH, conheço de perto esses desafios e caminho junto com a sua família.',
  },
  {
    icon: 'users',
    title: 'Relacionamentos e vida social',
    body: 'Dificuldade para fazer amigos, conflitos em casa ou na escola, sensação de solidão — as relações moldam o mundo emocional de crianças e adolescentes. Trabalho para que seu filho ou filha construa vínculos mais seguros no dia a dia.',
  },
  {
    icon: 'leaf',
    title: 'TEA (autismo)',
    body: 'Apoio ao desenvolvimento e ao fortalecimento emocional de crianças e adolescentes autistas, sempre respeitando o ritmo de cada um. Não realizo testes nem emito laudo; meu foco é acolher e caminhar junto. Sou mãe de uma filha com TEA.',
  },
  {
    icon: 'sparkles',
    title: 'Autoestima e comportamento',
    body: 'Baixa autoestima, mudanças de comportamento, insegurança — sinais de que algo pede acolhimento. Ajudo seu filho ou filha a reconhecer o próprio valor e a expressar o que sente de forma saudável.',
  },
]
