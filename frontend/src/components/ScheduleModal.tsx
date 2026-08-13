"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ScheduleModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const [topic, setTopic] = useState("Rahul's Zoom Meeting")
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [scheduled, setScheduled] = useState(false)
  const [meetingId, setMeetingId] = useState('')

  if (!open) return null

  const handleSchedule = () => {
    const id = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
    setMeetingId(id)
    setScheduled(true)
  }

  const handleClose = () => {
    setScheduled(false)
    setTopic("Rahul's Zoom Meeting")
    setDate('')
    setTime('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-[12px] w-[440px] p-6" onClick={e => e.stopPropagation()}>
        {!scheduled ? (
          <>
            <h2 className="text-[18px] font-bold">Schedule Meeting</h2>
            <input
              placeholder="Meeting topic"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full mt-4 px-4 py-2.5 border border-[#D1D5DB] rounded-lg text-sm outline-none focus:border-[#0B5CFF] transition"
            />
            <div className="flex gap-2 mt-2">
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="flex-1 px-4 py-2.5 border border-[#D1D5DB] rounded-lg text-sm outline-none focus:border-[#0B5CFF] transition"/>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className="flex-1 px-4 py-2.5 border border-[#D1D5DB] rounded-lg text-sm outline-none focus:border-[#0B5CFF] transition"/>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={handleClose} className="flex-1 h-9 border rounded-full text-[13px]">Cancel</button>
              <button onClick={handleSchedule} className="flex-1 h-9 bg-[#0B5CFF] text-white rounded-full text-[13px] font-semibold">Schedule</button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-[18px] font-bold">Meeting Scheduled ✓</h2>
            <div className="mt-3 space-y-2 text-[13px] text-[#374151]">
              <p><span className="text-[#6B7280]">Topic:</span> {topic}</p>
              <p><span className="text-[#6B7280]">Date:</span> {date || 'Not set'}</p>
              <p><span className="text-[#6B7280]">Time:</span> {time || 'Not set'}</p>
              <p><span className="text-[#6B7280]">Meeting ID:</span> {meetingId}</p>
              <p className="text-xs bg-[#F3F4F6] p-2.5 rounded-lg font-mono break-all">
                http://localhost:3000/meeting/{meetingId}
              </p>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={handleClose} className="flex-1 h-9 border rounded-full text-[13px]">Close</button>
              <button
                onClick={() => { handleClose(); navigator.clipboard.writeText(`http://localhost:3000/meeting/${meetingId}`) }}
                className="flex-1 h-9 bg-[#0B5CFF] text-white rounded-full text-[13px] font-semibold"
              >Copy Invite Link</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
