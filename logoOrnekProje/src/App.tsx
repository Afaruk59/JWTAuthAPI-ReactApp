import "./App.css";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import OrdersPage from "./pages/ordersPage";
import UsersPage from "./pages/usersPage";
import NewOrder from "./pages/newOrderPage";
import NotFoundPage from "./pages/notFoundPage";
import NewUserPage from "./pages/newUserPage";
import ChangePassword from "./pages/changePassword";
import { useEffect, useState } from "react";
import axios from "axios";
import RequireRole from "./components/RequireRole";
import HomeRedirect from "./components/HomeRedirect";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bootstrapping, setBootstrapping] = useState(true);
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;

  const decodeRole = (accessToken: string): string | null => {
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
      return (
        obj["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        null
      );
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedRefresh = localStorage.getItem("refreshToken");
        if (!storedRefresh) return;

        const { data } = await axios.post(
          `${apiUrl}/api/Auth/CreateTokenByRefreshToken`,
          { token: storedRefresh }
        );

        if (data?.statusCode >= 200 && data?.statusCode < 300) {
          const access = data?.data?.accessToken as string | undefined;
          const refresh = data?.data?.refreshToken as string | undefined;
          if (access) localStorage.setItem("accessToken", access);
          if (refresh) localStorage.setItem("refreshToken", refresh);

          const role = access ? decodeRole(access) : null;
          const path = location.pathname.toLowerCase();
          const isPublic = [
            "/",
            "/login",
            "/register",
            "/changepassword",
          ].includes(path);
          if (isPublic) {
            if (role === "Admin") navigate("/admin/users", { replace: true });
            else if (role === "Manager")
              navigate("/manager/users", { replace: true });
            else navigate("/user/orders", { replace: true });
          }
        } else {
          // Refresh başarısızsa temizle
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setBootstrapping(false);
      }
    };

    bootstrap();
  }, []);

  if (bootstrapping) return null;

  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/changePassword" element={<ChangePassword />} />
      <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
      <Route
        path="/admin/users"
        element={
          <RequireRole allowed={["Admin"]}>
            <UsersPage />
          </RequireRole>
        }
      />
      <Route
        path="/admin/newUser"
        element={
          <RequireRole allowed={["Admin"]}>
            <NewUserPage />
          </RequireRole>
        }
      />
      <Route
        path="/manager"
        element={<Navigate to="/manager/users" replace />}
      />
      <Route
        path="/manager/users"
        element={
          <RequireRole allowed={["Manager"]}>
            <UsersPage />
          </RequireRole>
        }
      />
      <Route
        path="/manager/orders"
        element={
          <RequireRole allowed={["Manager"]}>
            <OrdersPage />
          </RequireRole>
        }
      />
      <Route path="/user" element={<Navigate to="/user/orders" replace />} />
      <Route
        path="/user/orders"
        element={
          <RequireRole allowed={["User"]}>
            <OrdersPage />
          </RequireRole>
        }
      />
      <Route
        path="/user/newOrder"
        element={
          <RequireRole allowed={["User"]}>
            <NewOrder />
          </RequireRole>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
