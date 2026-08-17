# Design QA

- Reference source: `docs/screenshots/landing-desktop-reference.png`
- Implementation screenshot: `docs/screenshots/landing-desktop-implementation.jpg`
- Side-by-side comparison: `docs/screenshots/design-qa-comparison.jpg`
- Browser viewport: 1363 × 936 CSS pixels (captured page content: 1348 × 926)
- Primary state: logged-out homepage with desktop navigation

## Visual comparison

- P0 defects: none.
- P1 defects: none.
- P2 review: resolved by reducing the hero height and headline scale, then changing the quick-link strip to the light institutional treatment used in the selected direction.
- Accepted difference: the implementation uses the exact 2048 × 294 campus panorama supplied by the user. The selected concept image visually extended that panorama, so the production crop is intentionally tighter while preserving the central campus building.
- Header, logo lockup, navy overlay, headline, CTA order, notice/resources hierarchy, rules, spacing, colors, and radii follow the selected direction.
- No clipping, overlap, broken image, or unintended horizontal scrolling was observed at the test viewport.

## Interaction checks

- “학과 소개 보기” navigated to `/about` and displayed the “학과 소개” heading.
- “인재풀 등록” navigated to `/talent-pool` and displayed the registration form.
- The login control opened the existing login dialog.
- The paper navigation dropdown exposed its category links.
- Application console errors: none. One browser-extension diagnostic was excluded because it originated from a Chrome extension URL, not the application.

## Final result

passed
