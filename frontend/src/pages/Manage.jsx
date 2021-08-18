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
  PageHeader,
  Radio,
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
  const [tableLoading, setTableLoading] = useState(false);
  const [paginate, setPaginate] = useState({
    total: 1,
    current: 1,
    pageSize: 10,
  });
  const [tab, setTab] = useState('0')

  const onPageChange = (page, active) => {
    setTableLoading(true);
    api.get(`/user/?page=${page}&active=${active}`)
      .then((res) => {
        setUsers(res.data.data);
        setPaginate({
          ...paginate,
          current: res.data.current,
          total: res.data.total,
        });
        setTableLoading(false);
      })
      .catch((e) => {
        if (e.response?.status === 404) {
          setUsers([])
          setPaginate({
            ...paginate,
            total: 0,
            current: 0
          })
          setTableLoading(false)
        }
      });
  };

  useEffect(() => {
    if (pageLoading) {
      api.get(`/user/?page=1&active=${tab}`).then((res) => {
        setUsers(res.data.data);
        setPaginate({
          ...paginate,
          current: res.data.current,
          total: res.data.total,
        });
        setPageLoading(false);
      });
    }
  }, [pageLoading, paginate, tab]);

  const handleAccess = (id) => {
    api.get(`/user/${id}`).then((res) => {
      showAccess(true);
      const u = {
        ...res.data,
        access: res.data.access.map((it) => it.company),
      };
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
      render: (id, r) => <Button disabled={!r?.email_verified} onClick={(e) => handleAccess(id)}>{r.active ? 'Edit' : 'Approve'}</Button>,
    },
  ];

  const onRoleChange = (value) => {
    form.setFieldsValue({ role: value });
    setSelected({ ...selected, role: value });
  };

  const onEmailChange = (e) => {
    form.setFieldsValue({ email: e.target.value });
    setSelected({
      ...selected,
      email: e.target.value,
    });
  };

  const onCompanyChange = (values) => {
    form.setFieldsValue({ access: values });
    setSelected({ ...selected, access: values });
  };

  const onSwitchTab = (key) => {
    setTab(key)
    setPaginate({ ...paginate, current: 1 })
    onPageChange(1, key)
  }

  const onFinish = (values) => {
    api
      .put(
        `/user/${selected.id}?role=${values.role}&active=1`,
        values.access.map((value) => ({
          user: selected.id,
          company: value,
        }))
      )
      .then(() => {
        onPageChange(1, selected.active ? 1 : 0)
        Modal.success({
          title: 'Success!',
          content: 'Update process has been applied'
        })
        showAccess(false)
      })
      .catch((e) => console.log("error", e));
  };

  return (
    <Row justify="center" wrap={true}>
      <Col sm={20} md={20} lg={20}>
        <PageHeader style={{ textAlign: 'center' }}>
          <Radio.Group
            value={tab}
            buttonStyle="solid"
            onChange={(e) => onSwitchTab(e.target.value)}>
            <Radio.Button value="0">Pending Approval</Radio.Button>
            <Radio.Button value="1">All Users</Radio.Button>
          </Radio.Group>
        </PageHeader>
        <Table
          loading={pageLoading ? pageLoading : tableLoading}
          columns={columns}
          dataSource={users}
          pagination={{
            ...paginate,
            onChange: (page) => onPageChange(page, tab),
          }}
          locale={{
            emptyText: 'There are no pending request for user to activate the status'
          }}
        />
      </Col>
      <Modal
        title={"Edit"}
        centered
        visible={access}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => showAccess(false)}
        okText={selected?.active ? 'Confrim Changes' : 'Approve'}
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
            <Input value={selected?.email} onChange={onEmailChange} />
          </Form.Item>

          <Form.Item label="Role" name="role" valuePropName="role">
            <Select onChange={onRoleChange} value={selected?.role}>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Companies" name="access" valuePropName="company">
            <Select
              mode="multiple"
              placeholder="select one or more company"
              onChange={onCompanyChange}
              value={selected.access || []}
            >
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
