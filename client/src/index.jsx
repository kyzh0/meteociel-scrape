import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";

import Home from "./routes/Home";
import Forecast from "./routes/Forecast";
import Search from "./routes/Search";

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
    element: <Home />,
    children: [
      {
        path: ":id/:name",
        element: <Forecast />,
      },
      {
        path: "search",
        element: <Search />,
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
