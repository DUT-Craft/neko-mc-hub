# 9cdaee93-28bd-4125-8da4-42e29cbc340d implementation handoff

This archive is the source of truth for turning the design into production code. Start from `index.html`, then preserve the visual system, responsive behavior, and interactions found in the exported files.

## Implementation target
- Build production UI from the exported design, not a loose reinterpretation.
- Preserve typography scale, spacing rhythm, color tokens, border radii, shadows, motion timing, and component states.
- Replace static placeholders only when the target app has real data or functional equivalents.
- Keep generated product UI free of Open Design chrome, preview labels, or design-process annotations.
- Treat this handoff as a visual contract: if implementation choices conflict, match the exported pixels and behavior first, then refactor internals.

## Source map
- Primary entry: `index.html`
- HTML screens detected: 8
- Stylesheets detected: 1
- Script/component files detected: 3
- Supporting assets detected: 77

## Responsive contract
Validate the implementation across this 2025–2026 viewport matrix:
- Mobile compact: 360×800
- Mobile standard: 390×844
- Mobile large: 430×932
- Foldable / small tablet: 600×960
- Tablet portrait: 820×1180
- Tablet landscape: 1024×768
- Laptop: 1366×768
- Desktop: 1440×900
- Wide desktop: 1920×1080

For responsive web exports, treat these as a modern breakpoint system for one adaptive web experience, not three fixed screenshots. Do not split responsive web into unrelated native app screens unless the project explicitly includes native targets. Use semantic layout thresholds, fluid `clamp()` type/spacing, and container queries where component width matters more than viewport width. Preserve any CSS media queries, container queries, fluid `clamp()` scales, and layout changes already present in the exported files.

## Design fidelity contract
- Extract reusable tokens before writing components: background, surface, foreground, muted text, border, accent, radius, shadow, spacing, type scale, and motion duration/easing.
- Map product screens, in-app modules/components, optional landing page, and optional OS widget surfaces before coding. Keep these surfaces separate in the target architecture.
- Match layout geometry: max-widths, gutters, grid columns, card proportions, sticky/fixed elements, and viewport-specific navigation.
- Preserve real copy, labels, and data shown in the export. Do not replace specific text with generic marketing filler.
- Preserve interactive affordances: hover, focus, pressed, disabled, loading, validation, copy/share, tab/accordion, modal/sheet, and keyboard states where present.
- Preserve accessibility semantics when converting: headings stay hierarchical, controls remain buttons/links/inputs, focus states stay visible.
- Do not keep prototype-only annotations, frame labels, or Open Design chrome in the production UI.

## CJX-ready UX contract
- Use `DESIGN-MANIFEST.json` as the machine-readable map for screens, app modules, OS widgets, landing pages, tokens, interactions, and viewport checks.
- Screen-file-first: when multiple user-facing surfaces exist, implement each HTML screen as its own route/file. Treat `index.html` as a launcher/overview when the manifest marks it that way, not as a combined final UI.
- If `landing.html`, app screens, platform screens, or OS widget files exist, preserve those boundaries in the target app instead of merging them into one page.
- A single self-contained `index.html` is acceptable only when the export truly contains one user-facing screen and its CSS/JS are structured enough to extract tokens, components, states, and behavior.
- If separate `css/` or `js/` files exist, treat them as source of truth for token/component/interactions before porting to React, Vue, SwiftUI, Compose, or another target stack.
- In-app modules/components are product UI blocks inside the app. OS widgets are home-screen/lock-screen/quick-access surfaces outside the app. Do not merge those concepts.

## Color and brand contract
- Use the exported design tokens and product/domain context as the color source of truth.
- Do not introduce warm beige / cream / peach / pink / orange-brown background washes unless they are already explicit brand/reference colors in the export.
- A stylesheet or design/token file was detected; inspect it for canonical color variables before choosing framework theme tokens.

## Implementation sequence for AI coding tools
1. Open `index.html` and `DESIGN-MANIFEST.json`; identify every screen file, launcher/overview file, app module, and interaction before coding.
2. If multiple HTML screens exist, map them to separate routes/surfaces first; do not merge `landing.html`, product app screens, platform screens, or OS widgets into one route.
3. Extract a token table from CSS/root styles and inline styles before building framework components.
4. Build product screens and domain-specific in-app modules from largest layout regions down to controls; avoid starting with isolated atoms that lose spatial intent.
5. Port responsive behavior across the modern viewport matrix and test each semantic breakpoint before cleanup.
6. Port interactions and states, then replace static placeholders only with real app data or functional equivalents.
7. Keep optional landing page and OS widget surfaces as separate surfaces if present.
8. Compare final screenshots against the export at 360×800, 390×844, 430×932, 820×1180, 1024×768, 1366×768, 1440×900, and 1920×1080 before declaring done.

## Entry points
- `activities.html`
- `announcements.html`
- `applications.html`
- `history.html`
- `home.html`
- `index.html`
- `servers.html`
- `wiki.html`

