import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import Contact from "../pages/ContactPage.vue";
import AboutPage from "../pages/AboutPage.vue";
import NewsPage from "../pages/NewsPage.vue";
import DatenschutzPage from "../pages/DatenschutzPage.vue";
import ImpressumPage from "../pages/ImpressumPage.vue";
import TerminPage from "../pages/TerminPage.vue";
import TeamOne from "@/pages/TeamOne.vue";
import TeamTwo from "@/pages/TeamTwo.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "home", component: HomePage },
    { path: "/:pathMatch(.*)*", redirect: "/" },
    { path: "/home", redirect: "/" },
    {
      path: "/about",
      name: "about",
      component: AboutPage,
    },
    { path: "/contact", name: "contact", component: Contact },
    { path: "/news", name: "news", component: NewsPage },
    { path: "/termine", name: "termine", component: TerminPage },
    { path: "/datenschutz", name: "datenschutz", component: DatenschutzPage },
    { path: "/impressum", name: "impressum", component: ImpressumPage },
    { path: "/teams/one", name: "1. Mannschaft", component: TeamOne },
    { path: "/teams/two", name: "2. Mannschaft", component: TeamTwo },
  ],
  linkActiveClass: "is-active",
  linkExactActiveClass: "is-exact-active",
});

export default router;
