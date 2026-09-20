const INK = '#1c1c1e'

interface GlyphProps {
  id: string
  size: number
}

// ---------- shared people primitives ----------

function Body({ color }: { color: string }) {
  return <path d="M14 100 Q14 72 50 72 Q86 72 86 100 Z" fill={color} stroke={INK} strokeWidth="3" />
}

function Head({ skin }: { skin: string }) {
  return <circle cx="50" cy="45" r="27" fill={skin} stroke={INK} strokeWidth="3" />
}

function Face({ blush }: { blush?: string }) {
  return (
    <>
      {blush && (
        <>
          <ellipse cx="33" cy="52" rx="5" ry="3" fill={blush} opacity="0.6" />
          <ellipse cx="67" cy="52" rx="5" ry="3" fill={blush} opacity="0.6" />
        </>
      )}
      <circle cx="39" cy="44" r="3.2" fill={INK} />
      <circle cx="61" cy="44" r="3.2" fill={INK} />
      <path d="M39 57 Q50 65 61 57" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  )
}

// ---------- guys ----------

function GuyNerdy() {
  return (
    <>
      <Body color="#7dd3fc" />
      <Head skin="#ffdbac" />
      <path d="M23 38 Q25 15 50 15 Q75 15 77 38 Q77 27 50 26 Q23 27 23 38 Z" fill="#2b2b2b" stroke={INK} strokeWidth="2.5" />
      <Face />
      <rect x="30" y="41" width="15" height="10" rx="3" fill="none" stroke={INK} strokeWidth="2.4" />
      <rect x="55" y="41" width="15" height="10" rx="3" fill="none" stroke={INK} strokeWidth="2.4" />
      <line x1="45" y1="46" x2="55" y2="46" stroke={INK} strokeWidth="2.4" />
    </>
  )
}

function GuyRich() {
  return (
    <>
      <Body color="#4c0519" />
      <Head skin="#e8b48c" />
      <path d="M23 36 Q24 16 50 16 Q76 16 77 36 Q70 24 50 24 Q30 24 23 36 Z" fill="#0a0a0a" stroke={INK} strokeWidth="2.5" />
      <path d="M35 63 Q50 72 65 63" stroke="#fbbf24" strokeWidth="3" fill="none" />
      <path d="M38 66 Q50 74 62 66" stroke="#fbbf24" strokeWidth="2.5" fill="none" />
      <circle cx="39" cy="44" r="3.2" fill={INK} />
      <circle cx="61" cy="44" r="3.2" fill={INK} />
      <path d="M39 57 Q50 63 61 57" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="29" y="40" width="17" height="9" rx="4" fill="#0a0a0a" opacity="0.85" />
      <rect x="54" y="40" width="17" height="9" rx="4" fill="#0a0a0a" opacity="0.85" />
      <line x1="46" y1="44" x2="54" y2="44" stroke={INK} strokeWidth="2" />
    </>
  )
}

function GuyHandsome() {
  return (
    <>
      <Body color="#f8fafc" />
      <Head skin="#f3c9a0" />
      <path d="M24 34 Q23 15 50 15 Q77 15 76 34 Q66 20 50 22 Q34 20 24 34 Z" fill="#5b3a29" stroke={INK} strokeWidth="2.5" />
      <Face blush="#f9a8d4" />
      <path d="M40 62 Q50 58 60 62" stroke="#c68642" strokeWidth="1.6" fill="none" opacity="0.5" />
    </>
  )
}

function GuyAthletic() {
  return (
    <>
      <path d="M10 100 Q10 70 50 70 Q90 70 90 100 Z" fill="#9ca3af" stroke={INK} strokeWidth="3" />
      <Head skin="#c68642" />
      <path d="M24 34 Q24 20 50 20 Q76 20 76 34 Q76 26 50 26 Q24 26 24 34 Z" fill="#1c1c1e" />
      <rect x="20" y="30" width="60" height="9" rx="4.5" fill="#ef4444" stroke={INK} strokeWidth="2" />
      <Face />
    </>
  )
}

