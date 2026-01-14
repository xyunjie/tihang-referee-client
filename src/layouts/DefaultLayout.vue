<template>
  <a-layout class="default-layout">
    <a-layout-content class="layout-content">
      <slot></slot>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
/**
 * DefaultLayout - 默认布局（无侧边栏）
 *
 * 适用场景：
 * - 登录页面
 * - 裁判系统主屏幕（需要最大化显示区域）
 * - 任何需要全屏展示的页面
 *
 * 特点：
 * - 最小化布局元素，最大化内容区域
 * - 无侧边栏，无顶部导航
 * - 支持响应式设计
 * - 内容区域可滚动
 */
</script>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-content {
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

/* 平板设备 */
@media (max-width: 1024px) {
  .default-layout {
    min-height: 100vh;
  }

  .layout-content {
    overflow-x: hidden;
  }
}

/* 移动设备 */
@media (max-width: 768px) {
  .default-layout {
    min-height: 100vh;
  }

  .layout-content {
    overflow-y: auto;
    overflow-x: hidden;
  }
}

/* 小屏手机 */
@media (max-width: 480px) {
  .layout-content {
    overflow-x: hidden;
  }
}

/* 横屏模式优化 */
@media (max-height: 600px) and (orientation: landscape) {
  .default-layout {
    min-height: 100vh;
  }

  .layout-content {
    overflow: auto;
  }
}
</style>
