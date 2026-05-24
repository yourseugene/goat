// UI primitives — buttons, pills, avatars, chips, modals.

const { useState, useEffect, useRef, useMemo } = React;

// ── BUTTON ─────────────────────────────────────────────────────────────
function GButton({
  children, variant = 'primary', size = 'md', icon, onClick, disabled, style = {}, t,
  fullWidth = false,
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const heights = { sm: 38, md: 50, lg: 60 };
  const fontSize = { sm: 14, md: 16, lg: 17 };
  const radii   = { sm: 12, md: 16, lg: 20 };
  const padX    = { sm: 14, md: 22, lg: 28 };
  const h = heights[size], fz = fontSize[size], r = radii[size], px = padX[size];

  let bg, fg, border, shadow;
  if (variant === 'primary') {
    bg = t.goldGrad;
    fg = '#1A1208';
    border = 'none';
    shadow = `0 8px 24px rgba(217,168,71,0.32), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.18)`;
  } else if (variant === 'secondary') {
    bg = t.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(26,22,17,0.05)';
    fg = t.text;
    border = `0.5px solid ${t.line}`;
    shadow = 'none';
  } else if (variant === 'ghost') {
    bg = 'transparent';
    fg = t.text;
    border = `0.5px solid ${t.line}`;
    shadow = 'none';
  } else if (variant === 'glass') {
    bg = t.name === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.55)';
    fg = t.text;
    border = `0.5px solid ${t.name === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.7)'}`;
    shadow = '0 4px 18px rgba(0,0,0,0.18)';
  } else if (variant === 'danger') {
    bg = `linear-gradient(180deg, #F87470 0%, ${t.danger} 100%)`;
    fg = '#fff';
    border = 'none';
    shadow = '0 6px 18px rgba(240,82,79,0.30)';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        height: h, padding: `0 ${px}px`, borderRadius: r,
        background: bg, color: fg, border,
        fontFamily: window.GOAT_FONTS.ui,
        fontWeight: 600, fontSize: fz, letterSpacing: 0.1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: shadow,
        transform: press ? 'translateY(1px) scale(0.985)' : (hover ? 'translateY(-1px)' : 'none'),
        transition: 'transform .14s, box-shadow .2s, filter .2s',
        filter: disabled ? 'grayscale(0.4) opacity(0.5)' : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : undefined,
        position: 'relative', overflow: 'hidden',
        ...style,
      }}>
      {variant === 'primary' && hover && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.18), transparent 40%)',
          pointerEvents: 'none',
        }} />
      )}
      {icon}
      <span>{children}</span>
    </button>
  );
}

// ── CHIP / PILL ────────────────────────────────────────────────────────
function Chip({ children, color, t, active, icon, onClick, style = {} }) {
  const bg = active
    ? t.goldGrad
    : (t.name === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(26,22,17,0.04)');
  const fg = active ? '#1A1208' : t.text;
  return (
    <button onClick={onClick} style={{
      height: 32, padding: '0 12px', borderRadius: 9999,
      background: bg, color: fg,
      border: `0.5px solid ${active ? 'transparent' : t.line}`,
      fontFamily: window.GOAT_FONTS.ui, fontWeight: 500, fontSize: 13,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      cursor: 'pointer',
      ...style,
    }}>
      {icon}{children}
    </button>
  );
}

// ── AVATAR ─────────────────────────────────────────────────────────────
const AVA_PALETTE = [
  ['#3F5BFF','#7AA0FF'], ['#FF7A45','#FFB347'], ['#1F8A5B','#4FCB7A'],
  ['#A53F8B','#FF8BD3'], ['#C73330','#FF7A78'], ['#2E5BFF','#5BB8FF'],
  ['#8A6A26','#F4D58A'], ['#0B6CB6','#5BC0FF'],
];
function avaSeed(name) {
  let s = 0; for (let i = 0; i < name.length; i++) s = (s * 31 + name.charCodeAt(i)) >>> 0;
  return s;
}
function Avatar({ name = '?', size = 44, ring, online, status, t, style = {} }) {
  const seed = avaSeed(name);
  const [c1, c2] = AVA_PALETTE[seed % AVA_PALETTE.length];
  const initials = name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      borderRadius: size, ...style,
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: size,
        background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontFamily: window.GOAT_FONTS.ui, fontWeight: 600,
        fontSize: size * 0.36,
        boxShadow: ring
          ? `0 0 0 2px ${t.bg}, 0 0 0 3.5px ${ring}, ${t.goldGlow}`
          : `0 0 0 2px ${t.bg}, 0 0 0 3px ${t.line}`,
        letterSpacing: 0.5,
      }}>{initials}</div>
      {online !== undefined && (
        <div style={{
          position: 'absolute', bottom: -2, right: -2,
          width: size * 0.28, height: size * 0.28, borderRadius: 999,
          background: online ? t.success : t.textDim,
          boxShadow: `0 0 0 2px ${t.bg}`,
        }} />
      )}
      {status && (
        <div style={{
          position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
          height: 18, padding: '0 6px', borderRadius: 999,
          background: t.goldGrad, color: '#1A1208',
          fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
          display: 'flex', alignItems: 'center',
          whiteSpace: 'nowrap',
        }}>{status}</div>
      )}
    </div>
  );
}

