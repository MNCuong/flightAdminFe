<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const flightCode = ref('');
const planeNumber = ref('');
const departureDate = ref('');
const seats = ref('');
const router = useRouter();

onMounted(() => {
    const flightId = route.params.id;
    console.log('Sửa chuyến bay có ID:', flightId);

    const flightData = flights.value.find((flight) => flight.id === parseInt(flightId));

    if (flightData) {
        flightCode.value = flightData.code;
        planeNumber.value = flightData.planeNumber;
        departureDate.value = flightData.departureDate;
        seats.value = flightData.seats;
    }
});

function submitForm() {
    console.log('Cập nhật chuyến bay:', {
        flightCode: flightCode.value,
        planeNumber: planeNumber.value,
        departureDate: departureDate.value,
        seats: seats.value
    });

    function goBack() {
        router.push({ name: 'FlightList' });
    }
}
</script>

<template>
    <div>
        <h1 class="text-h4 mb-4 font-weight-bold">Sửa chuyến bay</h1>
        <v-card class="white pa-4" flat>
            <v-form>
                <v-text-field v-model="flightCode" label="Mã chuyến bay" required />
                <v-text-field v-model="planeNumber" label="Số hiệu phi cơ" required />
                <v-text-field v-model="departureDate" label="Ngày khởi hành" type="date" required />
                <v-text-field v-model="seats" label="Số chỗ ngồi" type="number" required />

                <v-row class="mt-4" justify="end" align="center">
                    <v-col cols="auto" class="d-flex justify-end">
                        <!-- Update Flight Button -->
                        <v-btn color="primary" @click="submitForm" class="mr-2">Cập nhật chuyến bay</v-btn>
                        <!-- Back Button -->
                        <v-btn color="danger" @click="goBack">Quay lại</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>
    </div>
</template>
