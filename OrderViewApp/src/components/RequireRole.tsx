import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  getAccessToken,
  decodeRole,
  defaultPathForRole,
  type UserRole,
} from "../utils/authUtils";

type Props = {
  allowed: Array<UserRole>;
  children: ReactNode;
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
