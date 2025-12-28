import { Channel, Server } from '@/lib/generated/prisma/client'
import { create } from 'zustand'
export type ModelType =
  | 'createServer'
  | 'inviteserver'
  | 'editserver'
  | 'manageserveruser'
  | 'createchannel'
  | 'leaveserver'
  | 'deleteserver'
  | 'deletechannel'
  | 'editchannel'
type Modeldata = {
  server?: Server
  channel?: Channel
}
interface UseModelProps {
  modelType: ModelType | null
  data: Modeldata
  onClose: () => void
  isOpen: boolean
  onOpen: (type: ModelType, data: Modeldata) => void
}
export const useModel = create<UseModelProps>((set) => ({
  modelType: null,
  isOpen: false,
  data: { server: undefined },
  onOpen: (type: ModelType, data: Modeldata) => set({ isOpen: true, modelType: type, data }),
  onClose: () => set({ isOpen: false }),
}))
