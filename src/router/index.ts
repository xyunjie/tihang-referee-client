import { createRouter, createWebHistory } from "vue-router";

// 定义路由配置
const routes = [
    {
        path: '/',
        redirect: '/login',  // 默认跳转至登录页
    },
    {
        path: '/login',
        name: 'Login',  // 默认跳转至登录页
        component: () => import("@/views/login.vue"),
    },
    {
        path: "/home",
        name: "Home",
        component: () => import("@/views/home/index.vue"), // 异步加载
    },
    {
        path: "/about",
        name: "About",
        component: () => import("@/views/about/index.vue"),
    },
];

// 创建路由实例
const router = createRouter({
    history: createWebHistory(), // 使用 HTML5 History 模式
    routes,
});

export default router;