## Styles
- `styles.css`

## Scripts/components
- `legacy-app.js`
- `nuxt.config.ts`
- `public/legacy-app.js`

## Assets and supporting files
- `AGENTS.md`
- `app.vue`
- `assets_activity-speedrun-image2.png`
- `assets_bg-neko-lobby-soft.png`
- `assets_test-gpt-image-2.png`
- `assets/bg-neko-corner-soft.png`
- `assets/bg-neko-lobby-soft.png`
- `assets/bg-neko-portal-soft.png`
- `assets/image2-activities.png`
- `assets/image2-guide.png`
- `assets/image2-lobby.png`
- `critique.json`
- `image-gpt-image-2-mr831dx0.png`
- `mraw0f3m-QQ_1783443161057.png`
- `mraw1fqs-QQ_1783443208957.png`
- `mraw21x3-QQ_1783443237326.png`
- `mraw31wh-QQ_1783443284136.png`
- `mraw3zpk-QQ_1783443328091.png`
- `mraw7ri4-QQ_1783443500540.png`
- `mraw8v7b-QQ_1783443554905.png`
- `mraw9rm5-QQ_1783443597445.png`
- `mraxxsxg-QQ_1783446398282.png`
- `mraxy653-QQ_1783446414799.png`
- `mraxyaso-QQ_1783446421807.png`
- `mray23uv-QQ_1783446599336.png`
- `mray2clc-QQ_1783446610769.png`
- `mrayuysv-QQ_1783447945900.png`
- `mrayvabc-QQ_1783447960369.png`
- `mrayvluo-QQ_1783447976103.png`
- `mrayvp65-QQ_1783447980216.png`
- `mrazpetx-65494bb0-c970-4442-b5e2-f79c9c9b8e74.png`
- `mrbd1vqt-QQ_1783471783146.png`
- `mrbeapes-QQ_1783473873719.png`
- `mrbeasw2-QQ_1783473879036.png`
- `mrbeazqn-QQ_1783473888035.png`
- `mrbgcr86-image.png`
- `mrbgjlwj-QQ_1783477647889.png`
- `mrbgqh4f-QQ_1783477969330.png`
- `mrbgwal8-QQ_1783478240515.png`
- `mrbi10ph-QQ_1783480018766.png`
- `mrbi1483-QQ_1783480018766.png`
- `mrbjdc97-QQ_1783482395196.png`
- `mrbjmdvt-QQ_1783482816770.png`
- `mrbjwlii-QQ_1783483293032.png`
- `mrbk3fyf-QQ_1783483613105.png`
- `output/playwright/activities-desktop.png`
- `output/playwright/announcements-desktop.png`
- `output/playwright/applications-desktop.png`
- `output/playwright/applications-mobile.png`
- `output/playwright/history-desktop.png`
- `output/playwright/history-mobile.png`
- `output/playwright/home-desktop.png`
- `output/playwright/home-mobile.png`
- `output/playwright/home-mobile@2x.png`
- `output/playwright/index-desktop.png`
- `output/playwright/servers-desktop.png`
- `output/playwright/servers-mobile.png`
- `output/playwright/wiki-desktop.png`
- `package-lock.json`
- `package.json`
- `pages/activities.vue`
- `pages/announcements.vue`
- `pages/applications.vue`
- `pages/history.vue`
- `pages/home.vue`
- `pages/index.vue`
- `pages/servers.vue`
- `pages/wiki.vue`
- `public/assets_activity-speedrun-image2.png`
- `public/assets/bg-neko-corner-soft.png`
- `public/assets/bg-neko-lobby-soft.png`
- `public/assets/bg-neko-portal-soft.png`
- `public/assets/image2-activities.png`
- `public/assets/image2-guide.png`
- `public/assets/image2-lobby.png`
- `public/image-gpt-image-2-mr831dx0.png`
- `public/mraw9rm5-QQ_1783443597445.png`

## Coding checklist for AI tools
1. Inspect `index.html` and `DESIGN-MANIFEST.json` first and identify reusable components before coding.
2. Implement each user-facing screen file as its own route/surface; keep launcher, landing, app, platform, and OS widget files separate.
3. Extract design tokens into the target stack: colors, type scale, spacing, radius, shadows, and motion.
4. Implement layout with real 2025–2026 responsive breakpoints, fluid type/spacing, and container-query-aware component behavior; test with no horizontal overflow.
5. Preserve interactive controls, hover/focus/pressed states, form behavior, validation, and copy actions where present.
6. Implement domain-specific in-app modules with real states; do not flatten them into generic cards.
7. Keep landing page, product screens, and OS widget/quick-access surfaces separate when present.
8. Confirm the production result visually matches the exported design before refactoring internals.
9. Reject implementation shortcuts that flatten the design into generic cards, generic gradients, placeholder stats, or framework-default typography.
10. If a detail is ambiguous, keep the exported HTML/CSS/JS behavior rather than inventing a new pattern.
