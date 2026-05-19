import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import "./App.css";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AdminLayout from "./layout/AdminLayout";
import AuthLayout from "./layout/AuthLayout";
import Layout from "./layout/Layout";
import StudentLayout from "./layout/StudentLayout";
import About from "./pages/About";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import AdminAnnouncements from "./pages/Admin/AdminAnnouncements";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminReports from "./pages/Admin/AdminReports";
import AdminReservations from "./pages/Admin/AdminReservations";
import AdminSoftware from "./pages/Admin/AdminSoftware";
import AdminStudents from "./pages/Admin/AdminStudents";
import AdminTestimonials from "./pages/Admin/AdminTestimonials";
import CurrentSitIn from "./pages/Admin/CurrentSitIn";
import SitInHistory from "./pages/Admin/SitInHistory";
import UnderConstruction from "./pages/Admin/UnderConstruction";
import Events from "./pages/Community/Events";
import Forums from "./pages/Community/Forums";
import Leaderboards from "./pages/Community/Leaderboards";
import Members from "./pages/Community/Members";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/Signup";
import AnnouncementDetail from "./pages/Student/AnnouncementDetail";
import StudentAnnouncements from "./pages/Student/Announcements";
import EditProfile from "./pages/Student/EditProfile";
import MyHistory from "./pages/Student/MyHistory";
import Notifications from "./pages/Student/Notifications";
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentReservations from "./pages/Student/StudentReservations";
import StudentSoftware from "./pages/Student/StudentSoftware";
import StudentTestimonials from "./pages/Student/StudentTestimonials";

function App() {
  return (
    <>
      <Toaster richColors position="bottom-right" />
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="home" element={<Navigate to="/" replace />} />
                <Route path="about" element={<About />} />
                <Route path="community/">
                  <Route path="forums" element={<Forums />} />
                  <Route path="events" element={<Events />} />
                  <Route path="members" element={<Members />} />
                  <Route path="leaderboards" element={<Leaderboards />} />
                </Route>
              </Route>
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="forgot" />
              </Route>

              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="announcements" element={<AdminAnnouncements />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="sit-in">
                  <Route index element={<CurrentSitIn />} />
                  <Route path="history" element={<SitInHistory />} />
                </Route>
                <Route path="reports" element={<AdminReports />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="reservation" element={<AdminReservations />} />
                <Route path="laboratory-software" element={<AdminSoftware />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route
                  path="feedback-reports"
                  element={<UnderConstruction />}
                />
              </Route>

              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="edit-profile" element={<EditProfile />} />
                <Route path="history" element={<MyHistory />} />
                <Route
                  path="announcements"
                  element={<StudentAnnouncements />}
                />
                <Route
                  path="announcements/:id"
                  element={<AnnouncementDetail />}
                />
                <Route path="notifications" element={<Notifications />} />
                <Route path="reservations" element={<StudentReservations />} />
                <Route path="testimonials" element={<StudentTestimonials />} />
                <Route path="software" element={<StudentSoftware />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
