# Vugandakumva design and safety review

## Contact polish - 20 October 2026

Refined Contact only: capped content width and hero artwork scale, balanced headings, improved notice spacing and focus-within card borders, changed cramped 768-900px involvement cards into horizontal rows, gave mobile email its own full-width row with a natural break before @, and made the mobile immediate-help CTA full width. Shared branding, exact contact strings, translations, navigation and safety behaviour remain unchanged.

Actual checks: lint, typecheck, 15/15 unit tests and production build passed. Contact's six browser tests passed (50.78s), including axe at 320, 375, 768, 1024 and 1440px with zero violations, no overflow, 200% text, keyboard/menu/preferences, navigation, no-JavaScript fallback and both intercepted Quick Exit methods. The full 46-test regression suite was not rerun for this scoped polish; its earlier implementation result below is historical.

Fresh mobile Lighthouse for the retained implementation: performance **90**, accessibility **100**, LCP **2370.90ms**, CLS **0.000120**, transfer **232657 bytes**, initial JS **100.14KB gzip**. The strict performance >90 budget remains unmet; do not substitute the earlier 98 score. Report: `coverage/lighthouse-contact-polish.report.{json,html}`. A font-preload experiment measured 65/100, LCP 2849.92ms and 247307 bytes; it was reverted and the original font-loading strategy rebuilt. Its report is retained as `lighthouse-contact-polish-fonts.report.*`. No claim that every performance budget passes.

Changed application files: `src/contact.css`, `src/pages/contact-page.tsx`. Documentation: this log, design QA and Contact implementation review. Screenshots: `coverage/browser/contact-*.png`. Preview: http://127.0.0.1:5194/contact. Development: `pnpm dev`, http://127.0.0.1:5190/contact.

Safety checklist: emergency links and Quick Exit remain reachable; history limitations and cleanup unchanged; no contacts activated in tests. No intake, tracking, backend, new storage, dependencies, Git or deployment. WhatsApp/online enquiries remain unavailable. Operational contact verification and native RW review are still pending; decorative source artwork remains resolution-limited.

## Contact implementation - 20 October 2026

Implemented `/contact` from the approved Contact design with a bold DM Sans hero, decorative envelope/foliage artwork, exact published contact details, an unavailable-online-enquiries notice, immediate-help link, volunteer/partnership/awareness cards and privacy guidance. Shared header/footer navigation now targets `/contact`; direct loading, trailing slash, refresh and static HTML are supported. Existing footer anchors remain valid. Other pages and safety/storage behaviour are preserved.

Validation on the final production build:
- `pnpm lint`, `pnpm typecheck`, `pnpm test` (15/15), `pnpm build` and `pnpm test:e2e` (46/46, 161.50 seconds) passed.
- Real Chrome screenshots and axe at 320, 375, 768, 1024 and 1440px: zero WCAG A/AA violations; no horizontal overflow; all artwork decoded. Inspected the reference against the rendered screenshots in `coverage/browser/contact-*.png`.
- Keyboard skip/focus/mobile menu, language and safety-notice persistence, 200% text, section links, navigation/Back/Forward/refresh, missing images, reduced-motion context and JavaScript-disabled safety passed. Both Quick Exit methods were intercepted and cleanup checked. No telephone, email or messaging action was opened.
- Fixed an enlarged-text overflow caused by the mobile immediate-help button's left margin. Initial test failures also identified incorrect menu sequencing in the new test; final suite passes without forced clicks.
- Mobile Lighthouse isolated result: performance **98**, accessibility **100**, LCP **2223.37ms**, CLS **0.000120**, transfer **232349 bytes**; initial JS **100.10KB gzip**. All documented budgets pass in this isolated measurement. Reports: `coverage/lighthouse-contact-isolated.report.{json,html}`.
- Earlier Lighthouse run overlapped lint/typecheck: performance **90**, accessibility **100**, LCP **2288.57ms**, CLS **0.000120**, same transfer. This run did not meet the strict performance >90 budget; retained in `coverage/lighthouse-contact.report.{json,html}`. No application changes occurred between the two audits.

Content/safety checklist: 112/3512/3029/116 and tested Quick Exit remain eager; no-JavaScript fallback and honest history limitations retained. Public contact strings are exact and marked pending verification; WhatsApp stays unavailable. No contact form, sensitive prefill, backend, tracker, embed, new storage or service promise. EN keys use the existing typed RW TODO-REVIEW English fallback. Full approved logo retained. No Git, package installation or deployment.

Remaining reviews: operational contact verification, organisation wording, native RW approval and manual screen-reader assessment. Artwork extracted only from decorative regions of the supplied reference can look soft at larger sizes; higher-resolution original illustrations would improve fidelity. Provenance and crop coordinates: `designs/contact/implementation-review.md`. Preview: http://127.0.0.1:5194/contact. Development: `pnpm dev`, then http://127.0.0.1:5190/contact.

## Find Support support-options redesign - 20 October 2026

