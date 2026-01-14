import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface TeamMember {
  name: string;
  studentId?: string;
}

export interface Team {
  id: string;
  name: string;
  school: string;
  groupId: string; // 组别ID
  members: TeamMember[];
  laneNumber?: number; // 赛道号
}

export const useTeamStore = defineStore('team', () => {
  const teams = ref<Team[]>([]);
  const currentTeam = ref<Team | null>(null);

  const addTeam = (team: Team) => {
    teams.value.push(team);
  };

  const setCurrentTeam = (team: Team | null) => {
    currentTeam.value = team;
  };

  const clearTeams = () => {
    teams.value = [];
  };

  const loadTeamsFromFile = async (fileContent: string) => {
    // TODO: 解析CSV/Excel文件
    console.log('解析队伍文件:', fileContent);
  };

  const fetchTeamInfo = async (code: string) => {
    try {
      // TODO: 通过扫码/NFC从服务器获取队伍信息
      console.log('获取队伍信息:', code);
      return null;
    } catch (error) {
      console.error('获取队伍信息失败:', error);
      return null;
    }
  };

  return {
    teams,
    currentTeam,
    addTeam,
    setCurrentTeam,
    clearTeams,
    loadTeamsFromFile,
    fetchTeamInfo,
  };
});
