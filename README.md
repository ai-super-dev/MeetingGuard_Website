# MeetingGuard website

The marketing site for MeetingGuard: English at `/`, Spanish under `/es/`,
built as plain static files and hosted on Firebase Hosting.

Built with Next.js (static export), TypeScript, Tailwind CSS and Motion.

This is the first, limited release: three pages only, the landing page, the
privacy policy and the terms of service (each in English and Spanish). The
full site, with the feature, pricing, assistant, FAQ, blog and other pages,
is kept in `Meeting_Guard_Web-Copy` for a later release.

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
| The FAQ on the home page (5 questions) | `src/content/faq.ts` |
| Privacy policy and terms of service (English as approved, Spanish translation) | `src/content/legal.ts` |
| Facts used everywhere: store links, email, phone, company number, release months, ratings, form and analytics settings | `src/lib/site.ts` |

Writing rules from the brief: short, direct and friendly; plain punctuation (no
em dashes, ellipses or curly quotes); prices exactly as in the app; features
that are not shipped yet carry an "Available <month>" label (set the months in
`availability` in `src/lib/site.ts`).

Spanish files are checked against English: if a translation is missing, the
build stops with an error that names it.

## Add a page

1. Write the page in `src/views/` (the full site in `Meeting_Guard_Web-Copy`
   has the pages of the later release).
2. Add it to `scripts/generate-routes.py` and to `PAGES` in `src/lib/routes.ts`.
3. Run `python scripts/generate-routes.py`; it writes the English and Spanish
   route files.

## Add a language

1. In `src/lib/i18n.ts`, copy the `es` block, translate it, and add it to
   `dictionaries`.
2. Add the language to `Lang` and `LANGS` in `src/lib/routes.ts`, with its URL
   prefix in `localize()`.
3. Add its copy to the FAQ and the legal page (each has `en` and `es`).
4. Create `src/app/(xx)/layout.tsx` like `src/app/(es)/layout.tsx`, extend
   `scripts/generate-routes.py`, and add the flag to
   `src/components/layout/LanguageSwitch.tsx`.

## Replace the stand-in screenshots

Phone screens are rebuilt in code from the app's real screens. When the real
screenshots are exported, put them in `public/images/screens/` and pass them
to `PhoneShot` with its `image` prop (`src/components/phone/PhoneShot.tsx`).

## Before launch (open items)

- Store links: `src/lib/site.ts`.
- Spanish App Store badge: save Apple's Spanish artwork as
  `public/badges/app-store-es.svg` and point to it in
  `src/components/ui/StoreBadges.tsx`.
- Privacy policy and terms: confirm the URLs (`/privacy-policy`,
  `/terms-of-service`; `/privacy` and `/terms` redirect there) match Play
  Console, App Store Connect and the Meta app.
- Company number.
- Forms: deploy `functions/` and set `formsEndpoint` in `src/lib/site.ts`.
- Analytics: set `gaMeasurementId` in `src/lib/site.ts`; the consent banner
  appears automatically once it is set.

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

`functions/index.js` receives the forms (this release uses the assistant
waitlist and the footer updates sign-up), writes them to Firestore (`websiteForms`) and emails support@ through
the Trigger Email extension (`mail` collection). Deploy it with
`cd functions && npm install && firebase deploy --only functions:websiteForms`.

## Analytics events

Sent only after the visitor accepts the consent banner: `badge_click` (with
the store), `waitlist_submit`, `updates_submit`, `scroll_75`.
