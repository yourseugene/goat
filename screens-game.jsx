// Gameplay table, deal animation, end-match results.

const { useState: useStateG, useEffect: useEffectG, useRef: useRefG, useMemo: useMemoG } = React;

// ─────────────────────────────────────────────────────────────
// SCREEN: GAMEPLAY TABLE
// ─────────────────────────────────────────────────────────────
function TableScreen({ t, nav, tweaks, hand, setHand, players, gameState, setGameState }) {
  const trumpSuit = gameState.trump;
  const trick = gameState.trick;     // [{seat:'N'|'E'|'S'|'W', card:{suit,rank}}, ...]
  const [selectedIdx, setSelectedIdx] = useStateG(-1);
  const [turn, setTurn] = useStateG(gameState.turn || 'S');
  const [timeLeft, setTimeLeft] = useStateG(28);

  useEffectG(() => {
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
    // Cycle turn (just for vibe)
    setTimeout(() => setTurn('W'), 600);
  };

  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden', position: 'relative',
      background: t.feltRadial, color: t.text,
      fontFamily: window.GOAT_FONTS.ui,
    }}>
      {/* Felt texture overlay */}
      <FeltTexture t={t}/>

      {/* TOP HUD */}
      <TableTopHUD t={t} nav={nav} gameState={gameState} trumpVariant={tweaks.trumpVariant}/>

      {/* Opponent NORTH (partner) */}
      <div style={{ position: 'absolute', top: 110, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <SeatBadge t={t} name={players.N.name} cards={players.N.cards} team="N" thinking={turn==='N'}/>
        <div style={{ position: 'relative', height: 30, marginTop: 4 }}>
          <MiniHandStack count={players.N.cards} dir="h" w={28} t={t}/>
        </div>
      </div>

      {/* Opponent WEST */}
      <div style={{ position: 'absolute', top: 240, left: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <SeatBadge t={t} name={players.W.name} cards={players.W.cards} team="W" thinking={turn==='W'} compact/>
        <MiniHandStack count={players.W.cards} dir="v" w={24} t={t}/>
      </div>

      {/* Opponent EAST */}
      <div style={{ position: 'absolute', top: 240, right: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <SeatBadge t={t} name={players.E.name} cards={players.E.cards} team="E" thinking={turn==='E'} compact/>
        <MiniHandStack count={players.E.cards} dir="v" w={24} t={t}/>
      </div>

      {/* CENTER TRICK */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 320, display: 'flex', justifyContent: 'center' }}>
        <TrickStack t={t} trick={trick} trumpSuit={trumpSuit}/>
      </div>

      {/* Turn indicator + timer */}
      {turn === 'S' && (
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 470,
          display: 'flex', justifyContent: 'center', pointerEvents: 'none',
        }}>
          <TurnPill t={t} timeLeft={timeLeft} totalTime={30}/>
        </div>
      )}

      {/* YOUR HAND */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 76,
        display: 'flex', justifyContent: 'center',
      }}>
        <CardFan cards={hand} w={64} theme={t}
          selected={selectedIdx}
          onSelect={(i) => {
            if (selectedIdx === i) playCard(i);
            else setSelectedIdx(i);
          }}
          playable={() => turn === 'S'}/>
      </div>

      {/* Bottom action bar */}
      <div style={{
        position: 'absolute', left: 16, right: 16, bottom: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <GlassChip t={t} onClick={() => {}}>
          <Icon name="chat" size={14} color="#fff"/>
          <span style={{ marginLeft: 6 }}>Quick chat</span>
        </GlassChip>
        <div style={{ display: 'flex', gap: 8 }}>
          {['👍','🔥','🎯','😅'].map(e => (
            <button key={e} style={{
              width: 38, height: 38, borderRadius: 999,
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '0.5px solid rgba(255,255,255,0.14)',
              cursor: 'pointer', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{e}</button>
          ))}
        </div>
      </div>

      {/* Floating "GO TO RESULTS" button so user can preview results */}
      <button onClick={() => nav('results')} style={{
        position: 'absolute', top: 110, right: 16,
        background: 'rgba(0,0,0,0.4)', color: t.gold1,
        border: `0.5px solid ${t.gold2}`, borderRadius: 999,
        padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
        opacity: 0,
      }}>End round</button>
    </div>
  );
}

function FeltTexture({ t }) {
  return (
    <>
      {/* table inset shadow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        boxShadow: 'inset 0 0 120px rgba(0,0,0,0.6), inset 0 -40px 80px rgba(0,0,0,0.3)',
      }}/>
      {/* gold inner border (table edge) */}
      <div style={{
        position: 'absolute', inset: 12, borderRadius: 36, pointerEvents: 'none',
        border: `0.75px solid ${t.feltLine}`,
      }}/>
      {/* table fabric noise */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18, mixBlendMode: 'overlay' }}>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/>
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)"/>
      </svg>
    </>
  );
}

function TableTopHUD({ t, nav, gameState, trumpVariant }) {
  return (
    <div style={{
      position: 'absolute', top: 50, left: 0, right: 0, padding: '0 12px',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', zIndex: 5,
    }}>
      {/* Trump variant */}
      <TrumpIndicator t={t} suit={gameState.trump} variant={trumpVariant} deckCount={gameState.deckCount}/>

      {/* Center: round info */}
      <div style={{
        background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: `0.5px solid ${t.feltLine}`,
        padding: '8px 14px', borderRadius: 16, marginTop: 4,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>Round {gameState.round}</div>
        <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>To <b style={{ color: t.gold1 }}>12</b> points</div>
      </div>

      {/* Score panel */}
      <ScorePanel t={t} score={gameState.score} onMenu={() => nav('menu')}/>
    </div>
  );
}

function TrumpIndicator({ t, suit, variant = 'card', deckCount }) {
  const glyph = window.SUIT_GLYPH[suit];
  const isRed = suit === 'hearts' || suit === 'diamonds';
  const suitColor = isRed ? '#FF7A78' : '#fff';

  if (variant === 'card') {
    return (
      <div style={{ position: 'relative', marginTop: 4 }}>
        <div style={{ transform: 'rotate(-12deg)' }}>
          <PlayingCard suit={suit} rank="A" w={50} trump theme={t}/>
        </div>
        {/* deck back stack peeking */}
        <div style={{
          position: 'absolute', left: 26, top: -2,
          transform: 'rotate(8deg)', zIndex: -1, filter: 'brightness(0.85)',
        }}>
          <PlayingCard suit="spades" rank="A" w={50} faceDown theme={t}/>
        </div>
        <div style={{
          marginTop: 8,
          background: 'rgba(0,0,0,0.5)',
          padding: '3px 8px', borderRadius: 999, fontSize: 10, color: '#fff',
          fontWeight: 600, letterSpacing: 0.5, textAlign: 'center',
          border: `0.5px solid ${t.feltLine}`,
        }}>{deckCount} left</div>
      </div>
    );
  }
  if (variant === 'banner') {
    return (
      <div style={{
        background: t.goldGrad,
        padding: '8px 12px 8px 10px', borderRadius: 14,
        display: 'flex', alignItems: 'center', gap: 8,
        marginTop: 4, color: '#1A1208',
        boxShadow: '0 6px 18px rgba(217,168,71,0.4)',
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, color: isRed ? '#C73330' : '#1A1208',
        }}>{glyph}</div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, opacity: 0.7 }}>TRUMP</div>
          <div style={{ fontSize: 14, fontWeight: 700, textTransform: 'capitalize' }}>{suit}</div>
        </div>
      </div>
    );
  }
  if (variant === 'pill') {
    return (
      <div style={{
        marginTop: 4,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        border: `0.75px solid ${t.gold2}`, borderRadius: 999,
        padding: '6px 12px 6px 6px',
        display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: t.goldGlow,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 999,
          background: t.goldGrad,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: isRed ? '#C73330' : '#1A1208',
        }}>{glyph}</div>
        <div>
          <div style={{ fontSize: 9, color: t.gold1, fontWeight: 700, letterSpacing: 1 }}>TRUMP</div>
          <div style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>·  {deckCount}</div>
        </div>
      </div>
    );
  }
  return null;
}

function ScorePanel({ t, score, onMenu }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.42)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      border: `0.5px solid ${t.feltLine}`, borderRadius: 16,
      padding: 10, marginTop: 4, minWidth: 92,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{
          fontSize: 10, color: 'rgba(255,255,255,0.5)',
          letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 600,
        }}>Score</div>
        <button onClick={onMenu} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <Icon name="dots" size={14} color="rgba(255,255,255,0.6)"/>
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <ScoreRow t={t} color={t.team1} label="You" value={score.us} round={score.usRound}/>
        <ScoreRow t={t} color={t.team2} label="Them" value={score.them} round={score.themRound}/>
      </div>
    </div>
  );
}

