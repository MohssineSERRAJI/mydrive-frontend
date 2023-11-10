import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../components/LoginPage";
import { createBrowserHistory } from "history";
import HomePage from "../components/HomePage";
import DownloadPage from "../components/DownloadPage";
import VerifyEmailPage from "../components/VerifyEmailPage";
import ResetPasswordPage from "../components/ResetPasswordPage";
import GoogleAccountPage from "../components/GoogleAccountPage";
import AddStoragePage from "../components/AddStoragePage";
import SettingsPage from "../components/SettingsPage";

export const history = createBrowserHistory();


const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" exact={true} element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/download-page/:id/:tempToken" element={<DownloadPage />} />
      <Route path="/folder/:id" element={<HomePage  />} />
      <Route path="/search/:id" element={<HomePage/>} />
      <Route path="/verify-email/:id" element={<VerifyEmailPage/>} />
      <Route path="/reset-password/:id" element={<ResetPasswordPage/>} />
      <Route path="/add-storage" element={<AddStoragePage/>} />
      <Route path="/settings" element={<SettingsPage/>} />
    </Routes>
  </Router>
);

export default AppRouter;
