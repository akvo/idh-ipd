import { Easing, Color, TextStyle, backgroundColor } from "./chart-style.js";
import uniq from "lodash/uniq";
import _ from "lodash";
import sortBy from "lodash/sortBy";

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
  /* End Custom Calculation */

  let xAxis = uniq(data.map((x) => x.group));
  let legends = uniq(data.map((x) => x.name));
  let series = _.chain(data)
    .groupBy("name")
    .map((x, i) => {
      return {
        name: i,
        label: {
          show: true,
          position: "inside",
          formatter: (a) => {
            const curr = x.find((g) => g.group === a.name);
            if (curr.name === "Revenues from main crop" && curr?.actual_value) {
              return curr.actual_value;
            }
            return a.value;
          },
        },
        barWidth: 50,
        stack: "t",
        type: "bar",
        data: x.map((v) => v.value),
      };
    })
    .value();
  series = sortBy(series, "name");
  let option = {
    ...Color,
    legend: {
      data: sortBy(legends),
      icon: "circle",
      top: "0px",
      left: "center",
      align: "auto",
      orient: "horizontal",
      textStyle: {
        fontFamily: "Gotham A,Gotham B",
        fontWeight: "bold",
        fontSize: 12,
      },
    },
    grid: {
      top: "50px",
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
        return `${f.name}<br/>${f.seriesName}:<b>${f.value}</b>`;
      },
      backgroundColor: "#ffffff",
      ...TextStyle,
    },
    toolbox: { show: false },
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
        axisLine: { show: false },
      },
    ],
    xAxis: {
      data: xAxis,
      type: "category",
      axisLine: {
        lineStyle: {
          color: "#ddd",
        },
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
