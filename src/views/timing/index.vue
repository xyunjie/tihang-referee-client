<template>
  <div class="timing-page">
    <div class="header">
      <a-button type="text" @click="goBack" class="back-btn">
        <arrow-left-outlined /> 返回
      </a-button>
      <h1 class="title">{{ modeText }}</h1>
      <a-tag :color="statusColor" class="status-tag">
        {{ statusText }}
      </a-tag>
    </div>

    <div class="content">
      <div class="timer-section">
        <a-card class="timer-card" :bordered="false">
          <div class="timer-display">
            <div class="timer-label">计时</div>
            <div class="timer-value">{{ formattedTime }}</div>
            <div class="timer-ms">.{{ formattedMs }}</div>
          </div>
        </a-card>

        <a-card class="control-card" :bordered="false">
          <a-space :size="16" class="control-buttons">
            <a-button
              type="primary"
              size="large"
              :disabled="isRunning"
              @click="handleStart"
            >
              <play-circle-outlined /> 开始
            </a-button>
            <a-button
              size="large"
              :disabled="!isRunning || isPaused"
              @click="handlePause"
            >
              <pause-circle-outlined /> 暂停
            </a-button>
            <a-button
              size="large"
              :disabled="!isPaused"
              @click="handleResume"
            >
              <play-circle-outlined /> 继续
            </a-button>
            <a-button
              danger
              size="large"
              @click="handleStop"
              :disabled="!isRunning"
            >
              <check-circle-outlined /> 完成
            </a-button>
            <a-button
              size="large"
              @click="handleReset"
            >
              <redo-outlined /> 重置
            </a-button>
          </a-space>
        </a-card>

        <a-card v-if="currentResult" class="info-card" :bordered="false">
          <a-descriptions title="当前信息" :column="1" size="small">
            <a-descriptions-item label="队伍">
              {{ currentResult.teamName }}
            </a-descriptions-item>
            <a-descriptions-item label="组别">
              {{ getGroupName(currentResult.groupId) }}
            </a-descriptions-item>
            <a-descriptions-item label="圈数">
              {{ currentResult.laps.length }} / {{ targetLaps }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </div>

      <div class="data-section">
        <a-card title="圈速记录" class="laps-card" :bordered="false">
          <a-table
            :columns="lapColumns"
            :data-source="lapRecords"
            :pagination="false"
            size="small"
            :scroll="{ y: 200 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'time'">
                {{ formatLapTime(record.time) }}
              </template>
            </template>
          </a-table>
        </a-card>

        <a-card title="历史成绩" class="results-card" :bordered="false">
          <a-table
            :columns="resultColumns"
            :data-source="results"
            :pagination="{ pageSize: 5 }"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'totalTime'">
                {{ formatLapTime(record.totalTime) }}
              </template>
              <template v-else-if="column.key === 'status'">
                <a-tag :color="record.status === 'finished' ? 'success' : 'processing'">
                  {{ record.status === 'finished' ? '已完成' : '进行中' }}
                </a-tag>
              </template>
            </template>
          </a-table>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ArrowLeftOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  RedoOutlined,
} from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { useTimingStore } from '@/store/timing';
import { useTeamStore } from '@/store/team';
import { useGroupStore } from '@/store/group';
import { useAppStore } from '@/store/app';

const router = useRouter();
const route = useRoute();
const timingStore = useTimingStore();
const teamStore = useTeamStore();
const groupStore = useGroupStore();
const appStore = useAppStore();

const mode = computed(() => route.query.mode as string);
const modeText = computed(() => mode.value === 'training' ? '训练计时' : '比赛计时');

const isRunning = computed(() => timingStore.isRunning);
const isPaused = computed(() => timingStore.isPaused);
const formattedTime = computed(() => timingStore.formattedTime);
const formattedMs = computed(() => timingStore.formattedMs);
const currentResult = computed(() => timingStore.currentResult);
const results = computed(() => timingStore.results);

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

const targetLaps = ref(1);

const lapRecords = computed(() => {
  return currentResult.value?.laps || [];
});

const lapColumns = [
  { title: '圈数', dataIndex: 'lapNumber', key: 'lapNumber', width: 80 },
  { title: '用时', key: 'time' },
];

const resultColumns = [
  { title: '队伍', dataIndex: 'teamName', key: 'teamName' },
  { title: '组别', dataIndex: 'groupId', key: 'groupId' },
  { title: '总用时', key: 'totalTime' },
  { title: '状态', key: 'status', width: 100 },
];

const goBack = () => {
  if (isRunning.value) {
    Modal.confirm({
      title: '确认返回',
      content: '计时正在进行中，确定要返回吗？',
      onOk: () => {
        timingStore.reset();
        router.back();
      },
    });
  } else {
    router.back();
  }
};

const getGroupName = (groupId: string) => {
  const group = groupStore.getGroupById(groupId);
  return group?.name || groupId;
};

const formatLapTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
};

const handleStart = () => {
  const team = teamStore.currentTeam;
  if (!team) {
    message.error('未选择队伍');
    return;
  }

  const group = groupStore.getGroupById(team.groupId);
  if (group) {
    targetLaps.value = group.rule.laps;
  }

  timingStore.start(team.id, team.name, team.groupId);
  message.success('计时开始');
};

const handlePause = () => {
  timingStore.pause();
  message.info('已暂停');
};

const handleResume = () => {
  timingStore.resume();
  message.success('继续计时');
};

const handleStop = () => {
  Modal.confirm({
    title: '确认完成',
    content: '确定要结束计时吗？',
    onOk: async () => {
      timingStore.stop();
      message.success('计时完成');

      if (appStore.networkMode === 'online' && currentResult.value) {
        await timingStore.uploadResult(currentResult.value);
      }
    },
  });
};

const handleReset = () => {
  if (isRunning.value) {
    Modal.confirm({
      title: '确认重置',
      content: '计时正在进行中，确定要重置吗？',
      onOk: () => {
        timingStore.reset();
        message.success('已重置');
      },
    });
  } else {
    timingStore.reset();
    message.success('已重置');
  }
};

onMounted(() => {
  if (mode.value === 'training' && !teamStore.currentTeam) {
    message.warning('请先选择队伍');
    router.push('/training');
  }
});
</script>

<style scoped>
.timing-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.back-btn {
  color: white !important;
  font-size: 16px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin: 0;
  flex: 1;
  text-align: center;
}

.status-tag {
  font-size: 14px;
}

.content {
  padding: 24px;
  display: flex;
  gap: 24px;
}

.timer-section {
  flex: 0 0 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.data-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timer-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
}

.timer-display {
  text-align: center;
  color: white;
  padding: 20px;
}

.timer-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.timer-value {
  font-size: 56px;
  font-weight: 700;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  line-height: 1;
  letter-spacing: 2px;
}

.timer-ms {
  font-size: 24px;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  opacity: 0.8;
  margin-top: 4px;
}

.control-card {
  border-radius: 12px;
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
  min-width: 80px;
}

.info-card {
  border-radius: 12px;
}

.laps-card,
.results-card {
  border-radius: 12px;
  flex: 1;
}

@media (max-width: 1024px) {
  .content {
    flex-direction: column;
  }

  .timer-section {
    flex: 1;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 16px 20px;
  }

  .title {
    font-size: 20px;
  }

  .content {
    padding: 16px;
  }

  .timer-value {
    font-size: 40px;
  }

  .timer-ms {
    font-size: 18px;
  }

  .control-buttons {
    flex-direction: column;
  }

  .control-buttons .ant-btn {
    width: 100%;
  }
}
</style>
