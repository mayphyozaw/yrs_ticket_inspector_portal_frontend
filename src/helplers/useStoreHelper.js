import { useRouteStore } from "@/stores/routeStore";

const stores = {
  routeStore: useRouteStore(),

};

const usestoreHelper = (storeNmae) => {
  return stores[storeNmae];
};

export { usestoreHelper };
