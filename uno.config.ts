import { defineConfig, presetAttributify, presetUno, presetIcons } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'btn-base': 'px-4 py-2 rounded cursor-pointer transition-all duration-300',
    'card-base': 'bg-white rounded-xl shadow-sm',
  },
  theme: {
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      success: '#52c41a',
      warning: '#ff9800',
      error: '#f44336',
      info: '#1890ff',
    },
  },
});
