import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Sidebar from '../organisms/Sidebar'
import ChannelSidebar from '../organisms/channelSidebar'

export function MobileMenutoggle({ serverId }: { serverId: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden  my-auto">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0 gap-0 dark:bg-[#1E1F22] md:hidden">
        <div className="flex h-full">
          {/* Server Sidebar - Fixed width like desktop */}
          <div className="w-[72px] flex flex-col justify-center items-center">
            <Sidebar />
          </div>

          {/* Channel Sidebar - Takes remaining space */}
          <div className="flex-1 overflow-y-auto bg-background/95">
            <ChannelSidebar serverId={serverId} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
