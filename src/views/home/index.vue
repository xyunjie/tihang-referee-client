<template>
  <div class="home-page">
    <div class="header">
      <trophy-outlined class="logo" />
      <h1 class="title">梯航智能车裁判系统</h1>
      <p class="subtitle">Tihang Smart Car Referee System</p>
    </div>

    <div class="mode-selection">
      <a-card
        class="mode-card training-card"
        hoverable
        @click="selectMode('training')"
      >
        <div class="mode-content">
          <experiment-outlined class="mode-icon" />
          <h2 class="mode-title">训练模式</h2>
          <p class="mode-desc">扫码或NFC识别身份，单次计时训练</p>
          <ul class="mode-features">
            <li>快速身份识别</li>
            <li>实时计时记录</li>
            <li>自动上传成绩</li>
          </ul>
        </div>
      </a-card>

      <a-card
        class="mode-card competition-card"
        hoverable
        @click="selectMode('competition')"
      >
        <div class="mode-content">
          <trophy-outlined class="mode-icon" />
          <h2 class="mode-title">比赛模式</h2>
          <p class="mode-desc">导入队伍信息，多车道同时比赛</p>
          <ul class="mode-features">
            <li>批量导入队伍</li>
            <li>多车道管理</li>
            <li>成绩排名统计</li>
          </ul>
        </div>
      </a-card>
    </div>

    <div class="status-bar">
      <a-space>
        <a-tag :color="networkMode === 'online' ? 'green' : 'orange'">
          <wifi-outlined v-if="networkMode === 'online'" />
          <disconnect-outlined v-else />
          {{ networkMode === 'online' ? '在线模式' : '离线模式' }}
        </a-tag>
        <a-button type="link" size="small" @click="goToSettings">
          <setting-outlined /> 系统设置
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  TrophyOutlined,
  ExperimentOutlined,
  WifiOutlined,
  DisconnectOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue';
import { useAppStore } from '@/store/app';
import type { WorkMode } from '@/store/app';

const router = useRouter();
const appStore = useAppStore();

const networkMode = computed(() => appStore.networkMode);

const selectMode = (mode: WorkMode) => {
  appStore.setWorkMode(mode);
  if (mode === 'training') {
    router.push('/training');
  } else {
    router.push('/competition');
  }
};

const goToSettings = () => {
  router.push('/settings');
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 60px;
}

.logo {
  font-size: 64px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
}

.subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.mode-selection {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 900px;
}

.mode-card {
  width: 320px;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 3px solid transparent;
}

.mode-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.training-card:hover {
  border-color: #52c41a;
}

.competition-card:hover {
  border-color: #1890ff;
}

.mode-content {
  text-align: center;
  padding: 20px;
}

.mode-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.training-card .mode-icon {
  color: #52c41a;
}

.competition-card .mode-icon {
  color: #1890ff;
}

.mode-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #262626;
}

.mode-desc {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0 0 20px 0;
}

.mode-features {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.mode-features li {
  padding: 8px 0;
  color: #595959;
  font-size: 14px;
  position: relative;
  padding-left: 20px;
}

.mode-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #52c41a;
  font-weight: bold;
}

.status-bar {
  position: absolute;
  bottom: 30px;
  right: 30px;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .title {
    font-size: 28px;
  }

  .logo {
    font-size: 48px;
  }

  .mode-selection {
    gap: 20px;
  }

  .mode-card {
    width: 100%;
    max-width: 320px;
  }

  .status-bar {
    position: static;
    margin-top: 40px;
  }
}
</style>
