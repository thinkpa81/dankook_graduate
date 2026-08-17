# Project Working Agreement

## Scope
- Preserve the React 19, Express, Wouter, Drizzle, Tailwind CSS 4, and Vite architecture.
- Prefer small, reviewable changes over broad rewrites.
- Do not change API contracts, database schema, authentication flows, or deployment commands without an explicit requirement.

## Required workflow
1. Create a task branch from `main`.
2. Inspect the affected routes, components, and contracts before editing.
3. Apply the design tokens in `docs/DESIGN_SYSTEM.md`.
4. Run `npm run check` and `npm run build`.
5. Verify the affected flows in a browser at desktop and mobile widths.
6. Record material changes in `docs/CHANGELOG.md`.

Use `npm run dev` for the isolated Vite UI preview and `npm run dev:server` for the full Express + Vite development server.

## Security and quality
- Never commit credentials or production secrets. `SESSION_SECRET` is mandatory in production.
- Keep session cookies `httpOnly`, `secure` in production, and `sameSite=lax` or stricter.
- Use semantic HTML, visible focus states, descriptive image alternative text, and reduced-motion support.
- External links opened in a new tab must include `rel="noopener noreferrer"`.
- Do not hotlink critical brand imagery; keep approved assets in `client/public` or `attached_assets`.

## Protected project behavior
- Existing pages and routes must continue to work after a homepage change.
- Preserve the notice API, paper categories, regulations content, talent-pool submission, login, and signup behavior.
- Avoid destructive Git operations and keep unrelated user changes intact.
