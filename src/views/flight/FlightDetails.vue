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
const departureAirportId = ref(null);
const arrivalAirportId = ref(null);
const airports = ref([]);
const aircrafts = ref([]);
const flightDetails = ref(null);

const flightStatuses = ref([
    { label: 'Đã lên lịch', value: 'SCHEDULED' },
    { label: 'Đang lên máy bay', value: 'BOARDING' },
    { label: 'Đã khởi hành', value: 'DEPARTED' },
    { label: 'Bị hoãn', value: 'DELAYED' },
    { label: 'Đang bay', value: 'IN_AIR' },
    { label: 'Đã hạ cánh', value: 'LANDED' },
    { label: 'Đã hủy', value: 'CANCELLED' },
    { label: 'Đã chuyển hướng', value: 'REDIRECTED' }
]);

function getFlightStatusLabel(status) {
    const match = flightStatuses.value.find((s) => s.value === status);
    return match ? match.label : 'Không xác định';
}

const fetchFlightDetails = async () => {
    try {
        const response = await axios.get(`/flights/flight/${flightId}`);
        const data = response.data.data;
        flightDetails.value = data;
    } catch (error) {
        console.error('Error fetching flight details:', error);
    }
};

const goBack = () => {
    router.push({ name: 'FlightList' });
};
const fetchAirports = async () => {
    try {
        const response = await axios.get('/airport-info/list');
        airports.value = response.data.data;
    } catch (error) {
        console.error('Failed to load airports:', error);
    }
};
const fetchAircrafts = async () => {
    try {
        const response = await axios.get('/flight/aircraft/available-aircraft');
        aircrafts.value = response.data.data;
    } catch (error) {
        console.error('Failed to load aircrafts:', error);
    }
};
const updateFlightDetails = async () => {
    isLoading.value = true;
    try {
        const payload = {
            flightCode: flightDetails.value.flightCode,
            departureTime: flightDetails.value.departureTime,
            arrivalTime: flightDetails.value.arrivalTime,
            departureAirportId: 1,
            arrivalAirportId: 1,
            aircraftRegistration: flightDetails.value.aircraft,
            status: flightDetails.value.status,
            priceEconomy: flightDetails.value.priceEconomy,
            priceBusiness: flightDetails.value.priceBusiness,
            departureGate: flightDetails.value.departureGate,
            arrivalGate: flightDetails.value.arrivalGate,
            checkInDeadline: flightDetails.value.checkInDeadline,
            boardingTime: flightDetails.value.boardingTime,
            statusReason: flightDetails.value.statusReason,
            seats: flightDetails.value.seats
        };
        console.log('payload: ', payload);
        const response = await axios.put(`/flights/update-flight/${flightId}`, payload);
        console.log('response: ', response.data.data);

        if (response.status === 200) {
            isSuccessVisible.value = true;
            errorMessage.value = '';
        } else {
            isErrorVisible.value = true;
            errorMessage.value = response.data.message || 'Không thể cập nhật phi cơ. Vui lòng thử lại sau!';
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
    router.push({ name: 'FlightList' });
};

const closeErrorModal = () => {
    isErrorVisible.value = false;
};
const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
};

onMounted(() => {
    fetchAirports();
    fetchAircrafts();
    fetchFlightDetails();
    // if (flightDetails.value.createAt) {
    //     flightDetails.value.createAt = formatDate(flightDetails.value.createAt);
    // }
    // if (flightDetails.value.updateAt) {
    //     flightDetails.value.updateAt = formatDate(flightDetails.value.updateAt);
    // }
});
</script>
<template>
    <div v-if="flightDetails" class="flight-details-section">
        <v-row>
            <v-col cols="12" sm="4">
                <v-text-field v-model="flightDetails.flightCode" :label="$t('flightCode')" disabled />
                <v-text-field v-model="flightDetails.departureTime" type="datetime-local" :label="$t('departureTime')" />
                <v-text-field v-model="flightDetails.arrivalTime" type="datetime-local" :label="$t('arrivalTime')" />
                <v-text-field
                    v-model="flightDetails.priceEconomy"
                    type="number"
                    :label="$t('priceEconomy')"
                    :rules="[(value) => !isNaN(value) || $t('invalidPrice')]"
                />
                <v-text-field
                    v-model="flightDetails.priceBusiness"
                    type="number"
                    :label="$t('priceBusiness')"
                    :rules="[(value) => !isNaN(value) || $t('invalidPrice')]"
                />
                <v-text-field v-model="flightDetails.departureAirport" :label="$t('departureAirport')" disabled />
            </v-col>

            <v-col cols="12" sm="4">
                <v-text-field v-model="flightDetails.arrivalAirport" :label="$t('arrivalAirport')" disabled />
                <v-text-field :model-value="getFlightStatusLabel(flightDetails.status)" :label="$t('flightStatus')" disabled />
                <v-text-field v-model="flightDetails.departureGate" :label="$t('departureGate')" />
                <v-text-field v-model="flightDetails.arrivalGate" :label="$t('arrivalGate')" />
                <v-text-field v-model="flightDetails.aircraft" :label="$t('aircraft')" disabled />
                <v-text-field v-model="flightDetails.checkInDeadline" type="datetime-local" :label="$t('checkInDeadline')" />
            </v-col>

            <v-col cols="12" sm="4">
                <v-text-field v-model="flightDetails.boardingTime" type="datetime-local" :label="$t('boardingTime')" />
                <v-text-field v-model="flightDetails.createAt" type="datetime-local" :label="$t('createdAt')" disabled />
                <v-text-field v-model="flightDetails.updateAt" type="datetime-local" :label="$t('updatedAt')" disabled />
                <v-text-field v-model="flightDetails.seats" :label="$t('seats')" disabled />
                <v-text-field v-model="flightDetails.airlineName" :label="$t('airlineName')" disabled />
            </v-col>
        </v-row>

        <v-row class="mt-4" justify="end">
            <v-col cols="auto">
                <v-btn color="primary" :loading="isLoading" @click="updateFlightDetails">{{ $t('update') }}</v-btn>
                <v-btn color="grey" class="ml-2" @click="goBack">{{ $t('goBack') }}</v-btn>
            </v-col>
        </v-row>

        <!-- Modal thông báo thành công -->
        <success-modal :visible="isSuccessVisible" :message="$t('updateSuccess')" @close="closeSuccessModal" />

        <!-- Modal thông báo thất bại -->
        <error-modal :visible="isErrorVisible" :message="$t('updateFail')" @close="closeErrorModal" />
    </div>
</template>
