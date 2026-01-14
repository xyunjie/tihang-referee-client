import { defineStore } from 'pinia';
import { ref } from 'vue';

export type WorkMode = 'training' | 'competition';
export type NetworkMode = 'online' | 'offline';

export const useAppStore = defineStore('app', () => {
  const workMode = ref<WorkMode>('training');
  const networkMode = ref<NetworkMode>('offline');
  const isConnected = ref(false);

  const setWorkMode = (mode: WorkMode) => {
    workMode.value = mode;
  };

  const setNetworkMode = (mode: NetworkMode) => {
    networkMode.value = mode;
  };

  const checkConnection = async () => {
    try {
      // TODO: 实际检测网络连接
      isConnected.value = true;
      networkMode.value = 'online';
    } catch {
      isConnected.value = false;
      networkMode.value = 'offline';
    }
  };

  return {
    workMode,
    networkMode,
    isConnected,
    setWorkMode,
    setNetworkMode,
    checkConnection,
  };
});
