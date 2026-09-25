import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import TextInput from '../components/ui/TextInput'
import OfflineBanner from '../components/ui/OfflineBanner'
import Modal from '../components/ui/Modal'
import AppMenu from '../components/ui/AppMenu'
import CharacterAvatar from '../components/characters/CharacterAvatar'
import { useAppStore } from '../lib/store'
import { useAnonymousAuth } from '../lib/useAnonymousAuth'
import {
  createGroup,
  groupParticipants,
  isFantastic6Group,
  joinGroupByCode,
  subscribeToUserGroups,
  type Group,
} from '../lib/groups'
import { useProfiles } from '../lib/useProfiles'

type ModalState = 'none' | 'create' | 'join'

export default function Groups() {
  const navigate = useNavigate()
  const user = useAppStore((state) => state.user)
  const { user: authUser, error: authError } = useAnonymousAuth()

  const [groups, setGroups] = useState<Group[]>([])
  const [modal, setModal] = useState<ModalState>('none')
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!authUser) return
    return subscribeToUserGroups(authUser.uid, setGroups)
  }, [authUser])

  const closeModal = () => {
    setModal('none')
    setInputValue('')
    setError(null)
  }

  const handleCreate = async () => {
    if (!authUser || !inputValue.trim()) return
    setBusy(true)
    setError(null)
    try {
      const groupId = await createGroup(inputValue.trim(), authUser.uid)
      closeModal()
      navigate(`/groups/${groupId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the group. Please retry.')
    } finally {
      setBusy(false)
    }
  }

  const handleJoin = async () => {
    if (!authUser || !inputValue.trim()) return

    const code = inputValue.trim()
    if (!/^\d{6}$/.test(code)) {
      setError('Invite codes are 6 digits — double-check the code.')
      return
    }

    setBusy(true)
    setError(null)
    try {
      const { groupId, duplicateNames } = await joinGroupByCode(code, authUser.uid)
      closeModal()
      navigate(`/groups/${groupId}`, { state: { duplicateNames } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="safe-top safe-bottom safe-x relative flex min-h-screen flex-1 flex-col gap-4 bg-apple-bg px-5 py-6 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(10,132,255,0.12),transparent_60%)]" />

      <div className="relative z-20 mt-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-apple-text sm:text-3xl">Groups</h1>
            <motion.span
              className="text-xl"
              animate={{ rotateY: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
            >
              🪙
            </motion.span>
          </div>
          {user && (
            <p className="truncate text-sm font-medium text-apple-text-secondary">Signed in as {user.name}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          {user && (
            <div className="rounded-full border border-apple-border bg-white/5 p-0.5 shadow-apple-smooth">
              <CharacterAvatar characterId={user.characterId} size={44} />
            </div>
          )}
          <AppMenu />
        </div>
      </div>

      {authError && <OfflineBanner message="Offline Cache Mode · Local replication active" />}

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
              >
                <GroupCard group={group} onOpen={() => navigate(`/groups/${group.id}`)} />
              </motion.div>
            ))}
          </AnimatePresence>

          {groups.length === 0 && (
            <Card className="flex flex-col items-center gap-3 border border-apple-border bg-white/[0.02] p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-apple-border bg-white/5 text-2xl shadow-apple-smooth">
                👥
              </div>
              <p className="py-1 text-sm font-medium text-apple-text-secondary">
                No active groups yet. Create one or join with an invite code to begin.
              </p>
            </Card>
          )}
        </div>

        <div className="relative z-10 sticky bottom-0 flex gap-3.5 border-t border-apple-border bg-apple-bg/90 pt-4 backdrop-blur-sm">
          <Button variant="secondary" className="flex-1 font-semibold text-sm" onClick={() => setModal('join')}>
            Join Group
          </Button>
          <Button variant="primary" className="flex-1 font-semibold text-sm" onClick={() => setModal('create')}>
            Create Group
          </Button>
        </div>
      </div>

      <Modal open={modal !== 'none'} onClose={closeModal}>
        <div className="mb-5 flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-apple-border bg-white/5 text-xl"
          >
            {modal === 'create' ? '🎉' : '🔗'}
          </motion.div>
          <h2 className="text-xl font-bold tracking-tight text-apple-text">
            {modal === 'create' ? 'New Group' : 'Join Group'}
          </h2>
        </div>
        <TextInput
          placeholder={modal === 'create' ? 'Group Name' : 'Invite Code'}
          label={modal === 'create' ? 'Name' : 'Code'}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          maxLength={modal === 'create' ? 40 : 6}
          inputMode={modal === 'join' ? 'numeric' : undefined}
          autoFocus
        />
        {error && <p className="mt-2.5 text-xs font-medium text-rose-500">{error}</p>}
        <Button
          variant={modal === 'create' ? 'primary' : 'accent'}
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

function GroupCard({ group, onOpen }: { group: Group; onOpen: () => void }) {
  const participants = groupParticipants(group)
  const profiles = useProfiles(participants)
  const f6 = isFantastic6Group(group)

  return (
    <Card 
      onClick={onOpen} 
      whileTap={{ scale: 0.98 }} 
      className="flex cursor-pointer items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-apple-border duration-200"
    >
      <div className="flex flex-col gap-0.5">
        <p className="text-base font-semibold tracking-tight text-apple-text">
          {group.name}
          {f6 && <span className="ml-1.5">✨</span>}
        </p>
        <p className="text-xs text-apple-text-secondary font-medium">
          {f6
            ? 'Secret crew · 6 members'
            : `${participants.length} ${participants.length === 1 ? 'member' : 'members'} · Code: ${group.inviteCode}`}
        </p>
      </div>
      <div className="flex -space-x-2">
        {participants.slice(0, f6 ? 6 : 4).map((uid) =>
          profiles[uid] ? (
            <div key={uid} className="p-0.5 bg-[#1c1c1e] rounded-full border border-apple-border shadow-sm">
              <CharacterAvatar characterId={profiles[uid].characterId} size={32} />
            </div>
          ) : (
            <div key={uid} className="h-8 w-8 rounded-full bg-white/5 border border-apple-border" />
          ),
        )}
      </div>
    </Card>
  )
}
