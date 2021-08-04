import React, { useState } from "react";
import { Row, Col, Select, Radio, Card } from "antd";
import CountUp from "react-countup";

import "./benchmarking.scss";

import Chart from "../lib/chart";

import { UIStore } from "../data/store";

const { Option } = Select;

const Benchmarking = ({ history }) => {
  const { countries, selectedCountry } = UIStore.useState();
  const [compare, setCompare] = useState("country");

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
      {/* // Option */}
      <Row justify="end" className="compare-options-wrapper" data-aos="fade-up">
        <Col span={6} className="compare-options-body">
          <span className="text">Compare with</span>
          <Radio.Group
            onChange={(e) => setCompare(e.target.value)}
            defaultValue={compare}
            buttonStyle="solid"
          >
            <Radio.Button value="country">Country</Radio.Button>
            <Radio.Button value="sector">Sector</Radio.Button>
          </Radio.Group>
        </Col>
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
      {/* // Chart 1 */}
      <Row className="compare-wrapper" data-aos="fade-up">
        <Col span="12">
          <Chart key={"Comparing net income"} type="BARSTACK" wrapper={false} />
        </Col>
        <Col span="12" className="compare-body">
          <h3>Comparing net-income</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam at
            tincidunt dolor. Class aptent taciti sociosqu ad litora torquent per
            conubia nostra, per inceptos himenaeos. Nam eu rhoncus felis, et
            varius libero. Nunc euismod lacinia felis. Phasellus dapibus ut
            nulla at faucibus. Quisque nec nibh tincidunt, vestibulum augue vel,
            condimentum urna. Aenean a mi euismod, gravida diam id, sagittis
            ligula. Interdum et malesuada fames ac ante ipsum primis in
            faucibus. Sed sit amet gravida dolor. Integer ex felis, placerat at
            felis at, sollicitudin posuere ante. Pellentesque blandit tincidunt
            ipsum non porta. Suspendisse pellentesque, libero id tincidunt
            laoreet, est lectus pharetra.
          </p>
        </Col>
      </Row>
      {/* // Chart 2 */}
      <Row className="compare-wrapper" data-aos="fade-up">
        <Col span="12" className="compare-body">
          <h3>Comparing the living income gap</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam at
            tincidunt dolor. Class aptent taciti sociosqu ad litora torquent per
            conubia nostra, per inceptos himenaeos. Nam eu rhoncus felis, et
            varius libero. Nunc euismod lacinia felis. Phasellus dapibus ut
            nulla at faucibus. Quisque nec nibh tincidunt, vestibulum augue vel,
            condimentum urna. Aenean a mi euismod, gravida diam id, sagittis
            ligula. Interdum et malesuada fames ac ante ipsum primis in
            faucibus. Sed sit amet gravida dolor. Integer ex felis, placerat at
            felis at, sollicitudin posuere ante. Pellentesque blandit tincidunt
            ipsum non porta. Suspendisse pellentesque, libero id tincidunt
            laoreet, est lectus pharetra.
          </p>
          <Row justify="space-between" gutter={[12, 12]}>
            <Col span={24}>
              <Card className="compare-card">
                <Card.Grid hoverable={false} style={{ width: "100%" }}>
                  <h4>% of total HH income from focus crop</h4>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                  <h4>Company 3</h4>
                  <h3>
                    <CountUp start={0} end={7} duration={2} />%
                  </h3>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                  <h4>Others in Kenya</h4>
                  <h3>
                    <CountUp start={0} end={7} duration={2} />%
                  </h3>
                </Card.Grid>
                <Card.Grid hoverable={false}>
                  <h4>Others in Sector</h4>
                  <h3>
                    <CountUp start={0} end={7} duration={2} />%
                  </h3>
                </Card.Grid>
              </Card>
            </Col>
            <Col span={24}>
              <Card className="compare-card">
                <h4>
                  Share of households earning an income above the LI benchmark
                </h4>
                <h3>N.A.</h3>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span="12">
          <Chart key={"Comparing net income"} type="BARSTACK" wrapper={false} />
        </Col>
      </Row>
    </div>
  );
};

export default Benchmarking;
