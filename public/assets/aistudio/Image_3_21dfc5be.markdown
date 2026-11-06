---
name: AgroHorta Fieldwork System
colors:
  surface: '#ebffe5'
  surface-dim: '#c8e1c3'
  surface-bright: '#ebffe5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e1fbdc'
  surface-container: '#dcf5d6'
  surface-container-high: '#d6efd0'
  surface-container-highest: '#d0e9cb'
  on-surface: '#0c200d'
  on-surface-variant: '#41493e'
  inverse-surface: '#213521'
  inverse-on-surface: '#dff8d9'
  outline: '#717a6d'
  outline-variant: '#c0c9bb'
  surface-tint: '#2a6b2c'
  primary: '#00450d'
  on-primary: '#ffffff'
  primary-container: '#1b5e20'
  on-primary-container: '#90d689'
  inverse-primary: '#91d78a'
  secondary: '#006e1c'
  on-secondary: '#ffffff'
  secondary-container: '#91f78e'
  on-secondary-container: '#00731e'
  tertiary: '#523327'
  on-tertiary: '#ffffff'
  tertiary-container: '#6c493d'
  on-tertiary-container: '#e9baaa'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#acf4a4'
  primary-fixed-dim: '#91d78a'
  on-primary-fixed: '#002203'
  on-primary-fixed-variant: '#0c5216'
  secondary-fixed: '#94f990'
  secondary-fixed-dim: '#78dc77'
  on-secondary-fixed: '#002204'
  on-secondary-fixed-variant: '#005313'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ebbcac'
  on-tertiary-fixed: '#2e150b'
  on-tertiary-fixed-variant: '#603f33'
  background: '#ebffe5'
  on-background: '#0c200d'
  surface-variant: '#d0e9cb'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system delivers an operational, resilient, and grounded aesthetic tailored for market gardeners and commercial vegetable growers operating between the open field, packaging stations, and wholesale points of sale. 

The visual style unites **tactile utilitarianism** with **high-contrast functional modernism**:
- **Field-Ready Clarity**: Visual hierarchy engineered to combat harsh sunlight, high ambient glare, dirty screen smudges, and rapid one-handed outdoor usage.
- **Organic Precision**: Deep foliage tones paired with warm arable loam neutrals, steering clear of artificial corporate blues or hyper-saturated neon greens.
- **Empathetic Utility**: Reassuring, robust components that instill financial confidence and agricultural rigor without cognitive friction.

## Colors
The color palette reflects agrarian growth, soil fertility, and urgent crop schedules while meeting strict outdoor readability standards.

### Functional Palette Mapping
- **Primary (`#1B5E20`)**: Deep agricultural canopy green used for main actions, navigation anchors, key balance headings, and critical validation.
- **Secondary (`#4CAF50`)**: Vibrant sprout green for active selections, progress indicators, positive metric badges, and harvest readiness accents.
- **Tertiary (`#795548`)**: Rich loam earth tone for category identifiers, operational overhead labels, and plot/bed numbering.
- **Neutral Dark (`#1A2E1A` / `#263238`)**: Ultra-high-contrast chlorophyll-black for primary numbers, invoice values, and critical labels to ensure zero readability failure in direct sunlight.
- **Canvas & Surfaces (`#F8FAF8`, `#FFFFFF`, `#F1F5F1`)**: Sun-resistant reflective bases with microscopic warm-green undertones that minimize eye strain without lowering contrast.
- **Semantic Signals**:
  - *Harvest Ready / Credit Inflow*: Emerald tint (`#2E7D32` surface with `#E8F5E9` container).
  - *Pending / Low Stock Alert*: Ripe Amber (`#F57C00` surface with `#FFF3E0` container).
  - *Overdue / Pests / Losses*: Iron Rust (`#C62828` surface with `#FFEBEE` container).
  - *Customer Credit ("Fiado")*: Terra-Cotta Ochre (`#D84315` surface with `#FBE9E7` container).

## Typography
Typography prioritizes instant glanceability over ornate flair. **Inter** provides neutral, robust geometry with distinct tall x-height and open counters.

### Typographic Rules
- **Monetary & Measurement Scale**: Financial numbers (`R$ 14.850,00`) and harvest yields (`420 kg`) use `Font Weight: 800` or `700` with tabular figures enabled (`font-feature-settings: "tnum"`).
- **Mobile Readability Rule**: Never drop field status labels or stock indicators below `11px`. Primary labels under field operational views default to `12px` or `14px` bold.
- **Sunlight Legibility**: Body copy avoids thin weights entirely; default body text utilizes weight `400` or `500` to prevent washed-out strokes during screen glare.

