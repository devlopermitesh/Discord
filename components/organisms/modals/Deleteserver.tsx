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
import { Input } from '@/components/ui/input'
import { ENDPOINTS } from '@/config'
import { api } from '@/config/api'
import { useModel } from '@/hooks/use-model'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const DeleteServerModel = () => {
  const { isOpen, modelType, onClose, data } = useModel()
  const [Servername, setServerName] = useState('')
  const [isValid, setisValid] = useState(false)
  const [processing, setprocessing] = useState(false)
  const { server } = data
  const router = useRouter()

  const deleteserver = async () => {
    try {
      setprocessing(true)
      const serverId = server?.id

      if (!serverId) {
        throw Error('cant process your request for now!')
      }
      const response = await api.delete(ENDPOINTS.deleteserver(serverId))
      if (!response) {
        throw Error('something went wrong try again')
      }
      console.log('Response', response)
      router.push('/')
    } catch (error) {
      console.log(error)
    } finally {
      setServerName('')
      setisValid(false)
      setprocessing(false)
    }
  }
  useEffect(() => {
    if (Servername === server?.title) {
      setisValid(true)
    } else {
      setisValid(false)
    }
  }, [Servername, server?.title, isValid])
  return (
    <Dialog open={isOpen && modelType == 'deleteserver'} onOpenChange={onClose}>
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
            Delete Server
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            If you delete server all the channels will be gone and chats too
          </DialogDescription>
        </DialogHeader>

        <p className={'text-muted-foreground text-sm'}>
          Enter server name `{server?.title}` for delete
        </p>
        <Input
          className="flex w-full"
          value={Servername}
          onChange={(e) => setServerName(e.target.value)}
        />

        <DialogFooter className="flex items-center">
          <Button>Cancel</Button>
          <Button
            disabled={!isValid}
            onClick={deleteserver}
            className="text-white bg-red-500 
                    hover:bg-red-600"
          >
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteServerModel
