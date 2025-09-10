import { message, Table, Button, Typography, Modal, Radio } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

function usersPage() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const getCurrentUserIdFromToken = (): string | null => {
    try {
      const accessToken =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      if (!accessToken) return null;
      const payload = accessToken.split(".")[1];
      const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(b64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const obj = JSON.parse(json);
      return (
        obj[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ||
        obj["nameid"] ||
        obj["sub"] ||
        null
      );
    } catch {
      return null;
    }
  };

  const getUsers = async () => {
    try {
      setLoading(true);
      const accessToken =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      if (!accessToken) {
        message.error("Lütfen giriş yapınız.");
        return;
      }
      const { data } = await axios.get(`${apiUrl}/api/User/GetAllUsers`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(data?.data ?? []);
      console.log("Users loaded:", data?.data);
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.error?.errors?.join(", ") ??
        "Bir hata oluştu. Lütfen tekrar deneyin.";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userName: string) => {
    Modal.confirm({
      title: "Kullanıcı Sil",
      content: "Kullanıcı silmek istediğinize emin misiniz?",
      onOk: async () => {
        try {
          setLoading(true);
          const accessToken =
            localStorage.getItem("accessToken") ||
            sessionStorage.getItem("accessToken");
          if (!accessToken) {
            message.error("Lütfen giriş yapınız.");
            return;
          }
          await axios.delete(`${apiUrl}/api/User/DeleteUser/${userName}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          message.success("Kullanıcı başarıyla silindi.");
          getUsers();
        } catch (error: any) {
          const errMsg =
            error?.response?.data?.error?.errors?.join(", ") ??
            "Bir hata oluştu. Lütfen tekrar deneyin.";
          message.error(errMsg);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const showRoleModal = (name: string) => {
    let selectedRole: string = "User";
    Modal.confirm({
      title: "Rol Seç",
      content: (
        <div>
          <Typography.Paragraph>Lütfen bir rol seçin:</Typography.Paragraph>
          <Radio.Group
            defaultValue={selectedRole}
            onChange={(e) => {
              selectedRole = e.target.value;
            }}
          >
            <Radio value="User">User</Radio>
            <Radio value="Manager">Manager</Radio>
            <Radio value="Admin">Admin</Radio>
          </Radio.Group>
        </div>
      ),
      okText: "Kaydet",
      cancelText: "İptal",
      onOk: async () => {
        await handleChangeRole(name, selectedRole);
      },
    });
  };

  const handleChangeRole = async (name: string, role: string) => {
    try {
      setLoading(true);
      const accessToken =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      if (!accessToken) {
        message.error("Lütfen giriş yapınız.");
        return;
      }
      await axios.post(`${apiUrl}/api/User/AssignRole/${name}/${role}`, null, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      message.success("Rol başarıyla değiştirildi.");
      getUsers();
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.error?.errors?.join(", ") ??
        "Bir hata oluştu. Lütfen tekrar deneyin.";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentUserId(getCurrentUserIdFromToken());
    getUsers();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (_: any, record: any) => (
        <div>
          <Typography.Text>{record.id}</Typography.Text>
        </div>
      ),
    },
    {
      title: "Kullanıcı Adı",
      dataIndex: "userName",
      key: "userName",
      render: (_: any, record: any) => (
        <div>
          <Typography.Text>{record.userName}</Typography.Text>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (_: any, record: any) => (
        <div>
          <Typography.Text>{record.email}</Typography.Text>
        </div>
      ),
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (_: any, record: any) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <Typography.Text>{record.role}</Typography.Text>
          {record.id !== currentUserId && (
            <Button
              type="primary"
              size="small"
              onClick={() => showRoleModal(record.userName)}
            >
              Değiştir
            </Button>
          )}
        </div>
      ),
    },
    {
      title: "Kayıt Tamamlandı",
      dataIndex: "isRegistrationCompleted",
      key: "isRegistrationCompleted",
      render: (_: any, record: any) => {
        return (
          <div>
            <Typography.Text>
              {record.isRegistrationCompleted ? "Evet" : "Hayır"}
            </Typography.Text>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          {record.id !== currentUserId && (
            <Button
              type="primary"
              danger
              onClick={() => handleDelete(record.userName)}
            >
              Sil
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Table
        dataSource={users}
        columns={columns}
        rowKey={(record) => record.id}
        loading={loading}
      />
    </div>
  );
}

export default usersPage;
