import { Store } from "pullstate";

const countries = [
  {
    id: 1,
    name: "Ethiopia",
    companies: [
      {
        id: 1,
        name: "Company 1",
        sector: "Coffee",
      },
    ],
  },
  {
    id: 2,
    name: "Uganda",
    companies: [
      {
        id: 2,
        name: "Company 2",
        sector: "Coffee",
      },
      {
        id: 16,
        name: "Company 16",
        sector: "Coffee",
      },
    ],
  },
  {
    id: 3,
    name: "Kenya",
    companies: [
      {
        id: 3,
        name: "Company 3",
        sector: "Coffee",
      },
      {
        id: 8,
        name: "Company 8",
        sector: "Tea",
      },
      {
        id: 15,
        name: "Company 15",
        sector: "Coffee",
      },
    ],
  },
];

const defaultState = {
  page: "login",
  user: null,
  data: [],
  config: {},
  countries: countries,
  selectedCountry: null,
};

export const UIStore = new Store(defaultState);
