export default function Footer() {
  return (
    <footer className="bg-foreground py-8">
      <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row md:px-12">
        <p className="font-serif text-sm text-cream/60">
          © {new Date().getFullYear()} Karoline Jangola — Psicanalista e Terapeuta
        </p>
        <p className="font-sans text-xs text-cream/40">Atendimento exclusivamente online</p>
      </div>
    </footer>
  )
}
