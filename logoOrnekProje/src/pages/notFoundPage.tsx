import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";

function notFoundPage() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        gap: 10,
      }}
    >
      <Typography.Title type="secondary" level={1}>
        404 - Sayfa Bulunamadı
      </Typography.Title>
      <Button type="dashed" onClick={() => navigate("/")}>
        Ana Sayfaya Dön
      </Button>
    </div>
  );
}

export default notFoundPage;
