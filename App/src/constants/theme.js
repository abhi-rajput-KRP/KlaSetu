export const COLORS = {
  // Brand / Primary from DesignDoc.md
  primary: '#3C6E47',       // Deep sage green
  primaryDark: '#2F5838',   // Hover / active dark green
  primaryLight: '#EBF3EC',  // Soft tint for badges and highlights

  // Accent / Craft tones
  terracotta: '#B5652F',    // Deep clay / craft orange
  terracottaDark: '#9B5324',
  terracottaLight: '#FBF0E9',

  // Backgrounds & Surfaces
  linen: '#F3E6D3',         // Warm hero accent / kraft tone
  surface: '#FFFDF9',       // Off-white main surface
  surfaceCard: '#FFFFFF',   // Card background
  surfaceMuted: '#F7F3EC',

  // Text Hierarchy
  textPrimary: '#2B2420',   // Charcoal brown
  textSecondary: '#8A8078', // Warm gray
  textMuted: '#B2AAA2',
  textLight: '#FFFDF9',

  // Accents
  star: '#F5B301',          // Gold rating star
  badge: '#C77B3E',         // Discount / tag terracotta
  border: '#EDE4D6',        // Subtle card border
  borderLight: '#F5EFE6',
  danger: '#DC2626',
  success: '#16A34A',
};

export const SHADOWS = {
  card: {
    shadowColor: '#2B2420',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHover: {
    shadowColor: '#2B2420',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  button: {
    shadowColor: '#3C6E47',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
};

export const RADII = {
  sm: 8,
  md: 12,
  card: 16,
  xl: 24,
  pill: 9999, // Pill shaped CTAs as specified in DesignDoc
};
