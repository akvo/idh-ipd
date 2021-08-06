import React, { useEffect, useState } from "react";
import { Row, Col, Select } from "antd";

import "./incomedrivertool.scss";

import Chart from "../lib/chart";

import Loading from "../components/Loading";

import { UIStore } from "../data/store";
import api from "../lib/api";
import sortBy from "lodash/sortBy";

const { Option } = Select;

const IncomeDriverTool = ({ history }) => {
  const { countries } = UIStore.useState();
  const [defCountry, setDefCountry] = useState(null);
  const [defCompany, setDefCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (loading) {
      const countriesHasCompany = countries.filter((x) => x.company.length > 0);
      setDefCountry(countriesHasCompany[0]?.id);
      setDefCompany(countriesHasCompany[0]?.company[0]?.id);
      api
        .get(
          `/driver-income/${countriesHasCompany[0]?.company[0]?.crop}/${countriesHasCompany[0]?.id}`
        )
        .then((res) => {
          setData(res.data);
          setLoading(false);
        });
    }
  }, [loading, countries]);

  const handleOnChangeCompany = (value) => {
    setDefCompany(value);
  };

  const handleOnChangeCountry = (value) => {
    UIStore.update((s) => {
      s.selectedCountry = null;
    });
    setDefCountry(value);
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
        .filter((x) => x.id === defCountry)
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

  if (loading) {
    return <Loading />;
  }

  // Feasible data was not there
  console.log(data);
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
        <Row
          justify="end"
          className="idt-wrapper"
          data-aos="fade-up"
          gutter={[14, 12]}
        >
          <Col span={4}>
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Select Country"
              optionFilterProp="children"
              onChange={handleOnChangeCountry}
              value={defCountry}
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
              value={defCompany}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {renderOptions("company")}
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
