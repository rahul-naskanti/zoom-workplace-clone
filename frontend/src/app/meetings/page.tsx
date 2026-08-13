"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Topbar from '../../components/Topbar'
import Sidebar from '../../components/Sidebar'

export default function MeetingsPage() {
  const router = useRouter()
  const pmi = "857 518 2066"
  const [copied, setCopied] = useState(false)
  const [showInvite, setShowInvite] = useState(true)

  const invite = `Naskanti Rahul is inviting you to a scheduled Zoom meeting.\n\nTopic: Naskanti Rahul's Personal Meeting Room\nJoin Zoom Meeting\nhttps://us05web.zoom.us/j/8575182066?pwd=1aYszbvYiTcOXhBLdBFCgFvUGCI3Us.1\n\nMeeting ID: ${pmi}\nPasscode: 33WKs0`

  const handleStart = () => router.push(`/meeting/${pmi.replaceAll(' ', '-')}`)
  const handleCopy = () => {
    navigator.clipboard.writeText(invite)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-screen bg-[#E5E8EC] flex flex-col select-none font-['Inter',system-ui]">
      <Topbar />

      <div className="flex flex-1 px-2 pb-2 gap-2 overflow-hidden">
        <Sidebar activeTab="Meetings" />

        <main className="flex-1 bg-white rounded- flex overflow-hidden">
          {/* LEFT */}
          <div className="w- border-r border-[#E5E7EB] bg-white flex flex-col">
            <div className="h- flex items-center px-3.5 relative border-b border-transparent">
              <button className="absolute left-3.5 w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-">↻</button>
              <div className="w-full text-center font-bold text- text-[#111827]">Upcoming</div>
            </div>

            <div className="px-2.5 pt-2">
              <div className="bg-[#0B5CFF] rounded- py-3.5 px-4 text-white text-center">
                <div className="font-bold text- leading-5 tracking-[0.2px]">857 518 2066</div>
                <div className="text-[12.5px] font-normal opacity-90 mt-">My Personal Meeting ID (PMI)</div>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <span className="text- text-[#6B7280]">No upcoming meetings</span>
            </div>

            <div className="h- border-t border-[#E5E7EB] flex items-center justify-center">
              <button className="text-[13.5px] text-[#0B5CFF] font-medium flex items-center gap-1.5 hover:underline">
                <span className="text-">🗓️</span> Add a calendar
              </button>
            </div>
          </div>

          {/* RIGHT - EXACT ORIGINAL */}
          <div className="flex-1 bg-[#F8F9FB] px-8 py-7 overflow-y-auto">
            <h1 className="text- font-bold text-[#1F2328] tracking-[-0.1px]">My Personal Meeting ID (PMI)</h1>
            <div className="mt- text- font-normal text-[#1F2328]">857 518 2066</div>

            <div className="flex items-center gap-2.5 mt-">
              <button onClick={handleStart} className="h- px- bg-[#0B5CFF] hover:bg-[#0A4ED9] text-white text-[13.5px] font-semibold rounded-">Start</button>
              <button onClick={handleCopy} className="h- px- bg-white border border-[#D0D5DD] hover:bg-[#F9FAFB] text-[#1F2328] text-[13.5px] font-medium rounded- flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2.9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2.9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" /></svg>
                {copied ? 'Copied!' : 'Copy Invitation'}
              </button>
              <button className="h- px- bg-white border border-[#D0D5DD] hover:bg-[#F9FAFB] text-[#1F2328] text-[13.5px] font-medium rounded- flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                Edit
              </button>
            </div>

            <button onClick={() => setShowInvite(!showInvite)} className="mt- text-[13.5px] text-[#0B5CFF] hover:underline font-normal">
              {showInvite ? 'Hide Meeting Invitation' : 'Show Meeting Invitation'}
            </button>

            {showInvite && (
              <div className="mt-5 text-[13.5px] leading- text-[#1F2328]">
                <div>Naskanti Rahul is inviting you to a scheduled Zoom meeting.</div>
                <div className="mt-5">
                  Topic: Naskanti Rahul&apos;s Personal Meeting Room<br />
                  Join Zoom Meeting<br />
                  <a href="https://us05web.zoom.us/j/8575182066?pwd=1aYszbvYiTcOXhBLdBFCgFvUGCI3Us.1" target="_blank" className="text-[#0B5CFF] hover:underline break-all">
                    https://us05web.zoom.us/j/8575182066?pwd=1aYszbvYiTcOXhBLdBFCgFvUGCI3Us.1
                  </a>
                </div>
                <div className="mt-5">
                  Meeting ID: 857 518 2066<br />
                  Passcode: 33WKs0
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}