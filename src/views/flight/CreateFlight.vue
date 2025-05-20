<template>
    <v-container>
        <v-form v-model="isFormValid" @submit.prevent="createFlight">
            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field v-model="flightCode" :label="$t('flightCode')" required></v-text-field>

                    <v-select
                        :items="flightStatuses"
                        v-model="status"
                        :label="$t('status')"
                        item-title="label"
                        item-value="value"
                        required
                    ></v-select>

                    <v-select
                        :items="airports"
                        v-model="departureAirportId"
                        :label="$t('departureAirport')"
                        item-title="airport"
                        item-value="id"
                        required
                    ></v-select>

                    <v-select
                        :items="airports"
                        v-model="arrivalAirportId"
                        :label="$t('arrivalAirport')"
                        item-title="airport"
                        item-value="id"
                        required
                    ></v-select>

                    <v-text-field v-model="departureTime" :label="$t('departureTime')" type="datetime-local" required />
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="arrivalTime" :label="$t('arrivalTime')" type="datetime-local" required />

                    <v-select
                        v-if="aircrafts.length > 0"
                        :items="aircrafts"
                        v-model="aircraftRegistration"
                        :label="$t('aircraft')"
                        item-title="registration"
                        item-value="registration"
                        required
                    />
                    <v-text-field v-model="priceEconomy" :label="$t('priceEconomy')" required></v-text-field>

                    <v-text-field v-model="priceBusiness" :label="$t('priceBusiness')" required></v-text-field>
                    <v-text-field v-model="departureGate" :label="$t('departureGate')" required></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="arrivalGate" :label="$t('arrivalGate')" required></v-text-field>
                    <v-text-field v-model="checkInDeadline" :label="$t('checkInDeadline')" type="datetime-local" required />
                    <v-text-field v-model="boardingTime" :label="$t('boardingTime')" type="datetime-local" required />
                    <v-select
                        :items="airlines"
                        v-model="airlinesId"
                        :label="$t('airline')"
                        item-title="name"
                        item-value="id"
                        required
                    ></v-select>
                    <v-text-field v-model="seats" :label="$t('seats')" type="number" required />
                </v-col>
            </v-row>

            <v-btn :disabled="!isFormValid" type="submit" color="primary">{{ $t('createFlight') }}</v-btn>
            <v-btn @click="$router.push('/flights')" color="white">{{ $t('goBack') }}</v-btn>
        </v-form>

        <!-- Modal thông báo thành công -->
        <success-modal
            :visible="isSuccessVisible"
            :message="$t('successMessage')"
            @close="closeSuccessModal"
        />

        <!-- Modal thông báo thất bại -->
        <error-modal :visible="isErrorVisible" :message="errorMessage" @close="closeErrorModal" />
    </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from '@/services/api';
import SuccessModal from '@/components/SuccessModa.vue';
import ErrorModal from '@/components/ErrorModal.vue';
import { useRouter } from 'vue-router';

const flightCode = ref('');
const status = ref('');
const seats = ref('');
const departureTime = ref('');
const arrivalTime = ref('');
const departureAirportId = ref(null);
const arrivalAirportId = ref(null);
const aircraftRegistration = ref(null);
const airlinesId = ref(null);
const priceEconomy = ref(null);
const priceBusiness = ref(null);
const departureGate = ref(null);
const checkInDeadline = ref(null);
const boardingTime = ref(null);
const arrivalGate = ref(null);
const isSuccessVisible = ref(false);
const isErrorVisible = ref(false);
const errorMessage = ref('');
const airports = ref([]);
const airlines = ref([]);
const aircrafts = ref([]);
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
const router = useRouter();

const isFormValid = ref(false);
const closeSuccessModal = () => {
    isSuccessVisible.value = false;
    router.push({ name: 'FlightList' });
};

const closeErrorModal = () => {
    isErrorVisible.value = false;
};
const fetchAirports = async () => {
    try {
        const response = await axios.get('/airport-info/list');
        airports.value = response.data.data;
    } catch (error) {
        console.error('Failed to load airports:', error);
    }
};
const fetchAirlines = async () => {
    try {
        const response = await axios.get('/airlines/list');
        airlines.value = response.data.data;
        console.log('data: ', response.data.data);
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

const createFlight = async () => {
    try {
        const payload = {
            flightCode: flightCode.value,
            status: status.value,
            departureTime: departureTime.value,
            arrivalTime: arrivalTime.value,
            departureAirportId: departureAirportId.value,
            arrivalAirportId: arrivalAirportId.value,
            aircraftRegistration: aircraftRegistration.value,
            arrivalGate: arrivalGate.value,
            departureGate: departureGate.value,
            checkInDeadline: checkInDeadline.value,
            boardingTime: boardingTime.value,
            priceEconomy: priceEconomy.value,
            priceBusiness: priceBusiness.value,
            airlineId: airlinesId.value,
            seats: seats.value
        };
        console.log('payload', payload);
        const response = await axios.post('/flights/create', payload);
        console.log('response', response.data.data);

        if (response.data.code === '200') {
            isSuccessVisible.value = true;
        } else {
            isErrorVisible.value = true;
            errorMessage.value = response.data.message || 'Lỗi khi thêm chuyến bay';
        }
    } catch (error) {
        isErrorVisible.value = true;
        errorMessage.value = 'Lỗi khi thêm chuyến bay';
        console.error('Failed to create flight:', error);
    }
};
onMounted(() => {
    fetchAirports();
    fetchAircrafts();
    fetchAirlines();
});

// fetchAirports();
// fetchAircrafts();
</script>

<style scoped></style>
