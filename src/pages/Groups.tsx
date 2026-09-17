import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import TextInput from '../components/ui/TextInput'
import OfflineBanner from '../components/ui/OfflineBanner'
import CharacterAvatar from '../components/characters/CharacterAvatar'
import { useAppStore } from '../lib/store'
import { useAnonymousAuth } from '../lib/useAnonymousAuth'
import { createGroup, joinGroupByCode, subscribeToUserGroups, type Group } from '../lib/groups'
import { useProfiles } from '../lib/useProfiles'

type Modal = 'none' | 'create' | 'join'

export default function Groups() {
  const navigate = useNavigate()
  const user = useAppStore((state) => state.user)
  const { user: authUser, error: authError } = useAnonymousAuth()

  const [groups, setGroups] = useState<Group[]>([])
  const [modal, setModal] = useState<Modal>('none')
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
    } catch {
      setError('Could not reach the server — check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleJoin = async () => {
    if (!authUser || !inputValue.trim()) return
    setBusy(true)
    setError(null)
    try {
      const groupId = await joinGroupByCode(inputValue.trim(), authUser.uid)
      closeModal()
      navigate(`/groups/${groupId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="safe-top safe-bottom safe-x flex flex-1 flex-col gap-5 px-5 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Your Groups</h1>
          {user && <p className="text-muted">Hey {user.name} 👋</p>}
        </div>
        {user && <CharacterAvatar characterId={user.characterId} size={48} />}
      </div>

      {authError && <OfflineBanner message="Firebase isn't connected yet — groups will sync once configured." />}

      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {groups.map((group, index) => (
            <motion.div
              key={group.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 260, damping: 24 }}
            >
              <GroupCard group={group} onOpen={() => navigate(`/groups/${group.id}`)} />
            </motion.div>
          ))}
        </AnimatePresence>

        {groups.length === 0 && (
          <Card className="text-center text-muted">No groups yet — create or join one to get started.</Card>
        )}
      </div>

      <div className="mt-auto flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={() => setModal('join')}>
          Join Group
        </Button>
        <Button className="flex-1" onClick={() => setModal('create')}>
          Create Group
        </Button>
      </div>

      <AnimatePresence>
        {modal !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="safe-x fixed inset-0 z-50 flex items-end justify-center bg-black/40"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              exit={{ y: 80 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="safe-bottom w-full max-w-sm rounded-t-[var(--radius-card)] bg-white p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <h2 className="mb-4 text-lg font-semibold text-ink">
                {modal === 'create' ? 'Create a group' : 'Join a group'}
              </h2>
              <TextInput
                placeholder={modal === 'create' ? 'Group name' : '6-digit code'}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                autoFocus
              />
              {error && <p className="mt-2 text-sm text-coral-dark">{error}</p>}
              <Button
                className="mt-4 w-full"
                disabled={busy || !inputValue.trim()}
                onClick={modal === 'create' ? handleCreate : handleJoin}
              >
                {busy ? 'Please wait...' : modal === 'create' ? 'Create' : 'Join'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function GroupCard({ group, onOpen }: { group: Group; onOpen: () => void }) {
  const profiles = useProfiles(group.memberIds)

  return (
    <Card onClick={onOpen} whileTap={{ scale: 0.98 }} className="flex cursor-pointer items-center justify-between">
      <div>
        <p className="font-semibold text-ink">{group.name}</p>
        <p className="text-sm text-muted">
          {group.memberIds.length} members · code {group.inviteCode}
        </p>
      </div>
      <div className="flex -space-x-2">
        {group.memberIds.slice(0, 4).map((uid) =>
          profiles[uid] ? (
            <CharacterAvatar key={uid} characterId={profiles[uid].characterId} size={36} />
          ) : (
            <div key={uid} className="h-9 w-9 rounded-full bg-cream-dim" />
          ),
        )}
      </div>
    </Card>
  )
}
