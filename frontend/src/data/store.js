import { Store } from "pullstate";

const defaultState = {
  page: "login",
  user: null,
  countries: [],
  companies: [],
  crops: [],
  data: [],
  selectedCountry: null,
};

export const UIStore = new Store(defaultState);