// ── CARD CONTAINER ─────────────────────────────────────────────────────
function Panel({ children, t, style = {}, glow = false, padding = 18, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: t.bgElev1,
      border: `0.5px solid ${t.line}`,
      borderRadius: window.GOAT_RADII.lg,
      padding,
      boxShadow: glow ? `0 8px 28px rgba(0,0,0,0.35), ${t.goldGlow}` : '0 4px 16px rgba(0,0,0,0.25)',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

// ── TOGGLE ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, t }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      width: 50, height: 30, padding: 2, borderRadius: 999,
      background: checked ? t.goldGrad : (t.name === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(26,22,17,0.12)'),
      border: 'none', cursor: 'pointer',
      transition: 'background .2s', position: 'relative',
      boxShadow: checked ? '0 4px 12px rgba(217,168,71,0.35)' : 'inset 0 0 0 0.5px rgba(0,0,0,0.1)',
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: 999,
        background: checked ? '#1A1208' : '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        transform: `translateX(${checked ? 20 : 0}px)`,
        transition: 'transform .2s cubic-bezier(.2,.8,.2,1)',
      }} />
    </button>
  );
}

// ── DIVIDER WITH ORNAMENT (premium touch) ──────────────────────────────
function Ornament({ t, width = 120, style = {}, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      color: t.gold2, opacity: 0.7,
      ...style,
    }}>
      <svg width={width/2} height="10" viewBox="0 0 60 10">
        <line x1="0" y1="5" x2="44" y2="5" stroke="currentColor" strokeWidth="0.5"/>
        <circle cx="48" cy="5" r="1.5" fill="currentColor"/>
        <circle cx="55" cy="5" r="1" fill="currentColor" opacity="0.6"/>
      </svg>
      {label && (
        <div style={{
          fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic',
          fontSize: 14, letterSpacing: 2, textTransform: 'uppercase',
          color: t.gold1,
        }}>{label}</div>
      )}
      <svg width={width/2} height="10" viewBox="0 0 60 10">
        <line x1="16" y1="5" x2="60" y2="5" stroke="currentColor" strokeWidth="0.5"/>
        <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
        <circle cx="5" cy="5" r="1" fill="currentColor" opacity="0.6"/>
      </svg>
    </div>
  );
}

// ── PHONE STATUS BAR (styled to match theme) ───────────────────────────
function PhoneStatusBar({ t, time = '9:41', overlay = false }) {
  const c = overlay ? '#fff' : (t.name === 'dark' ? '#fff' : '#1A1611');
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '17px 30px 0', zIndex: 30, pointerEvents: 'none',
      fontFamily: window.GOAT_FONTS.ui,
    }}>
      <span style={{ fontWeight: 600, fontSize: 16, color: c, letterSpacing: -0.2 }}>{time}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', opacity: 0.95 }}>
        <svg width="18" height="11" viewBox="0 0 18 11"><g fill={c}>
          <rect x="0" y="7" width="3" height="4" rx="0.6"/>
          <rect x="5" y="5" width="3" height="6" rx="0.6"/>
          <rect x="10" y="3" width="3" height="8" rx="0.6"/>
          <rect x="15" y="0" width="3" height="11" rx="0.6"/>
        </g></svg>
        <svg width="26" height="12" viewBox="0 0 26 12">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke={c} strokeOpacity="0.5" fill="none"/>
          <rect x="2" y="2" width="19" height="8" rx="1.5" fill={c}/>
        </svg>
      </div>
    </div>
  );
}

