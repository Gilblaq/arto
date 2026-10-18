# GeoMates

A mobile-friendly, login-free geology study companion for geological engineering students.

## Features
- Responsive dashboard and navigation
- Core geological engineering study notes
- Quick quizzes with feedback and explanations
- Past questions saved in the current browser using localStorage
- Optional AI tutor endpoint using a Cloudflare Pages Function
- No user account or login required

## Deploy on Cloudflare Pages
This is a static site with a Pages Function in `functions/api/chat.js`.

- Framework preset: None
- Build command: leave empty
- Build output directory: `/` (repository root)
- Make sure Cloudflare Pages is configured to deploy from this Git repository.

## Enable real AI tutor answers
1. Create an API key with your AI provider and make sure the account is allowed to make API calls.
2. In Cloudflare Dashboard, open your Pages project → Settings → Variables and Secrets.
3. Add `OPENAI_API_KEY` as a **secret** (not a public variable), then redeploy.
4. Never put the secret key in `index.html`, `app.js`, or any public repository file.

Without the secret, the tutor shows local starter explanations and tells you that live AI is not connected. API usage may incur charges.

## Saved questions
Chat history is stored in this browser on this device. Because there is no login or cloud database, it will not automatically sync across devices and may be cleared if browser site data is deleted.
