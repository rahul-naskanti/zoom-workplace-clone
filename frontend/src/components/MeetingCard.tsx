"use client"
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getUpcoming } from '@/lib/api'

export default function MeetingCard() {
  const router = useRouter()
  const [upcoming, setUpcoming] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showFilter, setShowFilter] = useState(false)
  const [activeFilter, setActiveFilter] = useState('hosted')
  const filterRef = useRef<HTMLDivElement>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)

  const fetchMeetings = () => {
    getUpcoming().then(data => {
      if (Array.isArray(data)) {
        setUpcoming(data)
      }
    }).catch(err => {
      console.warn("Failed to load upcoming meetings from backend", err)
    })
  }

  useEffect(() => {
    fetchMeetings()
  }, [])

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Date helpers
  const addDays = (d: Date, n: number) => {
    const result = new Date(d)
    result.setDate(result.getDate() + n)
    return result
  }

  const formatHeaderDate = (d: Date) => {
    const today = new Date()
    const isToday = d.toDateString() === today.toDateString()
    const tomorrow = addDays(today, 1)
    const isTomorrow = d.toDateString() === tomorrow.toDateString()
    const yesterday = addDays(today, -1)
    const isYesterday = d.toDateString() === yesterday.toDateString()

    let label = d.toLocaleDateString('en-US', { weekday: 'long' })
    if (isToday) label = 'Today'
    else if (isTomorrow) label = 'Tomorrow'
    else if (isYesterday) label = 'Yesterday'

    const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return `${label}, ${monthDay}`
  }

  // Match meeting date string against selected date
  // Handles both "YYYY-MM-DD" and "DD/MM/YYYY" formats
  const matchesDate = (meetingDate: string, target: Date) => {
    if (!meetingDate) return false
    const targetStr = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`

    // Try YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(meetingDate)) {
      return meetingDate === targetStr
    }
    // Try DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(meetingDate)) {
      const [dd, mm, yyyy] = meetingDate.split('/')
      return `${yyyy}-${mm}-${dd}` === targetStr
    }
    return false
  }

  const filtered = upcoming.filter(m => matchesDate(m.date, selectedDate))

  const isToday = selectedDate.toDateString() === new Date().toDateString()

  return (
    <div className="mt-[36px] w-[580px] max-w-[92%] border border-[#E5E7EB] rounded-[12px] overflow-hidden bg-white shadow-sm">
      {/* Info banner - inside card with margin */}
      <div className="m-[12px] bg-[#F0F6FF] border border-[#BFD3FF] rounded-[8px] p-[10px_12px] flex gap-2 items-start">
        <div className="w-4 h-4 rounded-full border border-[#0B5CFF] text-[#0B5CFF] flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-serif font-bold">i</div>
        <p className="text-[12px] leading-[16px] text-[#1A1D1F]">
          You haven&apos;t connected your calendar yet.{" "}
          <span className="text-[#0B5CFF] cursor-pointer hover:underline font-semibold">Connect now</span>{" "}
          to manage all your meetings and events in one place.
        </p>
      </div>

      {/* Today header - dynamic date with dropdown */}
      <div className="h-[44px] border-y border-[#EDEEF1] flex items-center justify-center relative">
        <button 
          onClick={() => dateInputRef.current?.showPicker?.()}
          className="text-[13px] font-semibold flex items-center gap-1 text-[#1A1D1F] hover:text-[#0B5CFF] transition cursor-pointer"
        >
          {formatHeaderDate(selectedDate)}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 5.5L7 8.5L10 5.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {/* Hidden date input for native date picker */}
        <input 
          ref={dateInputRef}
          type="date" 
          value={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`}
          onChange={e => {
            const parts = e.target.value.split('-')
            if (parts.length === 3) {
              setSelectedDate(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])))
            }
          }}
          className="absolute opacity-0 w-0 h-0 pointer-events-none"
        />
        <button className="absolute right-3 text-[#6B7280] hover:text-black">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 2H4a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-2M8 8l6-6m0 0H10m4 0v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Toolbar - interactive date navigation & filter */}
      <div className="h-[40px] border-b border-[#EDEEF1] flex items-center px-3 gap-1 relative">
        {/* Today button */}
        <button
          onClick={() => setSelectedDate(new Date())}
          style={{
            backgroundColor: isToday ? '#F1F2F4' : 'transparent',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 500,
            color: '#1A1D1F',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            border: isToday ? 'none' : '1px solid #E5E7EB'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1.5" y="2.5" width="9" height="8" rx="1.5" stroke="#0B5CFF" strokeWidth="1"/><line x1="4" y1="1.5" x2="4" y2="3.5" stroke="#0B5CFF" strokeWidth="1" strokeLinecap="round"/><line x1="8" y1="1.5" x2="8" y2="3.5" stroke="#0B5CFF" strokeWidth="1" strokeLinecap="round"/><line x1="1.5" y1="5" x2="10.5" y2="5" stroke="#0B5CFF" strokeWidth="0.8"/></svg>
          Today
        </button>

        {/* Left arrow - previous day */}
        <button
          onClick={() => setSelectedDate(prev => addDays(prev, -1))}
          className="ml-1 hover:bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center transition"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round"><path d="M10 3L5 8L10 13"/></svg>
        </button>

        {/* Right arrow - next day */}
        <button
          onClick={() => setSelectedDate(prev => addDays(prev, 1))}
          className="hover:bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center transition"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round"><path d="M6 3L11 8L6 13"/></svg>
        </button>

        <div className="flex-1"></div>

        {/* Filter dots button */}
        <div ref={filterRef} className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="mr-2 hover:bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center transition"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="4" cy="8" r="1.2" fill="#6B7280"/><circle cx="8" cy="8" r="1.2" fill="#6B7280"/><circle cx="12" cy="8" r="1.2" fill="#6B7280"/></svg>
          </button>

          {/* Filter Dropdown */}
          {showFilter && (
            <div className="absolute right-0 top-8 bg-white border border-[#E5E7EB] rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] w-[220px] py-2 z-50">
              <p className="px-4 py-1.5 text-[11px] text-[#9599A6] font-medium">Filter by</p>
              {[
                { key: 'hosted', label: 'Hosted by you' },
                { key: 'recordings', label: 'With cloud recordings' },
                { key: 'summary', label: 'With meeting summary' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => { setActiveFilter(f.key); setShowFilter(false) }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: activeFilter === f.key ? 600 : 400,
                    color: activeFilter === f.key ? '#0B5CFF' : '#1A1D1F',
                    backgroundColor: 'transparent',
                    border: activeFilter === f.key ? '1px solid #0B5CFF' : '1px solid transparent',
                    borderRadius: '6px',
                    margin: '0 8px',
                    cursor: 'pointer',
                    display: 'block',
                    boxSizing: 'border-box' as const
                  }}
                  className="hover:bg-[#F5F6F8] transition"
                >
                  {f.label}
                </button>
              ))}
              <div className="border-t border-[#EDEEF1] mt-2 pt-1 mx-2">
                <button
                  onClick={() => { fetchMeetings(); setShowFilter(false) }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 16px',
                    fontSize: '13px',
                    color: '#1A1D1F',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  className="hover:bg-[#F5F6F8] rounded-[6px] transition"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 7a5.5 5.5 0 1011 0 5.5 5.5 0 00-11 0z" stroke="#6B7280" strokeWidth="1.2"/><path d="M7 4v3.5L9.5 9" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  Refresh
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Meetings List / Empty State */}
      {filtered.length === 0 ? (
        <div className="py-[64px] flex flex-col items-center">
          <svg width="120" height="90" viewBox="0 0 120 90" className="mb-4">
            <ellipse cx="60" cy="78" rx="32" ry="8" fill="#EEF0FF"/>
            <path d="M60 15 L10 35 L60 45 Z" fill="#C7D2FE"/>
            <path d="M60 15 L110 35 L60 45 Z" fill="#A5B4FC"/>
            <path d="M60 45 L54 78" stroke="#A5B4FC" strokeWidth="2"/>
            <path d="M65 68 L96 72 L90 76 L62 72 Z" fill="#C7D2FE"/>
          </svg>
          <p className="text-[13px] text-[#6B7280] font-medium">No meetings scheduled.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#EDEEF1]">
          {filtered.map((m: any) => (
            <div key={m.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
              <div>
                <p className="font-bold text-[14px] text-[#1F2328]">{m.topic}</p>
                <p className="text-[12px] text-gray-500 mt-0.5 font-medium">
                  {m.meeting_code} | {m.time}
                </p>
              </div>
              <button 
                onClick={() => router.push(`/meeting/${m.meeting_code}`)}
                style={{
                  backgroundColor: '#0B5CFF',
                  color: '#ffffff',
                  padding: '6px 20px',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                className="hover:opacity-90 active:scale-95 transition shadow-sm"
              >
                Join
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Open recordings */}
      <div className="h-[40px] border-t border-[#EDEEF1] px-3 flex items-center text-[12px] text-[#5F6368] hover:bg-[#F9FAFB] cursor-pointer font-medium">
        Open recordings
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="ml-1"><path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  )
}
