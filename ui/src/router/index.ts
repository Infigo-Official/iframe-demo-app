import {createWebHistory, createRouter} from "vue-router";
import {RouteRecordRaw} from "vue-router";
import SessionService from "@/services/cache/session-state";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/product",
        alias: "/product",
        name: "product",
        component: () => import("../pages/product.vue"),
    },
    {
        path: "/shopping-list",
        alias: "/shopping-list",
        name: "Shopping List",
        component: () => import("../pages/basket.vue"),
    },
    {
        path: "/setup",
        alias: "/setup",
        name: "setup",
        component: () => import("../pages/setup.vue"),
    },
    {
        path: "/order/:id",
        name: "order-detail",
        component: () => import("../pages/order-confirmation.vue"),
    },
    {
        path: "/edit/:id",
        name: "edit-job",
        component: () => import("../pages/edit-job.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
