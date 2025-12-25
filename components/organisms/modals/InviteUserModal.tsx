'use client'

import { CopyInput } from '@/components/atoms/CopyInput'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ENDPOINTS } from '@/config'
import { api } from '@/config/api'
import { useModel } from '@/hooks/use-model'
import { useOrigin } from '@/hooks/use-origin'
import { cn } from '@/lib/utils'
import { RefreshCcw } from 'lucide-react'
import { useState } from 'react'

const InviteUserModal = () => {
  const { isOpen, modelType, onClose, data, onOpen } = useModel()
  const [generating, setgenerating] = useState(false)
  const origin = useOrigin()
  const { server } = data
  const inviteLink = `${origin}/invitations/${server?.inviteCode}`
  const regenerate = async () => {
    try {
      setgenerating(true)
      const serverId = server?.id

      if (!serverId) {
        throw Error('cant process your request for now!')
      }
      const response = await api.patch(ENDPOINTS.updateinvitecode(serverId), { server: data })
      if (!response) {
        throw Error('something went wrong try again')
      }
      console.log('Response', response)
      onOpen('inviteserver', { server: response.data.data })
    } catch (error) {
      console.log(error)
    } finally {
      setgenerating(false)
    }
  }

  return (
    <Dialog open={isOpen && modelType == 'inviteserver'} onOpenChange={onClose}>
      <DialogContent
        className="
    bg-background text-primary
    overflow-y-auto 
    max-h-[90vh] 
    sm:max-h-[85vh] 
    rounded-xl 
    p-6 
    sm:p-8
    no-scrollbar
  "
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl sm:text-2xl font-semibold tracking-tight">
            Invite your friend to
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            Share this link to Other to grant access in your server
          </DialogDescription>
        </DialogHeader>
        <CopyInput value={inviteLink} />
        <DialogFooter className="">
          <Button onClick={regenerate} variant={'link'} className="mr-auto cursor-pointer">
            Generate a new link
            <RefreshCcw className={cn('ml-2 h-4 w-4', generating && 'animate-spin')} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InviteUserModal
