import { Navigate } from "react-router-dom";
import {
  getAccessToken,
  decodeRole,
  defaultPathForRole,
} from "../utils/authUtils";

export default function HomeRedirect() {
  const access = getAccessToken();
  if (access) {
    const role = decodeRole(access);
    return <Navigate to={defaultPathForRole(role)} replace />;
  }
  const hasRefresh = !!localStorage.getItem("refreshToken");
  if (hasRefresh) return null;
  return <Navigate to="/login" replace />;
}
