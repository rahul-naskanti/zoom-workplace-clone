"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Topbar from '../../components/Topbar'
import Sidebar from '../../components/Sidebar'

export default function MorePage() {
  const router = useRouter()
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

  if (!mounted || !authorized) {
    return <div className="h-screen bg-[#F0F2F5]"></div>
  }

  return (
    <div className="h-screen bg-[#E5E8EC] flex flex-col select-none">
      <Topbar />
      <div className="flex flex-1 px-2 pb-[64px] md:pb-2 gap-2 overflow-hidden">
        <Sidebar activeTab="More" />
        <main className="flex-1 bg-white rounded-[16px] flex flex-col items-center justify-center p-8">
          <div className="text-[48px] mb-4">✨</div>
          <h1 className="text-[20px] font-bold text-black">More Zoom features</h1>
          <p className="text-[13px] text-gray-500 mt-2 text-center max-w-[340px]">
            Explore whiteboard integrations, calendar schedules, app market integrations, and other secondary features.
          </p>
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
              Whiteboards, notes, clips, and other secondary features are currently in development and have not been implemented.
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
