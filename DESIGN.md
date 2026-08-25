---
name: Aura & Ink
colors:
  surface: '#faf9f7'
  surface-dim: '#dadad8'
  surface-bright: '#faf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeec'
  surface-container-high: '#e9e8e6'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fc'
  on-secondary-container: '#57657a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c1b1a'
  on-tertiary-container: '#868382'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485b'
  tertiary-fixed: '#e6e2df'
  tertiary-fixed-dim: '#cac6c4'
  on-tertiary-fixed: '#1c1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e0'
  surface-dark: '#121212'
  text-on-dark: '#E5E7EB'
  border-muted: '#E2E2E0'
  accent-slate: '#64748B'
typography:
  display-xl:
    fontFamily: Syne
    fontSize: 84px
    fontWeight: '800'
    lineHeight: 92px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Syne
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  baseline: 8px
  container-max: 1100px
  gutter: 32px
  section-gap: 160px
---

## Brand & Style

The design system is rooted in the philosophy of "Editorial Minimalism." It pivots away from typical developer tropes—high-intensity glows, complex grids, and tech-heavy illustrations—to focus on the persona behind the code. The brand personality is intellectual, refined, and quietly confident, positioning the developer as a thoughtful architect rather than a mere technician.

The visual style follows a **Modern Editorial** movement. It utilizes generous whitespace, asymmetric layouts, and high-contrast typography to create a narrative flow similar to a premium broadsheet or high-fashion digital journal. Every element serves a functional purpose; decoration is achieved through the tension between scale and emptiness. The interface should feel tangible and deliberate, prioritizing readability and a calm user experience over frenetic interaction.

## Colors

This design system employs a dual-mode palette centered on warmth and legibility. 

- **Light Mode (Default):** Uses a "Paper" foundation (#F9F8F6) to reduce eye strain and provide a tactile, editorial feel. Typography is near-black (#1A1A1A) to ensure maximum contrast without the harshness of pure black.
- **Dark Mode:** Transitions to "Inkwell" (#121212), maintaining high legibility with soft white text (#E5E7EB).
- **Accents:** A restrained Slate Blue is used sparingly for interactive cues and focus states. This color is intentionally desaturated to remain harmonious with the neutral base.
- **Borders:** Subtle, low-contrast lines are used to define structure without creating visual noise.

## Typography

The typographic strategy creates a clear hierarchy through drastic scale shifts. 

- **Display & Headlines:** Use *Syne*, an avant-garde font that feels architectural and bold. These should be set with tight letter-spacing to create a "block" of text effect.
- **Body Text:** Use *Hanken Grotesk* for its exceptional clarity and modern proportions. Line heights are purposefully generous (1.5x–1.6x) to facilitate long-form reading in the "About" and "Process" sections.
- **Technical Accents:** *JetBrains Mono* is used for metadata, labels, and small UI details to subtly nod to the developer's craft without overwhelming the editorial aesthetic.

## Layout & Spacing

The layout utilizes a **Fixed Grid** system for desktop to ensure a controlled editorial experience, transitioning to a flexible fluid system for mobile.

- **Desktop (1200px+):** A 12-column grid with a narrow 1100px max-width container. This centers the content and provides significant "breathing room" on the flanks.
- **Section Gaps:** Vertical spacing between major sections is aggressive (160px) to force a mental reset as the user scrolls.
- **Asymmetry:** Content should frequently "break" the grid—for example, a headline spanning 8 columns on the left while the right 4 columns remain empty.
- **Mobile (<768px):** Margins shrink to 20px, and section gaps reduce to 80px. Headlines must scale down to prevent awkward wrapping.

## Elevation & Depth

This design system avoids traditional shadows in favor of **Tonal Layering** and **Low-Contrast Outlines**.

- **Surfaces:** Depth is suggested by subtle shifts in background color (e.g., a card being 2% darker or lighter than the main background).
- **Outlines:** Instead of shadows, use 1px borders in `border-muted`. These should be hair-line thin to maintain the sophisticated, flat look.
- **Interactions:** Hover states should not use elevation (lifting). Instead, use slight color shifts or internal fills.
- **Glassmorphism:** Only used for the navigation bar—a high-blur (20px), low-opacity backdrop filter that allows the content to peak through as the user scrolls.

## Shapes

The shape language is "Soft-Modern." Elements use a very slight radius (4px) to take the "edge" off the brutalist roots of the grid without becoming overly playful or bubbly.

- **Primary Elements:** 4px radius for buttons, input fields, and small cards.
- **Images:** Large project images should remain sharp (0px) to mimic a printed magazine layout.
- **Interactive Triggers:** Small chips or tags can utilize the pill-shape (32px radius) to differentiate them from structural content.

## Components

### Buttons
Primary buttons are solid `primary_color_hex` with `text_on_dark` typography. They should be wide with generous horizontal padding. Secondary buttons are outlined with 1px `border-muted`. No gradients or shadows.

### Navigation
A "Floating Dock" or a minimalist top-bar. It must be highly transparent with a heavy backdrop blur. Links use `label-sm` typography with a simple underline transition on hover.

### Project Blocks
Large, full-width or half-width blocks. The image is the hero—use neutral, desaturated placeholders. The project title is set in `headline-lg`. A short description follows in `body-md`.

### Input Fields
Minimalist bottom-border only or very light 1px outlines. Labels sit above the field in `label-sm`. Focus states use a subtle color change in the border to `accent-slate`.

### Chips / Tags
Used for tech stacks. Small, `label-sm` text inside a light-gray or slate-tinted background. No borders, just a subtle fill to keep the interface clean.

### The "Editorial" About Section
A mixture of `display-xl` pull-quotes and multi-column `body-lg` text. Use horizontal rules (`<hr>`) to separate paragraphs and create a sense of structure similar to a magazine feature.