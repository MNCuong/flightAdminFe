<template>
  <v-card class="white pa-4" flat>
    <h1 class="text-h4 mb-4 font-weight-bold">Báo cáo thống kê</h1>

    <!-- Thống kê tổng quan -->
    <v-row justify="space-between" align="center" no-gutters>
      <v-col cols="12" sm="4" md="3" class="d-flex flex-column align-center">
        <h4>Tổng chuyến bay</h4>
        <p class="text-info display-6">{{ stats.totalFlights }}</p>
      </v-col>
      <v-col cols="12" sm="4" md="3" class="d-flex flex-column align-center">
        <h4>Tổng khách hàng</h4>
        <p class="text-success display-6">{{ stats.totalCustomers }}</p>
      </v-col>
      <v-col cols="12" sm="4" md="3" class="d-flex flex-column align-center">
        <h4>Tổng doanh thu</h4>
        <p class="text-danger display-6">{{ stats.totalRevenue.toLocaleString() }} VND</p>
      </v-col>
    </v-row>

    <hr class="my-4" />

    <!-- Biểu đồ thống kê -->
    <v-row>
      <v-col v-for="(chartData, index) in charts" :key="index" cols="12" sm="6" md="3">
        <v-card class="pa-3">
          <h5 class="text-center">{{ chartData.title }}</h5>
          <Chart :data="chartData.data" :options="chartData.options" />
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../../services/api';
import Chart from '../../components/Chart.vue'; 

const router = useRouter();

const stats = ref({
  totalFlights: 0,
  totalCustomers: 0,
  totalRevenue: 0,
});

const charts = ref([  // Các biểu đồ hiển thị
  {
    title: 'Doanh thu theo tháng',
    data: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
      datasets: [
        {
          label: 'Doanh thu (triệu VND)',
          backgroundColor: '#42a5f5',
          data: [100, 120, 150, 180, 160, 190],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: false },
      },
    },
  },
  {
    title: 'Tỷ lệ hạng vé đã bán',
    data: {
      labels: ['Economy', 'Business', 'First'],
      datasets: [
        {
          backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
          data: [60, 30, 10],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: false },
      },
    },
  },
  {
    title: 'Số chuyến bay mỗi tháng',
    data: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
      datasets: [
        {
          label: 'Số chuyến bay',
          backgroundColor: '#26a69a',
          data: [40, 45, 50, 60, 55, 70],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: false },
      },
    },
  },
  {
    title: 'Tỷ lệ khách hàng theo quốc tịch',
    data: {
      labels: ['Việt Nam', 'Hàn Quốc', 'Mỹ', 'Nhật Bản'],
      datasets: [
        {
          backgroundColor: ['#03a9f4', '#8bc34a', '#ff5722', '#9c27b0'],
          data: [50, 20, 15, 15],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: false },
      },
    },
  },
]);

// Lấy dữ liệu thống kê từ backend
onMounted(async () => {
  try {
    const response = await axios.get('/reports/statistics');
    stats.value = response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy thống kê:', error);
  }
});
</script>

<style scoped>
/* Thêm một số style nếu cần */
</style>
