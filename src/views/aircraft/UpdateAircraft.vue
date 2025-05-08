<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../services/api';

const route = useRoute();
const flightCode = ref('');
const planeNumber = ref('');
const departureDate = ref('');
const seats = ref('');
const flightDetails = ref(null);
const router = useRouter();

const flightId = route.params.id;

// Fetch flight details
const fetchFlightDetails = async () => {
    try {
        const response = await axios.get(`/flight/aircraft/get-aircraft/${flightId}`);
        flightDetails.value = response.data.data;
        flightCode.value = flightDetails.value.registration;
        planeNumber.value = flightDetails.value.iata;
        departureDate.value = '';
        seats.value = flightDetails.value.seatCapacity;
    } catch (error) {
        console.error('Error fetching flight details:', error);
    }
};

onMounted(fetchFlightDetails);

// Handle form submission
const submitForm = async () => {
    try {
        console.log('Updating flight:', {
            flightCode: flightCode.value,
            planeNumber: planeNumber.value,
            departureDate: departureDate.value,
            seats: seats.value,
        });

        // API call to update flight details here
        // Example: await axios.put('/update-flight', { data });

        goBack();
    } catch (error) {
        console.error('Error submitting form:', error);
    }
};

// Go back to the flight list
const goBack = () => {
    router.push({ name: 'FlightList' });
};
</script>

<template>
  <div class="update-flight-container">
    <h1 class="text-h4 mb-4 font-weight-bold text-center">Sửa phi cơ</h1>
    <v-card class="white pa-4" flat>
      <v-form>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="flightCode" label="Mã chuyến bay" required disabled />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="planeNumber" label="Số hiệu phi cơ" required disabled />
          </v-col>
        </v-row>
        
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="departureDate" label="Ngày khởi hành" type="date" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="seats" label="Số chỗ ngồi" type="number" required />
          </v-col>
        </v-row>

        <v-row class="mt-4" justify="end" align="center">
          <v-col cols="auto" class="d-flex justify-end">
            <v-btn color="primary" @click="submitForm" class="mr-2">Cập nhật phi cơ</v-btn>
            <v-btn color="grey" @click="goBack">Quay lại</v-btn>
          </v-col>
        </v-row>
      </v-form>

      <!-- Flight Details Section -->
      <div v-if="flightDetails" class="flight-details-section">
        <v-divider class="my-4" />
        <v-row>
          <v-col cols="12" sm="6">
            <p><strong>Mã chuyến bay:</strong> {{ flightDetails.registration }}</p>
            <p><strong>Số hiệu phi cơ:</strong> {{ flightDetails.iata }}</p>
            <p><strong>Số hiệu ICAO:</strong> {{ flightDetails.icao }}</p>
          </v-col>
          <v-col cols="12" sm="6">
            <p><strong>Loại phi cơ:</strong> {{ flightDetails.type }}</p>
            <p><strong>Hãng hàng không:</strong> {{ flightDetails.airlines.name }}</p>
            <p><strong>Số chỗ ngồi:</strong> {{ flightDetails.seatCapacity }}</p>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.update-flight-container {
  max-width: 800px;
  margin: 0 auto;
}

.flight-details-section {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

.v-card {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.v-btn {
  font-weight: bold;
}

.v-divider {
  margin-top: 20px;
}

h1 {
  color: #0077b6;
}
</style>
