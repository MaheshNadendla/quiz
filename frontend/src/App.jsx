import { useLocation } from "react-router-dom";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import NotFoundPage from "./components/common/NotFoundPage";
import CourseDetail from "./pages/CourseDetail";
import Dashboard from "./pages/Dashboard";
import SubjectList from "./pages/admin/Subject";
import ModuleList from "./pages/admin/Module";
import { Routes, Route } from "react-router-dom";
import SubModuleList from "./pages/admin/SubModule";
import QuizInterface from "./pages/QuizInterface";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import PaymentForm from "./pages/payments/PaymentForm";
import PaymentFailurePage from "./pages/payments/PaymentFailurePage";
import PaymentSuccessPage from "./pages/payments/PaymentSuccessPage";
import Homepage from "./pages/Homepage";
import ContactUs from "./pages/ContactUs";
import OpenRoute from "./components/auth/Openroute";
import PrivateRoute from "./components/auth/Privateroute";
import AdminRoute from "./components/auth/AdminRoute";

function App() {
  const location = useLocation();

  // Define routes where you DON'T want to show the header
  const noHeaderRoutes = ["/course"];

  // Check if current route should hide header
  const shouldShowHeader = !noHeaderRoutes.some((route) => location.pathname.startsWith(route));
  return (
    <>
      {/* Conditionally render Header */}
      {shouldShowHeader && <Header />}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/courses/:courseName/:courseId"
          element={
            <PrivateRoute>
              <CourseDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/quizzes"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <SubjectList />
            </AdminRoute>
          }
        />
        <Route path="/admin/courses/:courseName" element={<ModuleList />} />
        <Route
          path="/course/:subjectId/:subModule_id"
          element={
            <PrivateRoute>
              <QuizInterface />
            </PrivateRoute>
          }
        />
        <Route
          path="courses/view-stats/:subModuleId"
          element={
            <PrivateRoute>
              <AnalyticsDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <AnalyticsDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/admin/courses/modules/:moduleName" element={<SubModuleList />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/payment-failure" element={<PaymentFailurePage />} />
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>

      <Footer />
    </>
  );
}

export default App;
