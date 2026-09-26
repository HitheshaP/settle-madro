import { F6_CHARACTERS } from '../components/characters/characterData'
import type { UserRecord } from './users'

export const FANTASTIC6_KIND = 'fantastic6'
export const FANTASTIC6_GROUP_NAME = 'Fantastic 6'

export interface Fantastic6Member {
  id: string
  name: string
}

export const FANTASTIC6: Fantastic6Member[] = F6_CHARACTERS.map((c) => ({ id: c.id, name: c.name }))

/** In the Fantastic 6 group, expenses are split between these fixed crew ids rather than signed-in accounts. */
export const FANTASTIC6_IDS = FANTASTIC6.map((m) => m.id)

export function isFantastic6Id(id: string) {
  return FANTASTIC6_IDS.includes(id)
}

export function fantastic6Profile(id: string): UserRecord {
  const member = FANTASTIC6.find((m) => m.id === id)
  return { uid: id, name: member?.name ?? id, characterId: id }
}

// Only the SHA-256 of the secret code ships in the bundle, never the code itself.
const CODE_SHA256 = '60768da106d720784607e2f2a4844934142714704297feeb6e420d2bd7b661e1'

export function normalizeFantastic6Code(code: string) {
  return code.trim().toLowerCase()
}

export async function isFantastic6Code(code: string) {
  const bytes = new TextEncoder().encode(normalizeFantastic6Code(code))
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  const hex = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
  return hex === CODE_SHA256
}
