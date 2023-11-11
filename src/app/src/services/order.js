import axios from "@/services/axios";
import { Notify } from "quasar";
import { t } from "../locales";

const OrderService = {
  async getPrices() {
    try {
      let result = await axios.get("globals/pricing");
      return result.data;
    } catch (e) {
      return false;
    }
  },

  async create(data) {
    try {
      let result = await axios.post("orders?depth=0", data);
      return result.data.doc;
    } catch (e) {
      Notify.create({ type: "error", message: t("text.error.errorOccurred") });
      return false;
    }
  },
};

export default OrderService;
