# Resources content and artwork review

The user-selected `approved-design.png` is the supplied 20 October 2026, 05:03 PM image. It is a visual reference, not evidence of service availability or authorization to contact anyone.

## Content decisions

- All nine requested titles are retained as resource topics. “GBV Toll-Free Hotline” is the requested topic name; its accompanying text explicitly says call charges, number, service scope and hours are unverified. It is not an enabled or verified toll-free service.
- All cards display “Details pending verification” in a disabled control. No provider destinations, bookings, files, locations or WhatsApp URLs were invented.
- No confidentiality, free-service, legal-entitlement or 24/7 claims from the mockup were adopted.
- The shared emergency links retain their existing numbers and labels. 3029 is not labelled Police. No new association between a card and an unverified number was introduced.
- The closing CTA reaches the existing contact-information section. Existing organisation details remain verification-pending text; no mail, telephone or WhatsApp contact action was activated.
- The options guide explicitly describes choices, not required steps, and does not pressure someone to report. Safeguarding, legal and clinical review remains pending.
- All new strings are EN translation keys. The existing typed RW resource includes the same keys as English TODO-REVIEW placeholders pending native approval.

## Interaction and privacy

Category filters use React memory only, never storage or URL parameters. All Resources shows nine entries; Hotlines three; Legal Aid two; Shelters two; Mental Health two; Education one. Child-Specific Protection appears under both Hotlines and Shelters as a topic, not a service claim.

Filtering announces the result count. The no-results state is tested with an empty catalog; each current category contains at least one topic, so the state is not artificially exposed to visitors. Pagehide and the existing Quick Exit cleanup hook reset selection. There are no intake fields, trackers, cookies or third-party runtime requests.

The static HTML includes all nine topics, disabled filters and a no-JavaScript explanation. Filters activate after hydration using React's server/client snapshot support, checked against the [official useSyncExternalStore documentation](https://react.dev/reference/react/useSyncExternalStore#adding-support-for-server-rendering). Safety controls remain eager and use the existing fallback.

## Artwork

`extract-artwork.ps1` records exact bounded regions for the hero illustration and two leaf corners. PNG extracts are retained here and WebP versions are in `public/assets/resources-*.webp`. The initial mint-background leaf reuse was replaced with these matching white-background corners after screenshot review.

Only individual illustration pixels are used. The full mockup, generated lettering and generated logo are not shipped as UI. All text, controls and headings are HTML; icons use the installed Lucide library. The actual full supplied logo and existing self-hosted fonts remain unchanged. No new faces were generated.

Higher-resolution approved illustration originals would improve sharpness at large sizes. Native translation, safeguarding/legal/clinical, contact/provider verification and human assistive-technology review remain outstanding.
