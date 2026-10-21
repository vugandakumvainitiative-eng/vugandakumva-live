# Find Support: current support-options design and review record

Current request: pasted user brief accompanying `ChatGPT Image Oct 20, 2026, 06_49_26 PM.png`. The image depicts Donate, but the user explicitly requests Find Support content and layout adapted from its branding. It is a visual reference, not factual source material or permission to enable giving. Current reference: `support-options-reference.png`. Donate remains unavailable.

The previous wellbeing/filter page is replaced at the existing `/find-support` route. The directory now has the exact user-requested review notice and no search, filters, forms or provider listings. Home's existing temporary support finder is preserved.

Artwork is reused without modification: `learn-intro.webp`, `about-dialogue-small.webp`, and `resources-leaves-left/right.webp`. These are decorative fictional community illustrations, not portraits of named people or claims about survivors. The full approved logo remains unchanged. No new faces, assets or dependencies were generated/installed.

Emergency sources checked: shared emergency-bar component, existing `call` translation, original About source transcript and existing content-review records. The transcript mentions 112/emergencies and 3512/GBV support, but the project still marks service/contact descriptions unverified; no verified descriptions for all four numbers were found. Accordingly, all four existing numbers (112, 3512, 3029, 116) retain the exact existing accessible label `Call [number] - verification pending` (with the existing em dash), and visible descriptions are marked pending. 3029 is not called Police. A shared `src/lib/emergency-contacts.ts` constant now keeps the safety bar, page and static fallback consistent.

Support cards link to existing Resources topics or on-page sections. Those topics retain their verification notices; linking does not establish a provider, legal entitlement or clinical service. The medical-information list item gains a stable anchor. General next-step/helping guidance follows the user's supplied brief and remains a safeguarding review draft. No new clinical guidance or service guarantees are asserted.

Pending approvals: emergency service labels/operational details, verified directory records, safeguarding/legal/clinical content review, native RW translation and human assistive-technology review. EN strings are keyed; RW continues the typed English TODO-REVIEW placeholder. No intake implementation/feature flag exists in this source tree; intake remains absent and unavailable. No new data collection, persistence, account, chat, tracker, external embed or location request was introduced.

---

## Historical wellbeing-page review (superseded)

# Find Support: source and review record

Visual target: first attachment, ChatGPT Image Oct 20, 2026, 05_56_07 PM.png. The other two attachments are secondary references; no alternative design was generated. The full reference is stored only in designs/find-support, not served as a webpage.

Individual decorative extracts: hero rectangle (460,53,396,305), leaves (558,410,270,177), landscape (478,1070,350,140). Coordinates are in the supplied 856px-wide image. Local WebP assets contain no controls or generated lettering. The existing approved full logo remains unchanged.

Stress source inspected 20 October 2026: https://www.who.int/news-room/questions-and-answers/item/stress (page dated 30 March 2026). Supports stress affecting sleep, concentration and mood; individual differences; routine, meals, sleep, movement and trusted connections; seeking support when difficulties persist or affect daily life. Guidance is a brief paraphrase, not diagnosis or treatment.

Clinical wording, counselling descriptions, safeguarding, local contacts and directory records require human review before publication. No verified provider records exist in the project. The page therefore lists no providers, schedules, fees, availability or verification dates. Filters describe a temporary selection and show the verification notice, never a claim that help does not exist. Existing district names are shared with Home. No new storage or network service is used.

Every new string is in src/locales/en.ts; the existing typed RW placeholder imports those keys and remains TODO-REVIEW until native approval. English content retains lang=en.
