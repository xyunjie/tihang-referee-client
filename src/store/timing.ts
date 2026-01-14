import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface LapRecord {
  lapNumber: number;
  time: number; // 毫秒
  timestamp: number;
}

export interface TimingResult {
  teamId: string;
  teamName: string;
  groupId: string;
  laps: LapRecord[];
  totalTime: number;
  status: 'running' | 'finished' | 'failed';
  startTime: number;
  endTime?: number;
}

export const useTimingStore = defineStore('timing', () => {
  const isRunning = ref(false);
  const isPaused = ref(false);
  const elapsedTime = ref(0);
  const currentResult = ref<TimingResult | null>(null);
  const results = ref<TimingResult[]>([]);

  let timer: number | null = null;

  const formattedTime = computed(() => {
    const minutes = Math.floor(elapsedTime.value / 60000);
    const seconds = Math.floor((elapsedTime.value % 60000) / 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  const formattedMs = computed(() => {
    return String(Math.floor((elapsedTime.value % 1000) / 10)).padStart(2, '0');
  });

  const start = (teamId: string, teamName: string, groupId: string) => {
    if (isRunning.value) return;

    currentResult.value = {
      teamId,
      teamName,
      groupId,
      laps: [],
      totalTime: 0,
      status: 'running',
      startTime: Date.now(),
    };

    isRunning.value = true;
    isPaused.value = false;
    elapsedTime.value = 0;

    timer = setInterval(() => {
      elapsedTime.value += 10;
    }, 10);
  };

  const pause = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    isPaused.value = true;
  };

  const resume = () => {
    if (!isPaused.value) return;

    isPaused.value = false;
    timer = setInterval(() => {
      elapsedTime.value += 10;
    }, 10);
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    if (currentResult.value) {
      currentResult.value.totalTime = elapsedTime.value;
      currentResult.value.endTime = Date.now();
      currentResult.value.status = 'finished';
      results.value.push({ ...currentResult.value });
    }

    isRunning.value = false;
    isPaused.value = false;
  };

  const reset = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    isRunning.value = false;
    isPaused.value = false;
    elapsedTime.value = 0;
    currentResult.value = null;
  };

  const recordLap = () => {
    if (!currentResult.value || !isRunning.value) return;

    const lap: LapRecord = {
      lapNumber: currentResult.value.laps.length + 1,
      time: elapsedTime.value,
      timestamp: Date.now(),
    };

    currentResult.value.laps.push(lap);
  };

  const uploadResult = async (result: TimingResult) => {
    try {
      // TODO: 上传成绩到服务器
      console.log('上传成绩:', result);
    } catch (error) {
      console.error('上传成绩失败:', error);
    }
  };

  return {
    isRunning,
    isPaused,
    elapsedTime,
    currentResult,
    results,
    formattedTime,
    formattedMs,
    start,
    pause,
    resume,
    stop,
    reset,
    recordLap,
    uploadResult,
  };
});
