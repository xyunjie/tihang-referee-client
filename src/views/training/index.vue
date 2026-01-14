<template>
  <div class="training-page">
    <div class="header">
      <a-button type="text" @click="goBack" class="back-btn">
        <arrow-left-outlined /> 返回
      </a-button>
      <h1 class="title">训练模式</h1>
      <div class="placeholder"></div>
    </div>

    <div class="content">
      <a-card class="scan-card" :bordered="false">
        <div class="scan-area">
          <div v-if="!currentTeam" class="scan-prompt">
            <scan-outlined class="scan-icon" />
            <h2>请扫描二维码或刷NFC卡</h2>
            <p class="hint">识别队伍身份后开始训练</p>

            <a-divider>或</a-divider>

            <a-space direction="vertical" style="width: 100%">
              <a-input
                v-model:value="manualCode"
                placeholder="手动输入队伍编号"
                size="large"
                @pressEnter="handleManualInput"
              >
                <template #prefix>
                  <number-outlined />
                </template>
              </a-input>
              <a-button
                type="primary"
                size="large"
                block
                @click="handleManualInput"
                :loading="loading"
              >
                确认
              </a-button>
            </a-space>
          </div>

          <div v-else class="team-info">
            <a-result status="success" title="身份识别成功">
              <template #icon>
                <check-circle-outlined style="color: #52c41a" />
              </template>
              <template #extra>
                <a-descriptions bordered :column="1" size="small">
                  <a-descriptions-item label="队伍名称">
                    {{ currentTeam.name }}
                  </a-descriptions-item>
                  <a-descriptions-item label="学校">
                    {{ currentTeam.school }}
                  </a-descriptions-item>
                  <a-descriptions-item label="组别">
                    {{ getGroupName(currentTeam.groupId) }}
                  </a-descriptions-item>
                  <a-descriptions-item label="成员">
                    <a-tag v-for="member in currentTeam.members" :key="member.name">
                      {{ member.name }}
                    </a-tag>
                  </a-descriptions-item>
                </a-descriptions>

                <a-space style="margin-top: 24px">
                  <a-button
                    type="primary"
                    size="large"
                    @click="startTiming"
                  >
                    <play-circle-outlined /> 开始计时
                  </a-button>
                  <a-button size="large" @click="resetTeam">
                    <redo-outlined /> 重新识别
                  </a-button>
                </a-space>
              </template>
            </a-result>
          </div>
        </div>
      </a-card>

      <a-card title="最近训练记录" class="records-card" :bordered="false">
        <a-table
          :columns="recordColumns"
          :data-source="recentRecords"
          :pagination="{ pageSize: 5 }"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag :color="record.status === 'finished' ? 'success' : 'processing'">
                {{ record.status === 'finished' ? '已完成' : '进行中' }}
              </a-tag>
            </template>
          </template>
        </a-table>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowLeftOutlined,
  ScanOutlined,
  NumberOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  RedoOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useTeamStore } from '@/store/team';
import { useGroupStore } from '@/store/group';
import { useTimingStore } from '@/store/timing';

const router = useRouter();
const teamStore = useTeamStore();
const groupStore = useGroupStore();
const timingStore = useTimingStore();

const manualCode = ref('');
const loading = ref(false);

const currentTeam = computed(() => teamStore.currentTeam);
const recentRecords = computed(() => timingStore.results.slice(-10).reverse());

const recordColumns = [
  { title: '队伍', dataIndex: 'teamName', key: 'teamName' },
  { title: '组别', dataIndex: 'groupId', key: 'groupId' },
  { title: '用时', dataIndex: 'totalTime', key: 'totalTime' },
  { title: '状态', key: 'status' },
];

const goBack = () => {
  router.push('/');
};

const getGroupName = (groupId: string) => {
  const group = groupStore.getGroupById(groupId);
  return group?.name || groupId;
};

const handleManualInput = async () => {
  if (!manualCode.value.trim()) {
    message.warning('请输入队伍编号');
    return;
  }

  loading.value = true;
  try {
    // TODO: 实际从服务器获取队伍信息
    // 模拟数据
    const mockTeam = {
      id: manualCode.value,
      name: '测试队伍',
      school: '梯航工作室',
      groupId: 'camera',
      members: [
        { name: '张三', studentId: '2021001' },
        { name: '李四', studentId: '2021002' },
      ],
    };

    teamStore.setCurrentTeam(mockTeam);
    message.success('识别成功');
  } catch (error) {
    message.error('识别失败，请重试');
  } finally {
    loading.value = false;
  }
};

const startTiming = () => {
  if (!currentTeam.value) return;

  router.push({
    path: '/timing',
    query: { mode: 'training' },
  });
};

const resetTeam = () => {
  teamStore.setCurrentTeam(null);
  manualCode.value = '';
};
</script>

<style scoped>
.training-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
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
}

.placeholder {
  width: 80px;
}

.content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.scan-card {
  border-radius: 12px;
}

.scan-area {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scan-prompt {
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.scan-icon {
  font-size: 80px;
  color: #52c41a;
  margin-bottom: 24px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

.scan-prompt h2 {
  font-size: 24px;
  margin-bottom: 8px;
  color: #262626;
}

.hint {
  color: #8c8c8c;
  margin-bottom: 32px;
}

.team-info {
  width: 100%;
  max-width: 600px;
}

.records-card {
  border-radius: 12px;
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

  .scan-icon {
    font-size: 60px;
  }

  .scan-prompt h2 {
    font-size: 20px;
  }
}
</style>
