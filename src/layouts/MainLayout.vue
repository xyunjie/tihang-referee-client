<template>
  <a-layout class="main-layout">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="layout-sider"
      :width="200"
      :collapsed-width="isMobile ? 0 : 64"
      :class="{ 'sider-collapsed': collapsed }"
    >
      <!-- Logo 区域 -->
      <div class="logo-section">
        <trophy-outlined class="logo-icon" />
        <transition name="fade">
          <span v-show="!collapsed" class="logo-text">裁判系统</span>
        </transition>
      </div>

      <!-- 导航菜单 -->
      <a-menu
        v-model:selected-keys="selectedKeys"
        v-model:open-keys="openKeys"
        mode="inline"
        theme="dark"
        :inline-collapsed="collapsed"
        class="layout-menu"
      >
        <a-menu-item key="referee" @click="navigateTo('/referee')">
          <template #icon><clock-circle-outlined /></template>
          <span>裁判系统</span>
        </a-menu-item>

        <a-menu-item key="settings" @click="navigateTo('/settings')">
          <template #icon><setting-outlined /></template>
          <span>系统设置</span>
        </a-menu-item>

        <a-menu-item key="about" @click="navigateTo('/about')">
          <template #icon><info-circle-outlined /></template>
          <span>关于</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- 移动端抽屉遮罩 -->
    <div
      v-if="isMobile && !collapsed"
      class="sider-overlay"
      @click="collapsed = true"
    ></div>

    <!-- 主内容区域 -->
    <a-layout class="main-layout-content" :class="{ 'content-collapsed': collapsed }">
      <!-- 顶部栏 -->
      <a-layout-header class="layout-header">
        <div class="header-left">
          <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="collapsed = !collapsed"
          />
          <menu-fold-outlined
            v-else
            class="trigger"
            @click="collapsed = !collapsed"
          />
        </div>
        <div class="header-right">
          <span class="header-title">{{ pageTitle }}</span>
        </div>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content class="layout-content">
        <div class="content-wrapper">
          <slot></slot>
        </div>
      </a-layout-content>

      <!-- 页脚 -->
      <a-layout-footer class="layout-footer">
        <span>© 2026 梯航智能车创新工作室裁判系统</span>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  TrophyOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();

// 状态
const collapsed = ref(false);
const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);
const isMobile = ref(false);

// 检测屏幕尺寸
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
  // 移动端默认折叠侧边栏
  if (isMobile.value && !collapsed.value) {
    collapsed.value = true;
  }
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});

// 根据路由设置选中的菜单
watch(
  () => route.path,
  (path) => {
    if (path.startsWith('/referee')) {
      selectedKeys.value = ['referee'];
    } else if (path.startsWith('/settings')) {
      selectedKeys.value = ['settings'];
    } else if (path.startsWith('/about')) {
      selectedKeys.value = ['about'];
    }
  },
  { immediate: true }
);

// 页面标题
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    referee: '裁判系统',
    settings: '系统设置',
    about: '关于系统'
  };
  return titles[selectedKeys.value[0]] || '裁判系统';
});

// 导航方法
const navigateTo = (path: string) => {
  router.push(path);
  // 移动端点击菜单后自动收起
  if (isMobile.value) {
    collapsed.value = true;
  }
};
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
}

/* ========== 侧边栏样式 ========== */
.layout-sider {
  background: #001529;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  transition: all 0.2s ease-in-out;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  height: 100vh;
  overflow-y: auto;
}

.layout-sider.sider-collapsed {
  width: 64px !important;
  min-width: 64px !important;
  max-width: 64px !important;
}

/* 移动端侧边栏特殊处理 */
@media (max-width: 767px) {
  .layout-sider {
    transform: translateX(-100%);
  }

  .layout-sider:not(.sider-collapsed) {
    transform: translateX(0);
    width: 200px !important;
    min-width: 200px !important;
    max-width: 200px !important;
  }
}

/* 遮罩层 */
.sider-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 999;
}

/* Logo 区域 */
.logo-section {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 8px;
  transition: padding 0.2s;
}

.layout-sider.sider-collapsed .logo-section {
  padding: 0;
  justify-content: center;
}

.logo-icon {
  font-size: 24px;
  color: #fff;
  min-width: 24px;
}

.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin-left: 12px;
  white-space: nowrap;
}

.layout-menu {
  border-right: none;
  height: calc(100% - 72px);
  overflow-y: auto;
}

/* ========== 主内容区域 ========== */
.main-layout-content {
  display: flex;
  flex-direction: column;
  margin-left: 200px;
  min-height: 100vh;
  transition: margin-left 0.2s ease-in-out;
}

.main-layout-content.content-collapsed {
  margin-left: 64px;
}

/* 移动端内容区域不偏移 */
@media (max-width: 767px) {
  .main-layout-content {
    margin-left: 0 !important;
  }
}

/* ========== 顶部栏 ========== */
.layout-header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  height: 64px;
  line-height: 64px;
  flex-shrink: 0;
}

.header-left .trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
  padding: 8px;
  border-radius: 4px;
}

.header-left .trigger:hover {
  color: #1890ff;
  background: #f0f2f5;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

/* ========== 内容区域（可滚动） ========== */
.layout-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.content-wrapper {
  min-height: 100%;
}

/* ========== 页脚 ========== */
.layout-footer {
  text-align: center;
  background: #f0f2f5;
  padding: 16px 24px;
  flex-shrink: 0;
}

/* ========== 动画 ========== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ========== 响应式设计 ========== */

/* 平板设备 */
@media (max-width: 1024px) {
  .layout-content {
    padding: 20px;
  }
}

/* 移动设备 */
@media (max-width: 767px) {
  .layout-header {
    padding: 0 16px;
  }

  .layout-content {
    padding: 16px;
  }

  .layout-footer {
    padding: 12px 16px;
  }
}

/* 小屏手机 */
@media (max-width: 480px) {
  .layout-header {
    padding: 0 12px;
  }

  .layout-content {
    padding: 12px;
  }

  .header-title {
    font-size: 14px;
  }
}
</style>
