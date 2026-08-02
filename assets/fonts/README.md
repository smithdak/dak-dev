# Bundled fonts

These vendored TTFs keep the site deterministic and independent of remote font
providers. Web pages load Space Grotesk from this directory through
`next/font/local`; image scripts may embed the same files when Sharp needs raw
font data.

The default social image is the static `public/og-default.png`. Regenerate it
with `pnpm generate:og`; there is no dynamic OG route or runtime font fetch.

| Family                              | Source                                          | License     |
| ----------------------------------- | ----------------------------------------------- | ----------- |
| Space Grotesk (Regular/Medium/Bold) | https://github.com/floriankarsten/space-grotesk | SIL OFL 1.1 |
| JetBrains Mono (Regular/Bold)       | https://github.com/JetBrains/JetBrainsMono      | SIL OFL 1.1 |
