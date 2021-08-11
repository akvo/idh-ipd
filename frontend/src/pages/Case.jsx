import React, { useState, useEffect } from "react";
import { Row, Col, Select, Menu } from "antd";
import StickyBox from "react-sticky-box";

import "./case.scss";

import Chart from "../lib/chart";
import CaseMap from "../components/CaseMap";
import CountUpCard from "../components/CountUpCard";
import Loading from "../components/Loading";

import { UIStore } from "../data/store";
import sortBy from "lodash/sortBy";

const { Option } = Select;

const getCrop = (data, crops) => {
  return crops.find((x) => x.id === data?.company?.crop)?.name;
};

const renderHeroTitle = (data, crops) => {
  const country = data?.name;
  const crop = getCrop(data, crops);

  return (
    <Row
      justify="center"
      align="middle"
      className="case-body"
      gutter={[24, 24]}
      data-aos="fade-up"
      wrap={true}
    >
      <Col sm={24} md={24} lg={10} className="case-title">
        <h2>{country}</h2>
        <span>Country</span>
      </Col>
      <Col sm={24} md={8} lg={5} className="case-title">
        <h2>{crop}</h2>
        <span>Commodity</span>
      </Col>
      <Col sm={24} md={6} lg={5} className="case-title">
        <img
          className="crop-img"
          src={`/icons/${crop?.toLowerCase()}.png`}
          alt={crop}
        />
      </Col>
    </Row>
  );
};

const renderHeroCard = (data) => {
  const {
    land_size,
    price,
    yields,
    prod_cost,
    other_income,
    net_income,
    hh_income,
    living_income_gap,
  } = data?.company;

  const tmp = [
    {
      section: "hero-1",
      cards: [
        {
          span: 4,
          value: land_size,
          text: "Farm size",
          unit: "(ha)",
        },
        {
          span: 4,
          value: price,
          text: "Price",
          unit: "(USD/kg)",
        },
        {
          span: 4,
          value: yields,
          text: "Production",
          unit: "(kg/ha)",
        },
        {
          span: 4,
          value: prod_cost,
          text: "Production Costs",
          unit: "(USD/ha)",
        },
        {
          span: 4,
          value: other_income,
          text: "Other income",
          unit: "(USD/year)",
        },
      ],
    },
    {
      section: "hero-2",
      cards: [
        {
          span: 7,
          value: net_income,
          text: "Net-income focus crop",
          unit: "(USD/year)",
        },
        {
          span: 7,
          value: hh_income,
          text: "Actual income",
          unit: "(USD/year)",
        },
        {
          span: 7,
          value: living_income_gap,
          text: "Living income gap",
          unit: "(USD/year)",
        },
      ],
    },
  ];

  return tmp.map((x, i) => {
    return (
      <Row
        key={x.section}
        className="case-body"
        justify={`${i % 2 === 0 ? "space-between" : "space-around"}`}
        data-aos="fade-up"
        wrap={true}
      >
        {x.cards.map((c, j) => (
          <CountUpCard key={`${c.text}-${j}`} span={c.span} data={c} />
        ))}
      </Row>
    );
  });
};

