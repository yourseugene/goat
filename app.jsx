// Main app: routing, theme, tweaks panel, iOS phone shell.

const { useState: useAppState, useEffect: useAppEffect, useMemo: useAppMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "menuVariant": "hero",
  "trumpVariant": "card",
  "resultsVariant": "celebration",
  "resultsOutcome": "victory",
  "cardBack": "navy",
  "feltVariant": "classic",
  "scale": 0.92,
  "device": "auto"
}/*EDITMODE-END*/;

// Sample hand for the demo (a believable starting hand)
const sampleHand = [
  { suit: 'spades', rank: 'A' },
  { suit: 'spades', rank: '10' },
  { suit: 'spades', rank: '7', trump: false },
  { suit: 'hearts', rank: 'K' },
  { suit: 'hearts', rank: '9' },
  { suit: 'hearts', rank: '6' },
  { suit: 'diamonds', rank: 'Q' },
  { suit: 'clubs', rank: 'J' },
  { suit: 'clubs', rank: '8' },
];

const initialPlayers = [
  { name: 'Kevin Park', ai: false, online: true },   // host / partner-ish
  { name: 'Harry Lin', ai: false, online: true },
  { name: 'Alex Wong', ai: false, online: true },    // you
  { name: 'Marv Davies', ai: true, online: true },
];

