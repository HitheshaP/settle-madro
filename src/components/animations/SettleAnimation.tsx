import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CharacterAvatar from '../characters/CharacterAvatar'
import { getCharacter } from '../characters/characterData'

interface SettleAnimationProps {
  fromCharacterId: string
  toCharacterId: string
  amount: number
  onComplete: () => void
}

type Scene = 'upi' | 'purse'

// Stage geometry (px). Avatars sit on the bottom row; props (phones, purses) float above.
const STAGE_W = 320
const STAGE_H = 190
const AVATAR = 72
const AVATAR_TOP = STAGE_H - AVATAR - 6
const RECEIVER_LEFT = STAGE_W - AVATAR

/** Runs `step` through 0..n on the given schedule (ms from start), then calls onDone. */
function usePhases(schedule: number[], doneAt: number, onDone: () => void) {
  const [phase, setPhase] = useState(0)
  const onDoneRef = useRef(onDone)
  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    const timers = schedule.map((at, index) => setTimeout(() => setPhase(index + 1), at))
    timers.push(setTimeout(() => onDoneRef.current(), doneAt))
    return () => timers.forEach(clearTimeout)
    // The schedule is fixed per scene; run it once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return phase
}

export default function SettleAnimation({ fromCharacterId, toCharacterId, amount, onComplete }: SettleAnimationProps) {
  // A different little story each time someone settles up.
  const [scene] = useState<Scene>(() => (Math.random() < 0.5 ? 'upi' : 'purse'))
  const amountLabel = `₹${Math.round(amount).toLocaleString('en-IN')}`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/60 px-4 backdrop-blur-sm"
    >
      {scene === 'upi' ? (
        <UpiScene from={fromCharacterId} to={toCharacterId} amountLabel={amountLabel} onComplete={onComplete} />
      ) : (
        <PurseScene from={fromCharacterId} to={toCharacterId} amountLabel={amountLabel} onComplete={onComplete} />
      )}
    </motion.div>
  )
}

interface SceneProps {
  from: string
  to: string
  amountLabel: string
  onComplete: () => void
}

function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="relative max-w-full" style={{ width: STAGE_W, height: STAGE_H }}>
      {children}
    </div>
  )
}

function Caption({ children }: { children: ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="h-5 text-center text-sm font-semibold text-white/90"
    >
      {children}
    </motion.p>
  )
}

function SettledStamp() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.7, rotate: -14 }}
      animate={{ opacity: 1, scale: 1, rotate: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 16 }}
      className="rounded-xl border-2 border-emerald-400/70 bg-emerald-500/10 px-5 py-2 text-sm font-extrabold tracking-widest text-emerald-400"
    >
      SETTLED ✓
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Scene 1: both pull out phones, the payer scans the receiver's QR, payment completes
// ---------------------------------------------------------------------------

const PHONE_W = 52
const PHONE_H = 92
const PHONE_TOP = 18

function UpiScene({ from, to, amountLabel, onComplete }: SceneProps) {
  // 1: phones out · 2: scanning · 3: completed
  const phase = usePhases([700, 1350, 2500], 4000, onComplete)

  const caption = phase < 2 ? 'Phones out…' : phase < 3 ? 'Scanning QR…' : `${amountLabel} paid`

  return (
    <>
      <Stage>
        <motion.div
          className="absolute"
          style={{ left: 0, top: AVATAR_TOP }}
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        >
          <CharacterAvatar characterId={from} size={AVATAR} />
        </motion.div>
        <motion.div
          className="absolute"
          style={{ left: RECEIVER_LEFT, top: AVATAR_TOP }}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        >
          <CharacterAvatar characterId={to} size={AVATAR} />
        </motion.div>

        {/* payer's phone: scanner, then the Completed screen */}
        <Phone show={phase >= 1} left={AVATAR + 6} tilt={8}>
          {phase < 3 ? <ScannerScreen scanning={phase >= 2} /> : <CompletedScreen amountLabel={amountLabel} />}
        </Phone>

        {/* receiver's phone: their QR code */}
        <Phone show={phase >= 1} left={RECEIVER_LEFT - PHONE_W - 6} tilt={-8}>
          <div className="flex h-full flex-col items-center justify-center gap-1 bg-white">
            <QrCode />
            <span className="text-[6px] font-bold text-neutral-500">SCAN TO PAY</span>
          </div>
        </Phone>

        {/* scan beam between the phones */}
        <AnimatePresence>
          {phase === 2 && (
            <motion.div
              className="absolute h-[3px] origin-left rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]"
              style={{ left: AVATAR + 6 + PHONE_W, top: PHONE_TOP + PHONE_H / 2, width: RECEIVER_LEFT - 12 - 2 * PHONE_W - AVATAR }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0.6, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
            />
          )}
        </AnimatePresence>

        {/* the receiver's phone pings when the money lands */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.span
              className="absolute rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-extrabold text-white shadow-lg"
              style={{ left: RECEIVER_LEFT - PHONE_W - 4, top: PHONE_TOP - 16 }}
              initial={{ opacity: 0, y: 8, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18, delay: 0.35 }}
            >
              +{amountLabel}
            </motion.span>
          )}
        </AnimatePresence>
      </Stage>
      <AnimatePresence mode="wait">
        <Caption key={caption}>{caption}</Caption>
      </AnimatePresence>
    </>
  )
}

