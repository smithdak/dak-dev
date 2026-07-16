# Bundled fonts (OG image rendering only)

These static TTFs are read at runtime by the OG image generator
(`app/api/og/route.tsx` via `lib/og/template.tsx`) and by the image scripts.
Satori cannot use `next/font` or system fonts — it needs raw font data — so the
brand fonts are vendored here. Web pages load fonts through `next/font/google`
as usual; nothing in this directory ships to the browser.

| Family | Source | License |
|---|---|---|
| Space Grotesk (Regular/Medium/Bold) | https://github.com/floriankarsten/space-grotesk | SIL OFL 1.1 |
| JetBrains Mono (Regular/Bold) | https://github.com/JetBrains/JetBrainsMono | SIL OFL 1.1 |

`next.config.ts` `outputFileTracingIncludes` makes these files available to the
`/api/og` serverless function on Vercel — keep it in sync if files are renamed.
