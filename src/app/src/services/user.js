import axios from "@/services/axios";
import { Notify } from "quasar";
import { t } from "../locales";

const UserService = {
  async getProfile() {
    try {
      let result = await axios.get("users/me");
      return result.data.user;
    } catch (e) {
      localStorage.removeItem("accessToken");
      return false;
    }
  },

  async login(email, password) {
    try {
      let result = await axios.post("users/login", {
        email,
        password,
      });

      localStorage.setItem("accessToken", result.data.token);
      Notify.create({
        type: "success",
        message: t("text.successfullyloggedIn"),
      });

      return result.data.user;
    } catch (e) {
      Notify.create({
        type: "error",
        message: t("text.invalidEmailOrPassword"),
      });
      return false;
    }
  },

  async register(name, email, password) {
    try {
      await axios.post("users", {
        name,
        email,
        password,
      });
      return this.login(email, password);
    } catch (e) {
      Notify.create({
        type: "error",
        message: t("text.error.emailAlreadyUsed"),
      });
      return false;
    }
  },

  async logout() {
    try {
      await axios.post("users/logout");
    } catch (e) {
      //
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("appUser");
  },
};

export default UserService;
