<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../services/api';

const route = useRoute();
const router = useRouter();
const booking = ref(null);
const formattedPrice = computed(() => {
    return booking.value ? booking.value.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '';
});
const formattedBookingDate = computed(() => {
    return booking.value ? new Date(booking.value.createdAt).toLocaleDateString() : '';
});
// const formattedBookingDate = computed(() => {
//     return booking.value ? new Date(booking.value.createdAt).toLocaleDateString() : ''
// })
const fetchBookingDetail = async () => {
    try {
        const response = await axios.get(`/booking-flight/booking-detail/${route.params.id}`);
        booking.value = response.data.data;
    } catch (error) {
        console.error('Lỗi khi tải chi tiết đặt vé:', error);
    }
};

const goBack = () => {
    router.push({ name: 'BookingPage' });
};

onMounted(fetchBookingDetail);
</script>

<template>
    <div class="container mt-4">
        <div v-if="booking" class="card p-4 shadow">
            <v-row>
                <v-col cols="12" sm="4">
                    <v-text-field v-model="booking.id" label="Mã đặt vé" disabled />
                    <v-text-field v-model="booking.customerName" label="Hành khách" disabled />
                    <v-text-field v-model="booking.personalCode" label="Mã cá nhân" disabled />
                    <v-text-field v-model="booking.seatNumber" label="Số ghế" disabled />
                    <v-text-field v-model="booking.ticketType" label="Loại vé" disabled />
                    <v-text-field v-model="formattedPrice" label="Giá vé (VND)" disabled />
                    <v-text-field v-model="formattedBookingDate" label="Ngày đặt" disabled />
                </v-col>

                <v-col cols="12" sm="4">
                    <v-text-field v-model="booking.user.fullName" label="Họ và tên khách hàng" disabled />
                    <v-text-field v-model="booking.user.email" label="Email" disabled />
                    <v-text-field v-model="booking.user.phone" label="Số điện thoại" disabled />
                    <v-text-field v-model="booking.dateOfBirth" label="Ngày sinh" disabled />
                    <v-text-field v-model="booking.nationality" label="Quốc tịch" disabled />
                </v-col>

                <v-col cols="12" sm="4">
                    <v-text-field v-model="booking.flight.flightDetails.number" label="Số chuyến bay" disabled />
                    <v-text-field v-model="booking.flight.flightDate" label="Ngày giờ bay" disabled />
                    <v-text-field v-model="booking.flight.flightStatus" label="Trạng thái chuyến bay" disabled />

                    <v-text-field v-model="booking.flight.aircraft.registration" label="Phi cơ" disabled />
                    <v-text-field v-model="booking.flight.aircraft.type" label="Loại phi cơ" disabled />
                    <v-text-field v-model="booking.flight.aircraft.seatCapacity" label="Số ghế" disabled />

                    <v-text-field v-model="booking.flight.departure.airport" label="Sân bay đi" disabled />
                    <v-text-field v-model="booking.flight.arrival.airport" label="Sân bay đến" disabled />
                </v-col>
            </v-row>

            <!-- Button quay lại -->
            <div class="text-center mt-4">
                <v-btn color="secondary" @click="goBack">Quay lại</v-btn>
            </div>
        </div>

        <!-- Thông báo đang tải -->
        <div v-else class="text-center text-muted">Đang tải chi tiết...</div>
    </div>
</template>
