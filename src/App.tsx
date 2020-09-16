import React from "react";
import Main from "./routes/Main";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@material-ui/core";
import { getTheme } from "./util/Theme";

export default () => {
  return (
    <ThemeProvider theme={getTheme()}>
      <SnackbarProvider maxSnack={3}>
        <Main />
      </SnackbarProvider>
    </ThemeProvider>
  );
};
