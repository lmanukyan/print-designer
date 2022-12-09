<template>
  <q-dialog
    v-model="dialog"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-white text-black text-white">
      <q-bar class="bg-primary text-white">
        <q-space />
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>

      <q-card-section>
        <div class="row justify-center">
          <div class="col-md-4 col-sm-10">
            <q-tabs v-model="tab">
              <q-tab name="login" label="Войти" />
              <q-tab name="register" label="Создать аккаунт" />
            </q-tabs>

            <q-tab-panels v-model="tab" animated swipeable>
              <q-tab-panel name="login">
                <q-form @submit="onLogin" class="q-gutter-md min-300">
                  <q-input
                    v-model="email"
                    type="email"
                    class="full-width"
                    filled
                    label="Email"
                    lazy-rules
                    :disable="loading"
                    :rules="[(val) => validateEmail(val) || 'Неверный e-mail․']"
                  />
                  <q-input
                    v-model="password"
                    type="password"
                    class="full-width"
                    filled
                    label="Пароль"
                    lazy-rules
                    :disable="loading"
                    :rules="[
                      (val) =>
                        (val && val.length > 5) ||
                        'Пароль должен содержать не менее 8 символов․',
                    ]"
                  />
                  <div class="q-ml-none">
                    <q-btn
                      :loading="loading"
                      label="Войти"
                      type="submit"
                      color="primary"
                    />
                  </div>
                </q-form>
              </q-tab-panel>
              <q-tab-panel name="register">
                <q-form @submit="onRegsiter" class="q-gutter-md min-300">
                  <q-input
                    v-model="name"
                    type="text"
                    class="full-width"
                    filled
                    label="Ваше имя"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Имя не может быть пустым.',
                    ]"
                  />

                  <q-input
                    v-model="email"
                    type="email"
                    class="full-width"
                    filled
                    label="Email"
                    lazy-rules
                    :rules="[(val) => validateEmail(val) || 'Неверный e-mail․']"
                  />
                  <q-input
                    v-model="password"
                    type="password"
                    class="full-width"
                    filled
                    label="Пароль"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 5) ||
                        'Пароль должен содержать не менее 8 символов․',
                    ]"
                  />
                  <div class="q-ml-none">
                    <q-btn
                      :loading="loading"
                      label="Войти"
                      type="submit"
                      color="primary"
                    />
                  </div>
                </q-form>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";

import UserService from "@/services/user";

export default {
  name: "AuthModal",

  data: () => ({
    tab: "login",

    loading: false,
    name: "",
    email: "",
    password: "",
  }),

  computed: {
    ...mapState("product", ["models"]),
    ...mapState("app", ["authModalOpened"]),
    dialog: {
      get() {
        return this.authModalOpened;
      },
      set(value) {
        this.setAuthModalOpened(value);
      },
    },
  },

  methods: {
    ...mapMutations("app", ["setUser", "setAuthModalOpened"]),

    validateEmail(email) {
      return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email);
    },

    async onLogin() {
      this.loading = true;
      let user = await UserService.login(this.email, this.password);
      if (user) {
        this.setUser(user);
        this.setAuthModalOpened(false);
      }
      this.loading = false;
    },

    async onRegsiter() {
      this.loading = true;
      let user = await UserService.register(
        this.name,
        this.email,
        this.password
      );
      if (user) {
        this.setUser(user);
        this.setAuthModalOpened(false);
      }
      this.loading = false;
    },
  },
};
</script>
