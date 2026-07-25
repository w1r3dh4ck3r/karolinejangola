export type IconName = 'heart' | 'brain' | 'users' | 'leaf' | 'sparkles'

export interface HeroContent {
  eyebrow: string
  h1: string
  body: string
  ctaLabel: string
  /** Raw (un-encoded) WhatsApp pre-filled message text — build the wa.me link with encodeURIComponent. */
  ctaText: string
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
  stats: [StatTile, StatTile]
}

export interface AudienceCard {
  key: string
  icon: IconName
  description: string
  ctaLabel: string
  /** Raw (un-encoded) WhatsApp pre-filled message text — build the wa.me link with encodeURIComponent. */
  ctaText: string
}

export interface ParaQuemContent {
  eyebrow: string
  h2: string
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
  /** Raw (un-encoded) WhatsApp pre-filled message text — build the wa.me link with encodeURIComponent. */
  ctaText: string
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
  body: 'Psicanálise e terapia para mulheres e crianças. Se a carga está pesada demais, deixe-me ajudar você a encontrar o equilíbrio.',
  ctaLabel: 'Fale comigo pelo WhatsApp',
  ctaText: 'Olá, vi seu site e gostaria de mais informações.',
}

export const sobre: SobreContent = {
  eyebrow: 'Quem sou eu',
  h2: 'Karoline Jangola',
  paragraphs: [
    'Olá, me chamo Karoline. Sou psicanalista e terapeuta, mãe de três filhos e tenho uma vivência muito próxima com o universo do desenvolvimento infantil, incluindo o TDAH e o TEA.',
    'Minha jornada na psicanálise começou justamente pelo desejo de compreender melhor essas condições e oferecer um suporte mais sensível, acolhedor e eficaz — tanto para meus filhos quanto para outras famílias que passam por desafios semelhantes.',
    'Hoje, sou especializada no acompanhamento de crianças e pré-adolescentes, com certificação de qualidade ISO 9001. Meu trabalho é ajudar os pequenos a reconhecerem, entenderem e expressarem suas emoções de forma segura, respeitando o tempo e a individualidade de cada um.',
    'Se você percebe que seu filho ou filha está enfrentando dificuldades emocionais, sociais ou comportamentais, posso te ajudar nesse processo com um atendimento humanizado e cuidadoso.',
  ],
  highlight: '💬 Estou aqui para acolher, orientar e caminhar junto com sua família.',
  stats: [
    { value: '100%', label: 'atendimento online' },
    { value: 'ISO 9001', label: 'certificado de qualidade' },
  ],
}

export const paraQuem: ParaQuemContent = {
  eyebrow: 'Para quem é este atendimento?',
  h2: 'Encontre o seu caminho',
}

export const audienceCards: AudienceCard[] = [
  {
    key: 'adult',
    icon: 'heart',
    description:
      'Mulheres que enfrentam ansiedade, depressão, trauma ou dificuldades nos relacionamentos. Um espaço seguro, só seu, para o que você carrega — sem julgamento.',
    ctaLabel: 'Quero cuidar de mim',
    ctaText: 'Olá, vim pelo site e gostaria de atendimento para mim.',
  },
  {
    key: 'child',
    icon: 'sparkles',
    description:
      'Crianças e adolescentes com desafios emocionais, comportamentais ou de aprendizado — TDAH, TEA, ansiedade, dificuldades na escola.',
    ctaLabel: 'Quero ajuda para meu filho/a',
    ctaText: 'Olá, vim pelo site e gostaria de atendimento para meu filho/a.',
  },
]

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
  ctaText: 'Olá, vi seu site e gostaria de mais informações.',
  infoText: 'Atendimento online para todo o Brasil',
  form: {
    intro: 'Prefere escrever primeiro? Deixe seus dados e entrarei em contato.',
    fields: [
      {
        id: 'contact-nome',
        name: 'contact-nome',
        label: 'Nome *',
        type: 'text',
        placeholder: 'Seu nome',
        required: true,
      },
      {
        id: 'contact-telefone',
        name: 'contact-telefone',
        label: 'WhatsApp / Telefone',
        type: 'tel',
        placeholder: '(79) 99999-9999',
        required: false,
      },
      {
        id: 'contact-mensagem',
        name: 'contact-mensagem',
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
