import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileBottomNav from "./components/MobileBottomNav";
import Landing from "./pages/Landing";
import Join from "./pages/Join";
import MembershipCardPage from "./pages/MembershipCardPage";
import Issues from "./pages/Issues";
import ReportIssue from "./pages/ReportIssue";
import IssueDetails from "./pages/IssueDetails";
import BiharDashboard from "./pages/BiharDashboard";
import WardDashboard from "./pages/WardDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import TransparencyDashboard from "./pages/TransparencyDashboard";
import SearchPage from "./pages/SearchPage";
import Events from "./pages/Events";
import News from "./pages/News";
import Purpose from "./pages/Purpose";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";

function Layout() {
  const location = useLocation();
  const stored =
    typeof window !== "undefined"
      ? localStorage.getItem("jansuraaj_user")
      : null;
  const publicPaths = ["/", "/login", "/join"];
  const hideShell = !stored && publicPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {!hideShell && <Header />}
      <main className="pb-24">
        <Outlet />
      </main>
      {!hideShell && <Footer />}
      {!hideShell && <MobileBottomNav />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="join" element={<Join />} />
          <Route path="login" element={<Login />} />
          //========PROTECTED_ROUTES==================//
          <Route element={<ProtectedRoute />}>
            <Route path="home" element={<Home />} />
          </Route>
          <Route path="membership" element={<MembershipCardPage />} />
          //============PROTECTED_ROUTE===========//
          <Route element={<ProtectedRoute />}>
            <Route path="issues" element={<Issues />} />
            <Route path="report" element={<ReportIssue />} />
            <Route path="issues/:id" element={<IssueDetails />} />
          </Route>
          //=================PROTECTED_ROUTE================//
          <Route element={<ProtectedRoute />}>
            <Route path="bihar-dashboard" element={<BiharDashboard />} />
          </Route>
          <Route path="ward-dashboard" element={<WardDashboard />} />
          <Route path="volunteer" element={<VolunteerDashboard />} />
          //=================PROTECTED_ROUTE============//
          <Route element={<ProtectedRoute />}>
            <Route path="notifications" element={<Notifications />} />
          </Route>
          //==============PROTECTED_ROUTE================//
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="transparency" element={<TransparencyDashboard />} />
          //===============PROTECTED_ROUTE============//
          <Route element={<ProtectedRoute />}>
            <Route path="search" element={<SearchPage />} />
          </Route>
          <Route path="events" element={<Events />} />
          <Route path="news" element={<News />} />
          //===============PROTECTED_ROUTE===============//
          <Route element={<ProtectedRoute />}>
            <Route path="purpose" element={<Purpose />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