function ScoreRow({ t, color, label, value, round }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 8, height: 8, borderRadius: 999, background: color }}/>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', flex: 1 }}>{label}</div>
      <div style={{
        fontSize: 17, fontWeight: 700, color: '#fff',
        fontFamily: window.GOAT_FONTS.num, letterSpacing: -0.3,
        fontVariantNumeric: 'tabular-nums',
      }}>{value}</div>
      <div style={{ fontSize: 10, color: t.gold1, fontWeight: 600, width: 24, textAlign: 'right' }}>+{round}</div>
    </div>
  );
}

function SeatBadge({ t, name, cards, team, thinking, compact }) {
  const teamColor = (team === 'N') ? t.team1 : t.team2;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: compact ? '4px 8px 4px 4px' : '4px 10px 4px 4px', borderRadius: 999,
      background: thinking ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.42)',
      border: `0.5px solid ${thinking ? t.gold2 : t.feltLine}`,
      boxShadow: thinking ? t.goldGlow : 'none',
      transition: 'all .3s ease',
    }}>
      <Avatar name={name} size={compact ? 28 : 32} t={t} ring={thinking ? t.gold2 : teamColor}/>
      <div>
        <div style={{ fontSize: compact ? 11 : 12, color: '#fff', fontWeight: 600, lineHeight: 1.1 }}>{name}</div>
        <div style={{ fontSize: 9, color: thinking ? t.gold1 : 'rgba(255,255,255,0.6)', letterSpacing: 0.4 }}>
          {thinking ? 'Thinking…' : `${cards} cards`}
        </div>
      </div>
    </div>
  );
}

