<template>
    <!--  <v-card class="white pa-4" flat>-->
    <!--    <h1 class="text-h4 mb-4 font-weight-bold">Báo cáo thống kê</h1>-->

    <!-- Thống kê tổng quan -->
    <v-row justify="space-between" align="center" no-gutters>
        <v-row justify="space-between" align="center" no-gutters>
            <!-- Tổng số giao dịch -->
            <v-col cols="12" sm="4" md="3" class="d-flex flex-column align-center pa-3">
                <v-icon class="mb-2" color="blue">mdi-transaction</v-icon>
                <h4 class="text-h6 font-weight-medium">Tổng số giao dịch</h4>
                <p class="text-info text-h4">{{ stats.totalBookings }}</p>
            </v-col>

            <!-- Tổng khách hàng -->
            <v-col cols="12" sm="4" md="3" class="d-flex flex-column align-center pa-3">
                <v-icon class="mb-2" color="green">mdi-account-group</v-icon>
                <h4 class="text-h6 font-weight-medium">Tổng khách hàng</h4>
                <p class="text-success text-h4">{{ stats.totalCustomers }}</p>
            </v-col>

            <!-- Số lượng vé đặt trong tháng -->
            <v-col cols="12" sm="4" md="3" class="d-flex flex-column align-center pa-3">
                <v-icon class="mb-2" color="purple">mdi-calendar-month</v-icon>
                <h4 class="text-h6 font-weight-medium">Số lượng vé đặt trong tháng</h4>
                <p class="text-warning text-h4">{{ stats.totalBookingCustomers }}</p>
            </v-col>

            <!-- Tổng doanh thu -->
            <v-col cols="12" sm="4" md="3" class="d-flex flex-column align-center pa-3">
                <v-icon class="mb-2" color="red">mdi-currency-vnd</v-icon>
                <h4 class="text-h6 font-weight-medium">Tổng doanh thu trong ngày</h4>
                <p class="text-danger text-h4">{{ formatCurrency(stats.totalRevenue) }}</p>
            </v-col>
        </v-row>
    </v-row>
    <hr class="my-4" />
    <v-row class="mb-4" align="center" justify="space-between">
        <v-col cols="8">
            <v-text-field v-model="searchQuery" label="Tìm kiếm giao dịch" outlined clearable hide-details="auto" />
        </v-col>
        <v-col cols="4">
            <v-btn color="success" @click="handleExport">Xuất Excel</v-btn>
        </v-col>
    </v-row>
    <v-table>
        <thead>
            <tr>
                <th>STT</th>
                <th>Mã giao dịch</th>
                <th>Tên khách hàng</th>
                <th>Ngày đặt vé</th>
                <!--            <th>Loại vé</th>-->
                <th>Giá</th>
                <th>Ghi chú</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
            </tr>
        </thead>
        <tbody>
            <tr v-if="!bookings.length && !isLoading">
                <td colspan="8">Không có dữ liệu</td>
            </tr>
            <tr v-for="(booking, index) in bookings" :key="booking.id">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>{{ booking.transactionNo }}</td>
                <td>{{ booking.user.fullName }}</td>
                <td>{{ booking.transactionDate }}</td>
                <!--            <td>{{ booking.typeBooking }}</td>-->
                <!--            <td>{{ booking.amount | currency }}</td>-->
                <td>{{ formatCurrency(booking.amount) }}</td>

                <td class="small-text">{{ booking.description }}</td>
                <td class="small-text">{{ booking.status }}</td>
                <td>
                    <v-btn color="primary" class="mr-2" @click="paymentDetail(booking)"> Chi tiết</v-btn>
                </td>
            </tr>
        </tbody>
    </v-table>

    <!-- Phân trang -->
    <v-pagination v-model="currentPage" :length="pageCount" :total-visible="5" @input="fetchBookings" />
    <hr class="my-4" />

    <!-- Biểu đồ thống kê -->
    <v-card class="pa-4">
        <v-row>
            <v-col cols="12" md="6">
                <div class="text-subtitle-1">TỔNG DOANH THU</div>
                <div class="text-h5 font-weight-bold text-primary">
                    {{ formatCurrency(totalRevenue) }}
                </div>
                <div class="text-success font-weight-bold">
                    ⬆ {{ growthRate }}%
                </div>
            </v-col>
        </v-row>

        <Chart :data="chartData.data" :options="chartData.options" />
    </v-card>

</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../../services/api';
import Chart from '../../components/Chart.vue';

const router = useRouter();

const stats = ref({
    totalBookings: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    totalBookingCustomers: 0
});

