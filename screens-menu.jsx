// Menu, Lobby, Room, Settings screens

const { useState: useStateM, useEffect: useEffectM, useMemo: useMemoM } = React;

// ─────────────────────────────────────────────────────────────
// SCREEN: MAIN MENU
// ─────────────────────────────────────────────────────────────
function MainMenuScreen({ t, nav, tweaks, setTweak, profile, notif }) {
  const variant = tweaks.menuVariant || 'hero';

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: t.bg,
      fontFamily: window.GOAT_FONTS.ui, color: t.text,
    }}>
      {/* Atmospheric backdrop */}
      <MenuBackdrop t={t} />

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 56, left: 0, right: 0, padding: '0 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 5,
      }}>
        <div onClick={() => nav('profile')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <Avatar name={profile.name} size={42} ring={t.gold2} t={t} status="VII" />
          <div style={{ marginLeft: 4 }}>
            <div style={{ fontSize: 12, color: t.textMid, letterSpacing: 0.3 }}>Welcome back</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{profile.name}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <IconPill t={t} onClick={() => nav('settings')}>
            <Icon name="settings" size={18} color={t.text}/>
          </IconPill>
        </div>
      </div>

      {/* Hero wordmark */}
      <div style={{
        position: 'absolute', top: 140, left: 0, right: 0, textAlign: 'center', zIndex: 4,
      }}>
        <div style={{ color: t.textMid, fontSize: 11, letterSpacing: 6, fontWeight: 500, textTransform: 'uppercase', marginBottom: 6 }}>
          The Card Game · Est. Forever
        </div>
        <h1 style={{
          fontFamily: window.GOAT_FONTS.display,
          fontWeight: 700, fontStyle: 'italic',
          fontSize: 108, lineHeight: 0.95, margin: 0,
          letterSpacing: -2,
          background: t.goldGrad,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: `drop-shadow(0 4px 14px rgba(217,168,71,0.4))`,
        }}>Goat</h1>
        <Ornament t={t} width={140} style={{ marginTop: 4 }} label="36 cards · 4 players" />
      </div>

      {/* Hero card art */}
      <div style={{
        position: 'absolute', top: 320, left: '50%', transform: 'translateX(-50%)',
        zIndex: 3, pointerEvents: 'none',
      }}>
        <HeroCardArt t={t} />
      </div>

      {/* Bottom CTA stack */}
      <div style={{
        position: 'absolute', bottom: 30, left: 0, right: 0,
        padding: '0 20px', zIndex: 5,
      }}>
        {variant === 'hero' && <CTAStackHero t={t} nav={nav}/>}
        {variant === 'grid' && <CTAStackGrid t={t} nav={nav}/>}
        {variant === 'cinema' && <CTAStackCinema t={t} nav={nav} profile={profile}/>}
      </div>
    </div>
  );
}

function MenuBackdrop({ t }) {
  return (
    <>
      {/* layered radial glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: t.name === 'dark'
          ? `radial-gradient(80% 50% at 50% 30%, rgba(217,168,71,0.18) 0%, rgba(217,168,71,0) 60%), radial-gradient(120% 80% at 50% 100%, rgba(30,80,55,0.35) 0%, rgba(0,0,0,0) 70%)`
          : `radial-gradient(80% 50% at 50% 30%, rgba(184,130,31,0.14) 0%, rgba(0,0,0,0) 60%), radial-gradient(120% 80% at 50% 100%, rgba(30,90,60,0.18) 0%, rgba(0,0,0,0) 70%)`,
      }} />
      {/* corner ornament SVG */}
      <svg viewBox="0 0 400 400" style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, opacity: 0.18, pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="rg" cx="0.5" cy="0.5">
            <stop offset="0" stopColor={t.gold1}/>
            <stop offset="1" stopColor={t.gold3} stopOpacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="180" stroke={t.gold2} strokeWidth="0.5" fill="url(#rg)"/>
        <circle cx="200" cy="200" r="120" stroke={t.gold2} strokeWidth="0.3" fill="none"/>
      </svg>
      {/* subtle grid / mesh */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }}>
        <defs>
          <pattern id="dia" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0 L40 20 L20 40 L0 20 Z" stroke={t.gold1} strokeWidth="0.3" fill="none"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dia)"/>
      </svg>
    </>
  );
}

