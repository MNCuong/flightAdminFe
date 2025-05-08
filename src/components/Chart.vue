<template>
    <div>
      <!-- Render biểu đồ Bar -->
      <Bar :data="chartData" :options="chartOptions" v-if="chartData && chartOptions" />
    </div>
  </template>
  
  <script setup>
  import { Bar } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
  
  // Đăng ký các thành phần của Chart.js
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
  
  // Định nghĩa các prop để nhận dữ liệu và options từ cha
  const props = defineProps({
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  });
  </script>
  
  <style scoped>
  /* Thêm một số style nếu cần */
  </style>
  