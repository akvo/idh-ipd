import React, { useState, useEffect } from "react";
import { Row, Col, Select, Anchor } from "antd";
import StickyBox from "react-sticky-box";

import "./case.scss";

import Chart from "../lib/chart";
import CaseMap from "../components/CaseMap";
import CountUpCard from "../components/CountUpCard";
import Loading from "../components/Loading";

import { UIStore } from "../data/store";
import sortBy from "lodash/sortBy";
import EmptyText from "../components/EmptyText";
import ErrorPage from "../components/ErrorPage";
import api from "../lib/api";

const { Option } = Select;
const { Link } = Anchor;

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
        <h2>Country</h2>
        <span>{country}</span>
      </Col>
      <Col sm={24} md={8} lg={5} className="case-title">
        <h2>Commodity</h2>
        <span>{crop}</span>
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
    living_income,
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
          text: "Yield",
          unit: "(kg/ha)",
        },
        {
          span: 4,
          value: prod_cost,
          text: "Production Costs",
          unit: "(USD/ha)",
          info:
            "We consider two types of production costs: costs for hired labour and costs for inputs.",
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
          span: 5,
          value: net_income,
          text: "Net-income focus crop",
          unit: "(USD/year)",
          info:
            "Net-income of the focus crop is calculated by subtracting the production costs of the focus crop from the revenues from the focus crop.",
          nan:
            "Net-income focus crop could not be calculated because we miss input for one or more of the following variables: farm size, price of the focus crop, yield or production costs.",
        },
        {
          span: 5,
          value: hh_income,
          text: "Actual income",
          unit: "(USD/year)",
          info:
            "Actual income is the sum of net-income from the focus crop and other income of the household.",
          nan: "",
        },
        {
          span: 5,
          value: living_income,
          text: "Living income benchmark",
          unit: "(USD/year)",
          info:
            "The net annual income required for a household in a particular place to afford a decent standard of living for all members of that household. Elements of a decent standard of living include: food, water, housing, education, healthcare, transport, clothing, and other essential needs including provision for unexpected events",
        },
        {
          span: 5,
          value: living_income_gap,
          text: "Living income gap",
          unit: "(USD/year)",
          info:
            "The living income gap is the difference between the living income benchmark and the actual household income.",
          nan:
            "We were not able to calculate the living income gap because the actual income level is unknown or there is no living income benchmark available for the country of interest.",
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

const Case = () => {
  const { countries, selectedCountry, crops, user, errorPage } = UIStore.useState();
  const [defCountry, setDefCountry] = useState(null);
  const [defCompany, setDefCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (loading && countries.length && crops.length) {
      if (selectedCountry) {
        const filterCountry = countries.find((x) => x.id === selectedCountry);
        setDefCountry(selectedCountry);

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
        
        const tmp = {
          ...countriesHasCompany[0],
          company: countriesHasCompany[0]?.company[0],
        };
        setData(tmp);
      }
      UIStore.update((p) => {
        p.errorPage = false
      })
    }
    if (loading && user) setLoading(false);
  }, [loading, countries, crops, selectedCountry, user]);

  const handleOnChangeCompany = (value) => {
    api.get(`/company/${value}`)
      .then(({ data: company }) => {
        const country = countries.find((x) => x.id === defCountry);
        const tmp = {
          ...country,
          company: company,
        };
        setData(tmp);
        setDefCompany(value);
      })
      .catch((e) => {
        const { status } = e.response
        UIStore.update((p) => {
          p.errorPage = status
        })
      });
  };

  const handleOnChangeCountry = (value) => {
    UIStore.update((s) => {
      s.selectedCountry = null;
    });
    const country = countries.find((x) => x.id === value);
    const tmp = {
      ...country,
      company: null,
    };
    setData(tmp);
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

  const generateChartData = (config) => {
    const cl = [
      ...[data.company],
      ...data.company.comparison
    ];
    const results = cl.map(it => {
      return config.map((c) => {
        return {
          group: it.name,
          name: c,
          value: it[c] || 0
        };
      });
    }).flatMap(r => r);    
    return results;
  };

  if (loading) {
    return <Loading />;
  }

  if (errorPage) {
    return <ErrorPage />
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
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
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
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {renderOptions("company")}
              </Select>
            </Col>
          </Row>
          {countries.length === 0 && (
            <Row>
              <Col style={{ textAlign: 'center', width: '100%' }}>
                <EmptyText amount={countries.length} />
              </Col>
            </Row>
          )}
        </div>
        <Col sm={24} md={12} lg={7} className="hero-map">
          {data?.name && <CaseMap name={data.name} />}
        </Col>
        <Col sm={24} md={12} lg={17} className={countries.length > 0 ? "hero-content data-exist" : "hero-content"}>
          {defCompany && renderHeroTitle(data, crops)}
          {defCompany && renderHeroCard(data)}
          {!defCompany && countries.length > 0 && <h1 className="no-data">Please select a Company</h1>}
        </Col>
      </Row>
      {/* // Charts */}
      {defCompany && (
        <>
          <Row
            className="container case-wrapper"
            data-aos="fade-up"
            wrap={true}
          >
            <Col sm={8} md={6} lg={5}>
              <StickyBox offsetTop={100} offsetBottom={20}>
                <Anchor offsetTop={100} targetOffset={120}>
                  <Link href="#net-income" title="Net Income Focus Crop" />
                  <Link href="#other-income" title="Other Income" />
                  <Link href="#living-income" title="The Living Income gap" />
                </Anchor>
              </StickyBox>
            </Col>
            <Col sm={16} md={18} lg={19}>
              <Row
                id="net-income"
                className="case-body odd anchor"
                data-aos="fade-up"
                gutter={[50, 50]}
                wrap={true}
              >
                <Col sm={24} md={24} lg={14}>
                  {data && (
                    <Chart
                      key="Net Income Focus Crop"
                      title="Net Income Focus Crop"
                      type="BARSTACK"
                      height={350}
                      data={generateChartData(["revenue", "total_prod_cost"])}
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
                  <Row justify="space-between">
                    <CountUpCard
                      span={11}
                      type="reverse"
                      percent={false}
                      data={{
                        value: data?.company?.net_income,
                        text: `${getCrop(data, crops)} Net Income (USD/year)`,
                      }}
                    />
                  </Row>
                </Col>
              </Row>
              <Row
                id="other-income"
                className="case-body even anchor"
                data-aos="fade-up"
                gutter={[50, 50]}
                wrap={true}
              >
                <Col sm={24} md={24} lg={10} className="case-detail">
                  <h3>Other Income</h3>
                  <p>
                    On the right we present the value of the average other
                    income generated by the farmer households. This can be
                    income generated from working off-farm, producing other
                    crops, running a household enterprise or other sources of
                    income. Also, this can be income generated by the farmers as
                    well as his or her household members.
                  </p>
                </Col>
                <Col sm={24} md={24} lg={14}>
                  <Chart
                    key="Other income"
                    title="Other income"
                    height={350}
                    type="BARSTACK"
                    data={generateChartData(["other_income"])}
                    wrapper={false}
                  />
                </Col>
              </Row>
              <Row
                id="living-income"
                className="case-body odd anchor"
                data-aos="fade-up"
                gutter={[50, 50]}
                wrap={true}
              >
                <Col sm={24} md={24} lg={14}>
                  <Chart
                    key="The living income gap"
                    title="The living income gap"
                    type="BARSTACK"
                    data={generateChartData(["hh_income", "living_income_gap", "living_income"])}
                    wrapper={false}
                  />
                </Col>
                <Col sm={24} md={24} lg={10} className="case-detail">
                  <h3>The living income gap</h3>
                  <p>
                    The living income gap is the difference between the actual
                    income of smallholder farmers and the living income
                    benchmark level for the country where the farmers are from.
                  </p>
                  <Row justify="space-between">
                    <CountUpCard
                      span={11}
                      type="reverse"
                      percent={true}
                      data={{
                        value:
                          data?.company?.living_income &&
                          data?.company?.hh_income
                            ? (data.company.hh_income /
                                data.company.living_income) *
                              100
                            : null,
                        text: "% of total HH income from focus crop",
                      }}
                    />
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default Case;
