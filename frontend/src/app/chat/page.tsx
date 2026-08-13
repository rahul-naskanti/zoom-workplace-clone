"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Topbar from '../../components/Topbar'
import Sidebar from '../../components/Sidebar'
import {
  ZoomZ3PlusIcon,
  ZoomZ3DropdownIcon,
  ZoomZ3MenuIcon,
  ZoomZ3StarredIcon,
  ZoomZ3AppsIcon,
  ZoomZ3FilterIcon,
  ZoomChevronRight,
  ZoomChevronDown,
  ZoomZ3ChannelHashIcon,
  ZoomZ3DMsIcon,
  ZoomZ3MentionIcon,
  ZoomZ3ItalicHashIcon,
  ZoomZ3CalendarIcon,
  ZoomZ3MoreIcon
} from '../../components/ZoomIcons'

export default function ChatPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedChat, setSelectedChat] = useState<string | null>('self') // Default selected to Naskanti Rahul (You)
  const [messages, setMessages] = useState<any[]>([])
  const [chatInput, setChatInput] = useState('')
  const [showFeatureModal, setShowFeatureModal] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }
    setAuthorized(true)
  }, [])
  
  // Collapse/Expand section states
  const [starredOpen, setStarredOpen] = useState(false)
  const [dmsOpen, setDmsOpen] = useState(true)
  const [appsOpen, setAppsOpen] = useState(false)

  const handleSelect = (id: string) => {
    setSelectedChat(id)
    if (id === 'general' && messages.length === 0) {
      setMessages([
        { sender: 'System', text: 'Welcome to the #general channel! Type a message below to start collaborating.', time: 'Just now' }
      ])
    }
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    const sender = 'Naskanti Rahul'
    const newMsg = {
      sender,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    }
    setMessages(prev => [...prev, newMsg])
    setChatInput('')

    // Auto-respond for premium feel
    setTimeout(() => {
      const responses = [
        "Sounds like a plan! Let's sync up on this soon.",
        "Thanks for the update. I will review it right away.",
        "Got it, thanks!",
        "Excellent. Keep me posted on any progress."
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages(prev => [...prev, {
        sender: 'Alice Smith',
        text: randomResponse,
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      }])
    }, 1200)
  }

  if (!mounted || !authorized) {
    return <div className="h-screen bg-[#F0F2F5]"></div>
  }

  return (
    <div className="h-screen bg-[#E5E8EC] flex flex-col select-none font-['Inter',system-ui]">
      <Topbar />

      <div className="flex flex-1 px-2 pb-2 gap-2 overflow-hidden">
        <Sidebar activeTab="Chat" />

        <main className="flex-1 bg-white rounded-[16px] flex overflow-hidden shadow-sm">
          {/* LEFT - Team Chat List Panel */}
          <div className="w-[280px] border-r border-[#EDEEF1] bg-white flex flex-col h-full shrink-0">
            {/* Header row */}
            <div className="h-[52px] flex items-center px-4 justify-between border-b border-[#EDEEF1] shrink-0">
              <button 
                onClick={() => setSelectedChat(null)}
                className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1 rounded-lg transition"
              >
                <span className="font-bold text-[15px] text-[#1F2328]">Team Chat</span>
                <span className="text-gray-500 mt-0.5"><ZoomChevronDown size={10} /></span>
              </button>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-500 transition">
                  <ZoomZ3FilterIcon size={16} />
                </button>
                <button 
                  onClick={() => handleSelect('self')}
                  className="w-7 h-7 bg-[#0B5CFF] hover:bg-[#004BE0] active:scale-95 text-white rounded-full flex items-center justify-center transition shadow-sm"
                >
                  <ZoomZ3PlusIcon size={10} />
                </button>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="h-[46px] px-3 flex gap-2.5 items-center border-b border-[#F1F2F4] overflow-x-auto scrollbar-none shrink-0">
              {/* All filter */}
              <button
                onClick={() => setActiveFilter('All')}
                className={`h-7 px-3.5 rounded-full text-[12px] font-semibold transition shrink-0 ${
                  activeFilter === 'All'
                    ? 'bg-[#0E72ED] text-white shadow-sm border-none'
                    : 'bg-white border border-[#D0D5DD] text-[#1F2328] hover:bg-gray-50'
                }`}
              >
                All
              </button>

              {/* @ Mention filter */}
              <button
                onClick={() => setActiveFilter('@')}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition shrink-0 ${
                  activeFilter === '@'
                    ? 'bg-[#0E72ED] text-white shadow-sm border-none'
                    : 'bg-white border border-[#D0D5DD] text-[#5E6673] hover:bg-gray-50'
                }`}
                title="Mentions"
              >
                <ZoomZ3MentionIcon size={14} />
              </button>

              {/* Chat/DMs filter */}
              <button
                onClick={() => setActiveFilter('DMs')}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition shrink-0 ${
                  activeFilter === 'DMs'
                    ? 'bg-[#0E72ED] text-white shadow-sm border-none'
                    : 'bg-white border border-[#D0D5DD] text-[#5E6673] hover:bg-gray-50'
                }`}
                title="DMs"
              >
                <ZoomZ3DMsIcon size={14} />
              </button>

              {/* Channel filter */}
              <button
                onClick={() => setActiveFilter('Channels')}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition shrink-0 ${
                  activeFilter === 'Channels'
                    ? 'bg-[#0E72ED] text-white shadow-sm border-none'
                    : 'bg-white border border-[#D0D5DD] text-[#5E6673] hover:bg-gray-50'
                }`}
                title="Channels"
              >
                <ZoomZ3ItalicHashIcon size={14} />
              </button>

              {/* Calendar filter */}
              <button
                onClick={() => setActiveFilter('Calendar')}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition shrink-0 ${
                  activeFilter === 'Calendar'
                    ? 'bg-[#0E72ED] text-white shadow-sm border-none'
                    : 'bg-white border border-[#D0D5DD] text-[#5E6673] hover:bg-gray-50'
                }`}
                title="Meeting Chats"
              >
                <ZoomZ3CalendarIcon size={14} />
              </button>

              {/* More options filter */}
              <button
                onClick={() => setActiveFilter('More')}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition shrink-0 ${
                  activeFilter === 'More'
                    ? 'bg-[#0E72ED] text-white shadow-sm border-none'
                    : 'bg-white border border-[#D0D5DD] text-[#5E6673] hover:bg-gray-50'
                }`}
                title="More filters"
              >
                <ZoomZ3MoreIcon size={14} />
              </button>
            </div>

            {/* Channels & Chats List with Exact Spacing */}
            <div className="flex-1 overflow-y-auto p-2 bg-[#FFFFFF] space-y-3">
              {/* Starred Section */}
              <div className="space-y-0.5">
                <button 
                  onClick={() => setStarredOpen(!starredOpen)}
                  className="w-full text-left px-2 py-1.5 hover:bg-gray-50 rounded-lg flex items-center gap-2 text-[#5E6673] transition"
                >
                  <span className="text-gray-400 transition-transform duration-200">
                    {starredOpen ? <ZoomChevronDown size={10} /> : <ZoomChevronRight size={10} />}
                  </span>
                  <span className="text-gray-400">
                    <ZoomZ3StarredIcon size={16} />
                  </span>
                  <span className="text-[13px] font-normal text-[#1F2328]">Starred</span>
                </button>
                {starredOpen && (
                  <div className="ml-6 space-y-0.5">
                    <div className="text-[11px] text-gray-400 px-3 py-1">No starred messages</div>
                  </div>
                )}
              </div>

              {/* DMs and channels Section */}
              <div className="space-y-0.5">
                <button 
                  onClick={() => setDmsOpen(!dmsOpen)}
                  className="w-full text-left px-2 py-1.5 hover:bg-gray-50 rounded-lg flex items-center gap-2 text-[#5E6673] transition"
                >
                  <span className="text-gray-400 transition-transform duration-200">
                    {dmsOpen ? <ZoomChevronDown size={10} /> : <ZoomChevronRight size={10} />}
                  </span>
                  <span className="text-gray-400">
                    <ZoomZ3DMsIcon size={16} />
                  </span>
                  <span className="text-[13px] font-normal text-[#1F2328]">DMs and channels</span>
                </button>

                {dmsOpen && (
                  <div className="space-y-0.5 transition-all">
                    {/* Naskanti Rahul (You) */}
                    <button 
                      onClick={() => handleSelect('self')}
                      className={`w-full text-left ml-6 pr-3 py-1.5 rounded-lg flex items-center gap-2 text-[13px] transition ${
                        selectedChat === 'self'
                          ? 'bg-[#EBF3FF] text-[#0B5CFF] font-semibold'
                          : 'text-[#1F2328] hover:bg-gray-50'
                      }`}
                    >
                      <span className="w-5 h-5 bg-[#FF6A2B] rounded-full flex items-center justify-center text-white text-[10px] font-bold relative shrink-0">
                        N
                        <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-500 border border-white rounded-full"></span>
                      </span>
                      <span className="truncate">Naskanti Rahul (You)</span>
                    </button>

                    {/* general Channel */}
                    <button 
                      onClick={() => handleSelect('general')}
                      className={`w-full text-left ml-6 pr-3 py-1.5 rounded-lg flex items-center gap-2 text-[13px] transition ${
                        selectedChat === 'general'
                          ? 'bg-[#EBF3FF] text-[#0B5CFF] font-semibold'
                          : 'text-[#1F2328] hover:bg-gray-50'
                      }`}
                    >
                      <span className={`shrink-0 ${selectedChat === 'general' ? 'text-[#0B5CFF]' : 'text-gray-400'}`}>
                        <ZoomZ3ChannelHashIcon size={16} />
                      </span>
                      <span className="truncate">general</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Apps Section */}
              <div className="space-y-0.5">
                <button 
                  onClick={() => setAppsOpen(!appsOpen)}
                  className="w-full text-left px-2 py-1.5 hover:bg-gray-50 rounded-lg flex items-center gap-2 text-[#5E6673] transition"
                >
                  <span className="text-gray-400 transition-transform duration-200">
                    {appsOpen ? <ZoomChevronDown size={10} /> : <ZoomChevronRight size={10} />}
                  </span>
                  <span className="text-gray-400">
                    <ZoomZ3AppsIcon size={16} />
                  </span>
                  <span className="text-[13px] font-normal text-[#1F2328]">Apps</span>
                </button>
                {appsOpen && (
                  <div className="ml-6 space-y-0.5">
                    <div className="text-[11px] text-gray-400 px-3 py-1">No apps configured</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT - Active Chat Panel */}
          <div className="flex-1 bg-[#F8F9FB] flex flex-col h-full min-w-0">
            {selectedChat ? (
              <>
                {/* Active Chat Header */}
                <div className="h-[52px] bg-white border-b border-[#EDEEF1] px-6 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 bg-[#FF6A2B] rounded-full flex items-center justify-center text-white text-[14px] font-bold relative shrink-0">
                      N
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full"></span>
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[14px] text-black truncate">
                        {selectedChat === 'self' ? 'Naskanti Rahul (You)' : '#general'}
                      </span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-black transition">
                    <span className="text-[18px]">🔍</span>
                  </button>
                </div>

                {/* Sub-header tabs */}
                <div className="h-[36px] bg-white border-b border-[#EDEEF1] px-6 flex items-center gap-6 text-[13px] shrink-0">
                  <span className="font-semibold text-[#0B5CFF] border-b-2 border-[#0B5CFF] h-full flex items-center gap-1.5 cursor-pointer">
                    💬 Chat
                  </span>
                  <span className="text-gray-500 hover:text-black cursor-pointer h-full flex items-center gap-1.5">
                    🗂️ Resources
                  </span>
                  <span className="text-gray-400 hover:text-black cursor-pointer font-bold">+</span>
                </div>

                {/* Chat Messages viewport */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-[#FFFFFF]">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <img 
                        src="/chat-empty.png" 
                        alt="Begin chatting below" 
                        className="w-[160px] h-[160px] object-contain mb-4 opacity-90"
                      />
                      <p className="text-[13px] text-[#6B7280] font-medium">Begin chatting below</p>
                    </div>
                  ) : (
                    <div className="w-full max-w-[640px] mx-auto space-y-4">
                      {messages.map((m, i) => (
                        <div key={i} className="flex gap-3 items-start animate-fade-in">
                          <div className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 shadow-sm ${
                            m.sender === 'System' ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {m.sender.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="font-bold text-black text-[12px] truncate">{m.sender}</span>
                              <span className="text-[10px] text-gray-400 shrink-0">{m.time}</span>
                            </div>
                            <p className={`text-[12px] text-gray-700 mt-1 leading-relaxed p-2.5 rounded-r-lg rounded-bl-lg break-words shadow-sm ${
                              m.sender === 'System' ? 'bg-gray-100/80 border border-gray-200 text-gray-500' : 'bg-white border border-gray-100'
                            }`}>
                              {m.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Composer Box (Input & toolbar) */}
                <form onSubmit={handleSend} className="p-4 bg-white border-t border-[#EDEEF1] shrink-0">
                  <div className="border border-[#D0D5DD] rounded-[12px] bg-[#F9FAFB] p-2 focus-within:border-[#0B5CFF] focus-within:bg-white transition-all shadow-sm">
                    <input 
                      value={chatInput} 
                      onChange={e => setChatInput(e.target.value)} 
                      placeholder="Send a message..." 
                      className="w-full bg-transparent outline-none text-[13.5px] text-black px-2 py-2 placeholder-gray-400" 
                    />
                    <div className="flex items-center gap-3.5 mt-2 text-[#5E6673] text-[13px] px-2">
                      <button type="button" className="hover:text-black font-semibold">T</button>
                      <button type="button" className="hover:text-black">☺</button>
                      <button type="button" className="hover:text-black font-bold text-[10px] bg-gray-200 px-1 py-0.5 rounded leading-none">GIF</button>
                      <button type="button" className="hover:text-black">📎</button>
                      <button type="button" className="hover:text-black">⧉</button>
                      <button type="button" className="hover:text-black">⤢</button>
                      
                      <span className="w-px h-4 bg-gray-300 mx-0.5" />
                      
                      <button type="button" className="hover:text-black">💬</button>
                      <button type="button" className="hover:text-black">📹</button>
                      <button type="button" className="hover:text-black">···</button>

                      <div className="ml-auto flex items-center gap-1.5">
                        <span className="bg-[#E5E7EB] hover:bg-gray-300 p-1.5 rounded-lg text-gray-500 cursor-pointer text-[10px]">▼</span>
                        <button 
                          type="submit" 
                          disabled={!chatInput.trim()}
                          className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition shadow-sm ${
                            chatInput.trim() 
                              ? 'bg-[#0B5CFF] text-white hover:bg-[#004BE0]' 
                              : 'bg-[#E5E7EB] text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <img 
                  src="/chat-empty.png" 
                  alt="No Chat Selected" 
                  className="w-[160px] h-[160px] object-contain mb-4 opacity-90"
                />
                <p className="text-[13px] text-[#6B7280] font-medium leading-5 max-w-[280px]">
                  Start chatting by clicking or creating a chat on the left panel.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Feature Not Implemented Modal Popup */}
      {showFeatureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-[16px] p-8 shadow-2xl max-w-sm w-[90%] text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5 text-[#0B5CFF]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </div>
            <h2 className="text-[18px] font-bold text-[#1A1D1F] mb-2">Feature Not Implemented</h2>
            <p className="text-[13.5px] text-[#6B7280] leading-relaxed mb-6">
              The Team Chat messaging features are currently in development and have not been implemented.
            </p>
            <button
              onClick={() => {
                setShowFeatureModal(false)
                router.push('/')
              }}
              style={{
                backgroundColor: '#0B5CFF',
                color: '#ffffff',
                padding: '8px 24px',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                width: '100%'
              }}
              className="hover:bg-[#004BE0] active:scale-[0.98] transition shadow-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}