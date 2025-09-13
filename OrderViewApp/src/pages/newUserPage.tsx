import { Form, Input, Button, message, Typography, Select } from "antd";
import axios from "axios";
import { useState } from "react";

function newUserPage() {
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const accessToken =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      if (!accessToken) {
        message.error("Token alınamadı!");
        return;
      }
      const { data } = await axios.post(
        `${apiUrl}/api/User/CreateUserByAdmin`,
        values,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (data?.statusCode >= 200 && data?.statusCode < 300) {
        message.success("Kullanıcı oluşturuldu!");
      } else {
        message.error(
          data?.error?.errors?.join(", ") ?? "Kullanıcı oluşturulamadı!"
        );
      }
    } catch (error: any) {
      message.error(
        error?.response?.data?.error?.errors?.join(", ") ??
          "Kullanıcı oluşturulamadı!"
      );
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Giriş hatası:", errorInfo);
    message.error("Kullanıcı oluşturulamadı!");
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
      <Typography.Title level={2}>Yeni Kullanıcı Oluştur</Typography.Title>
      <Form
        size="large"
        labelCol={{ span: 8 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Kullanıcı Adı"
          name="username"
          rules={[{ required: true, message: "Lütfen kullanıcı adını girin!" }]}
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

        <Form.Item
          label="Şifre"
          name="password"
          rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Rol"
          name="role"
          rules={[{ required: true, message: "Lütfen rolünüzü girin!" }]}
        >
          <Select
            defaultValue="User"
            options={[
              { label: "Admin", value: "Admin" },
              { label: "Manager", value: "Manager" },
              { label: "User", value: "User" },
            ]}
          />
        </Form.Item>

        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Oluştur
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default newUserPage;
