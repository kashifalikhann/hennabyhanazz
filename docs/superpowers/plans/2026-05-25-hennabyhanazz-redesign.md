# Henna by Hanazz Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full visual and structural redesign — gold/white luxury, glass UI, scroll animations, Instagram gallery, cal.com booking. No prices.

**Architecture:** All sections are standalone Astro components composed into single-page homepage. Gallery and Booking are separate pages. Shared CSS tokens in `global.css`, shared components in `src/components/ui/`. No dark mode — light-only gold/white theme.

**Tech Stack:** Astro (static), Tailwind v4, CSS custom properties, Intersection Observer for scroll reveals

**Repo branch:** `redesign` — merge to `main` when complete

---

## External Setup Required (by user after implementation)

These services need to be configured for the site to work correctly:

- **cal.com account:** Sign up at cal.com, set username to `hennabyhanazz`, configure availability and event types. The embed in `book.astro` uses `data-cal-endpoint="hennabyhanazz"`.
- **LightWidget:** Sign up at lightwidget.com, create a widget connected to `@hennabyhanazz` Instagram, and update the widget URL in `gallery.astro` and `galeria.astro`.

---

## File Structure

### Create
- `src/components/ui/GlassButton.astro`
- `src/components/ui/FloatingWhatsApp.astro`
- `src/components/ui/ServiceCard.astro`
- `src/components/ui/ServicesCarousel.astro`
- `src/components/ui/TestimonialsCarousel.astro`
- `src/components/ui/FAQAccordion.astro`
- `src/components/ui/Lightbox.astro`
- `src/pages/gallery.astro`
- `src/pages/es/galeria.astro`
- `src/pages/es/reservar.astro`

### Rewrite
- `src/styles/global.css` — new gold/white tokens
- `src/components/ui/Nav.astro` — glass nav
- `src/components/ui/WhatsAppButton.astro` → rename to `FloatingWhatsApp.astro`
- `src/components/sections/CTAFooter.astro` → move to `src/components/ui/Footer.astro`
- `src/components/sections/Hero.astro` — parallax hero
- `src/components/sections/About.astro` — editorial layout
- `src/pages/index.astro` — compose all sections
- `src/pages/es/index.astro` — Spanish homepage
- `src/pages/book.astro` — cal.com embed
- `src/layouts/BaseLayout.astro` — update imports, remove dark mode

### Remove
- `src/pages/byod.astro`
- `src/pages/es/byod.astro`
- `src/components/booking/BookingWidget.jsx`
- `src/components/booking/`
- `src/lib/payments.js`
- `src/components/sections/CTAFooter.astro`
- `src/components/ui/BackToTop.astro`

---

### Task 1: Create redesign branch + update global CSS

**Files:**
- Create: `redesign` branch
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create and switch to redesign branch**

```bash
git checkout -b redesign
```

- [ ] **Step 2: Rewrite global.css with gold/white tokens**

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@import 'tailwindcss';

@theme {
  --color-bg: #FFFFFF;
  --color-bg-warm: #FAF8F5;
  --color-gold: #C9A84C;
  --color-gold-light: #E8D5A3;
  --color-gold-dark: #B8962E;
  --color-text: #1A1A1A;
  --color-text-muted: #6B6B6B;
  --color-border: rgba(0, 0, 0, 0.08);
  --color-glass-bg: rgba(255, 255, 255, 0.15);
  --color-glass-border: rgba(201, 168, 76, 0.3);
  --color-overlay: rgba(0, 0, 0, 0.5);

  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;

  --radius-card: 1.5rem;
  --radius-pill: 9999px;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-bg text-text font-body antialiased;
  }

  ::selection {
    background: rgba(201, 168, 76, 0.25);
    color: inherit;
  }

  .glass {
    background: var(--color-glass-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--color-glass-border);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  }
  .glass:hover {
    background: rgba(255, 255, 255, 0.22);
    box-shadow: 0 8px 32px rgba(201, 168, 76, 0.15);
  }

  .btn-glass {
    @apply inline-flex items-center gap-3 rounded-full px-6 py-3 font-body font-medium text-sm text-text;
    background: var(--color-glass-bg);
    backdrop-filter: blur(12px);
    border: 1px solid var(--color-glass-border);
    transition: all 0.4s cubic-bezier(0.32, 0.72, 0, 1);
    cursor: pointer;
  }
  .btn-glass:hover {
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 4px 20px rgba(201, 168, 76, 0.2);
    transform: translateY(-1px);
  }

  .btn-glass-gold {
    @apply btn-glass;
    background: var(--color-gold);
    border-color: var(--color-gold);
    color: #FFFFFF;
  }
  .btn-glass-gold:hover {
    background: var(--color-gold-dark);
    border-color: var(--color-gold-dark);
    box-shadow: 0 4px 20px rgba(201, 168, 76, 0.35);
  }

  .eyebrow {
    @apply inline-block text-[10px] uppercase tracking-[0.2em] font-medium text-gold font-body;
  }

  .section-title {
    @apply font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight;
  }

  .scroll-reveal {
    opacity: 0;
    transform: translateY(2.5rem);
    transition: all 0.8s cubic-bezier(0.32, 0.72, 0, 1);
  }
  .scroll-reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- [ ] **Step 3: Verify CSS compiles**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: redesign global CSS with gold/white tokens"
```

---

### Task 2: Create GlassButton component

**Files:**
- Create: `src/components/ui/GlassButton.astro`

- [ ] **Step 1: Create GlassButton.astro**

```astro
---
export interface Props {
  href: string;
  variant?: 'default' | 'gold';
  className?: string;
}

const { href, variant = 'default', className = '' } = Astro.props;
---

<a href={href} class={`${variant === 'gold' ? 'btn-glass-gold' : 'btn-glass'} ${className}`}>
  <slot />
</a>
```

- [ ] **Step 2: Build to verify**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/GlassButton.astro
git commit -m "feat: add GlassButton component"
```

---

### Task 3: Create FloatingWhatsApp component

**Files:**
- Create: `src/components/ui/FloatingWhatsApp.astro`
- Delete: `src/components/ui/WhatsAppButton.astro`

- [ ] **Step 1: Create FloatingWhatsApp.astro**

```astro
---
export interface Props {
  lang?: 'en' | 'es';
}

const { lang = 'en' } = Astro.props;
const number = import.meta.env.PUBLIC_WHATSAPP_NUMBER;
const label = lang === 'es' ? 'WhatsApp' : 'WhatsApp';
const msg = lang === 'es'
  ? 'Hola%20Hanazz!%20Quisiera%20consultar%20sobre%20tus%20servicios%20de%20henna.'
  : 'Hi%20Hanazz!%20I\'d%20like%20to%20ask%20about%20your%20henna%20services.';
---

<a
  href={`https://wa.me/${number}?text=${msg}`}
  target="_blank"
  rel="noopener noreferrer"
  class="fixed bottom-6 right-6 z-50 glass rounded-full w-14 h-14 flex items-center justify-center hover:scale-105 transition-transform duration-300"
  aria-label={label}
