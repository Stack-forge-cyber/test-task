import { createTheme } from "@mui/material/styles";

import borders from "assets/theme/base/borders";
import boxShadows from "assets/theme/base/boxShadows";
import breakpoints from "assets/theme/base/breakpoints";
import colors from "assets/theme/base/colors";
import globals from "assets/theme/base/globals";
import typography from "assets/theme/base/typography";
import button from "assets/theme/components/button";
import card from "assets/theme/components/card";
import divider from "assets/theme/components/divider";
import inputBase from "assets/theme/components/form/inputBase";
import icon from "assets/theme/components/icon";
import list from "assets/theme/components/list";
import listItem from "assets/theme/components/list/listItem";
import listItemText from "assets/theme/components/list/listItemText";
import sidenav from "assets/theme/components/sidenav";
import boxShadow from "assets/theme/functions/boxShadow";
import linearGradient from "assets/theme/functions/linearGradient";
import pxToRem from "assets/theme/functions/pxToRem";
import rgba from "assets/theme/functions/rgba";

export default createTheme({
  breakpoints: { ...breakpoints },
  palette: { ...colors },
  typography: { ...typography },
  boxShadows: { ...boxShadows },
  borders: { ...borders },
  functions: { boxShadow, linearGradient, pxToRem, rgba },
  components: {
    MuiCssBaseline: { styleOverrides: { ...globals } },
    MuiDrawer: { ...sidenav },
    MuiList: { ...list },
    MuiListItem: { ...listItem },
    MuiListItemText: { ...listItemText },
    MuiCard: { ...card },
    MuiButton: { ...button },
    MuiInputBase: { ...inputBase },
    MuiDivider: { ...divider },
    MuiIcon: { ...icon },
  },
});
