<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-40px-20px relative bg-gradient">
    <div class="text-center text-white mb-60px">
      <trophy-outlined class="text-64px mb-20px animate-float" />
      <h1 class="text-36px font-700 m-0-0-8px-0 text-white">梯航智能车裁判系统</h1>
      <p class="text-16px opacity-90 m-0">Tihang Smart Car Referee System</p>
    </div>

    <div class="flex gap-40px flex-wrap justify-center max-w-900px">
      <a-card
        class="w-320px rounded-16px overflow-hidden transition-all duration-300 cursor-pointer border-3 border-transparent hover-card training-card"
        hoverable
        @click="selectMode('training')"
      >
        <div class="text-center p-20px">
          <experiment-outlined class="text-64px mb-20px text-success" />
          <h2 class="text-24px font-600 m-0-0-12px-0 text-#262626">训练模式</h2>
          <p class="text-14px text-#8c8c8c m-0-0-20px-0">扫码或NFC识别身份，单次计时训练</p>
          <ul class="list-none p-0 m-0 text-left">
            <li class="py-8px text-#595959 text-14px relative pl-20px feature-item">快速身份识别</li>
            <li class="py-8px text-#595959 text-14px relative pl-20px feature-item">实时计时记录</li>
            <li class="py-8px text-#595959 text-14px relative pl-20px feature-item">自动上传成绩</li>
          </ul>
        </div>
      </a-card>

      <a-card
        class="w-320px rounded-16px overflow-hidden transition-all duration-300 cursor-pointer border-3 border-transparent hover-card competition-card"
        hoverable
        @click="selectMode('competition')"
      >
        <div class="text-center p-20px">
          <trophy-outlined class="text-64px mb-20px text-info" />
          <h2 class="text-24px font-600 m-0-0-12px-0 text-#262626">比赛模式</h2>
          <p class="text-14px text-#8c8c8c m-0-0-20px-0">导入队伍信息，多车道同时比赛</p>
          <ul class="list-none p-0 m-0 text-left">
            <li class="py-8px text-#595959 text-14px relative pl-20px feature-item">批量导入队伍</li>
            <li class="py-8px text-#595959 text-14px relative pl-20px feature-item">多车道管理</li>
            <li class="py-8px text-#595959 text-14px relative pl-20px feature-item">成绩排名统计</li>
          </ul>
        </div>
      </a-card>
    </div>

    <div class="absolute bottom-30px right-30px bg-white/95 p-12px-20px rounded-8px shadow-sm status-bar-responsive">
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
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.hover-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.training-card:hover {
  border-color: #52c41a;
}

.competition-card:hover {
  border-color: #1890ff;
}

.feature-item::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #52c41a;
  font-weight: bold;
}

@media (max-width: 768px) {
  .status-bar-responsive {
    position: static;
    margin-top: 40px;
  }
}
</style>
