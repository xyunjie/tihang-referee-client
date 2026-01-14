<template>
  <div class="settings-page">
    <a-page-header
      title="系统设置"
      sub-title="配置应用程序参数"
    />

    <a-divider />

    <!-- 使用 flex 布局的卡片容器 -->
    <div class="settings-grid">
      <!-- 通用设置 -->
      <a-card title="通用设置" :bordered="false" class="settings-card">
        <template #extra><setting-outlined /></template>

        <a-form layout="vertical">
          <a-form-item label="主题">
            <a-select v-model:value="settings.theme" style="width: 100%">
              <a-select-option value="light">浅色</a-select-option>
              <a-select-option value="dark">深色</a-select-option>
              <a-select-option value="auto">跟随系统</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="语言">
            <a-select v-model:value="settings.language" style="width: 100%">
              <a-select-option value="zh-CN">简体中文</a-select-option>
              <a-select-option value="en-US">English</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-card>

      <!-- 赛事设置 -->
      <a-card title="赛事设置" :bordered="false" class="settings-card">
        <template #extra><trophy-outlined /></template>

        <a-form layout="vertical">
          <a-form-item label="默认比赛时长（秒）">
            <a-input-number
              v-model:value="settings.raceDuration"
              :min="10"
              :max="3600"
              style="width: 100%"
            />
          </a-form-item>

          <a-form-item label="车道数量">
            <a-input-number
              v-model:value="settings.laneCount"
              :min="1"
              :max="10"
              style="width: 100%"
            />
          </a-form-item>

          <a-form-item label="自动保存记录">
            <a-switch v-model:checked="settings.autoSave" />
          </a-form-item>
        </a-form>
      </a-card>

      <!-- 硬件设置 -->
      <a-card title="硬件设置" :bordered="false" class="settings-card">
        <template #extra><api-outlined /></template>

        <a-form layout="vertical">
          <a-form-item label="串口端口">
            <a-select v-model:value="settings.serialPort" style="width: 100%">
              <a-select-option value="COM1">COM1</a-select-option>
              <a-select-option value="COM3">COM3</a-select-option>
              <a-select-option value="COM4">COM4</a-select-option>
              <a-select-option value="auto">自动检测</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="波特率">
            <a-select v-model:value="settings.baudRate" style="width: 100%">
              <a-select-option value="9600">9600</a-select-option>
              <a-select-option value="19200">19200</a-select-option>
              <a-select-option value="38400">38400</a-select-option>
              <a-select-option value="57600">57600</a-select-option>
              <a-select-option value="115200">115200</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-card>

      <!-- 显示设置 -->
      <a-card title="显示设置" :bordered="false" class="settings-card">
        <template #extra><desktop-outlined /></template>

        <a-form layout="vertical">
          <a-form-item label="字体大小">
            <a-radio-group v-model:value="settings.fontSize">
              <a-radio-button value="small">小</a-radio-button>
              <a-radio-button value="medium">中</a-radio-button>
              <a-radio-button value="large">大</a-radio-button>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="显示车道号码">
            <a-switch v-model:checked="settings.showLaneNumber" />
          </a-form-item>

          <a-form-item label="显示实时日志">
            <a-switch v-model:checked="settings.showLogs" />
          </a-form-item>
        </a-form>
      </a-card>

      <!-- 数据管理 -->
      <a-card title="数据管理" :bordered="false" class="settings-card">
        <template #extra><database-outlined /></template>

        <a-space direction="vertical" style="width: 100%">
          <a-button type="primary" block @click="exportData">
            <template #icon><download-outlined /></template>
            导出数据
          </a-button>
          <a-button block @click="importData">
            <template #icon><upload-outlined /></template>
            导入数据
          </a-button>
          <a-button danger block @click="clearData">
            <template #icon><delete-outlined /></template>
            清空数据
          </a-button>
        </a-space>
      </a-card>

      <!-- 关于信息 -->
      <a-card title="关于" :bordered="false" class="settings-card">
        <template #extra><info-circle-outlined /></template>

        <a-descriptions :column="1" size="small">
          <a-descriptions-item label="应用名称">
            梯航智能车创新工作室裁判系统
          </a-descriptions-item>
          <a-descriptions-item label="版本号">
            v1.0.0
          </a-descriptions-item>
          <a-descriptions-item label="构建时间">
            2026-01-14
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
    </div>

    <!-- 保存按钮 -->
    <a-divider />
    <a-space class="action-buttons">
      <a-button type="primary" size="large" @click="saveSettings">
        <template #icon><save-outlined /></template>
        保存设置
      </a-button>
      <a-button size="large" @click="resetSettings">
        <template #icon><reload-outlined /></template>
        重置默认
      </a-button>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import {
  SettingOutlined,
  TrophyOutlined,
  ApiOutlined,
  DesktopOutlined,
  DatabaseOutlined,
  InfoCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
  DeleteOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue';

// 设置数据结构
interface Settings {
  theme: string;
  language: string;
  raceDuration: number;
  laneCount: number;
  autoSave: boolean;
  serialPort: string;
  baudRate: number;
  fontSize: string;
  showLaneNumber: boolean;
  showLogs: boolean;
}

// 设置状态
const settings = reactive<Settings>({
  theme: 'light',
  language: 'zh-CN',
  raceDuration: 120,
  laneCount: 4,
  autoSave: true,
  serialPort: 'auto',
  baudRate: 115200,
  fontSize: 'medium',
  showLaneNumber: true,
  showLogs: true,
});

// 保存设置
const saveSettings = () => {
  localStorage.setItem('settings', JSON.stringify(settings));
  message.success('设置已保存');
};

// 重置设置
const resetSettings = () => {
  Object.assign(settings, {
    theme: 'light',
    language: 'zh-CN',
    raceDuration: 120,
    laneCount: 4,
    autoSave: true,
    serialPort: 'auto',
    baudRate: 115200,
    fontSize: 'medium',
    showLaneNumber: true,
    showLogs: true,
  });
  message.info('设置已重置');
};

// 导出数据
const exportData = () => {
  message.info('导出功能开发中...');
};

// 导入数据
const importData = () => {
  message.info('导入功能开发中...');
};

// 清空数据
const clearData = () => {
  message.warning('清空功能开发中...');
};
</script>

<style scoped>
.settings-page {
  padding: 0;
}

.settings-page :deep(.ant-page-header) {
  padding-left: 0;
  padding-right: 0;
}

/* Flex 响应式网格布局 */
.settings-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0 -8px;
}

