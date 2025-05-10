<template>
    <v-container>
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
            <tr v-for="(flight, index) in flights" :key="flight.id">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>{{ flight.flightDetails?.number || 'N/A' }}</td>
                <td class="airport-column">{{ flight.departureAirport?.airport || 'N/A' }}</td>
                <td class="airport-column">{{ flight.arrivalAirport?.airport || 'N/A' }}</td>
                <td>{{ flight.departureTime }}</td>
                <td>{{ flight.arrivalTime }}</td>
                <td>
                    <v-btn color="primary" @click="goToDetails(flight.id)">Chi Tiết</v-btn>
                    <v-btn color="error" @click="openConfirmDeleteModal(flight.id)">Xóa</v-btn>
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

        <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" @input="fetchFlights" />
    </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from '../../services/api';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal.vue';
import SuccessModal from '../../components/SuccessModa.vue';
import ErrorModal from '../../components/ErrorModal.vue';

export default {
    components: {
        ConfirmDeleteModal,
        SuccessModal,
        ErrorModal
    },
    setup() {
        const currentPage = ref(1); // Trang hiện tại
        const pageSize = ref(10); // Số lượng chuyến bay mỗi trang
        const flights = ref([]); // Mảng chuyến bay
        const totalPages = ref(1); // Tổng số trang
        const isModalVisible = ref(false); // Trạng thái hiển thị Modal
        const selectedFlightId = ref(null); // ID chuyến bay được chọn để xóa

        const isSuccessVisible = ref(false); // Trạng thái hiển thị modal thành công
        const isErrorVisible = ref(false); // Trạng thái hiển thị modal lỗi
        const errorMessage = ref(''); // Lỗi khi xóa chuyến bay

        // Lấy dữ liệu chuyến bay từ API
        const fetchFlights = async () => {
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
            }
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
            errorMessage
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
