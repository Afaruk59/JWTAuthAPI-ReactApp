import React, { useEffect, useState } from "react";
import {
  LoginOutlined,
  ShopOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme, Typography, Avatar, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const { Header, Content, Footer, Sider } = Layout;

function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;

  const logout = async () => {
    try {
      const refreshToken =
        localStorage.getItem("refreshToken") ||
        sessionStorage.getItem("refreshToken");
      if (refreshToken) {
        await axios.post(`${apiUrl}/api/Auth/RevokeRefreshToken`, {
          token: refreshToken,
        });
      }
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      message.success("Çıkış yapıldı");
      navigate("/login", { replace: true });
    }
  };
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

  const getUserInfo = async () => {
    const accessToken =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    if (!accessToken) return;
    const { data } = await axios.get(`${apiUrl}/api/User/GetUser`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setUserInfo(data?.data);
  };
  useEffect(() => {
    getUserInfo();
  }, []);

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
          key: "/admin/newUser",
          icon: <UserAddOutlined />,
          label: "Yeni Kullanıcı",
          onClick: () => {
            navigate("/admin/newUser");
          },
        },
        {
          key: "logout",
          icon: <LoginOutlined />,
          label: "Çıkış Yap",
          onClick: () => {
            logout();
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
            logout();
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
            logout();
          },
        },
      ];
    } else {
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
    } else if (currentPath === "/admin/newUser") {
      return "Yeni Kullanıcı";
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
    } else if (currentPath === "/changePassword") {
      return "Şifre Değiştir";
    } else {
      return "";
    }
  };

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
                {userInfo?.userName}
              </Typography.Text>
              <Typography.Text type="secondary" ellipsis>
                {userInfo?.role}
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
