import React from 'react'
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import MobileBottomNav from './components/MobileBottomNav'
import Landing from './pages/Landing'
import Join from './pages/Join'
import MembershipCardPage from './pages/MembershipCardPage'
import Issues from './pages/Issues'
import ReportIssue from './pages/ReportIssue'
import IssueDetails from './pages/IssueDetails'
import BiharDashboard from './pages/BiharDashboard'
import WardDashboard from './pages/WardDashboard'
import VolunteerDashboard from './pages/VolunteerDashboard'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import TransparencyDashboard from './pages/TransparencyDashboard'
import SearchPage from './pages/SearchPage'
import Events from './pages/Events'
import News from './pages/News'
import Login from './pages/Login'
import Home from './pages/Home'
import VerifyOTP from "./pages/VerifyOTP";


function Layout() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="pb-24">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="join" element={<Join />} />
          <Route path="login" element={<Login />} />
          <Route path="home" element={<Home />} />
          <Route path="membership" element={<MembershipCardPage />} />
          <Route path="issues" element={<Issues />} />
          <Route path="report" element={<ReportIssue />} />
          <Route path="issues/:id" element={<IssueDetails />} />
          <Route path="bihar-dashboard" element={<BiharDashboard />} />
          <Route path="ward-dashboard" element={<WardDashboard />} />
          <Route path="volunteer" element={<VolunteerDashboard />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="transparency" element={<TransparencyDashboard />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="events" element={<Events />} />
          <Route path="news" element={<News />} />
            {/* OTP */}
        <Route path="/verify-otp"element={<VerifyOTP />} />

       
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
