export type IconName = 'heart' | 'brain' | 'users' | 'leaf' | 'sparkles'

export interface HeroContent {
  eyebrow: string
  h1: string
  body: string
  ctaLabel: string
}

export interface StatTile {
  value: string
  label: string
}

export interface SobreContent {
  eyebrow: string
  h2: string
  /** 4 body paragraphs, bundle array `Nv`. */
  paragraphs: [string, string, string, string]
  /** Highlighted closing line, styled bold, separate from the paragraph array. */
  highlight: string
  stats: [StatTile]
}

export interface ParaQuemContent {
  eyebrow: string
  h2: string
  description: string
  ctaLabel: string
}

export interface SectionHeading {
  eyebrow: string
  h2: string
}

export interface ContactFormField {
  id: string
  name: string
  label: string
  type: 'text' | 'tel' | 'textarea'
  placeholder: string
  required: boolean
  rows?: number
}

export interface ContatoContent {
  h2: string
  body: string
  ctaLabel: string
  infoText: string
  form: {
    intro: string
    fields: ContactFormField[]
    submitLabel: string
    submittingLabel: string
    successMessage: string
    errorMessage: string
  }
}

export const hero: HeroContent = {
  eyebrow: 'Terapia Humanizada',
  h1: 'Você não precisa carregar tudo sozinha',
  body: 'Psicanálise e terapia para crianças e adolescentes. Se a carga está pesada demais, deixe-me ajudar você a encontrar o equilíbrio.',
  ctaLabel: 'Fale comigo pelo WhatsApp',
}

export const sobre: SobreContent = {
  eyebrow: 'Quem sou eu',
  h2: 'Karoline Jangola',
  paragraphs: [
    'Olá, me chamo Karoline. Sou psicanalista e terapeuta, mãe de três filhos e tenho uma vivência muito próxima com o universo do desenvolvimento infantil, incluindo o TDAH e o TEA.',
    'Minha jornada na psicanálise começou justamente pelo desejo de compreender melhor essas condições e oferecer um suporte mais sensível, acolhedor e eficaz — tanto para meus filhos quanto para outras famílias que passam por desafios semelhantes.',
    'Hoje, sou especializada no acompanhamento de crianças e adolescentes. Meu trabalho é ajudar os pequenos a reconhecerem, entenderem e expressarem suas emoções de forma segura, respeitando o tempo e a individualidade de cada um.',
    'Se você percebe que seu filho ou filha está enfrentando dificuldades emocionais, sociais ou comportamentais, posso te ajudar nesse processo com um atendimento humanizado e cuidadoso.',
  ],
  highlight: 'Estou aqui para acolher, orientar e caminhar junto com sua família.',
  stats: [{ value: '100%', label: 'atendimento online' }],
}

export const paraQuem: ParaQuemContent = {
  eyebrow: 'Para quem é este atendimento?',
  h2: 'Encontre o seu caminho',
  description:
    'Para crianças e adolescentes com desafios emocionais, comportamentais ou de aprendizado (TDAH, TEA, ansiedade, dificuldades na escola). Um espaço seguro e acolhedor, no tempo de cada um.',
  ctaLabel: 'Fale comigo pelo WhatsApp',
}

export const tratamentosHeading: SectionHeading = {
  eyebrow: 'Como posso ajudar',
  h2: 'Tratamentos',
}

export const depoimentosHeading: SectionHeading = {
  eyebrow: 'Depoimentos',
  h2: 'O que dizem meus pacientes',
}

export const faqHeading: SectionHeading = {
  eyebrow: 'Tire suas dúvidas',
  h2: 'Perguntas frequentes',
}

export const contato: ContatoContent = {
  h2: 'O primeiro passo é o mais importante',
  body: 'Estou aqui para te ouvir. Vamos encontrar juntas o melhor caminho para você.',
  ctaLabel: 'Agende sua consulta',
  infoText: 'Atendimento online para o Brasil e para brasileiros que vivem no exterior',
  form: {
    intro: 'Prefere escrever primeiro? Deixe seus dados e entrarei em contato.',
    fields: [
      {
        id: 'contact-nome',
        name: 'nome',
        label: 'Nome *',
        type: 'text',
        placeholder: 'Seu nome',
        required: true,
      },
      {
        id: 'contact-telefone',
        name: 'telefone',
        label: 'WhatsApp / Telefone',
        type: 'tel',
        placeholder: '(79) 99999-9999',
        required: false,
      },
      {
        id: 'contact-mensagem',
        name: 'mensagem',
        label: 'O que te trouxe até aqui? (opcional)',
        type: 'textarea',
        placeholder: 'Pode compartilhar um pouco sobre o que está sentindo...',
        required: false,
        rows: 3,
      },
    ],
    submitLabel: 'Enviar mensagem',
    submittingLabel: 'Enviando...',
    successMessage: 'Mensagem recebida! Entrarei em contato em breve.',
    errorMessage: 'Erro ao enviar. Tente diretamente pelo WhatsApp.',
  },
}
