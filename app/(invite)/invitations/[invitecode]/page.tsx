import { prisma } from '@/lib/prisma'
import { IntialProfile } from '@/utils/initial-profile'
import { redirect } from 'next/navigation'
import { v4 as uuid } from 'uuid'
interface InviteCodeProps {
  params: Promise<{ invitecode: string }>
}
const Page = async ({ params }: InviteCodeProps) => {
  const profile = await IntialProfile()

  const { invitecode } = await params

  // Already member check
  const existingMember = await prisma.server.findFirst({
    where: {
      inviteCode: invitecode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })
  if (existingMember) {
    return redirect(`/servers/${existingMember.id}`)
  }

  const server = await prisma.server.findUnique({
    where: {
      inviteCode: invitecode,
    },
  })
  if (!server) {
    return redirect('/')
  }

  await prisma.server.update({
    where: {
      inviteCode: invitecode,
    },
    data: {
      inviteCode: uuid(),
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  })

  return redirect(`/servers/${server.id}`)
}
export default Page
