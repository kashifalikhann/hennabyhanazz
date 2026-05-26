# Henna by Hanazz — Complete Redesign

## Overview
Full visual and structural redesign of the Henna by Hanazz website. Gold/white luxury direction, glass UI, scroll animations, Instagram gallery, cal.com booking. No prices anywhere.

## Site Structure
- **3 main pages:** Homepage (single scroll) + Gallery + Book
- **Legal pages:** Privacy, Cookies, Legal Notice (EN + ES)
- **Languages:** English (`/`) and Spanish (`/es/`)
- **Repo:** Same repo, `redesign` branch, merge to `main` when done

## Visual System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#FFFFFF` | Page background |
| `--bg-warm` | `#FAF8F5` | Alternating section background |
| `--gold` | `#C9A84C` | Accents, borders, buttons, headings |
| `--gold-light` | `#E8D5A3` | Subtle gold highlights |
| `--text` | `#1A1A1A` | Body text |
| `--text-muted` | `#6B6B6B` | Secondary text |
| `--glass-bg` | `rgba(255,255,255,0.15)` | Glass button/card background |
| `--glass-border` | `rgba(201,168,76,0.3)` | Glass element border |
| `--overlay` | `rgba(0,0,0,0.5)` | Hero image overlay |

### Typography
- **Headings:** Playfair Display (serif, elegant)
- **Body:** Inter (sans-serif, clean)
- **Gold accent** on display text (headings, labels, decorative elements)

### Glass UI Pattern
- `backdrop-filter: blur(12px)`
- `border: 1px solid var(--glass-border)`
- `background: var(--glass-bg)`
- `box-shadow: 0 8px 32px rgba(0,0,0,0.08)`
- Hover: increased brightness, subtle glow

### Animations
- Scroll-triggered fade-up reveals (Intersection Observer)
- Hero parallax: background shifts slower than foreground
- Services: 3D tilt on hover (transform: perspective + rotate)
- Testimonials: auto-slide carousel with opacity/translate transitions
- Glass buttons: glow on hover
- Micro-interactions: subtle scale on click, gold pulse

## Navigation

### Desktop
- Glass/frosted nav bar, transparent at top, gains background on scroll
- Logo (or name) left-aligned
- Links: Home · Gallery · Book · About
- EN/ES toggle right-aligned
- Active page: gold underline or highlight

### Mobile
- Hamburger menu icon
- Glass overlay panel slides down
- Same links stacked vertically
- EN/ES toggle at bottom

## Homepage Sections

### 1. Hero
- Full-screen viewport height
- Dark image overlay (AI-generated henna/hands image)
- Centered content:
  - Small gold eyebrow label ("Barcelona Henna Artistry" or similar)
  - Large display heading ("Henna by Hanazz")
  - Subtitle line ("100% Natural Henna · PPD-Free · Lahore Tradition")
  - Two glass CTA buttons: "Book Now" / "WhatsApp"
- Parallax: background image moves slower on scroll
- Subtle gradient from dark overlay to white at bottom edge

### 2. About
- Two-column layout: text left, image right
- Heading: gold serif title
- Short editorial bio (Hanazz, Lahore/Pakistan roots, Mughal henna tradition, Barcelona-based)
- Image: artist photo or AI placeholder (aspect 4:5)
- Decorative gold accent line above heading

### 3. Services
- Full-width horizontal carousel (overflow-x: auto, snap)
- 6 glass cards:
  - Bridal Henna
  - Hand Henna
  - Arm Henna
  - Event & Party Henna
  - Henna Classes
  - Bring Your Own Design (BYOD)
- Each card: service name, short 1-line description, "Inquire" glass button
- 3D tilt effect on hover (JS-driven or CSS perspective)
- Snap-scroll behavior, scrollbar hidden, arrow hints on sides
- No prices or currency anywhere

### 4. Gallery Preview
- Section heading + subtitle
- Horizontal row of 4-6 AI-generated henna images in a grid/flex row
- Images: uniform aspect ratio (4:3), rounded corners, subtle shadow
- "View Full Gallery" glass button → links to `/gallery`
- Each image: click opens lightbox (same as gallery page)