function MiniHandStack({ count, dir = 'h', w = 28, t }) {
  // dir 'h' lays cards horizontally, dir 'v' stacks vertically
  const isH = dir === 'h';
  const step = w * 0.34;
  const total = Math.min(count, 9);
  return (
    <div style={{ position: 'relative',
      width: isH ? step * (total - 1) + w : w * 1.42,
      height: isH ? w * 1.42 : step * (total - 1) + w * 1.42,
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: isH ? i * step : 0,
          top: isH ? 0 : i * step,
        }}>
          <PlayingCard suit="spades" rank="A" w={w} faceDown theme={t}/>
        </div>
      ))}
    </div>
  );
}

function TrickStack({ t, trick, trumpSuit }) {
  // arrange 4 cards in cross
  const positions = { N: { x: 0, y: -52, r: 0 }, E: { x: 56, y: 0, r: 12 }, S: { x: 0, y: 52, r: 0 }, W: { x: -56, y: 0, r: -12 } };
  return (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      {/* faint center crest */}
      <svg viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
        <circle cx="100" cy="100" r="90" stroke={t.gold2} strokeWidth="0.4" fill="none" strokeDasharray="3 3"/>
        <circle cx="100" cy="100" r="60" stroke={t.gold2} strokeWidth="0.3" fill="none"/>
        <text x="100" y="106" textAnchor="middle" style={{ fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic', fontSize: 30, fontWeight: 700, fill: t.gold2 }}>G</text>
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
            <PlayingCard suit={card.suit} rank={card.rank} w={64}
              trump={card.suit === trumpSuit} theme={t} played/>
          </div>
        );
      })}
    </div>
  );
}

function TurnPill({ t, timeLeft, totalTime }) {
  const pct = timeLeft / totalTime;
  return (
    <div style={{
      background: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      border: `0.5px solid ${t.gold2}`, borderRadius: 999,
      padding: '6px 14px 6px 6px',
      display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: t.goldGlow,
    }}>
      <div style={{ position: 'relative', width: 28, height: 28 }}>
        <svg width="28" height="28" viewBox="0 0 28 28" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="14" cy="14" r="11" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" fill="none"/>
          <circle cx="14" cy="14" r="11" stroke={t.gold1} strokeWidth="2.5" fill="none"
            strokeDasharray={2 * Math.PI * 11}
            strokeDashoffset={2 * Math.PI * 11 * (1 - pct)}
            style={{ transition: 'stroke-dashoffset 1s linear' }}/>
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: t.gold1, fontFamily: window.GOAT_FONTS.num,
        }}>{timeLeft}</div>
      </div>
      <div style={{ fontSize: 12, color: '#fff', fontWeight: 600, letterSpacing: 0.5 }}>YOUR TURN</div>
    </div>
  );
}

