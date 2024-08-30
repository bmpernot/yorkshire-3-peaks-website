'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  
  return (
    <nav>
      <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">Home</Link>
      <Link className={`link ${pathname === '/test' ? 'active' : ''}`} href="/test">test page</Link>
    </nav>
  )
}