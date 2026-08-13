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
    <>
      {/* DESKTOP SIDEBAR - Hidden on mobile/tablet */}
      <aside className="hidden md:flex w-[68px] shrink-0 flex-col justify-between h-full py-4 bg-[#E5E8EC]">
        <div className="flex flex-col gap-1">
          {items.map(item => {
            const isActive = activeTab === item.label
            return (
              <button
                key={item.label}
                onClick={() => handleClick(item)}
                className={`w-[46px] h-[46px] mx-auto flex flex-col items-center justify-center rounded-[10px] gap-0.5 transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-black shadow-[0_1px_3px_rgba(0,0,0,0.08)] font-medium'
                    : 'text-[#5E6673] hover:bg-[#E1E4E8]/60'
                }`}
              >
                {item.label === 'Home' ? (
                  <IconHome size={17} filled={isActive} />
                ) : (
                  <item.icon size={17} />
                )}
                <span className="text-[10px] tracking-wide">{item.label}</span>
              </button>
            )
          })}
        </div>
        <button className="mx-auto w-[32px] h-[32px] flex items-center justify-center text-[#5E6673]">
          <IconSettings size={16} />
        </button>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR - Visible only on mobile/tablet */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[56px] bg-white border-t border-[#EDEEF1] flex justify-around items-center z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {items.map(item => {
          const isActive = activeTab === item.label
          return (
            <button
              key={item.label}
              onClick={() => handleClick(item)}
              className={`flex flex-col items-center justify-center px-3 py-1.5 gap-0.5 rounded-lg transition ${
                isActive ? 'text-[#0B5CFF] font-semibold' : 'text-[#5E6673]'
              }`}
            >
              {item.label === 'Home' ? (
                <IconHome size={18} filled={isActive} />
              ) : (
                <item.icon size={18} />
              )}
              <span className="text-[9px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  )
}
