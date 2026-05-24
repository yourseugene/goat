// Desktop layouts — sidebar shell + adaptive screen variants
// Renders full-bleed inside the viewport (no phone bezel).

const { useState: useStateD, useEffect: useEffectD, useMemo: useMemoD } = React;

// ─────────────────────────────────────────────────────────────
// DESKTOP SHELL — left sidebar + main content
// ─────────────────────────────────────────────────────────────
function DesktopShell({ t, screen, nav, tweaks, setTweak, children, hideSidebarChrome }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex',
      background: t.bg, color: t.text,
      fontFamily: window.GOAT_FONTS.ui,
      overflow: 'hidden',
    }}>
      <DesktopSidebar t={t} screen={screen} nav={nav} tweaks={tweaks} setTweak={setTweak}/>
      <div style={{ flex: 1, position: 'relative', minWidth: 0, overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

function DesktopSidebar({ t, screen, nav, tweaks, setTweak }) {
  const items = [
    { id: 'menu', l: 'Menu', icon: 'home' },
    { id: 'lobby', l: 'Match Lobby', icon: 'play' },
    { id: 'room', l: 'Private Room', icon: 'users' },
    { id: 'table', l: 'Gameplay', icon: 'card' },
    { id: 'results', l: 'End Match', icon: 'trophy' },
  ];
  const items2 = [
    { id: 'profile', l: 'Profile', icon: 'shield' },
    { id: 'stats', l: 'Statistics', icon: 'chart' },
    { id: 'settings', l: 'Settings', icon: 'settings' },
  ];
  return (
    <aside style={{
      width: 232, flexShrink: 0, height: '100%',
      background: t.bgElev1,
      borderRight: `0.5px solid ${t.line}`,
      display: 'flex', flexDirection: 'column',
      padding: '22px 12px 14px',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 10px 14px' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 11,
          background: t.goldGrad,
          fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic', fontWeight: 700,
          color: '#1A1208', fontSize: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(217,168,71,0.35)',
        }}>G</div>
        <div>
          <div style={{
            fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic', fontWeight: 700,
            fontSize: 22, lineHeight: 1, color: t.text, letterSpacing: 0.2,
          }}>Goat</div>
          <div style={{ fontSize: 10, color: t.textMid, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>Card Game</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
        {items.map(it => <NavItem key={it.id} t={t} item={it} active={screen === it.id} onClick={() => nav(it.id)}/>)}
      </div>
      <div style={{
        fontSize: 10, color: t.textDim, letterSpacing: 1.5, textTransform: 'uppercase',
        fontWeight: 600, padding: '14px 12px 4px',
      }}>Account</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items2.map(it => <NavItem key={it.id} t={t} item={it} active={screen === it.id} onClick={() => nav(it.id)}/>)}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Theme toggle */}
        <div style={{
          display: 'flex', padding: 3, gap: 2,
          background: t.bgElev3, borderRadius: 999,
        }}>
          {[{v:'dark',l:'Dark'},{v:'light',l:'Light'}].map(o => (
            <button key={o.v} onClick={() => setTweak('theme', o.v)} style={{
              flex: 1, padding: '6px 10px', borderRadius: 999,
              background: tweaks.theme === o.v ? t.goldGrad : 'transparent',
              color: tweaks.theme === o.v ? '#1A1208' : t.textMid,
              border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600,
            }}>{o.l}</button>
          ))}
        </div>
        {/* Device toggle */}
        <div style={{
          display: 'flex', padding: 3, gap: 2,
          background: t.bgElev3, borderRadius: 999,
        }}>
          {[{v:'auto',l:'Auto'},{v:'phone',l:'Phone'},{v:'desktop',l:'Desktop'}].map(o => (
            <button key={o.v} onClick={() => setTweak('device', o.v)} style={{
              flex: 1, padding: '6px 6px', borderRadius: 999,
              background: (tweaks.device || 'auto') === o.v ? t.goldGrad : 'transparent',
              color: (tweaks.device || 'auto') === o.v ? '#1A1208' : t.textMid,
              border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 600,
            }}>{o.l}</button>
          ))}
        </div>
        {/* User chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
          background: t.bgElev2, border: `0.5px solid ${t.line}`, borderRadius: 14,
        }}>
          <Avatar name="Alex Wong" size={32} t={t} ring={t.gold2}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: t.text, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Alex Wong</div>
            <div style={{ fontSize: 11, color: t.gold1 }}>Bronze · VII</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ t, item, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px', borderRadius: 12,
      background: active ? 'rgba(217,168,71,0.12)' : 'transparent',
      color: active ? t.gold1 : t.textMid,
      border: 'none', cursor: 'pointer', textAlign: 'left',
      fontSize: 13, fontWeight: 500, letterSpacing: 0.1,
      fontFamily: window.GOAT_FONTS.ui,
      position: 'relative',
    }}>
      {active && <div style={{ position: 'absolute', left: -12, top: '50%', transform: 'translateY(-50%)',
        width: 3, height: 18, background: t.goldGrad, borderRadius: 999 }}/>}
      <Icon name={item.icon} size={16} color="currentColor"/>
      <span>{item.l}</span>
    </button>
  );
}

function DesktopTopBar({ t, title, subtitle, right }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 30px 16px',
      background: `linear-gradient(180deg, ${t.bg} 80%, transparent)`,
    }}>
      <div>
        <div style={{ fontSize: 11, color: t.textMid, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: 600 }}>{subtitle}</div>
        <div style={{
          fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic', fontWeight: 600,
          fontSize: 34, color: t.text, marginTop: 2, letterSpacing: -0.5, lineHeight: 1,
        }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP: MAIN MENU
// ─────────────────────────────────────────────────────────────
function DesktopMenu({ t, nav, profile, tweaks }) {
  return (
    <div style={{ position: 'relative', minHeight: '100%', padding: '40px 60px' }}>
      <MenuBackdrop t={t}/>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ fontSize: 11, color: t.textMid, letterSpacing: 4, fontWeight: 600, textTransform: 'uppercase' }}>Welcome back · Alex</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Chip t={t} icon={<Icon name="globe" size={12} color={t.gold2}/>}>1,284 online</Chip>
        </div>
      </div>

      <div style={{
        position: 'relative', maxWidth: 1280, margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
        gap: 60, alignItems: 'center', marginTop: 30,
        minHeight: 'calc(100vh - 150px)',
      }}>
        {/* Left: hero text */}
        <div>
          <div style={{ color: t.textMid, fontSize: 12, letterSpacing: 6, fontWeight: 500, textTransform: 'uppercase', marginBottom: 16 }}>
            The Card Game · Est. Forever
          </div>
          <h1 style={{
            fontFamily: window.GOAT_FONTS.display,
            fontWeight: 700, fontStyle: 'italic',
            fontSize: 'clamp(120px, 14vw, 168px)',
            lineHeight: 0.92, margin: 0,
            letterSpacing: -3,
            background: t.goldGrad,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 8px 28px rgba(217,168,71,0.45))',
          }}>Goat</h1>
          <Ornament t={t} width={220} style={{ marginTop: 14, justifyContent: 'flex-start' }} label="36 cards · 4 players"/>

          <div style={{ marginTop: 36, fontSize: 16, color: t.textMid, maxWidth: 460, lineHeight: 1.55 }}>
            A four-player partner trump game. Race to twelve points,
            outsmart the table, and slip the goat to your opponents.
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 30 }}>
            <GButton t={t} variant="primary" size="lg" onClick={() => nav('lobby')}
              icon={<Icon name="play" size={18} color="#1A1208"/>}>
              Quick Play
            </GButton>
            <GButton t={t} variant="secondary" size="lg" onClick={() => nav('room')}
              icon={<Icon name="users" size={16}/>}>
              Private Room
            </GButton>
            <GButton t={t} variant="ghost" size="lg" onClick={() => nav('table')}
              icon={<Icon name="card" size={16}/>}>
              Solo vs AI
            </GButton>
          </div>

          {/* Mini stat row */}
          <div style={{ display: 'flex', gap: 12, marginTop: 36, maxWidth: 540 }}>
            <DTStat t={t} icon="trophy" label="Rank" value="Bronze VII"/>
            <DTStat t={t} icon="flame" label="Streak" value="3 wins"/>
            <DTStat t={t} icon="chart" label="Win rate" value="64%"/>
            <DTStat t={t} icon="trophy" label="MVPs" value="34"/>
          </div>
        </div>

        {/* Right: fanned cards composition */}
        <div style={{ position: 'relative', height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DesktopHeroCards t={t}/>

          {/* Daily challenge ribbon under cards */}
          <div style={{
            position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
            width: 380,
          }}>
            <Panel t={t} padding={14} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(20,16,9,0.78)', backdropFilter: 'blur(12px)' }}>
              <div style={{
                width: 38, height: 38, borderRadius: 11, background: t.goldGrad,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="sparkle" size={20} color="#1A1208"/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Daily Challenge</div>
                <div style={{ fontSize: 11, color: t.textMid }}>Win 3 with no trumps in hand · +50 XP</div>
              </div>
              <div style={{ fontSize: 12, color: t.gold1, fontWeight: 600 }}>2/3</div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopHeroCards({ t }) {
  const cards = [
    { suit: 'spades', rank: '7', rot: -18, x: -180, y: 24, trump: true, w: 168 },
    { suit: 'hearts', rank: 'A', rot: -6, x: -60, y: -12, trump: false, w: 178 },
    { suit: 'clubs', rank: 'J', rot: 6, x: 60, y: -12, trump: false, w: 178 },
    { suit: 'diamonds', rank: 'K', rot: 18, x: 180, y: 24, trump: false, w: 168 },
  ];
  return (
    <div style={{ position: 'relative', width: 480, height: 380 }}>
      {/* radial gold glow behind */}
      <div style={{
        position: 'absolute', inset: 30, borderRadius: 999,
        background: `radial-gradient(closest-side, rgba(217,168,71,0.2), rgba(217,168,71,0))`,
        filter: 'blur(20px)',
      }}/>
      {cards.map((c, i) => (
        <div key={i} style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: `translate(-50%, -50%) translate(${c.x}px, ${c.y}px) rotate(${c.rot}deg)`,
          zIndex: i === 1 || i === 2 ? 3 : 2,
        }}>
          <div style={{ animation: `goatBob ${3.6 + i*0.3}s ease-in-out ${i*0.2}s infinite alternate` }}>
            <PlayingCard suit={c.suit} rank={c.rank} w={c.w} trump={c.trump} theme={t}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function DTStat({ t, icon, label, value }) {
  return (
    <div style={{
      flex: 1, padding: '12px 14px', borderRadius: 14,
      background: t.bgElev1, border: `0.5px solid ${t.line}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
        <Icon name={icon} size={12} color={t.gold2}/>
        <span style={{ fontSize: 10, color: t.textMid, letterSpacing: 0.6, fontWeight: 600, textTransform: 'uppercase' }}>{label}</span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>{value}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP: GAME TABLE — wide oval + side chat panel
// ─────────────────────────────────────────────────────────────
function DesktopTable({ t, nav, hand, setHand, players, gameState, setGameState, tweaks }) {
  const trumpSuit = gameState.trump;
  const [selectedIdx, setSelectedIdx] = useStateD(-1);
  const [turn, setTurn] = useStateD(gameState.turn || 'S');
  const [timeLeft, setTimeLeft] = useStateD(28);

  useEffectD(() => {
    if (turn !== 'S') return;
    setTimeLeft(28);
    const i = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(i);
  }, [turn]);

  const playCard = (idx) => {
    const c = hand[idx];
    setGameState(g => ({ ...g, trick: [...g.trick, { seat: 'S', card: c }] }));
    setHand(h => h.filter((_, i) => i !== idx));
    setSelectedIdx(-1);
    setTimeout(() => setTurn('W'), 600);
  };

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%', minHeight: '100vh',
      background: t.feltRadial,
      display: 'flex',
      fontFamily: window.GOAT_FONTS.ui, color: t.text,
    }}>
      <FeltTexture t={t}/>

      {/* Main table area */}
      <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>

        {/* Top HUD bar */}
        <div style={{
          position: 'absolute', top: 24, left: 28, right: 28, zIndex: 10,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          {/* Left: trump card */}
          <TrumpIndicator t={t} suit={trumpSuit} variant={tweaks.trumpVariant || 'card'} deckCount={gameState.deckCount}/>

          {/* Center: round */}
          <div style={{
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
            border: `0.5px solid ${t.feltLine}`, padding: '12px 22px', borderRadius: 18,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>Round {gameState.round}</div>
            <div style={{ fontSize: 16, color: '#fff', fontWeight: 500, marginTop: 2 }}>To <b style={{ color: t.gold1 }}>12</b> points</div>
          </div>

          {/* Right: score panel */}
          <ScorePanel t={t} score={gameState.score} onMenu={() => nav('menu')}/>
        </div>

        {/* Oval felt inset */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          width: 'min(78%, 920px)', aspectRatio: '1.55 / 1',
          maxHeight: '70%',
          borderRadius: 9999,
          background: 'radial-gradient(ellipse at center, rgba(42,143,90,0.4) 0%, rgba(15,78,48,0.5) 60%, rgba(8,50,31,0.6) 100%)',
          border: `1px solid ${t.feltLine}`,
          boxShadow: 'inset 0 0 80px rgba(0,0,0,0.45), 0 30px 90px rgba(0,0,0,0.4)',
        }}/>

        {/* Players around table */}
        {/* NORTH (partner) */}
        <div style={{ position: 'absolute', left: '50%', top: '18%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <SeatBadge t={t} name={players.N.name} cards={players.N.cards} team="N" thinking={turn === 'N'}/>
          <MiniHandStack count={players.N.cards} dir="h" w={36} t={t}/>
        </div>
        {/* WEST */}
        <div style={{ position: 'absolute', left: '7%', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <SeatBadge t={t} name={players.W.name} cards={players.W.cards} team="W" thinking={turn === 'W'}/>
          <MiniHandStack count={players.W.cards} dir="v" w={32} t={t}/>
        </div>
        {/* EAST */}
        <div style={{ position: 'absolute', right: '7%', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <SeatBadge t={t} name={players.E.name} cards={players.E.cards} team="E" thinking={turn === 'E'}/>
          <MiniHandStack count={players.E.cards} dir="v" w={32} t={t}/>
        </div>

        {/* Center trick area */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          <DesktopTrickStack t={t} trick={gameState.trick} trumpSuit={trumpSuit}/>
        </div>

        {/* Turn pill */}
        {turn === 'S' && (
          <div style={{ position: 'absolute', left: '50%', bottom: 220, transform: 'translateX(-50%)' }}>
            <TurnPill t={t} timeLeft={timeLeft} totalTime={30}/>
          </div>
        )}

        {/* Your hand */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 40,
          display: 'flex', justifyContent: 'center',
        }}>
          <CardFan cards={hand} w={88} theme={t}
            selected={selectedIdx}
            onSelect={(i) => selectedIdx === i ? playCard(i) : setSelectedIdx(i)}
            playable={() => turn === 'S'}/>
        </div>
      </div>

      {/* Right side panel — chat / history */}
      <DesktopChatPanel t={t} trick={gameState.trick} trumpSuit={trumpSuit}/>
    </div>
  );
}

function DesktopTrickStack({ t, trick, trumpSuit }) {
  const positions = { N: { x: 0, y: -70, r: 0 }, E: { x: 75, y: 0, r: 12 }, S: { x: 0, y: 70, r: 0 }, W: { x: -75, y: 0, r: -12 } };
  return (
    <div style={{ position: 'relative', width: 280, height: 280 }}>
      <svg viewBox="0 0 280 280" style={{ position: 'absolute', inset: 0, opacity: 0.16 }}>
        <circle cx="140" cy="140" r="130" stroke={t.gold2} strokeWidth="0.5" fill="none" strokeDasharray="4 4"/>
        <circle cx="140" cy="140" r="90" stroke={t.gold2} strokeWidth="0.4" fill="none"/>
        <text x="140" y="156" textAnchor="middle" style={{
          fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic',
          fontSize: 50, fontWeight: 700, fill: t.gold2,
        }}>G</text>
      </svg>
      {trick.map(({ seat, card }, i) => {
        const p = positions[seat];
        return (
          <div key={seat} style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) rotate(${p.r}deg)`,
            zIndex: 10 + i,
            animation: 'goatPlay .3s cubic-bezier(.2,.8,.2,1)',
          }}>
            <PlayingCard suit={card.suit} rank={card.rank} w={88}
              trump={card.suit === trumpSuit} theme={t} played/>
          </div>
        );
      })}
    </div>
  );
}

function DesktopChatPanel({ t, trick, trumpSuit }) {
  return (
    <aside style={{
      width: 300, flexShrink: 0, height: '100%',
      borderLeft: `0.5px solid ${t.feltLine}`,
      background: 'rgba(0,0,0,0.32)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column',
      padding: 20,
    }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        <Chip t={t} active>Trick log</Chip>
        <Chip t={t}>Chat</Chip>
        <Chip t={t}>Rules</Chip>
      </div>

      {/* Trick history */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <TrickLogItem t={t} round="Trick 12 — in progress" winner={null}/>
        <TrickLogItem t={t} round="Trick 11" winner="You" pts={14} cards={[{s:'spades',r:'A'},{s:'spades',r:'9'},{s:'spades',r:'K'},{s:'spades',r:'8'}]} trump={trumpSuit}/>
        <TrickLogItem t={t} round="Trick 10" winner="Kevin" pts={11} cards={[{s:'hearts',r:'10'},{s:'hearts',r:'7'},{s:'diamonds',r:'A'},{s:'diamonds',r:'6'}]} trump={trumpSuit}/>
        <TrickLogItem t={t} round="Trick 9" winner="Harry" pts={6} cards={[{s:'clubs',r:'K'},{s:'clubs',r:'Q'},{s:'clubs',r:'9'},{s:'clubs',r:'6'}]} trump={trumpSuit}/>
        <TrickLogItem t={t} round="Trick 8" winner="Marv" pts={4} cards={[{s:'diamonds',r:'J'},{s:'diamonds',r:'7'},{s:'hearts',r:'8'},{s:'clubs',r:'7'}]} trump={trumpSuit}/>
      </div>

      {/* Reactions row */}
      <div style={{
        marginTop: 14,
        display: 'flex', gap: 6, justifyContent: 'space-between',
      }}>
        {['👍','🔥','🎯','😅','💎','♣'].map(e => (
          <button key={e} style={{
            flex: 1, height: 40, borderRadius: 12,
            background: 'rgba(255,255,255,0.08)',
            border: '0.5px solid rgba(255,255,255,0.12)',
            cursor: 'pointer', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{e}</button>
        ))}
      </div>

      {/* Quick chat */}
      <div style={{
        marginTop: 10, padding: 12, borderRadius: 14,
        background: 'rgba(0,0,0,0.32)', border: `0.5px solid ${t.feltLine}`,
      }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>Quick chat</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Nice play!', 'Good game', 'Oof', 'Hurry up', 'Sorry', 'Lucky!'].map(m => (
            <button key={m} style={{
              padding: '6px 12px', borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
              border: '0.5px solid rgba(255,255,255,0.12)',
              color: '#fff', fontSize: 12, cursor: 'pointer',
            }}>{m}</button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function TrickLogItem({ t, round, winner, pts, cards, trump }) {
  return (
    <div style={{
      padding: 10, borderRadius: 12,
      background: winner ? 'rgba(0,0,0,0.28)' : 'rgba(217,168,71,0.10)',
      border: `0.5px solid ${winner ? t.feltLine : t.gold2}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5, fontWeight: 600 }}>{round}</span>
        {winner && <span style={{ fontSize: 11, color: t.gold1, fontWeight: 600 }}>{winner} · +{pts}</span>}
      </div>
      {cards && (
        <div style={{ display: 'flex', gap: 4 }}>
          {cards.map((c, i) => (
            <div key={i} style={{ flexShrink: 0 }}>
              <PlayingCard suit={c.s} rank={c.r} w={36} theme={t} trump={c.s === trump}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP: RESULTS — centered celebration
// ─────────────────────────────────────────────────────────────
function DesktopResults({ t, nav, tweaks }) {
  const won = tweaks.resultsOutcome !== 'defeat';
  return (
    <div style={{ position: 'relative', minHeight: '100%', background: won ? t.feltRadial : `radial-gradient(120% 80% at 50% 40%, #1a0e0e 0%, ${t.bg} 70%)`, overflow: 'hidden' }}>
      <FeltTexture t={t}/>
      {won && <ResultsRays t={t}/>}

      <div style={{ position: 'relative', maxWidth: 1080, margin: '0 auto', padding: '50px 40px 40px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 110, height: 110, margin: '0 auto', borderRadius: 999,
            background: won ? t.goldGrad : 'rgba(240,82,79,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: won ? '0 0 60px rgba(217,168,71,0.5)' : 'none',
            border: won ? 'none' : '1px solid rgba(240,82,79,0.4)',
          }}>
            <Icon name={won ? 'trophy' : 'shield'} size={54} color={won ? '#1A1208' : t.danger}/>
          </div>
          <div style={{ marginTop: 22, fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: 6, fontWeight: 600, textTransform: 'uppercase' }}>
            Match complete
          </div>
          <div style={{
            fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic', fontWeight: 700,
            fontSize: 132, lineHeight: 1, letterSpacing: -3, marginTop: 6,
            background: won ? t.goldGrad : 'linear-gradient(180deg, #FF8B8B, #F0524F)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.4))',
          }}>{won ? 'Victory' : 'Defeat'}</div>
        </div>

        {/* 2-col grid: score + MVP and rounds + actions */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 22, marginTop: 36,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Big score */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <ResultTeam t={t} name="Your team" win={won} score={12} sub="You · Kevin" color={t.team1}/>
              <div style={{
                fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic',
                fontSize: 40, color: 'rgba(255,255,255,0.45)', padding: '0 4px',
              }}>vs</div>
              <ResultTeam t={t} name="Opponents" win={!won} score={9} sub="Harry · Marv" color={t.team2}/>
            </div>
            {/* MVP */}
            <Panel t={t} padding={18} style={{
              background: 'rgba(0,0,0,0.42)', border: `0.5px solid ${t.feltLine}`,
              backdropFilter: 'blur(14px)',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <Avatar name="Kevin Park" size={64} t={t} ring={t.gold2} status="MVP"/>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 17, fontWeight: 600, color: '#fff' }}>Kevin Park</div>
                  <Icon name="sparkle" size={14} color={t.gold1}/>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
                  Took 4 tricks · 78 trick points · perfect barrel ride
                </div>
              </div>
              <div style={{
                fontFamily: window.GOAT_FONTS.num, fontSize: 36, fontWeight: 700,
                color: t.gold1, fontVariantNumeric: 'tabular-nums',
              }}>+78</div>
            </Panel>
          </div>

          <div>
            <div style={{
              fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.6, textTransform: 'uppercase',
              fontWeight: 600, marginBottom: 8,
            }}>Round-by-round</div>
            <div style={{
              background: 'rgba(0,0,0,0.32)', borderRadius: 16, padding: 12,
              border: `0.5px solid ${t.feltLine}`,
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
            }}>
              {[
                { us: 2, them: 0 }, { us: 2, them: 0 }, { us: 0, them: 2 }, { us: 2, them: 0 },
                { us: 0, them: 3 }, { us: 2, them: 0 }, { us: 2, them: 4 }, { us: 2, them: 0 },
              ].map((r, i) => (
                <RoundChip key={i} t={t} idx={i+1} us={r.us} them={r.them}/>
              ))}
            </div>
            <div style={{
              fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.6, textTransform: 'uppercase',
              fontWeight: 600, marginTop: 16, marginBottom: 8,
            }}>Bonuses</div>
            <div style={{
              background: 'rgba(0,0,0,0.32)', borderRadius: 16, padding: 12,
              border: `0.5px solid ${t.feltLine}`,
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <BonusRow t={t} label="Last-trick bonus" value="+10"/>
              <BonusRow t={t} label="Dealer bonus" value="+1"/>
              <BonusRow t={t} label="Opponents took less than half" value="+2"/>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 32 }}>
          <GButton t={t} variant="secondary" size="lg" onClick={() => nav('menu')}>Back to Menu</GButton>
          <GButton t={t} variant="ghost" size="lg" onClick={() => nav('stats')}>View stats</GButton>
          <GButton t={t} variant="primary" size="lg" onClick={() => nav('deal')}
            icon={<Icon name="play" size={16} color="#1A1208"/>}>
            Rematch
          </GButton>
        </div>
      </div>
    </div>
  );
}

function BonusRow({ t, label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 4px' }}>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{label}</span>
      <span style={{ fontSize: 13, color: t.gold1, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP: data screens — wrapper that uses centered content column
// We render the same content as phone, just framed wider with sticky header
// ─────────────────────────────────────────────────────────────
function DesktopWrap({ t, title, subtitle, right, children, maxWidth = 920 }) {
  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <MenuBackdrop t={t}/>
      <DesktopTopBar t={t} title={title} subtitle={subtitle} right={right}/>
      <div style={{ position: 'relative', maxWidth, margin: '0 auto', padding: '0 30px 60px' }}>
        {children}
      </div>
    </div>
  );
}

// LOBBY
function DesktopLobby({ t, nav, tweaks }) {
  const [mode, setMode] = useStateD('classic');
  const [searching, setSearching] = useStateD(false);
  const [players, setPlayers] = useStateD(1);
  useEffectD(() => {
    if (!searching) return;
    const i = setInterval(() => setPlayers(p => Math.min(4, p + 1)), 950);
    return () => clearInterval(i);
  }, [searching]);
  useEffectD(() => {
    if (players === 4) {
      const id = setTimeout(() => nav('deal'), 1100);
      return () => clearTimeout(id);
    }
  }, [players]);

  return (
    <DesktopWrap t={t} title="Match Lobby" subtitle="Find or create a game">
      {!searching ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, marginTop: 8 }}>
          <div>
            <SectionLabel t={t}>Game Mode</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 10 }}>
              {[
                { id: 'classic', name: 'Classic', sub: 'First to 12 points' },
                { id: 'quick', name: 'Quick', sub: 'First to 6 points' },
                { id: 'ranked', name: 'Ranked', sub: 'Climb the ladder' },
              ].map(m => <ModeCard key={m.id} t={t} active={mode === m.id} onClick={() => setMode(m.id)} {...m}/>)}
            </div>

            <SectionLabel t={t} style={{ marginTop: 22 }}>Rules</SectionLabel>
            <Panel t={t} padding={0} style={{ marginTop: 10 }}>
              <Row t={t} label="Allow barrel ride" right={<Toggle checked={true} onChange={() => {}} t={t}/>}/>
              <Row t={t} label="Show round score" right={<Toggle checked={false} onChange={() => {}} t={t}/>}/>
              <Row t={t} label="Turn timer" right={<span style={{ fontSize: 14, color: t.textMid }}>30s</span>}/>
              <Row t={t} label="Voice chat" right={<Toggle checked={false} onChange={() => {}} t={t}/>} last/>
            </Panel>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Panel t={t} padding={16}>
              <SectionLabel t={t}>Matchmaking</SectionLabel>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 12, color: t.textMid }}>Estimated wait</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: t.text, fontFamily: window.GOAT_FONTS.num, fontVariantNumeric: 'tabular-nums', letterSpacing: -1 }}>~12s</div>
                <div style={{ fontSize: 12, color: t.gold1, marginTop: 4 }}>1,284 players online</div>
              </div>
            </Panel>
            <GButton t={t} variant="primary" size="lg" fullWidth onClick={() => setSearching(true)}>Find Match</GButton>
            <GButton t={t} variant="secondary" size="lg" fullWidth onClick={() => nav('room')}>Private Room</GButton>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 40 }}>
          <Matchmaking t={t} players={players} mode={mode}/>
        </div>
      )}
    </DesktopWrap>
  );
}

// ROOM
function DesktopRoom({ t, nav, players }) {
  const code = 'A7K2';
  return (
    <DesktopWrap t={t} title="Private Room" subtitle="Invite friends with the room code"
      right={<GButton t={t} variant="secondary" size="md" icon={<Icon name="logout" size={14}/>} onClick={() => nav('menu')}>Leave</GButton>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 8 }}>
        <Panel t={t} padding={28} style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: 11, color: t.textMid, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>Room Code</div>
          <div style={{
            fontFamily: window.GOAT_FONTS.display, fontWeight: 600,
            fontSize: 100, lineHeight: 1, letterSpacing: 16, marginTop: 8,
            background: t.goldGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 14px rgba(217,168,71,0.4))',
          }}>{code}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 22 }}>
            <GButton t={t} variant="secondary" size="sm" icon={<Icon name="copy" size={14}/>}>Copy code</GButton>
            <GButton t={t} variant="secondary" size="sm" icon={<Icon name="qr" size={14}/>}>QR code</GButton>
            <GButton t={t} variant="secondary" size="sm" icon={<Icon name="send" size={14}/>}>Share</GButton>
          </div>
        </Panel>

        <div>
          <SectionLabel t={t}>Players · 4 seats</SectionLabel>
          <Panel t={t} padding={16} style={{ marginTop: 8 }}>
            <SeatRoster t={t} players={players}/>
          </Panel>
        </div>
      </div>

      <SectionLabel t={t} style={{ marginTop: 26 }}>Teams</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
        <TeamCard t={t} color={t.team1} bg={t.team1Bg} name="North" players={[players[0].name, players[2].name]}/>
        <TeamCard t={t} color={t.team2} bg={t.team2Bg} name="East" players={[players[1].name, players[3].name]}/>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 30 }}>
        <GButton t={t} variant="primary" size="lg" onClick={() => nav('deal')}
          icon={<Icon name="play" size={16} color="#1A1208"/>}>Start Game</GButton>
      </div>
    </DesktopWrap>
  );
}

// PROFILE
function DesktopProfile({ t, nav, profile, tweaks, setTweak }) {
  const achievements = [
    { id: 'first-trump', name: 'First Trump', icon: 'card', unlocked: true, sub: 'Won a round with no trumps in hand' },
    { id: 'barrel', name: 'Barrel Master', icon: 'flame', unlocked: true, sub: 'Survived 5 barrel rides' },
    { id: 'streak10', name: '10 in a Row', icon: 'crown', unlocked: false, sub: '10 game win streak · 7/10' },
    { id: 'social', name: 'Card Sharp', icon: 'users', unlocked: true, sub: 'Played 50 friend matches' },
    { id: 'mvp', name: 'MVP', icon: 'sparkle', unlocked: true, sub: 'Top score in a match' },
    { id: 'season1', name: 'Season I', icon: 'trophy', unlocked: false, sub: 'Reach Gold by end of season' },
  ];
  return (
    <DesktopWrap t={t} title="Profile" subtitle="Your record" maxWidth={1100}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 22 }}>
        <div>
          {/* Hero */}
          <Panel t={t} padding={24} glow style={{ position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 200 200" style={{ position: 'absolute', right: -50, top: -40, width: 200, height: 200, opacity: 0.07 }}>
              <circle cx="100" cy="100" r="90" stroke={t.gold2} strokeWidth="0.5" fill="none"/>
              <circle cx="100" cy="100" r="60" stroke={t.gold2} strokeWidth="0.4" fill="none"/>
              <text x="100" y="115" textAnchor="middle" style={{ fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic', fontSize: 90, fontWeight: 700, fill: t.gold2 }}>G</text>
            </svg>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, position: 'relative' }}>
              <Avatar name={profile.name} size={88} t={t} ring={t.gold2} status="VII"/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: t.gold1, letterSpacing: 2.2, fontWeight: 600, textTransform: 'uppercase' }}>Bronze · Tier VII</div>
                <div style={{ fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic', fontSize: 38, fontWeight: 600, color: t.text, marginTop: 4, letterSpacing: -0.5 }}>{profile.name}</div>
                <div style={{ fontSize: 13, color: t.textMid, marginTop: 2 }}>Joined March 2024 · @alex.cards</div>
              </div>
            </div>
            <div style={{ marginTop: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: t.textMid, marginBottom: 8 }}>
                <span>Next rank · Bronze VIII</span>
                <span style={{ color: t.gold1, fontWeight: 600 }}>340 / 500 XP</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: t.bgElev3, overflow: 'hidden' }}>
                <div style={{ width: '68%', height: '100%', background: t.goldGrad, boxShadow: '0 0 16px rgba(217,168,71,0.6)' }}/>
              </div>
            </div>
          </Panel>

          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginTop: 14 }}>
            <StatTile t={t} label="Matches" value="183"/>
            <StatTile t={t} label="Win rate" value="64%" emphasis/>
            <StatTile t={t} label="MVPs" value="34"/>
            <StatTile t={t} label="Streak" value="3" icon="flame"/>
          </div>

          {/* Card back */}
          <SectionLabel t={t} style={{ marginTop: 22 }}>Card Back</SectionLabel>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            {['navy','goat'].map(variant => (
              <div key={variant} onClick={() => setTweak('cardBack', variant)} style={{
                padding: 10, borderRadius: 16,
                background: tweaks.cardBack === variant ? 'rgba(217,168,71,0.16)' : t.bgElev1,
                border: `0.75px solid ${tweaks.cardBack === variant ? t.gold2 : t.line}`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <CardBack w={64} radius={7} t={t} variant={variant}/>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.text, textTransform: 'capitalize' }}>{variant}</div>
                  <div style={{ fontSize: 12, color: t.textMid, marginTop: 2 }}>{variant === 'navy' ? 'Deep navy filigree' : 'Sepia Goat monogram'}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent matches */}
          <SectionLabel t={t} style={{ marginTop: 22 }}>Recent Matches</SectionLabel>
          <Panel t={t} padding={0} style={{ marginTop: 10 }}>
            <MatchRow t={t} won score="12 — 6" mode="Quick" opp="Harry & Marv" time="14m ago"/>
            <MatchRow t={t} won score="12 — 9" mode="Classic" opp="A. Khan & Tomi" time="1h ago"/>
            <MatchRow t={t} won={false} score="8 — 12" mode="Ranked" opp="Bo & Iris" time="Yesterday"/>
            <MatchRow t={t} won score="12 — 3" mode="Classic" opp="Dee & Jamie" time="2d ago" last/>
          </Panel>
        </div>

        {/* Right column: achievements */}
        <div>
          <SectionLabel t={t}>Achievements · 4/6</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            {achievements.map(a => <AchTile key={a.id} t={t} a={a}/>)}
          </div>
        </div>
      </div>
    </DesktopWrap>
  );
}

