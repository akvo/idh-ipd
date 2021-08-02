import { Store } from "pullstate";

const defaultState = {
  user: false,
};

export const UIStore = new Store(defaultState);
