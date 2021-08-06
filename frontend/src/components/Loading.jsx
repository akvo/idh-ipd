import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const icon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const Loading = () => {
  return (
    <Spin
      indicator={icon}
      style={{
        margin: "auto",
        width: "100%",
        marginTop: "15%",
        marginBottom: "30%",
      }}
    />
  );
};

export default Loading;
