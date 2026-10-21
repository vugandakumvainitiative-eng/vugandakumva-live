# Vugandakumva live

Independent Home, About Us, Awareness, Resources, Find Support and Contact preview based on the approved designs. This folder has no Git repository, hooks, backend, report intake or payment integration.

Find Support now offers urgent contact links, six support-information categories, next-step guidance and native FAQs, using the supplied Donate image only as a visual reference. The directory has a review notice and no search/filter controls or provider listings. Current production preview: http://127.0.0.1:5193/find-support. Source and content-review notes are in `designs/find-support/content-review.md`; measured checks are in `design-qa.md`.

Contact is implemented at `/contact` with published contact details awaiting verification, decorative artwork, organisational connection links and privacy guidance. WhatsApp and online enquiries remain unavailable. No form or data collection is present. Contact reference and provenance: `designs/contact/implementation-review.md`. Production preview: http://127.0.0.1:5194/contact.

## Run

Use Node 24 and pnpm 10 in PowerShell:

```powershell
Set-Location 'C:\Users\VUGANDAKUMVA\Desktop\vugandakumva live'
pnpm dev
```

Open http://127.0.0.1:5190/, http://127.0.0.1:5190/about, http://127.0.0.1:5190/awareness, http://127.0.0.1:5190/resources http://127.0.0.1:5190/find-support or http://127.0.0.1:5190/contact. Stop the server with Ctrl+C.

Dependencies are installed and pinned in pnpm-lock.yaml. To reinstall:

```powershell
pnpm install --frozen-lockfile --store-dir .pnpm-store --cache-dir .pnpm-cache --config.state-dir=.pnpm-state
```

## Verify

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

With the dev server running, run `pnpm test:e2e` in another terminal. Tests use installed Google Chrome, synthetic selections and an intercepted Quick Exit destination; they never dial contacts. Browser screenshots and axe evidence are saved in coverage/browser.

For production-build browser checks:

```powershell
pnpm exec vite preview --host 127.0.0.1 --port 5191 --strictPort
```

In another terminal:

```powershell
$env:HOMEPAGE_TEST_URL='http://127.0.0.1:5191/'
pnpm test:e2e
pnpm exec lighthouse http://127.0.0.1:5191/ --chrome-flags="--headless" '--only-categories=performance,accessibility' --output=json --output=html --output-path=coverage/lighthouse-mobile --no-enable-error-reporting --quiet
```

## Files

- src/pages/about-page.tsx and src/about.css: complete responsive About page, published copy and eight-person team.
- src/features/home: hero, About introduction, awareness cards and support finder.
- src/components: header, emergency bar, Quick Exit, notice and footer.
- src/design and src/styles.css: canonical tokens, self-hosted fonts and responsive styles.
- src/locales: English source and conspicuously marked RW review placeholders.
- public/assets: optimized WebP images, including the supplied logo.
- references: selected mockups, image prompts and original artwork. Generated people are fictional illustrations.
- src/lib, src/store, e2e: safety behavior, ephemeral UI state and focused checks.
- design-qa.md and context/progress-tracker.md: evidence and remaining work.

## Scope and safety

Home, About, Awareness, Resources and Find Support are linked at `/`, `/about`, `/awareness`, `/resources` and `/find-support`. About story/team links stay on the page. Find Support links to general information and the existing emergency numbers; the homepage support finder retains its existing behavior. Awareness footer links reach forms, warning signs and prevention. Partnership and Get Involved links lead to the shared contact section, whose details remain review-pending. The Home finder and Resources catalog retain their existing local controls; Find Support uses a directory review notice without controls. Donations, social connections and WhatsApp are unavailable.

Quick Exit replaces the current entry with Google and clears temporary UI state. It cannot erase earlier browser history, network records or browser traces. Double Escape is also supported. Without JavaScript, the visible fallback is an ordinary link and explicitly explains that limitation.

Only the language preference is stored in localStorage; dismissal of the preview notice is stored per tab in sessionStorage. District and support selections stay in memory. No cookies, external fonts, trackers, sensitive free-text forms, real survivor records or API routes are introduced.

Before any public release: approve safeguarding wording, verify service/contact details, provide and approve native Kinyarwanda translations, and complete a human accessibility review. English placeholders remain marked TODO-REVIEW; they are not final Kinyarwanda.


## Build-time HTML

`pnpm build` compiles the app and renders `/`, `/about`, `/awareness`, `/resources` and `/find-support` into `dist/index.html` and each route's corresponding `dist/[route]/index.html`, with page-specific titles, image preloads and inline styles. About, Awareness, Resources and Find Support CSS are separate build inputs included only in their own snapshots; the dev client loads the corresponding route styles. The result remains a static site; no production Node server is required. The development server renders on the client. Production browser checks cover hydration and returning visitors with saved preferences.


