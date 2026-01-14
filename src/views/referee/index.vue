<template>
  <div class="referee-system">
    <!-- 顶部标题栏 -->
    <div class="header-bar">
      <div class="title">
        <trophy-outlined class="title-icon" />
        智能车竞赛裁判系统
      </div>
      <div class="header-info">
        <a-tag color="blue">第 {{ currentRound }} 轮</a-tag>
        <a-tag :color="statusColor">{{ statusText }}</a-tag>
        <a-button
          type="text"
          class="settings-btn"
          @click="goToSettings"
          title="系统设置"
        >
          <template #icon><setting-outlined /></template>
          <span class="settings-text">设置</span>
        </a-button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧：计时器和控制区 -->
      <div class="left-panel">
        <!-- 计时器卡片 -->
        <a-card class="timer-card" :bordered="false">
          <div class="timer-display">
            <div class="timer-label">比赛用时</div>
            <div class="timer-value">{{ formattedTime }}</div>
            <div class="timer-ms">.{{ formattedMs }}</div>
          </div>
        </a-card>

        <!-- 控制按钮组 -->
        <a-card class="control-card" :bordered="false">
          <a-space :size="16" class="control-buttons">
            <a-button
              type="primary"
              size="large"
              :disabled="isRunning"
              @click="startRace"
              :loading="loading"
            >
              <play-circle-outlined />
              开始比赛
            </a-button>
            <a-button
              size="large"
              :disabled="!isRunning"
              @click="pauseRace"
            >
              <pause-circle-outlined />
              暂停
            </a-button>
            <a-button
              danger
              size="large"
              @click="resetRace"
            >
              <redo-outlined />
              重置
            </a-button>
          </a-space>
        </a-card>

        <!-- 当前比赛信息 -->
        <a-card title="当前比赛" class="info-card" :bordered="false">
          <a-descriptions :column="1" size="small">
            <a-descriptions-item label="比赛组别">
              <a-select
                v-model:value="raceGroup"
                style="width: 120px"
                size="small"
              >
                <a-select-option value="camera">光电组</a-select-option>
                <a-select-option value="magnetic">电磁组</a-select-option>
                <a-select-option value="balance">平衡组</a-select-option>
              </a-select>
            </a-descriptions-item>
            <a-descriptions-item label="赛道类型">
              <span>{{ trackType }}</span>
              </a-descriptions-item>
            <a-descriptions-item label="目标圈数">
              <a-input-number
                v-model:value="targetLaps"
                :min="1"
                :max="10"
                size="small"
                style="width: 80px"
              />
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </div>

      <!-- 右侧：车道状态和成绩 -->
      <div class="right-panel">
        <!-- 车道状态 -->
        <a-card title="车道状态" class="lanes-card" :bordered="false">
          <div class="lanes-container">
            <div
              v-for="lane in lanes"
              :key="lane.id"
              class="lane-item"
              :class="{ 'lane-finished': lane.finished }"
            >
              <div class="lane-header">
                <span class="lane-name">{{ lane.name }}</span>
                <a-tag :color="lane.status === 'racing' ? 'green' : lane.status === 'finished' ? 'blue' : 'default'">
                  {{ statusMap[lane.status] }}
                </a-tag>
              </div>
              <div class="lane-team" v-if="lane.team">
                <team-outlined class="team-icon" />
                {{ lane.team }}
              </div>
              <div class="lane-stats">
                <div class="stat-item">
                  <span class="stat-label">圈数</span>
                  <span class="stat-value">{{ lane.laps }}/{{ targetLaps }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">最佳</span>
                  <span class="stat-value">{{ lane.bestLap || '--' }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">总用时</span>
                  <span class="stat-value">{{ lane.totalTime || '--' }}</span>
                </div>
              </div>
            </div>
          </div>
        </a-card>

        <!-- 成绩记录 -->
        <a-card title="成绩记录" class="records-card" :bordered="false">
          <a-table
            :columns="recordColumns"
            :data-source="records"
            :pagination="{ pageSize: 5 }"
            size="small"
            :scroll="{ y: 200 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'rank'">
                <a-tag :color="record.rank <= 3 ? 'gold' : 'default'">
                  {{ record.rank }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'status'">
                <a-tag :color="record.status === 'finished' ? 'success' : 'processing'">
                  {{ record.status === 'finished' ? '完成' : '进行中' }}
                </a-tag>
              </template>
            </template>
          </a-table>
        </a-card>
      </div>
    </div>

    <!-- 底部实时日志 -->
    <a-card title="实时日志" class="log-card" :bordered="false">
      <div class="log-container" ref="logContainer">
        <div
          v-for="(log, index) in logs"
          :key="index"
          class="log-item"
          :class="`log-${log.type}`"
        >
          <span class="log-time">[{{ log.time }}]</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, nextTick } from 'vue';
import {
  TrophyOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  RedoOutlined,
  TeamOutlined,
  SettingOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

// 状态定义
interface Lane {
  id: number;
  name: string;
  team: string;
  status: 'idle' | 'racing' | 'finished';
  laps: number;
  bestLap: string;
  totalTime: string;
  finished: boolean;
}

interface Record {
  key: number;
  rank: number;
  lane: string;
  team: string;
  laps: number;
  totalTime: string;
  status: string;
}

interface Log {
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

// 响应式数据
const router = useRouter();
const isRunning = ref(false);
const isPaused = ref(false);
const elapsedTime = ref(0); // 毫秒
const loading = ref(false);
const currentRound = ref(1);
const raceGroup = ref('camera');
const trackType = ref('标准赛道');
const targetLaps = ref(3);

const statusMap = {
  idle: '待命',
  racing: '比赛中',
  finished: '已完成'
};

// 车道数据
const lanes = ref<Lane[]>([
  { id: 1, name: '1号赛道', team: '清华车队', status: 'idle', laps: 0, bestLap: '--', totalTime: '--', finished: false },
  { id: 2, name: '2号赛道', team: '北大车队', status: 'idle', laps: 0, bestLap: '--', totalTime: '--', finished: false },
  { id: 3, name: '3号赛道', team: '待定', status: 'idle', laps: 0, bestLap: '--', totalTime: '--', finished: false },
  { id: 4, name: '4号赛道', team: '待定', status: 'idle', laps: 0, bestLap: '--', totalTime: '--', finished: false },
]);

// 成绩记录
const records = ref<Record[]>([]);

// 日志
const logs = ref<Log[]>([]);
const logContainer = ref<HTMLElement>();

// 计时器
let timer: number | null = null;

// 计算属性
const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60000);
  const seconds = Math.floor((elapsedTime.value % 60000) / 1000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

const formattedMs = computed(() => {
  return String(Math.floor((elapsedTime.value % 1000) / 10)).padStart(2, '0');
});

const statusText = computed(() => {
  if (isPaused.value) return '已暂停';
  if (isRunning.value) return '进行中';
  return '未开始';
});

const statusColor = computed(() => {
  if (isPaused.value) return 'orange';
  if (isRunning.value) return 'green';
  return 'default';
});

const recordColumns = [
  { title: '排名', key: 'rank', width: 80, align: 'center' },
  { title: '赛道', dataIndex: 'lane', key: 'lane', width: 100 },
  { title: '队伍', dataIndex: 'team', key: 'team' },
  { title: '圈数', dataIndex: 'laps', key: 'laps', width: 80 },
  { title: '总用时', dataIndex: 'totalTime', key: 'totalTime', width: 120 },
  { title: '状态', key: 'status', width: 100 },
];

// 方法
const addLog = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  logs.value.unshift({ time, type, message });
  if (logs.value.length > 50) logs.value.pop();

  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = 0;
    }
  });
};

