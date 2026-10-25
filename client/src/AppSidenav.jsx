import { useEffect } from "react";

import { Divider, Icon, List } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { setMiniSidenav, useSoftUIController } from "context";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavRoot from "examples/Sidenav/SidenavRoot";

export default function AppSidenav({ routes, brandName }) {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentSidenav } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    const resize = () => setMiniSidenav(dispatch, window.innerWidth < 1200);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [dispatch]);

  return (
    <SidenavRoot variant="permanent" ownerState={{ transparentSidenav, miniSidenav }}>
      <SoftBox pt={3} pb={2} px={3} display="flex" alignItems="center" gap={1}>
        <SoftBox
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="2rem"
          height="2rem"
          borderRadius="md"
          bgColor="info"
          color="white"
        >
          <Icon>dashboard</Icon>
        </SoftBox>
        <SoftTypography variant="button" fontWeight="bold" sx={{ opacity: miniSidenav ? 0 : 1 }}>
          {brandName}
        </SoftTypography>
        <SoftBox
          display={{ xs: "block", xl: "none" }}
          ml="auto"
          onClick={() => setMiniSidenav(dispatch, true)}
          sx={{ cursor: "pointer" }}
        >
          <Icon>close</Icon>
        </SoftBox>
      </SoftBox>
      <Divider />
      <List>
        {routes.map(({ key, name, route, icon }) => (
          <NavLink
            key={key}
            to={route}
            onClick={() => {
              if (window.innerWidth < 1200) setMiniSidenav(dispatch, true);
            }}
          >
            <SidenavCollapse name={name} icon={icon} active={pathname === route} />
          </NavLink>
        ))}
      </List>
    </SidenavRoot>
  );
}