.settings-card {
  flex: 1 1 calc(50% - 32px);
  min-width: 300px;
  max-width: calc(50% - 32px);
  margin: 8px;
}

.settings-card :deep(.ant-card-head-title) {
  font-weight: 600;
}

.settings-card :deep(.ant-form-item) {
  margin-bottom: 16px;
}

.settings-card :deep(.ant-divider) {
  margin: 16px 0;
}

.action-buttons {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* 平板设备 */
@media (max-width: 1024px) {
  .settings-card {
    flex: 1 1 calc(50% - 32px);
    max-width: calc(50% - 32px);
  }
}

/* 移动设备 - 单列布局 */
@media (max-width: 768px) {
  .settings-grid {
    margin: 0;
  }

  .settings-card {
    flex: 1 1 100%;
    max-width: 100%;
    margin: 0 0 16px 0;
  }

  .settings-card:last-child {
    margin-bottom: 0;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .action-buttons .ant-btn {
    width: 100%;
  }
}

/* 小屏手机 */
@media (max-width: 480px) {
  .settings-card {
    min-width: 100%;
  }
}

/* 大屏优化 */
@media (min-width: 1400px) {
  .settings-card {
    flex: 1 1 calc(33.333% - 32px);
    max-width: calc(33.333% - 32px);
  }
}

/* 超大屏优化 */
@media (min-width: 1920px) {
  .settings-card {
    flex: 1 1 calc(25% - 32px);
    max-width: calc(25% - 32px);
  }
}
</style>