function GuyBearded() {
  return (
    <>
      <Body color="#166534" />
      <Head skin="#d9a066" />
      <path d="M25 33 Q26 16 50 16 Q74 16 75 33 Q75 24 50 24 Q25 24 25 33 Z" fill="#4b3621" stroke={INK} strokeWidth="2.5" />
      <path d="M27 46 Q26 68 50 70 Q74 68 73 46 Q74 60 50 62 Q26 60 27 46 Z" fill="#4b3621" stroke={INK} strokeWidth="2.5" />
      <circle cx="39" cy="42" r="3.2" fill={INK} />
      <circle cx="61" cy="42" r="3.2" fill={INK} />
      <path d="M42 55 Q50 59 58 55" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </>
  )
}

function GuyCurly() {
  return (
    <>
      <Body color="#fbbf24" />
      <Head skin="#ffdbac" />
      {[[28, 22], [38, 15], [50, 13], [62, 15], [72, 22], [33, 18], [67, 18]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="7" fill="#c2410c" stroke={INK} strokeWidth="2" />
      ))}
      <Face />
    </>
  )
}

function GuySlickback() {
  return (
    <>
      <Body color="#0f172a" />
      <path d="M32 96 Q50 90 68 96" stroke="#1e3a8a" strokeWidth="4" fill="none" />
      <Head skin="#e8b48c" />
      <path d="M23 34 Q23 14 50 14 Q77 14 77 34 Q76 20 50 19 Q24 20 23 34 Z" fill="#0a0a0a" stroke={INK} strokeWidth="2.5" />
      <path d="M45 19 L50 30" stroke="#3f3f46" strokeWidth="1.5" />
      <Face />
    </>
  )
}

// ---------- girls ----------

function GirlNerdy() {
  return (
    <>
      <Body color="#ca8a04" />
      <path d="M20 60 Q18 40 24 30 L26 66 Z" fill="#4b2e1d" stroke={INK} strokeWidth="2" />
      <path d="M80 60 Q82 40 76 30 L74 66 Z" fill="#4b2e1d" stroke={INK} strokeWidth="2" />
      <Head skin="#ffdbac" />
      <path d="M23 36 Q24 16 50 16 Q76 16 77 36 Q76 24 50 24 Q24 24 23 36 Z" fill="#4b2e1d" stroke={INK} strokeWidth="2.5" />
      <Face />
      <rect x="30" y="41" width="15" height="10" rx="3" fill="none" stroke={INK} strokeWidth="2.4" />
      <rect x="55" y="41" width="15" height="10" rx="3" fill="none" stroke={INK} strokeWidth="2.4" />
      <line x1="45" y1="46" x2="55" y2="46" stroke={INK} strokeWidth="2.4" />
    </>
  )
}

function GirlRich() {
  return (
    <>
      <Body color="#18181b" />
      <path d="M22 62 Q18 38 26 26 L28 66 Z" fill="#eab308" stroke={INK} strokeWidth="2" />
      <path d="M78 62 Q82 38 74 26 L72 66 Z" fill="#eab308" stroke={INK} strokeWidth="2" />
      <Head skin="#f3c9a0" />
      <path d="M24 34 Q24 15 50 15 Q76 15 76 34 Q75 22 50 22 Q25 22 24 34 Z" fill="#eab308" stroke={INK} strokeWidth="2.5" />
      <circle cx="24" cy="52" r="3.5" fill="none" stroke="#fbbf24" strokeWidth="2" />
      <circle cx="76" cy="52" r="3.5" fill="none" stroke="#fbbf24" strokeWidth="2" />
      <path d="M36 66 Q50 74 64 66" stroke="#fbbf24" strokeWidth="3" fill="none" />
      <Face blush="#f9a8d4" />
    </>
  )
}

function GirlPretty() {
  return (
    <>
      <Body color="#f472b6" />
      <path d="M18 64 Q14 36 26 24 Q22 46 26 68 Z" fill="#3b2412" stroke={INK} strokeWidth="2" />
      <path d="M82 64 Q86 36 74 24 Q78 46 74 68 Z" fill="#3b2412" stroke={INK} strokeWidth="2" />
      <Head skin="#e8b48c" />
      <path d="M23 34 Q23 15 50 15 Q77 15 77 34 Q75 21 50 21 Q25 21 23 34 Z" fill="#3b2412" stroke={INK} strokeWidth="2.5" />
      <Face blush="#f9a8d4" />
      <path d="M42 57 Q50 61 58 57" stroke="#dc2626" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </>
  )
}