const startRace = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    isRunning.value = true;
    isPaused.value = false;
    addLog('success', `第 ${currentRound.value} 轮比赛开始`);

    // 启动计时器
    timer = setInterval(() => {
      elapsedTime.value += 10;

      // 模拟圈数更新（实际应该由硬件触发）
      if (elapsedTime.value % 5000 < 10) {
        simulateLapUpdate();
      }
    }, 10);
  }, 500);
};

const pauseRace = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  isPaused.value = true;
  addLog('warning', '比赛已暂停');
};

const resetRace = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  isRunning.value = false;
  isPaused.value = false;
  elapsedTime.value = 0;

  // 重置车道状态
  lanes.value.forEach(lane => {
    lane.status = 'idle';
    lane.laps = 0;
    lane.bestLap = '--';
    lane.totalTime = '--';
    lane.finished = false;
  });

  addLog('info', '比赛已重置');
  message.success('比赛已重置');
};

const goToSettings = () => {
  router.push('/settings');
};

const simulateLapUpdate = () => {
  // 模拟圈数增加（实际应该由硬件触发）
  lanes.value.forEach(lane => {
    if (lane.team !== '待定' && lane.status === 'racing' && lane.laps < targetLaps.value) {
      lane.laps++;
      const lapTime = formattedTime.value;
      if (lane.bestLap === '--' || lapTime < lane.bestLap) {
        lane.bestLap = lapTime;
      }
      addLog('info', `${lane.name} ${lane.team} 完成第 ${lane.laps} 圈`);

      if (lane.laps >= targetLaps.value) {
        lane.status = 'finished';
        lane.finished = true;
        lane.totalTime = formattedTime.value + '.' + formattedMs.value;
        addLog('success', `${lane.name} ${lane.team} 完成比赛！用时：${lane.totalTime}`);

        // 添加到成绩记录
        const rank = records.value.filter(r => r.status === 'finished').length + 1;
        records.value.push({
          key: Date.now(),
          rank,
          lane: lane.name,
          team: lane.team,
          laps: lane.laps,
          totalTime: lane.totalTime,
          status: 'finished'
        });
      }
    }
  });

  // 开始比赛后，有队伍的车道设为比赛中
  if (elapsedTime.value <= 100) {
    lanes.value.forEach(lane => {
      if (lane.team !== '待定' && lane.status === 'idle') {
        lane.status = 'racing';
      }
    });
  }
};

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.referee-system {
  padding: 0;
  background: #f5f7fa;
  min-height: 100vh;
}

