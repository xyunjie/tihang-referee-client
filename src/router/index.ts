import { createRouter, createWebHistory } from "vue-router";

// 定义路由配置的类型
interface RouteMeta {
  title?: string;
  layout?: 'default' | 'main';
  requireAuth?: boolean;
}

// 扩展 vue-router 的 RouteMeta 类型
declare module 'vue-router' {
  interface RouteMeta extends RouteMeta {}
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import("@/views/home/index.vue"),
    meta: {
      title: '首页',
      layout: 'default',
    }
  },
  {
    path: '/training',
    name: 'Training',
    component: () => import("@/views/training/index.vue"),
    meta: {
      title: '训练模式',
      layout: 'default',
    }
  },
  {
    path: '/competition',
    name: 'Competition',
    component: () => import("@/views/competition/index.vue"),
    meta: {
      title: '比赛模式',
      layout: 'default',
    }
  },
  {
    path: '/timing',
    name: 'Timing',
    component: () => import("@/views/timing/index.vue"),
    meta: {
      title: '计时',
      layout: 'default',
    }
  },
  {
    path: '/referee',
    name: 'Referee',
    component: () => import("@/views/referee/index.vue"),
    meta: {
      title: '裁判系统（旧版）',
      layout: 'default',
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import("@/views/settings/index.vue"),
    meta: {
      title: '系统设置',
      layout: 'main',
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import("@/views/about/index.vue"),
    meta: {
      title: '关于',
      layout: 'main',
    }
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
