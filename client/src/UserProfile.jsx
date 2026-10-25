import { Card, Icon } from "@mui/material";

import profileBackground from "assets/images/curved-images/curved0.jpg";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import AppHeader from "./AppHeader";

export default function UserProfile({ username, onLogout, logoutError }) {
  return (
    <DashboardLayout>
      <AppHeader
        title="Профиль"
        username={username}
        onLogout={onLogout}
        logoutError={logoutError}
      />
      <SoftBox position="relative" pb={3}>
        <SoftBox
          minHeight={{ xs: 220, sm: 300 }}
          borderRadius="xl"
          sx={{
            backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
              `${linearGradient(rgba(gradients.info.main, 0.6), rgba(gradients.info.state, 0.6))}, url(${profileBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Card
          sx={{
            position: "relative",
            mt: -6,
            mx: { xs: 1, sm: 3 },
            p: { xs: 2, sm: 3 },
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px)",
          }}
        >
          <SoftBox display="flex" alignItems="center" gap={2}>
            <SoftBox
              className="profile-avatar"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon fontSize="large">person</Icon>
            </SoftBox>
            <SoftTypography variant="h4" fontWeight="bold">
              Привет, {username}!
            </SoftTypography>
          </SoftBox>
        </Card>
      </SoftBox>
    </DashboardLayout>
  );
}
