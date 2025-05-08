<script setup>
import { ref, computed, onMounted } from 'vue';
import UiChildCard from '@/components/shared/UiChildCard.vue';
import axios from '../../services/api';
import { useRouter } from 'vue-router';

const router = useRouter();

const flights = ref([]);
const currentPage = ref(1);
const pageSize = 3;
const totalItems = ref(0);

const fetchFlights = async () => {
    try {
        const response = await axios.get('/flights/all-flight', {
            params: {
                page: currentPage.value,
                size: pageSize
            }
        });
        flights.value = response.data.data;
        totalItems.value = response.data.data.length;
    } catch (error) {
        console.error('Error fetching flight data:', error);
    }
};

onMounted(fetchFlights);

const pageCount = computed(() => {
    return Math.ceil(totalItems.value / pageSize);
});

const paginationRange = computed(() => {
    const range = [];
    const totalPages = pageCount.value;
    const rangeSize = 5;

    let startPage = currentPage.value - Math.floor(rangeSize / 2);
    let endPage = currentPage.value + Math.floor(rangeSize / 2);

    if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(rangeSize, totalPages);
    }

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, totalPages - rangeSize + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        range.push(i);
    }

    return range;
});

async function goToPage(page) {
    currentPage.value = page;
    await fetchFlights();
}

async function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--;
        await fetchFlights();
    }
}

async function nextPage() {
    if (currentPage.value < pageCount.value) {
        currentPage.value++;
        await fetchFlights();
    }
}

function goToDetails(flightId) {
    router.push({ name: 'FlightDetail', params: { id: flightId } });
}
</script>

<template>
    <v-card elevation="4" class="rounded-lg p-4">
        <UiChildCard title="Danh sách chuyến bay">
            <v-table fixed-header height="300px">
                <thead>
                <tr>
                    <th>STT</th>
                    <th>Số hiệu</th>
                    <th>Sân bay đi</th>
                    <th>Sân bay đến</th>
                    <th>Khởi hành</th>
                    <th>Đến</th>
                    <th>Thao tác</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(flight, index) in flights" :key="flight.id">
                    <td>{{ (currentPage.value - 1) * pageSize + index + 1 }}</td>
                    <td>{{ flight.flightDetails.number }}</td>
                    <td>{{ flight.departureAirport.airport }} ({{ flight.departureAirport.iata }})</td>
                    <td>{{ flight.arrivalAirport.airport }} ({{ flight.arrivalAirport.iata }})</td>
                    <td>{{ flight.departureTime }}</td>
                    <td>{{ flight.arrivalTime }}</td>
                    <td class="flex space-x-2">
                        <v-btn color="primary" @click="goToDetails(flight.id)">Chi tiết</v-btn>
                        <v-btn color="error">Xóa</v-btn>
                    </td>
                </tr>
                </tbody>
            </v-table>

            <div class="flex justify-center items-center mt-4 space-x-2">
                <v-btn small @click="goToPage(1)" :disabled="currentPage === 1">&lt;&lt;</v-btn>
                <v-btn small @click="prevPage" :disabled="currentPage === 1">&lt;</v-btn>
                <v-btn
                    v-for="page in paginationRange"
                    :key="page"
                    :color="currentPage === page ? 'primary' : 'grey'"
                    small
                    @click="goToPage(page)"
                >
                    {{ page }}
                </v-btn>
                <v-btn small @click="nextPage" :disabled="currentPage === pageCount.value">&gt;</v-btn>
                <v-btn small @click="goToPage(pageCount.value)" :disabled="currentPage === pageCount.value">&gt;&gt;</v-btn>
            </div>
        </UiChildCard>
    </v-card>
</template>

<style scoped>
.v-card {
    background-color: #f5f5f5;
}
</style>