Replaced the previous wellbeing/filter layout at `/find-support` with the user's revised support-options brief. The supplied Donate image informs branding/layout only; no giving functionality was added. Implemented the exact requested hero, urgent-contact section, six linked support categories, next-step questions, exact directory review notice, helping-someone guidance and four native FAQs. The directory has no search, filter or input controls. Home's finder and all existing pages remain operational. Shared header/footer/logo/emergency bar and Quick Exit remain eager.

Only approved existing artwork is reused (Awareness introduction, About dialogue and Resources leaves). The image does not identify pictured people as survivors or providers. Reference and provenance: `designs/find-support/support-options-reference.png` and `content-review.md`. All new copy uses EN keys with the existing typed RW TODO-REVIEW fallback. No dependencies or Git operations.

Emergency-label review found no approved verified descriptions for all four numbers. Existing `Call [number] - verification pending` accessible labels are retained with the existing em dash; visible descriptions are pending. 3029 is not labelled Police. New `src/lib/emergency-contacts.ts` centralizes 112/3512/3029/116 for the shared bar, page and no-JavaScript fallback. Resources gains a medical-information anchor and scroll clearance for incoming topic links. No providers, operational promises, intake, accounts, trackers, embeds, location requests, sensitive storage or new service destinations were introduced. Intake remains absent/unavailable; no active intake feature flag exists in this source tree.

Actual checks: **pnpm lint, pnpm typecheck, 14/14 unit tests and pnpm build passed**. Full production browser suite: **40/40 passed (124.92s)**. After the final artwork/leaf blending and Resources anchor-clearance changes, affected-route browser checks passed **14/14 again (42.82s)**. Checked 320, 375, 390, 768, 1024, 1280 and 1536px with **zero axe WCAG A/AA violations and no horizontal overflow**. Screenshots visually reviewed: `coverage/browser/find-support-redesign-*.png`; width comparison: `find-support-options-widths.png`; preview: `find-support-options-preview.png`.

Browser coverage includes all six category destinations, native navigation/Back/Forward/refresh, correct static content/title and hydration, keyboard skip link/menu/focus/FAQ, saved language and safety preferences, 200% text, reduced motion, failed artwork, no-JavaScript emergency links/native FAQs and absence of third-party runtime requests. Both Quick Exit methods were intercepted; no contact links were dialled or messaged. Development direct-load/anchors/FAQ/refresh smoke passed (`coverage/find-support-redesign-dev.json`).

Fresh final mobile Lighthouse: **98 performance / 100 accessibility, LCP 2.373s, CLS 0, 232,932 bytes initial transfer**. Initial JavaScript **98.77 KB gzip**. All documented budgets pass on this measurement. Report: `coverage/lighthouse-find-support-options.report.{html,json}`. Older scores describe earlier versions; other pages' Lighthouse audits were not repeated in this revision. Scores are lab measurements, not field guarantees.

Remaining: approved service labels and operational details for emergency contacts, verified provider records, safeguarding/legal/clinical content review, native RW approval, manual assistive-technology review, and source-resolution artwork softness. No known automated accessibility failure remains. Preview: http://127.0.0.1:5193/find-support. Run `pnpm dev` for http://127.0.0.1:5190/find-support. Full changed-file inventory and production run instructions are in README.


## Find Support polish - 20 October 2026

Refined hero heading proportions, section-heading line lengths, card-action alignment, mobile edge-to-edge artwork, expandable-guide labels/arrows, professional-question icons and FAQ open/hover states. Service filters now have visible selection checkmarks, stable geometry and mobile icon-over-label tiles. Corrected narrow-screen wrapping and a filter-container width regression discovered through browser screenshots; added assertions for full container width and unchanged button dimensions after selection. Existing copy, logo, artwork files, clinical/service review notices and safety/storage behavior are preserved.

Actual checks: lint, typecheck, 14 unit tests and build passed. The full browser run passed all 33 existing-page checks and exposed the new filter-layout issues. After fixes, the final Find Support browser check passed (21.33s), covering all seven widths, axe, selection geometry, anchors, refresh/Back, saved preferences, FAQ keyboard behavior, both intercepted Quick Exit methods, enlarged text, failed images and no-JavaScript fallback. All seven widths have zero axe violations and no horizontal overflow. Dev direct-load/filter/refresh smoke passed. Refreshed screenshots were inspected against the approved design: `coverage/browser/find-support-*.png`, `find-support-polish-widths.png` and `find-support-polish-preview.png`.

Fresh final production mobile Lighthouse: **98 performance / 100 accessibility, LCP 2.374s, CLS 0, 248,240 bytes transfer**. Initial JS **98.80 KB gzip**. All documented budgets pass on this measurement, including the previously missed LCP threshold. Report: `coverage/lighthouse-find-support-polished.report.{html,json}`. The earlier polish audit preceded the final layout correction; the final report is authoritative for this version. Other pages' Lighthouse audits were not repeated. Measurements vary and do not guarantee field performance.

