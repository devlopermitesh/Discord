import { Server } from '@/lib/generated/prisma/client'
import { create } from 'zustand'
type ModelType =
  | 'createServer'
  | 'inviteserver'
  | 'editserver'
  | 'manageserveruser'
  | 'createchannel'
  | 'leaveserver'
  | 'deleteserver'
type Modeldata = {
  server?: Server
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
