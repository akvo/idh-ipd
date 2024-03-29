import {
  Easing,
  Color,
  TextStyle,
  backgroundColor,
  Icons,
} from "./chart-style.js";
import uniq from "lodash/uniq";
import sortBy from "lodash/sortBy";

const BarGroup = (data, extra, axis) => {
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
  let yAxis = uniq(data.map((x) => x.name));
  let legends = data.map((x) => x.group);
  let series = data.map((x) => {
    return {
      name: x.group,
      label: {
        show: true,
        position: "inside",
        textStyle: { ...TextStyle.textStyle, color: "#FFF" },
      },
      type: "bar",
      data: [x.value],
    };
  });
  let option = {
    legend: {
      data: sortBy(legends),
      icon: "circle",
      top: "0px",
      left: "center",
      align: "auto",
      orient: "horizontal",
      textStyle: {
        fontFamily: "Gotham A,Gotham B",
        fontWeight: "normal",
        fontSize: 12,
      },
    },
    grid: {
      top: "50px",
      left: "320px",
      right: axis ? "25px" : "auto",
      bottom: axis ? "75px" : "25px",
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
      formatter: "{a}: {c}",
      backgroundColor: "#ffffff",
      ...TextStyle,
    },
    toolbox: {
      show: true,
      right: "30px",
      top: "20px",
      orient: "horizontal",
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
        data: yAxis,
        type: "category",
        nameLocation: "center",
        axisLine: {
          lineStyle: {
            color: "#ddd",
          },
        },
        axisLabel: {
          formatter: (v, i) => {
            return v.replaceAll(" ", "\n");
          },
          fontFamily: "Gotham A,Gotham B",
          fontSize: 12,
          color: "#222",
        },
        nameTextStyle: {
          overflow: "truncate",
          ellipsis: "...",
        },
      },
    ],
    xAxis: {
      nameLocation: "center",
      nameGap: axis ? 50 : 0,
      type: "value",
      axisLabel: {
        inside: false,
        backgroundColor: "#f2f2f2",
        padding: 5,
        fontFamily: "Gotham A,Gotham B",
        fontSize: 12,
      },
      axisLine: { show: false },
    },
    series: series,
    ...Color,
    ...backgroundColor,
    ...Easing,
    ...extra,
  };
  return option;
};

export default BarGroup;