function GlassChip({ children, onClick, t }) {
  return (
    <button onClick={onClick} style={{
      height: 38, padding: '0 14px', borderRadius: 999,
      background: 'rgba(255,255,255,0.10)',
      backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      border: '0.5px solid rgba(255,255,255,0.14)',
      color: '#fff', fontSize: 13, fontWeight: 500,
      display: 'inline-flex', alignItems: 'center', cursor: 'pointer',
    }}>{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────
// DEAL ANIMATION (preview)
// ─────────────────────────────────────────────────────────────
function DealScreen({ t, nav }) {
  const [dealt, setDealt] = useStateG(0);

  useEffectG(() => {
    const total = 36;
    let i = 0;
    // Deal in groups of 3, one seat at a time (canonical Goat deal).
    const iv = setInterval(() => {
      i += 3;
      setDealt(Math.min(total, i));
      if (i >= total) {
        clearInterval(iv);
        setTimeout(() => nav('table'), 700);
      }
    }, 340);
    return () => clearInterval(iv);
  }, []);

  // 12 deals: 3 cards per visit, going around 4 seats × 3 rounds
  // Order index i (0..35) → seat = floor(i/3) % 4 ; hand position = (slot within group) + 3 × group-round
  const seats = [
    { id: 'N', x: 0, y: -260, rot: 180 },
    { id: 'E', x: 140, y: 0, rot: 90 },
    { id: 'S', x: 0, y: 260, rot: 0 },
    { id: 'W', x: -140, y: 0, rot: -90 },
  ];

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: t.feltRadial, overflow: 'hidden' }}>
      <FeltTexture t={t}/>

      <TableTopHUD t={t} nav={nav}
        gameState={{ round: 1, trump: 'hearts', deckCount: 36, score: { us: 0, them: 0, usRound: 0, themRound: 0 } }}
        trumpVariant="card"/>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 1, height: 1 }}>
          {/* deck stack */}
          <div style={{ position: 'absolute', left: -34, top: -48, opacity: dealt < 36 ? 1 : 0.3, transition: 'opacity .3s' }}>
            {Array.from({length: 5}).map((_, i) => (
              <div key={i} style={{ position: 'absolute', top: -i*0.5, left: i*0.5 }}>
                <PlayingCard suit="spades" rank="A" w={68} faceDown theme={t}/>
              </div>
            ))}
          </div>
          {/* Flying cards — order: 3 cards N, 3 E, 3 S, 3 W, repeat 3 rounds */}
          {Array.from({ length: 36 }).map((_, i) => {
            const group = Math.floor(i / 3);          // 0..11 (which visit)
            const seat = seats[group % 4];
            const round = Math.floor(group / 4);      // 0..2 (deal round)
            const slot = i % 3;                       // 0..2 within this batch
            const handPos = round * 3 + slot;         // 0..8 in hand
            const dx = seat.x + (handPos - 4) * 8;
            const dy = seat.y + (handPos - 4) * 1;
            const isDealt = dealt > i;
            return (
              <div key={i} style={{
                position: 'absolute', left: 0, top: 0,
                transform: isDealt
                  ? `translate(${dx}px, ${dy}px) rotate(${seat.rot}deg) translateZ(0)`
                  : `translate(0, 0) rotate(0deg)`,
                transition: 'transform .55s cubic-bezier(.5,.1,.3,1)',
                transitionDelay: isDealt ? `${slot * 70}ms` : '0ms',
                zIndex: isDealt ? 100 - i : i,
              }}>
                <PlayingCard suit="spades" rank="A" w={isDealt ? 36 : 68} faceDown theme={t}/>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 80, textAlign: 'center', zIndex: 50,
      }}>
        <div style={{
          fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic',
          fontSize: 36, color: t.gold1, letterSpacing: 0.5,
          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}>Dealing</div>
        <div style={{ marginTop: 6, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
          {dealt}/36 cards · 3 at a time
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// END MATCH RESULTS
// ─────────────────────────────────────────────────────────────
function ResultsScreen({ t, nav, tweaks }) {
  const variant = tweaks.resultsVariant || 'celebration';
  const won = tweaks.resultsOutcome !== 'defeat';

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: won ? t.feltRadial : `radial-gradient(120% 80% at 50% 40%, #1a0e0e 0%, ${t.bg} 70%)`,
    }}>
      <FeltTexture t={t}/>
      <PhoneStatusBar t={t} overlay/>

      {/* Confetti / rays */}
      {won && <ResultsRays t={t}/>}

      {variant === 'celebration' && <ResultsCelebration t={t} nav={nav} won={won}/>}
      {variant === 'card' && <ResultsCardOverlay t={t} nav={nav} won={won}/>}
    </div>
  );
}

function ResultsRays({ t }) {
  return (
    <svg viewBox="-200 -200 400 400" preserveAspectRatio="xMidYMid slice" style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      opacity: 0.5, mixBlendMode: 'screen',
      animation: 'goatRays 20s linear infinite',
    }}>
      <defs>
        <radialGradient id="rayGrad">
          <stop offset="0" stopColor={t.gold1} stopOpacity="0.4"/>
          <stop offset="1" stopColor={t.gold1} stopOpacity="0"/>
        </radialGradient>
      </defs>
      {Array.from({length: 24}).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <polygon key={i} fill="url(#rayGrad)"
            points={`0,0 ${Math.cos(a-0.04)*400},${Math.sin(a-0.04)*400} ${Math.cos(a+0.04)*400},${Math.sin(a+0.04)*400}`}
            opacity={(i%2) ? 0.5 : 1}/>
        );
      })}
    </svg>
  );
}

