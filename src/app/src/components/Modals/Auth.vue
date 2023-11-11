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
        <q-btn dense flat icon="close" v-close-popup color="accent" />
      </q-bar>

      <q-card-section>
        <div class="row justify-center">
          <div class="col-md-4 col-sm-10">
            <q-tabs v-model="tab">
              <q-tab name="login" :label="$t('label.login')" />
              <q-tab name="register" :label="$t('label.createAccount')" />
            </q-tabs>

            <q-tab-panels v-model="tab" animated swipeable class="q-pt-sm">
              <q-tab-panel name="login">
                <q-form @submit="onLogin" class="q-gutter-xs min-300">
                  <q-input
                    v-model="email"
                    type="email"
                    class="full-width"
                    filled
                    :label="$t('label.email')"
                    lazy-rules
                    :disable="loading"
                    :rules="[
                      (val) =>
                        validateEmail(val) || $t('text.error.invalidEmail'),
                    ]"
                  />
                  <q-input
                    v-model="password"
                    type="password"
                    class="full-width"
                    filled
                    :label="$t('label.password')"
                    lazy-rules
                    :disable="loading"
                    :rules="[
                      (val) =>
                        (val && val.length > 5) ||
                        $t('text.error.shortPassword'),
                    ]"
                  />
                  <div class="justify-center row q-ml-none">
                    <q-btn
                      :loading="loading"
                      :label="$t('label.login')"
                      type="submit"
                      color="primary"
                    />
                  </div>
                </q-form>
              </q-tab-panel>
              <q-tab-panel name="register">
                <q-form @submit="onRegsiter" class="q-gutter-xs min-300">
                  <q-input
                    v-model="name"
                    type="text"
                    class="full-width"
                    filled
                    :label="$t('label.name')"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || $t('text.error.emptyName'),
                    ]"
                  />

                  <q-input
                    v-model="email"
                    type="email"
                    class="full-width"
                    filled
                    :label="$t('label.email')"
                    lazy-rules
                    :rules="[
                      (val) =>
                        validateEmail(val) || $t('text.error.invalidEmail'),
                    ]"
                  />
                  <q-input
                    v-model="password"
                    type="password"
                    class="full-width"
                    filled
                    :label="$t('label.password')"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 5) ||
                        $t('text.error.shortPassword'),
                    ]"
                  />
                  <div class="justify-center row q-ml-none">
                    <q-btn
                      :loading="loading"
                      :label="$t('label.register')"
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
        this.password,
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
