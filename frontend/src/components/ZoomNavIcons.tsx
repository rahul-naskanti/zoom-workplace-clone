// Zoom Nav Icons — Custom SVG icons matching the actual Zoom Workplace app

// Home — outlined/filled house
export function IconHome({ size = 22, filled = false }: { size?: number; filled?: boolean }) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.6139 2.41474C12.2528 2.09509 11.7472 2.09509 11.3861 2.41474L3.38614 9.50331C3.14216 9.71934 3 10.0305 3 10.3586V19.5C3 20.3284 3.67157 21 4.5 21H9V15.5C9 14.6716 9.67157 14 10.5 14H13.5C14.3284 14 15 14.6716 15 15.5V21H19.5C20.3284 21 21 20.3284 21 19.5V10.3586C21 10.0305 20.8578 9.71934 20.6139 9.50331L12.6139 2.41474Z"/>
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M11.3861 3.41474C11.7472 3.09509 12.2528 3.09509 12.6139 3.41474L19.6139 9.61C19.8578 9.81 20 10.1 20 10.42V19.5C20 20.33 19.33 21 18.5 21H15.5C14.67 21 14 20.33 14 19.5V15.5C14 14.95 13.55 14.5 13 14.5H11C10.45 14.5 10 14.95 10 15.5V19.5C10 20.33 9.33 21 8.5 21H5.5C4.67 21 4 20.33 4 19.5V10.42C4 10.1 4.14 9.81 4.39 9.61L11.3861 3.41474Z"/>
    </svg>
  )
}

// Meetings — camera/video with small square indicator
export function IconMeetings({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="6" width="13.5" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M16 10.5L20.5 7.5V16.5L16 13.5V10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x="14.5" y="4" width="4" height="4" rx="1" fill="currentColor"/>
    </svg>
  )
}

// Chat — overlapping speech bubbles
export function IconChat({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M13.5 3.5H19C20.1 3.5 21 4.4 21 5.5V10.5C21 11.6 20.1 12.5 19 12.5H18V14.5L15.5 12.5H13.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M5 8.5H14C15.1 8.5 16 9.4 16 10.5V16C16 17.1 15.1 18 14 18H8.5L5.5 20.5V18H5C3.9 18 3 17.1 3 16V10.5C3 9.4 3.9 8.5 5 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

// More — three horizontal dots
export function IconMore({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5.5" cy="12" r="1.8"/>
      <circle cx="12" cy="12" r="1.8"/>
      <circle cx="18.5" cy="12" r="1.8"/>
    </svg>
  )
}

// Settings gear
export function IconSettings({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
