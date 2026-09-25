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

// ---------- superhero logos ----------

function LogoBatman() {
  return (
    <>
      <rect x="3" y="3" width="94" height="94" rx="20" fill="#0a0a0a" stroke={INK} strokeWidth="2" />
      <ellipse cx="50" cy="52" rx="38" ry="24" fill="#facc15" />
      <path
        d="M50 34 L58 20 L62 34 L80 24 L72 40 L96 46 L76 50 L88 66 L66 55 L58 76 L50 62 L42 76 L34 55 L12 66 L24 50 L4 46 L28 40 L20 24 L38 34 Z"
        fill="#0a0a0a"
      />
    </>
  )
}

function LogoSpiderman() {
  return (
    <>
      <circle cx="50" cy="50" r="47" fill="#dc2626" stroke={INK} strokeWidth="2" />
      <g stroke="#0a0a0a" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M50 45 L20 20" />
        <path d="M50 48 L14 38" />
        <path d="M50 52 L14 62" />
        <path d="M50 55 L20 80" />
        <path d="M50 45 L80 20" />
        <path d="M50 48 L86 38" />
        <path d="M50 52 L86 62" />
        <path d="M50 55 L80 80" />
      </g>
      <ellipse cx="50" cy="58" rx="10" ry="16" fill="#0a0a0a" />
      <circle cx="50" cy="38" r="7" fill="#0a0a0a" />
    </>
  )
}

function LogoCaptain() {
  return (
    <>
      <circle cx="50" cy="50" r="47" fill="#b91c1c" stroke={INK} strokeWidth="2" />
      <circle cx="50" cy="50" r="37" fill="#f8fafc" />
      <circle cx="50" cy="50" r="27" fill="#b91c1c" />
      <circle cx="50" cy="50" r="17" fill="#1d4ed8" stroke={INK} strokeWidth="1.5" />
      <path
        d="M50,41 L52.1,47.1 L58.6,47.2 L53.4,51.1 L55.3,57.3 L50,53.6 L44.7,57.3 L46.6,51.1 L41.4,47.2 L47.9,47.1 Z"
        fill="#f8fafc"
      />
    </>
  )
}

// ---------- Fantastic 6 ----------

function RoundSpecs({ color = INK }: { color?: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth="2.4">
      <circle cx="39" cy="44" r="7.5" fill="rgba(255,255,255,0.12)" />
      <circle cx="61" cy="44" r="7.5" fill="rgba(255,255,255,0.12)" />
      <path d="M46.5 43 Q50 40.5 53.5 43" />
      <path d="M31.5 43 L24 40" />
      <path d="M68.5 43 L76 40" />
    </g>
  )
}

function RectSpecs({ color = INK, width = 2.4 }: { color?: string; width?: number }) {
  return (
    <g fill="none" stroke={color} strokeWidth={width}>
      <rect x="30" y="39" width="17" height="11" rx="3" fill="rgba(255,255,255,0.12)" />
      <rect x="53" y="39" width="17" height="11" rx="3" fill="rgba(255,255,255,0.12)" />
      <path d="M47 43.5 L53 43.5" />
      <path d="M30 42 L24 40" />
      <path d="M70 42 L76 40" />
    </g>
  )
}