function HeroCardArt({ t }) {
  // Three cards fanned: 7♠ (perm trump), J♣, A♥
  const cards = [
    { suit: 'spades', rank: '7', rot: -16, x: -64, y: 18, trump: true, delay: 0 },
    { suit: 'clubs', rank: 'J', rot: 0, x: 0, y: 0, trump: false, delay: 0.2 },
    { suit: 'hearts', rank: 'A', rot: 16, x: 64, y: 18, trump: false, delay: 0.4 },
  ];
  return (
    <div style={{ position: 'relative', width: 220, height: 180 }}>
      {cards.map((c, i) => (
        // Outer = layout position (no animation). Inner = bobbing translateY only.
        <div key={i} style={{
          position: 'absolute', left: '50%', top: 0,
          transform: `translateX(-50%) translate(${c.x}px, ${c.y}px) rotate(${c.rot}deg)`,
          zIndex: i === 1 ? 2 : 1,
        }}>
          <div style={{
            animation: `goatBob ${3.6 + i*0.5}s ease-in-out ${c.delay}s infinite alternate`,
          }}>
            <PlayingCard suit={c.suit} rank={c.rank} w={86} trump={c.trump} theme={t} />
          </div>
        </div>
      ))}
    </div>
  );
}

function CTAStackHero({ t, nav }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <GButton t={t} variant="primary" size="lg" fullWidth onClick={() => nav('lobby')}
        icon={<Icon name="play" size={18} color="#1A1208"/>}>
        Quick Play
      </GButton>
      <div style={{ display: 'flex', gap: 10 }}>
        <GButton t={t} variant="secondary" size="md" fullWidth onClick={() => nav('room')}
          icon={<Icon name="users" size={16}/>}>
          Online Room
        </GButton>
        <GButton t={t} variant="secondary" size="md" fullWidth onClick={() => nav('table')}
          icon={<Icon name="card" size={16}/>}>
          Solo vs AI
        </GButton>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 4, justifyContent: 'space-between' }}>
        <MiniStat icon="trophy" label="Rank" value="Bronze VII" t={t} onClick={() => nav('stats')}/>
        <MiniStat icon="flame" label="Streak" value="3" t={t} onClick={() => nav('stats')}/>
        <MiniStat icon="chart" label="Win rate" value="64%" t={t} onClick={() => nav('stats')}/>
      </div>
    </div>
  );
}

function CTAStackGrid({ t, nav }) {
  const items = [
    { icon: 'play', label: 'Quick Play', sub: 'Find a match · ~12s', primary: true, to: 'lobby' },
    { icon: 'shield', label: 'Solo', sub: 'Practice vs AI', to: 'table' },
    { icon: 'trophy', label: 'Stats', sub: 'Your record', to: 'stats' },
    { icon: 'settings', label: 'Settings', sub: 'Theme & rules', to: 'settings' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {items.map((it, i) => (
        <Panel key={i} t={t} padding={16} style={{
          background: it.primary ? t.goldGrad : t.bgElev1,
          color: it.primary ? '#1A1208' : t.text,
          gridColumn: it.primary ? 'span 2' : 'auto',
          display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer',
        }} onClick={() => nav(it.to)}>
          <Icon name={it.icon} size={22} color={it.primary ? '#1A1208' : t.gold2}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{it.label}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{it.sub}</div>
          </div>
          {!it.primary && <Icon name="arrow-right" size={14} color={t.textMid}/>}
        </Panel>
      ))}
    </div>
  );
}

function CTAStackCinema({ t, nav, profile }) {
  return (
    <div>
      {/* daily challenge ribbon */}
      <Panel t={t} padding={14} style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12, background: t.goldGrad,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(217,168,71,0.3)',
        }}>
          <Icon name="sparkle" size={20} color="#1A1208"/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Daily Challenge</div>
          <div style={{ fontSize: 11, color: t.textMid }}>Win 3 with no trumps in hand · +50 XP</div>
        </div>
        <div style={{ fontSize: 12, color: t.gold1, fontWeight: 600 }}>2/3</div>
      </Panel>
      <GButton t={t} variant="primary" size="lg" fullWidth onClick={() => nav('lobby')}
        icon={<Icon name="play" size={18} color="#1A1208"/>}>
        Enter the Table
      </GButton>
    </div>
  );
}

