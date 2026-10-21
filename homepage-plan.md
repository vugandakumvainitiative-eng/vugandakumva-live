# Homepage implementation plan

Date: 20 October 2026
Status: Approved by user on 20 October 2026; implemented in this standalone folder. Lighthouse installation additionally approved. The preparation notes below are retained as historical scope.
Workspace: C:\Users\VUGANDAKUMVA\Desktop\vugandakumva live
Git: none. Do not initialize Git, add hooks, create branches or publish a PR.

## First delivery

Build one responsive, local-preview homepage from the four selected images in the original project's frontend design folder. About Us is the next delivery, using about-us-page-v1.png; its full page is not part of this first implementation. The new folder is an independent frontend, not a copy of the backend or a continuation of the old unit branches.

## Files

- package.json, pnpm-lock.yaml, pnpm-workspace.yaml if needed for allowed build scripts, index.html, vite.config.ts, tsconfig.json, eslint.config.mjs, README.md.
- src/main.tsx, src/app.tsx, src/styles.css, src/design/tokens.css and src/design/fonts.css.
- src/components/header.tsx, emergency-bar.tsx, quick-exit.tsx, safety-notice.tsx, footer.tsx and project-owned reusable controls.
- src/features/home/hero-carousel.tsx, about-section.tsx, awareness-section.tsx and support-finder.tsx; src/pages/home-page.tsx.
- src/lib/i18n.ts, src/lib/quick-exit.ts, src/locales/en.ts, src/locales/rw.ts and src/store/ui-store.ts.
- public/assets/ for the actual supplied logo and optimized illustration/scenery assets; references/ for the selected mockups and their limitations.
- Focused tests alongside behavior files, e2e/homepage.test.mjs, design-qa.md and context/progress-tracker.md.

## Ordered work

1. Create the frontend scaffold with React 19.2, TypeScript 5.9, Vite 7 and Tailwind 4.3 using the exact patches already present in the original project's lockfile. Reuse its approved self-hosted DM Sans/Playfair Display, Lucide, i18next/react-i18next, Zustand and existing lint/test libraries. Install only this reviewed frontend set; no backend, Git hooks or new library choice. Package additions beyond that set require approval. Consult Context7 before coding library APIs.
2. Copy the actual supplied Vugandakumva Logo.png, never a generated logo approximation. Preserve the selected illustration art direction and fictional status. Create separate optimized image assets where only full-page mockups exist; do not turn screenshots into the webpage. Keep all interface text as accessible HTML. Reuse canonical tokens, including dark text on bright green.
3. Build the static/eager safety shell, responsive header and mobile menu. Retain 112, 3512, 3029 and 116, the approved Google Quick Exit destination, double Escape, immediate ephemeral-state cleanup and honest history limitations. Static no-JavaScript fallback explains its normal-link limitation. Keep preview-only contact/native-language status explicit.
4. Implement the homepage in order: split hero and shortcut cards; About introduction; three GBV awareness cards; compact support finder; four-column footer. The five-topic hero has previous/next and play/pause controls. Follow the recorded seven-second Home-only exception: stop on keyboard/touch/manual interaction until explicit Play; pause while hovered, hidden or offscreen; disable autoplay for reduced motion. Safety controls remain outside it.
5. Connect Home/About/Awareness/Find Support to real homepage sections for this first delivery. The full About route comes next. Support controls allow district/type selection and reset, then show the explicit verification-pending directory state; do not fabricate providers or availability. Donate remains clearly unavailable with no payment action. Footer links are enabled only with verified destinations; no hash-only fake links, social embeds, trackers or sensitive WhatsApp prefill. Recheck published organisational details before wiring contact links; do not dial or send messages.
6. All strings use EN/RW keys. RW placeholders remain conspicuously TODO-REVIEW and English-source passages retain the correct language attribute until native review. No operational promises or final safety translations are invented. About mission/vision/values remain draft for the later About delivery.
7. Run the checks below, compare the rendered homepage to all four references, fix significant defects, and open the verified local preview in the browser and VS Code. Keep a record of actual results and remaining limitations.

## Verification and run commands

Use pnpm dev for the frontend-only server on loopback. README will contain the exact port and start/stop instructions.

Run pnpm lint, pnpm typecheck, pnpm test, pnpm build and pnpm test:e2e. Add focused tests for carousel pause rules, menu/focus behavior, language/storage-denied behavior, support selections and both Quick Exit activation methods. Intercept external exit navigation in tests; never dial contacts.

Inspect at 320, 375, 390, 768, 1024, 1280 and 1536 pixels, plus keyboard-only navigation, 200% browser zoom, long translated text, reduced motion, disabled JavaScript and failed assets. Use browser/Playwright verification, axe and visual comparison at matching viewports. Check mobile Lighthouse performance >90, accessibility >95, initial JS <=150 KB gzip, first load <=1 MB, LCP <2.5 seconds and CLS <0.1. Missing tooling or evidence is reported, never called a pass; additional tooling installs need approval.

## Boundaries and risks

This delivery is a local frontend preview. No API/database integration, report intake, payments, staff authentication, production deployment or Git operations. The user has expressly chosen the generated designs for implementation; their fictional people are illustrations, never claims of actual survivors or staff. Source/mockup dimensions and header typography vary, so normalize them with the established type/token system. Footer contacts, safeguarding copy and native RW remain subject to human review. Browser history and language preference can reveal visits; Quick Exit cannot erase them. Browser testing must substantiate safety behavior rather than infer it from the mockups.

## Approval requested

Approve this bounded homepage implementation and installation of the existing pinned frontend libraries. This authorizes necessary scaffold, asset preparation, local preview and verification in this folder. It does not approve About Us draft copy or a public release.

## Preparation evidence and safety checklist

Only this plan and the new folder's progress tracker are written so far. No implementation files or dependencies have been added. Runtime tests have not run; no runtime readiness is claimed.

- Usage disclosure: no new runtime behavior yet; history/storage limitations are included in implementation acceptance.
- Personal data: none added or collected.
- API authorization: no new API routes; auth decorators/matrix changes are not applicable.
- Secrets/real data: none read, copied or introduced; private environment files are excluded.
- Language and safety: EN/RW structure and static/eager safety controls are required, not yet implemented here.
- Tests/budgets: planned above; no tests, axe or Lighthouse pass claimed during planning.

