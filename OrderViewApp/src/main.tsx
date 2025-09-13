import "@ant-design/v5-patch-for-react-19";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { ConfigProvider, theme } from "antd";
import trTR from "antd/locale/tr_TR";
import "./index.css";
import App from "./App.tsx";
import MainLayout from "./layout/Layout.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ConfigProvider locale={trTR} theme={{ algorithm: theme.darkAlgorithm }}>
      <MainLayout>
        <App />
      </MainLayout>
    </ConfigProvider>
  </BrowserRouter>
);
