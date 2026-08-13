"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Topbar from '../../components/Topbar'
import Sidebar from '../../components/Sidebar'
import { getUpcoming } from '@/lib/api'

export default function MeetingsPage() {
  const router = useRouter()
  const pmi = "857 518 2066"
  const [copied, setCopied] = useState(false)
  const [showInvite, setShowInvite] = useState(true)
  const [pmiName, setPmiName] = useState("Naskanti Rahul's Personal Meeting Room")
  const [pmiPasscode, setPmiPasscode] = useState("33WKs0")
  const [showEditModal, setShowEditModal] = useState(false)
  const [editNameInput, setEditNameInput] = useState(pmiName)
  const [editPasscodeInput, setEditPasscodeInput] = useState(pmiPasscode)
  const [upcoming, setUpcoming] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState<string>('pmi')
  const [authorized, setAuthorized] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Fetch upcoming meetings from backend on mount
  const fetchMeetings = () => {
    getUpcoming().then(data => {
      if (Array.isArray(data)) {
        setUpcoming(data)
      }
    }).catch(err => {
      console.warn("Failed to load upcoming meetings", err)
    })
  }

  useEffect(() => {
    setMounted(true)
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }
    setAuthorized(true)
    fetchMeetings()
  }, [])

  // Parse meeting date & time string into JS Date object
  const parseMeetingDateTime = (dateStr: string, timeStr: string): Date | null => {
    try {
      let year = 0, month = 0, day = 0
      if (dateStr.includes('-')) {
        const parts = dateStr.split('-')
        year = parseInt(parts[0])
        month = parseInt(parts[1]) - 1
        day = parseInt(parts[2])
      } else if (dateStr.includes('/')) {
        const parts = dateStr.split('/')
        day = parseInt(parts[0])
        month = parseInt(parts[1]) - 1
        year = parseInt(parts[2])
      } else {
        return null
      }

      let hours = 0, minutes = 0
      const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i)
      if (match) {
        hours = parseInt(match[1])
        minutes = parseInt(match[2])
        const ampm = match[3].toUpperCase()
        if (ampm === 'PM' && hours < 12) hours += 12
        if (ampm === 'AM' && hours === 12) hours = 0
      } else {
        const parts = timeStr.split(':')
        hours = parseInt(parts[0]) || 0
        minutes = parseInt(parts[1]) || 0
      }

      return new Date(year, month, day, hours, minutes)
    } catch (e) {
      return null
    }
  }

  const now = new Date()
  const futureMeetings = upcoming.filter(m => {
    const dt = parseMeetingDateTime(m.date, m.time)
    return dt ? dt > now : false
  })

  const selectedMeeting = futureMeetings.find(m => m.meeting_code === selectedId)
  const activeName = selectedId === 'pmi' ? pmiName : (selectedMeeting?.topic || '')
  const activeCode = selectedId === 'pmi' ? pmi : (selectedMeeting?.meeting_code || '')
  const activePasscode = selectedId === 'pmi' ? pmiPasscode : (selectedMeeting?.passcode || '')

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  const invite = `Naskanti Rahul is inviting you to a scheduled Zoom meeting.\n\nTopic: ${activeName}\nJoin Zoom Meeting\n${origin}/meeting/${activeCode.replaceAll(' ', '')}\n\nMeeting ID: ${activeCode}\nPasscode: ${activePasscode}`

  const handleStart = () => {
    const code = activeCode.replaceAll(' ', '-')
    // Pre-authorize the code in local storage
    const stored = JSON.parse(localStorage.getItem('validMeetings') || '[]')
    if (!stored.includes(code)) {
      stored.push(code)
      localStorage.setItem('validMeetings', JSON.stringify(stored))
    }
    router.push(`/meeting/${code}`)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(invite)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveEdit = () => {
    if (selectedId === 'pmi') {
      setPmiName(editNameInput)
      setPmiPasscode(editPasscodeInput)
    } else {
      setUpcoming(prev => prev.map(m => 
        m.meeting_code === selectedId 
          ? { ...m, topic: editNameInput, passcode: editPasscodeInput || 'No passcode' } 
          : m
      ))
    }
    setShowEditModal(false)
  }

  if (!mounted || !authorized) {
    return <div className="h-screen bg-[#F0F2F5]"></div>
  }

  return (
    <div className="h-screen bg-[#E5E8EC] flex flex-col select-none font-['Inter',system-ui]">
      <Topbar />

      <div className="flex flex-1 px-2 pb-[64px] md:pb-2 gap-2 overflow-hidden">
        <Sidebar activeTab="Meetings" />

        <main className="flex-1 bg-white rounded-[16px] flex flex-col md:flex-row overflow-hidden shadow-sm">
          {/* LEFT SIDEBAR */}
          <div className="w-full md:w-[280px] h-[180px] md:h-full border-b md:border-b-0 md:border-r border-[#EDEEF1] bg-white flex flex-col shrink-0">
            {/* Header: Refresh + Title */}
            <div className="h-[48px] flex items-center px-4 relative border-b border-[#EDEEF1] shrink-0">
              <button className="absolute left-4 w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#5E6673] transition">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M1.5 8a6.5 6.5 0 0110.87-4.87L14.5 5.5m0 0H11m3.5 0V2M14.5 8a6.5 6.5 0 01-10.87 4.87L1.5 10.5m0 0H5m-3.5 0V14" />
                </svg>
              </button>
              <div className="w-full text-center font-bold text-[14.5px] text-[#1A1D1F]">Upcoming</div>
            </div>

            {/* Scrollable listing container */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* PMI Card */}
              <div 
                onClick={() => {
                  setSelectedId('pmi')
                  setEditNameInput(pmiName)
                  setEditPasscodeInput(pmiPasscode)
                }}
                className={`rounded-[10px] py-4 px-4 text-center cursor-pointer transition shadow-sm border ${
                  selectedId === 'pmi'
                    ? 'bg-[#0B5CFF] text-white border-transparent'
                    : 'bg-white text-[#1A1D1F] border-[#EDEEF1] hover:bg-gray-50'
                }`}
              >
                <div className="font-bold text-[17px] leading-5 tracking-[0.2px]">{pmi}</div>
                <div className={`text-[12px] font-normal mt-1.5 ${selectedId === 'pmi' ? 'opacity-90' : 'text-[#5E6673]'}`}>My Personal Meeting ID (PMI)</div>
              </div>

              {/* Dynamic Upcoming meetings list from database */}
              {futureMeetings.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-bold text-[#5E6673] uppercase tracking-wider px-1">Upcoming Meetings</div>
                  {futureMeetings.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedId(m.meeting_code)
                        setEditNameInput(m.topic)
                        setEditPasscodeInput(m.passcode || 'No passcode')
                      }}
                      className={`rounded-[10px] py-3.5 px-4 cursor-pointer transition shadow-sm border text-left ${
                        selectedId === m.meeting_code
                          ? 'bg-[#0B5CFF] text-white border-transparent'
                          : 'bg-white text-[#1A1D1F] border-[#EDEEF1] hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-bold text-[14.5px] truncate">{m.topic}</div>
                      <div className={`text-[11.5px] mt-1.5 truncate ${selectedId === m.meeting_code ? 'opacity-90' : 'text-[#5E6673]'}`}>
                        {m.meeting_code}
                      </div>
                      <div className={`text-[10px] mt-1 ${selectedId === m.meeting_code ? 'opacity-85' : 'text-[#9CA0A6]'}`}>
                        {m.time} | {m.date}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state if no meetings */}
              {futureMeetings.length === 0 && (
                <div className="py-12 text-center">
                  <span className="text-[13px] text-[#6B7280]">No upcoming meetings</span>
                </div>
              )}
            </div>

            {/* Footer calendar link */}
            <div className="h-[48px] border-t border-[#EDEEF1] flex items-center justify-center shrink-0">
              <button className="text-[13px] text-[#0B5CFF] font-semibold flex items-center gap-1.5 hover:underline">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#0B5CFF]">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Add a calendar
              </button>
            </div>
          </div>

          {/* RIGHT VIEW AREA */}
          <div className="flex-1 bg-white px-4 sm:px-10 py-6 sm:py-8 overflow-y-auto">
            <h1 className="text-[20px] font-bold text-[#1A1D1F] tracking-[-0.1px]">{activeName}</h1>
            <div className="mt-1.5 text-[13.5px] font-normal text-[#5E6673]">{activeCode}</div>

            {/* Start, Copy Invitation, Edit Action Buttons */}
            <div className="flex items-center gap-2.5 mt-6">
              {/* Start button */}
              <button 
                onClick={handleStart}
                style={{
                  backgroundColor: '#0B5CFF',
                  color: '#ffffff',
                  padding: '6px 20px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none'
                }}
                className="hover:bg-[#004BE0] active:scale-[0.98] transition shadow-sm"
              >
                Start
              </button>

              {/* Copy Invitation button */}
              <button 
                onClick={handleCopy}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#1A1D1F',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid #D2D6DC',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                className="hover:bg-gray-50 active:scale-[0.98] transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#5E6673]">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                {copied ? 'Copied!' : 'Copy Invitation'}
              </button>

              {/* Edit button */}
              <button
                onClick={() => {
                  setEditNameInput(pmiName)
                  setEditPasscodeInput(pmiPasscode)
                  setShowEditModal(true)
                }}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#1A1D1F',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid #D2D6DC',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                className="hover:bg-gray-50 active:scale-[0.98] transition"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#5E6673]">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                Edit
              </button>
            </div>

            {/* Toggle Meeting Invitation */}
            <div className="mt-8">
              <button 
                onClick={() => setShowInvite(!showInvite)} 
                className="text-[13px] text-[#0B5CFF] hover:underline font-normal cursor-pointer"
              >
                {showInvite ? 'Hide Meeting Invitation' : 'Show Meeting Invitation'}
              </button>
            </div>

            {/* Meeting Invitation details block */}
            {showInvite && (
              <div className="mt-5 text-[13px] leading-5 text-[#2D3139] max-w-2xl bg-[#F8F9FA] rounded-[8px] p-5 border border-[#EDEEF1]">
                <div>Naskanti Rahul is inviting you to a scheduled Zoom meeting.</div>
                <div className="mt-4">
                  <span className="font-semibold text-[#1A1D1F]">Topic:</span> {pmiName}<br />
                  <span className="font-semibold text-[#1A1D1F]">Join Zoom Meeting:</span><br />
                  <a href="https://us05web.zoom.us/j/8575182066?pwd=1aYszbvYiTcOXhBLdBFCgFvUGCI3Us.1" target="_blank" className="text-[#0B5CFF] hover:underline break-all">
                    https://us05web.zoom.us/j/8575182066?pwd=1aYszbvYiTcOXhBLdBFCgFvUGCI3Us.1
                  </a>
                </div>
                <div className="mt-4">
                  <span className="font-semibold text-[#1A1D1F]">Meeting ID:</span> 857 518 2066<br />
                  <span className="font-semibold text-[#1A1D1F]">Passcode:</span> {pmiPasscode}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Personal Meeting Room Settings Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-[12px] w-[460px] p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#EDEEF1] pb-3 mb-4">
              <h2 className="text-[16px] font-bold text-[#1A1D1F]">Personal Meeting Room Settings</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-black font-semibold text-lg">×</button>
            </div>
            
            <div className="space-y-4">
              {/* Meeting Topic Name */}
              <div>
                <label className="block text-[12px] font-semibold text-[#5E6673] mb-1.5">Meeting Topic</label>
                <input
                  value={editNameInput}
                  onChange={e => setEditNameInput(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-[13.5px] outline-none focus:border-[#0B5CFF] transition"
                  placeholder="Topic"
                />
              </div>

              {/* Passcode */}
              <div>
                <label className="block text-[12px] font-semibold text-[#5E6673] mb-1.5">Passcode</label>
                <input
                  value={editPasscodeInput}
                  onChange={e => setEditPasscodeInput(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-[13.5px] outline-none focus:border-[#0B5CFF] transition"
                  placeholder="Passcode"
                />
              </div>
            </div>

            <div className="flex gap-2.5 mt-6 pt-3 border-t border-[#EDEEF1]">
              <button 
                onClick={() => setShowEditModal(false)} 
                className="flex-1 h-9 border border-[#D2D6DC] rounded-lg text-[13px] font-semibold hover:bg-gray-50 active:scale-[0.98] transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit} 
                style={{ backgroundColor: '#0B5CFF' }}
                className="flex-1 h-9 text-white rounded-lg text-[13px] font-semibold hover:opacity-90 active:scale-[0.98] transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}