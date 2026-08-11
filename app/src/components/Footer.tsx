import { Link } from 'react-router-dom'

const atendimentoLinks = [
  { to: '/atendimento/terapia-infantil', label: 'Terapia infantil' },
  { to: '/atendimento/terapia-para-adolescentes', label: 'Terapia para adolescentes' },
  { to: '/atendimento/ansiedade-infantil', label: 'Ansiedade' },
  { to: '/atendimento/terapia-para-tdah', label: 'TDAH' },
  { to: '/atendimento/apoio-emocional-tea', label: 'TEA (autismo)' },
  { to: '/atendimento/autoestima', label: 'Autoestima' },
  { to: '/atendimento/comportamento-infantil', label: 'Comportamento' },
  { to: '/atendimento/dificuldades-de-relacionamento', label: 'Relacionamentos e timidez' },
  { to: '/atendimento/orientacao-para-pais', label: 'Orientação para pais' },
]

export default function Footer() {
  return (
    <footer className="bg-foreground py-8">
      <div className="container mx-auto max-w-6xl px-6 md:px-12">
        <nav aria-label="Páginas de atendimento" className="mb-6 border-b border-cream/10 pb-6">
          <p className="mb-3 font-sans text-xs uppercase tracking-widest text-cream/40">
            Como posso ajudar
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
            {atendimentoLinks.map((link) => (
              <li key={link.to}>
                <Link
                  className="font-sans text-sm text-cream/60 transition-colors hover:text-terracotta"
                  to={link.to}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-serif text-sm text-cream/60">
            © {new Date().getFullYear()} Karoline Jangola — Psicanalista e Terapeuta
          </p>
          <p className="font-sans text-xs text-cream/40">Atendimento exclusivamente online</p>
        </div>
      </div>
    </footer>
  )
}
