# Dakota Smith brand kit

The checked-in kit is the reusable identity system for `Dakota Smith`,
`AI Systems Architect & Full-Stack Engineer`, and `daksmith.dev`. Use these masters for social
profiles, link previews, presentations, video, and external documents. Do not
rebuild them by eye.

The source contract is `.content/brand/brand-kit.v1.json`; this document is the
usage guide, not a second source of truth. Platform dimensions were reviewed on
2026-08-02 against the current
[LinkedIn](https://www.linkedin.com/help/linkedin/answer/a568217),
[X](https://help.x.com/en/managing-your-account/common-issues-when-uploading-profile-photo),
[GitHub](https://docs.github.com/en/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview),
and [YouTube](https://support.google.com/youtube/answer/10456525) guidance.

## Start here

- Need one visual overview: [brand sheet](../public/brand/dakota-smith-brand-sheet.png)
- Need a square mark: [light PNG](../public/brand/marks/dakota-smith-mark-light.png)
  or [dark PNG](../public/brand/marks/dakota-smith-mark-dark.png)
- Need a logo over another layout: [ink SVG](../public/brand/lockups/dakota-smith-lockup-ink.svg)
  or [paper SVG](../public/brand/lockups/dakota-smith-lockup-paper.svg)
- Need every machine-readable dimension and path:
  [public manifest](../public/brand/manifest.json)

The mark is a geometric `D` with a green gate inside its counter. The gate is
the identity's one visual metaphor: agent work can move quickly, while the
authority to accept change remains explicit.

## Upload-ready assets

| Use                         | Dimensions | File                                                                                                      |
| --------------------------- | ---------: | --------------------------------------------------------------------------------------------------------- |
| LinkedIn profile cover      |   1584×396 | [`dakota-smith-linkedin-cover.png`](../public/brand/social/dakota-smith-linkedin-cover.png)               |
| X header                    |   1500×500 | [`dakota-smith-x-cover.png`](../public/brand/social/dakota-smith-x-cover.png)                             |
| GitHub social preview       |   1280×640 | [`dakota-smith-github-social-preview.png`](../public/brand/social/dakota-smith-github-social-preview.png) |
| YouTube channel banner      |  2560×1440 | [`dakota-smith-youtube-banner.png`](../public/brand/social/dakota-smith-youtube-banner.png)               |
| Square social post          |  1080×1080 | [`dakota-smith-social-square.png`](../public/brand/social/dakota-smith-social-square.png)                 |
| Portrait social post        |  1080×1350 | [`dakota-smith-social-portrait.png`](../public/brand/social/dakota-smith-social-portrait.png)             |
| Presentation or video cover |  1920×1080 | [`dakota-smith-presentation-cover.png`](../public/brand/general/dakota-smith-presentation-cover.png)      |
| Default site link preview   |   1200×630 | [`og-default.png`](../public/og-default.png)                                                              |
| Apple touch icon            |    180×180 | [`apple-touch-icon.png`](../public/apple-touch-icon.png)                                                  |

For a personal LinkedIn profile, use a current headshot as the profile image;
the monogram is for covers, repositories, presentations, and contexts where an
identity mark is appropriate. The 1024×1024 mark can be downsampled for any
platform that accepts a logo avatar.

## Marks and lockups

Use the light mark on warm ivory or similarly light neutral surfaces. Use the
dark mark on deep forest or similarly dark surfaces. The `ink` lockup is
transparent and intended for light backgrounds; the `paper` lockup is
transparent and intended for dark backgrounds.

- Keep clear space around the mark equal to at least one quarter of the mark's
  width.
- Preserve the original aspect ratio.
- Do not recolor, add effects, remove the green gate, or place the lockup over
  visually noisy imagery.
- Keep the public role exactly `AI Systems Architect & Full-Stack Engineer`. `Head of AI Innovation`
  is an aspiration, not a current-title claim.

## Palette and typography

The kit inherits the site's warm-ivory, deep-forest, muted-stone, restrained
green, and fine-rule palette. Exact values live in the versioned manifest and
must continue to match `app/globals.css`.

Generated assets embed the vendored Space Grotesk files. This is intentional:
social and presentation exports render identically without a remote font or a
host-specific Bodoni installation. The website retains its editorial serif
display stack for long-form composition.

## Approved copy

Use these when a platform needs accompanying identity copy:

- **Short:** AI Systems Architect and full-stack engineer designing accountable AI systems and governed
  delivery.
- **Social bio:** AI systems architect and full-stack engineer working on accountable AI systems,
  innovation strategy, and the authority layer around agent-produced change.
- **Signature:** Dakota Smith · AI Systems Architect & Full-Stack Engineer · daksmith.dev

## Regenerate and verify

```text
pnpm brand:generate
pnpm brand:check
pnpm build
```

`brand:generate` writes every declared SVG and PNG plus the public manifest.
`brand:check` re-renders in memory and fails on palette drift, font hash drift,
Fontconfig contract drift, renderer-version drift, missing or extra kit files,
or any byte difference. The checked-in Fontconfig sandbox limits raster text to
the verified Space Grotesk files, so local and Linux CI renders use the same
font inputs.
The default Open Graph image and site icons are outputs of the same pipeline.