## Layout & Spacing
A fluid column framework focused on single-hand mobile ergonomics (`4-column` layout on mobile devices with `16px` gutters and `16px` outer gutters). 

### Layout Guidelines
- **Thumb Zone Centric**: Primary workflow triggers (record batch, log harvest, emit sale) remain locked to bottom sheets and thumb-accessible zones.
- **Touch Target Generosity**: Minimum touch target dimensions are `48px × 48px`, expanding to `56px` for primary field transactions to account for gloved operations and motion bumps.
- **Data Spacing**: Financial and field tracking lists maintain an internal cell padding minimum of `space-md` (`16px`) to eliminate accidental miss-taps.

## Elevation & Depth
In bright sunlight, subtle shadows disappear completely. This design system discards soft, low-contrast shadows in favor of **tonal stratification combined with crisp boundary containment**.

### Depth Layers
- **Base Canvas (Level 0)**: Light reflective green-tinted canvas (`#F8FAF8`).
- **Surface Cards (Level 1)**: Pure white background (`#FFFFFF`) framed by a calibrated 1px border (`#E0E8E0`). Optional heavy ambient contact shadow: `0 2px 4px rgba(26, 46, 26, 0.06)`.
- **Raised Interactive Cards (Level 2)**: Used for active harvest lots and uncollected credits. Border increases to 1.5px (`#C8D6C8`) with layered ground shadow: `0 4px 12px rgba(27, 94, 32, 0.08)`.
- **Floating Modals & Field Triggers (Level 3)**: Fixed quick-action buttons and bottom-sheet drawers use `0 8px 24px rgba(26, 46, 26, 0.16)` with a solid `#FFFFFF` surface.

## Shapes
The shape language uses generous radii (`rounded-2xl` equivalent on primary cards and sheets) to provide an approachable, modern agricultural tool feel while softening the high data density of ledger balance sheets.

- **Cards & Data Containers**: `1rem` (16px) corner radius.
- **Primary Buttons & Field Inputs**: `0.75rem` to `1rem` (12px to 16px) for tactile button pads.
- **Badges, Tags, and Pill Counters**: Fully pill-shaped (`9999px`) to immediately distinguish statuses from actionable rectangular buttons.

## Components

### 1. Buttons
- **Primary Action (Field Transaction)**: Height of `56px`. Solid `#1B5E20` fill, pure white text (`#FFFFFF`), `Inter 700`, radius `14px`. Full width on mobile screens for easy thumb reach.
- **Secondary (Stock Filter/Lot Select)**: Height of `48px`. Surface `#FFFFFF`, border `1.5px solid #2E7D32`, text `#1B5E20`, `Inter 600`.
- **Destructive / Loss Record**: Light tint surface `#FFEBEE`, text `#C62828`, border `1px solid #FFCDD2`.

### 2. Status Badges & Chips
Badges represent agricultural and financial viability at a glance. Height is fixed at `28px` to `32px` with horizontal padding of `12px` and `Inter Bold 12px`:
- **Pago (Paid)**: `#E8F5E9` background, `#1B5E20` text, leading check icon.
- **Pendente (Pending)**: `#FFF3E0` background, `#E65100` text, leading clock icon.
- **Fiado (Store Credit)**: `#FBE9E7` background, `#BF360C` text, leading user-debt icon.
- **Colheita Pronta (Ready for Harvest)**: `#E8F8F5` background, `#00796B` text, leaf icon.
- **Estoque Baixo (Low Stock)**: `#FFEBEE` background, `#C62828` text, exclamation icon.

### 3. Financial & Plot Cards
- Enclosed with `rounded-2xl` (16px), background `#FFFFFF`, border `1px solid #E0E8E0`.
- Internal padding is `16px`. Header features crop label or customer name (`title-md`), right-aligned status badge, followed by a bold financial balance (`display-lg-mobile`) in `#1A2E1A`.
- Sub-data row utilizes two-column meta tags (e.g., "Canteiro 04" | "Colheita estimada: 120 maços").

### 4. Field Inputs & Quantity Steppers
- **Height**: Minimum `54px` to allow fast finger tapping during field audits.
- **Borders**: 1.5px solid `#B0BEC5` resting state, transitioning to 2px solid `#1B5E20` on active focus.
- **Steppers**: Large minus and plus hitboxes (`48px × 48px`) flanking bold numeric centers for fast basket counting.

### 5. Checkboxes & Radio Selectors
- Sized at `24px × 24px` with a minimum touchable wrapper of `48px × 48px`.
- High contrast: Active state filled with `#1B5E20` and sharp white checkmark to remain distinct in high ambient sunlight.