function SparkleStar({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  return (
    <path
      d={`M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`}
      fill={color}
    />
  )
}

// Ajji — short, cute, bubbly and never stops talking
function F6Ajji() {
  return (
    <>
      {/* speech bubble — she's always yapping */}
      <path d="M62 4 H92 Q97 4 97 9 V17 Q97 22 92 22 H74 L68 27 L69 22 H62 Q57 22 57 17 V9 Q57 4 62 4 Z" fill="#fefce8" stroke={INK} strokeWidth="1.8" />
      <text x="77" y="16.5" textAnchor="middle" fontSize="7.5" fontWeight="800" fill={INK} fontFamily="system-ui, sans-serif">
        bla bla
      </text>
      {/* drawn smaller and lower in the frame: she's the short one */}
      <g transform="translate(8 14) scale(0.84)">
        <Body color="#f472b6" />
        <circle cx="22" cy="24" r="11" fill="#3b2412" stroke={INK} strokeWidth="2.5" />
        <circle cx="78" cy="24" r="11" fill="#3b2412" stroke={INK} strokeWidth="2.5" />
        <Head skin="#f1c6a0" />
        <path d="M23 38 Q23 16 50 16 Q77 16 77 38 Q72 26 60 27 Q55 22 50 28 Q44 22 38 27 Q28 26 23 38 Z" fill="#3b2412" stroke={INK} strokeWidth="2.5" />
        <SparkleStar x={68} y={22} r={5} color="#fde047" />
        <ellipse cx="32" cy="53" rx="5.5" ry="3.4" fill="#fb7185" opacity="0.7" />
        <ellipse cx="68" cy="53" rx="5.5" ry="3.4" fill="#fb7185" opacity="0.7" />
        <ellipse cx="39" cy="44" rx="3.8" ry="4.6" fill={INK} />
        <ellipse cx="61" cy="44" rx="3.8" ry="4.6" fill={INK} />
        <circle cx="40.4" cy="42.4" r="1.5" fill="#fff" />
        <circle cx="62.4" cy="42.4" r="1.5" fill="#fff" />
        {/* big open chatty smile */}
        <path d="M39 54 Q50 70 61 54 Z" fill="#7f1d1d" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M44 60.5 Q50 57 56 60.5 Q50 66 44 60.5 Z" fill="#fb7185" />
      </g>
    </>
  )
}

// PK — tall, beautiful and short tempered
function F6PK() {
  return (
    <>
      <path d="M22 100 Q22 76 50 76 Q78 76 78 100 Z" fill="#7c3aed" stroke={INK} strokeWidth="3" />
      {/* long straight hair falling over the shoulders */}
      <path d="M22 40 Q20 12 50 10 Q80 12 78 40 L82 92 Q66 86 64 70 L36 70 Q34 86 18 92 Z" fill="#1c1917" stroke={INK} strokeWidth="2.5" />
      {/* taller, longer face */}
      <ellipse cx="50" cy="43" rx="24" ry="29" fill="#e3ae86" stroke={INK} strokeWidth="3" />
      <path d="M26 36 Q30 12 52 12 Q76 14 74 34 Q62 20 44 24 Q32 28 26 36 Z" fill="#1c1917" stroke={INK} strokeWidth="2.5" />
      {/* angry brows */}
      <path d="M31 35 L45 39.5" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M69 35 L55 39.5" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="39" cy="45" rx="3.2" ry="3.6" fill={INK} />
      <ellipse cx="61" cy="45" rx="3.2" ry="3.6" fill={INK} />
      <path d="M35.5 43 L32.5 41 M64.5 43 L67.5 41" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="33" cy="54" rx="4.5" ry="2.6" fill="#fb7185" opacity="0.45" />
      <ellipse cx="67" cy="54" rx="4.5" ry="2.6" fill="#fb7185" opacity="0.45" />
      {/* pouty, unimpressed lips */}
      <path d="M43 61 Q50 57.5 57 61 Q50 63.5 43 61 Z" fill="#be123c" stroke={INK} strokeWidth="1.6" />
      <circle cx="26" cy="54" r="2.6" fill="#facc15" stroke={INK} strokeWidth="1" />
      <circle cx="74" cy="54" r="2.6" fill="#facc15" stroke={INK} strokeWidth="1" />
      {/* 💢 */}
      <g stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M82 8 Q86 12 90 8" />
        <path d="M82 20 Q86 16 90 20" />
        <path d="M80 10 Q84 14 80 18" />
        <path d="M92 10 Q88 14 92 18" />
      </g>
    </>
  )
}

// G.O.A.T — curly hair, specs, decent build, stubble with a hint of goatee
function F6Goat() {
  const curls = [
    [25, 32], [28, 22], [35, 16], [44, 12], [54, 12], [63, 15], [70, 21], [75, 31],
    [33, 25], [42, 19], [52, 19], [61, 22], [68, 28],
  ]
  return (
    <>
      <path d="M10 100 Q10 70 50 70 Q90 70 90 100 Z" fill="#111827" stroke={INK} strokeWidth="3" />
      <path d="M36 72 Q50 84 64 72" stroke="#facc15" strokeWidth="2.5" fill="none" />
      <Head skin="#e0ac7e" />
      {curls.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="6.5" fill="#2b1a10" stroke={INK} strokeWidth="1.6" />
      ))}
      {/* stubble along the jaw */}
      <path d="M24 50 Q26 71 50 72 Q74 71 76 50 Q72 63 50 64 Q28 63 24 50 Z" fill="#3b2418" opacity="0.32" />
      <path d="M40 55 Q50 52 60 55" stroke="#3b2418" strokeWidth="2.2" opacity="0.5" fill="none" strokeLinecap="round" />
      <path d="M33 37 L44 36 M56 36 L67 37" stroke="#2b1a10" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="39" cy="44" r="3" fill={INK} />
      <circle cx="61" cy="44" r="3" fill={INK} />
      <RoundSpecs />
      <path d="M41 58 Q50 63.5 59 58" stroke={INK} strokeWidth="2.8" fill="none" strokeLinecap="round" />
      {/* hint of goatee */}
      <path d="M45 65 Q50 71.5 55 65 Q50 67.5 45 65 Z" fill="#2b1a10" stroke="#2b1a10" strokeWidth="1" />
    </>
  )
}

