import { sortBy, trim } from "lodash";

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
  other_income: "Non-focus crop income",
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

export const rverifyOptions = {
  mask: 0.5,
  title: 'Human Verification',
  text: '',
  extra: 'Drag to make angle positive',
  extraLink: '#',
  album: [
    '/introduction/house.png',
  ]
}

export const filterCountry = (access, countries) => {
  const allows = access.map(item => item?.company)
  return countries
    .filter(country => {
      return country.company.filter(item => allows.includes(item.id)).length > 0
    })
    .map(country => ({
      ...country,
      company: country.company.filter(item => allows.includes(item.id))
    }))
}

export const filterCountryOptions = (countries, country = {}, type = "country") => {
  let options = countries;
  if (type === "company") {
    const companies = countries
      .filter((x) => x.id === country?.id)
      .map((x) => x.company)
      .flat();
    options = sortBy(companies, (x) => x.name);
  }
  return options;
};
