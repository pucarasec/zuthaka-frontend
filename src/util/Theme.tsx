import { createMuiTheme } from "@material-ui/core";

export const getTheme = () =>
  createMuiTheme({
    typography: {
      h1: {
        fontSize: 32,
      },
    },
  });
