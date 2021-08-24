import React from "react";
import RVerify from "rverify";
import { Modal } from "antd";
import api from "../lib/api";
import { UIStore } from "../data/store";

const handleUserStore = () => {
  api
    .post("/user/")
    .then(() => {
      Modal.success({
        title: "Success!",
        content:
          "Registration process has been completed. Please wait until admin approves your registration.",
        onOk: () => {
          window.location.reload();
        },
      });
    })
    .catch((error) => {
      const { status } = error.response;
      UIStore.update((p) => {
        p.errorPage = status;
      });
    });
};

const onShow = () => {
  RVerify.action((res) => {
    if (res === 1) handleUserStore();
  });
};

const ButtonVerify = React.forwardRef((props, ref) => {
  return (
    <button
      type="button"
      onClick={onShow}
      ref={ref}
      {...props}
      style={{ display: "none" }}
    ></button>
  );
});

export default ButtonVerify;
