import React, { useEffect, useState } from "react";
import { Row, Col, Divider } from "antd";

import "./benchmarking.scss";

import Loading from "../components/Loading";

import { UIStore } from "../data/store";
import EmptyText from "../components/EmptyText";
import { filterCountryOptions } from "../lib/util";
import DropdownCountry from "../components/DropdownCountry";
import ErrorPage from "../components/ErrorPage";
import api from "../lib/api";
import LiB from "../data/links.json";
import GridChart from "../components/GridChart";

const chartTmp = [
  {
    type: "stack",
    chart: [
      {
        section: "comparing-net-income",
        name: "net_income",
        key: "net_income",
      },
      {
        section: "comparing-net-income",
        name: "total_prod_cost",
        key: "total_prod_cost",
      },
    ],
  },
  {
    type: "table",
    title: "Comparing Net-income from Focus Crop",
    description:
      "We report the focus crop income of the farmers from your company against the average net-income of focus crop. Net-income from the focus crop is calculated by subtracting producing costs from the revenues from the focus crop.",
    hasTable: true,
    table: [
      {
        section: "comparing-focus-income",
        title: "Net-income from focus crop",
        percent: false,
        column: [
          {
            suffix: "<small class='unit'>USD/year</small>",
            percent: false,
            name: "net_income",
            key: "net_income",
          },
        ],
      },
    ],
  },
  {
    type: "table",
    title: "Comparing the Living Income gap",
    description:
      "We report the living income gap of the farmers from your company against the living income gap of Average <crop> in <country>. By measuring the actual household income of the farmers, we can assess whether the households earn a living income. If farmers earn an income below the living income level, we can assess the difference between actual household income level and the living income level. This is what we call the living income gap.",
    hasTable: true,
    link: true,
    table: [
      {
        section: "comparing-the-living-income-gap",
        title: "% of total HH income from focus crop",
        percent: true,
        column: [
          {
            percent: true,
            name: "percent_hh_income",
            key: "percent_hh_income",
          },
        ],
      },
      {
        section: "comparing-the-living-income-gap",
        title: "% of living income gap",
        percent: true,
        column: [
          {
            percent: true,
            name: "percent_li_gap",
            key: "percent_li_gap",
          },
        ],
      },
    ],
  },
  {
    type: "stack",
    chart: [
      {
        section: "comparing-the-living-income-gap",
        name: "net_income",
        key: "net_income",
      },
      {
        section: "comparing-the-living-income-gap",
        name: "hh_income",
        key: "hh_income",
      },
      {
        section: "comparing-the-living-income-gap",
        name: "other_income",
        key: "other_income",
      },
      {
        section: "comparing-the-living-income-gap",
        name: "living_income_gap",
        key: "living_income_gap",
      },
      {
        section: "comparing-the-living-income-gap",
        name: "living_income",
        key: "living_income",
      },
    ],
  },
  {
    type: "separator",
    title: "Income Drivers",
  },
  {
    type: "group",
    title: "Price of ##crop##",
    axis: {
      xAxis: "Price (USD/kg)",
      yAxis: "Average\nprice\n##crop##",
    },
    chart: [
      {
        name: "price",
        key: "price",
      },
    ],
  },
  {
    type: "group",
    title: "Land size of ##crop##",
    axis: {
      xAxis: "Land size of ##crop## (ha)",
      yAxis: "Average\nland size\n##crop##",
    },
    chart: [
      {
        name: "area",
        key: "area",
      },
    ],
  },
  {
    type: "group",
    title: "Yield of ##crop##",
    axis: {
      xAxis: "Yield of ##crop## (kg/ha)",
      yAxis: "Average\nyield\n##crop##",
    },
    chart: [
      {
        name: "yields",
        key: "yields",
      },
    ],
  },
  {
    type: "group",
    title: "Production costs of ##crop##",
    axis: {
      xAxis: "Production costs ##crop## (USD/ha)",
      yAxis: "Average\nproduction costs\n##crop##",
    },
    chart: [
      {
        name: "cop_pha",
        key: "cop_pha",
      },
    ],
  },
  {
    type: "group",
    title: "Non-focus crop income",
    axis: {
      xAxis: "Non-focus crop income (USD)",
      yAxis: "Average non-focus crop income",
    },
    chart: [
      {
        name: "other_income",
        key: "other_income",
      },
    ],
  },
];

