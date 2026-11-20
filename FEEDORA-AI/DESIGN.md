---
name: LocalPulse AI
description: AI-powered customer intelligence and business growth engine with Liquid Glass UI
colors:
  # Background layers
  bg-canvas: "#05070E"
  bg-surface: "rgba(17, 24, 39, 0.65)"
  bg-glass: "rgba(17, 24, 39, 0.4)"
  bg-glass-strong: "rgba(17, 24, 39, 0.75)"
  
  # Glass borders and highlights
  border-glass: "rgba(255, 255, 255, 0.1)"
  border-highlight: "rgba(255, 255, 255, 0.08)"
  
  # Primary accents
  primary: "#0EA5E9"
  primary-hover: "#0284C7"
  primary-dark: "#0369A1"
  primary-glow: "rgba(14, 165, 233, 0.25)"
  primary-glow-soft: "rgba(14, 165, 233, 0.12)"
  
  # Secondary accents
  secondary: "#10B981"
  secondary-hover: "#059669"
  secondary-dark: "#047857"
  secondary-glow: "rgba(16, 185, 129, 0.25)"
  
  # Status colors
  status-positive: "#10B981"
  status-negative: "#F87171"
  status-warning: "#F59E0B"
  
  # Text
  text-primary: "#F8FAFC"
  text-secondary: "#CBD5E1"
  text-muted: "#94A3B8"

typography:
  body:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  title:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.25
  headline:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.3
  display:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.1

rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  "2xl": "20px"
  full: "9999px"

spacing:
  xs: "0.125rem"
  sm: "0.25rem"
  md: "0.5rem"
  lg: "1rem"
  xl: "1.5rem"
  "2xl": "2rem"
  "3xl": "3rem"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
    backdropFilter: "blur(12px)"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    boxShadow: "0 4px 24px -4px {colors.primary-glow}"
  button-secondary:
    backgroundColor: "{colors.bg-glass}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
    border: "{colors.border-glass}"
  button-icon:
    backgroundColor: "{colors.bg-glass}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    width: "2.5rem"
    height: "2.5rem"
  card-glass:
    backgroundColor: "{colors.bg-glass}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    border: "{colors.border-glass}"
    backdropFilter: "blur(12px)"
  sidebar-glass:
    backgroundColor: "{colors.bg-glass-strong}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    border: "{colors.border-glass}"
---

# Design System: LocalPulse AI

## Overview

**Creative North Star: "Liquid Intelligence"**

LocalPulse AI transforms into a premium SaaS dashboard with Apple's Liquid Glass design language—translucent surfaces, sophisticated blur effects, and layered depth that feels both futuristic and grounded. The interface breathes with subtle ambient lighting, where glass panels float above a deep midnight canvas, and interactive elements shimmer with restrained elegance.

This is not a glass-and-glitter spectacle—it's a refined business intelligence companion where the physics of light and depth guide the user's eye to what matters.

