"use client"
import { useState, useEffect } from 'react'
import { Search, Clock3, ChevronLeft, ChevronRight } from 'lucide-react'
import { changePasswordApi } from '@/lib/api'

export default function Topbar(){
  const [initial, setInitial] = useState('N')
  const [user, setUser] = useState<{username: string, email: string} | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [statusType, setStatusType] = useState('Available')

  // Profile modal settings & states
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [currPassword, setCurrPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const u = JSON.parse(userStr)
        setUser(u)
        if (u && u.username) {
          setInitial(u.username.charAt(0).toUpperCase())
        }
      } catch (e) {}
    }

    // Close dropdown on click outside
    const handleOutsideClick = () => {
      setShowDropdown(false)
    }
    window.addEventListener('click', handleOutsideClick)
    return () => window.removeEventListener('click', handleOutsideClick)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const handleSavePassword = async () => {
    if (!currPassword.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
      setProfileError("Please fill in all password fields.")
      return
    }
    if (newPassword.length < 6) {
      setProfileError("New password must be at least 6 characters.")
      return
    }
    if (newPassword !== confirmNewPassword) {
      setProfileError("New passwords do not match.")
      return
    }

    setProfileError('')
    setProfileSuccess('')
    setProfileLoading(true)

    try {
      const email = user?.email || ''
      await changePasswordApi(email, currPassword, newPassword)
      setProfileSuccess("Password updated successfully!")
      setCurrPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (err: any) {
      setProfileError(err.message || "Incorrect current password.")
    } finally {
      setProfileLoading(false)
    }
  }

  // Get status dot color
  const getStatusColor = () => {
    switch (statusType) {
      case 'Available': return 'bg-green-500'
      case 'Busy':
      case 'Do Not Disturb': return 'bg-red-500'
      case 'Away':
      case 'Out of Office': return 'bg-gray-400'
      default: return 'bg-green-500'
    }
  }

  return (
    <div className="h-[48px] w-full flex items-center px-3.5 bg-[#E5E8EC] shrink-0 justify-between relative select-none">

      {/* LEFT - Logo matching real Zoom exactly */}
      <div className="flex items-center">
        <div className="flex flex-col leading-none">
          <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '-0.01em', color: '#232333', lineHeight: 1, fontFamily: 'Inter, -apple-system, sans-serif' }}>zoom</span>
          <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.03em', color: '#232333', lineHeight: 1, marginTop: '-1px', fontFamily: 'Inter, -apple-system, sans-serif' }}>Workplace</span>
        </div>
      </div>

      {/* CENTER - Arrows + Clock + Search (Responsive) */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-0 text-[#8A8F98]">
          <button className="w-6 h-6 flex items-center justify-center hover:bg-black/10 rounded-full"><ChevronLeft size={15} strokeWidth={2}/></button>
          <button className="w-6 h-6 flex items-center justify-center hover:bg-black/10 rounded-full"><ChevronRight size={15} strokeWidth={2}/></button>
          <button className="w-6 h-6 flex items-center justify-center hover:bg-black/10 rounded-full text-[#5E6673] ml-0.5"><Clock3 size={14} strokeWidth={1.8}/></button>
        </div>
        {/* Search bar - outline border, rounded rectangle, responsive width */}
        <div className="w-[180px] min-w-[120px] sm:w-[280px] h-[28px] bg-transparent border border-[#C2C5CA] rounded-[6px] flex items-center px-2 sm:px-2.5 gap-1.5 cursor-pointer hover:border-[#A0A4AA] transition">
          <Search size={13} className="text-[#9CA0A6] shrink-0"/>
          <span className="text-[12px] text-[#9CA0A6] truncate">Search</span>
          <span className="hidden sm:inline ml-auto text-[11px] text-[#9CA0A6] gap-0.5 shrink-0">⌘ + K</span>
        </div>
      </div>

      {/* RIGHT - Blue Upgrade + Avatar */}
      <div className="flex items-center gap-2.5">
        <button
          style={{
            backgroundColor: '#0B5CFF',
            color: '#ffffff',
            padding: '0 12px',
            height: '24px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontFamily: 'Inter, -apple-system, sans-serif'
          }}
        >
          Upgrade
        </button>
        
        {/* Profile - rounded square, click triggers dropdown */}
        <div
          onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
          title="Profile settings"
          className="relative flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 active:scale-95 transition"
          style={{
            width: '26px',
            height: '26px',
            backgroundColor: '#FF742E',
            borderRadius: '6px',
            fontSize: '12px',
            fontFamily: 'Inter, -apple-system, sans-serif'
          }}
        >
          {initial}
          <span className={`absolute -top-[2px] -right-[2px] w-[9px] h-[9px] border-[1.5px] border-[#E5E8EC] rounded-full transition-colors duration-150 ${getStatusColor()}`}></span>
        </div>
      </div>

      {/* Dropdown Menu Overlay */}
      {showDropdown && (
        <div 
          className="absolute top-[44px] right-3.5 w-[250px] bg-white border border-[#EDEEF1] rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-2.5 z-50 text-[13px] text-[#1A1D1F] flex flex-col font-sans"
          onClick={e => e.stopPropagation()}
        >
          {/* User Profile Info header */}
          <div className="px-3 py-1 flex flex-col">
            <span className="font-bold text-[14px] text-black truncate">{user?.username || 'Naskanti Rahul'}</span>
            <span className="text-[11.5px] text-gray-500 truncate mt-0.5">{user?.email || 'naskantirahul17@gmail.com'}</span>
          </div>

          <div className="border-t border-[#EDEEF1] my-2" />

          {/* Status Selection list */}
          <div className="space-y-0.5">
            {[
              { id: 'Available', label: 'Available', color: 'bg-green-500' },
              { id: 'Busy', label: 'Busy', color: 'bg-red-500' },
              { id: 'Do Not Disturb', label: 'Do Not Disturb', color: 'bg-red-500' },
              { id: 'Away', label: 'Away', color: 'bg-gray-400' },
              { id: 'Out of Office', label: 'Out of Office', color: 'bg-gray-400' }
            ].map(st => (
              <button 
                key={st.id}
                onClick={() => setStatusType(st.id)}
                className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-gray-100/70 rounded-lg text-left w-full transition text-gray-700"
              >
                <span className={`w-2 h-2 rounded-full ${st.color} shrink-0`} />
                <span className={statusType === st.id ? 'font-semibold text-black' : ''}>{st.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-[#EDEEF1] my-2" />

          {/* My Profile */}
          <button 
            onClick={() => { setShowProfileModal(true); setShowDropdown(false); }}
            className="flex items-center justify-between px-3 py-1.5 hover:bg-gray-100/70 rounded-lg text-left w-full transition text-gray-700"
          >
            My Profile
          </button>

          <div className="border-t border-[#EDEEF1] my-2" />

          {/* Sign Out */}
          <button 
            onClick={handleLogout}
            className="flex items-center justify-between px-3 py-1.5 hover:bg-gray-100/70 rounded-lg text-left w-full transition text-[#FF2D55] font-semibold"
          >
            Sign Out
          </button>

        </div>
      )}

      {/* My Profile Modal (Edit Password) */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowProfileModal(false)}>
          <div className="bg-white rounded-[16px] w-[400px] p-6 shadow-2xl flex flex-col text-left" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#EDEEF1] pb-3 mb-4">
              <h2 className="text-[16px] font-bold text-[#1A1D1F]">My Profile & Password Settings</h2>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-black font-semibold text-lg">✕</button>
            </div>

            {profileError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-[8px] p-3 text-[12.5px] mb-4 text-center font-medium">
                {profileError}
              </div>
            )}
            
            {profileSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-600 rounded-[8px] p-3 text-[12.5px] mb-4 text-center font-medium">
                {profileSuccess}
              </div>
            )}

            <div className="space-y-4">
              {/* Profile Details */}
              <div>
                <label className="block text-[11px] font-semibold text-[#5E6673] mb-0.5">Username</label>
                <div className="text-[13.5px] font-medium text-black px-3 py-1.5 bg-gray-50 rounded border border-gray-100">{user?.username || 'Naskanti Rahul'}</div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5E6673] mb-0.5">Email Address</label>
                <div className="text-[13.5px] font-medium text-black px-3 py-1.5 bg-gray-50 rounded border border-gray-100">{user?.email || 'naskantirahul17@gmail.com'}</div>
              </div>

              <div className="border-t border-[#EDEEF1] my-3 pt-3" />
              <div className="text-[13px] font-bold text-[#1A1D1F] mb-1">Change Password</div>

              {/* Password inputs */}
              <div>
                <label className="block text-[11.5px] font-semibold text-[#5E6673] mb-1">Current Password</label>
                <input
                  type="password"
                  value={currPassword}
                  onChange={e => setCurrPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-[13px] text-black outline-none focus:border-[#0B5CFF] transition"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-semibold text-[#5E6673] mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-[13px] text-black outline-none focus:border-[#0B5CFF] transition"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-semibold text-[#5E6673] mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-[13px] text-black outline-none focus:border-[#0B5CFF] transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex gap-2.5 mt-6 pt-3 border-t border-[#EDEEF1]">
              <button 
                onClick={() => setShowProfileModal(false)}
                className="flex-1 h-9 border border-[#D2D6DC] rounded-lg text-[13px] font-semibold hover:bg-gray-50 active:scale-[0.98] transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSavePassword}
                disabled={profileLoading}
                style={{ backgroundColor: '#0B5CFF' }}
                className="flex-1 h-9 text-white rounded-lg text-[13px] font-semibold hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center disabled:opacity-50"
              >
                {profileLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