Files changed: `src/find-support.css`, `src/pages/find-support-page.tsx`, `e2e/find-support.test.mjs`, README and both review/progress documents. No packages, Git, service integrations or new storage. Existing emergency labels/links, eager Quick Exit, double-Escape, cleanup and honest history limitations remain. Clinical/local-directory/contact, native RW and manual assistive-technology reviews remain pending. Preview: http://127.0.0.1:5193/find-support; development: `pnpm dev`, then http://127.0.0.1:5190/find-support.


## Find Support implementation - 20 October 2026

Implemented `/find-support` from the first approved mental-wellbeing attachment. Added hero anchors, three expandable guidance cards, professional-support questions, temporary district/type filters, honest verification state, supporting-others/groups guidance and five native expandable FAQs. Shared safety/header/footer/logo, existing preferences and native navigation remain. Home shares the extracted district list; Awareness support CTAs now reach Find Support. All five routes receive independent build-time HTML. New EN keys are covered by the existing RW TODO-REVIEW placeholder.

Actual checks: lint, typecheck, **14/14 unit tests** and production build passed. Full production browser suite **34/34 passed (111.21s)**. Following artwork compression, the Find Support browser test passed again; following font-preload changes the final route check passed again (20.89s). Seven rendered widths (320, 375, 390, 768, 1024, 1280, 1536) had zero axe WCAG A/AA violations and no horizontal overflow. Screenshots inspected against the reference; tightened hero crop to remove mockup lettering. Evidence: `coverage/browser/find-support-*.png` and `find-support-results.json`. Dev direct load, selection and refresh smoke passed (`coverage/find-support-dev-smoke.json`).

Final mobile Lighthouse: **96 performance / 100 accessibility, LCP 2.525s, CLS 0, 247,561 bytes transfer**. Initial JS **98.66 KB gzip**. Performance/accessibility/CLS/JS/transfer budgets pass; **LCP remains 0.025s above the strict <2.5s budget**. Do not treat this as an all-budget pass. Earlier audits (2.518s and 2.645s LCP) are retained; artwork compression cut hero bytes from 42,790 to 29,806, then route font preloads removed layout shift. Final report: `coverage/lighthouse-find-support-fonts.report.{html,json}`. Other pages' Lighthouse scores were not remeasured for this change.

Safety checks: existing 112/3512/3029/116 links and labels; intercepted button/double-Escape Quick Exit; temporary filter reset on navigation; saved preferences; keyboard FAQ operation; reduced-motion contexts; enlarged 200% text; missing images; no-JavaScript static guidance, native FAQs, disabled filters and emergency fallback. No contacts were dialled or messaged. No new storage, sensitive URL parameters, forms, providers, claims of confidentiality/free care/availability, trackers, dependencies or Git operations. Browser extension handoff was unavailable; actual Chrome verification was performed with the installed Playwright test harness.

Remaining review: clinical/counselling and safeguarding wording, local service/contact verification, native RW translation, manual assistive-technology review and source-resolution artwork softness. WHO stress source and exact artwork provenance are recorded in `designs/find-support/content-review.md`. The empty state explicitly avoids implying that no help exists. Production preview: http://127.0.0.1:5193/find-support. Development: http://127.0.0.1:5190/find-support.


## Resources polish - 20 October 2026

**final result: passed** for the local preview. This entry records the polish-specific results; earlier measurements below remain historical.

Reserved checkmark space in every category button so switching selection does not move or resize controls. Mobile filters now form an even two-column grid with single-line labels at 320px and 48px minimum targets. Tablet filters use three columns at 768-1023px. The catalog now uses three card columns from 1024px, with full-width descriptions below icon/title through 1199px. Card descriptions align at the top instead of distributing spare space between rows. All copy, artwork, availability states and safety/privacy behavior remain unchanged.

Inspected refreshed directory captures at 320, 375, 390, 768, 1024, 1280 and 1536px against the approved source. Corrected narrow filter wrapping and tablet description alignment after the first visual pass. Evidence: `coverage/browser/resources-final-*.png` and refreshed `resources-comparison.png`. The final 320px and 1024px captures confirm those corrections.

Actual checks: `pnpm lint`, `pnpm typecheck`, 13/13 unit tests and production build passed. Full browser suite: **33/33 passed (126.91s)**. After the last route-only CSS corrections, Resources browser checks passed **7/7 again (48.80s)**, including seven-width axe and the new regression assertion that category controls keep identical geometry across every selection. No overflow or axe violations. Development direct load/filter/refresh passed with no page errors.

Fresh Resources mobile Lighthouse: **92 performance / 100 accessibility, LCP 2.492s, CLS 0, 230.0 KB initial transfer**. Initial JavaScript remains **95.69 KB gzip**. All Resources budgets pass. Report: `coverage/lighthouse-resources-polish.report.{html,json}`; summary: `coverage/resources-polish-budget-results.json`. Home/About/Awareness browser regressions were rerun, but their Lighthouse audits were not repeated in this polish pass; their previous scores below are historical. Scores vary with execution conditions and are not guarantees.

Safety verification includes existing emergency links, intercepted button/double-Escape Quick Exit, cleanup, saved preferences, no-JavaScript fallback, keyboard/menu/focus, reduced motion, 200% root text and unavailable contact/resource actions. No calls/messages, new storage, dependencies, Git or service integrations. Native RW, provider/contact details, safeguarding/legal/clinical wording and manual assistive-technology review remain pending. Source-resolution artwork softness remains a P3 item.

