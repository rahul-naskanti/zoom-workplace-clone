"use client"
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'

function JoinForm() {
  const router = useRouter()
  const search = useSearchParams()
  const preId = search.get('mid') || ''
  const [mid, setMid] = useState(preId)
  const [name, setName] = useState('')

  const handleJoin = async () => {
    if (!mid || !name) return alert('Enter Meeting ID and Name')
    const valid = await api.validateMeeting(mid)
    if (valid !== true) return alert('Meeting not found - check format 933-3155-2203')
    localStorage.setItem('displayName', name)
    router.push(`/meeting/${mid.trim()}`)
  }

  return (
    <div className="bg-white w-[400px] rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-8">
      <div className="text-[20px] font-bold text-black">zoom</div>
      <h1 className="text-2xl font-bold mt-2 text-black">Join Meeting</h1>
      <input value={mid} onChange={e => setMid(e.target.value)} placeholder="Meeting ID: 123-4567-8910" className="w-full mt-6 border border-gray-300 rounded-lg p-3 text-sm text-black outline-none focus:ring-2 focus:ring-[#0B5CFF]" />
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Your display name" className="w-full mt-3 border border-gray-300 rounded-lg p-3 text-sm text-black outline-none focus:ring-2 focus:ring-[#0B5CFF]" />
      <div className="flex gap-2 mt-6">
        <button onClick={() => window.location.href = '/'} className="flex-1 border py-2.5 rounded-full text-sm text-black font-medium">Cancel</button>
        <button onClick={handleJoin} className="flex-1 bg-[#0B5CFF] text-white py-2.5 rounded-full text-sm font-medium">Join</button>
      </div>
      <p className="text-[12px] text-gray-400 mt-4 text-center">By joining, you agree to Terms & Privacy</p>
    </div>
  )
}

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="bg-white w-[400px] rounded-2xl p-8 flex items-center justify-center">
          <div className="text-gray-500 text-sm">Loading join page...</div>
        </div>
      }>
        <JoinForm />
      </Suspense>
    </div>
  )
}