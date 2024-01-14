import Vue from "vue";
import VueRouter from "vue-router";
import IndexView from "../views/IndexView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: IndexView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/app-like/:sub",
    name: "app-like",
    component: () => import(/* webpackChunkName: "app-like" */ "../views/ApplikeView.vue"),
    // children: [
    //   { path: "red", name: "red", component: () => import("../views/RedScreen.vue") },
    //   { path: "blue", name: "blue", component: () => import("../views/BlueScreen.vue") },
    // ],
  },
  {
    path: "/app-like-memo/:sub",
    name: "app-like-memo",
    component: () => import(/* webpackChunkName: "app-like" */ "../views/ApplikeMemoView.vue"),
    // children: [
    //   { path: "red", name: "red", component: () => import("../views/RedScreen.vue") },
    //   { path: "blue", name: "blue", component: () => import("../views/BlueScreen.vue") },
    // ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
