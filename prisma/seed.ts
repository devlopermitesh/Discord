import { prisma } from '@/lib/prisma'

async function main() {
  console.log('Nothing to Seed ✨✨🐈')
}
main().finally(async () => await prisma.$disconnect())
