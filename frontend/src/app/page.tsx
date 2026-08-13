"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Topbar from '../components/Topbar'
import Sidebar from '../components/Sidebar'
import MeetingCard from '../components/MeetingCard'
import NewMeetingModal from '../components/NewMeetingModal'
import JoinModal from '../components/JoinModal'
import ScheduleModal from '../components/ScheduleModal'
import { createInstant } from '@/lib/api'

export default function ZoomHome() {
  const router = useRouter()
  const [time, setTime] = useState<Date | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [newMeetingId, setNewMeetingId] = useState("")
  const [activeTab, setActiveTab] = useState("Home")
  const [authorized, setAuthorized] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Authentication guard
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }
    setAuthorized(true)

    setTime(new Date())
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const storeMeetingId = (code: string) => {
    const stored = JSON.parse(localStorage.getItem('validMeetings') || '[]')
    if (!stored.includes(code)) {
      stored.push(code)
      localStorage.setItem('validMeetings', JSON.stringify(stored))
    }
  }

  const handleNewMeeting = async () => {
    try {
      const m = await createInstant()
      if (m && m.meeting_code) {
        storeMeetingId(m.meeting_code)
        router.push(`/meeting/${m.meeting_code}`)
        return
      }
    } catch (e) {
      console.warn("Backend error, generating fallback instant meeting", e)
    }
    const id = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
    storeMeetingId(id)
    router.push(`/meeting/${id}`)
  }

  if (!mounted || !authorized) {
    return <div className="h-screen bg-[#F0F2F5]"></div>
  }

  return (
    <div className="h-screen bg-[#E5E8EC] flex flex-col select-none">
      {/* TOPBAR */}
      <Topbar />

      <div className="flex flex-1 px-2 pb-[64px] md:pb-2 gap-2 overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* MAIN CONTENT */}
        <main className="flex-1 bg-white rounded-[16px] flex flex-col items-center overflow-hidden">
          {/* Clock */}
          <div className="pt-[48px] text-center">
            <h1 className="text-[36px] font-semibold tracking-tight text-[#1A1D1F] leading-none">
              {time ? time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '\u00A0'}
            </h1>
            <p className="text-[13px] text-[#6B7280] mt-1 font-normal">
              {time ? time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : '\u00A0'}
            </p>
          </div>

          {/* Action buttons: New meeting, Join, Schedule */}
          <div className="flex gap-[24px] sm:gap-[48px] mt-[24px] sm:mt-[28px]">
            {/* New Meeting — orange bg, white filled camera + slash */}
            <button onClick={handleNewMeeting} className="flex flex-col items-center gap-2 group">
              <div className="w-[48px] h-[48px] bg-[#FF742E] hover:bg-[#E56320] active:scale-95 rounded-[14px] flex items-center justify-center transition">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  {/* Camera body - filled white rounded rect */}
                  <rect x="3" y="8" width="17" height="16" rx="3" fill="white"/>
                  {/* Camera lens - filled white triangle */}
                  <path d="M22 12.5L28 9V23L22 19.5V12.5Z" fill="white"/>
                  {/* Diagonal slash */}
                  <line x1="4" y1="27" x2="28" y2="5" stroke="#FF742E" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="3" y1="28" x2="29" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-[12px] text-[#5F6368] font-normal flex items-center gap-1">
                New meeting
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="#5F6368" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </button>

            {/* Join — blue bg, filled white rounded square + blue + inside */}
            <button onClick={() => setShowJoin(true)} className="flex flex-col items-center gap-2 group">
              <div className="w-[48px] h-[48px] bg-[#0B5CFF] hover:bg-[#004BE0] active:scale-95 rounded-[14px] flex items-center justify-center transition">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  {/* Filled white rounded square */}
                  <rect x="6" y="6" width="20" height="20" rx="5" fill="white"/>
                  {/* Blue + cross inside */}
                  <line x1="16" y1="11" x2="16" y2="21" stroke="#0B5CFF" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="11" y1="16" x2="21" y2="16" stroke="#0B5CFF" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-[12px] text-[#5F6368] font-normal">Join</span>
            </button>

            {/* Schedule — blue bg, filled white calendar + blue "19" */}
            <button onClick={() => router.push('/schedule')} className="flex flex-col items-center gap-2 group">
              <div className="w-[48px] h-[48px] bg-[#0B5CFF] hover:bg-[#004BE0] active:scale-95 rounded-[14px] flex items-center justify-center transition">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  {/* Calendar body - filled white */}
                  <rect x="5" y="8" width="22" height="19" rx="3" fill="white"/>
                  {/* Calendar hooks/pins at top */}
                  <line x1="11" y1="5" x2="11" y2="11" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                  <line x1="21" y1="5" x2="21" y2="11" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                  {/* Horizontal divider line */}
                  <line x1="5" y1="14" x2="27" y2="14" stroke="#0B5CFF" strokeWidth="1" opacity="0.3"/>
                  {/* "19" text in blue */}
                  <text x="16" y="23.5" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="10" fill="#0B5CFF">19</text>
                </svg>
              </div>
              <span className="text-[12px] text-[#5F6368] font-normal">Schedule</span>
            </button>
          </div>

          {/* Calendar Card displaying Upcoming Meetings from Backend */}
          <MeetingCard />
        </main>
      </div>

      {/* MODALS */}
      <NewMeetingModal open={showNew} onClose={() => setShowNew(false)} meetingId={newMeetingId} />
      <JoinModal open={showJoin} onClose={() => setShowJoin(false)} />
      <ScheduleModal open={showSchedule} onClose={() => setShowSchedule(false)} />
    </div>
  )
}