const Benchmarking = () => {
  const { countries, crops, user, errorPage } = UIStore.useState((c) => c);
  const [defCountry, setDefCountry] = useState(null);
  const [defCompany, setDefCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chart, setChart] = useState(null);
  const [options, setOptions] = useState({ country: [], company: [] });
  const [BiLink, setBiLink] = useState(false);

  let compareWith =
    chart && defCompany
      ? chart
          .find((x) => x.type === "stack")
          .chart.find((x) => x.group !== defCompany.name)
      : false;
  if (compareWith) {
    compareWith = compareWith.group;
  }
  const replaceCrop = (crop, text) => {
    const replacedTitle = text.includes("##crop##")
      ? text.replace("##crop##", crop)
      : text;
    return replacedTitle;
  };

  const crop = defCompany
    ? crops.find((x) => x.id === defCompany?.crop)?.name
    : "";

  const generateChartData = (cl, company) => {
    const cropName = crops.find((x) => x.id === company?.crop)?.name;
    const countryName = countries.find((x) => x.id === company?.country)?.name;
    const tmp = chartTmp.map((x) => {
      if (x?.description) {
        x = {
          ...x,
          title: x.title.replace("<crop>", cropName),
          description: x.description
            .replace("<crop>", cropName)
            .replace("<country>", countryName),
        };
      }
      if (x?.chart) {
        x = {
          ...x,
          title: x?.title ? replaceCrop(cropName, x.title) : x?.title,
          chart: cl
            .map((col) => {
              return x.chart.map((c) => {
                return {
                  ...c,
                  group: col.name,
                  value: c?.percentage ? c.percentage(col) : col[c.key],
                };
              });
            })
            .flatMap((val) => val),
        };
      }
      if (x?.table) {
        x = {
          ...x,
          table: x.table.map((d) => {
            const dataCl = cl
              .map((c) => {
                return d.column.map((t, i) => {
                  return {
                    ...t,
                    group: c.name,
                    value: c[t.key],
                  };
                });
              })
              .flatMap((d) => d);
            return {
              ...d,
              column: dataCl,
            };
          }),
        };
      }
      if (x?.link) {
        x = { ...x, link: BiLink };
      }
      return x;
    });
    setChart(tmp);
  };

  useEffect(() => {
    if (countries.length && crops.length) {
      const country = countries.filter((x) => x.company.length > 0)[0] || {};
      setDefCountry(country);
      setBiLink(LiB.find((x) => x.country === country.name));
      setOptions({
        country: countries,
        company: filterCountryOptions(countries, country, "company"),
      });
      UIStore.update((p) => {
        p.errorPage = false;
      });
    }
    if (loading && user) setLoading(false);
  }, [loading, countries, crops, user]);

  const handleOnChangeCompany = (value) => {
    api
      .get(`/company/${value}`)
      .then(({ data: company }) => {
        const dataCl = [...[company], ...company.comparison];
        setDefCompany(company);
        generateChartData(dataCl, company);
      })
      .catch((e) => {
        UIStore.update((p) => {
          p.errorPage = e?.response?.status;
        });
      });
  };

  const handleOnChangeCountry = (value) => {
    UIStore.update((s) => {
      s.selectedCountry = null;
    });
    const country = countries.find((x) => x.id === value);
    setBiLink(LiB.find((x) => x.country === country.name));
    setDefCountry(country);
    setDefCompany(null);
    setOptions({
      ...options,
      company: filterCountryOptions(countries, country, "company"),
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (errorPage) {
    return <ErrorPage />;
  }
  return (
    <div className="container">
      <Row
        justify="end"
        className="compare-options-wrapper"
        data-aos="fade-up"
        gutter={[12, 12]}
        wrap={true}
      >
        {defCompany && (
          <Col sm={24} md={12} lg={16}>
            The averages used for benchmarking on this page reflect the average
            values of the companies included in this data set, for that specific
            sector and country.
          </Col>
        )}
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
      {defCompany && (
        <Row
          justify="center"
          align="middle"
          className="compare-title"
          gutter={[24, 24]}
          wrap={true}
        >
          <Col sm={24} md={24} lg={7} className="company-title">
            <h2>Country</h2>
            <span>{defCountry.name}</span>
          </Col>
          <Col sm={24} md={24} lg={7} className="company-title">
            <h2>Company</h2>
            <span>{defCompany?.name}</span>
          </Col>
          <Col sm={24} md={8} lg={5} className="company-title">
            <h2>Commodity</h2>
            <span>{crop}</span>
          </Col>
          <Col sm={24} md={6} lg={5} className="company-title">
            <img
              className="crop-img"
              src={`/icons/${crop?.toLowerCase()}.png`}
              alt={crop}
            />
          </Col>
        </Row>
      )}
      {defCompany && (
        <Row
          justify="center"
          align="middle"
          className="info-divider"
          gutter={[24, 24]}
          wrap={true}
        >
          <Col sm={24} md={24} lg={24}>
            <Divider>
              <table>
                <tbody>
                  <tr>
                    <td>Sector Average: 2020</td>
                    <td>Actual data: 2020</td>
                    <td>
                      Benchmark: {defCountry?.name}, Rural {crop} growing areas,
                      Anker method/CIRES, 2018
                    </td>
                  </tr>
                  <tr></tr>
                  <tr>
                    <td colSpan={3}>
                      Number companies considered in sector average:{" "}
                      {defCompany?.other_company}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Divider>
          </Col>
        </Row>
      )}
      {/* // Chart */}
      {defCompany && chart && <GridChart items={chart} />}
      {!defCompany && <EmptyText amount={countries.length} />}
    </div>
  );
};

export default Benchmarking;
