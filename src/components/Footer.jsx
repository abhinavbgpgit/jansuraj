import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-100 bg-white/60 px-4 py-8 text-sm text-slate-600">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h4 className="font-semibold">Jansuraaj Bihar</h4>
            <p className="mt-2">A platform for public engagement and civic issues across Bihar.</p>
          </div>
          <div>
            <h4 className="font-semibold">Explore</h4>
            <ul className="mt-2 space-y-2">
              <li><Link to="/issues" className="hover:underline">Issues</Link></li>
              <li><Link to="/events" className="hover:underline">Events</Link></li>
              <li><Link to="/news" className="hover:underline">News</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Contact</h4>
            <p className="mt-2">support@jansuraaj.bihar</p>
            <p className="mt-1">© {new Date().getFullYear()} Jansuraaj Bihar</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
