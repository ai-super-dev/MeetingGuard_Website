# Meeting Guard AI website

The marketing site for Meeting Guard AI: English at `/`, Spanish under `/es/`,
built as plain static files and hosted on Firebase Hosting.

Built with Next.js (static export), TypeScript, Tailwind CSS and Motion.

This is the first, limited release: the landing page, the privacy policy,
the terms of service and the delete account page (each in English and Spanish). The
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
| Privacy policy, terms of service and delete account page (English as approved, Spanish translation) | `src/content/legal.ts` |
| Facts used everywhere: store links, email, phone, company number, ratings, form and analytics settings | `src/lib/site.ts` |

Writing rules from the brief: short, direct and friendly; plain punctuation (no
em dashes, ellipses or curly quotes); prices exactly as in the app. The
product's name is "Meeting Guard AI".

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

## The web agenda (front end)

The web agenda (milestones S3 to S6) lives in the same project with its own
layout: `/app` (Spanish `/es/app`). It is kept out of search engines. The
header's Sign in button leads to it; set `agendaOpen` in `src/lib/site.ts` to
`false` to show the button disabled with a "coming soon" note instead.

| Page | URL |
| --- | --- |
| Sign in (Google, Microsoft, or email and password, as in the app) | `/app/sign-in` |
| Dashboard: greeting, happening now and next meeting, tasks, quick actions, today, your week | `/app` |
| Meetings: search, upcoming, past and all, by source; details, create, edit, move, delete | `/app/meetings` |
| Calendar: month (dots per source, the selected day's tasks and meetings), week and day (hour grid, tasks on top, click a slot for a new meeting) | `/app/calendar?view=week` |
| Tasks: by due date, overdue and done (each open task counts in one card: Today is what is still ahead today); edit, complete, delete | `/app/tasks` |
| Profile: plan, manage subscription in the store, sign out, delete account | `/app/account` |
| Guest invitation (no account needed): accept, decline, propose a time | `/app/invite?t=<token>` |

It reads and writes the app's own records in the app's Firebase project, live
both ways, under the same server rules. Set the values in `.env.example` (copy
it to `.env.local`) and build. Without them, it runs as a preview with sample
data kept in the browser, and a "Preview" label says so.

The website can't reach Google Calendar or Outlook itself: their access tokens
stay on the phone. So every meeting it saves (create, edit, delete) carries
`pushPending: true`, and the app on the user's phone sends it to the calendars,
creates the Google Meet link, emails the invitations or cancellations, and then
writes `pushPending: false`. Meet links and invitations therefore need the app
installed with calendar sync on. A Zoom link comes from the server after the
meeting is saved, so the website saves the meeting once more when the link
arrives, and the invitations carry it.

It only signs in; accounts are made in the app. The app writes the account's
settings record (`users/{uid}/settings/preferences`) the first time it runs
with an account, so the website lets an account in only when that record exists
with the app's fields, and otherwise signs out and asks to set up the app
first. An account that Google or Apple creates on a first sign-in here is
deleted again at once. The website never creates the profile or the settings
record, and it keeps the app's own task fields (`source`, `external`: the To Do
and Google Tasks links) when it saves a task. Tasks follow the same rule as
meetings: every task the website creates or changes carries `pushPending: true`,
and the app on the phone sends it to Microsoft To Do and Google Tasks (a task
deleted here is a plain delete; the app removes its copies). The Profile page shows what the
app saved about calendar and task sync, and each meeting says when it is
waiting for the phone (`pushPending`).

To turn it on: register a Web app in the Firebase console and copy its config;
add the site's domain under Authentication > Settings > Authorized domains; and
for Apple, add a Services ID to the Apple provider and set
`NEXT_PUBLIC_APPLE_SIGN_IN=1`.

