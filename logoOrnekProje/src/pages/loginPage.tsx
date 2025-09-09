import { Form, Input, Checkbox, Button, message, Typography } from "antd";
import { Link } from "react-router-dom";

function LoginPage() {
  const onFinish = (values: any) => {
    console.log("Giriş bilgileri:", values);
    message.success("Giriş başarılı!");
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
          <Button type="primary" htmlType="submit">
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