function App() {
  const [tweaks, setTweaksState] = useAppState(TWEAK_DEFAULTS);
  const setTweak = (k, v) => {
    setTweaksState(t => {
      const next = typeof k === 'object' ? { ...t, ...k } : { ...t, [k]: v };
      try { window.parent?.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*'); } catch {}
      return next;
    });
  };

  const [screen, setScreen] = useAppState('menu');
  const [hand, setHand] = useAppState(sampleHand);
  const [players] = useAppState(initialPlayers);
  const [gameState, setGameState] = useAppState({
    round: 5,
    trump: 'hearts',
    deckCount: 14,
    score: { us: 8, them: 6, usRound: 18, themRound: 12 },
    trick: [
      { seat: 'W', card: { suit: 'clubs', rank: 'A' } },
      { seat: 'N', card: { suit: 'clubs', rank: '10' } },
      { seat: 'E', card: { suit: 'hearts', rank: '8' } }, // trumped!
    ],
    turn: 'S',
  });
  const [notif] = useAppState({ unread: 2 });

  // Viewport detection
  const [vw, setVw] = useAppState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useAppEffect(() => {
    const onR = () => setVw(window.innerWidth);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);
  const deviceOverride = tweaks.device || 'auto';
  const device = deviceOverride === 'auto' ? (vw >= 980 ? 'desktop' : 'phone') : deviceOverride;

  const t = window.GOAT_TOKENS[tweaks.theme];

  // Tweaks panel wiring
  useAppEffect(() => {
    const onMsg = (e) => {
      if (!e?.data) return;
      if (e.data.type === '__activate_edit_mode') setShowTweaks(true);
      if (e.data.type === '__deactivate_edit_mode') setShowTweaks(false);
    };
    window.addEventListener('message', onMsg);
    try { window.parent?.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const [showTweaks, setShowTweaks] = useAppState(false);

  const nav = (to) => {
    if (to === 'table' && screen !== 'table' && screen !== 'deal') {
      setHand(sampleHand);
      setGameState(g => ({ ...g, trick: [
        { seat: 'W', card: { suit: 'clubs', rank: 'A' } },
        { seat: 'N', card: { suit: 'clubs', rank: '10' } },
        { seat: 'E', card: { suit: 'hearts', rank: '8' } },
      ], turn: 'S' }));
    }
    setScreen(to);
  };

  const profile = { name: 'Alex Wong' };

  const seatPlayers = {
    N: { name: 'Kevin', cards: 5 },
    E: { name: 'Marv', cards: 5 },
    S: { name: 'You', cards: hand.length },
    W: { name: 'Harry', cards: 5 },
  };

  // ── DESKTOP ─────────────────────────────────────────────────
  if (device === 'desktop') {
    return (
      <DesktopShell t={t} screen={screen} nav={nav} tweaks={tweaks} setTweak={setTweak}>
        <DesktopScreens
          screen={screen} nav={nav} t={t} tweaks={tweaks} setTweak={setTweak}
          hand={hand} setHand={setHand}
          players={initialPlayers}
          seatPlayers={seatPlayers}
          gameState={gameState} setGameState={setGameState}
          profile={profile} notif={notif}
        />
        {showTweaks && <TweaksPanelEl t={t} tweaks={tweaks} setTweak={setTweak} setShowTweaks={setShowTweaks}/>}
      </DesktopShell>
    );
  }

  // ── PHONE ───────────────────────────────────────────────────
  const phoneW = 402, phoneH = 874;
  return (
    <div style={{
      position: 'fixed', inset: 0, overflow: 'hidden',
      background: tweaks.theme === 'dark'
        ? 'radial-gradient(120% 80% at 50% 30%, #1A140C 0%, #06040A 100%)'
        : 'radial-gradient(120% 80% at 50% 30%, #EDE1C8 0%, #C9B79A 100%)',
      fontFamily: window.GOAT_FONTS.ui,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background .4s ease',
    }}>
      <PhoneShell phoneW={phoneW} phoneH={phoneH} t={t} scale={tweaks.scale || 0.92} tweaks={tweaks} setTweak={setTweak}>
        <PhoneScreens
          screen={screen} nav={nav} t={t} tweaks={tweaks} setTweak={setTweak}
          hand={hand} setHand={setHand}
          players={initialPlayers}
          seatPlayers={seatPlayers}
          gameState={gameState} setGameState={setGameState}
          profile={profile} notif={notif}
        />
      </PhoneShell>

      <FloatingControls t={t} tweaks={tweaks} setTweak={setTweak} screen={screen} nav={nav}/>

      {showTweaks && <TweaksPanelEl t={t} tweaks={tweaks} setTweak={setTweak} setShowTweaks={setShowTweaks}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PHONE SHELL — borrowed-from-iOS frame, scaled to viewport
// ─────────────────────────────────────────────────────────────
function PhoneShell({ children, phoneW, phoneH, scale, t, tweaks }) {
  return (
    <div style={{
      transform: `scale(${scale})`, transformOrigin: 'center',
      filter: 'drop-shadow(0 60px 80px rgba(0,0,0,0.45))',
    }}>
      <div style={{
        width: phoneW, height: phoneH, borderRadius: 56, padding: 6,
        background: 'linear-gradient(135deg, #2a2a30 0%, #0a0a0e 50%, #2a2a30 100%)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.06), inset 0 0 0 1.5px rgba(255,255,255,0.06)',
        position: 'relative',
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: 50,
          background: t.bg, overflow: 'hidden', position: 'relative',
        }}>
          {/* Phone status bar */}
          <PhoneStatusBar t={t}/>
          {/* Dynamic island */}
          <div style={{
            position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
            width: 124, height: 35, borderRadius: 24, background: '#000', zIndex: 100,
          }}/>
          {/* Content */}
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {children}
          </div>
          {/* Home indicator */}
          <div style={{
            position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
            width: 134, height: 5, borderRadius: 100,
            background: t.name === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.32)',
            zIndex: 200, pointerEvents: 'none',
          }}/>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN ROUTER
// ─────────────────────────────────────────────────────────────
function PhoneScreens({ screen, nav, t, tweaks, setTweak, hand, setHand, players, seatPlayers, gameState, setGameState, profile, notif }) {
  const screens = {
    menu:         <MainMenuScreen t={t} nav={nav} tweaks={tweaks} setTweak={setTweak} profile={profile} notif={notif}/>,
    lobby:        <LobbyScreen t={t} nav={nav} tweaks={tweaks}/>,
    room:         <RoomScreen t={t} nav={nav} players={players} setPlayers={() => {}}/>,
    deal:         <DealScreen t={t} nav={nav}/>,
    table:        <TableScreen t={t} nav={nav} tweaks={tweaks}
                    hand={hand} setHand={setHand}
                    players={seatPlayers}
                    gameState={gameState} setGameState={setGameState}/>,
    results:      <ResultsScreen t={t} nav={nav} tweaks={tweaks}/>,
    profile:      <ProfileScreen t={t} nav={nav} profile={profile} tweaks={tweaks} setTweak={setTweak}/>,
    stats:        <StatsScreen t={t} nav={nav}/>,
    settings:     <SettingsScreen t={t} nav={nav} tweaks={tweaks} setTweak={setTweak}/>,
  };
  return (
    <div data-screen-label={screen}
      key={screen}
      style={{
        width: '100%', height: '100%', position: 'absolute', inset: 0,
        animation: 'goatFade .25s ease',
      }}>
      {screens[screen] || screens.menu}
    </div>
  );
}

function DesktopScreens({ screen, nav, t, tweaks, setTweak, hand, setHand, players, seatPlayers, gameState, setGameState, profile, notif }) {
  const screens = {
    menu:         <DesktopMenu t={t} nav={nav} profile={profile} tweaks={tweaks}/>,
    lobby:        <DesktopLobby t={t} nav={nav} tweaks={tweaks}/>,
    room:         <DesktopRoom t={t} nav={nav} players={players}/>,
    deal:         <DealScreen t={t} nav={nav}/>,
    table:        <DesktopTable t={t} nav={nav} tweaks={tweaks}
                    hand={hand} setHand={setHand}
                    players={seatPlayers}
                    gameState={gameState} setGameState={setGameState}/>,
    results:      <DesktopResults t={t} nav={nav} tweaks={tweaks}/>,
    profile:      <DesktopProfile t={t} nav={nav} profile={profile} tweaks={tweaks} setTweak={setTweak}/>,
    stats:        <DesktopStats t={t} nav={nav}/>,
    settings:     <DesktopSettings t={t} nav={nav} tweaks={tweaks} setTweak={setTweak}/>,
  };
  return (
    <div data-screen-label={screen}
      key={screen}
      style={{ width: '100%', minHeight: '100%', animation: 'goatFade .25s ease' }}>
      {screens[screen] || screens.menu}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FLOATING CONTROLS (outside the phone, for navigation/preview)
// ─────────────────────────────────────────────────────────────
function FloatingControls({ t, tweaks, setTweak, screen, nav }) {
  const screens = [
    { id: 'menu', l: 'Menu', icon: 'home' },
    { id: 'lobby', l: 'Lobby', icon: 'play' },
    { id: 'room', l: 'Room', icon: 'users' },
    { id: 'deal', l: 'Deal', icon: 'sparkle' },
    { id: 'table', l: 'Table', icon: 'card' },
    { id: 'results', l: 'Result', icon: 'trophy' },
    { id: 'profile', l: 'Profile', icon: 'shield' },
    { id: 'stats', l: 'Stats', icon: 'chart' },
    { id: 'settings', l: 'Settings', icon: 'settings' },
  ];
  return (
    <div style={{
      position: 'fixed', left: 18, top: '50%', transform: 'translateY(-50%)',
      display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 4,
      padding: 6, borderRadius: 22,
      background: 'rgba(20,16,9,0.88)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '0.5px solid rgba(244,213,138,0.18)',
      boxShadow: '0 18px 50px rgba(0,0,0,0.4)',
      zIndex: 1000, maxHeight: '92vh', overflow: 'auto',
    }}>
      <button onClick={() => setTweak('theme', tweaks.theme === 'dark' ? 'light' : 'dark')}
        title="Toggle theme"
        style={{
          width: 36, height: 36, borderRadius: 12,
          background: tweaks.theme === 'dark' ? '#F4D58A' : '#1A1611',
          color: tweaks.theme === 'dark' ? '#1A1208' : '#F4D58A',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, flexShrink: 0,
        }}>{tweaks.theme === 'dark' ? '☀' : '☾'}</button>
      <div style={{ height: 1, background: 'rgba(244,213,138,0.18)', margin: '2px 6px' }}/>
      {screens.map(s => (
        <button key={s.id} onClick={() => nav(s.id)}
          title={s.l}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 10px', borderRadius: 12,
            background: screen === s.id ? 'rgba(244,213,138,0.18)' : 'transparent',
            color: screen === s.id ? '#F4D58A' : 'rgba(245,239,224,0.72)',
            border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 500, letterSpacing: 0.2,
            fontFamily: window.GOAT_FONTS.ui, flexShrink: 0, textAlign: 'left',
            minWidth: 92,
          }}>
          <Icon name={s.icon} size={14} color="currentColor"/>
          <span>{s.l}</span>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TWEAKS PANEL
// ─────────────────────────────────────────────────────────────
function TweaksPanelEl({ t, tweaks, setTweak, setShowTweaks }) {
  return (
    <TweaksPanel title="Tweaks" onClose={() => {
      setShowTweaks(false);
      try { window.parent?.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch {}
    }}>
      <TweakSection title="Device">
        <TweakRadio
          options={[
            {value:'auto',    label:'Auto'},
            {value:'phone',   label:'Phone'},
            {value:'desktop', label:'Desktop'},
          ]}
          value={tweaks.device || 'auto'} onChange={v => setTweak('device', v)}
        />
      </TweakSection>

      <TweakSection title="Theme">
        <TweakRadio
          options={[{value:'dark', label:'Dark'},{value:'light', label:'Light'}]}
          value={tweaks.theme} onChange={v => setTweak('theme', v)}
        />
      </TweakSection>

      <TweakSection title="Main Menu Layout">
        <TweakSelect
          options={[
            {value:'hero',   label:'Hero — big wordmark + CTA'},
            {value:'grid',   label:'Grid — 2×2 mode tiles'},
            {value:'cinema', label:'Cinema — daily challenge ribbon'},
          ]}
          value={tweaks.menuVariant} onChange={v => setTweak('menuVariant', v)}
        />
      </TweakSection>

      <TweakSection title="Trump Indicator">
        <TweakRadio
          options={[
            {value:'card',   label:'Card'},
            {value:'banner', label:'Banner'},
            {value:'pill',   label:'Pill'},
          ]}
          value={tweaks.trumpVariant} onChange={v => setTweak('trumpVariant', v)}
        />
      </TweakSection>

      <TweakSection title="End Match Result">
        <TweakRadio
          options={[
            {value:'celebration', label:'Trophy'},
            {value:'card',        label:'Card'},
          ]}
          value={tweaks.resultsVariant} onChange={v => setTweak('resultsVariant', v)}
        />
        <TweakRadio
          options={[
            {value:'victory', label:'Victory'},
            {value:'defeat',  label:'Defeat'},
          ]}
          value={tweaks.resultsOutcome} onChange={v => setTweak('resultsOutcome', v)}
        />
      </TweakSection>

      <TweakSection title="Card Back">
        <TweakRadio
          options={[
            {value:'navy', label:'Navy filigree'},
            {value:'goat', label:'Goat sepia'},
          ]}
          value={tweaks.cardBack} onChange={v => setTweak('cardBack', v)}
        />
      </TweakSection>

      <TweakSection title="Phone Scale">
        <TweakSlider min={0.6} max={1.05} step={0.02} value={tweaks.scale}
          onChange={v => setTweak('scale', v)}/>
      </TweakSection>
    </TweaksPanel>
  );
}

// Mount
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
