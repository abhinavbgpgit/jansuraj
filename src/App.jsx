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
import WardDashboard from "./pages/WardDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import TransparencyDashboard from "./pages/TransparencyDashboard";
import Events from "./pages/Events";
import News from "./pages/News";
import Purpose from "./pages/Purpose";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";
import { LanguageProvider } from "./i18n";

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
    <LanguageProvider>
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
          <Route path="ward-dashboard" element={<WardDashboard />} />
          <Route path="volunteer" element={<VolunteerDashboard />} />
          //==============PROTECTED_ROUTE================//
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="transparency" element={<TransparencyDashboard />} />
          <Route path="events" element={<Events />} />
          <Route path="news" element={<News />} />
          //===============PROTECTED_ROUTE===============//
          <Route element={<ProtectedRoute />}>
            <Route path="purpose" element={<Purpose />} />
          </Route>
        </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
