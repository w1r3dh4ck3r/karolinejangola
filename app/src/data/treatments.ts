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
    body: 'Insônia, pensamentos acelerados, tensão constante — sinais de que algo pede atenção. Juntas, investigamos as raízes dessa ansiedade para que você compreenda o que seus sintomas estão comunicando.',
  },
  {
    icon: 'brain',
    title: 'Depressão',
    body: 'Quando a tristeza se torna persistente e o vazio parece não ter fim, a terapia oferece um espaço seguro para explorar esses sentimentos e identificar os padrões que alimentam o sofrimento.',
  },
  {
    icon: 'users',
    title: 'Relacionamentos',
    body: 'Dependência emocional, medo de abandono, conflitos recorrentes — padrões que se repetem sem percebermos. Exploramos como suas experiências moldaram a forma como você se relaciona.',
  },
  {
    icon: 'leaf',
    title: 'Trauma',
    body: 'Experiências traumáticas deixam marcas que afetam como vivemos e nos relacionamos. A psicanálise oferece um espaço seguro, no seu ritmo, para processar essas experiências sem retraumatizar.',
  },
  {
    icon: 'sparkles',
    title: 'Terapia de Jovens',
    body: 'Crianças e pré-adolescentes muitas vezes não conseguem expressar o que sentem. Como mãe de um filho com TDAH e uma filha com TEA, compreendo de perto esses desafios.',
  },
]
