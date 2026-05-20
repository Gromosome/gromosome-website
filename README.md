# Gromosome Website

Static Next.js + TypeScript website for Gromosome.

## Pages

- `/` — Main page rendered from `data/home-content.json`.
- `/about` — About Gromosome and founder section rendered from JSON.
- `/appointment` — Firebase Auth protected appointment form.

## JSON configuration

Content and product data live in:

```text
data/home-content.json
data/about-content.json
data/appointment-content.json
```

Each JSON file now follows a page-level structure. Content is rendered from the `sections` array, and each section declares its reusable component through the `component` key.

Page content schema:

```ts
{
  page: {
    title: string;
    description: string;
  };
  sections: Array<{
    component: string;
    [key: string]: unknown;
  }>;
}
```

Product grid sections use camelCase product fields, including `isAvailable`.

Later, these files can be moved to a CDN and fetched in the page layer.

## Firebase setup

1. Create a Firebase project.
2. Enable Email/Password provider in Firebase Auth and turn on passwordless Email link sign-in.
3. Add your domain to Firebase Auth authorized domains.
4. Create Firestore database.
5. Install Firebase Trigger Email extension, configured to read from the `mail` collection.
6. Add Firebase config values to `.env.local` using `.env.example`.
7. Deploy Firestore rules:

```bash
firebase deploy --only firestore:rules
```

The appointment page validates company email using regex, sends a Firebase passwordless email-link verification, and blocks common public domains such as Gmail, Yahoo, Outlook, iCloud, Proton, Zoho, etc.

## Local development

```bash
npm install
cp .env.local .env.local
npm run dev
```

## Static export

```bash
npm run build
```

Output will be generated in `out/`.

## GitHub Pages deployment

1. Push this project to GitHub.
2. Add repository secrets from `.env.example`.
3. Enable GitHub Pages source as GitHub Actions.
4. Push to `main`.

The workflow uses `DEPLOY_TARGET=github-pages` and automatically sets `basePath` from the repository name.

## Firebase Hosting deployment

```bash
npm run build
firebase deploy --only hosting
```

## Founder avatar GIF

Replace this placeholder with your real animated avatar:

```text
public/founder/avatar.gif
```