Changed: `src/resources.css`, `src/features/resources/resource-catalog.tsx`, `e2e/resources.test.mjs`, README, tracker, this QA record and generated evidence. Preview: http://127.0.0.1:5192/resources (also port 5191). Run `pnpm dev` for http://127.0.0.1:5190/resources.

## Resources delivery - 20 October 2026

**final result: passed** for the local preview. This entry records the latest four-page build; prior entries below remain historical.

Workspace confirmed before editing: `C:\Users\VUGANDAKUMVA\Desktop\vugandakumva live`. No applicable AGENTS.md was found in the workspace or checked ancestors. No Git, branches, commits, dependency installation or other-project changes.

### Implementation and visual review

Built `/resources` and `/resources/` with the existing React stack, native navigation and independent build-time HTML/title/styles. Reused the full supplied logo, shared emergency bar/header/Quick Exit/footer, self-hosted fonts, buttons and canonical tokens. Header/footer Resources links and Awareness's View Resources CTA now reach the catalog. Find Support keeps its existing destination.

Nine resource topics, five categories plus All Resources, an announced result count, visible selected checkmarks and keyboard-operable filters are implemented. The empty catalog state is tested; current categories all contain topics. Filters remain in React memory, reset on pagehide and Quick Exit, and never enter URLs or browser storage. All nine card actions are disabled with Details pending verification. The options guide presents four choices without pressure to report. Contact CTA reaches existing review-pending footer information; no external contact action was added.

Source: `designs/resources/approved-design.png` (965 x 1630). The exact hero and two decorative leaf regions were extracted as individual WebP assets. No full mockup, generated text/logo, new faces or unverified service claims are used as UI. `designs/resources/content-review.md` records decisions, categories, provenance and the official React hydration reference consulted.

Compared source and production in `coverage/browser/resources-comparison.png` at normalized widths. Inspected hero and directory at 320, 375, 390, 768, 1024, 1280 and 1536px, plus options/contact sections. Full captures and crops: `resources-final-*.png`. Mobile descriptions use full card width below the icon/title. The shared canonical shell, review notices, larger accessible controls and honest limitations intentionally make the page taller than the reference.

Resolved during implementation: lint errors in the initial filter hydration approach; test-only TypeScript query typing errors; mint-background leaf reuse that did not match the white closing section; narrow mobile description columns. Final verification below supersedes those intermediate failures. P3: original illustration resolution limits large-screen sharpness.

### Actual verification

| Check | Result |
|---|---|
| `pnpm lint` | Passed |
| `pnpm typecheck` | Passed |
| `pnpm test` | 13/13 tests passed across 5 files |
| `pnpm build` | Passed; all four static documents emitted |
| `pnpm test:e2e` | 33/33 passed, 91.67s |
| Final Resources-only browser run after mobile CSS refinement | 7/7 passed, 35.03s |
| Axe WCAG A/AA | Zero violations across all four pages at seven widths; final Resources rerun also zero |
| Horizontal viewport overflow | None at seven widths; enlarged-text check also passed |
| Development smoke | Direct load, Education filter and refresh passed at 390px; no page errors |
| Initial JavaScript | 95.69 KB gzip |

Browser coverage includes direct loading, refresh, native Back/Forward, active navigation, Home/About/Awareness/Resources links, all category counts, keyboard activation/focus/menu/skip link, contact/safety anchors, disabled actions, approved emergency-link hrefs, reduced motion, 200% root text, saved language/notice preferences, hydration, failed images, no-JavaScript static content and both intercepted Quick Exit methods. Unit tests cover empty results and pagehide/exit category cleanup. No cookies or new storage keys; no third-party runtime requests; no contacts dialled or messaged. Chrome extension preview inspection initially timed out, then opened successfully; repeatable browser evidence uses installed Chrome through Playwright.

| Fresh mobile Lighthouse | Performance | Accessibility | LCP | CLS | Initial transfer |
|---|---:|---:|---:|---:|---:|
| Resources | 98 | 100 | 2.300s | 0 | 229.9 KB |
| Home | 97 | 100 | 2.494s | 0.000139 | 394.7 KB |
| About | 97 | 100 | 2.402s | 0.000085 | 266.7 KB |
| Awareness | 98 | 100 | 2.220s | 0 | 270.6 KB |

All documented budgets pass in these measured runs. Reports: `coverage/lighthouse-resources.report.{html,json}` and `lighthouse-{home,about,awareness}-resources.report.{html,json}`. Summary: `coverage/resources-budget-results.json`. Development evidence: `coverage/browser/resources-dev-smoke.json`. Scores are measurements, not guarantees across devices/networks.

### Safety and pending approval

