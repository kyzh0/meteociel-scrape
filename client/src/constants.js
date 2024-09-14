export const APIROOT =
  process.env.NODE_ENV === "production"
    ? "https://testapi.zephyrapp.nz"
    : "http://localhost:5000";
