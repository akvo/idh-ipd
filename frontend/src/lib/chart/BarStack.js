import {
  Easing,
  Color,
  TextStyle,
  backgroundColor,
  Icons,
} from "./chart-style.js";
import { objectNames } from "../util.js";
import uniq from "lodash/uniq";
import _ from "lodash";

const BarStack = (data, extra) => {
  if (!data) {
    return {
      title: {
        text: "No Data",
        subtext: "",
        left: "center",
        top: "20px",
        ...TextStyle,
      },
    };
  }
  /* Custom Calculation */
  data = data.map((x) => {
    let val = x.value;
    if (val && x.var === "total_prod_cost") {
      val = 0 - val;
    }
    const net_income = data.find(
      (d) => d.var === "net_income" && d.group === x.group
    );
    if (val && x.var === "revenue" && net_income) {
      val = val - net_income.value;
    }
    return {
      ...x,
      value: val,
      actual_value: x.value,
    };
  });
  let guides = data.filter(
    (x) => x.var === "living_income" || x.var === "hh_income"
  );
  let revenue = _.chain(data)
    .groupBy("group")
    .map((x, i) => {
      let rev = x.filter(
        (d) => d.var === "net_income" || d.var === "total_prod_cost"
      );
      rev = rev.filter((d) => d.value !== 0);
      if (rev.length === 2) {
        const tref = rev.reduce((r, ix) => ix.actual_value + r.actual_value);
        return {
          type: "line",
          data: [],
          markLine: {
            silent: true,
            data: [
              rev.map((r) => ({
                name: `◀------ Revenue: ${tref} USD/year -------▶`,
                coord: [i, r.value],
                symbol: "square",
              })),
            ],
            offset: 50,
            lineStyle: {
              type: "dashed",
              color: "transparent",
            },
            label: {
              padding: 80,
              show: true,
              position: "insideMiddleTop",
              align: "center",
            },
          },
        };
      }
      return false;
    })
    .value()
    .filter((x) => x);
  /* End Custom Calculation */
  const filterData = data
    .filter((x) => x.value)
    .filter((x) => x.var !== "living_income")
    .filter((x) => x.var !== "hh_income")
    .filter((x) => x.var !== "living_income_gap");
  let xAxis = uniq(data.map((x) => x.group));
  xAxis = xAxis.map((x) =>
    filterData.find((f) => f.group === x) ? x : `${x} (No data)`
  );
  let legends = uniq(data.map((x) => x.name));
  let series = _.chain(data)
    .filter((x) => x.var !== "living_income")
    .filter((x) => x.var !== "hh_income")
    .groupBy("name")
    .map((x, i) => {
      const formatter = (a) => {
        const curr = x.find((g) => g?.group === a?.name);
        if (curr?.name === objectNames.revenue && curr?.actual_value) {
          return curr.actual_value;
        }
        return `${a.value}`;
      };
      let itemStyle = {};
      if (objectNames.living_income_gap === i) {
        itemStyle = {
          itemStyle: {
            color: "#f2f2f2",
            borderType: "dashed",
            borderColor: "red",
          },
        };
      }
      if (objectNames.total_prod_cost === i) {
        itemStyle = {
          itemStyle: {
            color: "#8d0101",
          },
        };
      }
      return {
        name: i,
        label: {
          show: true,
          position: "inside",
          formatter: formatter,
          textStyle: {
            color: objectNames.living_income_gap === i ? "#000" : "#FFF",
            fontFamily: "Gotham A,Gotham B",
            fontSize: 18,
            fontWeight: "bold",
          },
        },
        barWidth: 150,
        stack: "t",
        type: "bar",
        data: x.map((v) => {
          if (v.var === "living_income_gap") {
            const curr = data
              .filter((g) => g?.group === v.group)
              .filter((g) => g.value)
              .map((x) => x.var);
            if (!curr.includes("net_income")) {
              return null;
            }
          }
          return v.value;
        }),
        ...itemStyle,
      };
    })
    .value();
  if (guides.length) {
    guides = guides.map((x, i) => {
      return { name: `${x.name} ${x.group}`, group: x.group, yAxis: x.value };
    });
    guides = _.chain(guides)
      .groupBy("group")
      .map((x, i) => {
        const pos = i.includes("Company")
          ? "insideMiddleTop"
          : "insideMiddleBottom";
        return {
          type: "line",
          label: {
            show: false,
          },
          tooltip: {
            show: false,
          },
          markLine: {
            lineStyle: {
              type: "dashed",
              color: "red",
            },
            symbol: "rect",
            label: {
              show: true,
              position: pos,
              formatter: "{custom|{b}}",
              backgroundColor: "transparent",
              rich: {
                custom: {
                  align: "center",
                  fontSize: "10px",
                  color: "#000",
                  textBorderColor: "#FFF",
                  textBorderWidth: 3,
                  width: "100%",
                },
              },
            },
            data: x.filter((d) => d.yAxis),
          },
        };
      })
      .value();
    series = [...series, ...guides];
  }
  if (revenue.length) {
    series = [...series, ...revenue];
  }
  let option = {
    ...Color,
    legend: {
      data: legends,
      icon: "circle",
      left: "right",
      itemGap: 10,
      align: "right",
      orient: "vertical",
      textStyle: {
        fontFamily: "Gotham A,Gotham B",
        fontWeight: "normal",
        fontSize: 12,
        marginLeft: 20,
      },
    },
    grid: {
      top: series.length * 30,
      left: "auto",
      right: "auto",
      bottom: "25px",
      borderColor: "#ddd",
      borderWidth: 0.5,
      show: true,
      label: {
        color: "#222",
        fontFamily: "Gotham A,Gotham B",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: (f) => {
        if (f.seriesName === "Revenues from main crop") {
          let revenue = data.find(
            (x) => x.var === "revenue" && x.group === f.name
          );
          return `${f.name}<br/>${f.seriesName}:<b>${revenue.actual_value}</b>`;
        }
        if (f?.seriesName) {
          return `${f.name}<br/>${f.seriesName}:<b>${f.value}</b>`;
        }
        return `${f.name}:<b>${f.value}</b>`;
      },
      backgroundColor: "#ffffff",
      ...TextStyle,
    },
    toolbox: {
      show: true,
      orient: "horizontal",
      left: "30px",
      top: "0px",
      feature: {
        saveAsImage: {
          type: "jpg",
          title: "save image",
          icon: Icons.saveAsImage,
        },
      },
    },
    yAxis: [
      {
        type: "value",
        axisLabel: {
          inside: true,
          backgroundColor: "#f2f2f2",
          padding: 5,
          fontFamily: "Gotham A,Gotham B",
          fontSize: 12,
        },
        axisLine: {
          show: true,
        },
        minorTick: {
          show: true,
        },
        minorSplitLine: {
          show: true,
        },
      },
    ],
    xAxis: {
      data: xAxis,
      type: "category",
      axisLine: {
        lineStyle: {
          type: "dashed",
        },
        show: true,
      },
      axisLabel: {
        fontFamily: "Gotham A,Gotham B",
        fontSize: 12,
        color: "#222",
      },
    },
    series: series,
    ...Color,
    ...backgroundColor,
    ...Easing,
    ...extra,
  };
  return option;
};

export default BarStack;
