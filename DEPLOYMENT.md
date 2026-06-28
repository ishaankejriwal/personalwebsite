# Deployment Recommendation

## Best default: Vercel Hobby

For this project, use Vercel first. It is the most seamless free path for a Next.js App Router site because it detects Next.js automatically, runs the normal `npm run build`, supports App Router features without adapters, and gives preview deployments for every branch/PR.

This repo currently does not appear to need server-only runtime features, environment variables, or custom build output. That means Vercel can deploy it with no code changes.

## Vercel setup

1. Push the repo to GitHub.
2. In Vercel, create a new project and import the GitHub repo.
3. Use these settings:
   - Framework preset: `Next.js`
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: leave default
   - Environment variables: none currently required
4. Deploy.
5. Add a custom domain from the project dashboard when ready.

## Caveats

- Keep this as a personal/Hobby project unless the site becomes commercial client work.
- If future features need private API keys, add them in the Vercel project environment settings, not in source.
- If future features require database-backed APIs, authentication, or scheduled jobs, re-check free-tier limits before shipping them.

## Alternatives

### Cloudflare Pages

Best if the priority becomes maximum free CDN bandwidth and you are willing to add adapter/static-export setup. For this site, Cloudflare Pages is viable if the app remains fully static, but it is less seamless than Vercel for full Next.js behavior.

Static route:

- Add `output: "export"` to `next.config.ts`.
- Build with `npm run build`.
- Deploy the generated static output.

Full Next route:

- Use Cloudflare's current Next.js/OpenNext guidance.
- Expect extra package/config setup compared with Vercel.

### Netlify

Good Git-based workflow with Next.js support and previews. It is still not the first choice here because the free plan is credit-based, so build/deploy/bandwidth usage is less straightforward than Vercel for a personal Next.js site.

Suggested settings if used:

- Framework preset: `Next.js`
- Build command: `npm run build`
- Publish directory: leave the detected default

### GitHub Pages

Viable only as a static export. It is free and stable, but less seamless for Next.js App Router because the project must stay static and may need config changes for paths, images, and custom domains.

Use it only if avoiding third-party deploy platforms matters more than deployment ergonomics.