// MA — intelligent, athletic topper with specs and stubble that's still growing in
function F6MA() {
  const stubble = [
    [43, 66], [47, 67.5], [51, 68], [55, 67], [58, 65], [40, 63], [61, 62], [46, 64.5], [53, 65],
  ]
  return (
    <>
      <path d="M8 100 Q10 68 50 68 Q90 68 92 100 Z" fill="#0891b2" stroke={INK} strokeWidth="3" />
      <path d="M40 69 L50 80 L60 69" stroke="#f8fafc" strokeWidth="3" fill="none" />
      <text x="50" y="96" textAnchor="middle" fontSize="12" fontWeight="900" fill="#f8fafc" fontFamily="system-ui, sans-serif">
        #1
      </text>
      <Head skin="#eec39a" />
      {/* neat side-parted topper hair */}
      <path d="M23 38 Q21 15 48 14 Q78 13 77 38 Q74 25 62 22 Q52 27 40 24 Q28 26 23 38 Z" fill="#1c1410" stroke={INK} strokeWidth="2.5" />
      <path d="M40 15 Q38 20 40 24" stroke="#3f3f46" strokeWidth="1.5" fill="none" />
      <path d="M33 36 L44 35.5 M56 35.5 L67 36" stroke="#1c1410" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="38.5" cy="44.5" r="3" fill={INK} />
      <circle cx="61.5" cy="44.5" r="3" fill={INK} />
      <RectSpecs />
      <path d="M42 57 Q50 62 58 57" stroke={INK} strokeWidth="2.8" fill="none" strokeLinecap="round" />
      {stubble.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="0.9" fill="#3b2418" opacity="0.45" />
      ))}
    </>
  )
}

// Dandan — dark skinned, handsome, no specs, just the moustache; shining eyes with long lashes
function F6Dandan() {
  return (
    <>
      <path d="M12 100 Q12 71 50 71 Q88 71 88 100 Z" fill="#047857" stroke={INK} strokeWidth="3" />
      <path d="M38 72 L50 84 L62 72 L56 71 L50 77 L44 71 Z" fill="#ecfdf5" stroke={INK} strokeWidth="1.8" />
      <Head skin="#7a4a2a" />
      <path d="M23 38 Q22 16 50 15 Q78 16 77 38 Q76 27 64 24 Q50 21 36 24 Q24 27 23 38 Z" fill="#0a0a0a" stroke={INK} strokeWidth="2.5" />
      <path d="M32 36 Q38 33 45 35.5 M55 35.5 Q62 33 68 36" stroke="#0a0a0a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      {/* shining eyes */}
      <ellipse cx="39" cy="44.5" rx="5.2" ry="5.6" fill="#fff" stroke={INK} strokeWidth="1.6" />
      <ellipse cx="61" cy="44.5" rx="5.2" ry="5.6" fill="#fff" stroke={INK} strokeWidth="1.6" />
      <circle cx="39.5" cy="45.3" r="3.3" fill="#1c1917" />
      <circle cx="61.5" cy="45.3" r="3.3" fill="#1c1917" />
      <circle cx="41" cy="43.6" r="1.4" fill="#fff" />
      <circle cx="63" cy="43.6" r="1.4" fill="#fff" />
      <circle cx="38.4" cy="46.8" r="0.7" fill="#fff" />
      <circle cx="60.4" cy="46.8" r="0.7" fill="#fff" />
      {/* long lashes */}
      <g stroke={INK} strokeWidth="1.8" strokeLinecap="round">
        <path d="M34.2 41.5 L30.5 38.6 M36.2 39.7 L34 35.8 M39 39 L38.6 34.8" />
        <path d="M65.8 41.5 L69.5 38.6 M63.8 39.7 L66 35.8 M61 39 L61.4 34.8" />
      </g>
      <SparkleStar x={26} y={34} r={4.5} color="#fde047" />
      <SparkleStar x={75} y={33} r={3.5} color="#fef9c3" />
      {/* moustache only */}
      <path d="M37 56 Q43 50.5 50 54.5 Q57 50.5 63 56 Q57 58.5 50 57 Q43 58.5 37 56 Z" fill="#0a0a0a" stroke={INK} strokeWidth="1.2" />
      <path d="M43 62 Q50 66 57 62" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </>
  )
}

