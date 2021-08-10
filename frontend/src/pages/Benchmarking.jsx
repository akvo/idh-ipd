import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Select, Radio, Card } from "antd";
import CountUp from "react-countup";

import "./benchmarking.scss";

import Chart from "../lib/chart";
import Loading from "../components/Loading";

import { UIStore } from "../data/store";
import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";

const { Option } = Select;

const chartTmp = [
  {
    title: "Comparing Net-Income",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam libero dolor, pellentesque et luctus et, finibus ac elit. Curabitur vehicula lacus placerat diam eleifend, nec ultrices neque interdum. Sed varius, libero nec sagittis aliquet, diam eros ultricies tellus, quis convallis nibh neque sed dui. In ut neque eget dui faucibus.",
    hasTable: false,
    chart: [
      {
        section: "comparing-net-income",
        name: "net_income",
        key: "net_income",
      },
      {
        section: "comparing-net-income",
        name: "revenue",
        key: "revenue",
      },
      {
        section: "comparing-net-income",
        name: "prod_cost",
        key: "prod_cost",
      },
    ],
  },
  {
    title: "Comparing the Living Income gap",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam libero dolor, pellentesque et luctus et, finibus ac elit. Curabitur vehicula lacus placerat diam eleifend, nec ultrices neque interdum. Sed varius, libero nec sagittis aliquet, diam eros ultricies tellus, quis convallis nibh neque sed dui. In ut neque eget dui faucibus.",
    hasTable: true,
    chart: [
      {
        section: "comparing-the-living-income-gap",
        name: "other_income",
        key: "other_income",
      },
      {
        section: "comparing-the-living-income-gap",
        name: "living_income",
        key: "living_income",
      },
      {
        section: "comparing-the-living-income-gap",
        name: "living_income_gap",
        key: "living_income_gap",
      },
      {
        section: "comparing-the-living-income-gap",
        name: "hh_income",
        key: "hh_income",
      },
    ],
    table: [
      {
        section: "comparing-the-living-income-gap",
        title: "% of total HH income from focus crop",
        percent: true,
        column: [
          {
            name: "living_income_gap",
            key: "living_income_gap",
          },
        ],
      },
      {
        section: "comparing-the-living-income-gap",
        title: "Share of households earning an income above the LI benchmark",
        percent: false,
        column: [
          {
            name: "share_income",
            key: "share_income",
          },
        ],
      },
    ],
  },
];

