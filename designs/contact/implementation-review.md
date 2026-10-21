# Contact implementation and source review

20 October 2026. Implemented from `contact-page-design-v1.png`; the user's implementation request supersedes the earlier image-only review status.

- Exact published email, both telephone numbers and Kigali location are retained through existing translation keys. Plain mailto/tel links have no prefilled content. Testing inspects these destinations without opening a mail client or dialling.
- Contact details remain pending operational verification. WhatsApp is plain text with an unavailable-preview notice, not an active destination.
- Source confidentiality, response-time and availability promises are deliberately omitted. No online enquiry form, backend, intake or service promise is introduced.
- Hero typography follows the established bold DM Sans design, with Playfair section headings. Header, full logo, footer, safety bar and language controls are shared unchanged except Contact navigation now targets `/contact`.
- Decorative-only crops from the supplied design: hero (414,166,370,288), volunteer (59,1283,198,112), partnership (305,1283,199,112), awareness (552,1283,197,112). Reproducible source extraction: `extract-artwork.ps1`. WebP derivatives are local; no UI text is baked into them. The supplied low-resolution illustration can look softer on wide screens; a higher-resolution original remains desirable.
- All new strings are EN translation keys. RW inherits them through the existing typed TODO-REVIEW fallback; no unapproved translation is presented as native-reviewed.
- Remaining reviews: operational contact verification, organisation wording and native RW approval. Automated accessibility checks do not replace a manual screen-reader review.

See `design-qa.md` and `context/progress-tracker.md` for measured checks and `coverage/browser/contact-*.png` for rendered evidence.

## Changed files

- `src/pages/contact-page.tsx`, `src/contact.css`, `src/locales/en.ts`
- `src/app.tsx`, `src/main.tsx`, `src/components/header.tsx`, `src/components/footer.tsx`
- `src/prerender.tsx`, `scripts/prerender.mjs`, `vite.config.ts`
- `src/prerender.test.ts`, `e2e/contact.test.mjs`
- `public/assets/contact-{hero,volunteer,partnership,awareness}.webp`
- `designs/contact/extract-artwork.ps1`, decorative `contact-*.png` source crops and this review
- `README.md`, `design-qa.md`, `context/progress-tracker.md`
- Generated build and verification evidence in `dist/` and `coverage/`

## Run verification

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec vite preview --host 127.0.0.1 --port 5194 --strictPort
# In another PowerShell terminal:
$env:HOMEPAGE_TEST_URL='http://127.0.0.1:5194/'
pnpm test:e2e
pnpm exec lighthouse http://127.0.0.1:5194/contact --chrome-flags="--headless" '--only-categories=performance,accessibility' --output=json --output=html --output-path=coverage/lighthouse-contact-isolated --no-enable-error-reporting --quiet
```

Run Lighthouse after other checks finish to avoid CPU contention. The existing preview is currently running on port 5194.

## Contact polish - 20 October 2026

Refined Contact only: capped content width and hero artwork scale, balanced headings, improved notice spacing and focus-within card borders, changed cramped 768-900px involvement cards into horizontal rows, gave mobile email its own full-width row with a natural break before @, and made the mobile immediate-help CTA full width. Shared branding, exact contact strings, translations, navigation and safety behaviour remain unchanged.

Actual checks: lint, typecheck, 15/15 unit tests and production build passed. Contact's six browser tests passed (50.78s), including axe at 320, 375, 768, 1024 and 1440px with zero violations, no overflow, 200% text, keyboard/menu/preferences, navigation, no-JavaScript fallback and both intercepted Quick Exit methods. The full 46-test regression suite was not rerun for this scoped polish; its earlier implementation result below is historical.

Fresh mobile Lighthouse for the retained implementation: performance **90**, accessibility **100**, LCP **2370.90ms**, CLS **0.000120**, transfer **232657 bytes**, initial JS **100.14KB gzip**. The strict performance >90 budget remains unmet; do not substitute the earlier 98 score. Report: `coverage/lighthouse-contact-polish.report.{json,html}`. A font-preload experiment measured 65/100, LCP 2849.92ms and 247307 bytes; it was reverted and the original font-loading strategy rebuilt. Its report is retained as `lighthouse-contact-polish-fonts.report.*`. No claim that every performance budget passes.

Changed application files: `src/contact.css`, `src/pages/contact-page.tsx`. Documentation: this log, design QA and Contact implementation review. Screenshots: `coverage/browser/contact-*.png`. Preview: http://127.0.0.1:5194/contact. Development: `pnpm dev`, http://127.0.0.1:5190/contact.

Safety checklist: emergency links and Quick Exit remain reachable; history limitations and cleanup unchanged; no contacts activated in tests. No intake, tracking, backend, new storage, dependencies, Git or deployment. WhatsApp/online enquiries remain unavailable. Operational contact verification and native RW review are still pending; decorative source artwork remains resolution-limited.