## About navigation and verification

Navigation uses ordinary links, with native refresh and Back/Forward behavior. Both `/about` and `/about/` are supported. The Vite preview middleware serves the About snapshot for the extensionless URL; a future static host must serve `/about/index.html` for `/about` (or redirect to `/about/`), before any homepage fallback. No production server is required.

Restored browser-cache pages reread the existing language and tab-notice preferences. Temporary menu and directory selections clear when leaving a document. The two existing storage keys are unchanged. With JavaScript disabled, production pages retain readable content, navigation and the ordinary-link safety fallback; development retains safety links.

The approved source image is `designs/about-us/about-us-old-site-redesign-v3.png` (identical SHA-256 to the supplied attachment). Copy comes from the saved `-source.txt`; spelling/capitalization and complete team roles are preserved, including the published "Parternership". Initials remain until approved original staff photos are provided. Existing fictional dialogue/community artwork is reused; no staff faces are generated.

For both-page production checks, keep the preview server running and execute:

```powershell
$env:HOMEPAGE_TEST_URL='http://127.0.0.1:5191/'
pnpm test:e2e
pnpm exec lighthouse http://127.0.0.1:5191/ --chrome-flags="--headless" '--only-categories=performance,accessibility' --output=json --output=html --output-path=coverage/lighthouse-home-about-delivery --no-enable-error-reporting
pnpm exec lighthouse http://127.0.0.1:5191/about --chrome-flags="--headless" '--only-categories=performance,accessibility' --output=json --output=html --output-path=coverage/lighthouse-about-delivery --no-enable-error-reporting
```

The browser suite covers both pages at 320, 375, 390, 768, 1024, 1280 and 1536 CSS pixels, including axe. Actual current results and limitations are recorded in `design-qa.md` and `context/progress-tracker.md`; historical scores are not a claim about the latest build.


### About delivery file inventory

- New: `src/pages/about-page.tsx`, `src/about.css`, `public/assets/about-dialogue-small.webp`, `e2e/about.test.mjs`.
- Updated: `src/app.tsx`, `src/main.tsx`, `src/components/header.tsx`, `src/components/footer.tsx`, `src/features/home/about-section.tsx`, `src/features/home/hero-carousel.tsx`, `src/locales/en.ts`, `src/styles.css`, `src/prerender.tsx`, `src/prerender.test.ts`, `scripts/prerender.mjs`, `vite.config.ts`, `index.html`, `package.json`.
- Documentation: `README.md`, `context/progress-tracker.md`, `design-qa.md`.
- Generated local evidence: `coverage/browser/`, mobile Lighthouse HTML/JSON reports in `coverage/`; production output in `dist/`.
- No dependency, lockfile, Git, API, tracker, payment or intake changes. RW inherits the new EN keys through the existing typed review-placeholder resource.

The mobile dialogue image is a 600px WebP encoding of the existing artwork (67,424 bytes); its original remains untouched. Mobile Home uses the existing 600px courtyard asset. Desktop keeps the original artwork. The initial JS bundle remains eager; production gives its download low fetch priority so local fonts and LCP artwork can paint first. Emergency HTML and the ordinary-link fallback are present before it loads.

## Awareness implementation

Production preview: http://127.0.0.1:5191/awareness. Both `/awareness` and `/awareness/` work. Restart an already-running preview server after changes to Vite's route mapping. Future static hosting must serve the route's own `index.html` before a homepage fallback.

The approved image and artwork extraction record live in `designs/awareness/`. Six individual illustrations and two decorative leaf corners are reused as optimized WebP assets; all text, links and icons are semantic React/HTML. The complete mockup is never used as a page background. The canonical full logo remains unchanged.

The original live Awareness page was inspected before adapting its four topics, six warning signs and prevention guidance. `designs/awareness/content-review.md` records omitted legal, clinical and operational claims and pending safeguarding review. No chat, intake, external contact integration or new service promises were added.

Files: `src/pages/awareness-page.tsx`, `src/awareness.css`, eight `public/assets/learn-*.webp` images, `src/locales/en.ts`, shared app/header/footer and navigation links, `src/main.tsx`, `src/prerender.tsx`, `scripts/prerender.mjs`, `vite.config.ts`, `src/prerender.test.ts`, `e2e/awareness.test.mjs` and the updated About navigation test. No dependency or lockfile changes.

The existing verification commands now cover all three pages. For Awareness's mobile Lighthouse report:

```powershell
pnpm exec lighthouse http://127.0.0.1:5191/awareness --chrome-flags="--headless" '--only-categories=performance,accessibility' --output=json --output=html --output-path=coverage/lighthouse-awareness --no-enable-error-reporting --quiet
```