const Benchmarking = ({ history }) => {
  const { countries } = UIStore.useState();
  const [compare, setCompare] = useState("country");
  const [defCountry, setDefCountry] = useState(null);
  const [defCompany, setDefCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chart, setChart] = useState(null);

  const generateChartData = useCallback(
    (country, company, type) => {
      //* filter data to get others in country
      const otherInCountry = country.company.filter(
        (x) => x.id !== company.id && x.crop === company.crop
      );
      //* filter data to get others in sector
      const otherInSector = countries
        .map((x) => x.company)
        .flat()
        .filter((x) => x.crop === company.crop);

      //* generate chart & table data
      const tmp = chartTmp.map((x) => {
        const companyChart = x.chart.map((c) => {
          return {
            ...c,
            group: company.name,
            value: company[c.key],
          };
        });
        const countryChart = x.chart.map((c) => {
          return {
            ...c,
            group: "Others in Country",
            value: sumBy(otherInCountry, (v) => v[c.key]),
          };
        });
        const sectorChart = x.chart.map((c) => {
          return {
            ...c,
            group: "Others in Sector",
            value: sumBy(otherInSector, (v) => v[c.key]),
          };
        });

        let tableTmp = [];
        if (x.hasTable) {
          tableTmp = x.table.map((d) => {
            const companyTable = d.column.map((t) => {
              return {
                ...t,
                group: company.name,
                value: company[t.key],
              };
            });
            const countryTable = d.column.map((t) => {
              return {
                ...t,
                group: "Others in Country",
                value: sumBy(otherInCountry, (v) => v[t.key]),
              };
            });
            const sectorTable = d.column.map((t) => {
              return {
                ...t,
                group: "Others in Sector",
                value: sumBy(otherInSector, (v) => v[t.key]),
              };
            });

            if (type === "country") {
              return {
                ...d,
                column: [...companyTable, ...countryTable],
              };
            } else {
              return {
                ...d,
                column: [...companyTable, ...sectorTable],
              };
            }
          });
        }

        if (type === "country") {
          return {
            ...x,
            chart: [...companyChart, ...countryChart],
            table: tableTmp,
          };
        }
        return {
          ...x,
          chart: [...companyChart, ...sectorChart],
          table: tableTmp,
        };
      });
      setChart(tmp);
    },
    [countries]
  );

  useEffect(() => {
    if (loading) {
      const countriesHasCompany = countries.filter((x) => x.company.length > 0);
      const country = countriesHasCompany[0];
      const company = countriesHasCompany[0]?.company[0];
      setDefCountry(country);
      setDefCompany(company);
      generateChartData(country, company, compare);
      setLoading(false);
    }
  }, [loading, countries, generateChartData, compare]);

  const handleOnChangeCompare = (e) => {
    setCompare(e.target.value);
    generateChartData(defCountry, defCompany, e.target.value);
  };

  const handleOnChangeCompany = (value) => {
    const company = defCountry.company.find((x) => x.id === value);
    setDefCompany(company);
    generateChartData(defCountry, company, compare);
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

  const renderTable = (table) => {
    if (!table) {
      return;
    }

    return table.map((x, i) => (
      <Row
        key={`${x.title}-wrapper`}
        justify="space-between"
        gutter={[12, 12]}
        style={{ marginBottom: "25px" }}
      >
        <Col span={24}>
          <Card className="compare-card">
            <Card.Grid hoverable={false} style={{ width: "100%" }}>
              <h4>{x.title}</h4>
            </Card.Grid>
            {x.column.map((c, i) => (
              <Card.Grid
                key={`${c.group}-${i}`}
                hoverable={false}
                style={{ width: "50%" }}
                className={`${c.value ? "" : "red-card"}`}
              >
                <h4>{c.group}</h4>
                <h3>
                  {c.value ? (
                    <CountUp start={0} end={c.value} duration={2} />
                  ) : (
                    "N.A."
                  )}
                  {c.percent ? "%" : ""}
                </h3>
              </Card.Grid>
            ))}
          </Card>
        </Col>
      </Row>
    ));
  };

  const renderChart = () => {
    return (
      chart &&
      chart.map((c, i) => {
        if (i % 2 === 0) {
          return (
            <Row
              key={`${c.title}-${i}-wrapper`}
              className="compare-wrapper"
              data-aos="fade-up"
              gutter={[50, 50]}
            >
              <Col span="12">
                <Chart
                  key={`${c.title}-${i}`}
                  type="BARSTACK"
                  data={c.chart}
                  wrapper={false}
                />
              </Col>
              <Col span="12" className="compare-body">
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                {c.hasTable && renderTable(c?.table)}
              </Col>
            </Row>
          );
        }
        return (
          <Row
            key={`${c.title}-${i}-wrapper`}
            className="compare-wrapper"
            data-aos="fade-up"
            gutter={[50, 50]}
          >
            <Col span="12" className="compare-body">
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              {c.hasTable && renderTable(c?.table)}
            </Col>
            <Col span="12">
              <Chart
                key={`${c.title}-${i}`}
                type="BARSTACK"
                data={c.chart}
                wrapper={false}
              />
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
      <Row
        justify="end"
        className="compare-options-wrapper"
        data-aos="fade-up"
        gutter={[14, 12]}
      >
        <Col span={6} className="compare-options-body">
          <span className="text">Compare with</span>
          <Radio.Group
            onChange={(e) => handleOnChangeCompare(e)}
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
