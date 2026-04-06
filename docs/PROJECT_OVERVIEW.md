# QuickCredit — project overview

Fintech web app for credit and loan management. **UI for each screen will be implemented per-page from your prompts**; this document captures the agreed flow, design system, and planned features.

## User flow

```
Splash → Login → OTP → Home → Loans
                            → Orders
                            → Payment
                            → Profile
```

| Route        | Path        | Purpose (planned)                          |
|-------------|-------------|---------------------------------------------|
| Splash      | `/`         | Branding, illustration, entry to auth       |
| Login       | `/login`    | Phone/email sign-in                         |
| OTP         | `/otp`      | One-time code verification                  |
| Home        | `/home`     | Dashboard hub to main sections              |
| Loans       | `/loans`    | Apply, status, pending checks               |
| Orders      | `/orders`   | Order history, expandable cards             |
| Payment     | `/payment`  | Payment submission flow                     |
| Profile     | `/profile`  | Account & profile management                |

## Design system (implemented in CSS tokens)

- **Primary:** `#4F46E5` · **Secondary:** `#9333EA` · **Background:** `#F9FAFB`
- **Accent (success):** `#22C55E` · **Error:** `#EF4444`
- **Headings:** Poppins (bold) · **Body:** Inter, Roboto fallbacks
- **Spacing:** 16px / 24px · **Radius:** 12–16px · **Shadows:** soft elevation on cards

## Planned features (not implemented yet)

- OTP auto-verification simulation
- Loan application logic including pending-state checks
- Expandable order cards
- Profile management
- Full payment submission flow

## Technical setup

- **React + Vite + TypeScript**, `react-router-dom` for routes
- **Framer Motion** for page-level motion presets (`src/lib/motion.ts`)
- **react-icons** (Feather set used on Home hub; Material available from same package)
- **LazyImage** (`loading="lazy"`, `decoding="async"`) for illustrations
- **Code-splitting:** each page is `React.lazy`-loaded for fast initial load

## Assets

- Hero illustration: `public/illustrations/finance-hero.svg` (replace or extend with your brand art)
- Add more images under `public/` or `src/assets/` and use `LazyImage` where appropriate

## Performance notes

- Route-level lazy loading is enabled
- Prefer optimized images (WebP/AVIF) when you add real assets
- Animations use short durations and GPU-friendly properties (`opacity`, `transform`)