function MiniStat({ icon, label, value, t, onClick }) {
  return (
    <div onClick={onClick} style={{
      flex: 1, padding: '10px 8px', borderRadius: 14,
      background: t.bgElev1, border: `0.5px solid ${t.line}`,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
      cursor: 'pointer',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Icon name={icon} size={12} color={t.gold2}/>
        <span style={{ fontSize: 10, color: t.textMid, letterSpacing: 0.3, textTransform: 'uppercase', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{value}</div>
    </div>
  );
}

function IconPill({ children, onClick, t, badge }) {
  return (
    <button onClick={onClick} style={{
      position: 'relative',
      width: 42, height: 42, borderRadius: 14,
      background: t.bgElev1, border: `0.5px solid ${t.line}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
    }}>
      {children}
      {badge > 0 && (
        <div style={{
          position: 'absolute', top: -2, right: -2,
          minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999,
          background: t.danger, color: '#fff',
          fontSize: 10, fontWeight: 700, lineHeight: '16px',
          textAlign: 'center', boxShadow: `0 0 0 2px ${t.bg}`,
        }}>{badge}</div>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN: MATCH LOBBY (matchmaking / mode select)
// ─────────────────────────────────────────────────────────────
function LobbyScreen({ t, nav, tweaks }) {
  const [mode, setMode] = useStateM('classic');
  const [searching, setSearching] = useStateM(false);
  const [players, setPlayers] = useStateM(1);

  useEffectM(() => {
    if (!searching) return;
    const i = setInterval(() => setPlayers(p => Math.min(4, p + 1)), 950);
    return () => clearInterval(i);
  }, [searching]);

  useEffectM(() => {
    if (players === 4) {
      const id = setTimeout(() => nav('deal'), 1100);
      return () => clearTimeout(id);
    }
  }, [players]);

  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, color: t.text, position: 'relative', overflow: 'hidden' }}>
      <MenuBackdrop t={t}/>
      <ScreenTopBar t={t} back={() => nav('menu')} title="Match Lobby"/>

      <div style={{ position: 'absolute', top: 124, left: 0, right: 0, bottom: 0, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {!searching && (
          <>
            {/* Mode selector */}
            <div>
              <SectionLabel t={t}>Game Mode</SectionLabel>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {[
                  { id: 'classic', name: 'Classic', sub: 'To 12 points' },
                  { id: 'quick', name: 'Quick', sub: 'To 6 points' },
                  { id: 'ranked', name: 'Ranked', sub: 'Climb the ladder' },
                ].map(m => (
                  <ModeCard key={m.id} active={mode === m.id} t={t}
                    onClick={() => setMode(m.id)} {...m}/>
                ))}
              </div>
            </div>

            {/* Options */}
            <div>
              <SectionLabel t={t}>Rules</SectionLabel>
              <Panel t={t} padding={0} style={{ marginTop: 8 }}>
                <Row t={t} label="Allow barrel ride" right={<Toggle checked={true} onChange={() => {}} t={t}/>} />
                <Row t={t} label="Show round score" right={<Toggle checked={false} onChange={() => {}} t={t}/>} />
                <Row t={t} label="Turn timer" right={<span style={{ fontSize: 14, color: t.textMid }}>30s</span>} last/>
              </Panel>
            </div>

            {/* Estimated wait */}
            <div style={{
              marginTop: 'auto', marginBottom: 30,
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 14, borderRadius: 18,
              background: t.bgElev1, border: `0.5px solid ${t.line}`,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: t.textMid }}>Estimated wait</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: t.text }}>~12 seconds</div>
              </div>
              <div style={{ fontSize: 12, color: t.gold1 }}>1,284 online</div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
              <GButton t={t} variant="secondary" size="lg" fullWidth onClick={() => nav('room')}>
                Private Room
              </GButton>
              <GButton t={t} variant="primary" size="lg" fullWidth onClick={() => setSearching(true)}>
                Find Match
              </GButton>
            </div>
          </>
        )}

        {searching && <Matchmaking t={t} players={players} mode={mode}/>}
      </div>
    </div>
  );
}

function ModeCard({ active, name, sub, t, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '14px 10px', borderRadius: 16,
      background: active ? t.goldGrad : t.bgElev1,
      color: active ? '#1A1208' : t.text,
      border: `0.5px solid ${active ? 'transparent' : t.line}`,
      cursor: 'pointer', textAlign: 'left',
      boxShadow: active ? '0 6px 16px rgba(217,168,71,0.3)' : 'none',
    }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>{name}</div>
      <div style={{ fontSize: 11, opacity: active ? 0.75 : 0.6, marginTop: 2 }}>{sub}</div>
    </button>
  );
}

function Matchmaking({ t, players, mode }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
      {/* spinning ornament */}
      <div style={{ position: 'relative', width: 220, height: 220 }}>
        <svg viewBox="0 0 220 220" style={{ position: 'absolute', inset: 0, animation: 'goatSpin 8s linear infinite' }}>
          <circle cx="110" cy="110" r="100" stroke={t.gold2} strokeWidth="0.6" fill="none" strokeDasharray="4 4" opacity="0.5"/>
          <circle cx="110" cy="110" r="80" stroke={t.gold2} strokeWidth="0.4" fill="none" opacity="0.3"/>
          {Array.from({length: 4}).map((_, i) => {
            const a = (i/4) * Math.PI * 2 - Math.PI/2;
            const x = 110 + Math.cos(a) * 100, y = 110 + Math.sin(a) * 100;
            return <circle key={i} cx={x} cy={y} r="2.5" fill={t.gold1}/>;
          })}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative' }}>
            <PlayingCard suit="spades" rank="7" w={90} trump theme={t}/>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic',
          fontSize: 32, color: t.gold1, letterSpacing: 0.5,
        }}>Finding players</div>
        <div style={{ marginTop: 4, fontSize: 13, color: t.textMid }}>
          {players} of 4 seated · {mode}
        </div>
      </div>
      {/* seat dots */}
      <div style={{ display: 'flex', gap: 14 }}>
        {Array.from({length: 4}).map((_, i) => (
          <div key={i} style={{
            width: 36, height: 36, borderRadius: 12,
            background: i < players ? t.goldGrad : t.bgElev1,
            color: i < players ? '#1A1208' : t.textDim,
            border: `0.5px solid ${i < players ? 'transparent' : t.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 600,
            animation: i < players ? 'goatPulse 2s ease-in-out infinite' : 'none',
          }}>{i < players ? <Icon name="check" size={14} color="#1A1208"/> : '...'}</div>
        ))}
      </div>
      <GButton t={t} variant="ghost" size="md">Cancel</GButton>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN: ONLINE ROOM (private room with seats)
// ─────────────────────────────────────────────────────────────
function RoomScreen({ t, nav, players, setPlayers }) {
  const code = 'A7K2';
  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, color: t.text, position: 'relative', overflow: 'hidden' }}>
      <MenuBackdrop t={t}/>
      <ScreenTopBar t={t} back={() => nav('menu')} title="Private Room"/>

      <div style={{ position: 'absolute', top: 124, left: 0, right: 0, bottom: 0, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto' }}>

        {/* Room code card */}
        <Panel t={t} padding={20} style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: 11, color: t.textMid, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 500 }}>Room Code</div>
          <div style={{
            fontFamily: window.GOAT_FONTS.display, fontWeight: 600,
            fontSize: 64, lineHeight: 1, letterSpacing: 12, marginTop: 8,
            background: t.goldGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 8px rgba(217,168,71,0.35))',
          }}>{code}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14 }}>
            <GButton t={t} variant="secondary" size="sm" icon={<Icon name="copy" size={14}/>}>Copy</GButton>
            <GButton t={t} variant="secondary" size="sm" icon={<Icon name="qr" size={14}/>}>QR Code</GButton>
            <GButton t={t} variant="secondary" size="sm" icon={<Icon name="send" size={14}/>}>Share</GButton>
          </div>
        </Panel>

        {/* Seats table */}
        <div>
          <SectionLabel t={t}>Players · 4 seats</SectionLabel>
          <Panel t={t} padding={16} style={{ marginTop: 8 }}>
            <SeatRoster t={t} players={players}/>
          </Panel>
        </div>

        {/* Teams */}
        <div>
          <SectionLabel t={t}>Teams</SectionLabel>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <TeamCard t={t} color={t.team1} bg={t.team1Bg} name="North" players={[players[0].name, players[2].name]}/>
            <TeamCard t={t} color={t.team2} bg={t.team2Bg} name="East" players={[players[1].name, players[3].name]}/>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 'auto', marginBottom: 30 }}>
          <GButton t={t} variant="secondary" size="lg" fullWidth onClick={() => nav('menu')}>Leave</GButton>
          <GButton t={t} variant="primary" size="lg" fullWidth onClick={() => nav('deal')}
            icon={<Icon name="play" size={16} color="#1A1208"/>}>
            Start Game
          </GButton>
        </div>
      </div>
    </div>
  );
}

