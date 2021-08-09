import React, { useState, useEffect } from "react";
import { Row, Col, Select, Image } from "antd";

import "./case.scss";

import Chart from "../lib/chart";
import CaseMap from "../components/CaseMap";
import CountUpCard from "../components/CountUpCard";
import Loading from "../components/Loading";

import { UIStore } from "../data/store";
import sortBy from "lodash/sortBy";

const { Option } = Select;

const Case = ({ history }) => {
  const { countries, selectedCountry, crops } = UIStore.useState();
  const [defCountry, setDefCountry] = useState(null);
  const [defCompany, setDefCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

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
      setTimeout(() => {
        setLoading(false);
      }, 500);
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
        ? countries.find((x) => x.id === country_id).company
        : sortBy(companies, (x) => x.name);
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
      </div>

      {/* // Detail */}
      <Row className="case-wrapper hero" data-aos="fade-up">
        <Col span={8}>
          <CaseMap projects={[]} markers={[]} name={data.name} />
        </Col>
        <Col span={16}>
          <Row
            justify="center"
            className="case-body"
            gutter={[24, 24]}
            data-aos="fade-up"
          >
            <Col span={6} className="case-title">
              <h2>{data.name}</h2>
              <span>Country</span>
            </Col>
            <Col span={6} className="case-title">
              <h2>{crops.find((x) => x.id === data.company.crop).name}</h2>
              <span>Commodity</span>
            </Col>
            <Col span={6} className="case-title">
              <Image height={75} src="/icons/coffee.png" />
            </Col>
          </Row>
          <Row className="case-body" justify="space-between" data-aos="fade-up">
            <CountUpCard
              data={{
                value: data.company.land_size,
                text: "Farm size",
                unit: "(ha)",
              }}
            />
            <CountUpCard
              data={{
                value: data.company.price,
                text: "Price",
                unit: "(USD/kg)",
              }}
            />
            <CountUpCard
              data={{
                value: data.company.yields,
                text: "Production",
                unit: "(kg/ha)",
              }}
            />
            <CountUpCard
              data={{
                value: data.company.prod_cost,
                text: "Production Costs",
                unit: "(USD/ha)",
              }}
            />
            <CountUpCard
              data={{
                value: data.company.other_income,
                text: "Other income",
                unit: "(USD/year)",
              }}
            />
          </Row>
          <Row className="case-body" justify="center" gutter={[24, 24]}>
            <CountUpCard
              span={7}
              data={{
                value: data.company.net_income,
                text: "Net-income focus crop",
                unit: "(USD/year)",
              }}
            />
            <CountUpCard
              span={7}
              data={{
                value: data.company.hh_income,
                text: "Actual income",
                unit: "(USD/year)",
              }}
            />
            <CountUpCard
              span={7}
              data={{
                value: data.company.living_income_gap,
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
          <Row className="case-body odd" data-aos="fade-up" gutter={[50, 50]}>
            <Col span={14}>
              {data && (
                <Chart
                  key="Net Income Focus Crop"
                  title="Net Income Focus Crop"
                  type="BARSTACK"
                  height={350}
                  data={generateChartData(
                    ["revenue", "prod_cost", "net_income"],
                    data.name
                  )}
                  wrapper={false}
                />
              )}
            </Col>
            <Col span={10} className="case-detail">
              <h3>
                Net Income {crops.find((x) => x.id === data.company.crop).name}
              </h3>
              <p>
                On the left we present the net-income from the{" "}
                {crops.find((x) => x.id === data.company.crop).name}.
              </p>
              <p>
                Net-income from the{" "}
                {crops.find((x) => x.id === data.company.crop).name} ={" "}
                {crops.find((x) => x.id === data.company.crop).name} revenues -{" "}
                {crops.find((x) => x.id === data.company.crop).name} production
                costs
              </p>
            </Col>
          </Row>
          <Row className="case-body even" data-aos="fade-up" gutter={[50, 50]}>
            <Col span={10} className="case-detail">
              <h3>Other Income</h3>
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
                key="Other income"
                title="Other income"
                height={350}
                type="BARSTACK"
                data={generateChartData(["other_income"], data.name)}
                wrapper={false}
              />
            </Col>
          </Row>
          <Row className="case-body odd" data-aos="fade-up" gutter={[50, 50]}>
            <Col span={14}>
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
                  data.name
                )}
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
                    value: data.company.living_income_gap,
                    text: "% of total HH income from focus crop",
                  }}
                />
                <CountUpCard
                  span={11}
                  type="reverse"
                  percent={true}
                  data={{
                    value: data.company.share_income,
                    text:
                      "Share of households earning an income above the LI benchmark",
                  }}
                />
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Case;
