// Design tokens for Goat — light & dark themes
// Accent: gold gradient. Felt: deep green. Type: Cormorant Garamond + Inter.

window.GOAT_TOKENS = {
  dark: {
    name: 'dark',
    // Surfaces
    bg:        '#0B0907',       // page base (deep warm-black)
    bgElev1:   '#141009',       // cards / panels
    bgElev2:   '#1B1610',       // raised
    bgElev3:   '#27201A',       // hover / active
    line:      'rgba(244,213,138,0.10)',
    lineSoft:  'rgba(255,255,255,0.06)',
    // Text
    text:      '#F5EFE0',
    textMid:   'rgba(245,239,224,0.66)',
    textDim:   'rgba(245,239,224,0.40)',
    // Gold
    gold1:     '#F4D58A',       // highlight
    gold2:     '#D9A847',       // primary
    gold3:     '#A37416',       // deep
    goldGrad:  'linear-gradient(180deg, #F4D58A 0%, #D9A847 50%, #A37416 100%)',
    goldGlow:  '0 0 32px rgba(217,168,71,0.45), 0 0 8px rgba(244,213,138,0.35)',
    // Felt (game table)
    feltCore:  '#1F7A4C',
    feltDeep:  '#0A3A23',
    feltEdge:  '#062418',
    feltRadial:'radial-gradient(120% 80% at 50% 40%, #2A8F5A 0%, #156040 28%, #0A3A23 60%, #062418 100%)',
    feltLine:  'rgba(244,213,138,0.18)',
    // Teams (your team / opponents)
    team1:     '#5B8BFF',       // blue
    team1Bg:   'rgba(91,139,255,0.16)',
    team2:     '#FF8B5B',       // coral
    team2Bg:   'rgba(255,139,91,0.16)',
    // Semantic
    success:   '#4FCB7A',
    danger:    '#F0524F',
    info:      '#5B8BFF',
    // Cards
    cardFace:  '#FAF6EC',
    cardEdge:  '#8A6A26',
    cardRed:   '#B12A2A',
    cardBlack: '#1A1611',
    cardBackDeep: '#0E2240',
    cardBackGold: '#C99A3A',
    // Status bar / iOS
    statusDark: true,
  },
  light: {
    name: 'light',
    bg:        '#F6F1E8',
    bgElev1:   '#FBF8F1',
    bgElev2:   '#FFFFFF',
    bgElev3:   '#EEE7D6',
    line:      'rgba(26,22,17,0.10)',
    lineSoft:  'rgba(26,22,17,0.06)',
    text:      '#1A1611',
    textMid:   'rgba(26,22,17,0.65)',
    textDim:   'rgba(26,22,17,0.42)',
    gold1:     '#E0B355',
    gold2:     '#B8821F',
    gold3:     '#6F4A0E',
    goldGrad:  'linear-gradient(180deg, #E0B355 0%, #B8821F 60%, #8A610F 100%)',
    goldGlow:  '0 0 24px rgba(184,130,31,0.25), 0 0 6px rgba(224,179,85,0.4)',
    feltCore:  '#1F7A4C',
    feltDeep:  '#0F4E30',
    feltEdge:  '#093720',
    feltRadial:'radial-gradient(120% 80% at 50% 40%, #2A8F5A 0%, #156040 30%, #0E4A2D 65%, #08321F 100%)',
    feltLine:  'rgba(244,213,138,0.22)',
    team1:     '#2E5BFF',
    team1Bg:   'rgba(46,91,255,0.12)',
    team2:     '#D45A2A',
    team2Bg:   'rgba(212,90,42,0.12)',
    success:   '#1F8A5B',
    danger:    '#C73330',
    info:      '#2E5BFF',
    cardFace:  '#FBF8EE',
    cardEdge:  '#8A6A26',
    cardRed:   '#A82424',
    cardBlack: '#1A1611',
    cardBackDeep: '#0E2240',
    cardBackGold: '#C99A3A',
    statusDark: false,
  }
};

// Type
window.GOAT_FONTS = {
  display: '"Cormorant Garamond", "Cormorant", "Playfair Display", Georgia, serif',
  ui:      '"Inter", -apple-system, "SF Pro Text", system-ui, sans-serif',
  num:     '"Inter", "SF Pro Display", system-ui, sans-serif',
  card:    '"Cormorant Garamond", "Cormorant", Georgia, serif',
};

// Radii / spacing
window.GOAT_RADII = { sm: 8, md: 14, lg: 22, xl: 28, pill: 9999 };
