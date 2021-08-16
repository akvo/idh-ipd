import React, { useEffect, useState } from "react";
import { Row, Col, Collapse, Avatar, Button, Checkbox, Divider } from "antd";
import { UIStore } from "../data/store";
import Loading from "../components/Loading";
import flatten from "lodash/flatten";
import api from "../lib/api";

const { Panel } = Collapse;

const PanelHeader = ({ data }) => {
  return (
    <span>
      <Avatar size="small" src={data.picture || "/default-avatar.jpeg"} />{" "}
      {data.name || data.email}
    </span>
  );
};

const Approve = ({ data }) => {
  return (
    <Button disabled={!data?.email_verified}>
      {data?.email_verified ? "Approve" : "Email not verified"}
    </Button>
  );
};

const CheckBoxes = ({ options, defaultCheckedList }) => {
  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  const onChange = (list) => {
    setCheckedList(list);
  };

  return (
    <Checkbox.Group
      value={checkedList}
      onChange={onChange}
      style={{ width: "100%" }}
    >
      <Row>
        {options.map((x, i) => (
          <Col span={12} key={i}>
            <Checkbox value={x.company}>
              {x.country} - {x.company}
            </Checkbox>
          </Col>
        ))}
      </Row>
    </Checkbox.Group>
  );
};

const Manage = () => {
  const { countries, loading } = UIStore.useState();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (!loading && !users.loading) {
      api.get("/user/?skip=0&limit=100").then((res) => {
        setUsers(res.data);
      });
    }
  }, [users, loading]);

  if (loading) {
    return <Loading />;
  }
  const options = flatten(
    countries.map((x) => {
      return x.company.map((c) => ({
        country: x.name,
        company: c.name,
      }));
    })
  );
  return (
    <Row justify="center" wrap={true}>
      <Col sm={12} md={12} lg={12}>
        <Collapse accordion>
          {users.map((x, i) => (
            <Panel
              header={<PanelHeader data={x} />}
              key={i}
              extra={<Approve data={x} />}
            >
              <Row>
                <Col sm={6} md={6} lg={6}>
                  Name
                </Col>
                <Col sm={6} md={6} lg={6}>
                  : {x.name}
                </Col>
              </Row>
              <Row>
                <Col sm={6} md={6} lg={6}>
                  Email
                </Col>
                <Col sm={6} md={6} lg={6}>
                  : {x.email}
                </Col>
              </Row>
              <Divider orientation="left" plain>
                Access
              </Divider>
              <CheckBoxes options={options} />
            </Panel>
          ))}
        </Collapse>
      </Col>
    </Row>
  );
};

export default Manage;
