export function trackVisit(): void {
  // Belt-and-suspenders guard: skip when the browser announces itself as
  // automated (e.g. Playwright's prerender pass). Not fully reliable —
  // navigator.webdriver isn't set by every launch config — so this is a
  // guard, not the only defense (see also the route-level webhook abort).
  if (typeof navigator !== 'undefined' && navigator.webdriver === true) {
    return
  }

  try {
    fetch('https://n8n.w1r3d.dev/webhook/visitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site: window.location.hostname,
        page: window.location.pathname,
        referrer: document.referrer || 'direct',
        ua: navigator.userAgent,
      }),
      keepalive: true,
    })
  } catch {
    // silently ignore failure
  }
}
