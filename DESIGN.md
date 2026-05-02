# Design Brief

## Direction

Calm Modern — a refined, content-focused social feed with clean typography, subtle depth, and thoughtful spacing optimized for extended scrolling and engagement.

## Tone

Editorial minimalism. Confident, focused, purposeful — like Linear meets Twitter. Functional clarity takes priority over decoration.

## Differentiation

Subtle accent layering (blue primary for CTAs, teal secondary for highlights) creates visual hierarchy without garish effects. Card-based structure makes feed navigation feel organized and breathing.

## Color Palette

| Token      | Light                | Dark                 | Role                          |
| ---------- | -------------------- | -------------------- | ----------------------------- |
| background | `0.99 0.002 260`     | `0.108 0.006 260`    | Page background, neutral base |
| foreground | `0.12 0.004 260`     | `0.93 0.006 260`     | Body text, primary readable   |
| card       | `1.0 0.0 0`          | `0.15 0.008 260`     | Post/content cards            |
| primary    | `0.48 0.18 265`      | `0.62 0.22 265`      | CTAs: follow, like, primary   |
| accent     | `0.65 0.14 200`      | `0.72 0.16 200`      | Teal highlights, comments     |
| muted      | `0.92 0.008 260`     | `0.22 0.01 260`      | Secondary/disabled state      |
| destructive| `0.55 0.22 25`       | `0.58 0.2 25`        | Delete, remove actions        |

## Typography

- Display: **Space Grotesk** — Geometric, contemporary headings and h2–h3 titles. Headers, section titles, user names.
- Body: **DM Sans** — Clean, legible interface type for post captions, comments, metadata. Designed for digital screens.
- Mono: **Geist Mono** — Code blocks, timestamps, technical metadata.
- Scale: Hero `text-5xl md:text-7xl font-bold tracking-tight` | H2 `text-2xl md:text-3xl font-semibold tracking-tight` | Label `text-sm font-semibold` | Body `text-base md:text-lg`

## Elevation & Depth

Minimal shadows, maximum clarity. Card borders define structure; light hover shadows on interactive elements (0.5–1px blur). No glow, no layered glows. Depth comes from layout and color separation, not light effects.

## Structural Zones

| Zone       | Background           | Border           | Notes                                           |
| ---------- | -------------------- | ---------------- | ----------------------------------------------- |
| Header     | `bg-card` + border-b | `border-border`  | Navigation, search, primary actions             |
| Feed       | `bg-background`      | —                | Alternating `bg-card` and `bg-muted/20` cards  |
| Sidebar    | `bg-sidebar`         | `sidebar-border` | Profile, follow suggestions, trending           |
| Footer     | `bg-muted/10`        | `border-t`       | Links, copyright, small navigation              |

## Spacing & Rhythm

Grid 4px base. Cards gutter 1rem (md:1.5rem). Feed items separated 1.5rem. Button padding 0.5rem 1rem (compact). Section headings 2rem top margin. Breathing space between major zones.

## Component Patterns

- **Buttons**: Primary (blue bg, white text, rounded lg) | Secondary (muted bg, dark text) | Ghost (no bg, dark text, hover muted bg)
- **Cards**: Rounded lg, subtle border, 1px shadow-sm on hover, transition-smooth
- **Avatars**: 40px/48px for profiles, 32px for comments, circular, gradient blue bg
- **Post card**: Image header, user info + timestamp, caption text, action bar (like/comment/share), 8px radii

## Motion

- Entrance: Fade-in 0.3s ease-out on page load, slide-down 0.2s on dropdown menus
- Hover: Opacity 90% on buttons (no scale), shadow-sm on cards, smooth 0.2s transition
- Loading: Subtle pulse on placeholder images, no animation stagger

## Constraints

- Mobile-first, full-width cards on `sm` breakpoints
- No decorative gradients, no ambient blur orbs
- High contrast for accessibility (WCAG AA+ verified)
- Dark mode default, light mode secondary (system preference respected)
- All colors OKLCH native; no hex/rgb fallbacks in component code

## Signature Detail

Subtle teal accent underline or dot marker on highlighted posts/notifications — a small visual signal that doesn't overwhelm but creates recognizable emphasis.

