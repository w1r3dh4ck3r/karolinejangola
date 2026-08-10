# Keyword research — pt-BR child/adolescent therapy (2026-08-09)

Grounding input for the SP2 IA/keyword-map spec. Sourced web research; conditions/services
and the claim boundary come from [`practice-facts.md`](./practice-facts.md).

**Caveat:** "Rel. demand" below is a *directional* read from Google autocomplete / "People
also ask" / competitor-targeting patterns — **not measured volume** (no Keyword Planner/Ahrefs/
Semrush was used). Treat as prioritization signal, not a forecast.

## §1 Title regulation — psicanalista, NOT psicóloga (hard constraint)
"Psicólogo/a" is a **legally protected title** in Brazil requiring CRP registration
(Lei nº 4.119/1962; Lei nº 5.766/1971 art. 10 — title + psychology-exclusive acts like
diagnosis and psychological testing are gatekept by the CFP/CRP system). "Psicanalista" and
"terapeuta"/"psicoterapeuta" are **not regulated** — livre exercício, only a CBO occupation
code (2.515-50), no council, multiple regulation bills never passed.

**SEO implication:** target `psicanalista infantil/adolescente` and `terapeuta infantil/
adolescente` head terms. "psicólogo infantil" terms may appear ONLY in supporting/FAQ copy
that *clarifies she is not a psicóloga* — never claimed in a meta title, H1, or JSON-LD as her
credential. Targeting that space would be both false-advertising risk and a promise of
diagnóstico/laudo/testes she does not provide.

## §2 Candidate keyword clusters (each = one candidate page)

| Cluster | Type | Suggested slug | Primary query | Secondary queries | Rel. demand | Intent |
|---|---|---|---|---|---|---|
| Terapia infantil online | Service | `terapia-infantil` | terapia infantil online | psicanalista infantil online; terapia para criança 8 anos; psicoterapia infantil à distância | High | Transactional |
| Terapia para adolescentes online | Service | `terapia-para-adolescentes` | terapia para adolescentes online | psicoterapia para adolescente; terapeuta para adolescente online; ajuda psicológica para adolescente | High | Transactional |
| Orientação para os pais | Service | `orientacao-para-pais` | orientação para pais | como lidar com meu filho; aconselhamento para pais; apoio para mães | Medium | Transactional/Info |
| Acompanhamento contínuo (pacote) | Service | `acompanhamento-continuo` | acompanhamento terapêutico infantil | pacote terapia + orientação para pais; terapia infantil mensal | Low–Medium | Transactional |
| Ansiedade infantil e adolescente | Condition | `ansiedade-infantil` | terapia para ansiedade infantil | ansiedade infantil sintomas; meu filho tem ansiedade; ansiedade em adolescentes; crises de choro (fold-in) | High | Mixed |
| TDAH — acompanhamento terapêutico | Condition | `terapia-para-tdah` | terapia para criança com TDAH | acompanhamento psicológico TDAH infantil; psicoterapia TDAH; como ajudar filho com TDAH | High (therapy-intent) | Transactional |
| TEA / Autismo — apoio emocional | Condition | `apoio-emocional-tea` | psicanalista para criança com autismo | terapia para criança autista; como ajudar filho autista; acompanhamento emocional TEA | Medium (therapy-intent) | Transactional |
| Comportamento infantil | Condition | `comportamento-infantil` | terapia para problemas de comportamento infantil | criança com birra frequente; desobediência infantil o que fazer | Medium | Mixed |
| Dificuldades de relacionamento / timidez | Condition | `dificuldades-de-relacionamento-social` | terapia para dificuldade de relacionamento na adolescência | criança tímida terapia; ansiedade social infantil; filho sem amigos; criança que se sente sozinha (fold-in) | Medium | Transactional |
| Autoestima infantil e adolescente | Condition | `autoestima-infantil-adolescente` | terapia para baixa autoestima infantil | autoestima do adolescente; filha com baixa autoestima; como melhorar autoestima da criança | Medium–High | Mixed |