// STATS
function DesktopStats({ t, nav }) {
  const days = [
    { w: 2, l: 1 }, { w: 0, l: 2 }, { w: 3, l: 0 }, { w: 2, l: 1 }, { w: 1, l: 1 },
    { w: 0, l: 0 }, { w: 3, l: 1 }, { w: 1, l: 0 }, { w: 2, l: 2 }, { w: 4, l: 1 },
    { w: 1, l: 2 }, { w: 3, l: 0 }, { w: 2, l: 1 }, { w: 5, l: 1 },
  ];
  const maxBar = Math.max(...days.map(d => d.w + d.l), 1);
  return (
    <DesktopWrap t={t} title="Statistics" subtitle="Lifetime record" maxWidth={1100}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 22 }}>
        <div>
          <Panel t={t} padding={22}>
            <div style={{ fontSize: 11, color: t.textMid, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>Lifetime</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, marginTop: 10 }}>
              <div>
                <div style={{
                  fontFamily: window.GOAT_FONTS.num, fontSize: 88, fontWeight: 700,
                  background: t.goldGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  lineHeight: 1, letterSpacing: -3, fontVariantNumeric: 'tabular-nums',
                }}>64<span style={{ fontSize: 42 }}>%</span></div>
                <div style={{ fontSize: 12, color: t.textMid, marginTop: 6 }}>Win rate · +3.2 this week</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: 6 }}>
                <KVrow t={t} k="Matches" v="183"/>
                <KVrow t={t} k="Wins" v="117"/>
                <KVrow t={t} k="Best streak" v="11"/>
                <KVrow t={t} k="Highest score" v="92"/>
              </div>
            </div>
          </Panel>

          <SectionLabel t={t} style={{ marginTop: 22 }}>Last 14 days</SectionLabel>
          <Panel t={t} padding={22} style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180 }}>
              {days.map((d, i) => {
                const wH = (d.w / maxBar) * 100;
                const lH = (d.l / maxBar) * 100;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', gap: 3, height: '100%', minWidth: 0 }}>
                    <div style={{ height: `${wH}%`, background: t.goldGrad, borderRadius: '5px 5px 0 0', minHeight: d.w ? 4 : 0, boxShadow: '0 0 12px rgba(217,168,71,0.3)' }}/>
                    <div style={{ height: `${lH}%`, background: 'rgba(240,82,79,0.35)', borderRadius: '5px 5px 0 0', minHeight: d.l ? 4 : 0 }}/>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: t.textDim }}>
              <span>14 days ago</span><span>Today</span>
            </div>
          </Panel>

          <SectionLabel t={t} style={{ marginTop: 22 }}>Records</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            <RecordTile t={t} icon="flame" label="Longest streak" value="11"/>
            <RecordTile t={t} icon="sparkle" label="Highest score" value="92"/>
            <RecordTile t={t} icon="users" label="Friend matches" value="58"/>
            <RecordTile t={t} icon="crown" label="MVPs" value="34"/>
          </div>
        </div>

        <div>
          <SectionLabel t={t}>Trump suit win rate</SectionLabel>
          <Panel t={t} padding={18} style={{ marginTop: 10 }}>
            {[
              { s: 'spades', wr: 71, n: 32, glyph: '♠', red: false },
              { s: 'hearts', wr: 62, n: 41, glyph: '♥', red: true },
              { s: 'diamonds', wr: 58, n: 38, glyph: '♦', red: true },
              { s: 'clubs', wr: 64, n: 39, glyph: '♣', red: false },
            ].map((r, i, arr) => (
              <div key={r.s} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 0',
                borderBottom: i < arr.length - 1 ? `0.5px solid ${t.lineSoft}` : 'none',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: r.red ? 'rgba(177,42,42,0.14)' : 'rgba(255,255,255,0.08)',
                  color: r.red ? t.cardRed : t.text,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                }}>{r.glyph}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: t.text, textTransform: 'capitalize' }}>{r.s}</div>
                  <div style={{ height: 5, borderRadius: 999, background: t.bgElev3, marginTop: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${r.wr}%`, height: '100%', background: t.goldGrad }}/>
                  </div>
                </div>
                <div style={{ minWidth: 70, textAlign: 'right' }}>
                  <div style={{ fontFamily: window.GOAT_FONTS.num, fontSize: 19, fontWeight: 700, color: t.text, fontVariantNumeric: 'tabular-nums' }}>{r.wr}<span style={{ color: t.textMid, fontSize: 13 }}>%</span></div>
                  <div style={{ fontSize: 11, color: t.textDim }}>{r.n} matches</div>
                </div>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </DesktopWrap>
  );
}

// SETTINGS
function DesktopSettings({ t, nav, tweaks, setTweak }) {
  const sections = [
    { id: 'appearance', l: 'Appearance' },
    { id: 'game', l: 'Game' },
    { id: 'sound', l: 'Sound & Haptics' },
    { id: 'language', l: 'Language' },
    { id: 'about', l: 'About' },
  ];
  const [sel, setSel] = useStateD('appearance');
  return (
    <DesktopWrap t={t} title="Settings" subtitle="Adjust your experience" maxWidth={1100}>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 22 }}>
        {/* Side list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setSel(s.id)} style={{
              padding: '10px 14px', borderRadius: 12,
              background: sel === s.id ? 'rgba(217,168,71,0.12)' : 'transparent',
              color: sel === s.id ? t.gold1 : t.text,
              border: 'none', cursor: 'pointer', textAlign: 'left',
              fontSize: 14, fontWeight: 500,
              fontFamily: window.GOAT_FONTS.ui,
            }}>{s.l}</button>
          ))}
        </div>
        <div>
          {sel === 'appearance' && (
            <Panel t={t} padding={0}>
              <Row t={t} label="Theme" right={<SegToggle t={t} value={tweaks.theme} onChange={v => setTweak('theme', v)} options={[{v:'light',l:'Light'},{v:'dark',l:'Dark'}]}/>}/>
              <Row t={t} label="Card back" right={<SegToggle t={t} value={tweaks.cardBack} onChange={v => setTweak('cardBack', v)} options={[{v:'navy',l:'Navy'},{v:'goat',l:'Goat'}]}/>}/>
              <Row t={t} label="Table felt" right={<SegToggle t={t} value={tweaks.feltVariant || 'classic'} onChange={v => setTweak('feltVariant', v)} options={[{v:'classic',l:'Classic'},{v:'noir',l:'Noir'}]}/>}/>
              <Row t={t} label="Device override" right={<SegToggle t={t} value={tweaks.device || 'auto'} onChange={v => setTweak('device', v)} options={[{v:'auto',l:'Auto'},{v:'phone',l:'Phone'},{v:'desktop',l:'Desktop'}]}/>} last/>
            </Panel>
          )}
          {sel === 'game' && (
            <Panel t={t} padding={0}>
              <Row t={t} label="Auto-play forced cards" right={<Toggle checked={true} onChange={() => {}} t={t}/>}/>
              <Row t={t} label="Show legal cards hint" right={<Toggle checked={true} onChange={() => {}} t={t}/>}/>
              <Row t={t} label="Confirm before playing" right={<Toggle checked={false} onChange={() => {}} t={t}/>}/>
              <Row t={t} label="Sort hand by suit" right={<Toggle checked={true} onChange={() => {}} t={t}/>} last/>
            </Panel>
          )}
          {sel === 'sound' && (
            <Panel t={t} padding={0}>
              <Row t={t} label="Master volume" right={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="volume" size={14} color={t.textMid}/><SliderTrack t={t} value={68}/></div>}/>
              <Row t={t} label="Music" right={<Toggle checked={true} onChange={() => {}} t={t}/>}/>
              <Row t={t} label="Sound effects" right={<Toggle checked={true} onChange={() => {}} t={t}/>}/>
              <Row t={t} label="Haptic feedback" right={<Toggle checked={true} onChange={() => {}} t={t}/>} last/>
            </Panel>
          )}
          {sel === 'language' && (
            <Panel t={t} padding={0}>
              {[{l:'English',f:'en',sel:true},{l:'Українська',f:'uk'},{l:'Русский',f:'ru'},{l:'Español',f:'es'},{l:'Polski',f:'pl'}].map((o,i,arr) => (
                <Row key={o.f} t={t} label={o.l} last={i === arr.length - 1}
                  right={o.sel ? <Icon name="check" size={14} color={t.gold1}/> : <span style={{ fontSize: 11, color: t.textDim, textTransform: 'uppercase', letterSpacing: 1 }}>{o.f}</span>}/>
              ))}
            </Panel>
          )}
          {sel === 'about' && (
            <Panel t={t} padding={0}>
              <Row t={t} label="Rules of Goat" right={<Icon name="arrow-right" size={14} color={t.textDim}/>}/>
              <Row t={t} label="Restore purchases" right={<Icon name="arrow-right" size={14} color={t.textDim}/>}/>
              <Row t={t} label="Privacy" right={<Icon name="arrow-right" size={14} color={t.textDim}/>}/>
              <Row t={t} label="Terms" right={<Icon name="arrow-right" size={14} color={t.textDim}/>}/>
              <Row t={t} label="Version" right={<span style={{ fontSize: 14, color: t.textDim }}>1.0.0 (build 42)</span>} last/>
            </Panel>
          )}
        </div>
      </div>
    </DesktopWrap>
  );
}

Object.assign(window, {
  DesktopShell, DesktopMenu, DesktopTable, DesktopResults, DesktopLobby,
  DesktopRoom, DesktopProfile, DesktopStats, DesktopSettings,
});
