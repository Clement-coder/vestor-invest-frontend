# Vestor Invest - Premium Crypto Investing Platform

A futuristic, glassmorphism-styled cryptocurrency investment platform built with Next.js 16, React 19, and TailwindCSS.

## Features

✨ **Premium Glass Design** - Liquid glass/glassmorphism styling with iOS 26-style interactions
📊 **Real-Time Analytics** - Interactive charts and portfolio performance tracking with Recharts
💰 **Investment Plans** - Multiple tiered investment options (Starter, Growth, Premium, Exclusive)
🔐 **Secure Authentication** - Modern auth pages with form validation
📱 **Responsive Design** - Mobile-first approach, optimized for all screen sizes
✨ **Smooth Animations** - Floating cards, neon glows, and micro-interactions
🎨 **Custom Components** - Reusable glass components for consistent styling

## Tech Stack

- **Framework**: Next.js 16.2.0 (App Router)
- **UI Library**: React 19.2.4
- **Styling**: TailwindCSS 4.2.0 with custom theme
- **Charts**: Recharts 2.15.0
- **Components**: shadcn/ui
- **Forms**: React Hook Form + Zod (integrated)
- **Fonts**: Geist (Google Fonts)

## Project Structure

```
app/
├── layout.tsx                 # Root layout with metadata
├── globals.css               # Brand theme, animations, glass effects
├── page.tsx                  # Landing page
├── (auth)/
│   ├── layout.tsx
│   ├── login/page.tsx        # Login page
│   └── signup/page.tsx       # Signup page
└── (app)/
    ├── layout.tsx            # Dashboard layout
    ├── dashboard/page.tsx    # Main dashboard
    ├── plans/page.tsx        # Investment plans
    ├── analytics/page.tsx    # Analytics dashboard
    └── transactions/page.tsx # Transaction history

components/
├── glass/                     # Glassmorphism components
│   ├── glass-card.tsx
│   ├── glass-button.tsx
│   ├── glass-input.tsx
│   ├── glass-modal.tsx
│   └── glass-chart.tsx
├── common/                    # Shared components
│   ├── logo.tsx
│   ├── navigation.tsx
│   └── footer.tsx
├── layouts/                   # Page layouts
│   ├── auth-layout.tsx
│   └── dashboard-layout.tsx
├── modals/                    # Modal dialogs
│   ├── investment-modal.tsx
│   └── confirmation-modal.tsx
└── ui/                        # shadcn/ui components

lib/
└── utils.ts                   # Utility functions (cn)

public/                        # Static assets
```

## Key Features & Components

### Glass Components
- **GlassCard** - Versatile card with variants (default, elevated, nested)
- **GlassButton** - Primary CTA with gradient and hover effects
- **GlassInput** - Form input with focus glow
- **GlassModal** - Frosted glass modal with neon borders
- **GlassChart** - Chart wrapper with glass styling

### Pages

**Landing Page** (`/`)
- Hero section with animated background shapes
- Feature cards with hover animations
- CTA sections
- Footer with links

**Sign Up** (`/signup`)
- Form validation
- Password confirmation
- Terms acceptance
- Error handling

**Login** (`/login`)
- Email/password authentication
- Remember me option
- Forgot password link
- Form validation

**Dashboard** (`/dashboard`)
- Portfolio overview cards
- Performance charts (Area & Line)
- Investment plans grid
- Recent transactions list
- Investment modal

**Plans** (`/plans`)
- Detailed plan cards
- Feature comparison table
- Investment amount ranges
- Modal for investment

**Analytics** (`/analytics`)
- Multiple chart types (Line, Bar, Pie)
- Key performance metrics
- Time range selector
- Portfolio allocation

**Transactions** (`/transactions`)
- Transaction history list
- Search and filtering
- Status badges
- Transaction summary

## Customization

### Brand Colors
Edit the CSS variables in `app/globals.css` and `tailwind.config.ts`:
- Primary: `#00A8FF` (Cyan)
- Secondary: `#39FF9E` (Green)
- Background: `#0A0F25` (Dark Navy)

### Animations
Customize animations in `app/globals.css`:
- `floating` - Card floating effect
- `neon-glow` - Neon glow effect
- `gradient-shift` - Gradient animation
- `glow-cyan` / `glow-green` - Color-specific glows

### Glass Effects
Adjust backdrop blur and opacity in `tailwind.config.ts`:
- Backdrop blur values
- Custom shadows with `glow-*` classes
- Semi-transparent backgrounds with opacity utilities

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

## Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

Deploy to Vercel:
```bash
vercel
```

## Future Enhancements

- Firebase Authentication integration
- Real backend API integration
- WebSocket support for real-time data
- Advanced portfolio analytics
- Mobile app (React Native)
- Email notifications
- Two-factor authentication
- API keys management

## Performance Optimizations

- ✅ Optimized images (next/image)
- ✅ CSS-based animations (no JS animations)
- ✅ Responsive design (mobile-first)
- ✅ Code splitting with Next.js
- ✅ Fast refresh with HMR

## License

MIT License - feel free to use for your projects

## Support

For issues and questions, please open an issue on the repository.
