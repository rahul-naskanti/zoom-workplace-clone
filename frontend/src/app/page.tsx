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

  useEffect(() => {
    setTime(new Date())
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleNewMeeting = async () => {
    try {
      const m = await createInstant()
      if (m && m.meeting_code) {
        router.push(`/meeting/${m.meeting_code}`)
        return
      }
    } catch (e) {
      console.warn("Backend error, generating fallback instant meeting", e)
    }
    const id = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
    router.push(`/meeting/${id}`)
  }

  return (
    <div className="h-screen bg-[#E5E8EC] flex flex-col select-none">
      {/* TOPBAR */}
      <Topbar />

      <div className="flex flex-1 px-2 pb-2 gap-2 overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* MAIN CONTENT */}
        <main className="flex-1 bg-white rounded-[16px] flex flex-col items-center overflow-y-auto">
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
          <div className="flex gap-[48px] mt-[28px]">
            {/* New Meeting — orange */}
            <button onClick={handleNewMeeting} className="flex flex-col items-center gap-2 group">
              <div className="w-[48px] h-[48px] bg-[#FF742E] hover:bg-[#E56320] active:scale-95 rounded-[14px] flex items-center justify-center text-white transition">
                <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                  <path d="M3.5 8.5C3.5 7.12 4.62 6 6 6H16C17.38 6 18.5 7.12 18.5 8.5V19.5C18.5 20.88 17.38 22 16 22H6C4.62 22 3.5 20.88 3.5 19.5V8.5Z" fill="white" />
                  <path d="M20 10.5L24.5 7.5C25.1 7.1 25.9 7.5 25.9 8.2V19.8C25.9 20.5 25.1 20.9 24.5 20.5L20 17.5V10.5Z" fill="white" />
                  <line x1="2" y1="24" x2="26" y2="4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[12px] text-[#5F6368] font-normal flex items-center gap-1">
                New meeting
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="#5F6368" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </button>

            {/* Join — blue */}
            <button onClick={() => setShowJoin(true)} className="flex flex-col items-center gap-2 group">
              <div className="w-[48px] h-[48px] bg-[#0B5CFF] hover:bg-[#004BE0] active:scale-95 rounded-[14px] flex items-center justify-center text-white transition">
                <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                  <rect x="4" y="4" width="20" height="20" rx="5" stroke="white" strokeWidth="2.2" />
                  <line x1="14" y1="9" x2="14" y2="19" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                  <line x1="9" y1="14" x2="19" y2="14" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[12px] text-[#5F6368] font-normal">Join</span>
            </button>

            {/* Schedule — blue */}
            <button onClick={() => router.push('/schedule')} className="flex flex-col items-center gap-2 group">
              <div className="w-[48px] h-[48px] bg-[#0B5CFF] hover:bg-[#004BE0] active:scale-95 rounded-[14px] flex items-center justify-center text-white transition">
                <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                  <rect x="3.5" y="5.5" width="21" height="19" rx="3.5" stroke="white" strokeWidth="2" />
                  <line x1="9" y1="3" x2="9" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="19" y1="3" x2="19" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3.5" y1="11" x2="24.5" y2="11" stroke="white" strokeWidth="1.5" />
                  <text x="14" y="21" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="9" fill="white">19</text>
                </svg>
              </div>
              <span className="text-[12px] text-[#5F6368] font-normal">Schedule</span>
            </button>
          </div>

          {/* Calendar Card displaying Upcoming Meetings from Backend */}
          <MeetingCard />

          <div className="pb-16"></div>
        </main>
      </div>

      {/* MODALS */}
      <NewMeetingModal open={showNew} onClose={() => setShowNew(false)} meetingId={newMeetingId} />
      <JoinModal open={showJoin} onClose={() => setShowJoin(false)} />
      <ScheduleModal open={showSchedule} onClose={() => setShowSchedule(false)} />
    </div>
  )
}