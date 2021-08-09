import { Store } from "pullstate";

const defaultState = {
  page: "introduction",
  user: null,
  countries: [],
  companies: [],
  crops: [],
  data: [],
  selectedCountry: null,
};

export const UIStore = new Store(defaultState);