// Bro — very slim, very fair gamer with headphones and specs
function F6Bro() {
  return (
    <>
      <path d="M30 100 Q30 78 50 78 Q70 78 70 100 Z" fill="#1f2937" stroke={INK} strokeWidth="3" />
      <rect x="45" y="66" width="10" height="14" fill="#fde7d6" stroke={INK} strokeWidth="2" />
      {/* tiny controller on the tee */}
      <path d="M41 88 Q41 84 45 84 H55 Q59 84 59 88 L60 93 Q60 96 57 95 L54 92 H46 L43 95 Q40 96 40 93 Z" fill="#a855f7" stroke={INK} strokeWidth="1.2" />
      {/* slim, narrow face */}
      <ellipse cx="50" cy="45" rx="21" ry="26" fill="#fde7d6" stroke={INK} strokeWidth="3" />
      <path d="M29 40 Q28 18 50 17 Q72 18 71 40 Q66 28 58 30 L54 24 L50 30 L44 25 L40 31 Q32 30 29 40 Z" fill="#6b4423" stroke={INK} strokeWidth="2.3" />
      <circle cx="41" cy="45" r="2.8" fill={INK} />
      <circle cx="59" cy="45" r="2.8" fill={INK} />
      <g fill="none" stroke={INK} strokeWidth="2">
        <rect x="33" y="40" width="15" height="10" rx="3" fill="rgba(255,255,255,0.14)" />
        <rect x="52" y="40" width="15" height="10" rx="3" fill="rgba(255,255,255,0.14)" />
        <path d="M48 44 L52 44" />
      </g>
      <path d="M43 58 Q50 62 57 58" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      {/* headphones */}
      <path d="M25 44 Q24 10 50 10 Q76 10 75 44" stroke="#111827" strokeWidth="5" fill="none" strokeLinecap="round" />
      <rect x="18" y="36" width="12" height="19" rx="5" fill="#111827" stroke={INK} strokeWidth="1.6" />
      <rect x="70" y="36" width="12" height="19" rx="5" fill="#111827" stroke={INK} strokeWidth="1.6" />
      <rect x="20.5" y="39" width="3" height="13" rx="1.5" fill="#22d3ee" />
      <rect x="76.5" y="39" width="3" height="13" rx="1.5" fill="#f472b6" />
      <path d="M24 55 Q26 65 38 64" stroke="#111827" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="39" cy="64" r="2.4" fill="#22d3ee" stroke={INK} strokeWidth="1" />
    </>
  )
}

const RENDERERS: Record<string, () => React.ReactElement> = {
  'f6-ajji': F6Ajji,
  'f6-pk': F6PK,
  'f6-goat': F6Goat,
  'f6-ma': F6MA,
  'f6-dandan': F6Dandan,
  'f6-bro': F6Bro,
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
  'logo-batman': LogoBatman,
  'logo-spiderman': LogoSpiderman,
  'logo-captain': LogoCaptain,
}

export default function CharacterGlyph({ id, size }: GlyphProps) {
  const Renderer = RENDERERS[id] ?? GuyNerdy
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
      <Renderer />
    </svg>
  )
}