const bookings = ref([]);
const customers = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);
const isLoading = ref(true);
const today = new Date();
const startOfDay = new Date(today.setHours(0, 0, 0, 0));
const endOfDay = new Date(today.setHours(23, 59, 59, 999));
const formatCurrency = (value) => {
    if (!value) return '0';
    const adjustedValue = value / 100;

    return (
        new Intl.NumberFormat('vi-VN', {
            style: 'decimal',
            minimumFractionDigits: 0
        }).format(adjustedValue) + ''
    );
};

const pageCount = computed(() => {
    return Math.ceil(stats.value.totalBookings / pageSize.value);
});

const fetchBookings = async () => {
    try {
        isLoading.value = true;
        let allBookings = [];
        let totalRevenue = 0;
        let currentPage = 0;
        let totalPages = 1;
        while (currentPage < totalPages) {
            const response = await axios.get('/payment/list-transaction', {
                params: {
                    page: currentPage,
                    size: pageSize.value
                }
            });

            allBookings = [...allBookings, ...response.data.data.content];
            totalRevenue += response.data.data.content.reduce((sum, booking) => {
                const bookingDate = new Date(booking.transactionDate);
                if (booking.status === 'Success' && bookingDate >= startOfDay && bookingDate <= endOfDay) {
                    return sum + booking.amount;
                }
                return sum;
            }, 0);

            totalPages = response.data.data.totalPages;
            currentPage++;
        }

        bookings.value = allBookings;
        stats.value.totalRevenue = totalRevenue;
        stats.value.totalBookings = allBookings.length;

        const currentMonth = new Date().getMonth() + 1;
        stats.value.totalBookingCustomers = allBookings.filter((booking) => {
            const bookingMonth = new Date(booking.transactionDate).getMonth() + 1;
            return bookingMonth === currentMonth;
        }).length;
    } catch (error) {
        console.error('Lỗi khi tải danh sách giao dịch:', error);
    } finally {
        isLoading.value = false;
    }
};
const fetchCustomer = async () => {
    try {
        isLoading.value = true;
        const response = await axios.get('/user/list-user', {
            params: {
                page: currentPage.value - 1,
                size: pageSize.value
            }
        });
        customers.value = response.data.data.content;
        stats.value.totalCustomers = response.data.data.totalElements;
    } catch (error) {
        console.error('Lỗi khi tải danh sách giao dịch:', error);
    } finally {
        isLoading.value = false;
    }
};
const paymentDetail = (booking) => {
    router.push({ name: 'PaymentDetail', params: { id: booking.id } });
};

// Lấy dữ liệu khi trang được tải
onMounted(() => {
    fetchBookings();
    fetchCustomer();
});

// Cập nhật dữ liệu khi trang thay đổi
watch(currentPage, fetchBookings);
//
// const charts = ref([
//     {
//         title: 'Số lượng vé bán theo tháng',
//         data: {
//             labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
//             datasets: [
//                 {
//                     label: 'Vé bán (nghìn vé)',
//                     borderColor: '#42a5f5',
//                     backgroundColor: 'rgba(66,165,245,0.2)',
//                     tension: 0.4,
//                     data: [200, 220, 250, 300, 280, 310],
//                     fill: true
//                 }
//             ]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 legend: { position: 'top' },
//                 title: { display: false }
//             },
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     },
//     {
//         title: 'Tỷ lệ khách hàng quay lại theo tháng',
//         data: {
//             labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
//             datasets: [
//                 {
//                     label: 'Khách hàng quay lại (%)',
//                     borderColor: '#ff9800',
//                     backgroundColor: 'rgba(255,152,0,0.2)',
//                     tension: 0.4,
//                     data: [45, 50, 55, 53, 60, 65],
//                     fill: true
//                 }
//             ]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 legend: { position: 'top' },
//                 title: { display: false }
//             },
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     max: 100
//                 }
//             }
//         }
//     }
// ])

const totalRevenue = 22303540 // đồng
const growthRate = 2374.17

function formatCurrencyReport(value) {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

const chartData = {
    data: {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
        datasets: [
            {
                label: 'Doanh thu theo tháng',
                data: [2e6, 1e6, 3.5e6, 6e6, 7.5e6, 1.5e6],
                borderColor: '#42a5f5',
                backgroundColor: 'rgba(66,165,245,0.3)',
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 6
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) =>
                        formatCurrencyReport(context.raw || 0)
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: (value) => value / 1e6 + 'M'
                }
            }
        }
    }
}

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
th {
    font-size: 14px;
    font-weight: normal;
}

.small-text {
    font-size: 11px;
    white-space: nowrap; /* Để văn bản không bị xuống dòng */
    overflow: hidden; /* Ẩn phần văn bản thừa */
    text-overflow: ellipsis; /* Thêm dấu "..." nếu văn bản quá dài */
    max-width: 200px; /* Giới hạn chiều rộng */
}
</style>