function SeatRoster({ t, players }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {players.map((p, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '8px 4px',
        }}>
          <div style={{
            width: 22, textAlign: 'center',
            fontSize: 11, color: t.textDim, fontWeight: 600, letterSpacing: 1,
          }}>{['N','E','S','W'][i]}</div>
          <Avatar name={p.name} size={36} t={t}
            ring={i === 0 ? t.gold2 : undefined}
            online={p.online}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.text, display: 'flex', gap: 6, alignItems: 'center' }}>
              {p.name}
              {i === 0 && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 6, background: t.goldGrad, color: '#1A1208', fontWeight: 700, letterSpacing: 0.5 }}>HOST</span>}
              {i === 2 && <span style={{ fontSize: 10, color: t.textMid }}>· You</span>}
            </div>
            <div style={{ fontSize: 11, color: t.textMid }}>
              {p.ai ? 'AI · Smart' : (p.online ? 'Ready' : 'Connecting…')}
            </div>
          </div>
          <div style={{
            width: 10, height: 10, borderRadius: 999,
            background: p.online ? t.success : t.textDim,
            boxShadow: p.online ? '0 0 8px rgba(79,203,122,0.5)' : 'none',
          }}/>
        </div>
      ))}
    </div>
  );
}

function TeamCard({ t, color, bg, name, players }) {
  return (
    <Panel t={t} padding={14} style={{ flex: 1, background: bg, borderColor: 'transparent' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: 999, background: color }}/>
        <div style={{ fontSize: 12, fontWeight: 600, color: t.text, letterSpacing: 0.4, textTransform: 'uppercase' }}>{name}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {players.map((p, i) => (
          <div key={i} style={{ fontSize: 13, color: t.text }}>{p}</div>
        ))}
      </div>
    </Panel>
  );
}

