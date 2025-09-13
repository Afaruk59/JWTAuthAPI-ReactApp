import { Form, Input, Button, message, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

function RegisterPage() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${apiUrl}/api/User/CreateUser`, {
        email: values.email,
        userName: values.username,
      });

      if (data?.statusCode >= 200 && data?.statusCode < 300) {
        message.success(
          "Kayıt alındı. Geçici şifre e‑postanıza gönderildi. Lütfen şifrenizi belirleyin."
        );
        navigate("/changePassword");
      } else {
        const errMsg = data?.error?.errors?.join(", ") ?? "Kayıt başarısız.";
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
      <Typography.Title level={2}>Kayıt Ol</Typography.Title>
      <Form
        size="large"
        labelCol={{ span: 8 }}
        initialValues={{ username: "", email: "" }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Kullanıcı Adı"
          name="username"
          rules={[
            { required: true, message: "Lütfen kullanıcı adınızı girin!" },
          ]}
        >
          <Input />
        </Form.Item>
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

        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Kayıt Ol
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: "center" }}>
        <Typography.Text>
          Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
        </Typography.Text>
      </div>
    </div>
  );
}

export default RegisterPage;
