"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewMeetingModal({open,onClose,meetingId}:{open:boolean,onClose:()=>void,meetingId:string}){
  const router = useRouter()
  const [copied,setCopied] = useState(false)
  if(!open) return null
  const inviteLink = typeof window!== 'undefined'? `${window.location.origin}/meeting/${meetingId}` : ''

  const start = () => {
    onClose()
    router.push(`/meeting/${meetingId}`)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[16px] w-[420px] p-6 shadow-2xl">
        <h2 className="text-[20px] font-bold">New Meeting</h2>
        <div className="mt-4 bg-[#F5F5F5] rounded-[8px] p-3">
          <p className="text-[12px] text-gray-500">Meeting ID</p>
          <p className="text-[15px] font-mono font-bold">{meetingId}</p>
          <p className="text-[12px] text-gray-500 mt-2">Invite link</p>
          <p className="text-[12px] font-mono truncate">{inviteLink}</p>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 h-10 border border-gray-300 rounded-full text-[13px]">Cancel</button>
          <button onClick={start} className="flex-1 h-10 bg-[#0B5CFF] text-white rounded-full text-[13px] font-bold hover:bg-[#0952E5]">Start Meeting</button>
        </div>
        <button onClick={()=>{navigator.clipboard.writeText(inviteLink); setCopied(true); setTimeout(()=>setCopied(false),1500)}} className="w-full mt-2 text-[12px] text-[#0B5CFF]">{copied? 'Copied!' : 'Copy invite link'}</button>
      </div>
    </div>
  )
}
