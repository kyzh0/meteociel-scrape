import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Forecast from "./routes/Forecast";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    subtitle1: {
      fontSize: "0.5rem",
      // sm breakpoint
      "@media (min-width:600px)": {
        fontSize: "0.7rem",
      },
    },
    caption: {
      fontSize: "0.7rem",
      // sm breakpoint
      "@media (min-width:600px)": {
        fontSize: "1rem",
      },
    },
  },
  palette: {
    primary: {
      main: "#303030",
      contrastText: "#fff",
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Forecast />,
    children: [
      {
        path: "/:id/:name",
        element: <Forecast />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
