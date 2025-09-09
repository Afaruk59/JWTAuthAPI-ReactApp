import React, { useState } from "react";
import {
  LoginOutlined,
  ShopOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme, Typography, Avatar } from "antd";
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

  const getSidebarItems = (): MenuProps["items"] => {
    const currentPath = pathname;

    if (currentPath.startsWith("/admin")) {
      return [
        {
          key: "/admin/users",
          icon: <TeamOutlined />,
          label: "Kullanıcılar",
          onClick: () => {
            navigate("/admin/users");
          },
        },
        {
          key: "logout",
          icon: <LoginOutlined />,
          label: "Çıkış Yap",
          onClick: () => {
            navigate("/login");
          },
        },
      ];
    } else if (currentPath.startsWith("/manager")) {
      return [
        {
          key: "/manager/users",
          icon: <TeamOutlined />,
          label: "Kullanıcılar",
          onClick: () => {
            navigate("/manager/users");
          },
        },
        {
          key: "/manager/orders",
          icon: <ShopOutlined />,
          label: "Tüm Siparişler",
          onClick: () => {
            navigate("/manager/orders");
          },
        },
        {
          key: "logout",
          icon: <LoginOutlined />,
          label: "Çıkış Yap",
          onClick: () => {
            navigate("/login");
          },
        },
      ];
    } else if (currentPath.startsWith("/user")) {
      return [
        {
          key: "/user/orders",
          icon: <ShopOutlined />,
          label: "Siparişlerim",
          onClick: () => {
            navigate("/user/orders");
          },
        },
        {
          key: "/user/newOrder",
          icon: <UserAddOutlined />,
          label: "Yeni Sipariş",
          onClick: () => {
            navigate("/user/newOrder");
          },
        },
        {
          key: "logout",
          icon: <LoginOutlined />,
          label: "Çıkış Yap",
          onClick: () => {
            navigate("/login");
          },
        },
      ];
    } else {
      // Login ve register sayfaları için
      return [
        {
          key: "/login",
          icon: <LoginOutlined />,
          label: "Giriş Yap",
          onClick: () => {
            navigate("/login");
          },
        },
        {
          key: "/register",
          icon: <UserAddOutlined />,
          label: "Kayıt Ol",
          onClick: () => {
            navigate("/register");
          },
        },
      ];
    }
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const getPageTitle = (): string => {
    const currentPath = pathname;

    if (currentPath === "/admin/users") {
      return "Kullanıcılar";
    } else if (currentPath === "/manager/users") {
      return "Kullanıcılar";
    } else if (currentPath === "/manager/orders") {
      return "Tüm Siparişler";
    } else if (currentPath === "/user/orders") {
      return "Siparişlerim";
    } else if (currentPath === "/user/newOrder") {
      return "Yeni Sipariş";
    } else if (currentPath === "/login") {
      return "Giriş Yap";
    } else if (currentPath === "/register") {
      return "Kayıt Ol";
    } else {
      return "Panel";
    }
  };

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  return (
    <Layout hasSider>
      <Sider
        collapsible
        collapsed={collapsed}
        style={siderStyle}
        onCollapse={(value) => setCollapsed(value)}
      >
        {!collapsed ? (
          <div
            style={{
              margin: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <Avatar shape="square" size={25} icon={<UserOutlined />} />
            <div
              style={{ display: "flex", flexDirection: "column", minWidth: 0 }}
            >
              <Typography.Text strong ellipsis>
                Ahmet Faruk
              </Typography.Text>
              <Typography.Text type="secondary" ellipsis>
                Admin
              </Typography.Text>
            </div>
          </div>
        ) : (
          <div
            style={{ margin: 16, display: "flex", justifyContent: "center" }}
          >
            <Avatar shape="square" size={25} icon={<UserOutlined />} />
          </div>
        )}
        <Menu
          theme="dark"
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={[pathname]}
          items={getSidebarItems()}
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
          <Typography.Title level={2}>{getPageTitle()}</Typography.Title>
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