Continue with Microsoft works as in the app (its ARCHITECTURE section 31): the
site runs Microsoft's own sign-in in a window (`src/lib/agenda/microsoft.ts`,
code with PKCE, scopes `openid profile email`), and the app's server function
`microsoftSignIn` checks the id_token and answers with a sign-in token for the
same account as in the app. The website sends `signInOnly: true`, so a Microsoft
account the app was never used with gets the "set up the app first" window and
nothing is created. The window comes back to `public/auth/microsoft/index.html`.
It needs `NEXT_PUBLIC_MSAL_CLIENT_ID` (the app's Azure registration), and each
site address followed by `/auth/microsoft/` listed as a "Single-page
application" redirect URI on that registration (an address that isn't listed,
`www.` included, gets Microsoft's redirect error).

Every read and write goes through `src/lib/agenda/store.ts`. Other files:

- Firebase connection: `src/lib/agenda/firebase.ts`.
- The app's documents (build, change, parse): `src/lib/agenda/records.ts`,
  following the app's `src/core/types.ts`.
- Repeating meetings: `src/lib/agenda/recurrence.ts`, following the app's
  `src/core/recurrence.ts`.
- The meeting form's checks: `src/lib/agenda/validation.ts`, following the
  app's `src/screens/meetings/meetingForm.ts`.
- The plan: `src/lib/agenda/plans.ts`. In the app, plans differ only in AI
  assistant requests, so nothing on the web agenda is locked.
- Words, English and Spanish: `src/lib/agenda/i18n.ts`.
- Typed tasks ("Send the deck to Ana tomorrow at 5 pm"): `src/lib/agenda/capture.ts`.
- The dashboard's rules: `src/lib/agenda/dashboard.ts`, following the app's
  `src/screens/home/homeModel.ts` and `src/screens/insights/meetingInsights.ts`.
- The Meetings page's rules: `src/lib/agenda/meetingsList.ts`, following the
  app's `src/screens/meetings/list/meetingListModel.ts`.

Keep the first four in step with the app when its records change.

When the agenda moves to its own address (for example app.meetingguard.ai),
point that address at `/app`, and rewrite `/invite/**` to `/app/invite` for
the guest links; the guest page reads the token from either.

## Before launch (open items)

- Privacy policy and terms: confirm the URLs (`/privacy-policy`,
  `/terms-of-service`; `/privacy` and `/terms` redirect there) match Play
  Console, App Store Connect and the Meta app. The Meta app (WhatsApp) also
  needs the data deletion URL, `/delete-account`.
- Company number.
- Forms: deploy `functions/` and set `formsEndpoint` in `src/lib/site.ts`.
- Analytics: set `gaMeasurementId` in `src/lib/site.ts`; the consent banner
  appears automatically once it is set.

## Deploy (Hostinger)

Every page is built as a folder with an `index.html` (`/es/` is
`es/index.html`, `/privacy-policy/` is `privacy-policy/index.html`), so the
host serves the files as they are. Addresses end with a slash; without it, the
server adds it.

```bash
npm run build      # writes ./out, including .htaccess (from public/.htaccess)
```

Upload everything in `./out` to `public_html` by FTP (show hidden files so
`.htaccess` goes too). `public/.htaccess` has the redirects from old URLs
(`/privacy`, `/terms`), the 404 page and the security headers.

## Deploy (Firebase Hosting)

```bash
npm run build
firebase hosting:channel:deploy preview   # a preview link for review
firebase deploy --only hosting            # live
```

`firebase.json` has the redirects from old URLs and the security headers for
the site paths (not `/admin`). Merge it with the existing project's
`firebase.json`, which also serves `/admin`.

### The forms function

`functions/index.js` receives the forms (this release uses the assistant
waitlist and the footer updates sign-up), writes them to Firestore (`websiteForms`) and emails support@ through
the Trigger Email extension (`mail` collection). Deploy it with
`cd functions && npm install && firebase deploy --only functions:websiteForms`.

## Analytics events

Sent only after the visitor accepts the consent banner: `badge_click` (with
the store), `waitlist_submit`, `updates_submit`, `scroll_75`.
