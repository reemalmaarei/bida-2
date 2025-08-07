import BottomNavigation from '@/components/ui/BottomNavigation'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className="pb-20">
        {children}
      </main>
      <BottomNavigation />
    </>
  )
}