## §3 Off-limits / negative keywords (do NOT target; disclaim defensively)
Any **diagnóstico / laudo / teste / avaliação / plano de saúde** intent is out of scope:
- **TDAH:** "teste de TDAH online", "laudo de TDAH", "diagnóstico de TDAH", "avaliação neuropsicológica TDAH", "CID TDAH".
- **TEA:** "laudo de autismo", "diagnóstico de autismo", "teste de autismo online", "laudo para escola", "laudo para BPC/LOAS" (laudo ties to legal-benefit access → needs a médico).
- **Cross-cutting:** "convênio", "plano de saúde aceita", "reembolso unimed/amil/…" — she is particular-only.
- **Comportamento:** avoid "diagnóstico/laudo de TOD".

Handling: a short reassuring FAQ block on relevant condition pages — e.g. *"Não realizo laudos
ou testes diagnósticos — meu trabalho é o fortalecimento emocional e o acompanhamento contínuo.
Se você busca um laudo, procure um neuropediatra ou psiquiatra."* Captures the query defensively
without competing for it, and protects against misrepresentation.

## §4 Fold-in notes (thin standalone topics)
- **crises de choro** → H2 within `ansiedade-infantil` (framed as an anxiety/dysregulation signal).
- **solidão infantil** → H2/FAQ within `dificuldades-de-relacionamento-social`.
- **comportamento** — defensible as its own page, but keep strictly support-at-home framed, not assessment.

## §5 Blog/informational ideas (later sprint — SP5)
- "Qual a diferença entre psicólogo e psicanalista infantil?" (also defuses the §1 title question)
- "Terapia infantil online funciona? O que esperar da primeira sessão"
- "Como saber se meu filho precisa de terapia" (strong parent-anxiety query)
- "O que é psicanálise infantil"
- "Sinais de que seu filho está sofrendo emocionalmente" (umbrella → links to condition pages)
- "Como funciona a orientação para pais na terapia infantil"
- "TDAH e TEA: qual a diferença entre terapia e diagnóstico" (reinforces §3 boundary)
- "Terapia para adolescentes: o que os pais devem saber"

## §6 Sources
- CRP-03 — exercício da psicoterapia por não-psicólogas/os: https://www.crp03.org.br/exercicio-psicoterapia-nao-psicologas/
- ONP — validade e regulamentação: https://www.onp.org.br/mais/validade-e-regulamentacao
- Jusbrasil — psicanálise não é profissão regulamentada: https://www.jusbrasil.com.br/noticias/psicanalise-nao-pode-ser-exercida-como-profissao-no-brasil/112338528
- FEBRAPSI — regulamentação da psicanálise: https://febrapsi.org/publicacoes/noticias/sobre-a-regulamentacao-da-psicanalise-pela-preservacao-da-psicanalise-baseada-na-etica-e-na-rigorosa-formacao-de-seus-profissionais/
- CRP — exercício ilegal da profissão de psicólogo/a: https://www.serdigital.com.br/gerenciador/clientes/crp/arquivos/149.pdf
- TDAH Brasil — avaliação online: https://www.tdahbrasil.com.br/avaliacao-tdah-online-confiavel/
- Autismo e Realidade — diagnóstico e profissional: https://autismoerealidade.org.br/2025/08/30/como-diagnosticar-o-autismo-e-qual-profissional-procurar/
- PSITTO — ansiedade infantil: https://www.psitto.com.br/blog/ansiedade-infantil/
- Einstein — ansiedade em crianças: https://www.einstein.br/n/vida-saudavel/ansiedade-em-criancas
- Clínica SiM — TOD: https://www.clinicasim.com/blog/pediatria/tod-transtorno-opositor-desafiador-quando-a-birra-vira-um-sinal-de-alerta/
- Unimed — timidez na infância/adolescência: https://viverbem.unimed.coop.br/familia-em-foco/infancia-e-adolescencia/timidez-na-infancia-e-adolescencia/
- Infantastica — baixa autoestima infantil: https://infantastica.com.br/blog/baixa-autoestima-infantil
- pepsic/bvsalud — papel dos pais na psicoterapia infantil: https://pepsic.bvsalud.org/scielo.php?pid=S1806-24902008000200009&script=sci_arttext
