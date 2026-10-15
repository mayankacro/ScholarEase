import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import Documents from "./pages/Documents";
import AdminStudentDetails from "./pages/AdminStudentDetails";
import AdminChecklist from "./pages/AdminChecklist";
import Toaster from "./components/Toast";
import ConfirmHost from "./components/Confirm";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <BrowserRouter>
     <Toaster />
     <ConfirmHost/>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute allowedRole="student">
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute allowedRole="student">
              <Documents />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/student/:studentId"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminStudentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/checklist"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminChecklist />
            </ProtectedRoute>
          }
        />

        {/* Officer routes */}
        <Route
          path="/officer"
          element={
            <ProtectedRoute allowedRole="officer">
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;