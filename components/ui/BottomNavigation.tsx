'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Target, BookOpen, Users, User } from 'lucide-react'

const navItems = [
  { href: '/activities', label: 'Activities', icon: Home },
  { href: '/milestones', label: 'Milestones', icon: Target },
  { href: '/resources', label: 'Resources', icon: BookOpen },
  { href: '/experts', label: 'Experts', icon: Users },
  { href: '/profile', label: 'Profile', icon: User },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-gray-200 safe-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-periwinkle' : 'text-gray-400'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}