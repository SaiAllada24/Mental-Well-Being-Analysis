# Mental Health Risk Profiling Application - Design Guidelines

## Design Approach
**Selected Approach**: Reference-Based Design inspired by healthcare and wellness applications like Headspace and Calm, combined with productivity tools like Notion for form interactions. This approach prioritizes trust, accessibility, and emotional safety while maintaining professional credibility.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Light Mode: Deep teal (180 75% 25%) for trust and calm
- Dark Mode: Soft teal (180 60% 85%) for reduced eye strain
- Background: Pure white (0 0% 100%) / Dark slate (220 15% 8%)

**Supporting Colors:**
- Success/Progress: Soft green (140 50% 45%)
- Warning/Attention: Warm amber (40 85% 60%)
- Neutral text: Charcoal (220 10% 20%) / Light gray (220 10% 85%)

**Accent Strategy:**
- Minimal accent usage - primary teal provides sufficient brand identity
- Subtle gradient overlays on hero sections using teal variations

### B. Typography
**Primary Font**: Inter (Google Fonts) - excellent readability for forms and data
**Headings**: Inter Medium/Semibold
**Body Text**: Inter Regular
**Form Labels**: Inter Medium for clarity

### C. Layout System
**Tailwind Spacing Units**: Consistent use of 2, 4, 8, 12, and 16 units
- Micro spacing (2): Form element gaps
- Small spacing (4): Card padding, button padding
- Medium spacing (8): Section gaps, form field spacing
- Large spacing (12): Component separation
- Extra large (16): Major section breaks

### D. Component Library

**Forms & Input Elements:**
- Large, accessible form fields with clear labels
- Multi-step form progression with visual indicators
- Dropdown selectors for categorical data (Occupation, etc.)
- Radio buttons and checkboxes with generous touch targets
- Progress indicator showing assessment completion

**Navigation:**
- Clean header with minimal navigation
- Step-by-step breadcrumbs for form progression
- Clear "Back" and "Continue" buttons

**Data Display:**
- Profile result cards with emoji indicators
- Expandable sections for detailed profile information
- Clean typography hierarchy for readability
- Quote callouts with distinctive styling

**Overlays:**
- Modal for profile explanations
- Tooltip help text for form fields
- Confirmation dialogs for form submission

### E. Page Structure

**Assessment Form:**
- Single-column layout for focus
- Grouped related questions in cards
- Progress bar at top
- Field descriptions and help text
- Maximum 3-4 questions per screen to avoid overwhelm

**Results Page:**
- Hero section with assigned profile
- Detailed narrative and suggestions
- Celebrity parallel and statistics
- Action buttons for saving/sharing results
- Related resources section

**Landing Page:**
- Minimal 3-section design: Hero, How It Works, Start Assessment
- Soft gradient background (teal variations)
- Trust indicators and privacy assurance
- Single focused CTA to begin assessment

## Key Design Principles
1. **Emotional Safety**: Soft colors, generous spacing, non-judgmental language
2. **Accessibility**: High contrast, clear typography, keyboard navigation
3. **Trust Building**: Professional appearance, clear privacy messaging
4. **Progressive Disclosure**: Information revealed step-by-step to avoid overwhelm
5. **Empathy-Driven**: Warm, supportive tone throughout the experience

## Images
No large hero images recommended - this application should feel clean and clinical rather than marketing-heavy. Consider:
- Small illustrative icons for each mental health profile
- Subtle background patterns or gradients
- Professional headshots only if featuring mental health professionals

## Animations
Minimal and purposeful only:
- Smooth transitions between form steps
- Gentle fade-ins for result content
- Progress bar animations