import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import OrdersPage from "./pages/ordersPage";
import UsersPage from "./pages/usersPage";
import NewOrder from "./pages/newOrderPage";
import NotFoundPage from "./pages/notFoundPage";
import NewUserPage from "./pages/newUserPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
      <Route path="/admin/users" element={<UsersPage />} />
      <Route path="/admin/newUser" element={<NewUserPage />} />
      <Route
        path="/manager"
        element={<Navigate to="/manager/users" replace />}
      />
      <Route path="/manager/users" element={<UsersPage />} />
      <Route path="/manager/orders" element={<OrdersPage />} />
      <Route path="/user" element={<Navigate to="/user/orders" replace />} />
      <Route path="/user/orders" element={<OrdersPage />} />
      <Route path="/user/newOrder" element={<NewOrder />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
