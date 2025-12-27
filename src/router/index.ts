import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import Contact from "../pages/ContactPage.vue";
import AboutPage from "../pages/AboutPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/SV/", name: "home", component: HomePage },
    { path: "/SV/home", redirect: "/" },
    {
      path: "/SV/about",
      name: "about",
      component: AboutPage,
    },
    { path: "/SV/contact", name: "contact", component: Contact },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  linkActiveClass: "is-active",
  linkExactActiveClass: "is-exact-active",
});

export default router;
