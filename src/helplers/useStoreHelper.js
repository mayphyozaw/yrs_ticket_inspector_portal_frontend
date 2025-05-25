import { useStationStore } from "@/stores/stationStore";
import { useRouteStore } from "@/stores/routeStore";

const stores = {
  stationStore: useStationStore(),
  routeStore: useRouteStore(),

};

const usestoreHelper = (storeNmae) => {
  return stores[storeNmae];
};

export { usestoreHelper };
