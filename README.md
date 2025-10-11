# Web It Easier

[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=flat&logo=vuedotjs&logoColor=4FC08D)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=flat&logo=Firebase&logoColor=white)](https://firebase.google.com/)

> "The door to an easier future" 🚪✨

## Features

- 🎨 Modern, responsive design
- ⚡ Blazing fast performance
- 📱 Mobile-first approach
- 🔒 Secure admin dashboard
- ✍️ Markdown-powered blog
- 🔍 SEO optimized

## Tech Stack

- **Frontend**: Vue 3, Vite, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore)
- **Hosting**: Vercel
- **Images**: Optimized WebP format

## 404 Handling on Vercel

- **Client route**: Vue Router’s catch-all path renders `src/views/NotFound.vue` so visitors stay inside the SPA experience.
- **Server signal**: The page pings `/api/not-found`, which returns HTTP 404, giving Lighthouse and crawlers the correct status despite SPA rewrites.
- **Configuration**: Vercel rewrites in `vercel.json` keep API routes (including `api/not-found.js`) separate while every other path falls back to `index.html` for client-side routing.
- **Fallback file**: `public/404.html` remains in the repo as a static safety net if future hosting modes require it.

## Project Highlights

- **Performance**: 90+ Lighthouse scores
- **Security**: Protected admin routes
- **SEO**: Sitemap, meta tags, OpenGraph
- **Accessibility**: WCAG 2.1 compliant

## SEO Configuration

- **Sitemap**: `public/sitemap.xml` lists all live marketing and blog URLs and is referenced from `robots.txt` at `https://web-it-easier.vercel.app/sitemap.xml`.
- **Robots directives**: `public/robots.txt` allows key pages and assets, blocks admin/API areas and sensitive file types, and keeps critical resources (`*.css`, `*.js`, images) crawlable for Googlebot.
- **Host metadata**: Includes `Host: web-it-easier.vercel.app` for crawlers that respect the directive; crawl delay remains disabled but documented for future use.

## Live Demo

[Visit Website](https://web-it-easier.vercel.app)

## Contact

For inquiries or collaborations, please reach out at [pazpaz25@gmail.com](mailto:pazpaz25@gmail.com)

---

Made with ❤️ by Web It Easier