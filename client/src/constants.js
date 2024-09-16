export const APIROOT =
  process.env.NODE_ENV === "production"
    ? "https://meteocielapi.zephyrapp.nz"
    : "http://localhost:5000";
