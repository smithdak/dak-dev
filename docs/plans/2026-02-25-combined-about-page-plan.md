# Combined About Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Merge the Tools, About, and Contact pages into a single scrolling `/about` page with four sections: Intro, Skills, Tools, Contact.

**Architecture:** Replace three separate page routes with one server component at `app/about/page.tsx`. The page fetches products from `products.json` and renders four sections with anchor IDs. Old routes get 308 redirects via `next.config.ts`. Header nav shrinks from 6 to 4 items.

**Tech Stack:** Next.js App Router, React Server Components, Tailwind CSS, Framer Motion (existing `ProductCard`, `ScrollReveal`, `PageTransition`)

**Design doc:** `docs/plans/2026-02-25-combined-about-page-design.md`

---

### Task 1: Rewrite `app/about/page.tsx` — Hero/Intro Section

**Files:**
- Modify: `app/about/page.tsx`

**Step 1: Replace the entire about page with the new intro section**

Gut the current resume content. Replace with a minimal hero section — name, subtitle, location, and a personal 2-3 sentence intro.

```tsx
import { PageTransition } from '@/components/ui/PageTransition';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  generateResumeSchema,
  generateBreadcrumbSchema,
} from '@/lib/schema';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getAllProducts } from '@/lib/products';
import { ProductCardList } from '@/components/ui/ProductCard';

export const metadata = {
  title: 'About | Dakota Smith',
  description:
    'Systems architect, open-source builder, and AI tooling enthusiast based in Kansas City. Explore my skills, tools, and ways to connect.',
};

export default async function AboutPage() {
  const products = await getAllProducts();
  const resumeSchema = generateResumeSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About' },
  ]);

  return (
    <PageTransition className="min-h-screen py-16">
      <JsonLd data={resumeSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Hero / Intro */}
        <header className="mb-16 border-b-4 border-text pb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">About</h1>
          <div className="mb-6">
            <p className="text-2xl font-semibold text-text">Dakota Smith</p>
            <p className="text-lg text-muted">Kansas City, MO</p>
          </div>
          <p className="text-lg text-muted leading-relaxed max-w-2xl">
            I build tools that make software teams faster and more precise. With 15 years in
            enterprise software — from Sitecore migrations to AI orchestration systems — I focus
            on shipping resilient, high-performance products that solve real problems.
          </p>
        </header>

        {/* Remaining sections go here (Tasks 2-4) */}

      </div>
    </PageTransition>
  );
}
```

**Step 2: Verify the page renders**

Run: `npm run dev` and visit `http://localhost:3000/about`
Expected: Page shows hero section with name, location, and personal intro. No resume content visible.

**Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: rewrite about page with personal intro section"
```

---

### Task 2: Add Skills Section

**Files:**
- Modify: `app/about/page.tsx`

**Step 1: Add the skills badge section below the hero**

Insert after the `</header>` closing tag, inside the `<div className="space-y-16">` wrapper (add wrapper if not present). Uses a flat list of tags with neo-brutalist badge styling — no categories.

Add this section inside the main content div, after the header:

```tsx
<div className="space-y-16">
  {/* Skills */}
  <ScrollReveal>
    <section>
      <h2 className="text-3xl font-bold mb-8 border-l-4 border-text pl-6">
        What I Work With
      </h2>
      <div className="flex flex-wrap gap-3">
        {[
          '.NET Core', 'C#', 'TypeScript', 'React', 'Next.js', 'Node.js',
          'Sitecore', 'Optimizely', 'GraphQL', 'PostgreSQL', 'MongoDB',
          'SQL Server', 'Docker', 'Azure', 'Vercel',
          'AI Orchestration', 'System Architecture',
        ].map((skill) => (
          <span
            key={skill}
            className="inline-block border-2 border-text bg-background px-4 py-2 text-sm font-semibold shadow-[2px_2px_0_0_var(--color-text)]"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  </ScrollReveal>

  {/* Remaining sections (Tasks 3-4) */}
</div>
```

**Step 2: Verify the skills section renders**

Run: Visit `http://localhost:3000/about`
Expected: "What I Work With" heading with ~17 skill badges in a flex-wrap layout. Badges have thick borders and hard shadows.

**Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: add skills badge section to about page"
```

---

### Task 3: Add Tools Section

**Files:**
- Modify: `app/about/page.tsx`

The page already imports `getAllProducts` and `ProductCardList` from Task 1. Now wire them into the template.

**Step 1: Add the tools grid section**

Insert after the skills section, still inside the `<div className="space-y-16">`:

```tsx
{/* Tools */}
<section id="tools">
  <h2 className="text-3xl font-bold mb-8 border-l-4 border-text pl-6">
    Things I&apos;ve Built
  </h2>
  {products.length > 0 ? (
    <ProductCardList products={products} />
  ) : (
    <div className="border-4 border-text p-12 text-center">
      <p className="text-2xl font-semibold mb-2">No tools yet</p>
      <p className="text-muted">Check back soon.</p>
    </div>
  )}
</section>
```

Note: The outer div max-width is `max-w-4xl` but the product grid works best at `max-w-7xl`. Either widen the page container to `max-w-7xl` for this section, or break out of the container. The simplest approach: change the outer container to `max-w-7xl` for the whole page (matching the current tools page). Update the header and intro to use `max-w-4xl` internally via a nested div if desired for readability, or just let them span wider — they'll still look fine at `max-w-7xl` with `max-w-2xl` on the paragraph.

**Step 2: Verify the tools grid renders**

Run: Visit `http://localhost:3000/about`
Expected: "Things I've Built" heading with all 9 product cards in a responsive grid. Anchor `#tools` works.

**Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: add tools product grid section to about page"
```

---

### Task 4: Add Contact Section

**Files:**
- Modify: `app/about/page.tsx`

**Step 1: Add the contact section with email CTA and social links**

Insert after the tools section, still inside `<div className="space-y-16">`:

```tsx
{/* Contact */}
<section id="contact" className="text-center">
  <h2 className="text-3xl font-bold mb-8 border-l-4 border-text pl-6 text-left">
    Get In Touch
  </h2>
  <div className="bg-surface border-4 border-text p-8 md:p-12 shadow-[4px_4px_0_0_var(--color-text)]">
    <p className="text-lg text-muted mb-8">
      Have a question, want to collaborate, or just want to talk shop? My inbox is open.
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      <a
        href="mailto:dakota@twofold.tech"
        className="inline-block px-8 py-4 bg-text text-background border-4 border-text font-bold text-lg shadow-[4px_4px_0_0_var(--color-accent)] transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-accent)] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_0_var(--color-accent)] focus:outline-none focus:ring-4 focus:ring-accent"
      >
        dakota@twofold.tech
      </a>
      <div className="flex items-center gap-4">
        <a
          href="https://linkedin.com/in/dakota-smith-a855b230"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-12 h-12 border-4 border-text text-muted hover:bg-text hover:text-background transition-colors focus:outline-none focus:ring-4 focus:ring-accent"
          aria-label="LinkedIn Profile"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        <a
          href="https://github.com/smithdak"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-12 h-12 border-4 border-text text-muted hover:bg-text hover:text-background transition-colors focus:outline-none focus:ring-4 focus:ring-accent"
          aria-label="GitHub Profile"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</section>
```

**Step 2: Verify the contact section renders**

Run: Visit `http://localhost:3000/about`
Expected: "Get In Touch" heading, email CTA button, LinkedIn and GitHub icons. Anchor `#contact` works.

**Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: add contact section with email CTA and social links"
```

---

### Task 5: Update Header Navigation

**Files:**
- Modify: `components/layout/Header.tsx:10-17`

**Step 1: Remove Tools and Contact from the navigation array**

Change the `navigation` array at line 10-17 from:

```typescript
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Patterns', href: '/patterns' },
  { name: 'Tools', href: '/tools' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];
```

To:

```typescript
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Patterns', href: '/patterns' },
  { name: 'About', href: '/about' },
];
```

**Step 2: Verify the header**

Run: Visit `http://localhost:3000`
Expected: Nav shows 4 items: Home, Blog, Patterns, About. No Tools or Contact links.

**Step 3: Commit**

```bash
git add components/layout/Header.tsx
git commit -m "feat: reduce header nav from 6 to 4 items"
```

---

### Task 6: Update Footer Contact Link

**Files:**
- Modify: `components/layout/Footer.tsx:76-78`

**Step 1: Change the footer contact link**

Change line 77 from:

```tsx
href="/contact"
```

To:

```tsx
href="/about#contact"
```

**Step 2: Verify the footer**

Run: Visit `http://localhost:3000`, scroll to footer, click "Contact"
Expected: Navigates to `/about#contact` and scrolls to the contact section.

**Step 3: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "feat: update footer contact link to about page anchor"
```

---

### Task 7: Update Homepage FeaturedTools Links

**Files:**
- Modify: `components/home/FeaturedTools.tsx:60,148`

**Step 1: Change "View All Tools" links**

Change both `href="/tools"` occurrences (lines 60 and 148) to:

```tsx
href="/about#tools"
```

**Step 2: Verify the homepage**

Run: Visit `http://localhost:3000`, find the Featured Tools section
Expected: "View All Tools" link navigates to `/about#tools`.

**Step 3: Commit**

```bash
git add components/home/FeaturedTools.tsx
git commit -m "feat: update featured tools links to about page anchor"
```

---

### Task 8: Add Redirects in next.config.ts

**Files:**
- Modify: `next.config.ts`

**Step 1: Add redirects for old routes**

Add a `redirects` function to `nextConfig`, after the existing `headers` function:

```typescript
async redirects() {
  return [
    {
      source: '/tools',
      destination: '/about#tools',
      permanent: true,
    },
    {
      source: '/contact',
      destination: '/about#contact',
      permanent: true,
    },
  ];
},
```

**Step 2: Verify redirects work**

Run: Visit `http://localhost:3000/tools`
Expected: Redirects to `/about#tools` with a 308 status.

Run: Visit `http://localhost:3000/contact`
Expected: Redirects to `/about#contact` with a 308 status.

**Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat: add 308 redirects from /tools and /contact to /about"
```

---

### Task 9: Delete Old Page Files

**Files:**
- Delete: `app/tools/page.tsx`
- Delete: `app/contact/page.tsx`

**Step 1: Remove old page files**

```bash
rm app/tools/page.tsx
rm app/contact/page.tsx
```

Verify the `app/tools/` and `app/contact/` directories are now empty. If they contain no other files, remove the directories:

```bash
rmdir app/tools 2>/dev/null
rmdir app/contact 2>/dev/null
```

**Step 2: Verify redirects still work (old routes no longer render, they redirect)**

Run: Visit `http://localhost:3000/tools`
Expected: Redirects to `/about#tools`

Run: Visit `http://localhost:3000/contact`
Expected: Redirects to `/about#contact`

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove old tools and contact page files"
```

---

### Task 10: Full Page Verification and Build Test

**Files:** None (verification only)

**Step 1: Run the dev server and test the full page**

Visit `http://localhost:3000/about` and verify:
- [ ] Hero section: name, subtitle, location, personal intro
- [ ] Skills section: ~17 skill badges in flex-wrap layout
- [ ] Tools section: 9 product cards in responsive grid, `id="tools"` anchor works
- [ ] Contact section: email CTA, LinkedIn icon, GitHub icon, `id="contact"` anchor works
- [ ] Scroll animations work (ScrollReveal)
- [ ] Page transition animates on load

**Step 2: Test navigation**

- [ ] Header has 4 nav items: Home, Blog, Patterns, About
- [ ] Footer "Contact" link goes to `/about#contact`
- [ ] Homepage "View All Tools" goes to `/about#tools`
- [ ] `/tools` redirects to `/about#tools`
- [ ] `/contact` redirects to `/about#contact`

**Step 3: Run the production build**

Run: `npm run build`
Expected: Build succeeds with no errors. The `/tools` and `/contact` routes no longer generate static pages.

**Step 4: Commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix: address issues from full page verification"
```

---

### Task 11: Clean Up Unused Components

**Files:**
- Delete: `components/resume/ExperienceCard.tsx` (no longer used)
- Check: `components/resume/SkillCategory.tsx` — if no longer imported anywhere, delete it too

**Step 1: Verify no other files import ExperienceCard**

Run: `grep -r "ExperienceCard" --include="*.tsx" --include="*.ts" app/ components/ lib/`
Expected: No results (only the deleted about page used it).

**Step 2: Verify no other files import SkillCategory**

Run: `grep -r "SkillCategory" --include="*.tsx" --include="*.ts" app/ components/ lib/`
Expected: No results.

**Step 3: Delete unused components**

```bash
rm components/resume/ExperienceCard.tsx
rm components/resume/SkillCategory.tsx
rmdir components/resume 2>/dev/null
```

**Step 4: Run build to confirm nothing breaks**

Run: `npm run build`
Expected: Build succeeds.

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove unused ExperienceCard and SkillCategory components"
```
