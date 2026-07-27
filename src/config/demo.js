export const isDemoMode =
  import.meta.env.VITE_DEMO_MODE === "true" ||
  (import.meta.env.PROD && import.meta.env.VITE_DEMO_MODE !== "false");

export const GITHUB_REPO_URL = "https://github.com/LawrenceJaySaludes/employee-leave-management-frontend";
