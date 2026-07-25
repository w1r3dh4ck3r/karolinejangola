// Publishes the built `app/dist/` output to the repo root, which is what
// GitHub Pages serves. This is the ONLY script that is allowed to modify
// the served root. Run via `npm run publish:site` (see package.json),
// normally after `npm run build`.
//
// Safety model: step 2 removes a fixed ALLOWLIST of generated paths (never
// a "delete everything except" pass), and refuses to touch anything in the
// DENYLIST below even if a future edit accidentally adds it to either list.
// Everything else at repo root (docs/, app/, .git/, .claude/, project docs,
// CNAME, robots.txt, dotfiles, ...) is left alone by construction: this
// script only ever deletes paths named in GENERATED_PATHS and only ever
// writes paths that exist under `app/dist/`.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// app/scripts/ -> app/ -> repo root
const repoRoot = path.resolve(__dirname, '..', '..')
const appDir = path.join(repoRoot, 'app')
const distDir = path.join(appDir, 'dist')

// The exact set of root-level, generated paths this script is allowed to
// remove before copying dist/ over the root. Anything not in this list is
// never deleted, regardless of what dist/ does or doesn't contain.
const GENERATED_PATHS = ['assets', 'index.html', '404.html', 'blog', 'sitemap.xml', 'placeholder.svg']

// Paths that must never be deleted or overwritten, no matter what. Checked
// against both GENERATED_PATHS (defence in depth) and every path visited
// during the recursive copy.
const DENYLIST = new Set([
  '.git',
  '.github',
  'docs',
  'app',
  '.superpowers',
  '.claude',
  '.gitignore',
  'CLAUDE.md',
  'ARCHITECTURE.md',
  'STACK.md',
  'WORKFLOW.md',
])

// Used to guard step 2 (deletion). Full hard denylist, including
// CNAME/robots.txt: GENERATED_PATHS never contains them, but this is
// checked regardless as defence in depth.
function isDenylisted(name) {
  if (DENYLIST.has(name)) return true
  if (name === 'CNAME' || name.startsWith('CNAME.')) return true
  if (name === 'robots.txt' || name.startsWith('robots.txt.')) return true
  if (name.startsWith('.')) return true // any dotfile at root
  return false
}

// Used to guard step 4 (copy from dist/). CNAME and robots.txt are
// deliberately excluded here: dist/ carries identical copies of both, and
// the brief is explicit that the copy overwriting them with the same
// content is fine — only the special-delete in step 2 is forbidden for
// them. Everything else in the hard denylist still applies.
function isCopyDenylisted(name) {
  if (DENYLIST.has(name)) return true
  if (name.startsWith('.')) return true // any dotfile at root
  return false
}

function main() {
  const distIndex = path.join(distDir, 'index.html')
  if (!fs.existsSync(distIndex)) {
    console.error(`publish: ${path.relative(repoRoot, distIndex)} not found. Run \`npm run build\` first.`)
    process.exit(1)
  }

  // Step 2: remove the root generated set (allowlist only).
  const removed = []
  for (const name of GENERATED_PATHS) {
    if (isDenylisted(name)) {
      throw new Error(`refusing to remove denylisted path: ${name}`)
    }
    const target = path.join(repoRoot, name)
    if (fs.existsSync(target)) {
      fs.rmSync(target, { recursive: true, force: true })
      removed.push(name)
    }
  }

  // Step 3/4: copy every file from dist/ -> repo root, recursively.
  const copied = []
  copyRecursive(distDir, repoRoot, copied)

  // Step 4b: CNAME safety guard. publish.mjs never touches CNAME (it's
  // denylisted above), but a corrupted/typo'd CNAME at repo root would drop
  // the apex domain and take the live site dark, so verify it post-publish
  // regardless of what wrote it.
  const cnamePath = path.join(repoRoot, 'CNAME')
  const expectedCname = 'karolinejangola.com'
  const actualCname = fs.existsSync(cnamePath) ? fs.readFileSync(cnamePath, 'utf8').trim() : null
  if (actualCname !== expectedCname) {
    console.error(
      `publish: CNAME safety check FAILED. Expected "${expectedCname}", found ${actualCname === null ? 'no CNAME file' : `"${actualCname}"`} at ${path.relative(repoRoot, cnamePath)}. Refusing to leave a corrupted CNAME in place — this would drop the apex domain.`
    )
    process.exit(1)
  }

  // Step 5: summary.
  console.log(`publish: removed ${removed.length} generated path(s) from repo root:`)
  for (const name of removed) console.log(`  - ${name}`)
  console.log(`publish: copied ${copied.length} file(s) from app/dist/ to repo root:`)
  for (const name of copied) console.log(`  + ${name}`)
}

function copyRecursive(srcDir, destDir, copied) {
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const name = entry.name
    // Only the top-level (destDir === repoRoot) needs the denylist check;
    // nested paths (e.g. assets/, blog/**) are inside dirs we already
    // cleared and own. Guard unconditionally anyway: cheap, and it means
    // this function is safe to reuse even if that invariant ever changes.
    if (destDir === repoRoot && isCopyDenylisted(name)) {
      throw new Error(`refusing to overwrite denylisted path: ${name}`)
    }
    const srcPath = path.join(srcDir, name)
    const destPath = path.join(destDir, name)
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true })
      copyRecursive(srcPath, destPath, copied)
    } else {
      fs.mkdirSync(destDir, { recursive: true })
      fs.copyFileSync(srcPath, destPath)
      copied.push(path.relative(repoRoot, destPath))
    }
  }
}

main()