.header-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.title {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
  color: white;
}

.title-icon {
  font-size: 28px;
  margin-right: 12px;
}

.header-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.settings-btn {
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  transition: all 0.3s;
}

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  transform: scale(1.05);
}

.settings-text {
  margin-left: 4px;
}

.main-content {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.left-panel {
  flex: 0 0 380px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 340px;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

/* 计时器卡片 */
.timer-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  overflow: hidden;
}

.timer-card :deep(.ant-card-body) {
  padding: 30px;
}

.timer-display {
  text-align: center;
  color: white;
}

.timer-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.timer-value {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 700;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  line-height: 1;
  letter-spacing: 2px;
  word-break: break-all;
}

.timer-ms {
  font-size: clamp(16px, 2.5vw, 24px);
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  opacity: 0.8;
  margin-top: 4px;
}

/* 控制卡片 */
.control-card {
  border-radius: 12px;
  overflow: hidden;
}

.control-card :deep(.ant-card-body) {
  padding: 20px;
}

.control-buttons {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.control-buttons .ant-btn {
  flex: 1 1 auto;
  min-width: 90px;
  max-width: 120px;
}

/* 信息卡片 */
.info-card {
  border-radius: 12px;
}

.info-card :deep(.ant-card-body) {
  padding: 16px;
}

/* 车道卡片 */
.lanes-card {
  border-radius: 12px;
  flex: 1;
  overflow: hidden;
}

.lanes-card :deep(.ant-card-body) {
  padding: 16px;
}

.lanes-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-height: 280px;
  overflow-y: auto;
}

.lane-item {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s;
}

.lane-item:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.lane-finished {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-color: #4caf50;
}

.lane-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.lane-name {
  font-weight: 600;
  color: #495057;
}

.lane-team {
  display: flex;
  align-items: center;
  color: #6c757d;
  font-size: 13px;
  margin-bottom: 10px;
}

.team-icon {
  margin-right: 6px;
}

.lane-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  color: #adb5bd;
  margin-bottom: 2px;
}

