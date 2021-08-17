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
  const [paginate, setPaginate] = useState({
    total: 1,
    current: 1
  })

  useEffect(() => {
    if (pageLoading) {
      api.get("/user/?skip=0&limit=100").then((res) => {
        setUsers(res.data);
        setPaginate({
          ...paginate,
          total: res.data.length || 1
        })
        setPageLoading(false);
      });
    }
  }, [pageLoading]);

  const handleAccess = (id) => {
    api.get(`/user/${id}`).then((res) => {
      showAccess(true);
      const u = {
        ...res.data,
        access: res.data.access.map(it => it.company)
      };
      console.log('u', u)
      form.setFieldsValue(u);
      setSelected(u);
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
    setSelected({ ...selected, role: value });
  };

  const onEmailChange = (e) => {
    form.setFieldsValue({ email: e.target.value })
    setSelected({
      ...selected,
      email: e.target.value
    })
  };

  const onCompanyChange = (values) => {
    form.setFieldsValue({ access: values })
    setSelected({ ...selected, access: values })
  };

  const onPageChange = page => {
    setPaginate({
      ...paginate,
      current: page
    })
  }

  const onFinish = (values) => {
    api.patch(`/user/${selected.id}`, {
      ...values,
      access: values.access.map(value => ({ user: selected.id, company: value }))
    })
      .then(({ data }) => {
        setUsers([
          ...users.map(user => user.id === data.id ? data : user)
        ])
      })
      .catch(e => console.log('error', e));
  };

  return (
    <Row justify="center" wrap={true}>
      <Col sm={20} md={20} lg={20}>
        <Table
          loading={pageLoading}
          columns={columns}
          dataSource={users}
          pagination={{
            ...paginate,
            onChange: onPageChange
          }}
        />
      </Col>
      <Modal
        title={"Edit"}
        centered
        visible={access}
        onOk={() => {
          form.submit()
          showAccess(false)
        }}
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
            <Input value={selected.email || ''} onChange={onEmailChange} />
          </Form.Item>

          <Form.Item label="Role" name="role" valuePropName="role">
            <Select onChange={onRoleChange} value={selected.role || ''}>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Companies" name="access" valuePropName="company">
            <Select mode="multiple" placeholder="select one or more company" onChange={onCompanyChange} value={selected.access || []}>
              {countries.map((x, i) => (
                <OptGroup key={i} label={x.name}>
                  {x.company.map((c, ci) => (
                    <Option key={ci} value={c.id}>
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
