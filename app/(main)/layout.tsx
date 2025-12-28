import Sidebar from '@/components/organisms/Sidebar'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar - Hidden on mobile, fixed width */}
      <Sidebar className="hidden md:flex w-[72px] flex-col fixed inset-y-0 left-0 z-50" />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:pl-[72px] transition-all duration-300">
        {children}
      </main>
    </div>
  )
}

export default MainLayout