.stat-value {
  font-weight: 600;
  color: #495057;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
}

/* 成绩记录卡片 */
.records-card {
  border-radius: 12px;
  max-height: 300px;
}

.records-card :deep(.ant-card-body) {
  padding: 12px;
}

/* 日志卡片 */
.log-card {
  margin: 0 20px 20px;
  border-radius: 12px;
  flex-shrink: 0;
}

.log-card :deep(.ant-card-head-title) {
  padding: 12px 0;
}

.log-card :deep(.ant-card-body) {
  padding: 12px;
}

.log-container {
  height: 120px;
  overflow-y: auto;
  background: #1e1e1e;
  border-radius: 8px;
  padding: 10px;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  font-size: 12px;
}

.log-item {
  padding: 4px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: #888;
  margin-right: 8px;
}

.log-info .log-message {
  color: #61dafb;
}

.log-success .log-message {
  color: #4caf50;
}

.log-warning .log-message {
  color: #ff9800;
}

.log-error .log-message {
  color: #f44336;
}

/* 滚动条样式 */
:deep(.antiscrollbar::-webkit-scrollbar),
.lanes-container::-webkit-scrollbar,
.log-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

:deep(.antiscrollbar::-webkit-scrollbar-track),
.lanes-container::-webkit-scrollbar-track,
.log-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

:deep(.antiscrollbar::-webkit-scrollbar-thumb),
.lanes-container::-webkit-scrollbar-thumb,
.log-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

:deep(.antiscrollbar::-webkit-scrollbar-thumb:hover),
.lanes-container::-webkit-scrollbar-thumb:hover,
.log-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.log-container::-webkit-scrollbar-track {
  background: #2d2d2d;
}

.log-container::-webkit-scrollbar-thumb {
  background: #555;
}

.log-container::-webkit-scrollbar-thumb:hover {
  background: #777;
}

/* ========== 响应式设计 ========== */

/* 平板设备 */
@media (max-width: 1024px) {
  .main-content {
    padding: 16px;
    gap: 16px;
  }

  .left-panel {
    flex: 0 0 320px;
    min-width: 300px;
  }

  .log-card {
    margin: 0 16px 16px;
  }

  .control-buttons .ant-btn {
    min-width: 75px;
    font-size: 14px;
  }
}

/* 窄口优化 */
@media (max-width: 600px) {
  .left-panel {
    flex: 0 0 280px;
    min-width: 260px;
  }

  .control-buttons .ant-btn {
    min-width: 65px;
    font-size: 13px;
    padding: 4px 12px;
  }

  .timer-card :deep(.ant-card-body) {
    padding: 24px;
  }

  .control-card :deep(.ant-card-body) {
    padding: 18px;
  }
}

/* 移动设备 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    padding: 12px;
    gap: 12px;
  }

  .left-panel {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
  }

  .right-panel {
    flex: 1 1 auto;
    width: 100%;
  }

  .log-card {
    margin: 0 12px 12px;
  }

  .header-bar {
    padding: 16px;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .header-info {
    width: 100%;
    justify-content: space-between;
  }

  .settings-text {
    display: none;
  }
}

/* 小屏手机 */
@media (max-width: 480px) {
  .main-content {
    padding: 8px;
    gap: 8px;
  }

  .left-panel {
    gap: 8px;
  }

  .right-panel {
    gap: 8px;
  }

  .log-card {
    margin: 0 8px 8px;
  }

  .title {
    font-size: 18px;
  }

  .title-icon {
    font-size: 22px;
  }

  .control-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .control-buttons .ant-btn {
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }

  .timer-card :deep(.ant-card-body) {
    padding: 20px;
  }

  .control-card :deep(.ant-card-body) {
    padding: 16px;
  }

  .info-card :deep(.ant-card-body) {
    padding: 12px;
  }
}
</style>
