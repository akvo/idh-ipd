import React, { useState } from "react";
import { Row, Col, Select, Card, Menu, Image } from "antd";
import CountUp from "react-countup";

import "./case.scss";

import Chart from "../lib/chart";
import CaseMap from "../components/CaseMap";
import CountUpCard from "../components/CountUpCard";

import { UIStore } from "../data/store";

const { Option } = Select;

const Case = ({ history }) => {
  const { countries, selectedCountry } = UIStore.useState();
  const [country, setCountry] = useState(null);

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const handleOnChangeCountry = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (val) => {
    console.log("search:", val);
  };

  const renderOptions = (type) => {
    let options = [];
    if (type === "country") {
      options = selectedCountry ? [selectedCountry] : countries;
    }
    if (type === "company") {
      options = selectedCountry
        ? selectedCountry.companies
        : countries.map((x) => x.companies).flat();
    }
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
      {/* // Dropdown */}
      <Row justify="end" data-aos="fade-up" gutter={[14, 12]}>
        <Col span={4}>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select Country"
            optionFilterProp="children"
            onChange={handleOnChangeCountry}
            value={selectedCountry && selectedCountry?.id}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {renderOptions("country")}
          </Select>
        </Col>
        <Col span={4}>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select Company"
            optionFilterProp="children"
            onChange={onChange}
            value={selectedCountry && selectedCountry?.companies[0]?.id}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {renderOptions("company")}
          </Select>
        </Col>
      </Row>
      {/* // Detail */}
      <Row className="case-wrapper hero" data-aos="fade-up">
        <Col span={8}>
          <CaseMap projects={[]} markers={[]} />
        </Col>
        <Col span={16}>
          <Row
            justify="center"
            className="case-body"
            gutter={[24, 24]}
            data-aos="fade-up"
          >
            <Col span={6} className="case-title">
              <h2>Kenya</h2>
              <span>Country</span>
            </Col>
            <Col span={6} className="case-title">
              <h2>Coffee</h2>
              <span>Commodity</span>
            </Col>
            <Col span={6} className="case-title">
              <Image height={75} src="/icons/coffee.png" />
            </Col>
          </Row>
          <Row className="case-body" justify="space-between" data-aos="fade-up">
            <CountUpCard
              data={{
                value: 0.1,
                text: "Farm size",
                unit: "(ha)",
              }}
            />
            <CountUpCard
              data={{
                value: 2.39,
                text: "Price",
                unit: "(USD/kg)",
              }}
            />
            <CountUpCard
              data={{
                value: 300,
                text: "Production",
                unit: "(kg/ha)",
              }}
            />
            <CountUpCard
              data={{
                value: 557,
                text: "Production Costs",
                unit: "(USD/ha)",
              }}
            />
            <CountUpCard
              data={{
                value: 204,
                text: "Other income",
                unit: "(USD/year)",
              }}
            />
          </Row>
          <Row className="case-body" justify="center" gutter={[24, 24]}>
            <CountUpCard
              span={7}
              data={{
                value: 16,
                text: "Net-income focus crop",
                unit: "(USD/year)",
              }}
            />
            <CountUpCard
              span={7}
              data={{
                value: 220,
                text: "Actual income",
                unit: "(USD/year)",
              }}
            />
            <CountUpCard
              span={7}
              data={{
                value: 2863,
                text: "Living income gap",
                unit: "(USD/year)",
              }}
            />
          </Row>
        </Col>
      </Row>
      {/* // Charts */}
      <Row className="case-wrapper">
        {/* <Col span={4}>
          <Menu
            onClick={(e) => console.log(e)}
            style={{ width: "85%" }}
            mode="vertical"
          >
            <Menu.Item key="1">Net Income Focus Crop</Menu.Item>
            <Menu.Item key="2">Other income</Menu.Item>
            <Menu.Item key="3">The living income gap</Menu.Item>
          </Menu>
        </Col> */}
        <Col span={24}>
          <Row className="case-body" data-aos="fade-up">
            <Col span={14}>
              <Chart
                key={"Net Income Focus Crop"}
                title={"Net Income Focus Crop"}
                type="BARSTACK"
                wrapper={false}
              />
            </Col>
            <Col span={10} className="case-detail">
              <h3>Net Income Focus Crop</h3>
              <p>On the left we present the net-income from the focus crop.</p>
              <p>
                Net-income from the focus crop = Focus crop revenues - Focus
                crop production costs
              </p>
            </Col>
          </Row>
          <Row className="case-body" data-aos="fade-up">
            <Col span={10} className="case-detail">
              <h3>Other income</h3>
              <p>
                On the right we present the value of the average other income
                generated by the farmer households. This can be income generated
                from working off-farm, producing other crops, running a
                household enterprise or other sources of income. Also, this can
                be income generated by the farmers as well as his or her
                household members.
              </p>
            </Col>
            <Col span={14}>
              <Chart
                key={"Other income"}
                title={"Other income"}
                type="BARSTACK"
                wrapper={false}
              />
            </Col>
          </Row>
          <Row className="case-body">
            <Col span={14}>
              <Chart
                key={"The living income gap"}
                title={"The living income gap"}
                type="BARSTACK"
                wrapper={false}
              />
            </Col>
            <Col span={10} className="case-detail">
              <h3>The living income gap</h3>
              <p>
                The living income gap is the difference between the actual
                income of smallholder farmers and the living income benchmark
                level for the country where the farmers are from. Etc,
              </p>
              <Row justify="space-between">
                <CountUpCard
                  span={11}
                  type="reverse"
                  percent={true}
                  data={{
                    value: 7,
                    text: "% of total HH income from focus crop",
                  }}
                />
                <CountUpCard
                  span={11}
                  type="reverse"
                  percent={true}
                  data={{
                    text:
                      "Share of households earning an income above the LI benchmark",
                  }}
                />
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Case;
