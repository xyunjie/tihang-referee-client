<template>
  <div class="min-h-screen bg-#f5f7fa">
    <div class="bg-gradient-success p-20px-30px flex justify-between items-center shadow-md">
      <a-button type="text" @click="goBack" class="text-white! text-16px">
        <arrow-left-outlined /> 返回
      </a-button>
      <h1 class="text-24px font-600 text-white m-0">训练模式</h1>
      <div class="w-80px"></div>
    </div>

    <div class="p-24px flex flex-col gap-24px">
      <a-card class="rounded-12px" :bordered="false">
        <div class="min-h-400px flex items-center justify-center">
          <div v-if="!currentTeam" class="text-center max-w-400px w-full">
            <scan-outlined class="text-80px text-success mb-24px animate-pulse-custom" />
            <h2 class="text-24px mb-8px text-#262626">请扫描二维码或刷NFC卡</h2>
            <p class="text-#8c8c8c mb-32px">识别队伍身份后开始训练</p>

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

          <div v-else class="w-full max-w-600px">
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

      <a-card title="最近训练记录" class="rounded-12px" :bordered="false">
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
.bg-gradient-success {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
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

.animate-pulse-custom {
  animation: pulse 2s ease-in-out infinite;
}
</style>
