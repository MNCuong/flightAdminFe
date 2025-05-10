<template>
    <v-container>
        <!-- Modal loading -->
        <loading-modal :visible="isLoading" />
        <v-row class="mb-4" align="center" justify="space-between">


            <v-col cols="8">
                <v-text-field v-model="searchQuery" label="Tìm kiếm" outlined clearable hide-details="auto" />
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
                <th>Tên Khách Hàng</th>
                <th>Số Ghế</th>
                <th>Loại Vé</th>
                <th>Giá</th>
                <th>Chuyến Bay</th>
                <th>Thao tác</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="!bookings.length && !isLoading">
                <td colspan="6">Không có dữ liệu</td>
            </tr>
            <tr v-for="(booking, index) in bookings" :key="booking?.id">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>{{ booking?.transactionId }}</td>
                <td>{{ booking?.customerName }}</td>
                <td>{{ booking?.seatNumber }}</td>
                <td>{{ booking?.ticketType }}</td>
                <td>{{ booking?.price | currency }}</td>
                <td>{{ booking?.flight.flightDetails.number }}</td>
                <td>
                    <v-btn color="primary" class="mr-2" @click="bookingDetail(booking)">
                        Chi tiết
                    </v-btn>
                </td>
            </tr>
            </tbody>
        </v-table>

        <!-- Modal xác nhận xóa -->
        <confirm-delete-modal
            :visible="confirmDelete"
            :flightId="aircraftToDelete?.id"
            @confirm="confirmDeleteAction"
            @close="cancelDelete"
        />

        <!-- Modal thông báo thành công -->
        <success-modal :visible="isSuccessVisible" :message="'Chuyến bay đã được xóa thành công!'" @close="closeSuccessModal" />

        <!-- Modal thông báo thất bại -->
        <error-modal :visible="isErrorVisible" :message="errorMessage" @close="closeErrorModal" />

        <!-- PHÂN TRANG: SỐ TRANG -->
        <v-pagination v-model="currentPage" :length="pageCount" :total-visible="5" />
    </v-container>
</template>


<script>
import axios from '../../services/api';
import LoadingModal from '../../components/LoadingModal.vue';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal.vue';
import SuccessModal from '../../components/SuccessModa.vue';
import ErrorModal from '../../components/ErrorModal.vue';
import { useRouter } from 'vue-router';

export default {
    components: { ErrorModal, SuccessModal, ConfirmDeleteModal, LoadingModal },
    data() {
        return {
            bookings: [],
            currentPage: 1,
            pageSize: 2,
            totalItems: 0,
            isLoading: false,
            isSuccessVisible: false,
            isErrorVisible: false,
            errorMessage: ''
        };
    },

    computed: {
        pageCount() {
            return Math.ceil(this.totalItems / this.pageSize);
        }
    },

    watch: {
        currentPage(newPage) {
            this.fetchBookings();
        }
    },

    methods: {
        bookingDetail(booking) {
            this.$router.push({ name: 'BookingDetail', params: { id: booking.id } });

        },

        fetchBookings() {
            this.isLoading = true;
            axios
                .get('/booking-flight/list-booking', {
                    params: {
                        page: this.currentPage - 1,
                        size: this.pageSize
                    }
                })
                .then((response) => {
                    this.bookings = response.data.data.content;
                    this.totalItems = response.data.data.totalElements;
                })
                .catch((error) => {
                    console.error('Error fetching bookings:', error);
                    this.errorMessage = 'Không thể tải dữ liệu, vui lòng thử lại sau!';
                    this.isErrorVisible = true;                })
                .finally(() => {
                    this.isLoading = false;
                });
        },

        currency(value) {
            if (!value) return '0 đ';
            return value.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
            });
        },

        closeSuccessModal() {
            this.isSuccessVisible = false;
        },

        closeErrorModal() {
            this.isErrorVisible = false;
        }
    },

    created() {
        this.fetchBookings();
    }
};
</script>

<style scoped>
</style>
