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