>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-gold">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
</a>
```

- [ ] **Step 2: Remove old WhatsAppButton**

```bash
rm src/components/ui/WhatsAppButton.astro
```

- [ ] **Step 3: Build to verify**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/FloatingWhatsApp.astro
git rm src/components/ui/WhatsAppButton.astro
git commit -m "feat: replace WhatsAppButton with FloatingWhatsApp"
```

---

### Task 4: Rewrite Nav with glass nav

**Files:**
- Modify: `src/components/ui/Nav.astro`

- [ ] **Step 1: Rewrite Nav.astro**

```astro
---
export interface Props {
  lang?: 'en' | 'es';
}

const { lang = 'en' } = Astro.props;
const isEs = lang === 'es';
const base = import.meta.env.BASE_URL;

const links = [
  { href: base + (isEs ? 'es/' : ''), label: isEs ? 'Inicio' : 'Home' },
  { href: base + (isEs ? 'es/galeria' : 'gallery'), label: isEs ? 'Galería' : 'Gallery' },
  { href: base + (isEs ? 'es/reservar' : 'book'), label: isEs ? 'Reservar' : 'Book' },
];

const altLangHref = isEs ? base : base + 'es/';
const altLangLabel = isEs ? 'EN' : 'ES';
---

<nav class="fixed top-0 left-0 right-0 z-50" id="main-nav">
  <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    <a href={base + (isEs ? 'es/' : '')} class="font-display text-lg font-bold tracking-tight text-gold">
      Henna by Hanazz
    </a>

    <!-- Desktop -->
    <div class="hidden md:flex items-center gap-8">
      {
        links.map(link => (
          <a href={link.href} class="text-sm font-medium text-text/70 hover:text-gold transition-colors duration-300">
            {link.label}
          </a>
        ))
      }
      <a href={altLangHref} class="text-xs font-medium uppercase tracking-wider text-gold hover:text-gold-dark transition-colors duration-300 ml-4">
        {altLangLabel}
      </a>
    </div>

    <!-- Mobile hamburger -->
    <button id="menu-toggle" class="md:hidden flex flex-col gap-1.5 p-2" aria-label="Menu">
      <span class="block w-6 h-px bg-gold transition-all duration-300"></span>
      <span class="block w-6 h-px bg-gold transition-all duration-300"></span>
      <span class="block w-6 h-px bg-gold transition-all duration-300"></span>
    </button>
  </div>

  <!-- Mobile overlay -->
  <div id="mobile-menu" class="md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-xl translate-x-full transition-transform duration-500">
    <button id="menu-close" class="absolute top-6 right-6 p-2" aria-label="Close menu">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" stroke-width="1.5">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>
    <div class="flex flex-col items-center justify-center h-full gap-8">
      {
        links.map(link => (
          <a href={link.href} class="font-display text-2xl text-text hover:text-gold transition-colors duration-300">
            {link.label}
          </a>
        ))
      }
      <a href={altLangHref} class="text-sm font-medium uppercase tracking-wider text-gold mt-8">
        {altLangLabel}
      </a>
    </div>
  </div>
</nav>

<script>
  const nav = document.getElementById('main-nav');
  const toggle = document.getElementById('menu-toggle');
  const close = document.getElementById('menu-close');
  const menu = document.getElementById('mobile-menu');

  // Glass nav on scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          nav.classList.add('glass');
          nav.classList.remove('bg-transparent');
        } else {
          nav.classList.remove('glass');
          nav.classList.add('bg-transparent');
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // Mobile menu
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.remove('translate-x-full'));
  }
  if (close && menu) {
    close.addEventListener('click', () => menu.classList.add('translate-x-full'));
  }
  // Close on link click
  if (menu) {
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => menu.classList.add('translate-x-full'));
    });
  }
</script>
```

- [ ] **Step 2: Build to verify**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Nav.astro
git commit -m "feat: rewrite Nav with glass nav + mobile overlay"
```

---

### Task 5: Rewrite Footer

**Files:**
- Create: `src/components/ui/Footer.astro`
- Delete: `src/components/sections/CTAFooter.astro`

- [ ] **Step 1: Create Footer.astro**

```astro
---
export interface Props {
  lang?: 'en' | 'es';
}

const { lang = 'en' } = Astro.props;
const isEs = lang === 'es';
const base = import.meta.env.BASE_URL;
const instagram = import.meta.env.PUBLIC_INSTAGRAM_URL;
const whatsapp = import.meta.env.PUBLIC_WHATSAPP_NUMBER;

const legalLinks = [
  { href: base + (isEs ? 'es/privacidad' : 'privacy'), label: isEs ? 'Privacidad' : 'Privacy' },
  { href: base + (isEs ? 'es/cookies' : 'cookies'), label: isEs ? 'Cookies' : 'Cookies' },
  { href: base + (isEs ? 'es/aviso-legal' : 'legal'), label: isEs ? 'Aviso Legal' : 'Legal Notice' },
];
---

<footer class="bg-bg-warm border-t border-border">
  <div class="max-w-7xl mx-auto px-6 py-12 md:py-16">
    <div class="flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="text-center md:text-left">
        <p class="font-display text-lg text-gold font-bold">Henna by Hanazz</p>
        <p class="text-sm text-text-muted mt-1">
          {isEs ? 'Henna natural · Barcelona' : 'Natural Henna · Barcelona'}
        </p>
      </div>

      <div class="flex items-center gap-6">
        <a href={instagram} target="_blank" rel="noopener noreferrer" class="text-text-muted hover:text-gold transition-colors duration-300" aria-label="Instagram">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
        </a>
        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" class="text-text-muted hover:text-gold transition-colors duration-300" aria-label="WhatsApp">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
          </svg>
        </a>
      </div>
    </div>

    <div class="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-border">
      <div class="flex items-center gap-4 text-sm text-text-muted">
        {
          legalLinks.map(link => (
            <a href={link.href} class="hover:text-gold transition-colors duration-300">{link.label}</a>
          ))
        }
      </div>
      <p class="text-xs text-text-muted">
        &copy; {new Date().getFullYear()} Henna by Hanazz &middot; {isEs ? 'Creado por' : 'Made by'} SMGTEC
      </p>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Remove old CTAFooter**

```bash
rm src/components/sections/CTAFooter.astro
```

- [ ] **Step 3: Verify section content still exists in About section — the old CTAFooter had WhatsApp/Book buttons. Those are now covered by:**
  - `FloatingWhatsApp.astro` (global)
  - CTA section (Task 13, added to homepage)

- [ ] **Step 4: Build to verify**

