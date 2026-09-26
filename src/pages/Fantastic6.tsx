import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import TextInput from '../components/ui/TextInput'
import CharacterAvatar from '../components/characters/CharacterAvatar'
import { useAppStore } from '../lib/store'
import { useAnonymousAuth } from '../lib/useAnonymousAuth'
import { useFantastic6Access } from '../lib/useFantastic6Access'
import {
  createGroup,
  groupParticipants,
  isFantastic6Group,
  joinGroupByCode,
  subscribeToUserGroups,
  type Group,
} from '../lib/groups'
import { fantastic6Profile } from '../lib/fantastic6'

type ModalState = 'none' | 'create' | 'join'

/** Fantastic 6 home: reached only through the secret code; lists and creates/joins crew groups. */
export default function Fantastic6() {
  const navigate = useNavigate()
  const me = useFantastic6Access(true)
  const leaveFantastic6 = useAppStore((state) => state.leaveFantastic6)
  const { user: authUser } = useAnonymousAuth()

  const [groups, setGroups] = useState<Group[]>([])
  const [modal, setModal] = useState<ModalState>('none')
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!authUser) return
    return subscribeToUserGroups(authUser.uid, (all) => setGroups(all.filter(isFantastic6Group)))
  }, [authUser])

  const leave = () => {
    leaveFantastic6()
    navigate('/groups')
  }

  const closeModal = () => {
    setModal('none')
    setInputValue('')
    setError(null)
  }

  const handleCreate = async () => {
    if (!authUser || !me || !inputValue.trim()) return
    setBusy(true)
    setError(null)
    try {
      const groupId = await createGroup(inputValue.trim(), authUser.uid, me)
      closeModal()
      navigate(`/groups/${groupId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the group. Please retry.')
    } finally {
      setBusy(false)
    }
  }

  const handleJoin = async () => {
    if (!authUser || !me || !inputValue.trim()) return
    const code = inputValue.trim()
    if (!/^\d{6}$/.test(code)) {
      setError('Invite codes are 6 digits — double-check the code.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const { groupId } = await joinGroupByCode(code, authUser.uid, me)
      closeModal()
      navigate(`/groups/${groupId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not join the group. Please retry.')
    } finally {
      setBusy(false)
    }
  }

  if (!me) return null

  return (
    <div className="safe-top safe-bottom safe-x relative flex min-h-screen flex-1 flex-col gap-4 bg-apple-bg px-5 py-6 sm:px-6">
      <div className="mt-2 flex flex-col gap-1.5">
        <button
          onClick={leave}
          className="mb-2 flex items-center gap-1 self-start text-sm font-semibold text-apple-accent transition-opacity hover:opacity-85"
        >
          <span className="text-base">‹</span> Leave Fantastic 6
        </button>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <h1 className="bg-[linear-gradient(90deg,#fff,#ffd6f5,#fff3b0,#b8f2ff)] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              Fantastic 6 ✨
            </h1>
            <p className="text-sm font-medium text-apple-text-secondary">
              You're <span className="font-bold text-apple-text">{fantastic6Profile(me).name}</span>
            </p>
          </div>
          <div className="shrink-0 rounded-full border border-apple-border bg-white/5 p-0.5 shadow-apple-smooth">
            <CharacterAvatar characterId={me} size={52} />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-3.5 overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-0.5">
          <AnimatePresence>
            {groups.map((group, index) => (
              <motion.div
                key={group.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: index * 0.04, ease: [0.25, 1, 0.5, 1], duration: 0.3 }}
                className="mb-3"
              >
                <CrewGroupCard group={group} onOpen={() => navigate(`/groups/${group.id}`)} />
              </motion.div>
            ))}
          </AnimatePresence>

          {groups.length === 0 && (
            <Card className="flex flex-col items-center gap-3 border border-apple-border bg-white/[0.04] p-8 text-center">
              <div className="text-3xl">🎉</div>
              <p className="py-1 text-sm font-medium text-apple-text-secondary">
                No crew groups yet. Create one for your next hangout, or join with a friend's code.
              </p>
            </Card>
          )}
        </div>

        <div className="sticky bottom-0 z-10 flex gap-3.5 border-t border-apple-border bg-apple-bg/90 pt-4 backdrop-blur-sm">
          <Button variant="secondary" className="flex-1 text-sm font-semibold" onClick={() => setModal('join')}>
            Join Group
          </Button>
          <Button variant="primary" className="flex-1 text-sm font-semibold" onClick={() => setModal('create')}>
            Create Group
          </Button>
        </div>
      </div>

      <Modal open={modal !== 'none'} onClose={closeModal}>
        <div className="mb-5 flex items-center gap-3">
          <CharacterAvatar characterId={me} size={44} />
          <div>
            <h2 className="text-xl font-bold tracking-tight text-apple-text">
              {modal === 'create' ? 'New Crew Group' : 'Join Crew Group'}
            </h2>
            <p className="text-xs font-medium text-apple-text-secondary">as {fantastic6Profile(me).name}</p>
          </div>
        </div>
        <TextInput
          placeholder={modal === 'create' ? 'e.g. Goa trip, Friday dinner' : '6-digit code'}
          label={modal === 'create' ? 'Name' : 'Invite code'}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          maxLength={modal === 'create' ? 40 : 6}
          inputMode={modal === 'join' ? 'numeric' : undefined}
          autoFocus
        />
        {error && <p className="mt-2.5 text-xs font-medium text-rose-500">{error}</p>}
        <Button
          className="mt-6 w-full py-4 text-sm font-semibold"
          disabled={busy || !inputValue.trim()}
          onClick={modal === 'create' ? handleCreate : handleJoin}
        >
          {busy ? 'Processing...' : modal === 'create' ? 'Create' : 'Join'}
        </Button>
      </Modal>
    </div>
  )
}

function CrewGroupCard({ group, onOpen }: { group: Group; onOpen: () => void }) {
  const crew = groupParticipants(group)

  return (
    <Card
      onClick={onOpen}
      whileTap={{ scale: 0.98 }}
      className="flex cursor-pointer items-center justify-between border border-apple-border bg-white/[0.05] transition-colors duration-200 hover:bg-white/[0.09]"
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="truncate text-base font-semibold tracking-tight text-apple-text">{group.name}</p>
        <p className="text-xs font-medium text-apple-text-secondary">
          {crew.length} of 6 · Code: {group.inviteCode}
        </p>
      </div>
      <div className="flex shrink-0 -space-x-2">
        {crew.map((id) => (
          <div key={id} className="rounded-full border border-apple-border bg-[#1c1c1e] p-0.5 shadow-sm">
            <CharacterAvatar characterId={id} size={30} />
          </div>
        ))}
      </div>
    </Card>
  )
}
