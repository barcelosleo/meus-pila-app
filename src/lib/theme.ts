import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  colorSchemes: {
    light: true,
    dark: true,
  },
  palette: {
    primary: {
      main: "#3b69ff",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
  },
});