- Existing 112, 3512, 3029 and 116 links/labels are unchanged. 3029 is not relabelled Police.
- Eager button/double-Escape Quick Exit, cleanup, honest history limitations and useful no-JavaScript fallback are retained. All exit navigation in tests was intercepted.
- No WhatsApp destination or sensitive prefill, intake, AI chat, trackers, embeds, notifications, provider locations, bookings or downloads were added.
- All new strings use EN/RW resources; RW inherits English TODO-REVIEW placeholders. Existing privacy/storage protections remain intact.
- Pending: provider/contact numbers, charges, availability, eligibility and service scope; safeguarding/legal/clinical wording; native RW approval; human screen-reader/assistive-technology review. Enlarged-text testing uses 200% root sizing, not a claimed manual browser zoom audit.

Changed files are inventoried in README. Production preview: http://127.0.0.1:5192/resources. Development: http://127.0.0.1:5190/resources. Port 5192 uses a fresh preview process with the new route mapping; restart an older preview process before expecting it to serve `/resources` correctly.

## Awareness polish - 20 October 2026

**final result: passed** for the local preview. This entry contains the latest build results; earlier entries below are historical.

Polished the approved composition: form artwork now preserves portrait proportions without cover-cropping; the 960-1099px layout puts illustrations beside the copy; the closing CTA has the two exact botanical corners extracted from the approved image. Leaves blend into the mint background, sit below content on phones, have empty alt text and cannot intercept pointer input. They load lazily to protect the initial render. Existing copy, canonical logo, shared safety controls and preferences remain unchanged.

Compared fresh production captures against the approved design. Inspected the forms and CTA at 320, 375, 390, 768, 1024, 1280 and 1536px. Evidence: `coverage/browser/awareness-final-*.png` and `awareness-comparison.png`. The original low-resolution illustration softness remains a P3 item; higher-resolution approved originals are still desirable. The previously omitted leaf ornaments are resolved.

### Actual final-build verification

- `pnpm lint`, `pnpm typecheck`, `pnpm test` (10/10), `pnpm build`: passed.
- `pnpm test:e2e`: **26/26 passed**, 79.54s. Axe returned zero violations and no viewport overflow on all three pages at all seven widths.
- Browser coverage: direct load/refresh, Home/About/Awareness navigation, Back/Forward, anchors, keyboard/focus/menu, reduced motion, 200% root text, missing images, no JavaScript, saved preferences, hydration and both intercepted Quick Exit methods.
- Development direct load/refresh at 390px: correct title, four forms, two lazy leaf images, no overflow or page errors. Evidence: `coverage/browser/awareness-polish-dev-smoke.json`.
- Initial JavaScript: **93.16 KB gzip**. All routes retain their own build-time HTML.

| Fresh mobile Lighthouse | Performance | Accessibility | LCP | CLS | Initial transfer |
|---|---:|---:|---:|---:|---:|
| Awareness | 98 | 100 | 2.359s | 0 | 268.1 KB |
| Home | 97 | 100 | 2.494s | 0.000139 | 392.2 KB |
| About | 99 | 100 | 2.259s | 0.000085 | 264.1 KB |

All documented budgets pass. Reports: `coverage/lighthouse-{awareness,home-awareness,about-awareness}-polish-final.report.{html,json}`; summary: `coverage/awareness-polish-budget-results.json`. An earlier eager-background version measured 2.4997s Awareness LCP; lazy decorative images reduced it to 2.359s in the final audit. The intermediate report is retained. These are measured runs, not guarantees for every device or network.

### Safety and review

Emergency 112/3512/3029/116, eager Quick Exit, double Escape, cleanup, honest history limitations, no-JavaScript fallback and existing storage protections remain intact. Tests intercepted exit navigation; no contacts were dialled or messaged. No services, intake, trackers, embeds, payments or notifications were added. EN/RW content is unchanged; native RW, safeguarding/legal/clinical, organisation/contact and manual assistive-technology review remain pending. Enlarged text uses 200% root sizing, not a claimed manual browser-zoom audit.

Changed implementation: `src/awareness.css`, `src/pages/awareness-page.tsx`, two `public/assets/learn-leaves-*.webp` assets. Updated extraction/provenance: `designs/awareness/extract-artwork.ps1`, `art-leaves-*.png`, `content-review.md`. Updated README and tracker; refreshed local browser/Lighthouse evidence. No Git or dependency installation.

Preview: http://127.0.0.1:5191/awareness. Run `pnpm dev` for http://127.0.0.1:5190/awareness; production: `pnpm build`, then `pnpm preview -- --port 5191`.

## Awareness delivery - 20 October 2026

**final result: passed** for the local preview. This entry supersedes earlier metrics below. Safeguarding, native translation and public-release approval remain separate human reviews.

Production: http://127.0.0.1:5191/awareness. Development: http://127.0.0.1:5190/awareness.

### Source and visual comparison

The selected source is `designs/awareness/approved-design.png` (848 x 1855), copied from the supplied attachment. The original live Awareness page was inspected in Chrome before adapting its educational topics. `designs/awareness/content-review.md` records the source, omitted legal/clinical/operational claims and artwork provenance.

Six individual illustrations were extracted from the approved image and encoded as WebP. The full mockup is not shipped. All text, headings, controls and icons remain semantic HTML/React. The complete supplied logo, self-hosted fonts, canonical greens and shared safety/header/footer remain unchanged.

