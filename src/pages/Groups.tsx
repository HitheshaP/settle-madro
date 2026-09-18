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
      setError('Connection timeout. Please retry.')
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
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="safe-top safe-bottom safe-x flex flex-1 flex-col gap-6 px-6 py-6 bg-apple-bg min-h-screen">
      <div className="flex items-center justify-between mt-2">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-apple-text">Groups</h1>
          {user && <p className="text-sm font-medium text-apple-text-secondary">Signed in as {user.name}</p>}
        </div>
        {user && (
          <div className="p-0.5 bg-white/5 rounded-full border border-apple-border shadow-apple-smooth">
            <CharacterAvatar characterId={user.characterId} size={44} />
          </div>
        )}
      </div>

      {authError && <OfflineBanner message="Offline Cache Mode · Local replication active" />}

      <div className="flex flex-col gap-3.5">
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
          <Card className="text-center bg-white/[0.02] border border-apple-border p-8">
            <p className="text-sm text-apple-text-secondary font-medium py-2">No active groups. Create or join one to begin.</p>
          </Card>
        )}
      </div>

      <div className="mt-auto flex gap-3.5 pt-4">
        <Button variant="secondary" className="flex-1 font-semibold text-sm" onClick={() => setModal('join')}>
          Join Group
        </Button>
        <Button variant="primary" className="flex-1 font-semibold text-sm" onClick={() => setModal('create')}>
          Create Group
        </Button>
      </div>

      <AnimatePresence>
        {modal !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="safe-x fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ ease: [0.25, 1, 0.5, 1], duration: 0.35 }}
              className="safe-bottom w-full max-w-md rounded-t-[24px] bg-[#1c1c1e]/90 border-t border-apple-border p-6 shadow-apple-intense backdrop-blur-[30px]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-white/10" />
              <h2 className="mb-5 text-xl font-bold tracking-tight text-apple-text">
                {modal === 'create' ? 'New Group' : 'Join Group'}
              </h2>
              <TextInput
                placeholder={modal === 'create' ? 'Group Name' : 'Invite Code'}
                label={modal === 'create' ? 'Name' : 'Code'}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                autoFocus
              />
              {error && <p className="mt-2.5 text-xs text-rose-500 font-medium">{error}</p>}
              <Button
                variant={modal === 'create' ? 'primary' : 'accent'}
                className="mt-6 w-full py-4 text-sm font-semibold"
                disabled={busy || !inputValue.trim()}
                onClick={modal === 'create' ? handleCreate : handleJoin}
              >
                {busy ? 'Processing...' : modal === 'create' ? 'Create' : 'Join'}
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
    <Card 
      onClick={onOpen} 
      whileTap={{ scale: 0.98 }} 
      className="flex cursor-pointer items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-apple-border duration-200"
    >
      <div className="flex flex-col gap-0.5">
        <p className="text-base font-semibold tracking-tight text-apple-text">{group.name}</p>
        <p className="text-xs text-apple-text-secondary font-medium">
          {group.memberIds.length} {group.memberIds.length === 1 ? 'member' : 'members'} · Code: {group.inviteCode}
        </p>
      </div>
      <div className="flex -space-x-2">
        {group.memberIds.slice(0, 4).map((uid) =>
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
