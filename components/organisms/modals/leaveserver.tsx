'use client'

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
import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useState } from 'react'

const LeaveServerModal = () => {
  const { isOpen, modelType, onClose, data } = useModel()
  const [processing, setprocessing] = useState(false)
  const { server } = data

  const leaveserver = async () => {
    try {
      setprocessing(true)
      const serverId = server?.id

      if (!serverId) {
        throw Error('cant process your request for now!')
      }
      const response = await api.post(ENDPOINTS.leaveserver(serverId))
      if (!response) {
        throw Error('something went wrong try again')
      }
      console.log('Response', response)
      redirect('/')
    } catch (error) {
      console.log(error)
    } finally {
      setprocessing(false)
    }
  }

  return (
    <Dialog open={isOpen && modelType == 'leaveserver'} onOpenChange={onClose}>
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
            Leave server
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            If you leave server you would not longer see updates!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center">
          <Button>Cancel</Button>
          <Button
            onClick={leaveserver}
            className="text-white bg-red-500 
                    hover:bg-red-600"
          >
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Leave'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LeaveServerModal