function GirlAthletic() {
  return (
    <>
      <path d="M14 100 Q14 70 50 70 Q86 70 86 100 Z" fill="#14b8a6" stroke={INK} strokeWidth="3" />
      <path d="M70 30 Q86 34 82 58 L74 54 Q78 36 68 30 Z" fill="#3f2a1a" stroke={INK} strokeWidth="2" />
      <Head skin="#c68642" />
      <path d="M24 34 Q24 18 50 18 Q76 18 76 34 Q76 26 50 26 Q24 26 24 34 Z" fill="#3f2a1a" />
      <rect x="21" y="29" width="58" height="8" rx="4" fill="#ec4899" stroke={INK} strokeWidth="2" />
      <Face />
    </>
  )
}

function GirlCurly() {
  return (
    <>
      <Body color="#a855f7" />
      <Head skin="#ffdbac" />
      {[[24, 30], [30, 17], [42, 11], [58, 11], [70, 17], [76, 30], [36, 14], [64, 14], [22, 42], [78, 42]].map(
        ([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="7.5" fill="#9a3412" stroke={INK} strokeWidth="2" />
        ),
      )}
      <Face blush="#f9a8d4" />
    </>
  )
}

function GirlBraided() {
  return (
    <>
      <Body color="#f97316" />
      <rect x="17" y="55" width="8" height="26" rx="4" fill="#5b3a29" stroke={INK} strokeWidth="2" />
      <rect x="75" y="55" width="8" height="26" rx="4" fill="#5b3a29" stroke={INK} strokeWidth="2" />
      <circle cx="21" cy="56" r="4" fill="#ef4444" />
      <circle cx="79" cy="56" r="4" fill="#ef4444" />
      <Head skin="#f3c9a0" />
      <path d="M23 36 Q24 16 50 16 Q76 16 77 36 Q76 24 50 24 Q24 24 23 36 Z" fill="#5b3a29" stroke={INK} strokeWidth="2.5" />
      <Face blush="#f9a8d4" />
    </>
  )
}

function GirlSlickbun() {
  return (
    <>
      <Body color="#059669" />
      <circle cx="50" cy="16" r="9" fill="#0a0a0a" stroke={INK} strokeWidth="2" />
      <Head skin="#e8b48c" />
      <path d="M23 34 Q23 16 50 16 Q77 16 77 34 Q76 22 50 22 Q24 22 23 34 Z" fill="#0a0a0a" stroke={INK} strokeWidth="2.5" />
      <Face blush="#f9a8d4" />
    </>
  )
}

// ---------- flowers ----------

function FlowerRose() {
  return (
    <>
      <path d="M50 70 Q46 85 50 98" stroke="#16a34a" strokeWidth="4" fill="none" />
      <ellipse cx="38" cy="80" rx="8" ry="4" fill="#16a34a" stroke={INK} strokeWidth="1.5" transform="rotate(-30 38 80)" />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="42"
          rx="16"
          ry="20"
          fill={i % 2 === 0 ? '#dc2626' : '#b91c1c'}
          stroke={INK}
          strokeWidth="2"
          opacity="0.92"
          transform={`rotate(${deg} 50 42) translate(0 -8)`}
        />
      ))}
      <circle cx="50" cy="42" r="10" fill="#f43f5e" stroke={INK} strokeWidth="2" />
    </>
  )
}

function FlowerHibiscus() {
  return (
    <>
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="30"
          rx="11"
          ry="20"
          fill={i % 2 === 0 ? '#ef4444' : '#f97316'}
          stroke={INK}
          strokeWidth="2"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="7" fill="#fde047" stroke={INK} strokeWidth="2" />
      <line x1="50" y1="50" x2="50" y2="78" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="80" r="3" fill="#facc15" stroke={INK} strokeWidth="1.5" />
    </>
  )
}

function FlowerLotus() {
  return (
    <>
      {[-60, -30, 0, 30, 60].map((deg, i) => (
        <path
          key={i}
          d="M50 78 Q40 40 50 20 Q60 40 50 78 Z"
          fill={i === 2 ? '#fbcfe8' : '#f9a8d4'}
          stroke={INK}
          strokeWidth="2"
          transform={`rotate(${deg} 50 78)`}
        />
      ))}
      <circle cx="50" cy="66" r="8" fill="#fef08a" stroke={INK} strokeWidth="2" />
    </>
  )
}

