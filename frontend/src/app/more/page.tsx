"use client"
import Topbar from '../../components/Topbar'
import Sidebar from '../../components/Sidebar'

export default function MorePage() {
  return (
    <div className="h-screen bg-[#E5E8EC] flex flex-col select-none">
      <Topbar />
      <div className="flex flex-1 px-2 pb-2 gap-2 overflow-hidden">
        <Sidebar activeTab="More" />
        <main className="flex-1 bg-white rounded-[16px] flex flex-col items-center justify-center p-8">
          <div className="text-[48px] mb-4">✨</div>
          <h1 className="text-[20px] font-bold text-black">More Zoom features</h1>
          <p className="text-[13px] text-gray-500 mt-2 text-center max-w-[340px]">
            Explore whiteboard integrations, calendar schedules, app market integrations, and other secondary features.
          </p>
        </main>
      </div>
    </div>
  )
}
