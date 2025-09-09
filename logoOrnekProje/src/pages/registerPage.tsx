import { Form, Input, Button, message, Typography } from "antd";
import { Link } from "react-router-dom";

function RegisterPage() {
  const onFinish = (values: any) => {
    console.log("Kayıt bilgileri:", values);
    message.success("Kayıt başarılı!");
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Kayıt hatası:", errorInfo);
    message.error("Kayıt yapılamadı!");
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
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
