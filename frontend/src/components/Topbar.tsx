"use client"
import { Search, Clock3, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Topbar(){
  return (
    <div className="h-[56px] w-full flex items-center px-4 bg-[#E5E8EC] shrink-0 justify-between">

      {/* LEFT - Logo only */}
      <div className="flex items-center">
        <div className="flex flex-col leading-none">
          <span className="text-[10px] font-black tracking-tight text-black leading-none">zoom</span>
          <span className="text-[17px] font-bold tracking-tight text-black -mt-1 leading-none">Workplace</span>
        </div>
      </div>

      {/* CENTER - Arrows + Search together like original */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-[#8A8F98]">
          <button className="w-7 h-7 flex items-center justify-center hover:bg-black/10 rounded-full"><ChevronLeft size={18}/></button>
          <button className="w-7 h-7 flex items-center justify-center hover:bg-black/10 rounded-full"><ChevronRight size={18}/></button>
          <button className="w-7 h-7 flex items-center justify-center hover:bg-black/10 rounded-full text-black"><Clock3 size={18}/></button>
        </div>
        <div className="w-[380px] h-[32px] bg-[#D3D6DB] rounded-full flex items-center px-3 gap-2">
          <Search size={16} className="text-[#6B7280]"/>
          <span className="text-[13px] text-[#6B7280]">Search</span>
          <span className="ml-auto text-[12px] text-[#8A8F98]">⌘ + K</span>
        </div>
      </div>

      {/* RIGHT - Blue Upgrade */}
      <div className="flex items-center gap-3">
        <button className="bg-[#0B5CFF] text-white px-4 h-[28px] rounded-full text-[13px] font-bold">
          Upgrade
        </button>
        <div className="w-8 h-8 bg-[#FF742E] rounded-full flex items-center justify-center text-white font-bold text-[14px] relative">
          N
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-[#E5E8EC] rounded-full"></span>
        </div>
      </div>


    </div>
  )
}
