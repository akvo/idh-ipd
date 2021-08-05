import { Easing, Color, TextStyle, backgroundColor } from "./chart-style.js";
import uniq from "lodash/uniq";
import chain from "lodash/chain";
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
  let xAxis = uniq(data.map((x) => x.group));
  let legends = uniq(data.map((x) => x.name));
  let series = chain(data)
    .groupBy("name")
    .map((x, i) => {
      // if (i.toLowerCase() === "pending") {
      //   return {
      //     name: i,
      //     label: {
      //       formatter: function (params) {
      //         console.log(params);
      //         return "Label formatter";
      //       },
      //       show: true,
      //       position: "top",
      //       color: "#a43332",
      //     },
      //     stack: "t",
      //     type: "bar",
      //     barWidth: 50,
      //     data: x.map((v) => v.value),
      //     itemStyle: {
      //       color: "transparent",
      //       borderType: "dashed",
      //       borderColor: "#000",
      //     },
      //   };
      // }
      return {
        name: i,
        label: {
          show: true,
          position: "inside",
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
      data: sortBy(legends).filter((l) => l.toLowerCase() !== "pending"),
      icon: "circle",
      top: "0px",
      left: "center",
      align: "auto",
      orient: "horizontal",
      textStyle: {
        fontFamily: "Roboto",
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
        fontFamily: "Roboto",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}",
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
          fontFamily: "Roboto",
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
        fontFamily: "Roboto",
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
