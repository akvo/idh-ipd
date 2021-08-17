import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Avatar,
  Button,
  Table,
  Tag,
  Form,
  Modal,
  Input,
  Select,
} from "antd";
import { UIStore } from "../data/store";
import api from "../lib/api";

const { Option, OptGroup } = Select;

const Manage = () => {
  const { countries } = UIStore.useState();
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState({});
  const [access, showAccess] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (pageLoading) {
      api.get("/user/?skip=0&limit=100").then((res) => {
        setUsers(res.data);
        setPageLoading(false);
      });
    }
  }, [pageLoading]);

  const handleAccess = (id) => {
    api.get(`/user/${id}`).then((res) => {
      showAccess(true);
      form.setFieldsValue(res.data);
      setSelected(res.data);
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (t, r) => (
        <div>
          <Avatar src={r.picture || "/default-avatar.jpeg"} />{" "}
          <span>
            {t || r.email}{" "}
            {!r?.email_verified && <Tag color="red">Not Verified</Tag>}
          </span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id) => <Button onClick={(e) => handleAccess(id)}>Edit</Button>,
    },
  ];

  const onRoleChange = (value) => {
    form.setFieldsValue({ role: value });
  };

  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <Row justify="center" wrap={true}>
      <Col sm={20} md={20} lg={20}>
        <Table loading={pageLoading} columns={columns} dataSource={users} />
      </Col>
      <Modal
        title={"Edit"}
        centered
        visible={access}
        onOk={() => showAccess(false)}
        onCancel={() => showAccess(false)}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={selected}
          onFinish={onFinish}
        >
          <Form.Item label="Email" name="email" valuePropName="email">
            <Input />
          </Form.Item>

          <Form.Item label="Role" name="role" valuePropName="role">
            <Select onChange={onRoleChange}>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Companies" name="company" valuePropName="company">
            <Select mode="multiple" placeholder="select one or more company">
              {countries.map((x, i) => (
                <OptGroup key={i} label={x.name}>
                  {x.company.map((c, ci) => (
                    <Option key={ci} value={c.name}>
                      {c.name}
                    </Option>
                  ))}
                </OptGroup>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};

export default Manage;
