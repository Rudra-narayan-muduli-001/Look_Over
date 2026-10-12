export const tokens = {
  colors: {
    brand: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    surface: {
      0: '#ffffff',
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b',
    },
    accent: {
      cyan: {
        50: '#ecfeff',
        100: '#cffafe',
        200: '#a5f3fc',
        300: '#67e8f9',
        400: '#22d3ee',
        500: '#06b6d4',
        600: '#0891b2',
        700: '#0e7490',
        800: '#155e75',
        900: '#164e63',
        950: '#083344',
      },
      amber: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
        950: '#451a03',
      },
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  typography: {
    fontFamilies: {
      sans: ['Geist', 'system-ui', 'sans-serif'],
      mono: ['Geist Mono', 'monospace'],
      display: ['Geist', 'system-ui', 'sans-serif'],
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
      '9xl': '8rem',
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.1,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  radii: {
    none: '0',
    sm: '0.25rem',
    DEFAULT: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '2xl': '0 50px 100px -20px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    focus: '0 0 0 3px rgb(6 182 212 / 0.4)',
    glow: '0 0 20px rgb(6 182 212 / 0.3)',
    glowLg: '0 0 40px rgb(6 182 212 / 0.2)',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
    normal: '200ms cubic-bezier(0.16, 1, 0.3, 1)',
    slow: '300ms cubic-bezier(0.16, 1, 0.3, 1)',
    slower: '500ms cubic-bezier(0.16, 1, 0.3, 1)',
    spring: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
    bounce: '600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  zIndices: {
    hide: -1,
    auto: 'auto',
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    modal: 1300,
    popover: 1400,
    tooltip: 1500,
    toast: 1700,
    grain: 9999,
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  motion: {
    durations: {
      instant: '0ms',
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    easings: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
  },
};

export type Tokens = typeof tokens;

export const cssVariables = `
  :root {
    /* Brand */
    --color-brand-50: ${tokens.colors.brand[50]};
    --color-brand-100: ${tokens.colors.brand[100]};
    --color-brand-200: ${tokens.colors.brand[200]};
    --color-brand-300: ${tokens.colors.brand[300]};
    --color-brand-400: ${tokens.colors.brand[400]};
    --color-brand-500: ${tokens.colors.brand[500]};
    --color-brand-600: ${tokens.colors.brand[600]};
    --color-brand-700: ${tokens.colors.brand[700]};
    --color-brand-800: ${tokens.colors.brand[800]};
    --color-brand-900: ${tokens.colors.brand[900]};
    --color-brand-950: ${tokens.colors.brand[950]};

    /* Surface */
    --color-surface-0: ${tokens.colors.surface[0]};
    --color-surface-50: ${tokens.colors.surface[50]};
    --color-surface-100: ${tokens.colors.surface[100]};
    --color-surface-200: ${tokens.colors.surface[200]};
    --color-surface-300: ${tokens.colors.surface[300]};
    --color-surface-400: ${tokens.colors.surface[400]};
    --color-surface-500: ${tokens.colors.surface[500]};
    --color-surface-600: ${tokens.colors.surface[600]};
    --color-surface-700: ${tokens.colors.surface[700]};
    --color-surface-800: ${tokens.colors.surface[800]};
    --color-surface-900: ${tokens.colors.surface[900]};
    --color-surface-950: ${tokens.colors.surface[950]};

    /* Accent Cyan */
    --color-accent-cyan-500: ${tokens.colors.accent.cyan[500]};
    --color-accent-cyan-600: ${tokens.colors.accent.cyan[600]};

    /* Accent Amber */
    --color-accent-amber-500: ${tokens.colors.accent.amber[500]};
    --color-accent-amber-600: ${tokens.colors.accent.amber[600]};

    /* Semantic */
    --color-success: ${tokens.colors.semantic.success};
    --color-warning: ${tokens.colors.semantic.warning};
    --color-error: ${tokens.colors.semantic.error};
    --color-info: ${tokens.colors.semantic.info};

    /* Typography */
    --font-sans: ${tokens.typography.fontFamilies.sans.join(', ')};
    --font-mono: ${tokens.typography.fontFamilies.mono.join(', ')};
    --font-display: ${tokens.typography.fontFamilies.display.join(', ')};

    /* Spacing */
    --space-1: ${tokens.spacing[1]};
    --space-2: ${tokens.spacing[2]};
    --space-3: ${tokens.spacing[3]};
    --space-4: ${tokens.spacing[4]};
    --space-5: ${tokens.spacing[5]};
    --space-6: ${tokens.spacing[6]};
    --space-8: ${tokens.spacing[8]};
    --space-10: ${tokens.spacing[10]};
    --space-12: ${tokens.spacing[12]};
    --space-16: ${tokens.spacing[16]};
    --space-20: ${tokens.spacing[20]};
    --space-24: ${tokens.spacing[24]};
    --space-32: ${tokens.spacing[32]};
    --space-40: ${tokens.spacing[40]};
    --space-48: ${tokens.spacing[48]};
    --space-56: ${tokens.spacing[56]};
    --space-64: ${tokens.spacing[64]};
    --space-72: ${tokens.spacing[72]};
    --space-80: ${tokens.spacing[80]};
    --space-96: ${tokens.spacing[96]};

    /* Radii */
    --radius-sm: ${tokens.radii.sm};
    --radius-md: ${tokens.radii.md};
    --radius-lg: ${tokens.radii.lg};
    --radius-xl: ${tokens.radii.xl};
    --radius-2xl: ${tokens.radii['2xl']};
    --radius-3xl: ${tokens.radii['3xl']};
    --radius-full: ${tokens.radii.full};

    /* Shadows */
    --shadow-xs: ${tokens.shadows.xs};
    --shadow-sm: ${tokens.shadows.sm};
    --shadow-md: ${tokens.shadows.md};
    --shadow-lg: ${tokens.shadows.lg};
    --shadow-xl: ${tokens.shadows.xl};
    --shadow-2xl: ${tokens.shadows['2xl']};
    --shadow-inner: ${tokens.shadows.inner};
    --shadow-focus: ${tokens.shadows.focus};
    --shadow-glow: ${tokens.shadows.glow};
    --shadow-glow-lg: ${tokens.shadows.glowLg};

    /* Transitions */
    --transition-fast: ${tokens.transitions.fast};
    --transition-normal: ${tokens.transitions.normal};
    --transition-slow: ${tokens.transitions.slow};
    --transition-spring: ${tokens.transitions.spring};
    --transition-bounce: ${tokens.transitions.bounce};

    /* Z-Indices */
    --z-dropdown: ${tokens.zIndices.dropdown};
    --z-sticky: ${tokens.zIndices.sticky};
    --z-modal: ${tokens.zIndices.modal};
    --z-popover: ${tokens.zIndices.popover};
    --z-tooltip: ${tokens.zIndices.tooltip};
    --z-toast: ${tokens.zIndices.toast};
    --z-grain: ${tokens.zIndices.grain};

    /* Motion */
    --duration-instant: ${tokens.motion.durations.instant};
    --duration-fast: ${tokens.motion.durations.fast};
    --duration-normal: ${tokens.motion.durations.normal};
    --duration-slow: ${tokens.motion.durations.slow};
    --duration-slower: ${tokens.motion.durations.slower};
  }

  .dark {
    --color-surface-0: ${tokens.colors.surface[950]};
    --color-surface-50: ${tokens.colors.surface[900]};
    --color-surface-100: ${tokens.colors.surface[800]};
    --color-surface-200: ${tokens.colors.surface[700]};
    --color-surface-300: ${tokens.colors.surface[600]};
    --color-surface-400: ${tokens.colors.surface[500]};
    --color-surface-500: ${tokens.colors.surface[400]};
    --color-surface-600: ${tokens.colors.surface[300]};
    --color-surface-700: ${tokens.colors.surface[200]};
    --color-surface-800: ${tokens.colors.surface[100]};
    --color-surface-900: ${tokens.colors.surface[50]};
    --color-surface-950: ${tokens.colors.surface[0]};
  }
`;