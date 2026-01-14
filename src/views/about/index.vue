<template>
  <div class="about-page">
    <a-result
      status="info"
      title="梯航智能车创新工作室裁判系统"
      sub-title="专业的智能车竞赛裁判管理解决方案"
    >
      <template #icon>
        <trophy-outlined style="font-size: 72px; color: #1890ff;" />
      </template>

      <template #extra>
        <a-descriptions title="系统信息" :column="2" bordered>
          <a-descriptions-item label="应用名称" :span="2">
            梯航智能车创新工作室裁判系统
          </a-descriptions-item>
          <a-descriptions-item label="版本号">
            v1.0.0
          </a-descriptions-item>
          <a-descriptions-item label="构建时间">
            2026-01-14
          </a-descriptions-item>
          <a-descriptions-item label="技术栈" :span="2">
            Tauri 2.x + Vue 3 + TypeScript + Ant Design Vue
          </a-descriptions-item>
          <a-descriptions-item label="硬件平台" :span="2">
            STM32G431 + RT-Thread
          </a-descriptions-item>
        </a-descriptions>

        <a-divider />

        <a-space :size="16">
          <a-button type="primary" href="https://github.com" target="_blank">
            <template #icon><github-outlined /></template>
            GitHub 仓库
          </a-button>
          <a-button @click="checkUpdate">
            <template #icon><sync-outlined /></template>
            检查更新
          </a-button>
        </a-space>

        <a-divider />

        <a-typography-paragraph>
          <a-typography-title :level="5">功能特性</a-typography-title>
          <ul>
            <li>实时计时与成绩记录</li>
            <li>多车道并发管理</li>
            <li>串口通信与硬件集成</li>
            <li>数据导出与分析</li>
            <li>响应式界面设计</li>
          </ul>
        </a-typography-paragraph>

        <a-alert
          message="版权声明"
          description="© 2026 梯航智能车创新工作室. 保留所有权利。"
          type="info"
          show-icon
        />
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import {
  TrophyOutlined,
  GithubOutlined,
  SyncOutlined
} from '@ant-design/icons-vue';

const checkUpdate = () => {
  message.info('当前已是最新版本');
};
</script>

<style scoped>
.about-page {
  padding: 0;
}

.about-page :deep(.ant-result) {
  padding: 24px 0;
}

.about-page :deep(.ant-result-icon) {
  margin-bottom: 24px;
}

.about-page :deep(.ant-descriptions) {
  margin-bottom: 24px;
}

.about-page ul {
  padding-left: 20px;
}

.about-page li {
  margin-bottom: 8px;
}
</style>
