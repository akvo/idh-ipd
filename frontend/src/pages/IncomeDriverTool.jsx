import React, { useState } from "react";
import { Row, Col, Select, Card } from "antd";
import CountUp from "react-countup";

import "./incomedrivertool.scss";

import Chart from "../lib/chart";

import { UIStore } from "../data/store";

const { Option } = Select;

const IncomeDriverTool = ({ history }) => {
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
    <>
      <Row className="hero-wrapper" data-aos="fade-up">
        <div className="container">
          <Col className="hero-body">
            <h3>Income Drivers</h3>
            <p>
              Explanation tool Explain, how do the different variable affect
              income. How should the numbers be interpreted. What does reaching
              the feasible value mean.
            </p>
          </Col>
        </div>
      </Row>
      <div className="container">
        {/* // Option */}
        <Row justify="end" className="idt-wrapper" data-aos="fade-up">
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
        {/* // Charts */}
        <Row
          className="idt-wrapper"
          justify="space-between"
          gutter={[10, 10]}
          data-aos="fade-up"
        >
          {["price", "land", "yield", "production"].map((d, i) => (
            <Chart key={d} title={d} type="BAR" height={500} span={6} />
          ))}
        </Row>
      </div>
    </>
  );
};

export default IncomeDriverTool;
