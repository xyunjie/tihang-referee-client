<template>
  <div class="competition-page">
    <div class="header">
      <a-button type="text" @click="goBack" class="back-btn">
        <arrow-left-outlined /> 返回
      </a-button>
      <h1 class="title">比赛模式</h1>
      <div class="placeholder"></div>
    </div>

    <div class="content">
      <a-card class="upload-card" :bordered="false">
        <div v-if="teams.length === 0" class="upload-area">
          <a-upload-dragger
            :before-upload="handleFileUpload"
            :show-upload-list="false"
            accept=".csv,.xlsx,.xls"
          >
            <p class="ant-upload-drag-icon">
              <file-excel-outlined style="color: #1890ff" />
            </p>
            <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p class="ant-upload-hint">
              支持 CSV 或 Excel 格式的队伍信息表格
            </p>
          </a-upload-dragger>

          <a-divider>或</a-divider>

          <a-button type="primary" size="large" block @click="showAddTeamModal">
            <plus-outlined /> 手动添加队伍
          </a-button>
        </div>

        <div v-else class="teams-list">
          <div class="list-header">
            <h3>已导入队伍 ({{ teams.length }})</h3>
            <a-space>
              <a-button @click="showAddTeamModal">
                <plus-outlined /> 添加队伍
              </a-button>
              <a-button danger @click="clearTeams">
                <delete-outlined /> 清空
              </a-button>
            </a-space>
          </div>

          <a-table
            :columns="teamColumns"
            :data-source="teams"
            :pagination="false"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'members'">
                <a-tag v-for="member in record.members" :key="member.name">
                  {{ member.name }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'groupId'">
                {{ getGroupName(record.groupId) }}
              </template>
              <template v-else-if="column.key === 'action'">
                <a-button type="link" danger size="small" @click="removeTeam(record.id)">
                  删除
                </a-button>
              </template>
            </template>
          </a-table>

          <div class="action-bar">
            <a-button
              type="primary"
              size="large"
              @click="startCompetition"
              :disabled="teams.length === 0"
            >
              <play-circle-outlined /> 开始比赛
            </a-button>
          </div>
        </div>
      </a-card>
    </div>

    <a-modal
      v-model:open="addTeamModalVisible"
      title="添加队伍"
      @ok="handleAddTeam"
      @cancel="resetForm"
    >
      <a-form :model="teamForm" layout="vertical">
        <a-form-item label="队伍名称" required>
          <a-input v-model:value="teamForm.name" placeholder="请输入队伍名称" />
        </a-form-item>
        <a-form-item label="学校" required>
          <a-input v-model:value="teamForm.school" placeholder="请输入学校名称" />
        </a-form-item>
        <a-form-item label="组别" required>
          <a-select v-model:value="teamForm.groupId" placeholder="请选择组别">
            <a-select-option v-for="group in groups" :key="group.id" :value="group.id">
              {{ group.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="成员">
          <a-input
            v-model:value="teamForm.membersInput"
            placeholder="请输入成员姓名，用逗号分隔"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowLeftOutlined,
  FileExcelOutlined,
  PlusOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useTeamStore } from '@/store/team';
import { useGroupStore } from '@/store/group';
import type { Team } from '@/store/team';

const router = useRouter();
const teamStore = useTeamStore();
const groupStore = useGroupStore();

const addTeamModalVisible = ref(false);
const teamForm = ref({
  name: '',
  school: '',
  groupId: '',
  membersInput: '',
});

const teams = computed(() => teamStore.teams);
const groups = computed(() => groupStore.groups);

const teamColumns = [
  { title: '队伍名称', dataIndex: 'name', key: 'name' },
  { title: '学校', dataIndex: 'school', key: 'school' },
  { title: '组别', key: 'groupId' },
  { title: '成员', key: 'members' },
  { title: '操作', key: 'action', width: 100 },
];

const goBack = () => {
  router.push('/');
};

const getGroupName = (groupId: string) => {
  const group = groupStore.getGroupById(groupId);
  return group?.name || groupId;
};

const handleFileUpload = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    parseTeamsFile(content, file.name);
  };
  reader.readAsText(file);
  return false;
};

const parseTeamsFile = (content: string, filename: string) => {
  try {
    // TODO: 实际解析CSV/Excel文件
    // 这里是模拟数据
    const mockTeams: Team[] = [
      {
        id: '1',
        name: '清华车队',
        school: '清华大学',
        groupId: 'camera',
        members: [{ name: '张三' }, { name: '李四' }],
      },
      {
        id: '2',
        name: '北大车队',
        school: '北京大学',
        groupId: 'magnetic',
        members: [{ name: '王五' }, { name: '赵六' }],
      },
    ];

    mockTeams.forEach(team => teamStore.addTeam(team));
    message.success(`成功导入 ${mockTeams.length} 支队伍`);
  } catch (error) {
    message.error('文件解析失败，请检查文件格式');
  }
};

const showAddTeamModal = () => {
  addTeamModalVisible.value = true;
};

const handleAddTeam = () => {
  if (!teamForm.value.name || !teamForm.value.school || !teamForm.value.groupId) {
    message.warning('请填写完整信息');
    return;
  }

  const members = teamForm.value.membersInput
    .split(',')
    .map(name => ({ name: name.trim() }))
    .filter(m => m.name);

  const team: Team = {
    id: Date.now().toString(),
    name: teamForm.value.name,
    school: teamForm.value.school,
    groupId: teamForm.value.groupId,
    members,
  };

  teamStore.addTeam(team);
  message.success('添加成功');
  addTeamModalVisible.value = false;
  resetForm();
};

const resetForm = () => {
  teamForm.value = {
    name: '',
    school: '',
    groupId: '',
    membersInput: '',
  };
};

const removeTeam = (teamId: string) => {
  const index = teams.value.findIndex(t => t.id === teamId);
  if (index > -1) {
    teams.value.splice(index, 1);
    message.success('删除成功');
  }
};

const clearTeams = () => {
  teamStore.clearTeams();
  message.success('已清空');
};

const startCompetition = () => {
  router.push({
    path: '/timing',
    query: { mode: 'competition' },
  });
};
</script>

<style scoped>
.competition-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
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
}

.upload-card {
  border-radius: 12px;
  min-height: 500px;
}

.upload-area {
  padding: 40px;
  max-width: 600px;
  margin: 0 auto;
}

.teams-list {
  padding: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.list-header h3 {
  margin: 0;
  font-size: 18px;
}

.action-bar {
  margin-top: 24px;
  text-align: center;
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

  .upload-area {
    padding: 20px;
  }

  .list-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
