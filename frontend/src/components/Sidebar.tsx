"use client"
import { useRouter } from 'next/navigation'
import { IconHome, IconMeetings, IconChat, IconMore, IconSettings } from './ZoomNavIcons'

export default function Sidebar({ activeTab = 'Home', onTabChange }: { activeTab?: string; onTabChange?: (tab: string) => void }) {
  const router = useRouter()
  const items = [
    { icon: IconHome, label: 'Home', path: '/' },
    { icon: IconMeetings, label: 'Meetings', path: '/meetings' },
    { icon: IconChat, label: 'Chat', path: '/chat' },
    { icon: IconMore, label: 'More', path: '/more' },
  ]

  const handleClick = (item: { label: string; path: string }) => {
    if (onTabChange) {
      onTabChange(item.label)
    }
    router.push(item.path)
  }

  return (
    <aside className="w-[68px] shrink-0 flex flex-col justify-between h-full py-4">
      <div className="flex flex-col gap-1">
        {items.map(item => {
          const isActive = activeTab === item.label
          return (
            <button
              key={item.label}
              onClick={() => handleClick(item)}
              className={`w-[52px] h-[52px] mx-auto flex flex-col items-center justify-center rounded-[12px] gap-0.5 transition-all duration-150 ${
                isActive
                  ? 'bg-white text-black shadow-[0_1px_3px_rgba(0,0,0,0.08)] font-medium'
                  : 'text-[#5E6673] hover:bg-[#E1E4E8]/60'
              }`}
            >
              {item.label === 'Home' ? (
                <IconHome size={20} filled={isActive} />
              ) : (
                <item.icon size={20} />
              )}
              <span className="text-[11px] tracking-wide">{item.label}</span>
            </button>
          )
        })}
      </div>
      <button className="mx-auto w-[32px] h-[32px] flex items-center justify-center text-[#5E6673]">
        <IconSettings size={18} />
      </button>
    </aside>
  )
}
