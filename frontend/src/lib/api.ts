const API = "http://127.0.0.1:8000/api/meetings"

export const createInstant = async (topic = "Rahul's Instant Meeting") => {
  const res = await fetch(`${API}/instant`, {
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify({ topic })
  })
  return res.json()
}

export const scheduleMeeting = async (data: any) => {
  const res = await fetch(`${API}/schedule`, {
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify(data)
  })
  return res.json()
}

export const getUpcoming = async () => {
  const res = await fetch(`${API}/upcoming`)
  return res.json()
}

export const getRecent = async () => {
  const res = await fetch(`${API}/recent`)
  return res.json()
}

export const validateMeeting = async (code: string): Promise<boolean> => {
  const trimmed = code.trim()
  if (!trimmed) return false
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/meetings/validate/${trimmed}`)
    if (res.ok) {
      const data = await res.json()
      if (data.valid === true) return true
    }
  } catch (e) {
    console.warn("Backend validation failed, fallback", e)
  }
  // fallback for demo - allows 933-3155-2203 format
  return /^\d{3}-\d{4}-\d{4}$/.test(trimmed)
}

export const api = {
  getUpcoming,
  getRecent,
  createInstant,
  schedule: scheduleMeeting,
  validateMeeting
}