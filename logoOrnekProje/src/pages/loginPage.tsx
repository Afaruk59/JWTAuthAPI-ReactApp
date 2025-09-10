import { Form, Input, Checkbox, Button, message, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

function LoginPage() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;
  const [loading, setLoading] = useState(false);

  const decodeRole = (accessToken: string): string | null => {
    try {
      const payload = accessToken.split(".")[1];
      const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(b64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
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

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${apiUrl}/api/Auth/CreateToken`, {
        email: values.email,
        password: values.password,
      });

      if (data?.statusCode >= 200 && data?.statusCode < 300) {
        const access = data?.data?.accessToken as string | undefined;
        const refresh = data?.data?.refreshToken as string | undefined;
        if (!access || !refresh) {
          message.error("Token alınamadı.");
          return;
        }

        if (values.remember) {
          localStorage.setItem("accessToken", access);
          localStorage.setItem("refreshToken", refresh);
        } else {
          sessionStorage.setItem("accessToken", access);
          sessionStorage.setItem("refreshToken", refresh);
        }

        // Layout ve diğer bileşenlerin anında güncellemesi için event yayınla
        window.dispatchEvent(new Event("auth-changed"));

        const role = decodeRole(access);
        message.success("Giriş başarılı!");
        if (role === "Admin") navigate("/admin/users", { replace: true });
        else if (role === "Manager")
          navigate("/manager/users", { replace: true });
        else navigate("/user/orders", { replace: true });
      } else {
        const errMsg = data?.error?.errors?.join(", ") ?? "Giriş başarısız.";
        message.error(errMsg);
      }
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.error?.errors?.join(", ") ??
        "Bir hata oluştu. Lütfen tekrar deneyin.";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Giriş hatası:", errorInfo);
    message.error("Giriş yapılamadı!");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
      }}
    >
      <Typography.Title level={2}>Giriş Yapın</Typography.Title>
      <Form
        size="large"
        labelCol={{ span: 8 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="on"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Lütfen emailinizi girin!" },
            { type: "email", message: "Geçerli bir email adresi girin!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Şifre"
          name="password"
          rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" label={null}>
          <Checkbox>Beni Hatırla</Checkbox>
        </Form.Item>

        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Giriş Yap
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: "center" }}>
        <Typography.Text>
          Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
        </Typography.Text>
      </div>
    </div>
  );
}

export default LoginPage;