### 5. Testimonials
- Carousel of testimonial cards with 3D depth
- Each card: quote text, name, location
- Auto-slide every 5 seconds
- Pause on hover
- Navigation dots below
- Cards: white background, subtle shadow, rounded corners

### 6. FAQ
- Accordion component
- Gold `+` / `−` toggles
- Same FAQ content as current site (natural henna, PPD-free, booking, aftercare, etc.)
- Expand/collapse animation

### 7. CTA / Contact
- Centered heading + subtitle
- Two glass buttons: "Book Your Appointment" / "Contact via WhatsApp"
- Floating WhatsApp button pinned bottom-right on all pages (fixed position)

## Gallery Page (`/gallery`)

### Layout
- Page title + subtitle
- Instagram feed embed (using Instagram's native embed or a widget script like LightWidget)
- Grid/masonry display of Instagram posts
- "Follow @hennabyhanazz on Instagram" link below

### Lightbox
- Click any image → full-screen overlay
- Close button, click outside to close
- Keyboard escape to close

## Booking Page (`/book`)

### Layout
- Page title: "Book Your Appointment"
- Subtitle: "Select an available time and Hanazz will reach out to discuss your design"
- cal.com embed (iframe or embed script) — no API key needed
- No prices or service selection on this page
- Below embed: contact info (WhatsApp, email) as fallback

## Footer
- Social links: Instagram, WhatsApp
- Legal links: Privacy Policy, Cookie Policy, Legal Notice (EN/ES variants)
- Copyright: "© 2026 Henna by Hanazz"
- Made by SMGTEC in Barcelona

## Components to Create
| Component | Description |
|-----------|-------------|
| `GlassButton.astro` | Reusable glass-style button with gold border, blur background |
| `FloatingWhatsApp.astro` | Fixed-position WhatsApp button, bottom-right |
| `ServiceCard.astro` | Glass card with 3D tilt for services carousel |
| `ServicesCarousel.astro` | Horizontal snap-scroll carousel |
| `TestimonialsCarousel.astro` | Auto-slide testimonial carousel |
| `FAQAccordion.astro` | Accordion with gold toggles |
| `Lightbox.astro` | Image click-to-expand overlay |
| `InstagramEmbed.astro` | Instagram embed wrapper |
| `CalEmbed.astro` | cal.com scheduling embed wrapper |
| `Nav.astro` | Glass nav bar, desktop + mobile |
| `Footer.astro` | Updated footer with gold accents |

## Pages to Create/Update
| Page | Action |
|------|--------|
| `src/pages/index.astro` | Rewrite — new homepage |
| `src/pages/es/index.astro` | Rewrite — Spanish homepage |
| `src/pages/gallery.astro` | New — Instagram gallery |
| `src/pages/es/galeria.astro` | New — Spanish gallery |
| `src/pages/book.astro` | Rewrite — cal.com booking |
| `src/pages/es/reservar.astro` | Rewrite — Spanish booking |
| Legal pages | Keep existing, no changes |
| BYOD page (`/byod`) | Remove (service card links to "Inquire" which goes to booking) |

## Images
- AI-generated henna-style images as placeholders
- Centralized image config in `src/lib/images.ts` (keep existing pattern)
- Single swap when real photos arrive

## Services to Remove
- `src/pages/byod.astro` + `src/pages/es/byod.astro` (no longer needed)
- Current `BookingWidget.jsx` (replaced by cal.com embed)
- Current `src/lib/payments.js` (no Stripe needed)
- Current `src/components/booking/` (replaced by cal.com)

## BYOD File Upload
BYOD service card links to `/book` like all other services. Since cal.com only handles scheduling (not file upload), the `/book` page will include a note:
> "Bringing your own design? After booking, email your design to henna@hennabyhanazz.com with your booking code."

## Data Flow
1. User visits site → scrolls homepage → sees services → clicks "Inquire" → goes to `/book`
2. User visits `/gallery` → sees Instagram feed → clicks post → goes to Instagram
3. User clicks "Book Now" → goes to `/book` → cal.com embed shows available slots → books → cal.com sends notification to artist + customer
4. Artist receives booking details via cal.com email notifications → follows up to discuss pricing and confirm
5. BYOD customers additionally email their design with booking code