Run: `npm run build`
Expected: 0 errors (may need to update BaseLayout import first — covered in Task 6)

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Footer.astro
git rm src/components/sections/CTAFooter.astro
git commit -m "feat: add gold/white Footer"
```

---

### Task 6: Update BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Update imports and remove dark mode**

```astro
---
import '../styles/global.css';
import Nav from '../components/ui/Nav.astro';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp.astro';
import Footer from '../components/ui/Footer.astro';
import CookieConsent from '../components/ui/CookieConsent.astro';

export interface Props {
  title: string;
  description?: string;
  lang?: 'en' | 'es';
  ogImage?: string;
}

const { title, description, lang = 'en', ogImage } = Astro.props;
const isEs = lang === 'es';
const path = isEs ? Astro.url.pathname.replace(/^\/es/, '') || '/' : Astro.url.pathname;
const siteUrl = import.meta.env.SITE_URL || 'https://kashifalikhann.github.io/hennabyhanazz';
const contactEmail = import.meta.env.PUBLIC_CONTACT_EMAIL;
const instagramUrl = import.meta.env.PUBLIC_INSTAGRAM_URL;
const whatsappNumber = import.meta.env.PUBLIC_WHATSAPP_NUMBER;
const canonical = `${siteUrl}${isEs ? '/es' : ''}${path === '/' ? '' : path}`;
const altLangPath = isEs ? path : `/es${path === '/' ? '' : path}`;
const altLangLabel = isEs ? 'English' : 'Español';
---

<!DOCTYPE html>
<html lang={lang}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} | Henna By Hanazz</title>
  <meta name="description" content={description || "Barcelona's premier henna artistry — Book your appointment today."} />
  <link rel="canonical" href={canonical} />

  <link rel="alternate" hreflang="en" href={`${siteUrl}${path === '/' ? '' : path}`} />
  <link rel="alternate" hreflang="es" href={`${siteUrl}/es${path === '/' ? '' : path}`} />

  <meta property="og:title" content={`${title} | Henna By Hanazz`} />
  <meta property="og:description" content={description || "Barcelona's premier henna artistry"} />
  <meta property="og:image" content={ogImage || `${siteUrl}/og-image.png`} />
  <meta property="og:url" content={canonical} />
  <meta name="twitter:card" content="summary_large_image" />

  <script type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Henna By Hanazz",
    "description": "Barcelona henna artist — Premium henna artistry for events, walk-ins, and custom designs.",
    "url": siteUrl,
    "telephone": `+${whatsappNumber}`,
    "email": contactEmail,
    "address": { "@type": "PostalAddress", "addressLocality": "Barcelona", "addressCountry": "ES" },
    "priceRange": "€€",
    "image": `${siteUrl}/og-image.png`,
    "sameAs": [instagramUrl]
  })} />

  <link rel="manifest" href="/hennabyhanazz/manifest.json" />
  <meta name="theme-color" content="#FFFFFF" />

  <script set:html={`
    window._gtmId = ${JSON.stringify(import.meta.env.PUBLIC_GTM_ID || '')};
    window._fbPixelId = ${JSON.stringify(import.meta.env.PUBLIC_FB_PIXEL_ID || '')};
    function loadConsentScripts() {
      if (window._gtmId) {
        var g = document.createElement('script'); g.async = true;
        g.src = 'https://www.googletagmanager.com/gtag/js?id=' + window._gtmId;
        document.head.appendChild(g);
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', window._gtmId);
      }
      if (window._fbPixelId) {
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', window._fbPixelId);
        fbq('track', 'PageView');
      }
    }
    var consent = localStorage.getItem('cookie-consent');
    if (consent === 'accepted') { loadConsentScripts(); }
    window.addEventListener('consent-granted', loadConsentScripts);
  `} />
</head>
<body>
  <Nav lang={lang} />
  <main>
    <slot />
  </main>
  <Footer lang={lang} />

  <FloatingWhatsApp lang={lang} />
  <CookieConsent lang={lang} />

  <script>
    // Scroll-reveal Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
  </script>
</body>
</html>
```

Changes from current:
- Removed `html.dark` class
- Removed `noise-overlay`
- Removed `BackToTop` import and usage
- Changed theme-color to `#FFFFFF` (was `#0A0A0A`)
- Updated `CTAFooter` import to `Footer`
- Updated `WhatsAppButton` import to `FloatingWhatsApp`
- Removed the dark/light mode toggle script at the bottom

- [ ] **Step 2: Build to verify**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: update BaseLayout — light theme, updated imports"
```

---

### Task 7: Build Hero section

**Files:**
- Rewrite: `src/components/sections/Hero.astro`

- [ ] **Step 1: Rewrite Hero.astro**

```astro
---
import GlassButton from '../ui/GlassButton.astro';
import { heroImg } from '../../lib/images';

const base = import.meta.env.BASE_URL;
const whatsappNumber = import.meta.env.PUBLIC_WHATSAPP_NUMBER;

export interface Props {
  lang?: 'en' | 'es';
}

const { lang = 'en' } = Astro.props;
const isEs = lang === 'es';
const msg = isEs
  ? 'Hola%20Hanazz!%20Quisiera%20consultar%20sobre%20tus%20servicios%20de%20henna.'
  : 'Hi%20Hanazz!%20I\'d%20like%20to%20ask%20about%20your%20henna%20services.';
---

<section class="relative min-h-screen flex items-center justify-center overflow-hidden">
  <!-- Background -->
  <div
    class="absolute inset-0 bg-cover bg-center bg-no-repeat parallax-bg"
    style="background-image: url('{heroImg}');"
  ></div>
  <div class="absolute inset-0 bg-overlay"></div>

  <!-- Gradient fade to white at bottom -->
  <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent"></div>

  <!-- Content -->
  <div class="relative z-10 text-center px-6 max-w-3xl mx-auto pt-28 md:pt-36">
    <span class="eyebrow">{isEs ? 'Arte de Henna en Barcelona' : 'Barcelona Henna Artistry'}</span>
    <h1 class="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mt-4 leading-tight">
      Henna by Hanazz
    </h1>
    <p class="text-white/70 mt-4 text-sm md:text-base font-body max-w-md mx-auto">
      100% Natural Henna &middot; PPD-Free &middot; Lahore Tradition
    </p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
      <GlassButton href={base + (isEs ? 'es/reservar' : 'book')} variant="gold">
        {isEs ? 'Reservar Cita' : 'Book Now'}
      </GlassButton>
      <GlassButton href={`https://wa.me/${whatsappNumber}?text=${msg}`}>
        {isEs ? 'WhatsApp' : 'WhatsApp'}
      </GlassButton>
    </div>
  </div>
</section>

