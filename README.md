# fibra.news

This repository contains the source code of the [fibra.news](https://fibra.news) website.

It is a [SvelteKit](https://kit.svelte.dev) full-stack application.

## Developing

Install dependencies with `npm install`, then start the development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

The SvelteKit app is currently configured to be deployed to Vercel as a server-rendered site, cached with Incremental Static Regeneration (ISR).
