# MeetingGuard website

The marketing site for MeetingGuard: English at `/`, Spanish under `/es/`,
built as plain static files and hosted on Firebase Hosting.

Built with Next.js (static export), TypeScript, Tailwind CSS and Motion.

## Run it on your computer

You need Node.js 22 or later.

```bash
npm install
npm run dev        # live preview at http://localhost:3000 (Spanish at /es)
npm run build      # writes the finished site to ./out
npm run preview    # serves ./out at http://localhost:3000, like Firebase does
```

## Where the words live

Almost everything you read on the site is in a few files. Each holds the
English and the Spanish text side by side; change both.

| What | File |
| --- | --- |
| Header, footer, buttons, forms, home page sections, phone screens | `src/lib/i18n.ts` |
| The six feature pages | `src/content/features.ts` |
| The FAQ (20 questions, 5 of them on the home page) | `src/content/faq.ts` |
| How it works, pricing, assistant, security, about, support, download, press, thanks | `src/views/<Page>Page.tsx` (the `copy` block at the top) |
| Use cases (consultants, sales, founders) | `src/views/UseCasePage.tsx` |
| Legal pages | `src/views/LegalDocPage.tsx` |
| Facts used everywhere: store links, email, phone, company number, release months, ratings, form and analytics settings | `src/lib/site.ts` |

Writing rules from the brief: short, direct and friendly; plain punctuation (no
em dashes, ellipses or curly quotes); prices exactly as in the app; features
that are not shipped yet carry an "Available <month>" label (set the months in
`availability` in `src/lib/site.ts`).

Spanish files are checked against English: if a translation is missing, the
build stops with an error that names it.

## Add a blog post

1. Create `src/content/blog/en/your-post-slug.md` and
   `src/content/blog/es/your-post-slug.md` (same file name; it becomes the URL
   `/blog/your-post-slug`).
2. Start each file with:

   ```
   ---
   title: Your title
   description: One or two sentences for the list and for search results.
   date: 2026-12-01
   author: The MeetingGuard team
   ---
   ```

3. Write the post below it in Markdown: `## Heading`, paragraphs, `- lists`,
   `**bold**`, `[links](/features/alarms)`.

The blog page, the sitemap and search previews pick it up automatically.

## Add a page

1. Write the page in `src/views/` (copy a similar one, for example
   `SecurityPage.tsx`).
2. Add it to `scripts/generate-routes.py` and to `PAGES` in `src/lib/routes.ts`.
3. Run `python scripts/generate-routes.py`; it writes the English and Spanish
   route files.

## Add a language

1. In `src/lib/i18n.ts`, copy the `es` block, translate it, and add it to
   `dictionaries`.
2. Add the language to `Lang` and `LANGS` in `src/lib/routes.ts`, with its URL
   prefix in `localize()`.
3. Add its copy to the content files and views (each has `en` and `es`).
4. Create `src/app/(xx)/layout.tsx` like `src/app/(es)/layout.tsx`, extend
   `scripts/generate-routes.py`, and add the flag to
   `src/components/layout/LanguageSwitch.tsx`.

## Replace the stand-in screenshots

Phone screens are rebuilt in code from the app's real screens. When the real
screenshots are exported, put them in `public/images/screens/` and pass them
to `PhoneShot` with its `image` prop (see `src/views/screens.tsx`).

## Before launch (open items)

- Store links, review links and ratings: `src/lib/site.ts`.
- Spanish App Store badge: save Apple's Spanish artwork as
  `public/badges/app-store-es.svg` and point to it in
  `src/components/ui/StoreBadges.tsx`.
- Privacy policy and terms: paste the current texts unchanged into
  `src/views/LegalDocPage.tsx` and remove the draft notices; confirm the URLs
  match Play Console, App Store Connect and the Meta app.
- Pricing: the exact Free / Pro / Premium table and the Premium monthly price
  (`src/views/PricingPage.tsx`).
- Company number, Google Cloud region, founder quote, team roles.
- Forms: deploy `functions/` and set `formsEndpoint` in `src/lib/site.ts`.
- Analytics: set `gaMeasurementId` in `src/lib/site.ts`; the consent banner
  appears automatically once it is set.
- Video: set `video` in `src/lib/site.ts` (mp4, poster and caption files).

## Deploy (Firebase Hosting)

```bash
npm run build
firebase hosting:channel:deploy preview   # a preview link for review
firebase deploy --only hosting            # live
```

`firebase.json` has the clean URLs, redirects from old URLs and the security
headers for the site paths (not `/admin`). Merge it with the existing
project's `firebase.json`, which also serves `/admin`.

### The forms function

`functions/index.js` receives the waitlist, contact, send-link and update
forms, writes them to Firestore (`websiteForms`) and emails support@ through
the Trigger Email extension (`mail` collection). Deploy it with
`cd functions && npm install && firebase deploy --only functions:websiteForms`.

## Analytics events

Sent only after the visitor accepts the consent banner: `badge_click` (with
the store), `waitlist_submit`, `contact_submit`, `send_link_submit`,
`updates_submit`, `video_play`, `scroll_75`.
