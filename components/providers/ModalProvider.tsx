'use client'
import { useEffect, useState } from 'react'
import CreateServerModal from '../organisms/modals/createserver-modal'
import InviteUserModal from '../organisms/modals/InviteUserModal'
import EditServerModal from '../organisms/modals/editservermodel'
import ManageUserModal from '../organisms/modals/manageusersmodel'
import { useModel } from '@/hooks/use-model'
import CreateChannelModal from '../organisms/modals/createchannel'
import LeaveServerModal from '../organisms/modals/leaveserver'
import DeleteServerModel from '../organisms/modals/Deleteserver'

const ModalProvider = () => {
  const { modelType } = useModel()
  const [IsMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  if (!IsMounted) return null
  if (modelType === null) return null
  return (
    <>
      <CreateServerModal />
      <InviteUserModal />
      <EditServerModal />
      <ManageUserModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModel />
    </>
  )
}
export default ModalProvider
