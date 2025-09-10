import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

type Props = {
  allowed: Array<"Admin" | "Manager" | "User">;
  children: ReactNode;
};

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

export default function RequireRole({ allowed, children }: Props) {
  const location = useLocation();
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const role = decodeRole(token);
  if (!role) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowed.includes(role)) {
    return <Navigate to={defaultPathForRole(role)} replace />;
  }

  return <>{children}</>;
}
