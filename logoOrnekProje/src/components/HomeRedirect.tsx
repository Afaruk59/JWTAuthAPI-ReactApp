import { Navigate } from "react-router-dom";

const getAccessToken = (): string | null => {
  return (
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
  );
};

const decodeRole = (
  accessToken: string
): "Admin" | "Manager" | "User" | null => {
  try {
    const payload = accessToken.split(".")[1];
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const obj = JSON.parse(json);
    const role =
      obj["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (role === "Admin" || role === "Manager" || role === "User") return role;
    return null;
  } catch {
    return null;
  }
};

const defaultPathForRole = (
  role: "Admin" | "Manager" | "User" | null
): string => {
  if (role === "Admin") return "/admin/users";
  if (role === "Manager") return "/manager/users";
  if (role === "User") return "/user/orders";
  return "/login";
};

export default function HomeRedirect() {
  const access = getAccessToken();
  if (access) {
    const role = decodeRole(access);
    return <Navigate to={defaultPathForRole(role)} replace />;
  }
  // Eğer localStorage'da refreshToken varsa, App.tsx bootstrapping ile yönlendirecek
  const hasRefresh = !!localStorage.getItem("refreshToken");
  if (hasRefresh) return null;
  return <Navigate to="/login" replace />;
}