Awareness polish: the form illustrations preserve their portrait proportions, tablet cards use side-by-side copy from 960px, and the closing CTA includes the approved leaf corners. Decorative leaves load lazily and have empty alt text. Fresh results are recorded in `design-qa.md`.

## Resources implementation

Current production preview: http://127.0.0.1:5192/resources. `/resources` and `/resources/` have independent static content and titles. A fresh preview server on 5192 includes the new route mapping; restart older preview processes before using the new route on another port.

```powershell
pnpm dev
# Development: http://127.0.0.1:5190/resources
pnpm build
pnpm exec vite preview --host 127.0.0.1 --port 5192 --strictPort
# In another terminal:
$env:HOMEPAGE_TEST_URL='http://127.0.0.1:5192/'
pnpm test:e2e
```

All nine requested resource topics have disabled verification-pending controls. Five category filters plus All Resources work locally and reset on pagehide/Quick Exit. No selection is stored or placed in a URL. The guide presents four choices without pressure to report. Contact information remains the existing review-pending footer; no new contact destination is enabled. EN/RW keys follow the existing English TODO-REVIEW approach.

New files: `src/pages/resources-page.tsx`, `src/features/resources/resource-catalog.tsx`, its unit test, `src/resources.css`, `e2e/resources.test.mjs`, three `public/assets/resources-*.webp` assets and `designs/resources/` reference/provenance files.

Updated: `src/app.tsx`, `src/main.tsx`, shared header/footer, Awareness's View Resources link, `src/locales/en.ts`, `src/prerender.tsx`, `src/prerender.test.ts`, `scripts/prerender.mjs`, `vite.config.ts`, README, tracker and design QA. The RW resource inherits all EN keys with its existing TODO-REVIEW notice. No new dependencies or router library.

Actual results, visual comparison and remaining review items are recorded in `design-qa.md` and `context/progress-tracker.md`. Static hosting must resolve `/resources` to `/resources/index.html` (or redirect to `/resources/`) before applying a homepage fallback.

The existing production preview on port 5191 was also restarted with the new route mapping. `/resources` works there as well; port 5192 remains the verification preview.

Resources polish keeps category buttons stationary during selection, uses even mobile/tablet filter grids and a compact three-column catalog from 1024px. Latest actual checks and Lighthouse results are in `design-qa.md`.

## Find Support: current support-options page

The supplied Donate design is a visual reference only; donation controls remain unavailable. The Find Support route now uses the requested support-focused copy, six working category links, urgent contacts, next-step guidance, an honest directory review notice, helping-someone guidance and four native FAQs. No Find Support search, selection controls or intake were added. Existing Home/Resources functionality remains.

Files changed for this revision: `src/pages/find-support-page.tsx`, `src/find-support.css`, `src/locales/en.ts`, new `src/lib/emergency-contacts.ts`, `src/components/emergency-bar.tsx`, `vite.config.ts`, `scripts/prerender.mjs`, `src/pages/resources-page.tsx`, `src/resources.css`, `src/prerender.test.ts`, `e2e/find-support.test.mjs`, and documentation/reference records under `designs/find-support/`. The shared number constant preserves the existing four numbers and verification-pending labels in the page, bar and no-JavaScript fallback. Resources gains stable medical-information anchors and scroll clearance. RW inherits the new keys with its existing TODO-REVIEW status.

Only existing approved artwork is used: `learn-intro.webp`, `about-dialogue-small.webp`, `resources-leaves-left.webp` and `resources-leaves-right.webp`. The full logo is unchanged. The supplied reference is archived as `designs/find-support/support-options-reference.png`; current source/verification limitations are in `content-review.md`. Prior wellbeing-page assets and historical measurements remain in the workspace but are no longer the current page.

Run `pnpm dev` and open http://127.0.0.1:5190/find-support. For production: `pnpm build`, then `pnpm exec vite preview --host 127.0.0.1 --port 5193 --strictPort`; open http://127.0.0.1:5193/find-support. Set `$env:HOMEPAGE_TEST_URL='http://127.0.0.1:5193/'` before `pnpm test:e2e`. Hosting must serve `/find-support/index.html` for the extensionless route, as the preview middleware does. Current measured results are recorded in the newest `design-qa.md` entry; older scores describe earlier versions.

Current Find Support verification: lint/typecheck, 14 unit tests and build passed; full production browser suite 40/40, followed by 14/14 affected-route checks after final refinements. Seven-width axe found zero violations. Mobile Lighthouse: 98 performance / 100 accessibility, LCP 2.373s, CLS 0, 232.9 KB transfer and 98.77 KB initial JS gzip. Human content/translation/service/accessibility approvals remain pending; see design QA for full scope and evidence.
