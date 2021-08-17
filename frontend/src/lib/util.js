import { trim } from "lodash";

const currencyFormatter = require("currency-formatter");

export const formatNumber = (x) => {
  return currencyFormatter.format(x, {
    decimal: ".",
    thousand: ",",
    precision: 0,
    format: "%v",
  });
};

export const parentDeep = (id, data) => {
  let parent = data.find((x) => x.id === id);
  if (parent.parent_id !== null) {
    return parentDeep(parent.parent_id, data);
  }
  return parent;
};

export const titleCase = (str, delimiter = " ") => {
  str = str.toLowerCase().split(delimiter);
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
};

export const roundNumber = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const objectNames = {
  hh_income: "Actual household income",
  land_size: "Land Size",
  living_income: "Living income bechmark",
  living_income_gap: "Living income gap",
  net_income: "Net income focus crop",
  other_income: "Other income",
  price: "Price",
  prod_cost: "Production Cost/ha",
  total_prod_cost: "Total Production Cost",
  revenue: "Revenues from main crop",
  share_income: "Share of income coming from focus crop",
  yields: "Yield",
  status: "Current/Feasible",
  area: "Area (ha)",
  cop_pha: "CoP (USD/ha)",
  cop_pkg: "Cop (USD/kg)",
  cop_efficiency: "G",
  diversification: "Diversification",
  total_revenue: "Total Revenues",
  source: "Principal source",
};

export const isAuthCookie = () => {
  return document.cookie.split(';')
    .map(item => trim(item))
    .includes('_legacy_auth0.is.authenticated=true')
}
