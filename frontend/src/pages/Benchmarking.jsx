import React, { useEffect, useState } from "react";
import { Row, Col, Select, Radio, Card } from "antd";
import CountUp from "react-countup";

import "./benchmarking.scss";

import Chart from "../lib/chart";
import Loading from "../components/Loading";

import { UIStore } from "../data/store";
import sortBy from "lodash/sortBy";

const { Option } = Select;

const chartTmp = [
  {
    title: "Comparing Net-Income",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam libero dolor, pellentesque et luctus et, finibus ac elit. Curabitur vehicula lacus placerat diam eleifend, nec ultrices neque interdum. Sed varius, libero nec sagittis aliquet, diam eros ultricies tellus, quis convallis nibh neque sed dui. In ut neque eget dui faucibus.",
    hasTable: false,
    chart: [],
  },
  {
    title: "Comparing the Living Income gap",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam libero dolor, pellentesque et luctus et, finibus ac elit. Curabitur vehicula lacus placerat diam eleifend, nec ultrices neque interdum. Sed varius, libero nec sagittis aliquet, diam eros ultricies tellus, quis convallis nibh neque sed dui. In ut neque eget dui faucibus.",
    hasTable: true,
    chart: [],
  },
];

const Benchmarking = ({ history }) => {
  const { countries } = UIStore.useState();
  const [compare, setCompare] = useState("country");
  const [defCountry, setDefCountry] = useState(null);
  const [defCompany, setDefCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (loading) {
      const countriesHasCompany = countries.filter((x) => x.company.length > 0);
      const country = countriesHasCompany[0];
      const company = countriesHasCompany[0]?.company[0];
      setDefCountry(country);
      setDefCompany(company);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }

    if (defCompany) {
      setChart(chartTmp);
      console.log(defCountry);
      // generateData(defCountry, defCompany);
    }
  }, [loading, countries, data, defCompany]);

  const handleOnChangeCompany = (value) => {
    const company = defCountry.company.find((x) => x.id === value);
    setDefCompany(company);
  };

  const handleOnChangeCountry = (value) => {
    UIStore.update((s) => {
      s.selectedCountry = null;
    });
    const country = countries.find((x) => x.id === value);
    setDefCountry(country);
    setDefCompany(null);
    renderOptions("company");
  };

  const renderOptions = (type) => {
    let options = [];
    if (type === "country") {
      options = countries;
    }
    if (type === "company") {
      const companies = countries
        .filter((x) => x.id === defCountry?.id)
        .map((x) => x.company)
        .flat();
      options = sortBy(companies, (x) => x.name);
    }
    return (
      options &&
      options.map((comp) => {
        const { id, name } = comp;
        return (
          <Option key={`${id}-${name}`} value={id}>
            {name}
          </Option>
        );
      })
    );
  };

  const renderTable = () => {
    return (
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
    );
  };

  const renderChart = () => {
    return (
      chart &&
      chart.map((c, i) => {
        if (i % 2 === 0) {
          return (
            <Row className="compare-wrapper" data-aos="fade-up">
              <Col span="12">
                <Chart
                  key={`${c.title}-${i}`}
                  type="BARSTACK"
                  wrapper={false}
                />
              </Col>
              <Col span="12" className="compare-body">
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                {c.hasTable && renderTable()}
              </Col>
            </Row>
          );
        }
        return (
          <Row className="compare-wrapper" data-aos="fade-up">
            <Col span="12" className="compare-body">
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              {c.hasTable && renderTable()}
            </Col>
            <Col span="12">
              <Chart key={`${c.title}-${i}`} type="BARSTACK" wrapper={false} />
            </Col>
          </Row>
        );
      })
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container">
      {/* // Option */}
      <Row justify="end" className="compare-options-wrapper" data-aos="fade-up">
        <Col span={5} className="compare-options-body">
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
            placeholder="Select Country"
            optionFilterProp="children"
            onChange={handleOnChangeCountry}
            value={defCountry?.id}
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
            onChange={handleOnChangeCompany}
            value={defCompany?.id}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {renderOptions("company")}
          </Select>
        </Col>
      </Row>
      {/* // Chart */}
      {renderChart()}
    </div>
  );
};

export default Benchmarking;