<script>
  // Parallax effect
  const bg = document.querySelector('.parallax-bg');
  if (bg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const offset = window.scrollY * 0.4;
          bg.style.transform = `translateY(${offset}px)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }
</script>
```

- [ ] **Step 2: Add heroImg to images config**

Edit `src/lib/images.ts` — add:
```ts
export const heroImg = 'https://images.pexels.com/photos/ai-generated-placeholder';
```

Use an actual AI-generated image URL or a suitable placeholder from the existing config.

- [ ] **Step 3: Build to verify**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.astro src/lib/images.ts
git commit -m "feat: rewrite Hero with parallax + gold glass CTAs"
```

---

### Task 8: Build About section

**Files:**
- Rewrite: `src/components/sections/About.astro`

- [ ] **Step 1: Rewrite About.astro**

```astro
---
import { aboutImg } from '../../lib/images';

export interface Props {
  lang?: 'en' | 'es';
}

const { lang = 'en' } = Astro.props;
const isEs = lang === 'es';
---

<section class="py-20 md:py-28 px-6 bg-bg">
  <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
    <div class="space-y-6">
      <div class="w-12 h-px bg-gold"></div>
      <h2 class="section-title">
        {isEs ? 'Conoce a la Artista' : 'Meet the Artist'}
      </h2>
      <div class="space-y-4 text-text-muted leading-relaxed">
        <p>
          {isEs
            ? 'Hanazz es una artista de henna de Lahore, Pakistán, que ahora trabaja desde Barcelona. Su arte se inspira en la tradición Mughal del henna, transmitida a través de generaciones.'
            : 'Hanazz is a henna artist from Lahore, Pakistan, now based in Barcelona. Her artistry draws from the Mughal henna tradition, passed down through generations.'}
        </p>
        <p>
          {isEs
            ? 'Cada diseño es una pieza única de arte corporal, creada con henna 100% natural y libre de PPD. Hanazz combina patrones tradicionales con sensibilidades modernas para cada ocasión.'
            : 'Every design is a unique piece of body art, crafted with 100% natural, PPD-free henna. Hanazz blends traditional patterns with modern sensibilities for every occasion.'}
        </p>
      </div>
    </div>
    <div class="relative">
      <div class="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
        <img
          src={aboutImg}
          alt={isEs ? 'Hanazz - Artista de Henna' : 'Hanazz - Henna Artist'}
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Build to verify**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/About.astro
git commit -m "feat: rewrite About with editorial layout"
```

---

### Task 9: Build ServiceCard + ServicesCarousel

**Files:**
- Create: `src/components/ui/ServiceCard.astro`
- Create: `src/components/ui/ServicesCarousel.astro`

- [ ] **Step 1: Create ServiceCard.astro**

```astro
---
import GlassButton from './GlassButton.astro';

export interface Props {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  lang?: 'en' | 'es';
}

const { title, description, ctaLabel, ctaHref } = Astro.props;
---

<div class="service-card glass rounded-xl p-8 min-w-[280px] md:min-w-[320px] flex flex-col gap-4 select-none">
  <h3 class="font-display text-xl md:text-2xl font-bold text-text">{title}</h3>
  <p class="text-sm text-text-muted leading-relaxed flex-1">{description}</p>
  <GlassButton href={ctaHref}>{ctaLabel}</GlassButton>
</div>

<script>
  // 3D tilt effect
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
</script>
```

- [ ] **Step 2: Create ServicesCarousel.astro**

```astro
---
import ServiceCard from './ServiceCard.astro';

export interface Props {
  lang?: 'en' | 'es';
}

const { lang = 'en' } = Astro.props;
const isEs = lang === 'es';
const base = import.meta.env.BASE_URL;

const services = [
  {
    title: isEs ? 'Henna para Novias' : 'Bridal Henna',
    desc: isEs ? 'Diseños nupciales personalizados, intrincados y elegantes para tu gran día.' : 'Custom bridal designs — intricate, elegant, and personalized for your special day.',
    cta: isEs ? 'Consultar' : 'Inquire',
    href: base + (isEs ? 'es/reservar' : 'book'),
  },
  {
    title: isEs ? 'Henna de Mano' : 'Hand Henna',
    desc: isEs ? 'Diseños delicados para manos y muñecas, perfectos para cualquier ocasión.' : 'Delicate hand and wrist designs, perfect for any occasion.',
    cta: isEs ? 'Consultar' : 'Inquire',
    href: base + (isEs ? 'es/reservar' : 'book'),
  },
  {
    title: isEs ? 'Henna de Brazo' : 'Arm Henna',
    desc: isEs ? 'Patrones audaces que cubren desde el antebrazo hasta el codo.' : 'Bold forearm to elbow coverage patterns.',
    cta: isEs ? 'Consultar' : 'Inquire',
    href: base + (isEs ? 'es/reservar' : 'book'),
  },
  {
    title: isEs ? 'Eventos y Fiestas' : 'Event & Party',
    desc: isEs ? 'Henna para bodas, cumpleaños, despedidas y eventos corporativos.' : 'Henna for weddings, birthdays, bridal showers, and corporate events.',
    cta: isEs ? 'Consultar' : 'Inquire',
    href: base + (isEs ? 'es/reservar' : 'book'),
  },
  {
    title: isEs ? 'Clases de Henna' : 'Henna Classes',
    desc: isEs ? 'Aprende el arte del henna con clases guiadas para principiantes y avanzados.' : 'Learn the art of henna with guided classes for beginners and advanced.',
    cta: isEs ? 'Consultar' : 'Inquire',
    href: base + (isEs ? 'es/reservar' : 'book'),
  },
  {
    title: isEs ? 'Tu Propio Diseño' : 'Bring Your Design',
    desc: isEs ? '¿Tienes un diseño? Envíalo y Hanazz lo recreará para ti.' : 'Have a design? Send it over and Hanazz will recreate it for you.',
    cta: isEs ? 'Consultar' : 'Inquire',
    href: base + (isEs ? 'es/reservar' : 'book'),
  },
];
---

<section class="py-20 md:py-28 px-6 bg-bg-warm overflow-hidden">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="section-title">
        {isEs ? 'Servicios' : 'Services'}
      </h2>
      <p class="text-text-muted mt-3 text-sm max-w-md mx-auto">
        {isEs ? 'Cada diseño es personalizado para ti. Sin precios fijos — cada pieza es única.' : 'Every design is customized for you. No fixed prices — each piece is unique.'}
      </p>
    </div>

    <div class="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" id="services-scroll">
      {
        services.map(s => (
          <div class="snap-start shrink-0">
            <ServiceCard
              title={s.title}
              description={s.desc}
              ctaLabel={s.cta}
              ctaHref={s.href}
            />
          </div>
        ))
      }
    </div>

    <!-- Scroll arrows -->
    <div class="flex justify-center gap-4 mt-8">
      <button id="scroll-left" class="glass rounded-full w-10 h-10 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors" aria-label="Scroll left">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button id="scroll-right" class="glass rounded-full w-10 h-10 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors" aria-label="Scroll right">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  </div>
</section>

<script>
  const container = document.getElementById('services-scroll');
  const leftBtn = document.getElementById('scroll-left');
  const rightBtn = document.getElementById('scroll-right');

  if (container && leftBtn) {
    leftBtn.addEventListener('click', () => {
      container.scrollBy({ left: -340, behavior: 'smooth' });
    });
  }
  if (container && rightBtn) {
    rightBtn.addEventListener('click', () => {
      container.scrollBy({ left: 340, behavior: 'smooth' });
    });
  }
</script>
```

- [ ] **Step 3: Build to verify**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 4: Remove old Services section** (covered later in cleanup task, but verify no import breaks)

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/ServiceCard.astro src/components/ui/ServicesCarousel.astro
git commit -m "feat: add ServiceCard (3D tilt) + ServicesCarousel"
```

---

### Task 10: Build Gallery Preview + Lightbox

**Files:**
- Create: `src/components/ui/Lightbox.astro`
- Rewrite: `src/components/sections/Gallery.astro`

- [ ] **Step 1: Create Lightbox.astro**

```astro
---
export interface Props {
  images: { src: string; alt: string }[];
}
---

<div id="lightbox" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center">
  <button id="lb-close" class="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10" aria-label="Close">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  </button>
  <img id="lb-image" class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" src="" alt="" />
</div>

<script>
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lb-image');
  const lbClose = document.getElementById('lb-close');

  window.openLightbox = function(src) {
    if (lightbox && lbImage) {
      lbImage.src = src;
      lightbox.classList.remove('hidden');
      lightbox.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }
  };

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
      document.body.style.overflow = '';
    }
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }
</script>
```

- [ ] **Step 2: Rewrite Gallery section (homepage preview)**

```astro
---
import Lightbox from '../ui/Lightbox.astro';
import GlassButton from '../ui/GlassButton.astro';
import { galleryImages } from '../../lib/images';

export interface Props {
  lang?: 'en' | 'es';
}

const { lang = 'en' } = Astro.props;
const isEs = lang === 'es';
const base = import.meta.env.BASE_URL;
const images = galleryImages.slice(0, 6);
---

<section class="py-20 md:py-28 px-6 bg-bg overflow-hidden">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="section-title">
        {isEs ? 'Galería' : 'Gallery'}
      </h2>
      <p class="text-text-muted mt-3 text-sm">
        {isEs ? 'Una muestra de nuestro trabajo' : 'A glimpse of our work'}
      </p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      {
        images.map(img => (
          <button
            class="aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
            onclick={`openLightbox('${img.src}')`}
          >
            <img
              src={img.src}
              alt={img.alt}
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </button>
        ))
      }
    </div>

    <div class="text-center mt-10">
      <GlassButton href={base + (isEs ? 'es/galeria' : 'gallery')} variant="gold">
        {isEs ? 'Ver Galería Completa' : 'View Full Gallery'}
      </GlassButton>
    </div>
  </div>

  <Lightbox images={[]} />
</section>
```

- [ ] **Step 3: Build to verify**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Lightbox.astro src/components/sections/Gallery.astro
git commit -m "feat: add Lightbox + Gallery preview section"
```

---

### Task 11: Build TestimonialsCarousel

**Files:**
- Create: `src/components/ui/TestimonialsCarousel.astro`
- Delete: `src/components/sections/Testimonials.astro`

- [ ] **Step 1: Create TestimonialsCarousel.astro**

```astro
---
export interface Props {
  lang?: 'en' | 'es';
}

const { lang = 'en' } = Astro.props;
const isEs = lang === 'es';

const testimonials = [
  {
    quote: isEs
      ? 'Hanazz hizo el henna para mi boda y fue absolutamente perfecto. Diseño increíble, color intenso y una artista muy profesional.'
      : 'Hanazz did my wedding henna and it was absolutely perfect. Stunning design, rich color, and such a professional artist.',
    name: 'Sara',
    location: 'Barcelona',
  },
  {
    quote: isEs
      ? 'La mejor experiencia de henna que he tenido. Mi diseño duró más de dos semanas y recibí muchísimos cumplidos.'
      : 'The best henna experience I\'ve had. My design lasted over two weeks and I received so many compliments.',
    name: 'Maria',
    location: 'Barcelona',
  },
  {
    quote: isEs
      ? 'Contraté a Hanazz para un evento corporativo y fue un éxito total. Todos quedaron encantados con sus diseños.'
      : 'I hired Hanazz for a corporate event and it was a huge success. Everyone loved her designs.',
    name: 'Laura',
    location: 'Barcelona',
  },
];
---

<section class="py-20 md:py-28 px-6 bg-bg-warm">
  <div class="max-w-4xl mx-auto text-center">
    <h2 class="section-title">
      {isEs ? 'Testimonios' : 'Testimonials'}
    </h2>
    <p class="text-text-muted mt-3 text-sm">
      {isEs ? 'Lo que dicen nuestros clientes' : 'What our clients say'}
    </p>

    <div class="relative mt-12 overflow-hidden" id="testimonials-track">
      <div class="flex transition-transform duration-500 ease-in-out" id="testimonials-inner">
        {testimonials.map(t => (
          <div class="min-w-full px-4">
            <div class="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-border max-w-2xl mx-auto">
              <svg class="w-8 h-8 text-gold/30 mb-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
              <p class="text-text-muted leading-relaxed italic">{t.quote}</p>
              <div class="mt-6">
                <p class="font-medium text-text text-sm">{t.name}</p>
                <p class="text-xs text-text-muted mt-0.5">{t.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <!-- Dots -->
    <div class="flex justify-center gap-2 mt-8">
      {testimonials.map((_, i) => (
        <button
          class="w-2 h-2 rounded-full bg-gold/30 transition-all duration-300 testimonial-dot"
          data-index={i}
          aria-label={`Go to testimonial ${i + 1}`}
        ></button>
      ))}
    </div>
  </div>
</section>

<script>
  const inner = document.getElementById('testimonials-inner');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (!inner || !dots.length) return;

  let current = 0;
  const total = dots.length;
  let interval = setInterval(next, 5000);

  function next() {
    current = (current + 1) % total;
    goTo(current);
  }

  function goTo(index) {
    current = index;
    inner.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('bg-gold/30', i !== index);
      d.classList.toggle('!bg-gold', i === index);
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      clearInterval(interval);
      goTo(parseInt(dot.dataset.index));
      interval = setInterval(next, 5000);
    });
  });

  // Pause on hover
  const track = document.getElementById('testimonials-track');
  if (track) {
    track.addEventListener('mouseenter', () => clearInterval(interval));
    track.addEventListener('mouseleave', () => { interval = setInterval(next, 5000); });
  }

  // Initialize first dot
  goTo(0);
</script>
```

- [ ] **Step 2: Remove old Testimonials**

```bash
rm src/components/sections/Testimonials.astro
```

- [ ] **Step 3: Build to verify**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/TestimonialsCarousel.astro
git rm src/components/sections/Testimonials.astro
git commit -m "feat: add TestimonialsCarousel with auto-slide"
```

---

### Task 12: Build FAQAccordion

**Files:**
- Create: `src/components/ui/FAQAccordion.astro`
- Delete: `src/components/sections/FAQ.astro`

- [ ] **Step 1: Create FAQAccordion.astro**

```astro
---
export interface Props {
  lang?: 'en' | 'es';
}

const { lang = 'en' } = Astro.props;
const isEs = lang === 'es';

const faqs = [
  {
    q: isEs ? '¿Usas henna natural?' : 'Do you use natural henna?',
    a: isEs
      ? 'Sí, uso henna 100% natural, libre de PPD y productos químicos. Según la UE, el 36% de los productos comerciales de "henna" contienen PPD no declarado — yo preparo mi propia henna desde cero para garantizar su pureza.'
      : 'Yes, I use 100% natural, PPD-free henna. Studies show 36% of commercial "henna" products contain undeclared PPD — I prepare my own henna from scratch to guarantee purity.',
  },
  {
    q: isEs ? '¿Con cuánto tiempo debo reservar?' : 'How far in advance should I book?',
    a: isEs
      ? 'Recomiendo reservar con al menos 2-4 semanas de anticipación, especialmente para eventos nupciales. Para fechas cercanas, contáctame y veré disponibilidad.'
      : 'I recommend booking at least 2-4 weeks in advance, especially for bridal. For last-minute dates, reach out and I\'ll check availability.',
  },
  {
    q: isEs ? '¿Cuánto dura el henna?' : 'How long does the henna last?',
    a: isEs
      ? 'Con los cuidados adecuados, el tinte puede durar de 1 a 3 semanas. Cuanto más tiempo dejes la pasta puesta y menos laves la zona, más durará el color.'
      : 'With proper aftercare, the stain can last 1-3 weeks. The longer you leave the paste on and the less you wash the area, the longer the color lasts.',
  },
  {
    q: isEs ? '¿Ofreces servicios a domicilio?' : 'Do you offer mobile services?',
    a: isEs
      ? 'Sí, puedo desplazarme a tu domicilio o evento en Barcelona y alrededores. Pueden aplicar tarifas de desplazamiento según la distancia.'
      : 'Yes, I can travel to your home or event in Barcelona and surrounding areas. Travel fees may apply depending on distance.',
  },
  {
    q: isEs ? '¿Haces diseños personalizados?' : 'Do you create custom designs?',
    a: isEs
      ? '¡Por supuesto! Me especializo en diseños personalizados. Cuéntame tu visión y trabajaré contigo para crear una pieza única que cuente tu historia.'
      : 'Absolutely! I specialize in bespoke designs. Share your vision and I\'ll work with you to create a unique piece that tells your story.',
  },
  {
    q: isEs ? '¿Cómo cuido mi henna después de la aplicación?' : 'How do I care for my henna after application?',
    a: isEs
      ? 'Mantén la pasta puesta el mayor tiempo posible (4-6 horas mínimo). Evita el agua durante las primeras 12 horas. Aplica bálsamo de henna o aceite de coco para fijar el color. Cuanto más calor, más intenso será el tinte.'
      : 'Keep the paste on as long as possible (4-6 hours minimum). Avoid water for the first 12 hours. Apply henna balm or coconut oil to set the color. The more warmth, the darker the stain.',
  },
];
---

<section class="py-20 md:py-28 px-6 bg-bg">
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="section-title">
        {isEs ? 'Preguntas Frecuentes' : 'FAQs'}
      </h2>
    </div>

    <div class="space-y-3">
      {faqs.map((faq, i) => (
        <div class="faq-item border border-border rounded-xl overflow-hidden bg-white transition-all duration-300">
          <button
            class="faq-toggle w-full flex items-center justify-between px-6 py-5 text-left"
            aria-expanded="false"
          >
            <span class="font-medium text-sm text-text pr-4">{faq.q}</span>
            <span class="faq-icon shrink-0 w-6 h-6 rounded-full border border-gold/30 flex items-center justify-center text-gold transition-transform duration-300">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </span>
          </button>
          <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300">
            <div class="px-6 pb-5 text-sm text-text-muted leading-relaxed">
              {faq.a}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<script>
  document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const icon = btn.querySelector('.faq-icon');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-toggle').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-answer').style.maxHeight = '0';
          other.querySelector('.faq-icon svg').style.transform = 'rotate(0deg)';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
        icon.querySelector('svg').style.transform = 'rotate(0deg)';
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.querySelector('svg').style.transform = 'rotate(45deg)';
      }
    });
  });
</script>
```

- [ ] **Step 2: Remove old FAQ**

```bash
rm src/components/sections/FAQ.astro
```

- [ ] **Step 3: Build to verify**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/FAQAccordion.astro
git rm src/components/sections/FAQ.astro
git commit -m "feat: add FAQAccordion with gold toggles"
```

---

### Task 13: Build CTA section

**Files:**
- Create: `src/components/sections/CTASection.astro`

- [ ] **Step 1: Create CTASection.astro**

```astro
---
import GlassButton from '../ui/GlassButton.astro';

export interface Props {
  lang?: 'en' | 'es';
}

const { lang = 'en' } = Astro.props;
const isEs = lang === 'es';
const base = import.meta.env.BASE_URL;
const whatsappNumber = import.meta.env.PUBLIC_WHATSAPP_NUMBER;
const msg = isEs
  ? 'Hola%20Hanazz!%20Quisiera%20saber%20más%20sobre%20tus%20servicios.'
  : 'Hi%20Hanazz!%20I\'d%20like%20to%20know%20more%20about%20your%20services.';
---

<section class="py-20 md:py-28 px-6 bg-bg-warm text-center">
  <div class="max-w-2xl mx-auto">
    <h2 class="section-title">
      {isEs ? '¿Lista para crear algo hermoso?' : 'Ready to Create Something Beautiful?'}
    </h2>
    <p class="text-text-muted mt-4 text-sm leading-relaxed max-w-md mx-auto">
      {isEs
        ? 'Reserva tu cita o contáctame por WhatsApp para discutir tu diseño ideal.'
        : 'Book your appointment or reach out on WhatsApp to discuss your ideal design.'}
    </p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
      <GlassButton href={base + (isEs ? 'es/reservar' : 'book')} variant="gold">
        {isEs ? 'Reservar Cita' : 'Book Appointment'}
      </GlassButton>
      <GlassButton href={`https://wa.me/${whatsappNumber}?text=${msg}`}>
        {isEs ? 'Contactar por WhatsApp' : 'Contact via WhatsApp'}
      </GlassButton>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Build to verify**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/CTASection.astro
git commit -m "feat: add CTA section with glass buttons"
```

---

### Task 14: Assemble EN homepage

**Files:**
- Rewrite: `src/pages/index.astro`

- [ ] **Step 1: Rewrite index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/sections/Hero.astro';
import About from '../components/sections/About.astro';
import ServicesCarousel from '../components/ui/ServicesCarousel.astro';
import Gallery from '../components/sections/Gallery.astro';
import TestimonialsCarousel from '../components/ui/TestimonialsCarousel.astro';
import FAQAccordion from '../components/ui/FAQAccordion.astro';
import CTASection from '../components/sections/CTASection.astro';

const lang = 'en';
---

<BaseLayout title="Home" description="Barcelona's premier henna artistry — 100% natural, PPD-free henna by Hanazz." lang={lang}>
  <Hero lang={lang} />
  <About lang={lang} />
  <ServicesCarousel lang={lang} />
  <Gallery lang={lang} />
  <TestimonialsCarousel lang={lang} />
  <FAQAccordion lang={lang} />
  <CTASection lang={lang} />
</BaseLayout>
```

- [ ] **Step 2: Remove old unused section imports** — verify no old sections are imported (Experience, Location, LeadMagnet, HowItWorks, old Services, etc.)

- [ ] **Step 3: Build to verify**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: assemble EN homepage with all new sections"
```

---

### Task 15: Build Gallery page

**Files:**
- Create: `src/pages/gallery.astro`

- [ ] **Step 1: Create gallery.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Lightbox from '../components/ui/Lightbox.astro';
import { galleryImages } from '../lib/images';

const lang = 'en';
const instagramUrl = import.meta.env.PUBLIC_INSTAGRAM_URL;
---

<BaseLayout title="Gallery" description="Browse our henna design gallery." lang={lang}>
  <section class="pt-28 pb-20 md:pb-28 px-6 min-h-screen bg-bg">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="section-title">Gallery</h1>
        <p class="text-text-muted mt-3 text-sm">Follow <a href={instagramUrl} target="_blank" rel="noopener noreferrer" class="text-gold underline hover:no-underline">@hennabyhanazz</a> on Instagram for the latest work</p>
      </div>

      <!-- Instagram embed -->
      <div class="max-w-2xl mx-auto">
        <div class="instagram-embed" data-instagram-feed></div>
        <p class="text-center mt-6">
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" class="btn-glass-gold inline-flex">
            Follow on Instagram
          </a>
        </p>
      </div>
    </div>
  </section>

  <Lightbox images={[]} />
</BaseLayout>

<script>
  // Instagram embed script — using LightWidget as simple free option
  (function() {
    var lw = document.createElement('script');
    lw.src = 'https://cdn.lightwidget.com/widgets/lightwidget.js';
    lw.async = true;
    document.head.appendChild(lw);
  })();
</script>
```

- [ ] **Step 2: Build to verify**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 3: Remove old gallery page at `src/pages/gallery.astro` (it exists — will be overwritten)**

- [ ] **Step 4: Commit**

```bash
git add src/pages/gallery.astro
git commit -m "feat: add Gallery page with Instagram embed"
```

---

### Task 16: Build Booking page

**Files:**
- Rewrite: `src/pages/book.astro`

- [ ] **Step 1: Rewrite book.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const lang = 'en';
const contactEmail = import.meta.env.PUBLIC_CONTACT_EMAIL;
---

<BaseLayout title="Book" description="Book your henna appointment." lang={lang}>
  <section class="pt-28 pb-20 md:pb-28 px-6 min-h-screen bg-bg">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="section-title">Book Your Appointment</h1>
        <p class="text-text-muted mt-3 text-sm max-w-md mx-auto">
          Select an available time and Hanazz will reach out to discuss your design and confirm.
        </p>
      </div>

      <!-- cal.com embed -->
      <div class="cal-embed" data-cal-endpoint="hennabyhanazz"></div>

      <div class="mt-12 text-center border-t border-border pt-8">
        <p class="text-xs text-text-muted">
          Bringing your own design? After booking, email it to <a href="mailto:{contactEmail}" class="text-gold underline hover:no-underline">{contactEmail}</a> with your booking code.
        </p>
        <p class="text-xs text-text-muted mt-2">
          Have questions? <a href={`https://wa.me/${import.meta.env.PUBLIC_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" class="text-gold underline hover:no-underline">Message on WhatsApp</a>
        </p>
      </div>
    </div>
  </section>
</BaseLayout>

<script>
  // cal.com embed script
  (function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal;
      let ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        d.head.appendChild(d.createElement('script')).src = 'https://app.cal.com/embed/embed.js';
        cal.loaded = true;
      }
      if (ar[0] === C) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        typeof namespace === 'string' ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, document);

  Cal('init', { theme: 'light' });
  Cal('inline', {
    elementOrSelector: '.cal-embed',
    calLink: 'hennabyhanazz',
    config: { layout: 'month_view' }
  });
</script>
```

- [ ] **Step 2: Build to verify**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 3: Remove old book.astro imports** (old book.astro importing BookingWidget is replaced)

- [ ] **Step 4: Commit**

```bash
git add src/pages/book.astro
git commit -m "feat: rewrite Booking page with cal.com embed"
```

---

### Task 17: Create Spanish versions

**Files:**
- Rewrite: `src/pages/es/index.astro`
- Create: `src/pages/es/galeria.astro`
- Create: `src/pages/es/reservar.astro`

- [ ] **Step 1: Rewrite ES index.astro**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Hero from '../../components/sections/Hero.astro';
import About from '../../components/sections/About.astro';
import ServicesCarousel from '../../components/ui/ServicesCarousel.astro';
import Gallery from '../../components/sections/Gallery.astro';
import TestimonialsCarousel from '../../components/ui/TestimonialsCarousel.astro';
import FAQAccordion from '../../components/ui/FAQAccordion.astro';
import CTASection from '../../components/sections/CTASection.astro';

const lang = 'es';
---

<BaseLayout title="Inicio" description="La mejor henna en Barcelona — Henna 100% natural, libre de PPD por Hanazz." lang={lang}>
  <Hero lang={lang} />
  <About lang={lang} />
  <ServicesCarousel lang={lang} />
  <Gallery lang={lang} />
  <TestimonialsCarousel lang={lang} />
  <FAQAccordion lang={lang} />
  <CTASection lang={lang} />
</BaseLayout>
```

- [ ] **Step 2: Create ES gallery page**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Lightbox from '../../components/ui/Lightbox.astro';
import { galleryImages } from '../../lib/images';

const lang = 'es';
const instagramUrl = import.meta.env.PUBLIC_INSTAGRAM_URL;
---

<BaseLayout title="Galería" description="Explora nuestra galería de diseños de henna." lang={lang}>
  <section class="pt-28 pb-20 md:pb-28 px-6 min-h-screen bg-bg">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="section-title">Galería</h1>
        <p class="text-text-muted mt-3 text-sm">Sigue a <a href={instagramUrl} target="_blank" rel="noopener noreferrer" class="text-gold underline hover:no-underline">@hennabyhanazz</a> en Instagram para ver los últimos trabajos</p>
      </div>

      <div class="max-w-2xl mx-auto">
        <div class="instagram-embed" data-instagram-feed></div>
        <p class="text-center mt-6">
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" class="btn-glass-gold inline-flex">
            Seguir en Instagram
          </a>
        </p>
      </div>
    </div>
  </section>

  <Lightbox images={[]} />
</BaseLayout>

<script>
  (function() {
    var lw = document.createElement('script');
    lw.src = 'https://cdn.lightwidget.com/widgets/lightwidget.js';
    lw.async = true;
    document.head.appendChild(lw);
  })();
</script>
```

- [ ] **Step 3: Create ES booking page**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';

const lang = 'es';
const contactEmail = import.meta.env.PUBLIC_CONTACT_EMAIL;
---

<BaseLayout title="Reservar" description="Reserva tu cita de henna." lang={lang}>
  <section class="pt-28 pb-20 md:pb-28 px-6 min-h-screen bg-bg">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="section-title">Reserva tu Cita</h1>
        <p class="text-text-muted mt-3 text-sm max-w-md mx-auto">
          Selecciona un horario disponible y Hanazz se pondrá en contacto para discutir tu diseño y confirmar.
        </p>
      </div>

      <div class="cal-embed" data-cal-endpoint="hennabyhanazz"></div>

      <div class="mt-12 text-center border-t border-border pt-8">
        <p class="text-xs text-text-muted">
          ¿Tienes tu propio diseño? Después de reservar, envíalo por correo a <a href="mailto:{contactEmail}" class="text-gold underline hover:no-underline">{contactEmail}</a> con tu código de reserva.
        </p>
        <p class="text-xs text-text-muted mt-2">
          ¿Preguntas? <a href={`https://wa.me/${import.meta.env.PUBLIC_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" class="text-gold underline hover:no-underline">Escribe por WhatsApp</a>
        </p>
      </div>
    </div>
  </section>
</BaseLayout>

<script>
  (function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal;
      let ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        d.head.appendChild(d.createElement('script')).src = 'https://app.cal.com/embed/embed.js';
        cal.loaded = true;
      }
      if (ar[0] === C) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        typeof namespace === 'string' ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, document);

  Cal('init', { theme: 'light' });
  Cal('inline', {
    elementOrSelector: '.cal-embed',
    calLink: 'hennabyhanazz',
    config: { layout: 'month_view' }
  });
</script>
```

- [ ] **Step 4: Remove old ES BYOD page if exists**

```bash
rm -f src/pages/es/byod.astro
```

- [ ] **Step 5: Build to verify**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 6: Commit**

```bash
git add src/pages/es/index.astro src/pages/es/galeria.astro src/pages/es/reservar.astro
git commit -m "feat: add Spanish versions for all pages"
```

---

### Task 18: Remove old files

**Files:**
- Delete booking component directory
- Delete old booking-related files
- Delete payments file
- Delete remaining old section files (Experience, Location, LeadMagnet, HowItWorks, old Services)
- Delete confirmation/cancelled booking pages
- Delete old gallery files

- [ ] **Step 1: Remove old files**

```bash
# Booking system
rm -rf src/components/booking
rm -f src/lib/payments.js

# Old sections being replaced
rm -f src/components/sections/Services.astro
rm -f src/components/sections/Experience.astro
rm -f src/components/sections/Location.astro
rm -f src/components/sections/LeadMagnet.astro
rm -f src/components/sections/HowItWorks.astro

# BYOD pages
rm -f src/pages/byod.astro src/pages/es/byod.astro

# Old gallery page
rm -f src/pages/es/gallery.astro

# Old booking pages (confirmation/cancelled)
# Keep these for now in case they're linked from old Stripe Payment Links
# rm -f src/pages/booking/confirmation.astro src/pages/booking/cancelled.astro
# rm -f src/pages/es/booking/confirmation.astro src/pages/es/booking/cancelled.astro
```

- [ ] **Step 2: Build to verify — check for broken imports**

Run: `npm run build`
Expected: 0 errors. If imports break, fix any remaining references to deleted files.

- [ ] **Step 3: Update images config**

Edit `src/lib/images.ts` to use AI-generated placeholder URLs.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove old files — booking system, payments, old sections, BYOD"
```

---

### Task 19: Final build and verify

**Files:**
- Verify: all pages

- [ ] **Step 1: Full build**

```bash
npm run build 2>&1
```

Expected output:
- 0 errors
- All pages generated (should be ~15-18 pages: homepage EN/ES, gallery EN/ES, book EN/ES, legal pages, 404, admin dashboard)

- [ ] **Step 2: Visual check** — open the built site locally to verify:
  - Nav glass effect on scroll
  - Hero parallax
  - Services carousel with 3D tilt
  - Gallery lightbox
  - Testimonials auto-slide
  - FAQ accordion
  - Floating WhatsApp button
  - Gallery page Instagram embed
  - Book page cal.com embed

- [ ] **Step 3: Remove old booking confirmation/cancelled pages** once confirmed no live Stripe links point to them

```bash
rm -f src/pages/booking/confirmation.astro src/pages/booking/cancelled.astro
rm -f src/pages/es/booking/confirmation.astro src/pages/es/booking/cancelled.astro
rm -f src/pages/gift/confirmation.astro src/pages/gift/cancelled.astro
rm -f src/pages/es/gift/confirmation.astro src/pages/es/gift/cancelled.astro
rm -f src/pages/gift-certificate.astro src/pages/es/gift-certificate.astro
rm -f src/pages/my-booking.astro src/pages/es/my-booking.astro
```

- [ ] **Step 4: Final build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: final cleanup — remove old booking and gift pages"
```

---

## Spec Coverage Check

| Spec Requirement | Task |
|-----------------|------|
| Gold/white color tokens | Task 1 |
| Glass UI pattern | Task 1 (globals), Task 2 (GlassButton) |
| Playfair Display + Inter fonts | Task 1 |
| Scroll-reveal animations | Task 1 (global class) |
| Hero parallax | Task 7 |
| About editorial layout | Task 8 |
| Services carousel with 3D tilt | Task 9 |
| No prices anywhere | Task 9 (carousel), all sections |
| Gallery preview on homepage | Task 10 |
| Lightbox | Task 10 |
| Testimonials auto-slide carousel | Task 11 |
| FAQ accordion | Task 12 |
| CTA section | Task 13 |
| Floating WhatsApp | Task 3 |
| Glass nav | Task 4 |
| Footer | Task 5 |
| BaseLayout (light theme) | Task 6 |
| EN homepage assembly | Task 14 |
| Gallery page (Instagram embed) | Task 15 |
| Booking page (cal.com) | Task 16 |
| Spanish versions | Task 17 |
| Remove old files | Task 18 |
| AI placeholder images | Task 18 (images.ts) |
