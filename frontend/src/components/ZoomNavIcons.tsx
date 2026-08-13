// Zoom Nav Icons — Pixel-perfect SVG icons matching the actual Zoom Workplace sidebar

// Home — outlined house (inactive) / filled house (active)
export function IconHome({ size = 22, filled = false }: { size?: number; filled?: boolean }) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.6139 2.41474C12.2528 2.09509 11.7472 2.09509 11.3861 2.41474L3.38614 9.50331C3.14216 9.71934 3 10.0305 3 10.3586V19.5C3 20.3284 3.67157 21 4.5 21H9V15.5C9 14.6716 9.67157 14 10.5 14H13.5C14.3284 14 15 14.6716 15 15.5V21H19.5C20.3284 21 21 20.3284 21 19.5V10.3586C21 10.0305 20.8578 9.71934 20.6139 9.50331L12.6139 2.41474Z"/>
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M3.5 10.25L12 3L20.5 10.25V19.5C20.5 20.33 19.83 21 19 21H15.5C14.67 21 14 20.33 14 19.5V15.5C14 14.95 13.55 14.5 13 14.5H11C10.45 14.5 10 14.95 10 15.5V19.5C10 20.33 9.33 21 8.5 21H5C4.17 21 3.5 20.33 3.5 19.5V10.25Z"/>
    </svg>
  )
}

// Meetings — video camera with small filled square indicator at top-right
export function IconMeetings({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6.5" width="14" height="11.5" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M16 10.5L21 7.5V16.5L16 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x="15" y="3.5" width="4.5" height="4.5" rx="1.2" fill="currentColor"/>
    </svg>
  )
}

// Chat — two overlapping speech bubbles with small dot
export function IconChat({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Back bubble */}
      <path d="M13 4H19.5C20.6 4 21.5 4.9 21.5 6V11C21.5 12.1 20.6 13 19.5 13H18.5V15L16 13H13" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Front bubble */}
      <path d="M4.5 8.5H14C15.1 8.5 16 9.4 16 10.5V16C16 17.1 15.1 18 14 18H8.5L5.5 20.5V18H4.5C3.4 18 2.5 17.1 2.5 16V10.5C2.5 9.4 3.4 8.5 4.5 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Small notification dot */}
      <circle cx="19.5" cy="5" r="2" fill="currentColor" stroke="currentColor" strokeWidth="0"/>
    </svg>
  )
}

// More — three horizontal dots
export function IconMore({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5.5" cy="12" r="1.6"/>
      <circle cx="12" cy="12" r="1.6"/>
      <circle cx="18.5" cy="12" r="1.6"/>
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