**Key Characteristics:**
- Liquid glass panels with selective backdrop blur
- Deep midnight canvas (#05070E) for true black
- Muted electric blue primary accent (#0EA5E9)
- Strategic use of transparency (never everywhere)
- Subtle glow effects for interactive elements
- Tonal layering for depth (no heavy shadows)

## Colors

The palette is designed for a premium dark aesthetic with glass-inspired translucency.

### Primary
- **Electric Blue (500)** (#0EA5E9): The core action color for CTAs, active states, and key interactions. Muted yet distinctive.
- **Electric Blue (hover)** (#0284C7): Hover state with slight brightening.
- **Electric Blue (dark)** (#0369A1): Active/pressed state.
- **Glow** (rgba(14, 165, 233, 0.25)): Subtle glow for focus and hover states.

### Secondary
- **Emerald (500)** (#10B981): Success states, positive sentiment, rising trends.
- **Emerald Glow** (rgba(16, 185, 129, 0.25)): Positive action accent.

### Glass & Surface
- **Canvas** (#05070E): The true black background, eliminates harsh contrast.
- **Surface (65%)** (rgba(17, 24, 39, 0.65)): Semi-transparent cards and panels.
- **Glass (40%)** (rgba(17, 24, 39, 0.4)): Floating UI elements, dropdowns, tooltips.
- **Glass Strong (75%)** (rgba(17, 24, 39, 0.75)): Sidebar, modals, persistent surfaces.
- **Border Glass** (rgba(255, 255, 255, 0.1)): Subtle glass border highlights.

### Text
- **Primary** (#F8FAFC): Main text, icons, data points.
- **Secondary** (#CBD5E1): Labels, descriptions, secondary content.
- **Muted** (#94A3B8): Disabled states, placeholders.

**The Transparency Rule.** Glass effects apply only to interactive or floating elements. Static backgrounds remain solid to preserve clarity and performance.

## Typography

**Font:** Inter (system-ui stack) — chosen for excellent readability at all sizes and clean modern aesthetics.

### Hierarchy
- **Display** (800, 2.25rem, 1.1): Hero headlines, main page titles.
- **Headline** (700, 1.75rem, 1.3): Section headers, dashboard titles.
- **Title** (600, 1.25rem, 1.25): Component titles, card headers.
- **Body** (400, 1rem, 1.5): Main content, descriptions, data. Max line length 65–75ch.
- **Label** (600, 0.875rem, 1.25, Uppercase): Button text, badge labels.

### Glass Typography
All text on glass surfaces uses subtle text-shadow to maintain legibility: `text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3)`.

## Layout

The dashboard follows a refined grid with generous whitespace that lets glass panels breathe.

**Breakpoints:**
- Mobile: <640px — collapsed sidebar, single column
- Tablet: 640px–1024px — expanded sidebar, 2-column grid
- Desktop: ≥1024px — full layout with 12-column grid

**Container Spacing:**
- Main content: max-w-7xl mx-auto px-6 lg:px-8
- Card gutters: gap-6 lg:gap-8
- Section padding: py-8 lg:py-12

## Elevation & Depth

The Liquid Glass aesthetic creates depth through tonal layering and subtle blurs, not heavy shadows.

### Depth Layers (back to front):
1. **Canvas** (solid): Deep midnight, true black
2. **Cards** (65% opacity): Main content panels
3. **Glass Elements** (40% opacity): Floating buttons, badges
4. **Active/Focus** (75% opacity with glow): Selected items, modals

### Glass Effects:
- **Backdrop Blur**: 12px for cards, 8px for smaller elements
- **Border**: 1px solid rgba(255, 255, 255, 0.1) with subtle gradient
- **Inner Glow**: 0 0 8px -4px rgba(14, 165, 233, 0.1) for active states

**The Layered Glass Rule.** Glass is not uniform—strength varies by element importance. Background cards are lighter than floating UI elements.

## Shapes

The form language embraces gentle curves that echo glass shaping.

- **Major Containers** (sidebar, modals): 16px border-radius
- **Standard Cards** (dashboard, feature cards): 12px border-radius
- **Buttons**: 8px border-radius on primary/secondary, 9999px for icon buttons
- **Elements**: 6px for badges, chips, and small UI

**The Curved Glass Rule.** All glass elements have rounded corners that suggest malleability and softness.

## Components

### Buttons

#### Primary Button
- **Shape:** 8px rounded, icon buttons are 9999px (pill/circle)
- **Glass Treatment:** 65% opaque background with blur (12px)
- **Border:** 1px solid rgba(255, 255, 255, 0.1)
- **Text:** Clean white with subtle shadow for glass legibility
- **Hover:** Glow effect appears, subtle scale (95%→100%)
- **Active:** Slight press-down with darkened background

#### Secondary Button
- **Shape:** 8px rounded
- **Style:** Ghost button with glass background (40% opacity)
- **Border:** Glass border highlight
- **Hover:** Background strengthens, border intensifies

#### Icon Button
- **Shape:** Perfect circle (9999px radius)
- **Glass:** Semi-transparent background
- **Focus:** Visible focus ring with primary color

### Cards / Containers

#### Glass Card (Dashboard Content)
- **Shape:** 12px border-radius
- **Glass:** 65% opaque with 12px backdrop blur
- **Border:** Subtle white highlight at 0.1 opacity
- **Padding:** 1.5rem–2rem internal spacing
- **Hover:** Subtle glow at bottom edge, border intensifies

#### Feature Card (Landing Page)
- **Shape:** 12px rounded
- **Layer:** Glass with blur
- **Glow:** Soft inner glow on hover

### Sidebar Navigation

The sidebar is the primary glass anchor—stronger than cards since it persists.

- **Shape:** 16px radius on container, 12px on inner content
- **Glass:** 75% opaque with 12px blur
- **Background:** Deep glass that distinguishes from canvas
- **Navigation Items:** 
  - Active: Primary color background (20% opacity) with left border indicator
  - Hover: Background strengthens slightly
  - Badge: Cyan accent for "Differentiator"
- **Mobile:** Slides in overlay with backdrop

### Modals & Dialogs

- **Backdrop:** Black 60% opacity with subtle blur
- **Container:** Stronger glass (75%) with 16px radius
- **Border:** Elegant glass border
- **Entrance:** Fade-in + subtle scale from 0.95 to 1

### Data Visualization

#### Charts
- **Background:** Transparent (inherits from glass card)
- **Grid Lines:** Subtle at 15% opacity
- **Tooltips:** Pure glass with strong blur (16px), border highlight
- **Positive/Negative:** Emerald/Rose with 700 shade for clarity

#### Demand Signal Cards
- **Shape:** 12px radius
- **Glass:** Standard card glass
- **Rank Badge:** Circular with primary color, white number
- **Score Display:** Large tabular digits with cyan accent
- **Supporting Quotes:** Frosted glass panel with subtle border

### Badges

- **Shape:** 9999px (pill) with 6px padding
- **Primary Accent:** Blue background (15% opacity) with border
- **Status:** Emerald for positive, rose for negative
- **Text:** Uppercase, small caps, font-weight 600

## Do's and Don'ts

### Do:
- **Do** use backdrop-filter: blur(12px) on cards and glass elements, but never on scroll containers for performance.
- **Do** layer transparency carefully—canvas is solid, cards are 65%, glass elements are 40-75%.
- **Do** use tabular numbers for all metrics and scores.
- **Do** apply text shadows on glass surfaces for legibility.
- **Do** use the electric blue sparingly as a primary accent color.
- **Do** animate hover states with a 200ms cubic-bezier(0.4, 0, 0.2, 1) curve.

### Don't:
- **Don't** use glass on large scrollable areas—performance impact.
- **Don't** overuse transparency—maintain visual hierarchy.
- **Don't** use heavy drop shadows—layering and blur create depth instead.
- **Don't** animate too many properties simultaneously.
- **Don't** use pure black backgrounds—use deep midnight charcoal.
- **Don't** apply blur to body or main container—only floating/surface elements.