Compared `coverage/browser/awareness-comparison.png`: selected source and actual 1280 CSS-pixel production capture normalized to 600px wide, preserving aspect ratio. The source image's CSS viewport metadata is unknown, so this is a hierarchy/proportion comparison, not a claim of pixel-identical viewport matching.

Inspected hero, forms and warning-sign layouts at 320, 375, 390, 768, 1024, 1280 and 1536px. Full captures: `awareness-final-{width}.png`; section crops: `awareness-final-{hero,intro,forms,signs,prevention,cta}-{width}.png`. Final crops come from full-page captures with production styles, avoiding fixed-control artifacts introduced by earlier element-only screenshots. All images were decoded before capture.

### Findings resolved

- **P1 contrast:** the hero subtitle initially inherited dark paragraph text. It now explicitly uses white. The first browser run had 24 passes and one contrast failure; subsequent complete runs pass.
- **P2 tablet crop:** a fixed image height cropped the hero figure at 768px. Intrinsic proportions now preserve the figure.
- **P2 content integrity:** early reuse of existing generic artwork was replaced by the six approved illustration regions. The intro crop excludes adjacent generated lettering. No new faces were generated.
- **P2 performance:** initial Awareness LCP was 2.557s. A narrow-screen subtitle reservation removed font-swap movement (CLS 0.0203 to zero in the final audit). Preloading the existing display and UI font weights eliminated late font discovery; final LCP is 2.365s. Intermediate reports are retained in `coverage/lighthouse-awareness-*.report.json`.
- **Accessibility refinement:** experimental offscreen rendering was removed because Chrome's accessibility inspection omitted unrendered sections. Awareness renders all its educational sections normally. Safety controls were eager throughout.

Intentional differences: the shared canonical header/footer, full logo, review notices and accessible touch sizing make the page taller than the mockup. Phone layouts stack the four forms and preserve complete copy. **P3 (resolved in the polish entry above):** CTA leaf ornaments were initially omitted; higher-resolution original illustration files would improve sharpness at large display sizes. Neither affects content or navigation.

### Actual verification

| Check | Result |
|---|---|
| `pnpm lint` | Passed |
| `pnpm typecheck` | Passed |
| `pnpm test` | 10 tests passed across 4 files |
| `pnpm build` | Passed; all three static documents and route styles emitted |
| `pnpm test:e2e` | 26/26 passed in the final complete production run, 82.76s |
| Axe WCAG A/AA | Zero violations on all three pages at all seven required widths |
| Horizontal viewport overflow | None at all seven widths |
| Initial JavaScript | 93.10 KB gzip |
| Development smoke | Direct Awareness load and refresh: 4 forms, correct title/styles, no overflow or page errors |

Browser coverage includes direct loading, refresh, Home/About/Awareness navigation, Back/Forward, active navigation, titles, section links, keyboard skip/focus/menu, reduced motion, 200% root text, failed images, JavaScript-disabled content/navigation, saved preferences, no third-party runtime loads and both intercepted Quick Exit methods. A regression test compares the mobile hero position with fonts blocked and loaded. The first cold development navigation timed out; the completed retry passed. No dependency installation was performed.

| Fresh mobile Lighthouse | Performance | Accessibility | LCP | CLS | Initial transfer |
|---|---:|---:|---:|---:|---:|
| Awareness | 98 | 100 | 2.365s | 0 | 267.8 KB |
| Home | 91 | 100 | 2.255s | 0.000139 | 392.1 KB |
| About | 97 | 100 | 2.397s | 0.000085 | 264.0 KB |

All documented budgets pass. Reports: `coverage/lighthouse-awareness.report.html`, `lighthouse-home-awareness.report.html`, `lighthouse-about-awareness.report.html`, with adjacent JSON. Machine-readable summary: `coverage/awareness-budget-results.json`. Home/About audits were taken after shared changes; subsequent optimizations affect only Awareness HTML/CSS.

### Safety checklist and remaining review

- Emergency numbers 112, 3512, 3029 and 116 remain reachable with at least 44px targets.
- Button and double-Escape Quick Exit, tab cleanup and honest history limitations are retained; external navigation was intercepted in tests.
- Useful no-JavaScript safety links and full static educational content remain available.
- Existing language and notice storage keys are unchanged. No selections or sensitive input were added to URLs or storage.
- No contact was dialled or messaged. No AI chat, intake, trackers, embeds, notifications, payments, reporting or unverified services were enabled.
- All new copy uses EN/RW keys; RW remains English TODO-REVIEW. Legal, clinical, safeguarding, organisation/contact and native RW review remain pending.
- Manual screen-reader/assistive-technology review is still pending. Enlarged-text testing uses 200% root font size; it is not a claim of a manual browser-zoom audit.

README contains run/test commands and the changed-file inventory. No Git or dependency/lockfile changes.

## Latest polish verification - 20 October 2026

This entry supersedes the earlier numerical results and screenshot dimensions below. The earlier implementation review is retained as history.

