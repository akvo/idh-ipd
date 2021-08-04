import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Form, Input, Button, Card, notification } from "antd";

import "./login.scss";

import { UIStore } from "../data/store";

const Login = ({ history }) => {
  const onFinish = (values) => {
    const { email, password } = values;
    if (email === "admin@mail.com" && password === "secret") {
      notification.success({ message: "Login success" });
      UIStore.update((s) => {
        s.user = { email: "admin@mail.com", name: "Admin" };
      });
      history.push("/");
      return;
    }
    notification.error({
      message: "Login failed, email/password doesn't match",
    });
    console.log("Received values of form: ", values);
  };

  return (
    <Row className="login-container" justify="center" align="middle">
      <Col>
        <Card>
          <Form
            layout="vertical"
            name="login"
            className="login-form"
            initialValues={""}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input placeholder="E-mail" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <a className="login-form-forgot" href="#">
                Forgot password
              </a>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
              or <Link to="/register">Register now!</Link>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
