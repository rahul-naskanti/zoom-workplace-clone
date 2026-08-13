"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { scheduleMeeting } from '@/lib/api'

export default function SchedulePage() {
  const router = useRouter()
  
  // State variables
  const [topic, setTopic] = useState('My Meeting')
  const [description, setDescription] = useState('')
  const [showDescriptionInput, setShowDescriptionInput] = useState(false)
  
  // Date & Time states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState('5:30')
  const [ampm, setAmpm] = useState('PM')
  const [durationHr, setDurationHr] = useState('0')
  const [durationMin, setDurationMin] = useState('30')
  const [timezone, setTimezone] = useState('(GMT+5:30) India')
  const [recurring, setRecurring] = useState(false)
  
  // Invitees & Meeting ID
  const [invitees, setInvitees] = useState('')
  const [meetingId, setMeetingId] = useState<'auto' | 'pmi'>('auto')
  const [template, setTemplate] = useState('')
  
  // Whiteboard & Docs added state
  const [whiteboardAdded, setWhiteboardAdded] = useState(false)
  const [docsAdded, setDocsAdded] = useState(false)
  
  // Security & Encryption
  const [passcode, setPasscode] = useState('5yDvZV')
  const [waitingRoom, setWaitingRoom] = useState(false)
  const [encryption, setEncryption] = useState<'enhanced' | 'e2e'>('enhanced')
  
  // Zoom AI & Notes
  const [startZoomAI, setStartZoomAI] = useState(false)
  const [aiQuestions, setAiQuestions] = useState(false)
  const [aiSummary, setAiSummary] = useState(false)
  const [myNotesTranscribe, setMyNotesTranscribe] = useState(true)
  const [myNotesScope, setMyNotesScope] = useState<'all' | 'org'>('all')
  const [allowChatAccess, setAllowChatAccess] = useState(true)
  
  // Video
  const [hostVideo, setHostVideo] = useState<'on' | 'off'>('on')
  const [partVideo, setPartVideo] = useState<'on' | 'off'>('on')
  
  // Extra Options
  const [showOptions, setShowOptions] = useState(false)
  const [joinBeforeHost, setJoinBeforeHost] = useState(false)
  const [muteOnEntry, setMuteOnEntry] = useState(true)
  const [autoRecord, setAutoRecord] = useState(false)
  
  // Interpretation
  const [interpretation, setInterpretation] = useState(false)

  // Generate 15-minute increment time list
  const timeOptions = [
    '12:00', '12:15', '12:30', '12:45',
    '1:00', '1:15', '1:30', '1:45',
    '2:00', '2:15', '2:30', '2:45',
    '3:00', '3:15', '3:30', '3:45',
    '4:00', '4:15', '4:30', '4:45',
    '5:00', '5:15', '5:30', '5:45',
    '6:00', '6:15', '6:30', '6:45',
    '7:00', '7:15', '7:30', '7:45',
    '8:00', '8:15', '8:30', '8:45',
    '9:00', '9:15', '9:30', '9:45',
    '10:00', '10:15', '10:30', '10:45',
    '11:00', '11:15', '11:30', '11:45'
  ]

  const handleSave = async () => {
    const formattedTime = `${time} ${ampm}`
    const formattedDuration = `${durationHr} hr ${durationMin} min`

    let meetingCode = '857-518-2066'
    try {
      const result = await scheduleMeeting({
        topic,
        description,
        date,
        time: formattedTime,
        duration: formattedDuration,
        timezone
      })
      if (result && result.meeting_code) {
        meetingCode = result.meeting_code
      }
    } catch (e) {
      console.warn("Error calling schedule API", e)
    }

    router.push(`/meetings?scheduled=${meetingCode}&topic=${encodeURIComponent(topic)}`)
  }

  return (
    <div className="min-h-screen bg-white text-[14px] text-[#111] font-['Inter',system-ui] select-none flex flex-col justify-between">
      {/* Top Main Content Container */}
      <div className="px-8 py-8 max-w-[800px]">
        {/* Back Link */}
        <button 
          onClick={() => router.push('/')} 
          className="text-[#0B5CFF] text-[14px] hover:underline flex items-center gap-1 mb-6 font-semibold"
        >
          ‹ Back to Meetings
        </button>

        <h1 className="text-[26px] font-bold text-[#1A1D1F] mb-8">Schedule Meeting</h1>

        <div className="space-y-6">
          {/* Topic */}
          <div className="flex gap-4 items-start">
            <label className="w-[160px] pt-1.5 font-semibold text-[#1A1D1F] shrink-0">
              <span className="text-red-500 mr-1">*</span>Topic
            </label>
            <div className="flex-1">
              <input 
                value={topic} 
                onChange={e => setTopic(e.target.value)} 
                className="w-full max-w-[420px] h-9 border border-[#D0D5DD] rounded-full px-4 outline-none focus:border-[#0B5CFF] transition-all bg-white" 
              />
              {!showDescriptionInput ? (
                <div 
                  onClick={() => setShowDescriptionInput(true)} 
                  className="mt-3 text-[#0B5CFF] text-[13.5px] cursor-pointer hover:underline font-medium"
                >
                  + Add Description
                </div>
              ) : (
                <div className="mt-3">
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Enter meeting description (optional)..."
                    className="w-full max-w-[420px] h-20 border border-[#D0D5DD] rounded-xl p-3 text-[13px] outline-none focus:border-[#0B5CFF] resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* When (Date Picker & 15-min Time Increment) */}
          <div className="flex gap-4 items-center">
            <label className="w-[160px] font-semibold text-[#1A1D1F] shrink-0">When</label>
            <div className="flex gap-2.5 items-center flex-wrap">
              {/* Native Calendar Picker Input */}
              <input 
                type="date"
                value={date} 
                onChange={e => setDate(e.target.value)} 
                className="w-[180px] h-9 border border-[#D0D5DD] rounded-full px-4 text-[13.5px] outline-none bg-white focus:border-[#0B5CFF] cursor-pointer"
              />

              {/* 15-min Time Dropdown */}
              <select 
                value={time} 
                onChange={e => setTime(e.target.value)} 
                className="w-[110px] h-9 border border-[#D0D5DD] rounded-full px-3 text-[13.5px] bg-white outline-none focus:border-[#0B5CFF] cursor-pointer"
              >
                {timeOptions.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* AM / PM Selector */}
              <select 
                value={ampm} 
                onChange={e => setAmpm(e.target.value)} 
                className="w-[80px] h-9 border border-[#D0D5DD] rounded-full px-3 text-[13.5px] bg-white outline-none focus:border-[#0B5CFF] cursor-pointer"
              >
                <option value="PM">PM</option>
                <option value="AM">AM</option>
              </select>
            </div>
          </div>

          {/* Duration (15-min Increments) */}
          <div className="flex gap-4 items-center">
            <label className="w-[160px] font-semibold text-[#1A1D1F] shrink-0">Duration</label>
            <div className="flex gap-2 items-center">
              {/* Hours Dropdown */}
              <select 
                value={durationHr} 
                onChange={e => setDurationHr(e.target.value)} 
                className="w-[75px] h-9 border border-[#D0D5DD] rounded-full px-3 text-[13.5px] bg-white outline-none focus:border-[#0B5CFF] cursor-pointer"
              >
                {Array.from({ length: 25 }, (_, i) => (
                  <option key={i} value={i.toString()}>{i}</option>
                ))}
              </select>
              <span className="text-[13.5px] text-gray-500 font-medium">hr</span>

              {/* Minutes Dropdown in 15-min increments */}
              <select 
                value={durationMin} 
                onChange={e => setDurationMin(e.target.value)} 
                className="w-[85px] h-9 border border-[#D0D5DD] rounded-full px-3 text-[13.5px] bg-white outline-none focus:border-[#0B5CFF] cursor-pointer"
              >
                <option value="0">0</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
              <span className="text-[13.5px] text-gray-500 font-medium">min</span>
            </div>
          </div>

          {/* Plan Limit Warning */}
          <div className="ml-[176px] max-w-[580px] border border-[#E8D9B0] bg-[#FFFBEB] rounded-xl p-4 flex gap-3 text-[13.5px] leading-5 text-[#856404]">
            <span className="text-[16px] mt-0.5">⚠️</span>
            <div>
              You can schedule meetings for up to 40 minutes each with your current Basic plan. Need more time? <br />
              <a className="text-[#0B5CFF] hover:underline cursor-pointer font-semibold mt-1 inline-block">Upgrade to Zoom Workplace Pro</a>
            </div>
          </div>

          {/* Time Zone */}
          <div className="flex gap-4 items-center">
            <label className="w-[160px] font-semibold text-[#1A1D1F] shrink-0">Time Zone</label>
            <select 
              value={timezone} 
              onChange={e => setTimezone(e.target.value)} 
              className="w-[320px] h-9 border border-[#D0D5DD] rounded-full px-3 text-[13.5px] bg-white outline-none focus:border-[#0B5CFF] cursor-pointer"
            >
              <option>(GMT+5:30) India</option>
              <option>(GMT+0:00) UTC</option>
              <option>(GMT-8:00) Pacific Time (US and Canada)</option>
              <option>(GMT+1:00) Central European Time</option>
              <option>(GMT+9:00) Japan Standard Time</option>
            </select>
          </div>

          {/* Recurring */}
          <div className="flex gap-4">
            <div className="w-[160px] shrink-0"></div>
            <label className="flex items-center gap-2.5 text-[13.5px] cursor-pointer text-[#1F2328] font-medium">
              <input 
                type="checkbox" 
                checked={recurring} 
                onChange={e => setRecurring(e.target.checked)} 
                className="w-4 h-4 rounded border-gray-300 accent-[#0B5CFF]"
              />
              Recurring meeting
            </label>
          </div>

          {/* Invitees */}
          <div className="flex gap-4 items-start">
            <label className="w-[160px] pt-1.5 font-semibold text-[#1A1D1F] shrink-0">Invitees</label>
            <div className="flex-1 max-w-[580px]">
              <input 
                value={invitees}
                onChange={e => setInvitees(e.target.value)}
                placeholder="Enter user names or email addresses" 
                className="w-full h-9 border border-[#D0D5DD] bg-white rounded-full px-4 text-[13.5px] outline-none focus:border-[#0B5CFF]" 
              />
              <div className="mt-3 border border-[#E8D9B0] bg-[#FFFBEB] rounded-xl p-4 flex gap-3 text-[13.5px] text-[#856404] leading-5">
                <span className="text-[16px] mt-0.5">⚠️</span>
                <div>
                  Participants won't receive this meeting invite until your calendar is connected.<br />
                  <a className="text-[#0B5CFF] hover:underline cursor-pointer font-semibold mt-1 inline-block">Connect calendar</a>
                </div>
              </div>
            </div>
          </div>

          {/* Meeting ID */}
          <div className="flex gap-4 items-start">
            <label className="w-[160px] font-semibold text-[#1A1D1F] shrink-0">Meeting ID</label>
            <div className="flex flex-col gap-2.5 text-[13.5px] font-medium text-[#1A1D1F]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="meetingId" 
                  checked={meetingId === 'auto'} 
                  onChange={() => setMeetingId('auto')} 
                  className="w-4 h-4 accent-[#0B5CFF]"
                />
                Generate Automatically
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="meetingId" 
                  checked={meetingId === 'pmi'} 
                  onChange={() => setMeetingId('pmi')} 
                  className="w-4 h-4 accent-[#0B5CFF]"
                />
                Personal Meeting ID 857 518 2066
              </label>
            </div>
          </div>

          {/* Template */}
          <div className="flex gap-4 items-center">
            <label className="w-[160px] font-semibold text-[#1A1D1F] shrink-0">Template</label>
            <select 
              value={template}
              onChange={e => setTemplate(e.target.value)}
              className="w-[320px] h-9 border border-[#D0D5DD] rounded-full px-3 text-[13.5px] bg-white text-gray-700 outline-none cursor-pointer"
            >
              <option value="">Select a template</option>
              <option value="standard">Standard Team Sync</option>
              <option value="webinar">Large Presentation</option>
            </select>
          </div>

          {/* Whiteboard */}
          <div className="flex gap-4 items-center">
            <label className="w-[160px] font-semibold text-[#1A1D1F] shrink-0">Whiteboard ⓘ</label>
            <button 
              type="button"
              onClick={() => setWhiteboardAdded(!whiteboardAdded)}
              className={`h-9 px-4 text-[13.5px] font-semibold rounded-full flex items-center gap-1.5 transition ${
                whiteboardAdded 
                  ? 'bg-[#EBF3FF] text-[#0B5CFF] border border-[#0B5CFF]' 
                  : 'bg-[#F3F4F6] hover:bg-gray-200 text-[#0B5CFF]'
              }`}
            >
              🖥️ {whiteboardAdded ? 'Whiteboard Attached ✓' : 'Add Whiteboard'}
            </button>
          </div>

          {/* Docs */}
          <div className="flex gap-4 items-center">
            <label className="w-[160px] font-semibold text-[#1A1D1F] shrink-0">Docs</label>
            <button 
              type="button"
              onClick={() => setDocsAdded(!docsAdded)}
              className={`h-9 px-4 text-[13.5px] font-semibold rounded-full flex items-center gap-1.5 transition ${
                docsAdded 
                  ? 'bg-[#EBF3FF] text-[#0B5CFF] border border-[#0B5CFF]' 
                  : 'bg-[#F3F4F6] hover:bg-gray-200 text-[#0B5CFF]'
              }`}
            >
              📄 {docsAdded ? 'Docs Attached ✓' : 'Add Docs'}
            </button>
          </div>

          {/* Security */}
          <div className="flex gap-4 items-start">
            <label className="w-[160px] font-semibold text-[#1A1D1F] shrink-0">Security</label>
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked 
                  readOnly 
                  className="w-4 h-4 accent-[#0B5CFF] cursor-not-allowed"
                />
                <span className="text-gray-700 text-[13.5px] font-medium">Passcode</span>
                <input 
                  value={passcode} 
                  onChange={e => setPasscode(e.target.value)} 
                  className="ml-2 w-[130px] h-8 border border-[#D0D5DD] rounded-full px-3 text-[13.5px] outline-none focus:border-[#0B5CFF]" 
                />
              </div>
              <div className="text-[12.5px] text-gray-500 pl-6 leading-none">
                Only users who have the invite link or passcode can join the meeting
              </div>

              <label className="flex items-center gap-2.5 text-[13.5px] font-medium text-[#1A1D1F] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={waitingRoom} 
                  onChange={e => setWaitingRoom(e.target.checked)} 
                  className="w-4 h-4 accent-[#0B5CFF]"
                />
                Waiting Room
              </label>
              <div className="text-[12.5px] text-gray-500 pl-6 leading-none">
                Only users admitted by the host can join the meeting
              </div>
            </div>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Encryption */}
          <div className="flex gap-4 items-center">
            <label className="w-[160px] font-semibold text-[#1A1D1F] shrink-0">Encryption</label>
            <div className="flex gap-6 text-[13.5px] font-medium text-[#1A1D1F]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="encryption" 
                  checked={encryption === 'enhanced'} 
                  onChange={() => setEncryption('enhanced')} 
                  className="w-4 h-4 accent-[#0B5CFF]"
                />
                🛡️ Enhanced encryption ❓
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="encryption" 
                  checked={encryption === 'e2e'} 
                  onChange={() => setEncryption('e2e')} 
                  className="w-4 h-4 accent-[#0B5CFF]"
                />
                🛡️ End-to-end encryption ❓
              </label>
            </div>
          </div>

          {/* Zoom AI */}
          <div className="flex gap-4 items-start">
            <label className="w-[160px] font-semibold text-[#1A1D1F] shrink-0">Zoom AI</label>
            <div className="space-y-3 text-[13.5px] font-medium text-[#1A1D1F]">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={startZoomAI}
                  onChange={e => setStartZoomAI(e.target.checked)}
                  className="w-4 h-4 accent-[#0B5CFF]" 
                />
                Automatically start Zoom AI ⓘ
              </label>
              <div className="pl-6 space-y-2.5">
                <label className="flex items-center gap-2.5 cursor-pointer text-gray-600">
                  <input 
                    type="checkbox" 
                    checked={aiQuestions}
                    onChange={e => setAiQuestions(e.target.checked)}
                    className="w-4 h-4 accent-[#0B5CFF]" 
                  />
                  Automatically start meeting questions
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-gray-600">
                  <input 
                    type="checkbox" 
                    checked={aiSummary}
                    onChange={e => setAiSummary(e.target.checked)}
                    className="w-4 h-4 accent-[#0B5CFF]" 
                  />
                  Automatically start meeting summary
                </label>
              </div>
            </div>
          </div>

          {/* Workflow */}
          <div className="flex gap-4 items-center">
            <label className="w-[160px] font-semibold text-[#1A1D1F] shrink-0">Workflow</label>
            <a className="text-[#0B5CFF] text-[13.5px] font-semibold hover:underline cursor-pointer">
              Attach workflow to this meeting
            </a>
          </div>

          {/* My Notes */}
          <div className="flex gap-4 items-start">
            <label className="w-[160px] font-semibold text-[#1A1D1F] shrink-0">My Notes</label>
            <div className="text-[13.5px] space-y-3 font-medium text-[#1A1D1F]">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={myNotesTranscribe} 
                  onChange={e => setMyNotesTranscribe(e.target.checked)}
                  className="w-4 h-4 accent-[#0B5CFF]" 
                />
                Allow participants to transcribe meeting with My Notes
              </label>
              <div className="pl-6 space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-gray-600">
                  <input 
                    type="radio" 
                    name="notes" 
                    checked={myNotesScope === 'org'}
                    onChange={() => setMyNotesScope('org')}
                    className="w-4 h-4 accent-[#0B5CFF]" 
                  />
                  Only participants in your organization
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-gray-600">
                  <input 
                    type="radio" 
                    name="notes" 
                    checked={myNotesScope === 'all'}
                    onChange={() => setMyNotesScope('all')}
                    className="w-4 h-4 accent-[#0B5CFF]" 
                  />
                  All participants
                </label>
              </div>
            </div>
          </div>

          {/* Meeting Chat */}
          <div className="flex gap-4 items-center">
            <label className="w-[160px] font-semibold text-[#1A1D1F] shrink-0">Meeting chat</label>
            <label className="flex items-center gap-2.5 text-[13.5px] font-medium text-[#1A1D1F] cursor-pointer">
              <input 
                type="checkbox" 
                checked={allowChatAccess} 
                onChange={e => setAllowChatAccess(e.target.checked)}
                className="w-4 h-4 accent-[#0B5CFF]" 
              />
              Allow users to access meeting chats before and after the meeting
            </label>
          </div>

          {/* Video */}
          <div className="flex gap-4 items-start">
            <label className="w-[160px] font-semibold text-[#1A1D1F] shrink-0">Video</label>
            <div className="text-[13.5px] space-y-3 font-medium text-[#1A1D1F]">
              <div className="flex gap-8 items-center">
                <span className="w-20 text-gray-500">Host</span>
                <label className="flex gap-1.5 items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="hostVideo" 
                    checked={hostVideo === 'on'} 
                    onChange={() => setHostVideo('on')}
                    className="w-4 h-4 accent-[#0B5CFF]" 
                  />
                  on
                </label>
                <label className="flex gap-1.5 items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="hostVideo" 
                    checked={hostVideo === 'off'} 
                    onChange={() => setHostVideo('off')}
                    className="w-4 h-4 accent-[#0B5CFF]" 
                  />
                  off
                </label>
              </div>
              <div className="flex gap-8 items-center">
                <span className="w-20 text-gray-500">Participant</span>
                <label className="flex gap-1.5 items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="partVideo" 
                    checked={partVideo === 'on'} 
                    onChange={() => setPartVideo('on')}
                    className="w-4 h-4 accent-[#0B5CFF]" 
                  />
                  on
                </label>
                <label className="flex gap-1.5 items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="partVideo" 
                    checked={partVideo === 'off'} 
                    onChange={() => setPartVideo('off')}
                    className="w-4 h-4 accent-[#0B5CFF]" 
                  />
                  off
                </label>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="flex gap-4 items-start">
            <label className="w-[160px] font-semibold text-[#1A1D1F] shrink-0">Options</label>
            <div className="space-y-3">
              <button 
                type="button"
                onClick={() => setShowOptions(!showOptions)} 
                className="text-[#0B5CFF] text-[13.5px] font-semibold hover:underline"
              >
                {showOptions ? 'Hide' : 'Show'}
              </button>

              {showOptions && (
                <div className="pl-2 space-y-2.5 text-[13.5px] text-[#1F2328] font-medium animate-fade-in">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={joinBeforeHost}
                      onChange={e => setJoinBeforeHost(e.target.checked)}
                      className="w-4 h-4 accent-[#0B5CFF]" 
                    />
                    Allow participants to join anytime
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={muteOnEntry}
                      onChange={e => setMuteOnEntry(e.target.checked)}
                      className="w-4 h-4 accent-[#0B5CFF]" 
                    />
                    Mute participants upon entry
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={autoRecord}
                      onChange={e => setAutoRecord(e.target.checked)}
                      className="w-4 h-4 accent-[#0B5CFF]" 
                    />
                    Automatically record meeting on the local computer
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Interpretation */}
          <div className="flex gap-4 items-start">
            <label className="w-[160px] font-semibold text-[#1A1D1F] shrink-0">Interpretation</label>
            <label className="flex items-start gap-2.5 text-[13.5px] font-medium text-[#1A1D1F] cursor-pointer">
              <input 
                type="checkbox" 
                checked={interpretation}
                onChange={e => setInterpretation(e.target.checked)}
                className="w-4 h-4 accent-[#0B5CFF] mt-0.5 shrink-0" 
              />
              <span>Select sign language interpretation video channels below. You can assign interpreters at any time.</span>
            </label>
          </div>

          {/* Bottom Actions inside form layout with inline styles to override globals.css resets */}
          <div className="flex gap-3 pt-8 pb-20 ml-[176px]">
            <button 
              type="button"
              onClick={handleSave} 
              style={{
                backgroundColor: '#0B5CFF',
                color: '#ffffff',
                height: '40px',
                padding: '0 28px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
              className="hover:opacity-90 active:scale-95 transition-all"
            >
              Save
            </button>
            <button 
              type="button"
              onClick={() => router.push('/')} 
              style={{
                backgroundColor: '#F3F4F6',
                color: '#0B5CFF',
                height: '40px',
                padding: '0 28px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              className="hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}