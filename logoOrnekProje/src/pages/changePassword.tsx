import { Form, Input, Button, message, Typography } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;

  const handleSubmit = async (values: any) => {
    try {
      const { data } = await axios.post(
        `${apiUrl}/api/User/CompleteRegistration`,
        {
          email: values.email,
          temporaryPassword: values.tempPassword,
          newPassword: values.password,
        }
      );

      if (data?.statusCode >= 200 && data?.statusCode < 300) {
        message.success("Şifreniz güncellendi. Giriş yapabilirsiniz.");
        navigate("/login");
      } else {
        const errMsg = data?.error?.errors?.join(", ") ?? "İşlem başarısız.";
        message.error(errMsg);
      }
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.error?.errors?.join(", ") ??
        "Bir hata oluştu. Lütfen tekrar deneyin.";
      message.error(errMsg);
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
      <Typography.Title level={2}>Şifre Değiştir</Typography.Title>
      <Form
        size="large"
        labelCol={{ span: 8 }}
        initialValues={{
          email: "",
          tempPassword: "",
          password: "",
          confirmPassword: "",
        }}
        onFinish={handleSubmit}
        autoComplete="off"
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
          label="Geçici Şifre"
          name="tempPassword"
          rules={[
            { required: true, message: "Lütfen geçici şifrenizi girin!" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Şifre"
          name="password"
          rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Tekrar Şifre"
          name="confirmPassword"
          rules={[
            { required: true, message: "Lütfen tekrar şifrenizi girin!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Şifreler eşleşmiyor!"));
              },
            }),
          ]}
          dependencies={["password"]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" htmlType="submit">
            Şifre Değiştir
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ChangePassword;
