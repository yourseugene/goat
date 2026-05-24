// Playing cards — classic refined faces, ornate gold border, premium back
// Usage: <PlayingCard suit="hearts" rank="A" trump faceDown w={68} />

const SUIT_GLYPH = {
  hearts:   '♥',
  diamonds: '♦',
  clubs:    '♣',
  spades:   '♠',
};
const SUIT_NAMES = ['spades','hearts','diamonds','clubs'];
const RANKS = ['6','7','8','9','10','J','Q','K','A'];

window.GOAT_SUITS = SUIT_NAMES;
window.GOAT_RANKS = RANKS;
window.SUIT_GLYPH = SUIT_GLYPH;

// Single playing card — composed entirely in CSS / SVG (no images).
function PlayingCard({
  suit, rank, w = 68, faceDown = false, trump = false, selected = false,
  played = false, style = {}, dimmed = false, hint = false, theme,
}) {
  const t = theme || window.GOAT_TOKENS.dark;
  const h = w * 1.42; // standard card ratio
  const isRed = suit === 'hearts' || suit === 'diamonds';
  const symbol = SUIT_GLYPH[suit];
  const color = isRed ? t.cardRed : t.cardBlack;
  const faceFont = window.GOAT_FONTS.card;
  const radius = Math.max(6, w * 0.075);

  // shared shadow
  const baseShadow = `0 ${w*0.04}px ${w*0.12}px rgba(0,0,0,0.45), 0 ${w*0.02}px ${w*0.04}px rgba(0,0,0,0.3)`;
  const glow = trump
    ? `, 0 0 ${w*0.4}px ${w*0.06}px rgba(244,213,138,0.55), 0 0 ${w*0.1}px rgba(244,213,138,0.7)`
    : '';
  const selGlow = selected ? `, 0 0 0 2px ${t.gold2}, 0 0 ${w*0.3}px rgba(217,168,71,0.6)` : '';

  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      position: 'relative',
      transform: `translateZ(0) ${selected ? `translateY(${-w*0.12}px)` : ''} ${played ? 'scale(1.02)' : ''}`,
      transition: 'transform .25s cubic-bezier(.2,.8,.2,1), filter .25s',
      filter: dimmed ? 'brightness(0.55) saturate(0.7)' : 'none',
      opacity: hint ? 0.92 : 1,
      ...style,
    }}>
      {faceDown ? (
        <CardBack w={w} radius={radius} t={t} />
      ) : (
        <div style={{
          width: '100%', height: '100%', borderRadius: radius,
          background: `linear-gradient(180deg, ${t.cardFace} 0%, #F1ECDF 100%)`,
          boxShadow: baseShadow + glow + selGlow,
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* ornate gold inner border */}
          <div style={{
            position: 'absolute', inset: w*0.05, borderRadius: radius - 2,
            border: `0.75px solid ${t.cardEdge}`,
            opacity: 0.55,
          }} />
          <div style={{
            position: 'absolute', inset: w*0.075, borderRadius: radius - 3,
            border: `0.5px solid ${t.cardEdge}`,
            opacity: 0.3,
          }} />

          {/* hairline outer border */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: radius,
            boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.18)',
            pointerEvents: 'none',
          }} />

          {/* corner indices */}
          <CornerIndex rank={rank} suit={symbol} color={color} w={w} pos="tl" font={faceFont}/>
          <CornerIndex rank={rank} suit={symbol} color={color} w={w} pos="br" font={faceFont}/>

          {/* center artwork */}
          <CardCenter rank={rank} suitGlyph={symbol} color={color} w={w} h={h} font={faceFont} edge={t.cardEdge}/>

          {/* paper texture */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: radius,
            backgroundImage: 'radial-gradient(rgba(0,0,0,0.025) 1px, transparent 1px)',
            backgroundSize: '3px 3px', opacity: 0.6, mixBlendMode: 'multiply',
            pointerEvents: 'none',
          }} />
        </div>
      )}
    </div>
  );
}

