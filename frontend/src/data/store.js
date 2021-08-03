import { Store } from "pullstate";

const defaultState = {
  user: null,
};

export const UIStore = new Store(defaultState);
