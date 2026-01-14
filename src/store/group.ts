import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface GroupRule {
  laps: number; // 圈数
  // 后续扩展其他规则
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  rule: GroupRule;
}

export const useGroupStore = defineStore('group', () => {
  const groups = ref<Group[]>([
    {
      id: 'camera',
      name: '光电组',
      description: '使用光电传感器的智能车',
      rule: { laps: 1 },
    },
    {
      id: 'magnetic',
      name: '电磁组',
      description: '使用电磁传感器的智能车',
      rule: { laps: 1 },
    },
    {
      id: 'balance',
      name: '平衡组',
      description: '两轮平衡智能车',
      rule: { laps: 1 },
    },
  ]);

  const loadGroupsFromServer = async () => {
    try {
      // TODO: 从服务器获取最新组别配置
      console.log('从服务器加载组别配置');
    } catch (error) {
      console.error('加载组别配置失败:', error);
    }
  };

  const getGroupById = (id: string) => {
    return groups.value.find(g => g.id === id);
  };

  return {
    groups,
    loadGroupsFromServer,
    getGroupById,
  };
});
