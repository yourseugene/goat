// Profile, Statistics, Settings screens

const { useState: useStateA } = React;

// ─────────────────────────────────────────────────────────────
// SCREEN: PLAYER PROFILE
// ─────────────────────────────────────────────────────────────
function ProfileScreen({ t, nav, profile, tweaks, setTweak }) {
  const achievements = [
    { id: 'first-trump', name: 'First Trump', icon: 'card', unlocked: true, sub: 'Won a round with no trumps in hand' },
    { id: 'barrel', name: 'Barrel Master', icon: 'flame', unlocked: true, sub: 'Survived 5 barrel rides' },
    { id: 'streak10', name: '10 in a Row', icon: 'crown', unlocked: false, sub: '10 game win streak · 7/10' },
    { id: 'social', name: 'Card Sharp', icon: 'users', unlocked: true, sub: 'Played 50 friend matches' },
    { id: 'mvp', name: 'MVP', icon: 'sparkle', unlocked: true, sub: 'Top score in a match' },
    { id: 'season1', name: 'Season I', icon: 'trophy', unlocked: false, sub: 'Reach Gold by end of season' },
  ];

  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, color: t.text, position: 'relative', overflow: 'hidden' }}>
      <MenuBackdrop t={t}/>
      <ScreenTopBar t={t} back={() => nav('menu')} title="Profile"
        right={<IconPill t={t} onClick={() => nav('settings')}><Icon name="settings" size={18} color={t.text}/></IconPill>}/>

      <div style={{ position: 'absolute', top: 124, left: 0, right: 0, bottom: 0, padding: '0 20px', overflow: 'auto' }}>
        {/* Hero card */}
        <Panel t={t} padding={20} style={{ position: 'relative', overflow: 'hidden' }} glow>
          {/* gold ornament background */}
          <svg viewBox="0 0 200 200" style={{
            position: 'absolute', right: -60, top: -50, width: 160, height: 160, opacity: 0.07,
            pointerEvents: 'none',
          }}>
            <circle cx="100" cy="100" r="90" stroke={t.gold2} strokeWidth="0.5" fill="none"/>
            <circle cx="100" cy="100" r="60" stroke={t.gold2} strokeWidth="0.4" fill="none"/>
            <text x="100" y="115" textAnchor="middle" style={{
              fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic',
              fontSize: 80, fontWeight: 700, fill: t.gold2,
            }}>G</text>
          </svg>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
            <Avatar name={profile.name} size={68} t={t} ring={t.gold2} status="VII"/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: t.gold1, letterSpacing: 2, fontWeight: 600, textTransform: 'uppercase' }}>
                Bronze · Tier VII
              </div>
              <div style={{ fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic', fontWeight: 600,
                fontSize: 28, color: t.text, marginTop: 2, letterSpacing: 0.2 }}>{profile.name}</div>
              <div style={{ fontSize: 12, color: t.textMid, marginTop: 2 }}>Joined March 2024 · @alex.cards</div>
            </div>
          </div>

          {/* XP bar */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: t.textMid, marginBottom: 6 }}>
              <span>Next rank · Bronze VIII</span>
              <span style={{ color: t.gold1, fontWeight: 600 }}>340 / 500 XP</span>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: t.bgElev3, overflow: 'hidden' }}>
              <div style={{ width: '68%', height: '100%', background: t.goldGrad,
                boxShadow: '0 0 12px rgba(217,168,71,0.6)' }}/>
            </div>
          </div>
        </Panel>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14 }}>
          <StatTile t={t} label="Matches" value="183"/>
          <StatTile t={t} label="Win rate" value="64%" emphasis/>
          <StatTile t={t} label="Streak" value="3" icon="flame"/>
        </div>

        {/* Card back picker */}
        <SectionLabel t={t} style={{ marginTop: 22 }}>Card Back</SectionLabel>
        <div style={{ display: 'flex', gap: 10, marginTop: 10, overflow: 'auto', padding: 4, margin: -4 }}>
          {['navy','goat','navy','goat'].map((variant, i) => (
            <div key={i} onClick={() => setTweak('cardBack', variant)} style={{
              flexShrink: 0, padding: 6, borderRadius: 14,
              background: tweaks.cardBack === variant ? 'rgba(217,168,71,0.16)' : 'transparent',
              border: `0.75px solid ${tweaks.cardBack === variant ? t.gold2 : t.line}`,
              cursor: 'pointer',
            }}>
              <CardBack w={56} radius={6} t={t} variant={variant}/>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <SectionLabel t={t} style={{ marginTop: 22 }}>Achievements · 4/6</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
          {achievements.map(a => <AchTile key={a.id} t={t} a={a}/>)}
        </div>

        {/* Recent matches */}
        <SectionLabel t={t} style={{ marginTop: 22 }}>Recent Matches</SectionLabel>
        <Panel t={t} padding={0} style={{ marginTop: 6 }}>
          <MatchRow t={t} won score="12 — 6" mode="Quick" opp="Harry & Marv" time="14m ago"/>
          <MatchRow t={t} won score="12 — 9" mode="Classic" opp="A. Khan & Tomi" time="1h ago"/>
          <MatchRow t={t} won={false} score="8 — 12" mode="Ranked" opp="Bo & Iris" time="Yesterday"/>
          <MatchRow t={t} won score="12 — 3" mode="Classic" opp="Dee & Jamie" time="2d ago" last/>
        </Panel>

        <div style={{ marginTop: 18, marginBottom: 30, display: 'flex', justifyContent: 'center' }}>
          <GButton t={t} variant="ghost" size="md" icon={<Icon name="logout" size={14}/>} onClick={() => nav('menu')}>
            Sign out
          </GButton>
        </div>
      </div>
    </div>
  );
}

function StatTile({ t, label, value, emphasis, icon }) {
  return (
    <div style={{
      padding: '12px 10px', borderRadius: 14,
      background: emphasis ? 'rgba(217,168,71,0.12)' : t.bgElev1,
      border: `0.5px solid ${emphasis ? t.gold2 : t.line}`,
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ fontSize: 10, color: t.textMid, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 4,
        fontFamily: window.GOAT_FONTS.num, fontSize: 22, fontWeight: 700,
        color: emphasis ? t.gold1 : t.text, fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
        {icon && <Icon name={icon} size={14} color={t.gold2}/>}
      </div>
    </div>
  );
}

function AchTile({ t, a }) {
  return (
    <div style={{
      padding: 12, borderRadius: 14,
      background: t.bgElev1,
      border: `0.5px solid ${a.unlocked ? t.gold2 : t.line}`,
      opacity: a.unlocked ? 1 : 0.6,
      display: 'flex', flexDirection: 'column', gap: 6,
      position: 'relative', overflow: 'hidden',
    }}>
      {a.unlocked && <div style={{
        position: 'absolute', top: 8, right: 8,
        width: 14, height: 14, borderRadius: 999, background: t.goldGrad,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="check" size={9} color="#1A1208" stroke={3}/>
      </div>}
      <div style={{
        width: 38, height: 38, borderRadius: 12,
        background: a.unlocked ? t.goldGrad : t.bgElev3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={a.icon} size={20} color={a.unlocked ? '#1A1208' : t.textMid}/>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{a.name}</div>
      <div style={{ fontSize: 11, color: t.textMid, lineHeight: 1.35 }}>{a.sub}</div>
    </div>
  );
}

function MatchRow({ t, won, score, mode, opp, time, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', padding: '12px 16px', gap: 12,
      borderBottom: last ? 'none' : `0.5px solid ${t.lineSoft}`,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: won ? 'rgba(79,203,122,0.14)' : 'rgba(240,82,79,0.12)',
        color: won ? t.success : t.danger,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700,
      }}>{won ? 'W' : 'L'}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{score}</div>
          <span style={{ fontSize: 10, color: t.textMid, padding: '1px 6px', borderRadius: 5, background: t.bgElev3, fontWeight: 600, letterSpacing: 0.3 }}>{mode}</span>
        </div>
        <div style={{ fontSize: 11, color: t.textMid, marginTop: 2 }}>vs {opp}</div>
      </div>
      <div style={{ fontSize: 11, color: t.textDim }}>{time}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN: STATISTICS
// ─────────────────────────────────────────────────────────────
function StatsScreen({ t, nav }) {
  // last 14 days, wins / losses
  const days = [
    { w: 2, l: 1 }, { w: 0, l: 2 }, { w: 3, l: 0 }, { w: 2, l: 1 }, { w: 1, l: 1 },
    { w: 0, l: 0 }, { w: 3, l: 1 }, { w: 1, l: 0 }, { w: 2, l: 2 }, { w: 4, l: 1 },
    { w: 1, l: 2 }, { w: 3, l: 0 }, { w: 2, l: 1 }, { w: 5, l: 1 },
  ];
  const maxBar = Math.max(...days.map(d => d.w + d.l), 1);

  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, color: t.text, position: 'relative', overflow: 'hidden' }}>
      <MenuBackdrop t={t}/>
      <ScreenTopBar t={t} back={() => nav('menu')} title="Statistics"/>

      <div style={{ position: 'absolute', top: 124, left: 0, right: 0, bottom: 0, padding: '0 20px', overflow: 'auto' }}>
        {/* Hero numbers */}
        <Panel t={t} padding={18}>
          <div style={{ fontSize: 11, color: t.textMid, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>Lifetime</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, marginTop: 8 }}>
            <div>
              <div style={{
                fontFamily: window.GOAT_FONTS.num, fontSize: 56, fontWeight: 700,
                background: t.goldGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                lineHeight: 1, letterSpacing: -2, fontVariantNumeric: 'tabular-nums',
              }}>64<span style={{ fontSize: 28 }}>%</span></div>
              <div style={{ fontSize: 11, color: t.textMid, marginTop: 4 }}>Win rate · +3.2 this week</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 4 }}>
              <KVrow t={t} k="Matches" v="183"/>
              <KVrow t={t} k="Wins" v="117"/>
              <KVrow t={t} k="Best streak" v="11"/>
            </div>
          </div>
        </Panel>

        {/* Activity chart */}
        <SectionLabel t={t} style={{ marginTop: 18 }}>Last 14 days</SectionLabel>
        <Panel t={t} padding={16} style={{ marginTop: 6 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
            {days.map((d, i) => {
              const wH = (d.w / maxBar) * 100;
              const lH = (d.l / maxBar) * 100;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', gap: 2, height: '100%', minWidth: 0 }}>
                  <div style={{ height: `${wH}%`, background: t.goldGrad, borderRadius: '4px 4px 0 0', minHeight: d.w ? 4 : 0,
                    boxShadow: '0 0 8px rgba(217,168,71,0.3)' }}/>
                  <div style={{ height: `${lH}%`, background: 'rgba(240,82,79,0.35)', borderRadius: '4px 4px 0 0', minHeight: d.l ? 4 : 0 }}/>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: t.textDim }}>
            <span>14d ago</span>
            <span>Today</span>
          </div>
        </Panel>

        {/* Suit/trump breakdown */}
        <SectionLabel t={t} style={{ marginTop: 18 }}>Trump suit win rate</SectionLabel>
        <Panel t={t} padding={16} style={{ marginTop: 6 }}>
          {[
            { s: 'spades', wr: 71, n: 32, glyph: '♠', red: false },
            { s: 'hearts', wr: 62, n: 41, glyph: '♥', red: true },
            { s: 'diamonds', wr: 58, n: 38, glyph: '♦', red: true },
            { s: 'clubs', wr: 64, n: 39, glyph: '♣', red: false },
          ].map((r, i, arr) => (
            <div key={r.s} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0',
              borderBottom: i < arr.length - 1 ? `0.5px solid ${t.lineSoft}` : 'none',
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: r.red ? 'rgba(177,42,42,0.14)' : 'rgba(255,255,255,0.08)',
                color: r.red ? t.cardRed : t.text,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>{r.glyph}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text, textTransform: 'capitalize' }}>{r.s}</div>
                <div style={{ height: 4, borderRadius: 999, background: t.bgElev3, marginTop: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${r.wr}%`, height: '100%', background: t.goldGrad }}/>
                </div>
              </div>
              <div style={{ minWidth: 56, textAlign: 'right' }}>
                <div style={{
                  fontFamily: window.GOAT_FONTS.num, fontSize: 16, fontWeight: 700, color: t.text, fontVariantNumeric: 'tabular-nums',
                }}>{r.wr}<span style={{ color: t.textMid, fontSize: 12 }}>%</span></div>
                <div style={{ fontSize: 10, color: t.textDim }}>{r.n} matches</div>
              </div>
            </div>
          ))}
        </Panel>

        {/* Records */}
        <SectionLabel t={t} style={{ marginTop: 18 }}>Records</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6, marginBottom: 30 }}>
          <RecordTile t={t} icon="flame" label="Longest streak" value="11"/>
          <RecordTile t={t} icon="sparkle" label="Highest score" value="92"/>
          <RecordTile t={t} icon="users" label="Friend matches" value="58"/>
          <RecordTile t={t} icon="crown" label="MVPs" value="34"/>
        </div>
      </div>
    </div>
  );
}

function KVrow({ t, k, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontSize: 12, color: t.textMid }}>{k}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: t.text, fontFamily: window.GOAT_FONTS.num, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
    </div>
  );
}

function RecordTile({ t, icon, label, value }) {
  return (
    <div style={{
      padding: 14, borderRadius: 14,
      background: t.bgElev1, border: `0.5px solid ${t.line}`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        background: 'rgba(217,168,71,0.14)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={16} color={t.gold1}/>
      </div>
      <div>
        <div style={{ fontSize: 10, color: t.textMid, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
        <div style={{ fontFamily: window.GOAT_FONTS.num, fontSize: 18, fontWeight: 700, color: t.text, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN: SETTINGS
// ─────────────────────────────────────────────────────────────
function SettingsScreen({ t, nav, tweaks, setTweak }) {
  return (
    <div style={{ width: '100%', height: '100%', background: t.bg, color: t.text, position: 'relative', overflow: 'hidden' }}>
      <MenuBackdrop t={t}/>
      <ScreenTopBar t={t} back={() => nav('menu')} title="Settings"/>

      <div style={{ position: 'absolute', top: 124, left: 0, right: 0, bottom: 0, padding: '0 20px', overflow: 'auto' }}>
        {/* Appearance */}
        <SectionLabel t={t}>Appearance</SectionLabel>
        <Panel t={t} padding={0} style={{ marginTop: 6 }}>
          <Row t={t} label="Theme" right={
            <SegToggle t={t} value={tweaks.theme} onChange={v => setTweak('theme', v)}
              options={[{v:'light',l:'Light'},{v:'dark',l:'Dark'}]}/>
          }/>
          <Row t={t} label="Card back" right={
            <SegToggle t={t} value={tweaks.cardBack} onChange={v => setTweak('cardBack', v)}
              options={[{v:'navy',l:'Navy'},{v:'goat',l:'Goat'}]}/>
          }/>
          <Row t={t} label="Table felt" right={
            <SegToggle t={t} value={tweaks.feltVariant || 'classic'} onChange={v => setTweak('feltVariant', v)}
              options={[{v:'classic',l:'Classic'},{v:'noir',l:'Noir'}]}/>
          } last/>
        </Panel>

        {/* Game */}
        <SectionLabel t={t} style={{ marginTop: 20 }}>Game</SectionLabel>
        <Panel t={t} padding={0} style={{ marginTop: 6 }}>
          <Row t={t} label="Auto-play forced cards" right={<Toggle checked={true} onChange={() => {}} t={t}/>}/>
          <Row t={t} label="Show legal cards hint" right={<Toggle checked={true} onChange={() => {}} t={t}/>}/>
          <Row t={t} label="Confirm before playing" right={<Toggle checked={false} onChange={() => {}} t={t}/>}/>
          <Row t={t} label="Sort hand by suit" right={<Toggle checked={true} onChange={() => {}} t={t}/>} last/>
        </Panel>

        {/* Sound */}
        <SectionLabel t={t} style={{ marginTop: 20 }}>Sound & Haptics</SectionLabel>
        <Panel t={t} padding={0} style={{ marginTop: 6 }}>
          <Row t={t} label="Master volume" right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="volume" size={14} color={t.textMid}/>
              <SliderTrack t={t} value={68}/>
            </div>
          }/>
          <Row t={t} label="Music" right={<Toggle checked={true} onChange={() => {}} t={t}/>}/>
          <Row t={t} label="Sound effects" right={<Toggle checked={true} onChange={() => {}} t={t}/>}/>
          <Row t={t} label="Haptic feedback" right={<Toggle checked={true} onChange={() => {}} t={t}/>} last/>
        </Panel>

        {/* Language */}
        <SectionLabel t={t} style={{ marginTop: 20 }}>Language</SectionLabel>
        <Panel t={t} padding={0} style={{ marginTop: 6 }}>
          <Row t={t} label="App language" right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: t.textMid, fontSize: 14 }}>
              English <Icon name="arrow-right" size={12} color={t.textDim}/>
            </div>
          } last/>
        </Panel>

        {/* About */}
        <SectionLabel t={t} style={{ marginTop: 20 }}>About</SectionLabel>
        <Panel t={t} padding={0} style={{ marginTop: 6 }}>
          <Row t={t} label="Rules of Goat" right={<Icon name="arrow-right" size={14} color={t.textDim}/>}/>
          <Row t={t} label="Restore purchases" right={<Icon name="arrow-right" size={14} color={t.textDim}/>}/>
          <Row t={t} label="Privacy" right={<Icon name="arrow-right" size={14} color={t.textDim}/>}/>
          <Row t={t} label="Version" right={<span style={{ fontSize: 14, color: t.textDim }}>1.0.0</span>} last/>
        </Panel>

        <div style={{ height: 40 }}/>
      </div>
    </div>
  );
}

function SegToggle({ t, value, onChange, options }) {
  return (
    <div style={{
      display: 'inline-flex', padding: 3,
      background: t.bgElev3, borderRadius: 999,
    }}>
      {options.map(o => (
        <button key={o.v} onClick={() => onChange(o.v)} style={{
          padding: '5px 12px', borderRadius: 999,
          background: value === o.v ? t.goldGrad : 'transparent',
          color: value === o.v ? '#1A1208' : t.textMid,
          border: 'none', cursor: 'pointer',
          fontSize: 12, fontWeight: 600,
          fontFamily: window.GOAT_FONTS.ui,
        }}>{o.l}</button>
      ))}
    </div>
  );
}

function SliderTrack({ t, value }) {
  return (
    <div style={{ width: 90, position: 'relative', height: 18, display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '100%', height: 4, borderRadius: 999, background: t.bgElev3 }}>
        <div style={{ width: `${value}%`, height: '100%', borderRadius: 999, background: t.goldGrad }}/>
      </div>
      <div style={{
        position: 'absolute', left: `calc(${value}% - 9px)`,
        width: 18, height: 18, borderRadius: 999,
        background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }}/>
    </div>
  );
}

Object.assign(window, {
  ProfileScreen, StatsScreen, SettingsScreen,
  // helpers reused by desktop screens
  StatTile, AchTile, MatchRow, KVrow, RecordTile, SegToggle, SliderTrack,
});
