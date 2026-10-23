# MeetingGuard — marketing website

Next.js 16 (App Router) + TypeScript, Tailwind CSS v4 and Motion for React.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Structure

```
src/
  app/                 routes: / , /terms , /privacy, plus robots, sitemap, icon, OG image
  components/
    layout/            Header (sticky, mobile menu), Footer, LegalPage shell
    sections/          Hero, Features (4 feature bands via FeatureSection), HowItWorks,
                       Integrations, Reviews (+ stats), CallToAction
    phone/             PhoneFrame (device shell) and every in-app screen
    scene/NeonScene    procedural neon mountains / moon / stars / reflective floor (seeded SVG)
    motion/            Reveal, Float, TiltPhone (interactive tilt), Parallax, CountUp, PulseRing
    ui/                Logo, Avatar, StoreButtons, IconTile, CheckList, SectionHeading, Stars
    icons/             brand + robot SVG icons
  lib/site.ts          site URL, store links, nav + social links
```

## To do before launch

- `src/lib/site.ts`: set the real `url`, `appStoreUrl`, `playStoreUrl` and social links.
- Replace the placeholder copy in `src/app/terms` and `src/app/privacy`.
- Reviewer and attendee portraits are illustrated SVGs (`components/ui/Avatar.tsx`);
  swap in real photos if you have them.
