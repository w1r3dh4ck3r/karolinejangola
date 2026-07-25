import { useState } from 'react'
import type { FormEvent } from 'react'
import { AtSign, Mail, MessageCircle } from 'lucide-react'
import { contato } from '../data/content'
import { site } from '../data/site'
import { WA } from '../lib/whatsapp'
import { fireConversion } from '../lib/gtag'
import WhatsAppLink from '../components/WhatsAppLink'

type FormState = 'idle' | 'submitting' | 'ok' | 'error'

// lucide-react (1.26.0) ships no brand icons (Instagram removed for
// licensing) — AtSign is the closest generic substitute for the
// @handle link; the bundle's own icon choice is unverifiable from
// minified output.

/**
 * Section order follows the live bundle exactly (verified directly against
 * assets/index-NAF8EB0S.js, function Rv): H2 -> body -> primary CTA -> the
 * contact form -> the info row. The info row comes AFTER the form, not
 * before it.
 */
export default function Contato() {
  const [state, setState] = useState<FormState>('idle')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setState('submitting')
    try {
      const res = await fetch(site.formspree, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        fireConversion()
        setState('ok')
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  return (
    <section className="bg-primary py-24 text-center md:py-32" id="contato">
      <div className="container mx-auto max-w-5xl px-6 md:px-12">
        <h2 className="mb-4 font-serif text-3xl text-primary-foreground md:text-4xl">{contato.h2}</h2>
        <p className="mx-auto mb-8 max-w-md font-sans leading-relaxed text-primary-foreground/75">
          {contato.body}
        </p>
        <WhatsAppLink
          href={WA.general}
          className="inline-flex items-center gap-3 rounded-lg bg-terracotta px-7 py-3.5 font-sans font-medium text-cream shadow-lg transition-all duration-200 hover:bg-terracotta-dark hover:shadow-xl active:scale-[0.97]"
        >
          <MessageCircle className="h-4 w-4" />
          {contato.ctaLabel}
        </WhatsAppLink>

        {state === 'ok' ? (
          <div className="mx-auto mt-10 max-w-md rounded-xl bg-sage/10 p-8 text-center">
            <p className="font-serif text-lg text-primary-foreground">{contato.form.successMessage}</p>
          </div>
        ) : (
          <form className="mx-auto mt-10 max-w-md space-y-4 text-left" onSubmit={onSubmit}>
            <p className="mb-6 text-center font-sans text-sm text-primary-foreground/70">
              {contato.form.intro}
            </p>
            {contato.form.fields.map((field) => (
              <div key={field.id}>
                <label
                  className="mb-1.5 block font-sans text-sm font-medium text-primary-foreground/80"
                  htmlFor={field.id}
                >
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    className="w-full rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2.5 font-sans text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:border-primary-foreground/50 focus:outline-none"
                    id={field.id}
                    name={field.name}
                    placeholder={field.placeholder}
                    rows={field.rows}
                  />
                ) : (
                  <input
                    className="w-full rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2.5 font-sans text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:border-primary-foreground/50 focus:outline-none"
                    id={field.id}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    type={field.type}
                  />
                )}
              </div>
            ))}
            <button
              className="w-full rounded-lg bg-terracotta px-7 py-3.5 font-sans font-medium text-cream shadow-lg transition-all duration-200 hover:bg-terracotta-dark active:scale-[0.97]"
              disabled={state === 'submitting'}
              type="submit"
            >
              {state === 'submitting' ? contato.form.submittingLabel : contato.form.submitLabel}
            </button>
            {state === 'error' ? (
              <p className="mt-2 text-center font-sans text-sm text-red-400">
                {contato.form.errorMessage}
              </p>
            ) : null}
          </form>
        )}

        <div className="mt-16 flex flex-wrap justify-center gap-10 font-sans text-sm text-primary-foreground/65">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>{contato.infoText}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <a className="transition-colors hover:text-primary-foreground" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
          <a
            className="flex items-center gap-2 transition-colors hover:text-primary-foreground"
            href={site.instagram.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <AtSign className="h-4 w-4" />
            <span>{site.instagram.handle}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
