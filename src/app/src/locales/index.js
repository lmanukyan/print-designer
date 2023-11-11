import { createI18n } from "vue-i18n";

import en from "./translations/en";
import ru from "./translations/ru";

export const locales = {
  en,
  ru,
};

const getLanguage = () => {
  const lang = localStorage.getItem("app_lang");
  if (locales[lang]) {
    return lang;
  }
  return "en";
};

export const syncLanguage = (lang) => {
  localStorage.setItem("app_lang", lang);
};

export const i18n = createI18n({
  locale: getLanguage(),
  messages: locales,
});

export const { t } = i18n.global;
