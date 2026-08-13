"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { validateMeeting } from '@/lib/api'

export default function JoinModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const [meetingId, setMeetingId] = useState('')
  const [name, setName] = useState('User')
  const [rememberName, setRememberName] = useState(true)
  const [dontConnectAudio, setDontConnectAudio] = useState(false)
  const [turnOffVideo, setTurnOffVideo] = useState(false)

  // Load saved name from localStorage if available
  useEffect(() => {
    if (open) {
      const savedName = localStorage.getItem('displayName')
      if (savedName) {
        setName(savedName)
      }
    }
  }, [open])

  if (!open) return null

  const handleJoin = async () => {
    if (!meetingId.trim()) return alert("Enter Meeting ID")
    if (!name.trim()) return alert("Enter your name")

    const isValid = await validateMeeting(meetingId)
    if (isValid !== true) {
      return alert(`Meeting ${meetingId} not found`)
    }

    // Save configurations to localStorage
    if (rememberName) {
      localStorage.setItem('displayName', name.trim())
    } else {
      localStorage.removeItem('displayName')
    }
    
    localStorage.setItem('joinAudio', dontConnectAudio ? 'off' : 'on')
    localStorage.setItem('joinVideo', turnOffVideo ? 'off' : 'on')
    localStorage.setItem('displayName', name.trim() || 'User')

    onClose()
    
    // Navigate to meeting room
    router.push(`/meeting/${meetingId.trim()}?name=${name.trim()}`)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-[14px] w-[400px] p-6 shadow-2xl flex flex-col border border-gray-100" onClick={e => e.stopPropagation()}>
        <h2 className="text-[18px] font-bold text-black mb-4">Join Meeting</h2>
        
        <div className="flex flex-col gap-3">
          <input
            placeholder="Meeting ID or Personal Link Name"
            value={meetingId}
            onChange={e => setMeetingId(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-[13px] text-black outline-none focus:border-[#0B5CFF] focus:ring-1 focus:ring-[#0B5CFF] transition"
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
          />
          <input
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-[13px] text-black outline-none focus:border-[#0B5CFF] focus:ring-1 focus:ring-[#0B5CFF] transition"
          />
        </div>

        {/* Options list exactly like Zoom */}
        <div className="flex flex-col gap-2.5 mt-5 text-[12px] text-gray-700">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={rememberName} 
              onChange={e => setRememberName(e.target.checked)} 
              className="w-3.5 h-3.5 accent-[#0B5CFF] rounded border-gray-300"
            />
            <span>Remember my name for future meetings</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={dontConnectAudio} 
              onChange={e => setDontConnectAudio(e.target.checked)} 
              className="w-3.5 h-3.5 accent-[#0B5CFF] rounded border-gray-300"
            />
            <span>Don&apos;t connect to audio</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={turnOffVideo} 
              onChange={e => setTurnOffVideo(e.target.checked)} 
              className="w-3.5 h-3.5 accent-[#0B5CFF] rounded border-gray-300"
            />
            <span>Turn off my video</span>
          </label>
        </div>

        {/* Action Buttons styled with inline properties to override globals.css */}
        <div className="flex gap-3 mt-6">
          <button 
            type="button"
            onClick={onClose} 
            style={{
              backgroundColor: '#ffffff',
              color: '#111111',
              height: '44px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: '600',
              border: '1px solid #d1d5db',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flex: '1'
            }}
            className="hover:bg-gray-100 transition shadow-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleJoin}
            disabled={!meetingId.trim() || !name.trim()}
            style={{
              backgroundColor: (meetingId.trim() && name.trim()) ? '#0B5CFF' : '#E2E4E9',
              color: (meetingId.trim() && name.trim()) ? '#ffffff' : '#9599A6',
              height: '44px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: (meetingId.trim() && name.trim()) ? 'pointer' : 'not-allowed',
              flex: '1'
            }}
            className="transition shadow-sm"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  )
}
