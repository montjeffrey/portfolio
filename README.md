# montjeffrey.dev

Source for [montjeffrey.dev](https://montjeffrey.dev), the portfolio and services site of Jeffrey Montoya: business automation, systems integration, and websites for small businesses.

## Stack

- **Framework:** Next.js 16 (App Router), React 18, TypeScript
- **Styling and motion:** Tailwind CSS, Framer Motion, three.js for the background effects
- **Hosting:** Netlify. The `main` branch deploys to production; pull requests get a deploy preview.
- **Contact:** the form posts to [Netlify Forms](https://docs.netlify.com/manage/forms/setup/). Netlify detects forms only in static HTML, so the form is declared in `public/__forms.html` and the Contact page submits to it with `fetch`. If a submission fails, the page offers a pre-filled email instead. There is no other backend and no database.

## Layout

```
app/
  page.tsx                 home
  projects/                project index and one folder per case study
  about/  contact/  resume/
components/                shared UI (navbar, footer, project cards, backgrounds)
public/resumes/            the PDF resumes served by the Resume page
docs/                      design notes for past page refreshes
```

## Run locally

Requires Node.js 20 or later.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build, the same command Netlify runs
npm run lint
```

No environment variables are needed.

## Client work shown here

The case studies describe sites built for real businesses. Their source lives in separate repositories ([levelz-barber-studio](https://github.com/montjeffrey/levelz-barber-studio), [elevate-hrg](https://github.com/montjeffrey/elevate-hrg), [thegenzmama](https://github.com/montjeffrey/thegenzmama)), each with its own license.

## License

All rights reserved. See [LICENSE](LICENSE).
