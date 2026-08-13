"use client"
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { validateMeeting } from '@/lib/api'
import {
  ZoomMicIcon,
  ZoomVideoIcon,
  ZoomSecurityIcon,
  ZoomParticipantsIcon,
  ZoomChatIcon,
  ZoomShareScreenIcon,
  ZoomReactionIcon,
  ZoomMoreIcon,
  ZoomEndIcon,
  ZoomChevronUpIcon,
  ZoomEncryptionIcon,
  ZoomSpeakerViewIcon
} from '../../../components/ZoomIcons'

interface Message {
  sender: string;
  text: string;
  time: string;
  isAi?: boolean;
}

interface Participant {
  name: string;
  isHost: boolean;
  micOn: boolean;
  camOn: boolean;
}

interface FloatingReaction {
  id: number;
  emoji: string;
  left: string;
  rotation: string;
  wobble: string;
}

export default function MeetingPage() {
  const { id } = useParams()
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const shareVideoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const shareStreamRef = useRef<MediaStream | null>(null)

  // Media States
  const [micOn, setMicOn] = useState(false)
  const [camOn, setCamOn] = useState(false)
  const [showWarn, setShowWarn] = useState(true)
  const [isSharing, setIsSharing] = useState(false)

  // Meeting validation
  const [isValid, setIsValid] = useState<boolean | null>(null)

  // Interaction Panels
  const [activePanel, setActivePanel] = useState<'none' | 'chat' | 'participants' | 'ai'>('none')
  const [showReactions, setShowReactions] = useState(false)
  const [showSecurity, setShowSecurity] = useState(false)
  const [showEndModal, setShowEndModal] = useState(false)

  // State Lists
  const [reactions, setReactions] = useState<FloatingReaction[]>([])
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { sender: 'Zoom Workplace', text: 'Welcome to the meeting chat! Messages are visible to everyone.', time: '12:00 PM' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [aiPrompts, setAiPrompts] = useState<string[]>([
    "Summarize what has been discussed",
    "What are the action items?",
    "What decisions have been made?"
  ])

  // Security Toggles
  const [securityOpts, setSecurityOpts] = useState({
    lockMeeting: false,
    waitingRoom: true,
    allowShare: true,
    allowChat: true,
    allowRename: true
  })

  // Simulated Participants
  const [participantsList, setParticipantsList] = useState<Participant[]>([
    { name: 'Naskanti Rahul (Host, me)', isHost: true, micOn: false, camOn: false },
    { name: 'Alice Smith', isHost: false, micOn: true, camOn: true },
    { name: 'Bob Johnson', isHost: false, micOn: false, camOn: false }
  ])

  // Sync state mic/cam state to local participant
  useEffect(() => {
    const savedName = localStorage.getItem('displayName') || 'Naskanti Rahul'
    setParticipantsList(prev => prev.map((p, idx) =>
      idx === 0 ? { ...p, name: `${savedName} (Host, me)`, micOn, camOn } : p
    ))
  }, [micOn, camOn])

  // Validate meeting ID on mount
  useEffect(() => {
    const code = id as string
    // Check localStorage first
    const stored = JSON.parse(localStorage.getItem('validMeetings') || '[]')
    if (stored.includes(code)) {
      setIsValid(true)
      return
    }
    // Then check backend
    validateMeeting(code).then(valid => {
      if (valid) {
        // Store for future use
        stored.push(code)
        localStorage.setItem('validMeetings', JSON.stringify(stored))
      }
      setIsValid(valid)
    })
  }, [id])

  // Initialize camera & microphone
  useEffect(() => {
    const savedName = localStorage.getItem('displayName') || 'Naskanti Rahul'
    const targetAudio = localStorage.getItem('joinAudio') !== 'off'
    const targetVideo = localStorage.getItem('joinVideo') !== 'off'

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(s => {
      streamRef.current = s
      if (videoRef.current) videoRef.current.srcObject = s

      // Apply initial audio/video settings from JoinModal
      s.getAudioTracks().forEach(t => t.enabled = targetAudio)
      s.getVideoTracks().forEach(t => t.enabled = targetVideo)

      setMicOn(targetAudio)
      setCamOn(targetVideo)
      setShowWarn(false)
    }).catch(() => setShowWarn(true))

    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => t.enabled = !micOn)
    }
    setMicOn(!micOn)
  }

  const toggleCam = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(t => t.enabled = !camOn)
    }
    setCamOn(!camOn)
  }

  const handleShareScreen = async () => {
    if (isSharing) {
      // Stop Screen Share
      shareStreamRef.current?.getTracks().forEach(t => t.stop())
      shareStreamRef.current = null
      setIsSharing(false)
    } else {
      try {
        const s = await navigator.mediaDevices.getDisplayMedia({ video: true })
        shareStreamRef.current = s
        setIsSharing(true)
        setTimeout(() => {
          if (shareVideoRef.current) {
            shareVideoRef.current.srcObject = s
          }
        }, 100)
        s.getVideoTracks()[0].onended = () => {
          shareStreamRef.current?.getTracks().forEach(t => t.stop())
          shareStreamRef.current = null
          setIsSharing(false)
        }
      } catch (err) {
        console.error("Screen share failed", err)
      }
    }
  }

  // Re-bind webcam stream when returning from screen share and element re-mounts
  useEffect(() => {
    if (!isSharing && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [isSharing, camOn])

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!chatInput.trim()) return
    const newMsg = {
      sender: 'Naskanti Rahul',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }
    setChatMessages(prev => [...prev, newMsg])
    setChatInput('')
  }

  const handleAiPrompt = (prompt: string) => {
    // Add user prompt
    const userMsg = {
      sender: 'Naskanti Rahul',
      text: prompt,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }
    setChatMessages(prev => [...prev, userMsg])

    // Trigger AI response after delay
    setTimeout(() => {
      let responseText = "I don't have enough context to summarize yet."
      if (prompt.includes("Summarize")) {
        responseText = "Summary of Meeting:\n- The host Naskanti Rahul joined the workspace call.\n- Media devices (microphone and camera) were activated successfully.\n- User interfaces are being configured to mirror the native Zoom application structure."
      } else if (prompt.includes("action")) {
        responseText = "Action Items:\n- Validate current button functionalities (Participants, Chat, Reactions).\n- Verify screen sharing stream output on the active stage layout."
      } else if (prompt.includes("decisions")) {
        responseText = "Decisions:\n- Re-organized components into standalone modules under scaler/components directory.\n- Cleaned up resolution alias paths inside next.config and tsconfig."
      }

      const aiMsg = {
        sender: 'AI Companion',
        text: responseText,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        isAi: true
      }
      setChatMessages(prev => [...prev, aiMsg])
    }, 1000)
  }

  const triggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random()
    const left = `${20 + Math.random() * 60}%`
    const rotation = `${-30 + Math.random() * 60}deg`
    const wobble = `${-50 + Math.random() * 100}px`

    setReactions(prev => [...prev, { id, emoji, left, rotation, wobble }])
    setShowReactions(false)

    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id))
    }, 4000)
  }

  const endMeeting = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    shareStreamRef.current?.getTracks().forEach(t => t.stop())
    router.push('/')
  }

  // Loading — checking if meeting is valid
  if (isValid === null) {
    return (
      <div className="h-screen bg-[#1A1A2E] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0B5CFF] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white/70 text-[14px]">Validating meeting link...</p>
      </div>
    )
  }

  // Invalid meeting ID
  if (isValid === false) {
    return (
      <div className="h-screen bg-[#1A1A2E] flex flex-col items-center justify-center">
        <div className="bg-white rounded-[16px] p-10 shadow-2xl max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2"/>
              <line x1="8" y1="8" x2="16" y2="16" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="8" x2="8" y2="16" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-[22px] font-bold text-[#1A1D1F] mb-2">Invalid Meeting Link</h2>
          <p className="text-[14px] text-[#6B7280] mb-6">
            The meeting ID <span className="font-semibold text-[#1A1D1F]">{id}</span> does not exist or has expired.
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              backgroundColor: '#0B5CFF',
              color: '#ffffff',
              padding: '10px 32px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#111] flex flex-col overflow-hidden select-none">
      {/* TOP BAR */}
      <div className="h-[48px] bg-[#EFEFF2] flex items-center justify-between px-4 shrink-0 border-b border-[#DCDCE0] z-30">
        <div className="font-bold text-[14px] text-black">zoom Workplace</div>

        {/* Middle indicator/encryption info */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white px-3 py-1 rounded-full text-black text-[12px] border border-[#E1E1E6] gap-1.5 shadow-sm">
            <ZoomEncryptionIcon size={14} />
            <span>Meeting ID: {id}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center bg-transparent hover:bg-black/5 text-[#232333] px-2.5 py-1.5 rounded text-[12px] font-semibold transition gap-1">
            <ZoomSpeakerViewIcon size={12} />
            <span>View</span>
          </button>
          <button onClick={() => setShowEndModal(true)} className="bg-white hover:bg-black/5 text-[#FF2D55] border border-[#E1E1E6] px-4 h-7 rounded-full text-[12px] font-bold transition">
            Leave
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* STAGE & CHAT/PARTICIPANTS CONTENT */}
        <div className="flex-1 bg-[#1A1A1A] relative flex flex-col items-center justify-center">
          {/* Meeting title pill like real Zoom */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[12px] px-3 py-1.5 rounded-full flex items-center gap-2 z-10 border border-white/10">
            <span className="w-4 h-4 border border-white/60 rounded-full flex items-center justify-center text-[10px] font-bold">i</span>
            <span>Naskanti Rahul&apos;s Zoom Meeting</span>
          </div>

          {/* Warning banner - exact */}
          {showWarn && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#242424] text-white text-[13px] px-4 py-2 rounded-full flex items-center gap-2 z-20 border border-white/10 shadow-lg">
              <span className="text-yellow-500">⚠️</span>
              <span>
                Please enable access to your <span className="text-[#6aa8ff] underline cursor-pointer">microphone</span> and <span className="text-[#6aa8ff] underline cursor-pointer">camera</span> for the best experience.
              </span>
              <button onClick={() => setShowWarn(false)} className="ml-2 hover:opacity-80">✕</button>
            </div>
          )}

          {/* Video / Content Grid */}
          <div className="w-full h-full flex gap-4 p-4 box-border relative items-center justify-center">
            {/* Screen Share Stage */}
            {isSharing ? (
              <div className="flex-1 h-full bg-[#111] rounded-[12px] border border-white/10 overflow-hidden relative flex flex-col">
                <video ref={shareVideoRef} autoPlay playsInline className="w-full h-full object-contain" />
                <div className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-full cursor-pointer transition shadow-lg" onClick={handleShareScreen}>
                  Stop Screen Share
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[12px] px-2 py-1 rounded">
                  Screen Share Feed
                </div>
              </div>
            ) : (
              // Webcam Video Stage
              <div className="relative w-full h-full max-w-[900px] max-h-[500px] bg-[#111] rounded-[16px] overflow-hidden flex items-center justify-center border border-white/5 shadow-inner">
                <video ref={videoRef} autoPlay muted playsInline className={`absolute inset-0 w-full h-full object-cover ${camOn ? 'block' : 'hidden'}`} />
                {!camOn && (
                  <div className="w-[110px] h-[110px] bg-[#FF5F15] flex items-center justify-center text-white text-[48px] font-bold rounded-[24px] shadow-lg animate-pulse">
                    N
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Floating reactions display */}
          {reactions.map(r => (
            <span
              key={r.id}
              className="floating-reaction"
              style={{
                left: r.left,
                '--rotation': r.rotation,
                '--wobble': r.wobble
              } as React.CSSProperties}
            >
              {r.emoji}
            </span>
          ))}

          {/* Name tag */}
          <div className="absolute bottom-4 left-4 bg-black/60 text-white text-[12px] px-2.5 py-1 rounded-[4px] flex gap-1.5 items-center backdrop-blur-sm border border-white/5 z-10">
            {!micOn && <span className="text-red-500 text-[14px]">🔇</span>}
            <span>Naskanti Rahul</span>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(`http://localhost:3000/meeting/${id}`);
              alert("Invite link copied!");
            }}
            className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 text-white text-[12px] px-3 py-1.5 rounded-[4px] backdrop-blur-sm transition border border-white/10 z-10"
          >
            Copy invite link
          </button>
        </div>

        {/* SIDEBARS PANEL */}
        {activePanel !== 'none' && (
          <div className="absolute md:static inset-y-0 right-0 z-40 w-full sm:w-[320px] bg-white border-l border-[#DCDCE0] flex flex-col shrink-0">
            {/* Panel Header */}
            <div className="h-[48px] px-4 flex items-center justify-between border-b border-[#EDEEF1]">
              <span className="font-semibold text-black text-[14px]">
                {activePanel === 'chat' && 'Meeting Chat'}
                {activePanel === 'participants' && `Participants (${participantsList.length})`}
                {activePanel === 'ai' && 'AI Companion'}
              </span>
              <button
                onClick={() => setActivePanel('none')}
                className="text-gray-400 hover:text-black font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col min-h-0 bg-[#F9FAFB]">
              {activePanel === 'chat' && (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.isAi ? 'bg-indigo-50/60 p-3 rounded-lg border border-indigo-100/50' : ''}`}>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-semibold text-[12px] ${msg.isAi ? 'text-indigo-600' : 'text-gray-700'}`}>{msg.sender}</span>
                          <span className="text-[10px] text-gray-400">{msg.time}</span>
                        </div>
                        <span className="text-[12px] text-gray-700 mt-1 whitespace-pre-line leading-relaxed">{msg.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleSendChat} className="mt-3 flex gap-1.5 shrink-0">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder="Type message..."
                      className="flex-1 bg-white border border-gray-300 rounded-[8px] px-3 py-2 text-[12px] text-black outline-none focus:border-[#0B5CFF] shadow-sm"
                    />
                    <button type="submit" className="bg-[#0B5CFF] hover:bg-[#004BE0] text-white px-3 py-2 rounded-[8px] text-[12px] font-semibold transition">
                      Send
                    </button>
                  </form>
                </div>
              )}

              {activePanel === 'participants' && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {participantsList.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-[8px] bg-white border border-[#EDEEF1] shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold ${idx === 0 ? 'bg-[#FF5F15]' : idx === 1 ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                            {p.name.charAt(0)}
                          </div>
                          <span className="text-[12px] text-black font-medium truncate max-w-[150px]">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <span>{p.micOn ? '🎙️' : '🔇'}</span>
                          <span>{p.camOn ? '📹' : '🚫'}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-black py-2 rounded-full text-xs font-semibold shadow-sm transition">
                      Mute All
                    </button>
                    <button className="flex-1 bg-[#0B5CFF] hover:bg-[#004BE0] text-white py-2 rounded-full text-xs font-semibold shadow-sm transition">
                      Invite
                    </button>
                  </div>
                </div>
              )}

              {activePanel === 'ai' && (
                <div className="flex-1 flex flex-col justify-between min-h-0">
                  <div className="flex-1 overflow-y-auto space-y-4">
                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex flex-col gap-2">
                      <span className="font-semibold text-indigo-700 text-[13px]">Ask AI Companion:</span>
                      <p className="text-[11px] text-indigo-600/80 leading-relaxed">
                        I can summarize transcripts, list action items, and find decisions made. Click one of the quick prompts below to try it out!
                      </p>
                    </div>

                    <div className="space-y-2 mt-4">
                      {aiPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAiPrompt(prompt)}
                          className="w-full text-left bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 text-black text-[12px] p-3 rounded-lg transition shadow-sm leading-snug"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400 text-center mt-4">
                    Powered by Zoom AI Companion
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM TOOLBAR */}
      <div className="h-[72px] bg-[#0A0A0A] flex items-center justify-between px-3 sm:px-6 shrink-0 border-t border-white/5 z-20 relative">
        {/* Left: Audio & Video */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button onClick={toggleMic} className="flex flex-col items-center gap-1 min-w-[42px] sm:min-w-[54px] group relative">
            <div className="relative">
              <div className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center transition">
                <ZoomMicIcon size={22} className={micOn ? "text-white" : "text-[#FF2D55]"} micOn={micOn} />
              </div>
              <div className="absolute -top-1 -right-1.5 w-3.5 h-3.5 flex items-center justify-center">
                <ZoomChevronUpIcon size={12} className="text-white opacity-60" />
              </div>
            </div>
            <span className={`text-[10px] sm:text-[11px] font-medium transition hidden sm:inline ${micOn ? 'text-white/80 group-hover:text-white' : 'text-[#FF2D55]'}`}>
              {micOn ? 'Mute' : 'Unmute'}
            </span>
          </button>

          <button onClick={toggleCam} className="flex flex-col items-center gap-1 min-w-[42px] sm:min-w-[54px] group relative">
            <div className="relative">
              <div className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center transition">
                <ZoomVideoIcon size={26} className={camOn ? "text-white" : "text-[#FF2D55]"} camOn={camOn} />
              </div>
              <div className="absolute -top-1 -right-1.5 w-3.5 h-3.5 flex items-center justify-center">
                <ZoomChevronUpIcon size={12} className="text-white opacity-60" />
              </div>
            </div>
            <span className={`text-[10px] sm:text-[11px] font-medium transition hidden sm:inline ${camOn ? 'text-white/80 group-hover:text-white' : 'text-[#FF2D55]'}`}>
              {camOn ? 'Stop Video' : 'Start Video'}
            </span>
          </button>
        </div>

        {/* Center: Main features */}
        <div className="flex items-center gap-3.5 sm:gap-6">
          {/* Security button */}
          <div className="relative">
            <button
              onClick={() => { setShowSecurity(!showSecurity); setShowReactions(false); }}
              className={`flex flex-col items-center gap-1 group transition ${showSecurity ? 'text-[#0B5CFF]' : 'text-white/80 hover:text-white'}`}
            >
              <ZoomSecurityIcon size={20} />
              <span className="text-[10px] sm:text-[11px] hidden sm:inline">Security</span>
            </button>
            {showSecurity && (
              <div className="absolute bottom-[64px] left-1/2 -translate-x-1/2 bg-[#1C1C1E] border border-white/10 rounded-[12px] p-3 w-[200px] sm:w-[220px] shadow-2xl z-30 flex flex-col text-white text-[12px] gap-2.5">
                <div className="font-semibold text-white/60 pb-1.5 border-b border-white/5">Host Permissions</div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Lock Meeting</span>
                  <input type="checkbox" checked={securityOpts.lockMeeting} onChange={() => setSecurityOpts(p => ({ ...p, lockMeeting: !p.lockMeeting }))} className="accent-[#0B5CFF]" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Enable Waiting Room</span>
                  <input type="checkbox" checked={securityOpts.waitingRoom} onChange={() => setSecurityOpts(p => ({ ...p, waitingRoom: !p.waitingRoom }))} className="accent-[#0B5CFF]" />
                </label>
                <div className="border-t border-white/5 pt-1.5 font-semibold text-white/60">Allow Participants to:</div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Share Screen</span>
                  <input type="checkbox" checked={securityOpts.allowShare} onChange={() => setSecurityOpts(p => ({ ...p, allowShare: !p.allowShare }))} className="accent-[#0B5CFF]" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Chat</span>
                  <input type="checkbox" checked={securityOpts.allowChat} onChange={() => setSecurityOpts(p => ({ ...p, allowChat: !p.allowChat }))} className="accent-[#0B5CFF]" />
                </label>
              </div>
            )}
          </div>

          {/* Participants */}
          <button
            onClick={() => { setActivePanel(activePanel === 'participants' ? 'none' : 'participants'); setShowSecurity(false); setShowReactions(false); }}
            className={`flex flex-col items-center gap-1 group transition relative ${activePanel === 'participants' ? 'text-[#0B5CFF]' : 'text-white/80 hover:text-white'}`}
          >
            <ZoomParticipantsIcon size={20} />
            <span className="text-[10px] sm:text-[11px] hidden sm:inline">Participants</span>
            <span className="absolute -top-1 -right-2 bg-[#FF5F15] text-white text-[9px] px-1 rounded-full font-bold">
              {participantsList.length}
            </span>
          </button>

          {/* Chat */}
          <button
            onClick={() => { setActivePanel(activePanel === 'chat' ? 'none' : 'chat'); setShowSecurity(false); setShowReactions(false); }}
            className={`flex flex-col items-center gap-1 group transition relative ${activePanel === 'chat' ? 'text-[#0B5CFF]' : 'text-white/80 hover:text-white'}`}
          >
            <ZoomChatIcon size={18} className="mt-0.5" />
            <span className="text-[10px] sm:text-[11px] hidden sm:inline">Chat</span>
          </button>

          {/* Share screen */}
          <button
            onClick={handleShareScreen}
            className={`flex flex-col items-center gap-1 group transition ${isSharing ? 'text-[#00FF91]' : 'text-white/80 hover:text-white'}`}
          >
            <ZoomShareScreenIcon size={20} />
            <span className="text-[10px] sm:text-[11px] hidden sm:inline">Share</span>
          </button>

          {/* Reactions button */}
          <div className="relative">
            <button
              onClick={() => { setShowReactions(!showReactions); setShowSecurity(false); }}
              className={`flex flex-col items-center gap-1 group transition ${showReactions ? 'text-[#0B5CFF]' : 'text-white/80 hover:text-white'}`}
            >
              <ZoomReactionIcon size={20} />
              <span className="text-[10px] sm:text-[11px] hidden sm:inline">Reactions</span>
            </button>
            {showReactions && (
              <div className="absolute bottom-[64px] left-1/2 -translate-x-1/2 bg-[#1C1C1E] border border-white/10 rounded-full p-2.5 shadow-2xl z-30 flex items-center gap-3">
                {['👍', '❤️', '👏', '😂', '😮', '🎉'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => triggerReaction(emoji)}
                    className="hover:scale-135 active:scale-95 text-[20px] sm:text-[22px] transition duration-150 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI Companion */}
          <button
            onClick={() => { setActivePanel(activePanel === 'ai' ? 'none' : 'ai'); setShowSecurity(false); setShowReactions(false); }}
            className={`flex flex-col items-center gap-1 group transition ${activePanel === 'ai' ? 'text-indigo-400' : 'text-white/80 hover:text-white'}`}
          >
            <div className="w-[20px] h-[20px] rounded-full border border-indigo-400/50 flex items-center justify-center text-[9px] font-bold text-indigo-400 group-hover:bg-indigo-400/10">
              AI
            </div>
            <span className="text-[10px] sm:text-[11px] hidden sm:inline">AI Companion</span>
          </button>
        </div>

        {/* Right: End Meeting */}
        <div>
          <button onClick={() => setShowEndModal(true)} className="flex flex-col items-center gap-1 group">
            <ZoomEndIcon size={22} />
            <span className="text-[10px] sm:text-[11px] text-[#FF2D55] font-semibold group-hover:text-red-400 transition hidden sm:inline">End</span>
          </button>
        </div>
      </div>

      {/* END CONFIRMATION MODAL */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-[14px] w-[360px] p-6 shadow-2xl flex flex-col border border-gray-100">
            <h2 className="text-[16px] font-bold text-black text-center mb-4">
              Do you want to end this meeting?
            </h2>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={endMeeting}
                className="w-full bg-[#FF2D55] hover:bg-[#E02447] text-white py-2.5 rounded-lg text-sm font-semibold transition shadow-sm"
              >
                End Meeting for All
              </button>
              <button
                onClick={() => { setShowEndModal(false); router.push('/'); }}
                className="w-full bg-[#F3F4F6] hover:bg-gray-200 text-black py-2.5 rounded-lg text-sm font-semibold transition"
              >
                Leave Meeting
              </button>
              <button
                onClick={() => setShowEndModal(false)}
                className="w-full bg-transparent hover:bg-gray-50 text-gray-500 py-2.5 rounded-lg text-sm font-medium transition mt-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}