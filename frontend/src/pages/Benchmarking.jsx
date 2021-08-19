import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Radio, Card } from "antd";
import CountUp from "react-countup";

import "./benchmarking.scss";

import Chart from "../lib/chart";
import Loading from "../components/Loading";

import { UIStore } from "../data/store";
import sumBy from "lodash/sumBy";
import EmptyText from "../components/EmptyText";
import { filterCountryOptions } from "../lib/util";
import DropdownCountry from "../components/DropdownCountry";
import ErrorPage from "../components/ErrorPage";

const chartTmp = [
  {
    title: "Comparing Net-Income",
    description:
      "On the left we report the net-income of the farmers from your company against the average net-income of other <type> from <the same type>. Net-income from the focus crop is calculated by subtracting producing costs from the revenues from the focus crop.",
    hasTable: false,
    chart: [
      {
        section: "comparing-net-income",
        name: "revenue",
        key: "revenue",
      },
      {
        section: "comparing-net-income",
        name: "total_prod_cost",
        key: "total_prod_cost",
      },
    ],
  },
  {
    title: "Comparing the Living Income gap",
    description:
      "On the right we report the living income gap of the farmers from your company against the living income gap of <type> from <the same type>. By measuring the actual household income of the farmers, we can assess whether the households earn a living income. If farmers earn an income below the living income level, we can assess the difference between actual household income level and the living income level. This is what we call the living income gap.",
    hasTable: true,
    chart: [
      {
        section: "comparing-the-living-income-gap",
        name: "living_income",
        key: "living_income",
      },
      {
        section: "comparing-the-living-income-gap",
        name: "hh_income",
        key: "hh_income",
      },
      {
        section: "comparing-the-living-income-gap",
        name: "living_income_gap",
        key: "living_income_gap",
      },
    ],
    table: [
      {
        section: "comparing-the-living-income-gap",
        title: "% of total HH income from focus crop",
        percent: true,
        column: [
          {
            name: "hh_income",
            key: "hh_income",
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

const Benchmarking = () => {
  const { countries, crops, user, errorPage } = UIStore.useState((c) => c);
  const [compare, setCompare] = useState("country");
  const [defCountry, setDefCountry] = useState(null);
  const [defCompany, setDefCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chart, setChart] = useState(null);
  const [options, setOptions] = useState({ country: [], company: [] })

  let compareWith =
    chart && defCompany
      ? chart[0].chart.find((x) => x.group !== defCompany.name)
      : false;
  if (compareWith) {
    compareWith = compareWith.group.replace("Others in", "");
  }

  const generateChartData = useCallback(
    (country, company, type) => {
      const crop = crops.find((x) => x.id === company.crop)?.name;
      //* filter data to get others in country
      const otherInCountry = country.company.filter(
        (x) => x.id !== company.id && x.crop === company.crop
      );
      //* filter data to get others in sector
      const otherInSector = countries
        .map((x) => x.company)
        .flat()
        .filter((x) => x.id !== company.id && x.crop === company.crop);

      //* generate chart & table data
      const tmp = chartTmp.map((x) => {
        const companyChart = x.chart.map((c) => {
          if (!company[c.key]) {
            UIStore.update((p) => {
              p.errorPage = true
            })
          }
          return {
            ...c,
            group: company.name,
            value: company[c.key],
          };
        });
        const countryChart = x.chart.map((c) => {
          return {
            ...c,
            group: `Others in ${country?.name} (Average)`,
            value: parseInt(
              sumBy(otherInCountry, (v) => v[c.key]) / otherInCountry.length
            ),
          };
        });
        const sectorChart = x.chart.map((c) => {
          return {
            ...c,
            group: `Others in ${crop} (Average)`,
            value: parseInt(
              sumBy(otherInSector, (v) => v[c.key]) / otherInSector.length
            ),
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
                group: `Avg. in ${country?.name}`,
                value: parseInt(
                  sumBy(otherInCountry, (v) => v[t.key]) / otherInCountry.length
                ),
              };
            });
            const sectorTable = d.column.map((t) => {
              return {
                ...t,
                group: `Avg. in ${crop}`,
                value: parseInt(
                  sumBy(otherInSector, (v) => v[t.key]) / otherInSector.length
                ),
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
    [countries, crops]
  );

  useEffect(() => {
    if (loading && countries.length && crops.length) {
      const countriesHasCompany = countries.filter((x) => x.company.length > 0);
      const country = countriesHasCompany[0];
      setDefCountry(country);
      setOptions(() => ({
        country: countries,
        company: filterCountryOptions(countries, country, 'company')
      }))
      UIStore.update((p) => {
        p.errorPage = false
      })
    }
    if (loading && user) setLoading(false);
  }, [loading, countries, crops, generateChartData, compare, user]);

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
    setOptions({
      ...options,
      company: filterCountryOptions(countries, country, 'company')
    });
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
        wrap={true}
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
              wrap={true}
            >
              <Col sm={24} md={24} lg={12} className="compare-body">
                <Chart
                  key={`${c.title}-${i}`}
                  type="BARSTACK"
                  data={c.chart}
                  wrapper={false}
                />
              </Col>
              <Col sm={24} md={24} lg={12} className="compare-body">
                <h3>{c.title}</h3>
                <p>
                  {c.description
                    .replace(
                      "<type>",
                      compare === "country" ? "company" : compare
                    )
                    .replace("<the same type>", compareWith)}
                </p>
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
            wrap={true}
          >
            <Col sm={24} md={24} lg={12} className="compare-body">
              <h3>{c.title}</h3>
              <p>
                {c.description
                  .replace(
                    "<type>",
                    compare === "country" ? "company" : compare
                  )
                  .replace("<the same type>", compareWith)}
              </p>
              {c.hasTable && renderTable(c?.table)}
            </Col>
            <Col sm={24} md={24} lg={12} className="compare-body">
              <Chart
                height={700}
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

  if (errorPage) {
    return <ErrorPage />
  }

  return (
    <div className="container">
      {/* // Option */}
      <Row
        justify="end"
        className="compare-options-wrapper"
        data-aos="fade-up"
        gutter={[12, 12]}
        wrap={true}
      >
        <Col sm={24} md={10} lg={8} className="compare-options-body">
          <span className="text">Compare with</span>
          <Radio.Group
            onChange={(e) => handleOnChangeCompare(e)}
            defaultValue={compare}
            buttonStyle="solid"
          >
            <Radio.Button value="country" disabled={!defCountry || !defCompany}>Country</Radio.Button>
            <Radio.Button value="sector" disabled={!defCountry || !defCompany}>Sector</Radio.Button>
          </Radio.Group>
        </Col>
        <Col sm={24} md={6} lg={4}>
          <DropdownCountry
            placeholder="Select Country"
            onChange={handleOnChangeCountry}
            value={defCountry?.id}
            options={options.country}
          />
        </Col>
        <Col sm={24} md={6} lg={4}>
          <DropdownCountry
            placeholder="Select Company"
            onChange={handleOnChangeCompany}
            value={defCompany?.id}
            options={options.company}
          />
        </Col>
      </Row>
      {/* // Chart */}
      {defCompany && renderChart()}
      {!defCompany && <EmptyText amount={countries.length} />}
    </div>
  );
};

export default Benchmarking;
