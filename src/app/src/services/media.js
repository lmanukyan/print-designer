import axios from "@/services/axios";
import { Notify } from "quasar";
import { t } from "../locales";

const MediaService = {
  async upload(data) {
    try {
      let result = await axios.post("media", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return result.data.doc;
    } catch (e) {
      Notify.create({ type: "error", message: t("text.error.cantUploadFile") });
      return false;
    }
  },

  async uploadBlob(blob) {
    try {
      let data = new FormData();
      data.append("file", blob, "capture.png");

      let result = await axios.post("media", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return result.data.doc;
    } catch (e) {
      Notify.create({ type: "error", message: t("text.error.cantUploadFile") });
      return false;
    }
  },
};

export default MediaService;