function ResultsCelebration({ t, nav, won }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '70px 22px 24px' }}>
      {/* Trophy or skull */}
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <div style={{ display: 'inline-block', position: 'relative' }}>
          <div style={{
            width: 90, height: 90, borderRadius: 999,
            background: won ? t.goldGrad : 'rgba(240,82,79,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto', boxShadow: won ? `0 0 40px rgba(217,168,71,0.5)` : 'none',
            border: won ? 'none' : `1px solid rgba(240,82,79,0.4)`,
          }}>
            <Icon name={won ? 'trophy' : 'shield'} size={42} color={won ? '#1A1208' : t.danger}/>
          </div>
        </div>
        <div style={{ marginTop: 16, fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 5, fontWeight: 600, textTransform: 'uppercase' }}>
          {won ? 'Match complete' : 'Match complete'}
        </div>
        <div style={{
          fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic',
          fontSize: 72, lineHeight: 1, fontWeight: 700, color: '#fff',
          background: won ? t.goldGrad : 'linear-gradient(180deg, #FF8B8B, #F0524F)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.4))',
          marginTop: 4, letterSpacing: -1,
        }}>{won ? 'Victory' : 'Defeat'}</div>
      </div>

      {/* Final score */}
      <div style={{
        marginTop: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <ResultTeam t={t} name="Your team" win={won} score={12} sub="You · Kevin" color={t.team1}/>
        <div style={{
          fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic',
          fontSize: 32, color: 'rgba(255,255,255,0.5)', padding: '0 6px',
        }}>vs</div>
        <ResultTeam t={t} name="Opponents" win={!won} score={9} sub="Harry · Marv" color={t.team2}/>
      </div>

      {/* MVP */}
      <Panel t={t} padding={14} style={{
        marginTop: 18, background: 'rgba(0,0,0,0.42)', border: `0.5px solid ${t.feltLine}`,
        backdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Avatar name="Kevin" size={48} t={t} ring={t.gold2} status="MVP"/>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Kevin Park</div>
            <Icon name="sparkle" size={12} color={t.gold1}/>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
            Took 4 tricks · 78 trick points · perfect barrel ride
          </div>
        </div>
        <div style={{
          fontFamily: window.GOAT_FONTS.num, fontSize: 24, fontWeight: 700,
          color: t.gold1, fontVariantNumeric: 'tabular-nums',
        }}>+78</div>
      </Panel>

      {/* Round breakdown */}
      <div style={{ marginTop: 12, marginBottom: 'auto' }}>
        <div style={{
          fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, textTransform: 'uppercase',
          fontWeight: 600, marginBottom: 6,
        }}>Rounds</div>
        <div style={{
          background: 'rgba(0,0,0,0.32)', borderRadius: 14, padding: 8,
          border: `0.5px solid ${t.feltLine}`,
          display: 'flex', gap: 6,
        }}>
          {[
            { us: 2, them: 0 }, { us: 2, them: 0 }, { us: 0, them: 2 },
            { us: 2, them: 0 }, { us: 0, them: 3 }, { us: 2, them: 0 },
            { us: 2, them: 4 }, { us: 2, them: 0 },
          ].map((r, i) => (
            <RoundChip key={i} t={t} idx={i+1} us={r.us} them={r.them}/>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        <GButton t={t} variant="secondary" size="lg" fullWidth onClick={() => nav('menu')}>
          Menu
        </GButton>
        <GButton t={t} variant="primary" size="lg" fullWidth onClick={() => nav('deal')}
          icon={<Icon name="play" size={16} color="#1A1208"/>}>
          Rematch
        </GButton>
      </div>
    </div>
  );
}

function ResultsCardOverlay({ t, nav, won }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '60px 22px 24px' }}>
      {/* big winning card flourish */}
      <div style={{ margin: '0 auto', marginTop: 30 }}>
        <div style={{ animation: 'goatBob 4s ease-in-out infinite alternate' }}>
          <PlayingCard suit="spades" rank="7" w={150} trump theme={t}/>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 5, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase' }}>
          Final
        </div>
        <div style={{
          fontFamily: window.GOAT_FONTS.display, fontStyle: 'italic', fontSize: 48, fontWeight: 700,
          background: won ? t.goldGrad : 'linear-gradient(180deg, #FF8B8B, #F0524F)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginTop: 2,
        }}>{won ? 'You took the goat' : 'Goat slipped away'}</div>
        <div style={{ marginTop: 12, fontFamily: window.GOAT_FONTS.num, fontSize: 56, fontWeight: 700, color: '#fff', letterSpacing: -2, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          12 <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 36 }}>—</span> 9
        </div>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
        <GButton t={t} variant="secondary" size="lg" fullWidth onClick={() => nav('menu')}>
          Menu
        </GButton>
        <GButton t={t} variant="primary" size="lg" fullWidth onClick={() => nav('deal')}>
          Rematch
        </GButton>
      </div>
    </div>
  );
}

function ResultTeam({ t, name, win, score, sub, color }) {
  return (
    <div style={{
      flex: 1, padding: 14, borderRadius: 18,
      background: win ? 'rgba(217,168,71,0.16)' : 'rgba(0,0,0,0.32)',
      border: `0.5px solid ${win ? t.gold2 : t.feltLine}`,
      boxShadow: win ? t.goldGlow : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: 999, background: color }}/>
        <div style={{ fontSize: 10, letterSpacing: 1.2, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', fontWeight: 600 }}>{name}</div>
      </div>
      <div style={{
        fontFamily: window.GOAT_FONTS.num, fontSize: 42, fontWeight: 700,
        color: win ? t.gold1 : '#fff', lineHeight: 1, letterSpacing: -1,
        fontVariantNumeric: 'tabular-nums',
      }}>{score}</div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function RoundChip({ t, idx, us, them }) {
  const won = us > them;
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>R{idx}</div>
      <div style={{
        height: 32, borderRadius: 8, marginTop: 4,
        background: won ? 'rgba(91,139,255,0.22)' : 'rgba(255,139,91,0.18)',
        border: `0.5px solid ${won ? t.team1 : t.team2}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: won ? t.team1 : t.team2, fontWeight: 700, fontSize: 12,
        fontFamily: window.GOAT_FONTS.num, fontVariantNumeric: 'tabular-nums',
      }}>+{won ? us : them}</div>
    </div>
  );
}

Object.assign(window, {
  TableScreen, DealScreen, ResultsScreen,
  // helpers reused by desktop screens
  TrumpIndicator, ScorePanel, SeatBadge, MiniHandStack, TurnPill,
  FeltTexture, ResultsRays, ResultTeam, RoundChip,
});
