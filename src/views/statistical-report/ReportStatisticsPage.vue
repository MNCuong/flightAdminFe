<template>
    <v-container>
        <!-- Thống kê tổng quan -->
        <v-row justify="space-between" align="center" no-gutters>
            <v-col cols="12" sm="4" md="3" class="d-flex flex-column align-center pa-3">
                <v-icon class="mb-2" color="blue">mdi-transaction</v-icon>
                <h4 class="text-h6 font-weight-medium">{{ $t('stats.totalBookings') }}</h4>
                <p class="text-info text-h4">{{ stats.totalBookings }}</p>
            </v-col>

            <v-col cols="12" sm="4" md="3" class="d-flex flex-column align-center pa-3">
                <v-icon class="mb-2" color="green">mdi-account-group</v-icon>
                <h4 class="text-h6 font-weight-medium">{{ $t('stats.totalCustomers') }}</h4>
                <p class="text-success text-h4">{{ stats.totalCustomers }}</p>
            </v-col>

            <v-col cols="12" sm="4" md="3" class="d-flex flex-column align-center pa-3">
                <v-icon class="mb-2" color="purple">mdi-calendar-month</v-icon>
                <h4 class="text-h6 font-weight-medium">{{ $t('stats.monthlyBookings') }}</h4>
                <p class="text-warning text-h4">{{ stats.totalBookingCustomers }}</p>
            </v-col>

            <v-col cols="12" sm="4" md="3" class="d-flex flex-column align-center pa-3">
                <v-icon class="mb-2" color="red">mdi-currency-vnd</v-icon>
                <h4 class="text-h6 font-weight-medium">{{ $t('stats.dailyRevenue') }}</h4>
                <p class="text-danger text-h4">{{ formatCurrency(stats.totalRevenue) }}</p>
            </v-col>
        </v-row>

        <hr class="my-4" />

        <!-- Tìm kiếm và Xuất Excel -->
        <v-row class="mb-4" align="center" justify="space-between">
            <v-col cols="8">
                <v-text-field
                    v-model="searchQuery"
                    :label="$t('search.transactionNo')"
                    outlined
                    clearable
                    hide-details="auto"
                    @keyup.enter="fetchBookings"
                />
            </v-col>
            <v-col cols="4">
                <v-btn color="success" @click="handleExport">{{ $t('buttons.exportExcel') }}</v-btn>
            </v-col>
        </v-row>

        <!-- Bảng danh sách booking -->
        <v-table>
            <thead>
            <tr>
                <th>STT</th>
                <th>{{ $t('booking.transactionNo') }}</th>
                <th>{{ $t('booking.customerName') }}</th>
                <th>{{ $t('booking.bookingDate') }}</th>
                <th>{{ $t('booking.price') }}</th>
                <th>{{ $t('booking.note') }}</th>
                <th>{{ $t('booking.status') }}</th>
                <th>{{ $t('booking.actions') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="!bookings.length && !isLoading">
                <td colspan="8">{{ $t('booking.noData') }}</td>
            </tr>
            <tr v-for="(booking, index) in bookings" :key="booking.id">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>{{ booking.transactionNo }}</td>
                <td>{{ booking.user.fullName }}</td>
                <td>{{ formatDate(booking.transactionDate) }}</td>
                <td>{{ formatCurrency(booking.amount) }}</td>
                <td class="small-text">{{ booking.description }}</td>
                <td class="small-text">{{ booking.status }}</td>
                <td>
                    <v-btn color="primary" class="mr-2" @click="paymentDetail(booking)">{{ $t('buttons.detail') }}</v-btn>
                </td>
            </tr>
            </tbody>
        </v-table>

        <!-- Phân trang -->
        <v-pagination
            v-model="currentPage"
            :length="pageCount"
            :total-visible="5"
            @input="fetchBookings"
        />

        <hr class="my-4" />

        <!-- Biểu đồ thống kê -->
        <v-card class="pa-4">
            <v-row align="center" justify="space-between" class="mb-4">
                <v-col cols="6" md="3">
                    <v-select
                        v-model="selectedPeriodType"
                        :items="periodTypes"
                        :label="$t('chart.selectPeriod')"
                        @change="fetchRevenueData"
                    />
                </v-col>
                <v-col cols="6" md="3">
                    <v-text-field
                        v-model="selectedYear"
                        :label="$t('chart.selectYear')"
                        type="number"
                        @change="fetchRevenueData"
                    />
                </v-col>
                <v-col cols="6" md="3" v-if="selectedPeriodType !== 'quarterly'">
                    <v-text-field
                        v-model="selectedMonth"
                        :label="$t('chart.selectMonth')"
                        type="number"
                        min="1"
                        max="12"
                        v-if="selectedPeriodType === 'daily'"
                        @change="fetchRevenueData"
                    />
                </v-col>
                <v-col cols="6" md="3" v-if="selectedPeriodType === 'quarterly'">
                    <v-text-field
                        v-model="selectedQuarter"
                        :label="$t('chart.selectQuarter')"
                        type="number"
                        min="1"
                        max="4"
                        @change="fetchRevenueData"
                    />
                </v-col>
            </v-row>

            <Chart :data="chartData.data" :options="chartData.options" />
        </v-card>
    </v-container>
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
const searchQuery = ref('');
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
                    size: pageSize.value,
                    searchQuery: searchQuery.value
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

onMounted(() => {
    fetchBookings();
    fetchCustomer();
    fetchRevenueData();
});

watch(currentPage, fetchBookings);


function formatCurrencyReport(value) {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

const selectedPeriodType = ref("monthly");
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);
const selectedQuarter = ref(1);

const fetchRevenueData = async () => {
    try {
        let response;
        if (selectedPeriodType.value === "monthly") {
            response = await axios.get('/payment/revenue/monthly', {
                params: { year: selectedYear.value }
            });
            updateChartData(response.data, "monthly");
        } else if (selectedPeriodType.value === "daily") {
            response = await axios.get('/payment/revenue/daily', {
                params: { month: selectedMonth.value, year: selectedYear.value }
            });
            updateChartData(response.data, "daily");
        } else if (selectedPeriodType.value === "quarterly") {
            response = await axios.get('/payment/revenue/quarter', {
                params: { quarter: selectedQuarter.value, year: selectedYear.value }
            });
            updateChartData(response.data, "quarterly");
        }
    } catch (error) {
        console.error('Lỗi khi lấy doanh thu:', error);
    }
};

const updateChartData = (revenueData, periodType) => {
    if (periodType === "monthly") {
        chartData.value.data.labels = Object.keys(revenueData);
        chartData.value.data.datasets[0].data = Object.values(revenueData);
    } else if (periodType === "daily") {
        chartData.value.data.labels = Object.keys(revenueData);
        chartData.value.data.datasets[0].data = Object.values(revenueData);
    } else if (periodType === "quarterly") {
        chartData.value.data.labels = Object.keys(revenueData);
        chartData.value.data.datasets[0].data = Object.values(revenueData);     }
};
const chartData = ref({
    data: {
        labels: [],
        datasets: [
            {
                label: 'Doanh thu',
                data: [],
                borderColor: '#42a5f5',
                backgroundColor: 'rgba(66,165,245,0.3)',
                tension: 0.4,
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => formatCurrencyReport(context.raw || 0)
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
});

onMounted(async () => {
    fetchRevenueData();

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
