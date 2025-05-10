<template>
    <v-container>
        <loading-modal :visible="isLoading" />
        <v-row class="mb-4" align="center" justify="space-between">
            <v-col cols="2">
                <v-btn color="primary" @click="addFlight">Tạo chuyến bay mới</v-btn>
            </v-col>
            <v-col cols="2">
                <v-btn color="success" @click="handleExport">Xuất Excel</v-btn>
            </v-col>
            <v-col cols="8">
                <v-text-field v-model="searchQuery" label="Tìm kiếm chuyến bay" outlined clearable hide-details="auto" />
            </v-col>
        </v-row>
        <v-table>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Mã Chuyến Bay</th>
                    <th>Sân Bay Khởi Hành</th>
                    <th>Sân Bay Đến</th>
                    <th>Giờ Khởi Hành</th>
                    <th>Giờ Đến</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!flights.length && !isLoading">
                    <td colspan="3">Không có dữ liệu</td>
                </tr>
                <tr v-for="(flight, index) in flights" :key="flight?.id">
                    <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                    <td>{{ flight?.flightDetails?.number || 'N/A' }}</td>
                    <td class="airport-column">{{ flight?.departureAirport?.airport || 'N/A' }}</td>
                    <td class="airport-column">{{ flight?.arrivalAirport?.airport || 'N/A' }}</td>
                    <td>{{ flight?.departureTime }}</td>
                    <td>{{ flight?.arrivalTime }}</td>
                    <td>
                        <v-btn color="primary" @click="goToDetails(flight?.id)">Chi Tiết</v-btn>
                        <v-btn color="error" @click="openConfirmDeleteModal(flight?.id)">Xóa</v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <!-- Modal xác nhận xóa -->
        <confirm-delete-modal :visible="isModalVisible" :flightId="selectedFlightId" @confirm="deleteFlight" @close="closeModal" />

        <!-- Modal thông báo thành công -->
        <success-modal :visible="isSuccessVisible" :message="'Chuyến bay đã được xóa thành công!'" @close="closeSuccessModal" />

        <!-- Modal thông báo thất bại -->
        <error-modal :visible="isErrorVisible" :message="errorMessage" @close="closeErrorModal" />

        <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" />
    </v-container>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import axios from '../../services/api';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal.vue';
import SuccessModal from '../../components/SuccessModa.vue';
import ErrorModal from '../../components/ErrorModal.vue';
import LoadingModal from '@/components/LoadingModal.vue';
import { useRouter } from 'vue-router';
import { exportToExcel } from '@/services/ExportService';

export default {
    components: {
        ConfirmDeleteModal,
        SuccessModal,
        ErrorModal,
        LoadingModal
    },

    setup() {
        const currentPage = ref(1);
        const pageSize = ref(5);
        const flights = ref([]);
        const totalPages = ref(1);
        const isModalVisible = ref(false);
        const selectedFlightId = ref(null);
        const router = useRouter();

        const isSuccessVisible = ref(false);
        const isErrorVisible = ref(false);
        const errorMessage = ref('');
        const isLoading = ref(false);
        const addFlight = () => {
            router.push({ name: 'CreateFlight' });
        };
        const goToDetails = (flightId) => {
            if (!flightId) return;
            router.push({ name: 'FlightDetail', params: { id: flightId } });
        };
        // Lấy dữ liệu chuyến bay từ API
        const fetchFlights = async () => {
            isLoading.value = true;

            try {
                const response = await axios.get('/flights/all-flight', {
                    params: {
                        page: currentPage.value - 1, // API sử dụng chỉ số trang bắt đầu từ 0
                        size: pageSize.value
                    }
                });

                const data = response.data.data;
                flights.value = data.content || []; // Lưu trữ chuyến bay
                totalPages.value = data.totalPages || 1; // Lưu tổng số trang
            } catch (error) {
                console.error('Error fetching flight data:', error);
            } finally {
                isLoading.value = false;
            }
        };
        // Hàm xuất Excel
        const handleExport = () => {
            console.log('Nút xuất đã được bấm');

            if (!flights.value.length) {
                alert('Không có dữ liệu để xuất Excel');
                return;
            }

            const formattedData = flights.value.map((flight, index) => ({
                STT: index + 1,
                'Mã Chuyến Bay': flight.flightDetails?.number || 'N/A',
                'Sân Bay Khởi Hành': flight.departureAirport?.airport || 'N/A',
                'Sân Bay Đến': flight.arrivalAirport?.airport || 'N/A',
                'Giờ Khởi Hành': flight.departureTime || 'N/A',
                'Giờ Đến': flight.arrivalTime || 'N/A'
            }));


            exportToExcel(formattedData);
        };
        // Mở Modal xác nhận xóa
        const openConfirmDeleteModal = (flightId) => {
            selectedFlightId.value = flightId;
            isModalVisible.value = true;
        };

        // Đóng Modal
        const closeModal = () => {
            isModalVisible.value = false;
            selectedFlightId.value = null;
        };

        const closeSuccessModal = () => {
            isSuccessVisible.value = false;
        };

        const closeErrorModal = () => {
            isErrorVisible.value = false;
        };

        const deleteFlight = async (flightId) => {
            try {
                const response = await axios.delete(`/flights/${flightId}`);

                if (response.status === 200) {
                    isSuccessVisible.value = true;
                } else {
                    isErrorVisible.value = true;
                }

                fetchFlights();
                closeModal();
            } catch (error) {
                console.error('Error deleting flight:', error);
                errorMessage.value = 'Xóa chuyến bay thất bại!';
                isErrorVisible.value = true;
            }
            isModalVisible.value = false;
        };
        watch(currentPage, () => {
            fetchFlights();
        });
        onMounted(() => {
            fetchFlights();
        });

        return {
            currentPage,
            flights,
            totalPages,
            pageSize,
            fetchFlights,
            isModalVisible,
            selectedFlightId,
            openConfirmDeleteModal,
            closeModal,
            closeSuccessModal,
            closeErrorModal,
            deleteFlight,
            isSuccessVisible,
            isErrorVisible,
            errorMessage,
            isLoading,
            goToDetails,
            addFlight,
            handleExport

        };
    }
};
</script>

<style scoped>
.airport-column {
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
