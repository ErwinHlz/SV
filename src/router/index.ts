import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import Contact from "../pages/ContactPage.vue";
import AboutPage from "../pages/AboutPage.vue";
import NewsPage from "../pages/NewsPage.vue";
import DatenschutzPage from "../pages/DatenschutzPage.vue";
import ImpressumPage from "../pages/ImpressumPage.vue";
import TerminPage from "../pages/TerminPage.vue";
import TeamOneKader from "@/pages/TeamOneKader.vue";
import TeamOneSpielplan from "@/pages/TeamOneSpielplan.vue";
import TeamOneTabelle from "@/pages/TeamOneTabelle.vue";
import TeamTwoKader from "@/pages/TeamTwoKader.vue";
import TeamTwoSpielplan from "@/pages/TeamTwoSpielplan.vue";
import TeamTwoTabelle from "@/pages/TeamTwoTabelle.vue";
import JugendTeamsPage from "@/pages/JugendTeamsPage.vue";
import SponsorPage from "@/pages/SponsorPage.vue";
import SponsorBecomePage from "@/pages/SponsorBecomePage.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "home", component: HomePage },
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
    {
      path: "/teams/one/kader",
      name: "team-one-kader",
      component: TeamOneKader,
    },
    {
      path: "/teams/one/tabelle",
      name: "team-one-tabelle",
      component: TeamOneTabelle,
    },
    {
      path: "/teams/one/spielplan",
      name: "team-one-spielplan",
      component: TeamOneSpielplan,
    },
    { path: "/teams/two", redirect: "/teams/two/kader" },
    {
      path: "/teams/two/kader",
      name: "team-two-kader",
      component: TeamTwoKader,
    },
    {
      path: "/teams/two/spielplan",
      name: "team-two-spielplan",
      component: TeamTwoSpielplan,
    },
    {
      path: "/teams/two/tabelle",
      name: "team-two-tabelle",
      component: TeamTwoTabelle,
    },
    {
      path: "/teams/jugend",
      name: "team-jugend",
      component: JugendTeamsPage,
    },
    { path: "/sponsor", name: "sponsoren", component: SponsorPage },
    {
      path: "/sponsor/werden",
      name: "sponsor-werden",
      component: SponsorBecomePage,
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  linkActiveClass: "is-active",
  linkExactActiveClass: "is-exact-active",
});

export default router;
