import { Button, Card, Icon } from "@mui/material";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { setMiniSidenav, useSoftUIController } from "context";

export default function AppHeader({ title, username, onLogout, logoutError }) {
  const [controller, dispatch] = useSoftUIController();
  return (
    <Card sx={{ mb: 3, px: 2.5, py: 1.5 }}>
      <SoftBox
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
      >
        <SoftBox display="flex" alignItems="center" gap={1}>
          <Button
            aria-label="Открыть меню"
            onClick={() => setMiniSidenav(dispatch, !controller.miniSidenav)}
            sx={{ display: { xl: "none" }, minWidth: 36 }}
          >
            <Icon>menu</Icon>
          </Button>
          <SoftTypography variant="h6" fontWeight="bold">
            {title}
          </SoftTypography>
        </SoftBox>
        <SoftBox display="flex" alignItems="center" gap={1}>
          <SoftTypography variant="button">{username}</SoftTypography>
          <Button color="info" onClick={() => void onLogout()} startIcon={<Icon>logout</Icon>}>
            Выйти
          </Button>
        </SoftBox>
      </SoftBox>
      {logoutError && (
        <SoftTypography color="error" variant="caption" role="alert">
          {logoutError}
        </SoftTypography>
      )}
    </Card>
  );
}
