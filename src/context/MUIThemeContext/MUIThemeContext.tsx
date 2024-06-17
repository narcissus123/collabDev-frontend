import {
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { ReactNode, createContext, useContext, useMemo, useState } from "react";

export const themeSettings = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "dark"
      ? {
          // palette values for dark mode
          primary: {
            main: "#FFFFFF",
          },
          secondary: {
            main: "#33c0ee",
          },
          neutral: {
            dark: "#26272b",
            main: "#3f3f46",
            light: "#51525c",
          },
          background: {
            default: "#18181B",
            secondary: "#26272b",
          },
          text: {
            primary: "#3f3f46",
            secondary: "#B9B9BF",
          },
          border: {
            primary: "#EFEFF1",
          },
        }
      : {
          // palette values for light mode
          primary: {
            main: "#1D1D1E",
          },
          secondary: {
            main: "#33c0ee",
          },
          neutral: {
            dark: "#5A5A5C",
            main: "#EFEFF1",
            light: "#FAFAFA",
          },
          background: {
            default: "#FFFFFF",
          },
          text: {
            primary: "#3B3B3F",
            secondary: "#8C8C95",
          },
          border: {
            primary: "#F1F1F3",
            secondary: "#3B3B3F",
          },
        }),
  },
  typography: {
    fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
    fontSize: 12,
    h1: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 40,
    },
    h2: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 32,
    },
    h3: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 24,
    },
    h4: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 20,
    },
    h5: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 16,
    },
    h6: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 14,
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 320,
      md: 768,
      lg: 1280,
      xl: 1920,
    },
  },
});

interface MUIThemeContextProps {
  toggleColorMode: () => void;
}

const MUIThemeContext = createContext<MUIThemeContextProps>({
  toggleColorMode: () => {},
});

interface MUIThemeProviderProps {
  children: ReactNode;
}

export const MUIThemeProvider = ({ children }: MUIThemeProviderProps) => {
  const [mode, setMode] = useState<PaletteMode>("light");

  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <MUIThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </MUIThemeContext.Provider>
  );
};

export const useMode = () => {
  return useContext(MUIThemeContext);
};
