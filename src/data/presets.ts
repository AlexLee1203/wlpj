import type { ExerciseFormState } from '../types';

export const quickExercisePresets: Array<{
  label: string;
  category: string;
  description: string;
  form: ExerciseFormState;
}> = [
  {
    label: '快走',
    category: '有氧',
    description: '30 分鐘 · 220 kcal',
    form: {
      name: '快走',
      durationMinutes: '30',
      caloriesBurned: '220'
    }
  },
  {
    label: '散步',
    category: '有氧',
    description: '30 分鐘 · 120 kcal',
    form: {
      name: '散步',
      durationMinutes: '30',
      caloriesBurned: '120'
    }
  },
  {
    label: '慢跑',
    category: '有氧',
    description: '30 分鐘 · 280 kcal',
    form: {
      name: '慢跑',
      durationMinutes: '30',
      caloriesBurned: '280'
    }
  },
  {
    label: '跑步',
    category: '有氧',
    description: '45 分鐘 · 420 kcal',
    form: {
      name: '跑步',
      durationMinutes: '45',
      caloriesBurned: '420'
    }
  },
  {
    label: '跳繩',
    category: '有氧',
    description: '20 分鐘 · 180 kcal',
    form: {
      name: '跳繩',
      durationMinutes: '20',
      caloriesBurned: '180'
    }
  },
  {
    label: '騎腳踏車',
    category: '戶外',
    description: '40 分鐘 · 260 kcal',
    form: {
      name: '騎腳踏車',
      durationMinutes: '40',
      caloriesBurned: '260'
    }
  },
  {
    label: '游泳',
    category: '有氧',
    description: '30 分鐘 · 300 kcal',
    form: {
      name: '游泳',
      durationMinutes: '30',
      caloriesBurned: '300'
    }
  },
  {
    label: '瑜伽',
    category: '伸展放鬆',
    description: '40 分鐘 · 120 kcal',
    form: {
      name: '瑜伽',
      durationMinutes: '40',
      caloriesBurned: '120'
    }
  },
  {
    label: '皮拉提斯',
    category: '伸展放鬆',
    description: '40 分鐘 · 160 kcal',
    form: {
      name: '皮拉提斯',
      durationMinutes: '40',
      caloriesBurned: '160'
    }
  },
  {
    label: '重訓',
    category: '肌力',
    description: '45 分鐘 · 260 kcal',
    form: {
      name: '重訓',
      durationMinutes: '45',
      caloriesBurned: '260'
    }
  },
  {
    label: '深蹲訓練',
    category: '肌力',
    description: '20 分鐘 · 110 kcal',
    form: {
      name: '深蹲訓練',
      durationMinutes: '20',
      caloriesBurned: '110'
    }
  },
  {
    label: '核心訓練',
    category: '肌力',
    description: '20 分鐘 · 100 kcal',
    form: {
      name: '核心訓練',
      durationMinutes: '20',
      caloriesBurned: '100'
    }
  },
  {
    label: '伏地挺身訓練',
    category: '肌力',
    description: '15 分鐘 · 80 kcal',
    form: {
      name: '伏地挺身訓練',
      durationMinutes: '15',
      caloriesBurned: '80'
    }
  },
  {
    label: '有氧舞蹈',
    category: '有氧',
    description: '30 分鐘 · 230 kcal',
    form: {
      name: '有氧舞蹈',
      durationMinutes: '30',
      caloriesBurned: '230'
    }
  },
  {
    label: 'HIIT',
    category: '肌力',
    description: '20 分鐘 · 240 kcal',
    form: {
      name: 'HIIT',
      durationMinutes: '20',
      caloriesBurned: '240'
    }
  },
  {
    label: '登山',
    category: '戶外',
    description: '90 分鐘 · 520 kcal',
    form: {
      name: '登山',
      durationMinutes: '90',
      caloriesBurned: '520'
    }
  },
  {
    label: '爬樓梯',
    category: '有氧',
    description: '20 分鐘 · 170 kcal',
    form: {
      name: '爬樓梯',
      durationMinutes: '20',
      caloriesBurned: '170'
    }
  },
  {
    label: '羽球',
    category: '球類',
    description: '60 分鐘 · 360 kcal',
    form: {
      name: '羽球',
      durationMinutes: '60',
      caloriesBurned: '360'
    }
  },
  {
    label: '籃球',
    category: '球類',
    description: '60 分鐘 · 430 kcal',
    form: {
      name: '籃球',
      durationMinutes: '60',
      caloriesBurned: '430'
    }
  },
  {
    label: '足球',
    category: '球類',
    description: '60 分鐘 · 460 kcal',
    form: {
      name: '足球',
      durationMinutes: '60',
      caloriesBurned: '460'
    }
  },
  {
    label: '桌球',
    category: '球類',
    description: '45 分鐘 · 190 kcal',
    form: {
      name: '桌球',
      durationMinutes: '45',
      caloriesBurned: '190'
    }
  },
  {
    label: '伸展',
    category: '伸展放鬆',
    description: '15 分鐘 · 50 kcal',
    form: {
      name: '伸展',
      durationMinutes: '15',
      caloriesBurned: '50'
    }
  }
];
