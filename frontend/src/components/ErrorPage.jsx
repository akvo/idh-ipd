import React from "react";
import { Result, Button } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";

const errorIcon = () => <InfoCircleFilled style={{ color: "#ff4d4f" }} />;

const refreshButton = () => {
  return (
    <Button type="default" onClick={() => window.location.reload()} danger>
      Try Again
    </Button>
  );
};

const pageProps = (status) => {
  switch (status) {
    case 404:
      return {
        status: "warning",
        title: "Page not found",
        subTitle: "Sorry, we couldn't find that page",
      };
    default:
      return {
        status: "info",
        icon: errorIcon(),
        title: "Oops, Something went wrong",
        subTitle:
          "Try to refresh this page or feel free to contact us if the problem persist.",
        extra: refreshButton(),
      };
  }
};

const ErrorPage = ({ status }) => {
  const props = pageProps(status);
  return <Result {...props} />;
};

export default ErrorPage;
