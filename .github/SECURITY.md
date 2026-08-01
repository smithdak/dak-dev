# Security Policy

## Reporting a Vulnerability

Please **do not** open a public issue for security vulnerabilities.

Report privately through GitHub's
[Private Vulnerability Reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability):

1. Go to the **Security** tab of this repository.
2. Click **Report a vulnerability**.
3. Include reproduction steps, affected paths, and impact.

You can expect an initial acknowledgement within **5 business days**.

## Scope

This is a static, statically-generated personal blog deployed on Vercel.
The most relevant areas for reports:

- The `/api/og` and `/api/search` route handlers.
- Dependency or build-toolchain supply-chain issues.
- HTTP response header / Content-Security-Policy weaknesses.
- Leaked secrets or credentials in the repository or its history.

Out of scope: volumetric DoS, findings that require a compromised
maintainer machine, and issues in third-party services (Vercel, GitHub,
Giscus) that are not caused by this project's configuration.

## Hardening Measures

This project applies defense-in-depth:

- **pnpm** with a 3-day install cooldown (`minimumReleaseAge`) and
  dependency build scripts blocked by default (`allowBuilds` in
  `pnpm-workspace.yaml` is the explicit allowlist).
- **Frozen lockfile** installs in CI and on Vercel.
- **Least-privilege CI**: workflows default to `contents: read`; write
  scopes are granted per-job only where required.
- **SHA-pinned GitHub Actions**, advanced by Dependabot.
- **Security headers** including a Content-Security-Policy, HSTS preload,
  `nosniff`, `frame-ancestors`, and a restrictive `Permissions-Policy`.
- **Automated dependency updates** via Dependabot with a release cooldown.
