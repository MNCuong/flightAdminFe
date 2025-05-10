<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../services/api';
import SuccessModal from '../../components/SuccessModa.vue';
import ErrorModal from '../../components/ErrorModal.vue';

const isLoading = ref(false);
const route = useRoute();
const router = useRouter();
const isSuccessVisible = ref(false);
const isErrorVisible = ref(false);
const errorMessage = ref('');
const flightId = route.params.id;

const flightDetails = ref(null);
const aircraft = ref({
    registration: '',
    status: '',
    type: '',
    seat: 0,
    seatCapacity: 0
});

// Fetch flight details
const fetchFlightDetails = async () => {
    try {
        const response = await axios.get(`/flights/flight/${flightId}`);
        const data = response.data.data;
        flightDetails.value = data;
        if (data.aircraft) {
            aircraft.value = { ...data.aircraft };
        }
    } catch (error) {
        console.error('Error fetching flight details:', error);
    }
};

const goBack = () => {
    router.push({ name: 'FlightList' });
};

const updateFlightDetails = async () => {
    isLoading.value = true;
    try {
        const updatedData = {
            id: flightDetails.value.id,
            departureTime: flightDetails.value.departureTime,
            arrivalTime: flightDetails.value.arrivalTime,
            priceEconomy: flightDetails.value.priceEconomy,
            priceBusiness: flightDetails.value.priceBusiness,
            aircraft: {
                registration: aircraft.value.registration,
                status: aircraft.value.status,
                type: aircraft.value.type,
                seat: aircraft.value.seat
            }
        };

        const response = await axios.put(`/flights/flight/${flightId}`, updatedData);

        if (response.status === 200) {
            isSuccessVisible.value = true;
            errorMessage.value = '';
        } else {
            throw new Error(response.data.message || 'Có lỗi xảy ra khi cập nhật phi cơ.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        isErrorVisible.value = true;
        errorMessage.value = error.message || 'Không thể cập nhật phi cơ. Vui lòng thử lại sau!';
    } finally {
        isLoading.value = false; // Reset loading state
    }
};

const closeSuccessModal = () => {
    isSuccessVisible.value = false;
};

const closeErrorModal = () => {
    isErrorVisible.value = false;
};

onMounted(fetchFlightDetails);
</script>
<template>
    <div v-if="flightDetails" class="flight-details-section">
        <h3><strong>Thông tin chi tiết chuyến bay</strong></h3>
        <v-divider class="my-4" />

        <v-row>
            <v-col cols="12" sm="6">
                <v-text-field v-model="aircraft.registration" label="Mã đăng ký" disabled />
                <v-text-field v-model="flightDetails.id" label="ID chuyến bay" />
                <v-text-field v-model="flightDetails.departureTime" label="Giờ khởi hành" />
                <v-text-field v-model="flightDetails.arrivalTime" label="Giờ đến" />
                <v-text-field v-model="flightDetails.priceEconomy" label="Giá Economy" />
                <v-text-field v-model="flightDetails.priceBusiness" label="Giá Business" />
            </v-col>

            <v-col cols="12" sm="6">
                <v-text-field v-model="aircraft.iata" label="IATA" />
                <v-text-field v-model="aircraft.status" label="Trạng thái" />
                <v-text-field v-model="aircraft.type" label="Loại phi cơ" />
                <v-text-field v-model="aircraft.seat" label="Số chỗ ngồi" />
            </v-col>
        </v-row>
        <v-row class="mt-4" justify="end">
            <v-col cols="auto">
                <v-btn color="primary" :loading="isLoading" @click="updateFlightDetails"> Cập nhật</v-btn>
                <v-btn color="grey" class="ml-2" @click="goBack"> Quay lại</v-btn>
            </v-col>
        </v-row>

        <!-- Modal thông báo thành công -->
        <success-modal :visible="isSuccessVisible" :message="'Cập nhật thành công!'" @close="closeSuccessModal" />

        <!-- Modal thông báo thất bại -->
        <error-modal :visible="isErrorVisible" :message="'Cập nhật thất bại'" @close="closeErrorModal" />
    </div>
</template>