function CornerIndex({ rank, suit, color, w, pos, font }) {
  const styleByPos = {
    tl: { top: w*0.08, left: w*0.10, transform: 'none' },
    br: { bottom: w*0.08, right: w*0.10, transform: 'rotate(180deg)' },
  };
  return (
    <div style={{
      position: 'absolute', ...styleByPos[pos],
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      lineHeight: 0.85, color,
    }}>
      <div style={{
        fontFamily: font, fontWeight: 600,
        fontSize: w * (rank === '10' ? 0.22 : 0.28),
        letterSpacing: -0.5,
      }}>{rank}</div>
      <div style={{ fontSize: w * 0.18, marginTop: w*0.04 }}>{suit}</div>
    </div>
  );
}

function CardCenter({ rank, suitGlyph, color, w, h, font, edge }) {
  // Unified design: one big central suit glyph for every card.
  // The corner index already shows the rank — the centre stays bold and clean.
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        fontSize: w * 0.62, color, lineHeight: 1,
        textShadow: `0 1px 0 rgba(255,255,255,0.6)`,
      }}>{suitGlyph}</div>
    </div>
  );
}

function FaceCard({ rank, suitGlyph, color, w, h, font, edge }) {
  // Kept for back-compat with anything that may have referenced it.
  // Current design uses one big central suit glyph for every rank.
  return null;
}

function CardBack({ w, radius, t, variant = 'classic' }) {
  const h = w * 1.42;
  if (variant === 'goat') {
    return (
      <div style={{
        width: '100%', height: '100%', borderRadius: radius,
        background: `radial-gradient(120% 80% at 50% 40%, #2a1d12 0%, #160e08 70%)`,
        boxShadow: `0 ${w*0.04}px ${w*0.12}px rgba(0,0,0,0.5)`,
        position: 'relative', overflow: 'hidden',
      }}>
        <BackOrnament w={w} h={h} gold={t.gold2} />
      </div>
    );
  }
  // Default: deep navy with gold filigree
  return (
    <div style={{
      width: '100%', height: '100%', borderRadius: radius,
      background: `radial-gradient(120% 80% at 50% 40%, #1a2f5e 0%, ${t.cardBackDeep} 65%, #060d20 100%)`,
      boxShadow: `0 ${w*0.04}px ${w*0.12}px rgba(0,0,0,0.5), inset 0 0 0 0.5px rgba(255,255,255,0.06)`,
      position: 'relative', overflow: 'hidden',
    }}>
      <BackOrnament w={w} h={h} gold={t.cardBackGold} />
    </div>
  );
}

function BackOrnament({ w, h, gold }) {
  return (
    <>
      {/* double gold rule */}
      <div style={{
        position: 'absolute', inset: w*0.075, borderRadius: w*0.05,
        border: `1px solid ${gold}`, opacity: 0.55,
      }} />
      <div style={{
        position: 'absolute', inset: w*0.10, borderRadius: w*0.045,
        border: `0.5px solid ${gold}`, opacity: 0.35,
      }} />
      {/* center crest — stylized G with horns */}
      <svg viewBox="0 0 100 142" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} fill="none">
        {/* corner fleurs */}
        {[[18,22,0],[82,22,90],[18,120,270],[82,120,180]].map(([x,y,r],i) => (
          <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
            <path d="M0 -6 Q 6 -6 6 0 Q 6 6 0 6 Q -6 6 -6 0 Q -6 -6 0 -6 Z" fill={gold} opacity="0.25"/>
            <circle cx="0" cy="0" r="1.2" fill={gold} opacity="0.7"/>
          </g>
        ))}
        {/* central diamond frame */}
        <g transform="translate(50 71)">
          <path d="M0 -30 L 22 0 L 0 30 L -22 0 Z" stroke={gold} strokeWidth="0.8" opacity="0.5"/>
          <path d="M0 -22 L 16 0 L 0 22 L -16 0 Z" stroke={gold} strokeWidth="0.5" opacity="0.35"/>
          {/* G monogram */}
          <text x="0" y="9" textAnchor="middle"
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 700, fontStyle: 'italic',
              fontSize: 30, fill: gold,
            }}>G</text>
          {/* tiny horn flourishes above */}
          <path d="M-8 -10 q 3 -6 0 -12 M 8 -10 q -3 -6 0 -12" stroke={gold} strokeWidth="0.6" opacity="0.45" fill="none"/>
        </g>
        {/* outer scrollwork */}
        <path d="M 8 8 Q 50 4 92 8" stroke={gold} strokeWidth="0.4" opacity="0.25" fill="none"/>
        <path d="M 8 134 Q 50 138 92 134" stroke={gold} strokeWidth="0.4" opacity="0.25" fill="none"/>
      </svg>
    </>
  );
}