- Improved heading wrapping, mobile team density, long-name containment, programme icon sizing and subtle pale-green section treatments. Mobile team cards now place initials beside the name and role; desktop retains the approved four-column hierarchy.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` (9 tests), `pnpm build` and `pnpm test:e2e` (19/19, 68.61s) all passed on the polished build.
- Both pages: zero axe violations and no horizontal viewport overflow at 320, 375, 390, 768, 1024, 1280 and 1536px. Navigation, keyboard/menu/focus, anchors, reduced motion, enlarged text, failed images, no-JavaScript fallback, saved preferences and intercepted Quick Exit checks passed.
- Fresh visual evidence: `coverage/browser/polish-hero-{width}.png`, `polish-team-{width}.png`, `polish-cta-{width}.png` and refreshed `about-page-{width}.png`. Hero and team captures were inspected at all seven widths; CTA captures at 320, 390, 768 and 1280. Focused polish captures temporarily use a nonsticky emergency bar solely to avoid screenshot occlusion; full-page and functional tests use production styles.
- Updated `coverage/browser/about-comparison.png` compares the approved design with the polished production page. Original copy, full logo and existing artwork remain intact. Botanical CTA ornaments remain an intentional visual omission.

| Fresh mobile Lighthouse | Performance | Accessibility | LCP | CLS | First load |
|---|---:|---:|---:|---:|---:|
| Home | 93 | 100 | 2.484s | 0.000139 | 390.0 KB |
| About | 98 | 100 | 2.392s | 0.000085 | 261.9 KB |

Initial JavaScript: **90.95 KB gzip**. All documented budgets pass; Home LCP is close to its threshold. Reports: `coverage/lighthouse-home-polish.report.html` and `coverage/lighthouse-about-polish.report.html`, with adjacent JSON. The first CLI attempt failed before auditing because PowerShell split the categories argument; the corrected quoted invocation completed successfully.

Safety checklist: all four emergency links remain reachable; button/double-Escape exits are intercepted in tests; tab cleanup and history limitations remain; no-JavaScript safety content remains; no contact was dialled or messaged; no intake, payments, tracking or unverified services were enabled. Native RW, organisation/programme/contact review, approved portraits and human safeguarding/accessibility review remain pending.

## Earlier implementation review

20 October 2026. Production preview: http://127.0.0.1:5191/about

## Final result

final result: passed

No outstanding P0/P1/P2 findings. Required checks passed on the final application build. This qualifies the local preview, not safeguarding or public-release approval. Historical homepage QA is preserved in `coverage/design-qa-home-history.md`.

## Visual evidence

- Source: `designs/about-us/about-us-old-site-redesign-v3.png`, 841 × 1870 pixels. SHA-256 matches the supplied attachment: `FC492430773EF1702A931D15982596192CBD2CBAF5911B12978F36BAE174620D`.
- Exact copy: the adjacent `-source.txt`, read as UTF-8. Generated lettering was not authoritative.
- Desktop: `coverage/browser/about-page-1280.png`, 1280 × 3405 pixels, 1280 CSS-pixel viewport, DPR 1. English, default review notice visible, reduced motion, top of page, closed menu.
- Full comparison: `coverage/browser/about-comparison.png`. Both images normalized to 600px display width, preserving aspect ratio. Source CSS viewport metadata is unknown; this is a width-normalized hierarchy comparison.
- Focused comparison: `coverage/browser/about-hero-comparison.png`. Source hero crop `(0,115,841,260)` and rendered 1280px hero, each normalized to 600px wide.
- Inspected full pages at 320, 375, 390, 768, 1024, 1280 and 1536px: `about-page-{width}.png`. Heights: 7569, 7256, 7057, 4805, 4231, 3405 and 3484px. Homepage captures: `home-{width}.png`.
- Readable section evidence at every width: `about-hero-{width}.png`, `about-story-{width}.png`, `about-team-{width}.png`.
- Additional evidence: `about-no-js.png`, `about-text-200.png`, `about-team-text-200.png`. Element-only captures can include the sticky safety bar at the viewport boundary; full-page comparisons start at the top.

## Findings and comparison history

1. **P1 fixed: route hydration.** Preview initially served Home HTML for `/about`. Explicit mapping now serves About. Final navigation, reload, Back/Forward and no-JavaScript checks pass without console/page errors.
2. **P2 fixed: illustration crops.** Initial windows exposed adjacent collage edges. Adjusted crops; final windows show dialogue/community scenes. Original artwork is unchanged.
3. **P2 fixed: hero typography.** Increased desktop heading scale to match the hierarchy and checked wrapping.
4. **P2 fixed: tablet story.** The 768px story had a narrow column and excess whitespace. It now stacks below 1000px; `about-story-768.png` confirms readable copy.
5. **P1 fixed: layout shift.** An intermediate build used a normal-flow safety fallback and measured CLS 0.311. Final HTML keeps it fixed while JavaScript loads, with a normal-flow noscript override. Both final CLS values are below 0.001.
6. **P2 fixed: mobile LCP.** Earlier runs exceeded 2.5s. Smaller mobile artwork, separate About CSS and low download priority for the still-eager module resolved this.
7. **Test-only correction.** A selector matched Resources and Find Support; it now uses the intended name. The initial suite had 17 passes and 2 failures; the final uninterrupted suite passes all 19.

Post-fix evidence is the final captures and comparison boards above.

## Fidelity surfaces

- **Typography:** existing self-hosted DM Sans/Playfair Display, canonical buttons and heading hierarchy. Accents and complete roles are readable HTML. Staff portraits remain initials.
- **Layout:** split hero, three purpose columns, story, four-column desktop team, two-column tablet team, single-column narrow-phone team, CTA and shared footer. Emergency targets remain at least 44 × 44 CSS pixels.
- **Colors/tokens:** shared greens, neutral text, focus rings, fonts, buttons and spacing reused. Pale green sections follow the approved hierarchy. Axe found no contrast violations.
- **Imagery:** full supplied logo proportionally contained, without cropping or duplicated wordmark. Existing fictional artwork supplies both illustration windows. Mobile uses a 600px encoding; desktop retains the original. No full mockup is shipped as a webpage.
- **Content:** original mission, vision, values, three story paragraphs, eight exact names/roles and CTA retained. “Parternership” remains as published for editorial review. Programme details stay in the original paragraph with three icon labels beneath. No reach statistics are asserted.
- **Intentional differences:** complete prose/roles and existing accessible footer/safety sizing make the page taller. Reused illustrations differ from the generated painting; the existing story panel is landscape. These follow the approved source/component reuse plan.
- **P3 polish:** CTA botanical edge ornaments are not reproduced. Its content, hierarchy, colors and controls are implemented; the ornament difference does not affect use.

## Actual verification

| Check | Result |
|---|---|
| `pnpm lint` | Passed |
| `pnpm typecheck` | Passed |
| `pnpm test` | 9 passed across 4 files |
| `pnpm build` | Passed; both static pages, titles and route CSS emitted |
| `pnpm test:e2e` | 19/19 passed in one final production run, 66.18s |
| Axe | Zero violations on both pages at all seven widths |
| Horizontal viewport overflow | None at all seven widths |
| Initial JavaScript | 90.95 KB gzip |

Coverage: Home/About links, direct `/about`, refresh, Back/Forward, active navigation, titles, story/team/home anchors, keyboard skip/focus/menu, reduced motion, preferences, 200% root text, failed artwork, disabled JavaScript and zero third-party loads. Default hydration and saved-preference rendering are covered.

Button and double-Escape Quick Exit were intercepted locally. No number or contact was dialled or messaged. Tab cleanup is asserted; existing unit tests cover temporary-state cleanup.

Development mobile navigation/direct load/reload smoke passed: eight cards, correct title, no overflow/errors (`coverage/browser/dev-smoke.json`). An initial cold navigation timed out; the completed retry passed after Vite prepared dependencies. None were installed.

### Mobile Lighthouse

Default simulated mobile, local production build; decimal KB.

| Page | Performance | Accessibility | LCP | CLS | First-load transfer |
|---|---:|---:|---:|---:|---:|
| Home | 97 | 100 | 2.413 s | 0.000139 | 390.0 KB |
| About | 98 | 100 | 2.357 s | 0.000085 | 261.7 KB |

All budgets pass: performance >90, accessibility >95, LCP <2.5s, CLS <0.1, initial JS ≤150 KB gzip, first load ≤1 MB.

Reports: `coverage/lighthouse-home-about-delivery.report.{json,html}` and `coverage/lighthouse-about-delivery.report.{json,html}`. These are lab measurements, not deployed field data. Earlier failing runs motivated the fixes above.

## Safety checklist

- [x] Eager emergency 112, 3512, 3029, 116 and Quick Exit on both pages.
- [x] Button/double-Escape exit, cleanup and honest history/browser/device/network limitations retained.
- [x] Useful ordinary-link no-JavaScript fallback; static content/navigation retained.
- [x] Existing language localStorage and tab-notice sessionStorage keys only. Temporary choices clear on departure; cached pages reread preferences.
- [x] New copy uses EN keys inherited by typed RW. RW stays TODO-REVIEW; English placeholder content retains `lang=en`.
- [x] Organisation/programme/contact review notices retained; no invented statistics, biographies or personal links.
- [x] No intake, chatbot, trackers, embeds, payments/reporting, sensitive WhatsApp prefill, API routes or dependency additions.
- [x] Full logo and staff initials retained.
- [x] No Git, publication or work/output outside the requested workspace.

## Remaining review

Native RW, human screen-reader/assistive-technology review, safeguarding wording, organisation/programme/contact verification, original approved staff photos and source spelling/capitalization. Enlarged text was checked at 200% root size; this delivery does not claim a new manual browser-zoom or screen-reader audit.

Future hosting must serve the About document for `/about` before its homepage fallback. Donations, intake, reporting, WhatsApp and unimplemented services remain unavailable.

The existing production preview on port 5191 was also restarted with the new route mapping. `/resources` works there as well; port 5192 remains the verification preview.
