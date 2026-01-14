<template>
  <a-config-provider :locale="zhCN">
    <component :is="layoutComponent">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </component>
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

// 导入布局组件
const DefaultLayout = defineAsyncComponent(() => import('@/layouts/DefaultLayout.vue'));
const MainLayout = defineAsyncComponent(() => import('@/layouts/MainLayout.vue'));

const route = useRoute();

// 布局类型定义
type LayoutType = 'default' | 'main';

// 根据路由 meta 获取布局类型
const layoutType = computed<LayoutType>(() => {
  return (route.meta?.layout as LayoutType) || 'default';
});

// 根据布局类型返回对应的布局组件
const layoutComponent = computed(() => {
  switch (layoutType.value) {
    case 'main':
      return MainLayout;
    case 'default':
    default:
      return DefaultLayout;
  }
});
</script>

<style>
/* ========== 全局样式重置 ========== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

#app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ========== 路由过渡动画 ========== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ========== 滚动条样式 ========== */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 移动端滚动条 */
@media (max-width: 767px) {
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
}

/* ========== Ant Design 样式覆盖 ========== */
.ant-layout {
  background: #f5f7fa;
}

/* ========== 全局工具类 ========== */
.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
