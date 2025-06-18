import { useTicketInspectionStore } from "@/stores/ticketInspectionStore";
const stores = {
  ticketInspectionStore: useTicketInspectionStore(),

};

const usestoreHelper = (storeNmae) => {
  return stores[storeNmae];
};

export { usestoreHelper };
