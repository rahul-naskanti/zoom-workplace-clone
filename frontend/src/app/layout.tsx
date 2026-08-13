import "./globals.css"
export const metadata = { title: "Zoom Workplace Clone", description: "Zoom Clone SDE Assignment" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
