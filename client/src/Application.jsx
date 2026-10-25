import { useEffect, useState } from "react";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import SoftBox from "components/SoftBox";

import Sidenav from "./AppSidenav";
import SignIn from "./Login";
import Dashboard from "./ProjectsDashboard";
import Profile from "./UserProfile";
import { ApiError, currentUser, logout } from "./api";
import routes from "./appRoutes";
import theme from "./appTheme";

export default function Application() {
  const [user, setUser] = useState(undefined);
  const [sessionError, setSessionError] = useState("");
  const [logoutError, setLogoutError] = useState("");
  const navigate = useNavigate();

  async function checkSession() {
    setSessionError("");
    try {
      setUser((await currentUser()).username);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) setUser(null);
      else setSessionError(error instanceof Error ? error.message : "Не удалось проверить сессию.");
    }
  }

  useEffect(() => {
    currentUser()
      .then(({ username }) => setUser(username))
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) setUser(null);
        else
          setSessionError(error instanceof Error ? error.message : "Не удалось проверить сессию.");
      });
    const unauthorized = () => setUser(null);
    window.addEventListener("workbase:unauthorized", unauthorized);
    return () => window.removeEventListener("workbase:unauthorized", unauthorized);
  }, []);

  async function signOut() {
    setLogoutError("");
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) setUser(null);
      else setLogoutError(error instanceof Error ? error.message : "Не удалось выйти.");
    }
  }

  let content;
  if (user === undefined) {
    content = (
      <SoftBox
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap={2}
      >
        {sessionError ? (
          <>
            <span role="alert">{sessionError}</span>
            <button className="plain-button" onClick={() => void checkSession()}>
              Повторить
            </button>
          </>
        ) : (
          "Проверяем сессию…"
        )}
      </SoftBox>
    );
  } else if (!user) {
    content = (
      <SignIn
        onLogin={(username) => {
          setUser(username);
          navigate("/dashboard");
        }}
      />
    );
  } else {
    content = (
      <>
        <Sidenav routes={routes} brandName="Проекты и задачи" />
        <Routes>
          <Route
            path="/dashboard"
            element={<Dashboard username={user} onLogout={signOut} logoutError={logoutError} />}
          />
          <Route
            path="/profile"
            element={<Profile username={user} onLogout={signOut} logoutError={logoutError} />}
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {content}
    </ThemeProvider>
  );
}