// ── ICONS (inline SVG) ─────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = 'currentColor', stroke = 1.6 }) => {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
              stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'play':  return <svg {...p}><polygon points="6 4, 20 12, 6 20" fill={color} stroke="none"/></svg>;
    case 'users': return <svg {...p}><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.4-3.6 3.2-6 6.5-6s6.1 2.4 6.5 6"/><circle cx="17" cy="7" r="2.5"/><path d="M21.5 19c-.4-2.6-2.2-4-4.5-4"/></svg>;
    case 'crown': return <svg {...p}><path d="M3 8l4 4 5-7 5 7 4-4-1 11H4z"/><circle cx="3" cy="8" r="1.2" fill={color}/><circle cx="21" cy="8" r="1.2" fill={color}/><circle cx="12" cy="5" r="1.2" fill={color}/></svg>;
    case 'chart': return <svg {...p}><line x1="4" y1="20" x2="20" y2="20"/><rect x="6" y="11" width="3" height="9" fill={color}/><rect x="11" y="6" width="3" height="14" fill={color}/><rect x="16" y="14" width="3" height="6" fill={color}/></svg>;
    case 'settings': return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 14.5l1.5.9-1.5 2.6-1.7-.4a7 7 0 01-2 1.2l-.3 1.7h-3l-.3-1.7a7 7 0 01-2-1.2l-1.7.4-1.5-2.6 1.5-.9a7 7 0 010-2.5l-1.5-.9 1.5-2.6 1.7.4a7 7 0 012-1.2l.3-1.7h3l.3 1.7a7 7 0 012 1.2l1.7-.4 1.5 2.6-1.5.9a7 7 0 010 2.5z"/></svg>;
    case 'arrow-left': return <svg {...p}><path d="M14 5l-7 7 7 7"/><line x1="7" y1="12" x2="20" y2="12"/></svg>;
    case 'arrow-right': return <svg {...p}><path d="M10 5l7 7-7 7"/><line x1="4" y1="12" x2="17" y2="12"/></svg>;
    case 'plus': return <svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case 'check': return <svg {...p}><polyline points="5 12, 10 17, 19 7"/></svg>;
    case 'x': return <svg {...p}><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>;
    case 'copy': return <svg {...p}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>;
    case 'lock': return <svg {...p}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>;
    case 'globe': return <svg {...p}><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>;
    case 'volume': return <svg {...p}><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 8a5 5 0 010 8M19 5a9 9 0 010 14"/></svg>;
    case 'bell': return <svg {...p}><path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 21a2 2 0 004 0"/></svg>;
    case 'search': return <svg {...p}><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>;
    case 'chat': return <svg {...p}><path d="M21 12a8 8 0 01-12 7l-5 1 1-5a8 8 0 1116-3z"/></svg>;
    case 'trophy': return <svg {...p}><path d="M8 21h8M12 17v4M5 4h14v3a5 5 0 01-5 5h-4a5 5 0 01-5-5V4z"/><path d="M5 6H3a3 3 0 003 3M19 6h2a3 3 0 01-3 3"/></svg>;
    case 'card': return <svg {...p}><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="12" r="3" fill={color} stroke="none"/></svg>;
    case 'flame': return <svg {...p}><path d="M12 3c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 1-5s-1-3 0-5c2 2 4 2 4 0z"/></svg>;
    case 'logout': return <svg {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>;
    case 'home': return <svg {...p}><path d="M3 12l9-8 9 8M5 10v10h14V10"/></svg>;
    case 'heart': return <svg {...p}><path d="M12 21s-7-4.5-9-9a5 5 0 019-3 5 5 0 019 3c-2 4.5-9 9-9 9z"/></svg>;
    case 'send': return <svg {...p}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" fill={color}/></svg>;
    case 'qr':   return <svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3z M20 14h1v1M14 20h1v1M17 17h4v4"/></svg>;
    case 'shield': return <svg {...p}><path d="M12 3l8 3v5c0 4-3.5 8-8 10-4.5-2-8-6-8-10V6l8-3z"/></svg>;
    case 'sparkle': return <svg {...p}><path d="M12 3l1.6 4.8L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.2L12 3z" fill={color}/></svg>;
    case 'dots': return <svg {...p}><circle cx="6" cy="12" r="1.5" fill={color}/><circle cx="12" cy="12" r="1.5" fill={color}/><circle cx="18" cy="12" r="1.5" fill={color}/></svg>;
    case 'reaction': return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><circle cx="9" cy="10" r="0.5" fill={color}/><circle cx="15" cy="10" r="0.5" fill={color}/></svg>;
    case 'timer': return <svg {...p}><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>;
    default: return <svg {...p}/>;
  }
};

Object.assign(window, { GButton, Chip, Avatar, Panel, Toggle, Ornament, PhoneStatusBar, Icon });
