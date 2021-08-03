import React from "react";
import { Row, Col, Select, Card } from "antd";

import "./case.scss";

import { UIStore } from "../data/store";

const { Option } = Select;

const Case = ({ history }) => {
  const { countries, selectedCountry } = UIStore.useState();

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (val) => {
    console.log("search:", val);
  };

  const renderOptions = () => {
    const options = selectedCountry
      ? selectedCountry.companies
      : countries.map((x) => x.companies).flat();
    return options.map((comp) => {
      const { id, name, sector } = comp;
      return (
        <Option key={`${id}-${name}`} value={id}>
          {name}
        </Option>
      );
    });
  };

  return (
    <div className="container">
      <Row justify="end">
        <Col span={4}>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select Company"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {renderOptions()}
          </Select>
        </Col>
      </Row>

      <Row className="case-wrapper">
        <Col span={8}>Map</Col>
        <Col span={16}>
          <Row className="case-body">
            <Col span={8} className="case-detail">
              <h2>Kenya</h2>
              <span>Country</span>
            </Col>
            <Col span={8} className="case-detail">
              <h2>Coffee</h2>
              <span>Commodity</span>
            </Col>
            <Col span={8}>Image</Col>
          </Row>
          <Row className="case-body" justify="space-between">
            <Col span={4}>
              <Card className="case-card">
                <h3>0.1</h3>
                <p>
                  Farm size
                  <br />
                  (ha)
                </p>
              </Card>
            </Col>
            <Col span={4}>
              <Card className="case-card">
                <h3>2.39</h3>
                <p>
                  Price
                  <br />
                  (USD / kg)
                </p>
              </Card>
            </Col>
            <Col span={4}>
              <Card className="case-card">
                <h3>300</h3>
                <p>
                  Production
                  <br />
                  (kg / Ha)
                </p>
              </Card>
            </Col>
            <Col span={5}>
              <Card className="case-card">
                <h3>557</h3>
                <p>
                  Production Costs
                  <br />
                  (USD / Ha)
                </p>
              </Card>
            </Col>
            <Col span={4}>
              <Card className="case-card">
                <h3>204</h3>
                <p>
                  Other income
                  <br />
                  (USD / year)
                </p>
              </Card>
            </Col>
          </Row>
          <Row className="case-body" justify="center" gutter={[24, 24]}>
            <Col span={6}>
              <Card className="case-card">
                <h3>16</h3>
                <p>
                  Net-income focus crop
                  <br />
                  (USD/year)
                </p>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="case-card">
                <h3>220</h3>
                <p>
                  Actual income
                  <br />
                  (USD/year)
                </p>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="case-card">
                <h3>2863</h3>
                <p>
                  Living income gap
                  <br />
                  (USD/year)
                </p>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Case;