// ─────────────────────────────────────────────────────────────
// SHARED: SECTION LABEL, ROW, TOP BAR
// ─────────────────────────────────────────────────────────────
function SectionLabel({ children, t, style = {} }) {
  return (
    <div style={{
      fontSize: 11, color: t.textMid, fontWeight: 600,
      letterSpacing: 1.4, textTransform: 'uppercase',
      ...style,
    }}>{children}</div>
  );
}

function Row({ t, label, right, last, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', padding: '14px 16px',
      borderBottom: last ? 'none' : `0.5px solid ${t.lineSoft}`,
      cursor: onClick ? 'pointer' : 'default',
    }}>
      <div style={{ flex: 1, fontSize: 15, color: t.text }}>{label}</div>
      {right}
    </div>
  );
}

function ScreenTopBar({ t, back, title, right }) {
  return (
    <div style={{
      position: 'absolute', top: 56, left: 0, right: 0, zIndex: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px',
    }}>
      <IconPill t={t} onClick={back}><Icon name="arrow-left" size={18} color={t.text}/></IconPill>
      <div style={{
        fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic',
        fontSize: 22, color: t.gold1, letterSpacing: 0.3,
        whiteSpace: 'nowrap',
      }}>{title}</div>
      {right || <div style={{ width: 42 }}/>}
    </div>
  );
}

Object.assign(window, {
  MainMenuScreen, LobbyScreen, RoomScreen,
  SectionLabel, Row, ScreenTopBar, IconPill, MenuBackdrop,
  // helpers reused by desktop screens
  ModeCard, Matchmaking, SeatRoster, TeamCard, MiniStat,
});