function FlowerLily() {
  return (
    <>
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <path
          key={i}
          d="M50 50 Q54 26 50 10 Q46 26 50 50 Z"
          fill="#fefce8"
          stroke={INK}
          strokeWidth="2"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <circle
          key={`f-${i}`}
          cx="50"
          cy="24"
          r="1.4"
          fill="#f97316"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="6" fill="#f97316" stroke={INK} strokeWidth="2" />
    </>
  )
}

function FlowerSunflower() {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="24"
          rx="6.5"
          ry="16"
          fill="#facc15"
          stroke={INK}
          strokeWidth="1.8"
          transform={`rotate(${i * 30} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="15" fill="#78350f" stroke={INK} strokeWidth="2.5" />
      {[[45, 45], [55, 47], [50, 53], [44, 55], [57, 55], [50, 46]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.6" fill="#451a03" />
      ))}
    </>
  )
}

// ---------- animals ----------

function AnimalLion() {
  return (
    <>
      <circle cx="50" cy="50" r="34" fill="#b45309" stroke={INK} strokeWidth="2.5" />
      {Array.from({ length: 16 }).map((_, i) => (
        <rect
          key={i}
          x="48"
          y="12"
          width="4"
          height="14"
          rx="2"
          fill="#92400e"
          transform={`rotate(${i * 22.5} 50 50)`}
        />
      ))}
      <circle cx="50" cy="52" r="22" fill="#eab308" stroke={INK} strokeWidth="2.5" />
      <circle cx="41" cy="48" r="3" fill={INK} />
      <circle cx="59" cy="48" r="3" fill={INK} />
      <ellipse cx="50" cy="58" rx="6" ry="4" fill="#fef3c7" />
      <path d="M50 58 L50 62 M50 62 Q45 66 41 64 M50 62 Q55 66 59 64" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M45 55 L50 58 L55 55 Z" fill={INK} />
    </>
  )
}

function AnimalTiger() {
  return (
    <>
      {/* ears */}
      <circle cx="25" cy="23" r="12" fill="#f97316" stroke={INK} strokeWidth="2.5" />
      <circle cx="75" cy="23" r="12" fill="#f97316" stroke={INK} strokeWidth="2.5" />
      <circle cx="25" cy="25" r="5.5" fill="#fefce8" />
      <circle cx="75" cy="25" r="5.5" fill="#fefce8" />
      {/* face */}
      <circle cx="50" cy="55" r="33" fill="#f97316" stroke={INK} strokeWidth="2.5" />
      {/* forehead stripes */}
      <path d="M50 25 L50 35" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M38 27 Q42 33 38 38" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M62 27 Q58 33 62 38" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      {/* muzzle */}
      <ellipse cx="50" cy="65" rx="18" ry="14" fill="#fefce8" stroke={INK} strokeWidth="2.2" />
      {/* cheek stripes */}
      <path d="M19 50 Q27 53 21 60" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M81 50 Q73 53 79 60" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      {/* eyes */}
      <ellipse cx="38" cy="50" rx="4.2" ry="5" fill={INK} />
      <ellipse cx="62" cy="50" rx="4.2" ry="5" fill={INK} />
      <circle cx="39.3" cy="48.3" r="1" fill="#fefce8" />
      <circle cx="63.3" cy="48.3" r="1" fill="#fefce8" />
      {/* nose + mouth */}
      <path d="M45 61 L55 61 L50 66 Z" fill={INK} />
      <path d="M50 66 L50 69 M50 69 Q43 74 36 71 M50 69 Q57 74 64 71" stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  )
}

function AnimalCow() {
  return (
    <>
      <circle cx="50" cy="52" r="30" fill="#fefce8" stroke={INK} strokeWidth="2.5" />
      <path d="M28 30 Q20 14 30 10 Q34 22 34 32 Z" fill="#292524" stroke={INK} strokeWidth="2" />
      <path d="M72 30 Q80 14 70 10 Q66 22 66 32 Z" fill="#292524" stroke={INK} strokeWidth="2" />
      <ellipse cx="24" cy="46" rx="7" ry="10" fill="#fefce8" stroke={INK} strokeWidth="2" />
      <ellipse cx="76" cy="46" rx="7" ry="10" fill="#fefce8" stroke={INK} strokeWidth="2" />
      <path d="M34 26 Q30 34 38 40 Q30 44 34 52 Z" fill="#292524" opacity="0.9" />
      <path d="M68 66 Q74 60 66 54 Q76 52 70 44 Z" fill="#292524" opacity="0.9" />
      <ellipse cx="50" cy="64" rx="18" ry="13" fill="#f9a8d4" stroke={INK} strokeWidth="2" />
      <ellipse cx="44" cy="64" rx="2.6" ry="2" fill={INK} />
      <ellipse cx="56" cy="64" rx="2.6" ry="2" fill={INK} />
      <circle cx="39" cy="47" r="3" fill={INK} />
      <circle cx="61" cy="47" r="3" fill={INK} />
    </>
  )
}

function AnimalHorse() {
  return (
    <>
      <path d="M50 14 Q66 14 68 34 Q70 50 62 66 Q58 78 50 82 Q42 78 38 66 Q30 50 32 34 Q34 14 50 14 Z" fill="#b45309" stroke={INK} strokeWidth="2.5" />
      <path d="M40 14 Q30 10 24 20 Q34 20 38 26 Z" fill="#451a03" stroke={INK} strokeWidth="2" />
      <path d="M60 14 Q70 10 76 20 Q66 20 62 26 Z" fill="#451a03" stroke={INK} strokeWidth="2" />
      <path d="M50 16 Q46 40 48 66" stroke="#fefce8" strokeWidth="5" strokeLinecap="round" />
      <circle cx="42" cy="40" r="3.4" fill={INK} />
      <circle cx="58" cy="40" r="3.4" fill={INK} />
      <ellipse cx="45" cy="72" rx="3" ry="4" fill={INK} />
      <ellipse cx="55" cy="72" rx="3" ry="4" fill={INK} />
      <path d="M40 66 Q50 72 60 66" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  )
}

function AnimalElephant() {
  return (
    <>
      <ellipse cx="18" cy="44" rx="15" ry="20" fill="#94a3b8" stroke={INK} strokeWidth="2.5" />
      <ellipse cx="82" cy="44" rx="15" ry="20" fill="#94a3b8" stroke={INK} strokeWidth="2.5" />
      <ellipse cx="18" cy="44" rx="9" ry="13" fill="#cbd5e1" />
      <ellipse cx="82" cy="44" rx="9" ry="13" fill="#cbd5e1" />
      <circle cx="50" cy="46" r="28" fill="#9ca3af" stroke={INK} strokeWidth="2.5" />
      <circle cx="40" cy="42" r="3.2" fill={INK} />
      <circle cx="60" cy="42" r="3.2" fill={INK} />
      <path d="M45 54 Q42 72 48 86 Q52 90 56 86" stroke="#9ca3af" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M45 54 Q42 72 48 86 Q52 90 56 86" stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  )
}

// ---------- cards ----------

function CardKing() {
  return (
    <>
      <Body color="#7f1d1d" />
      <Head skin="#f3c9a0" />
      <path d="M20 30 L26 12 L36 24 L50 8 L64 24 L74 12 L80 30 Z" fill="#facc15" stroke={INK} strokeWidth="2.5" />
      <circle cx="26" cy="14" r="3" fill="#f43f5e" />
      <circle cx="50" cy="10" r="3" fill="#f43f5e" />
      <circle cx="74" cy="14" r="3" fill="#f43f5e" />
      <path d="M30 20 Q50 12 70 20" stroke="#7f1d1d" strokeWidth="2" fill="none" />
      <Face />
      <path d="M32 62 Q50 56 68 62" stroke="#f8fafc" strokeWidth="2.4" fill="none" />
    </>
  )
}

function CardQueen() {
  return (
    <>
      <Body color="#701a75" />
      <path d="M20 60 Q16 34 28 22 L30 64 Z" fill="#3b2412" stroke={INK} strokeWidth="2" />
      <path d="M80 60 Q84 34 72 22 L70 64 Z" fill="#3b2412" stroke={INK} strokeWidth="2" />
      <Head skin="#e8b48c" />
      <path d="M28 26 L36 12 L50 22 L64 12 L72 26 Q50 18 28 26 Z" fill="#e879f9" stroke={INK} strokeWidth="2.5" />
      <circle cx="36" cy="14" r="2.6" fill="#facc15" />
      <circle cx="50" cy="12" r="2.8" fill="#facc15" />
      <circle cx="64" cy="14" r="2.6" fill="#facc15" />
      <Face blush="#f9a8d4" />
    </>
  )
}

function CardJoker() {
  return (
    <>
      <Body color="#15803d" />
      <path
        d="M22 34 L14 14 L32 24 L38 8 L50 26 L62 8 L68 24 L86 14 L78 34 Z"
        fill="#a3e635"
        stroke={INK}
        strokeWidth="2.5"
      />
      <circle cx="14" cy="14" r="3.5" fill="#f43f5e" />
      <circle cx="38" cy="8" r="3.5" fill="#facc15" />
      <circle cx="62" cy="8" r="3.5" fill="#f43f5e" />
      <circle cx="86" cy="14" r="3.5" fill="#facc15" />
      <Head skin="#ffdbac" />
      <circle cx="39" cy="44" r="3.2" fill={INK} />
      <circle cx="61" cy="44" r="3.2" fill={INK} />
      <path d="M36 55 Q50 70 64 55" stroke="#dc2626" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="56" r="3" fill="#f43f5e" />
      <circle cx="70" cy="56" r="3" fill="#f43f5e" />
    </>
  )
}

function CardAce() {
  return (
    <>
      <rect x="14" y="8" width="72" height="88" rx="10" fill="#fefce8" stroke={INK} strokeWidth="3" />
      <text x="24" y="30" fontSize="16" fontWeight="800" fill={INK} fontFamily="Georgia, serif">
        A
      </text>
      <path
        d="M50 30 C40 45 30 52 30 62 C30 70 38 74 44 70 C44 76 42 80 36 84 L64 84 C58 80 56 76 56 70 C62 74 70 70 70 62 C70 52 60 45 50 30 Z"
        fill="#18181b"
      />
      <text x="76" y="94" fontSize="16" fontWeight="800" fill={INK} fontFamily="Georgia, serif" transform="rotate(180 76 88)">
        A
      </text>
    </>
  )
}

function Goat() {
  return (
    <>
      <rect x="3" y="3" width="94" height="94" rx="18" fill="#0a0a0a" stroke="#8e8e93" strokeWidth="2" />
      <text
        x="50"
        y="57"
        textAnchor="middle"
        fontSize="17"
        fontWeight="800"
        fill="#c7c7cc"
        fontFamily="Georgia, serif"
        letterSpacing="1"
      >
        G.O.A.T
      </text>
    </>
  )
}

const RENDERERS: Record<string, () => React.ReactElement> = {
  'guy-nerdy': GuyNerdy,
  'guy-rich': GuyRich,
  'guy-handsome': GuyHandsome,
  'guy-athletic': GuyAthletic,
  'guy-bearded': GuyBearded,
  'guy-curly': GuyCurly,
  'guy-slickback': GuySlickback,
  'girl-nerdy': GirlNerdy,
  'girl-rich': GirlRich,
  'girl-pretty': GirlPretty,
  'girl-athletic': GirlAthletic,
  'girl-curly': GirlCurly,
  'girl-braided': GirlBraided,
  'girl-slickbun': GirlSlickbun,
  'flower-rose': FlowerRose,
  'flower-hibiscus': FlowerHibiscus,
  'flower-lotus': FlowerLotus,
  'flower-lily': FlowerLily,
  'flower-sunflower': FlowerSunflower,
  'animal-lion': AnimalLion,
  'animal-tiger': AnimalTiger,
  'animal-cow': AnimalCow,
  'animal-horse': AnimalHorse,
  'animal-elephant': AnimalElephant,
  'card-king': CardKing,
  'card-queen': CardQueen,
  'card-joker': CardJoker,
  'card-ace': CardAce,
  goat: Goat,
}

export default function CharacterGlyph({ id, size }: GlyphProps) {
  const Renderer = RENDERERS[id] ?? GuyNerdy
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
      <Renderer />
    </svg>
  )
}
