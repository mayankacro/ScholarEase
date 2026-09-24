import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import Documents from "./pages/Documents";
import AdminStudentDetails from "./pages/AdminStudentDetails";


function App() {
  // return <Login/>
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/student" element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
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

      <Route
        path="/admin/student/:studentId"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminStudentDetails />
          </ProtectedRoute>
        }
      />

      
      </Routes>



    </BrowserRouter>
  );
}

export default App

//<BrowserRouter> => Meri application URL ke according pages/components manage karegi. */}
// <Routes> Iske andar hum saare routes define karenge. </Routes> */
//<Route path="/login" element={<Login />} />  Iska simple meaning: Agar browser URL /login hai → Login component dikhao.