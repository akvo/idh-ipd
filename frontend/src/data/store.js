import { Store } from "pullstate";

const defaultState = {
  loading: true,
  page: "introduction",
  user: null,
  countries: [],
  companies: [],
  crops: [],
  data: [],
  selectedCountry: null,
};

export const UIStore = new Store(defaultState);