const Case = ({ history }) => {
  const { countries, selectedCountry, crops } = UIStore.useState();
  const [defCountry, setDefCountry] = useState(null);
  const [defCompany, setDefCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [sideMenu, setSideMenu] = useState("net-income");

  useEffect(() => {
    if (loading) {
      if (selectedCountry) {
        const filterCountry = countries.find((x) => x.id === selectedCountry);
        setDefCountry(selectedCountry);
        setDefCompany(filterCountry?.company[0]?.id);
        const tmp = {
          ...filterCountry,
          company: filterCountry?.company[0],
        };
        setData(tmp);
      }
      if (!selectedCountry) {
        const countriesHasCompany = countries.filter(
          (x) => x.company.length > 0
        );
        setDefCountry(countriesHasCompany[0]?.id);
        setDefCompany(countriesHasCompany[0]?.company[0]?.id);
        const tmp = {
          ...countriesHasCompany[0],
          company: countriesHasCompany[0]?.company[0],
        };
        setData(tmp);
      }
      setLoading(false);
    }
  }, [loading, countries, selectedCountry]);

  const handleOnChangeCompany = (value) => {
    const country = countries.find((x) => x.id === defCountry);
    const tmp = {
      ...country,
      company: country?.company.find((x) => x.id === value),
    };
    setData(tmp);
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
      const country_id = selectedCountry || defCountry;
      const companies = countries
        .filter((x) => x.id === country_id)
        .map((x) => x.company)
        .flat();
      options = selectedCountry
        ? countries.find((x) => x.id === country_id)?.company
        : sortBy(companies, (x) => x.id);
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

  const generateChartData = (config, group) => {
    return config.map((x) => {
      return {
        group: group,
        name: x,
        value: data.company[x],
      };
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* // Detail */}
      <Row className="hero" data-aos="fade-up">
        <div
          className="container"
          style={{
            position: "absolute",
            zIndex: 2,
            marginTop: "50px",
            width: "100%",
          }}
        >
          <Row justify="end" data-aos="fade-up" gutter={[14, 12]}>
            <Col sm={24} md={8} lg={4}>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Select Country"
                optionFilterProp="children"
                onChange={handleOnChangeCountry}
                value={defCountry}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
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
                value={defCompany}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {renderOptions("company")}
              </Select>
            </Col>
          </Row>
        </div>
        <Col sm={24} md={12} lg={7} className="hero-map">
          <CaseMap projects={[]} markers={[]} name={data.name} />
        </Col>
        <Col sm={24} md={12} lg={17} className="hero-content">
          {renderHeroTitle(data, crops)}
          {renderHeroCard(data)}
        </Col>
      </Row>
      {/* // Charts */}
      <Row className="container case-wrapper" data-aos="fade-up" wrap={true}>
        <Col sm={8} md={6} lg={4}>
          <StickyBox offsetTop={100} offsetBottom={20}>
            <Menu
              onClick={(e) => setSideMenu(e.key)}
              selectedKeys={[sideMenu]}
              // style={{ width: "85%" }}
              mode="vertical"
            >
              <Menu.Item key="net-income">
                <a href="#net-income">Net Income Focus Crop</a>
              </Menu.Item>
              <Menu.Item key="other-income">
                <a href="#other-income">Other income</a>
              </Menu.Item>
              <Menu.Item key="living-income">
                <a href="#living-income">The living income gap</a>{" "}
              </Menu.Item>
            </Menu>
          </StickyBox>
        </Col>
        <Col sm={16} md={18} lg={20}>
          <section id="net-income">
            <Row
              className="case-body odd"
              data-aos="fade-up"
              gutter={[50, 50]}
              style={{ marginLeft: 0, marginRight: 0 }}
              wrap={true}
            >
              <Col sm={24} md={24} lg={14}>
                {data && (
                  <Chart
                    key="Net Income Focus Crop"
                    title="Net Income Focus Crop"
                    type="BARSTACK"
                    height={350}
                    data={generateChartData(
                      ["revenue", "prod_cost", "net_income"],
                      data?.name
                    )}
                    wrapper={false}
                  />
                )}
              </Col>
              <Col sm={24} md={24} lg={10} className="case-detail">
                <h3>Net Income {getCrop(data, crops)}</h3>
                <p>
                  On the left we present the net-income from the{" "}
                  {getCrop(data, crops)}.
                </p>
                <p>
                  Net-income from the {getCrop(data, crops)} ={" "}
                  {getCrop(data, crops)} revenues - {getCrop(data, crops)}{" "}
                  production costs
                </p>
              </Col>
            </Row>
          </section>
          <section id="other-income">
            <Row
              className="case-body even"
              data-aos="fade-up"
              gutter={[50, 50]}
              style={{ marginLeft: 0, marginRight: 0 }}
              wrap={true}
            >
              <Col sm={24} md={24} lg={10} className="case-detail">
                <h3>Other Income</h3>
                <p>
                  On the right we present the value of the average other income
                  generated by the farmer households. This can be income
                  generated from working off-farm, producing other crops,
                  running a household enterprise or other sources of income.
                  Also, this can be income generated by the farmers as well as
                  his or her household members.
                </p>
              </Col>
              <Col sm={24} md={24} lg={14}>
                <Chart
                  key="Other income"
                  title="Other income"
                  height={350}
                  type="BARSTACK"
                  data={generateChartData(["other_income"], data?.name)}
                  wrapper={false}
                />
              </Col>
            </Row>
          </section>
          <section id="living-income">
            <Row
              className="case-body odd"
              data-aos="fade-up"
              gutter={[50, 50]}
              style={{ marginLeft: 0, marginRight: 0 }}
              wrap={true}
            >
              <Col sm={24} md={24} lg={14}>
                <Chart
                  key="The living income gap"
                  title="The living income gap"
                  type="BARSTACK"
                  data={generateChartData(
                    [
                      "other_income",
                      "living_income",
                      "living_income_gap",
                      "hh_income",
                    ],
                    data?.name
                  )}
                  wrapper={false}
                />
              </Col>
              <Col sm={24} md={24} lg={10} className="case-detail">
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
                      value: data?.company?.living_income_gap,
                      text: "% of total HH income from focus crop",
                    }}
                  />
                  <CountUpCard
                    span={11}
                    type="reverse"
                    percent={true}
                    data={{
                      value: data?.company?.share_income,
                      text:
                        "Share of households earning an income above the LI benchmark",
                    }}
                  />
                </Row>
              </Col>
            </Row>
          </section>
        </Col>
      </Row>
    </>
  );
};

export default Case;
