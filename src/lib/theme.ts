import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#3b69ff",
          light: "#648bff",
          dark: "#2548cc",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#7c3aed",
          light: "#a78bfa",
          dark: "#5b21b6",
          contrastText: "#ffffff",
        },
        background: {
          default: "#f8fafc",
          paper: "#ffffff",
        },
        text: {
          primary: "#0f172a",
          secondary: "#64748b",
        },
        divider: "rgba(15, 23, 42, 0.08)",
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#4f7bff",
          light: "#7b9eff",
          dark: "#2f57db",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#8b5cf6",
          light: "#c4b5fd",
          dark: "#6d28d9",
          contrastText: "#ffffff",
        },
        background: {
          default: "#0b0f19",
          paper: "#111827",
        },
        text: {
          primary: "#f8fafc",
          secondary: "#94a3b8",
        },
        divider: "rgba(255, 255, 255, 0.08)",
      },
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    h1: { fontWeight: 800, letterSpacing: "-0.03em" },
    h2: { fontWeight: 700, letterSpacing: "-0.025em" },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 600, letterSpacing: "-0.015em" },
    h6: { fontWeight: 600, letterSpacing: "-0.01em" },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          boxShadow: "0 4px 14px rgba(59, 105, 255, 0.25)",
          "&:hover": {
            boxShadow: "0 6px 20px rgba(59, 105, 255, 0.35)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          fontSize: "0.75rem",
          fontWeight: 500,
          padding: "6px 10px",
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        cell: {
          "&:focus, &:focus-within": {
            outline: "none",
          },
        },
        columnHeader: {
          "&:focus, &:focus-within": {
            outline: "none",
          },
        },
      },
    },
  },
});
