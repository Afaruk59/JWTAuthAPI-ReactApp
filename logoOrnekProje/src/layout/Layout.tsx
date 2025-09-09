import React, { useState } from "react";
import {
  DashboardOutlined,
  LoginOutlined,
  ShopOutlined,
  TeamOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

function MainLayout({ children }: { children: React.ReactNode }) {
  const siderStyle: React.CSSProperties = {
    overflow: "auto",
    height: "100vh",
    position: "sticky",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "auto",
  };

  const items: MenuProps["items"] = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "Admin Paneli",
      onClick: () => {
        navigate("/admin");
        setTitle("Admin Paneli");
      },
    },
    {
      key: "/manager",
      icon: <TeamOutlined />,
      label: "Yönetici Paneli",
      onClick: () => {
        navigate("/manager");
        setTitle("Yönetici Paneli");
      },
    },
    {
      key: "/user",
      icon: <ShopOutlined />,
      label: "Kullanıcı Paneli",
      onClick: () => {
        navigate("/user");
        setTitle("Kullanıcı Paneli");
      },
    },
    {
      key: "/login",
      icon: <LoginOutlined />,
      label: "Giriş Yap",
      onClick: () => {
        navigate("/login");
        setTitle("Giriş Yap");
      },
    },
    {
      key: "/register",
      icon: <UserAddOutlined />,
      label: "Kayıt Ol",
      onClick: () => {
        navigate("/register");
        setTitle("Kayıt Ol");
      },
    },
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [title, setTitle] = useState<string>("Admin Panel");

  return (
    <Layout hasSider>
      <Sider collapsible style={siderStyle}>
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: 6,
          }}
        />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={items}
          style={{
            borderRadius: 6,
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 20,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography.Title level={2}>{title}</Typography.Title>
          <Menu mode="horizontal" items={items} selectedKeys={[pathname]} />
        </Header>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
