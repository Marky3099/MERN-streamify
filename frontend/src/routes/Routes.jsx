import { Navigate, Route, Routes } from "react-router";
import HomePage from "../pages/HomePage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import NotificationPage from "../pages/NotificationPage.jsx";
import CallPage from "../pages/CallPage.jsx";
import ChatPage from "../pages/ChatPage.jsx";
import OnboardingPage from "../pages/OnboardingPage.jsx";

const AppRoutes = ({ auth }) => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/notifications"
      element={auth ? <NotificationPage /> : <Navigate to="/login" />}
    />
    <Route
      path="/call"
      element={auth ? <CallPage /> : <Navigate to="/login" />}
    />
    <Route
      path="/chat"
      element={auth ? <ChatPage /> : <Navigate to="/login" />}
    />
    <Route
      path="/onboarding"
      element={auth ? <OnboardingPage /> : <Navigate to="/login" />}
    />
  </Routes>
);

export default AppRoutes;
