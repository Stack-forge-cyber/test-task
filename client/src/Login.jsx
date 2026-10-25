import { useState } from "react";

import { Alert, Card, CircularProgress } from "@mui/material";

import curvedImage from "assets/images/curved-images/curved-6.jpg";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftTypography from "components/SoftTypography";

import { login } from "./api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("reviewer");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await login(username, password);
      setPassword("");
      onLogin(result.username);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Не удалось войти.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SoftBox
      className="login-layout"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
    >
      <Card className="login-card" sx={{ width: "100%", maxWidth: 900, overflow: "hidden" }}>
        <SoftBox display="flex" minHeight={520}>
          <SoftBox
            component="main"
            flex={1}
            minWidth={0}
            p={{ xs: 3, sm: 5 }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <SoftTypography variant="h3" fontWeight="bold" mb={1}>
              Добро пожаловать
            </SoftTypography>
            <SoftTypography variant="body2" color="text" mb={4}>
              Войдите, чтобы управлять проектами и задачами.
            </SoftTypography>
            <SoftBox component="form" onSubmit={submit} display="grid" gap={2.5}>
              <label className="form-label" htmlFor="login-username">
                Имя пользователя
                <SoftInput
                  id="login-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  required
                  inputProps={{ maxLength: 60 }}
                />
              </label>
              <label className="form-label" htmlFor="login-password">
                Пароль
                <SoftInput
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  inputProps={{ maxLength: 256 }}
                />
              </label>
              {error && (
                <Alert severity="error" role="alert">
                  {error}
                </Alert>
              )}
              <SoftButton type="submit" variant="gradient" color="info" disabled={busy} fullWidth>
                {busy ? <CircularProgress size={20} color="inherit" /> : "Войти"}
              </SoftButton>
            </SoftBox>
          </SoftBox>
          <SoftBox
            className="login-art"
            flex={1}
            sx={{
              backgroundImage: `url(${curvedImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </SoftBox>
      </Card>
    </SoftBox>
  );
}
