import { Member, Profile, Server } from './lib/generated/prisma/client'

export type serverwithprofilewithmembers = Server & {
  members: (Member & { profile: Profile })[]
}