// Horizontal fan of cards (player hand at bottom)
function CardFan({
  cards, w = 68, spread = 0.62, arc = 24, theme, selected = -1, onSelect,
  playable, // function(idx) -> boolean
}) {
  const t = theme || window.GOAT_TOKENS.dark;
  const n = cards.length;
  const step = w * spread;
  const totalW = step * (n - 1) + w;
  return (
    <div style={{
      position: 'relative', width: totalW, height: w * 1.42 + 30,
      display: 'flex', alignItems: 'flex-end',
    }}>
      {cards.map((c, i) => {
        const t01 = n === 1 ? 0.5 : i / (n - 1);
        const rot = (t01 - 0.5) * arc;
        const lift = Math.abs(t01 - 0.5) * w * 0.18;
        const isPlayable = playable ? playable(i) : true;
        return (
          <div key={i}
            onClick={() => onSelect && onSelect(i)}
            style={{
              position: 'absolute', left: i * step, bottom: lift,
              transform: `rotate(${rot}deg) ${selected === i ? `translateY(-${w*0.22}px)` : ''}`,
              transformOrigin: '50% 90%',
              transition: 'transform .22s cubic-bezier(.2,.8,.2,1)',
              cursor: 'pointer', zIndex: i,
            }}>
            <PlayingCard suit={c.suit} rank={c.rank} w={w}
              theme={t} selected={selected === i}
              dimmed={!isPlayable}
              trump={c.trump}
            />
          </div>
        );
      })}
    </div>
  );
}

// Vertical fan (opponent side hands, face down)
function CardFanVertical({ count, w = 36, theme, side = 'left' }) {
  const t = theme || window.GOAT_TOKENS.dark;
  const step = w * 0.32;
  const arc = 14;
  return (
    <div style={{
      position: 'relative', width: w * 1.42 + 20, height: step * (count - 1) + w * 1.42,
    }}>
      {Array.from({ length: count }).map((_, i) => {
        const t01 = count === 1 ? 0.5 : i / (count - 1);
        const rot = (t01 - 0.5) * arc + (side === 'left' ? 90 : -90);
        return (
          <div key={i} style={{
            position: 'absolute', top: i * step, left: 0,
            transform: `rotate(${rot}deg)`,
            transformOrigin: '50% 50%',
            zIndex: i,
          }}>
            <PlayingCard suit="spades" rank="A" w={w} faceDown theme={t} />
          </div>
        );
      })}
    </div>
  );
}

// Tiny pip / chip rendering for trump indicator
function SuitChip({ suit, size = 28, gold = false, t }) {
  const isRed = suit === 'hearts' || suit === 'diamonds';
  return (
    <div style={{
      width: size, height: size, borderRadius: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: gold ? t.goldGrad : (isRed ? 'rgba(177,42,42,0.18)' : 'rgba(0,0,0,0.25)'),
      color: gold ? '#1A1611' : (isRed ? '#FF8B8B' : '#fff'),
      fontSize: size * 0.55, lineHeight: 1,
      boxShadow: gold ? '0 4px 12px rgba(217,168,71,0.45)' : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
    }}>{SUIT_GLYPH[suit]}</div>
  );
}

Object.assign(window, { PlayingCard, CardBack, CardFan, CardFanVertical, SuitChip });
