# About Us redesign — visual review

Date: 20 October 2026. Status: image concept awaiting user approval before implementation.

## Grounding

Uses the polished homepage capture coverage/browser/home-1536.png, canonical src/design/tokens.css, the prior about-us-page-v1.png reference and the full approved logo in references/assets/logo-approved.png. The original application remains the implementation source of truth; generated text and logos must not be traced or substituted for the supplied assets in code.

## Direction

Matches the existing site's sans-serif hero, serif section headings, green palette, calm illustrated dialogue, open story layout, mission/vision band, values row, three work areas and shared safety shell/footer. Mission, vision and values are draft content. Fictional illustrated people represent no actual staff or survivors.

## Deliverables

about-us-redesign-v2.png is the full-page desktop design. about-us-redesign-v2-prompt.md records the complete built-in generation and correction prompts. No application code, dependencies or Git metadata were changed by this visual-design task. Mobile design and implementation remain subsequent work after visual approval.

## Review and safety checklist

- Usage disclosure: emergency numbers and Quick Exit remain visible in the concept, with honest history limitations. The image itself adds no runtime logging, cookies, notifications or navigation.
- Personal data: no new personal intake or survivor records; residency, encryption and retention are not applicable to this static concept. Existing public organisational copy/contact text remains subject to human verification.
- API authorization: no new API routes, so auth decorators and Auth Matrix changes do not apply.
- Secrets/fixtures: no secrets or real survivor data; images are fictional illustrations.
- Language: English concept with RW TODO-REVIEW status. Preserve EN/RW keys and the exact eager safety behavior when implementing.
- Verification: visually inspected both the homepage reference and generated output, then corrected the header logo layout. Runtime tests, axe and Lighthouse are not rerun for an image-only task; previous app results are historical and not evidence that this unimplemented design works.

## Implementation handoff

Use the original full supplied logo file, not a generated imitation. Verify every link destination; keep unverified resources and donations unavailable. Keep the canonical flat button colors, self-hosted fonts, responsive behavior and tested Quick Exit controls. Review native RW, safeguarding, mission/vision/values and organisation details before release.
