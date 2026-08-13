"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signupApi } from '@/lib/api'

export default function SignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.")
      return
    }
    setError('')
    setLoading(true)
    try {
      await signupApi(username.trim(), email.trim(), password)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-[#F0F2F5] flex flex-col items-center justify-center select-none font-['Inter',system-ui] px-4">
      {/* Zoom Logo */}
      <div className="flex flex-col items-center mb-6 leading-none">
        <span style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0B5CFF', lineHeight: 1 }}>zoom</span>
        <span style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.04em', color: '#1A1D1F', lineHeight: 1, marginTop: '2px' }}>Workplace</span>
      </div>

      {/* Signup Card */}
      <div className="bg-white rounded-[16px] border border-[#EDEEF1] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8 max-w-md w-full">
        {!success ? (
          <>
            <h2 className="text-[20px] font-bold text-[#1A1D1F] text-center mb-6">Sign Up Free</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-[8px] p-3 text-[13px] mb-4 text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#5E6673] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#D1D5DB] rounded-lg text-[13.5px] text-black outline-none focus:border-[#0B5CFF] transition"
                  placeholder="Rahul Naskanti"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#5E6673] mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#D1D5DB] rounded-lg text-[13.5px] text-black outline-none focus:border-[#0B5CFF] transition"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#5E6673] mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#D1D5DB] rounded-lg text-[13.5px] text-black outline-none focus:border-[#0B5CFF] transition"
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#0B5CFF' }}
                className="w-full h-11 text-white rounded-lg text-[13.5px] font-semibold hover:opacity-90 active:scale-[0.98] transition shadow-sm mt-6 flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            <div className="mt-6 text-center border-t border-[#EDEEF1] pt-4">
              <p className="text-[13px] text-[#6B7280]">
                Already have an account?{' '}
                <span
                  onClick={() => router.push('/login')}
                  className="text-[#0B5CFF] font-semibold hover:underline cursor-pointer"
                >
                  Sign In
                </span>
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 text-green-500">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 className="text-[20px] font-bold text-[#1A1D1F] mb-2">Account Created!</h2>
            <p className="text-[13.5px] text-[#6B7280] leading-relaxed mb-6">
              Your account has been registered successfully. Please proceed to log in.
            </p>
            <button
              onClick={() => router.push('/login')}
              style={{ backgroundColor: '#0B5CFF' }}
              className="w-full h-11 text-white rounded-lg text-[13.5px] font-semibold hover:opacity-90 active:scale-[0.98] transition shadow-sm"
            >
              Go to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