function Phone({ show, left, tilt, children }: { show: boolean; left: number; tilt: number; children: ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute overflow-hidden rounded-[10px] border-[3px] border-neutral-900 bg-neutral-900 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          style={{ left, top: PHONE_TOP, width: PHONE_W, height: PHONE_H }}
          initial={{ y: 60, opacity: 0, rotate: 0, scale: 0.6 }}
          animate={{ y: 0, opacity: 1, rotate: tilt, scale: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className="mx-auto mb-0.5 mt-0.5 h-1 w-3 rounded-full bg-neutral-700" />
          <div className="h-[calc(100%-8px)] overflow-hidden rounded-[6px]">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ScannerScreen({ scanning }: { scanning: boolean }) {
  return (
    <div className="relative flex h-full items-center justify-center bg-neutral-800">
      <div className="relative h-8 w-8">
        {/* viewfinder corners */}
        {['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'left-0 bottom-0 border-l-2 border-b-2', 'right-0 bottom-0 border-r-2 border-b-2'].map(
          (pos) => (
            <span key={pos} className={`absolute h-2.5 w-2.5 border-white ${pos}`} />
          ),
        )}
        {scanning && (
          <motion.span
            className="absolute inset-x-0.5 h-[2px] rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"
            animate={{ top: ['8%', '88%', '8%'] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>
      <span className="absolute bottom-1.5 text-[6px] font-bold text-white/70">{scanning ? 'SCANNING' : 'SCAN QR'}</span>
    </div>
  )
}

function CompletedScreen({ amountLabel }: { amountLabel: string }) {
  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center gap-1 bg-emerald-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="h-7 w-7"
        initial={{ scale: 0.3 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 14 }}
      >
        <circle cx="12" cy="12" r="11" fill="#fff" />
        <motion.path
          d="M6.5 12.5 L10.5 16.5 L17.5 8.5"
          fill="none"
          stroke="#10b981"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        />
      </motion.svg>
      <span className="text-[7px] font-extrabold tracking-wide text-white">COMPLETED</span>
      <span className="text-[7px] font-bold text-white/85">{amountLabel}</span>
    </motion.div>
  )
}

// Fixed pseudo-random QR-looking pattern with the three finder squares.
const QR_SIZE = 9
const QR_CELLS = Array.from({ length: QR_SIZE * QR_SIZE }, (_, i) => {
  const x = i % QR_SIZE
  const y = Math.floor(i / QR_SIZE)
  const inFinder = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5)
  return !inFinder && (x * 7 + y * 13 + x * y) % 3 === 0 ? [x, y] : null
}).filter((cell): cell is number[] => cell !== null)

function QrCode() {
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="3" height="3" fill="#111" />
      <rect x={x + 0.5} y={y + 0.5} width="2" height="2" fill="#fff" />
      <rect x={x + 1} y={y + 1} width="1" height="1" fill="#111" />
    </g>
  )
  return (
    <svg viewBox={`-0.5 -0.5 ${QR_SIZE + 1} ${QR_SIZE + 1}`} className="h-9 w-9">
      {finder(0, 0)}
      {finder(6, 0)}
      {finder(0, 6)}
      {QR_CELLS.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#111" />
      ))}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Scene 2: payer walks over, opens their purse, the money moves into the receiver's purse
// ---------------------------------------------------------------------------

const WALK_TO = 90
const PURSE_W = 56
const PURSE_H = 48
// Held just above the head, slightly overlapping the avatar so it reads as "in hand".
const PURSE_TOP = AVATAR_TOP - PURSE_H + 10
const PAYER_PURSE_LEFT = WALK_TO + AVATAR - 22
const RECEIVER_PURSE_LEFT = RECEIVER_LEFT - PURSE_W + 22

function PurseScene({ from, to, amountLabel, onComplete }: SceneProps) {
  // 1: walked over · 2: purses open · 3: money moving · 4: money landed · 5: purses closed & kept · 6: stamp
  const phase = usePhases([1100, 1450, 1700, 2550, 2950, 3250], 4100, onComplete)

  const caption = phase < 1 ? 'On the way…' : phase < 4 ? `Handing over ${amountLabel}` : 'All square!'
  const pursesVisible = phase >= 1 && phase < 5
  const travel = RECEIVER_PURSE_LEFT - PAYER_PURSE_LEFT

  return (
    <>
      <Stage>
        {/* payer walks across with a little bounce */}
        <motion.div
          className="absolute"
          style={{ left: 0, top: AVATAR_TOP }}
          initial={{ x: 0, y: 0 }}
          animate={{ x: WALK_TO, y: [0, -8, 0, -8, 0, -8, 0] }}
          transition={{ x: { duration: 1.1, ease: 'easeInOut' }, y: { duration: 1.1, ease: 'easeInOut' } }}
        >
          <CharacterAvatar characterId={from} size={AVATAR} />
        </motion.div>
        <div className="absolute" style={{ left: RECEIVER_LEFT, top: AVATAR_TOP }}>
          <motion.div
            animate={phase === 4 ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <CharacterAvatar characterId={to} size={AVATAR} />
          </motion.div>
        </div>

        <Purse
          show={pursesVisible}
          left={PAYER_PURSE_LEFT}
          color={getCharacter(from).glow}
          open={phase >= 2 && phase < 5}
          filled={phase < 3}
        />
        <Purse
          show={pursesVisible}
          left={RECEIVER_PURSE_LEFT}
          color={getCharacter(to).glow}
          open={phase >= 2 && phase < 5}
          filled={phase >= 4}
        />

        {/* notes fly from one purse to the other */}
        {phase >= 3 &&
          phase < 5 &&
          [0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="absolute flex h-4 w-7 items-center justify-center rounded-[3px] border border-emerald-900/60 bg-emerald-400 text-[9px] font-black text-emerald-900 shadow"
              style={{ left: PAYER_PURSE_LEFT + PURSE_W / 2 - 14, top: PURSE_TOP + 8 }}
              initial={{ x: 0, y: 0, opacity: 0, rotate: -10 }}
              animate={{ x: [0, travel / 2, travel], y: [0, -40, 4], opacity: [0, 1, 1, 0], rotate: [-10, 14, 0] }}
              transition={{ duration: 0.65, delay: index * 0.2, ease: 'easeInOut' }}
            >
              ₹
            </motion.div>
          ))}
      </Stage>
      <AnimatePresence mode="wait">
        <Caption key={caption}>{caption}</Caption>
      </AnimatePresence>
      <div className="h-10">{phase >= 6 && <SettledStamp />}</div>
    </>
  )
}

function Purse({
  show,
  left,
  color,
  open,
  filled,
}: {
  show: boolean
  left: number
  color: string
  open: boolean
  filled: boolean
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.svg
          viewBox="0 0 56 48"
          className="absolute overflow-visible drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)]"
          style={{ left, top: PURSE_TOP, width: PURSE_W, height: PURSE_H }}
          initial={{ scale: 0, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          // Tucked back away towards its owner once done.
          exit={{ scale: 0, y: 36, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 20 }}
        >
          {/* handle */}
          <path d="M17 18 Q17 3 28 3 Q39 3 39 18" fill="none" stroke="#f5f5f7" strokeWidth="3.2" strokeLinecap="round" />
          {/* flap flipped up behind the opening */}
          <motion.path
            d="M3 18 Q16 8 28 8 Q40 8 53 18 Z"
            fill={color}
            stroke="#1c1c1e"
            strokeWidth="2.4"
            style={{ filter: 'brightness(0.82)' }}
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          />
          {/* notes peeking out while open */}
          <AnimatePresence>
            {open && filled && (
              <motion.g initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }}>
                <rect x="13" y="8" width="26" height="14" rx="2" fill="#34d399" stroke="#064e3b" strokeWidth="1.2" transform="rotate(-8 26 15)" />
                <rect x="18" y="7" width="26" height="14" rx="2" fill="#6ee7b7" stroke="#064e3b" strokeWidth="1.2" transform="rotate(6 31 14)" />
                <text x="31" y="17.5" textAnchor="middle" fontSize="8" fontWeight="900" fill="#064e3b">
                  ₹
                </text>
              </motion.g>
            )}
          </AnimatePresence>
          {/* body */}
          <rect x="3" y="17" width="50" height="28" rx="9" fill={color} stroke="#1c1c1e" strokeWidth="2.6" />
          {/* flap folded down over the front when closed */}
          <motion.path
            d="M3 22 Q3 17 9 17 H47 Q53 17 53 22 Q40 33 28 33 Q16 33 3 22 Z"
            fill={color}
            stroke="#1c1c1e"
            strokeWidth="2.4"
            style={{ filter: 'brightness(0.82)' }}
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: 0.15 }}
          />
          {/* clasp */}
          <motion.circle cx="28" cy="31" r="3.4" fill="#fcd34d" stroke="#1c1c1e" strokeWidth="1.6" animate={{ opacity: open ? 0 : 1 }} />
        </motion.svg>
      )}
    </AnimatePresence>
  )
}
