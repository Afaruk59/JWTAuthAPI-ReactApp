export type UserRole = "Admin" | "Manager" | "User";

export const getAccessToken = (): string | null => {
  return (
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
  );
};

export const decodeRole = (accessToken: string): UserRole | null => {
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

export const defaultPathForRole = (role: UserRole | null): string => {
  if (role === "Admin") return "/admin/users";
  if (role === "Manager") return "/manager/users";
  if (role === "User") return "/user/orders";
  return "/login";
};

export const getCurrentUserRole = (): UserRole | null => {
  const token = getAccessToken();
  if (!token) return null;
  return decodeRole(token);
};
