<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../services/api';

const route = useRoute();
const router = useRouter();

const flightId = route.params.id;

const flightCode = ref('');
const planeNumber = ref('');
const departureDate = ref('');
const seats = ref('');
const flightDetails = ref(null);
const aircraft = ref(null);
const airline = ref(null);

// Fetch flight details
const fetchFlightDetails = async () => {
    try {
        const response = await axios.get(`/flights/flight/${flightId}`);
        const data = response.data.data;

        flightDetails.value = data;
        aircraft.value = data.aircraft;
        airline.value = data.aircraft.airlines;

        flightCode.value = data.aircraft.registration;
        planeNumber.value = data.aircraft.iata;
        departureDate.value = ''; // Không có ngày trong dữ liệu trả về
        seats.value = data.aircraft.seatCapacity;
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

        // TODO: API cập nhật (axios.put...) nếu cần

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
    <div v-if="flightDetails" class="container mt-4">
      <div class="card shadow p-4">
        <h3 class="text-center text-success mb-4">Chi tiết chuyến bay</h3>
  
        <div class="row">
          <!-- Cột trái: Thông tin chuyến bay -->
          <div class="col-md-6">
            <h5 class="section-title">Thông tin chuyến bay</h5>
            <ul class="list-unstyled">
              <li><strong>Mã chuyến bay:</strong> {{ flightDetails.flightDetails?.number }}</li>
              <li><strong>Điểm khởi hành:</strong> {{ flightDetails.departureAirport?.airport }}</li>
              <li><strong>Cổng đi:</strong> {{ flightDetails.departureAirport?.gate }}</li>
              <li><strong>Điểm đến:</strong> {{ flightDetails.arrivalAirport?.airport }}</li>
              <li><strong>Cổng đến:</strong> {{ flightDetails.arrivalAirport?.gate }}</li>
              <li><strong>Giá vé (Economy):</strong> {{ flightDetails.priceEconomy.toLocaleString() }} VND</li>
              <li><strong>Giá vé (Business):</strong> {{ flightDetails.priceBusiness.toLocaleString() }} VND</li>
            </ul>
          </div>
  
          <!-- Cột phải: Thông tin phi cơ -->
          <div class="col-md-6">
            <h5 class="section-title">Thông tin phi cơ</h5>
            <ul class="list-unstyled">
              <li><strong>Loại phi cơ:</strong> {{ aircraft?.type }}</li>
              <li><strong>Mã đăng ký:</strong> {{ aircraft?.registration }}</li>
              <li><strong>Số chỗ ngồi:</strong> {{ aircraft?.seatCapacity }}</li>
              <li>
                <strong>Trạng thái:</strong>
                <span
                  class="badge"
                  :class="aircraft?.status === 'IN_SERVICE' ? 'bg-success' : 'bg-danger'"
                >
                  {{ aircraft?.status }}
                </span>
              </li>
              <li><strong>Hãng hàng không:</strong> {{ airline?.name }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  

<style scoped>
.container {
    max-width: 960px;
    margin: auto;
}



.card p {
    font-size: 16px;
    color: #333;
}

button {
    width: 48%;
}

button:hover {
    transition: background-color 0.3s ease;
}
h5 {
    font-weight: bold;
    border-left: 4px solid #007bff;
    padding-left: 10px;
}

.card p {
    margin-bottom: 0.75rem;
}
.section-title {
  font-size: 18px;
  font-weight: 600;
  border-left: 4px solid #007bff;
  padding-left: 10px;
  margin-bottom: 15px;
  color: #007bff;
}

.card {
  border-radius: 12px;
  background-color: #ffffff;
}

ul li {
  margin-bottom: 10px;
  font-size: 16px;
}

.badge {
  font-size: 13px;
  padding: 5px 10px;
  border-radius: 12px;
}

</style>
