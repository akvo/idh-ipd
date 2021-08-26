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
    (x) => x.var === "living_income" || x.var === "net_income"
  );
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
      let itemStyle = {};
      let labelColor = "#ffffff";
      const formatter = (a) => {
        const curr = x.find((g) => g?.group === a?.name);
        if (curr?.name === objectNames.revenue && curr?.actual_value) {
          return curr.actual_value;
        }
        if (curr?.name === objectNames.total_prod_cost) {
          return -a.value;
        }
        if (curr?.name === objectNames.living_income_gap) {
          if (!a.value) {
            return "Nothing";
          }
          let combined_income = data
            .filter((d) => d.group === curr.group)
            .filter(
              (d) =>
                d.var === "net_income" ||
                d.var === "other_income" ||
                d.var === "living_income_gap"
            )
            .filter((d) => d.value)
            .map((d) => d.value);
          if (combined_income.length) {
            combined_income = combined_income.reduce((k, v) => k + v);
            return ((a.value / combined_income) * 100).toFixed(2) + "%";
          }
          return "Nothing";
        }
        return `${a.value}`;
      };
      if (objectNames.living_income_gap === i) {
        labelColor = "#000";
        itemStyle = {
          itemStyle: {
            color: "#f2f2f2",
            borderType: "dashed",
            borderColor: "red",
          },
          label: {
            show: true,
            position: "inside",
            formatter: formatter,
            textStyle: {
              color: labelColor,
              fontFamily: "Gotham A,Gotham B",
              fontSize: "1.5rem",
              fontWeight: "bold",
            },
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
            color: labelColor,
            fontFamily: "Gotham A,Gotham B",
            fontSize: ".75rem",
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
  let guide = {};
  if (guides.length) {
    guides = guides.map((x, i) => {
      return { name: `${x.name}`, yAxis: x.value };
    });
    guide = {
      markLine: {
        lineStyle: {
          type: "dashed",
          color: "red",
        },
        symbol: "rect",
        label: {
          show: true,
          position: "insideEndTop",
          formatter: "{custom|{b}}",
          padding: 5,
          elipsis: "break",
          backgroundColor: "white",
          rich: {
            custom: {
              align: "center",
            },
          },
        },
        data: guides.filter((x) => x.yAxis),
      },
    };
    series = series?.map((x, i) => {
      if (x?.name === objectNames.living_income_gap) {
        if (x?.data.filter((d) => d).length) {
          return { ...x, ...guide };
        }
      }
      return x;
    });
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
