import Sidebar from '@/components/organisms/Sidebar'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {/* for temp update this later  */}
      <Sidebar className=" md:flex w-[72px] h-full flex-col " />
      <main className="pl-[72px]">{children}</main>
    </div>
  )
}
export default MainLayout
