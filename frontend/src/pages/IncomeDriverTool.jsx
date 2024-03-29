import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Select } from "antd";

import "./incomedrivertool.scss";

import Chart from "../lib/chart";
import Loading from "../components/Loading";

import { UIStore } from "../data/store";
import api from "../lib/api";
import sortBy from "lodash/sortBy";
import EmptyText from "../components/EmptyText";
import ErrorPage from "../components/ErrorPage";
const { Option } = Select;

const chartTmp = [
  {
    title: "Price of ##crop##",
    name: "status",
    key: "price",
    axis: {
      xAxis: "Price (USD/kg)",
      yAxis: "Average\nprice\n##crop##",
    },
  },
  {
    title: "Land size ##crop##",
    name: "status",
    key: "area",
    axis: {
      xAxis: "Land size ##crop## (ha)",
      yAxis: "Average\nland size\n##crop##",
    },
  },
  {
    title: "Yield",
    name: "status",
    key: "yields",
    axis: {
      xAxis: "Yield ##crop## (kg/ha)",
      yAxis: "Average\nyield\n##crop##",
    },
  },
  {
    title: "Production costs",
    name: "status",
    key: "cop_pha",
    axis: {
      xAxis: "Production costs ##crop## (USD/ha)",
      yAxis: "Average\nproduction costs\n##crop##",
    },
  },
];

const replaceCrop = (crop, text) => {
  const replacedTitle = text.includes("##crop##")
    ? text.replace("##crop##", crop)
    : text;
  return replacedTitle;
};

const IncomeDriverTool = ({ history }) => {
  const { crops, countries, user, errorPage } = UIStore.useState((c) => c);
  const [defCountry, setDefCountry] = useState(null);
  const [defCompany, setDefCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [chart, setChart] = useState(null);

  const generateChartData = useCallback(
    (country, company) => {
      setLoading(true);
      const filter = data.filter(
        (x) => x.country === country?.id && x.crop === company?.crop
      );
      const crop = crops.find((x) => x.id === company.crop)?.name;

      //* generate chart data
      const chartData = chartTmp.map((d) => {
        const tmp = filter.map((x) => {
          return {
            group: replaceCrop(crop, d.axis.yAxis),
            name: x[d.name],
            value: x[d.key],
          };
        });
        return {
          ...d,
          title: replaceCrop(crop, d.title),
          axis: {
            ...d.axis,
            xAxis: replaceCrop(crop, d.axis.xAxis),
            yAxis: replaceCrop(crop, d.axis.yAxis),
          },
          data: tmp,
        };
      });
      setChart(chartData);
      setLoading(false);
    },
    [data, crops]
  );

  useEffect(() => {
    if (countries.length && crops.length) {
      const countriesHasCompany = countries.filter((x) => x.company.length > 0);
      const country = countriesHasCompany[0];
      // const company = countriesHasCompany[0]?.company[0];
      setDefCountry(country);
      // setDefCompany(company);
      api
        .get("/driver-income?skip=0&limit=100")
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch((e) => {
          const { status } = e.response;
          UIStore.update((p) => {
            p.errorPage = status;
          });
        });
      UIStore.update((p) => {
        p.errorPage = false;
      });
    }
    if (loading && user) setLoading(false);
  }, [loading, countries, crops, user]);

  useEffect(() => {
    if (data && defCompany) {
      generateChartData(defCountry, defCompany);
    }
  }, [data, defCountry, defCompany, generateChartData]);

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

  if (loading) {
    return <Loading />;
  }

  if (errorPage) {
    return <ErrorPage />;
  }

  return (
    <>
      <Row className="hero-wrapper">
        <div className="container">
          <Col className="hero-body">
            <h3 data-aos="fade-up">Income Drivers</h3>
            <p data-aos="fade-up">
              Explanation tool Explain, how do the different variable affect
              income.
              <br />
              How should the numbers be interpreted. What does reaching the
              feasible value average.
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
          gutter={[12, 12]}
          wrap={true}
          style={{ marginTop: 6 }}
        >
          <Col sm={24} md={8} lg={4}>
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Select Country"
              optionFilterProp="children"
              onChange={handleOnChangeCountry}
              value={defCountry?.id}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {renderOptions("country")}
            </Select>
          </Col>
          <Col sm={24} md={8} lg={4}>
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Select Company"
              optionFilterProp="children"
              onChange={handleOnChangeCompany}
              value={defCompany?.id}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {renderOptions("company")}
            </Select>
          </Col>
        </Row>
        {/* // Charts */}
        {defCompany && (
          <Row
            className="idt-wrapper"
            justify="space-between"
            gutter={[50, 100]}
            data-aos="fade-up"
            wrap={true}
          >
            {chart &&
              chart.map((d, i) => (
                <Chart
                  key={`${d.title}-${i}`}
                  title={d.title}
                  type="BARGROUP"
                  height={500}
                  span={12}
                  data={d.data}
                  axis={d.axis}
                />
              ))}
          </Row>
        )}
        {!defCompany && <EmptyText amount={countries.length} />}
      </div>
    </>
  );
};

export default IncomeDriverTool;
