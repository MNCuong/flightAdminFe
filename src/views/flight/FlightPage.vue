<template>
    <v-container>
        <loading-modal :visible="isLoading" />
        <v-row class="mb-4" align="center" justify="space-between">
            <v-col cols="2">
                <v-btn color="primary" @click="addFlight">{{ $t('create_flight') }}</v-btn>
            </v-col>
            <v-col cols="2">
                <v-btn color="success" @click="handleExport">{{ $t('export_excel') }}</v-btn>
            </v-col>
            <v-col cols="8">
                <v-text-field
                    v-model="searchQuery"
                    :label="$t('search_flight')"
                    outlined
                    clearable
                    hide-details="auto"
                />
            </v-col>
        </v-row>
        <v-table>
            <thead>
            <tr>
                <th>STT</th>
                <th class="flightCode-column">{{ $t('flight_code') }}</th>
                <th>{{ $t('departure_airport') }}</th>
                <th>{{ $t('arrival_airport') }}</th>
                <th>{{ $t('aircraft') }}</th>
                <th>{{ $t('airline') }}</th>
                <th>{{ $t('status') }}</th>
                <th class="d-flex justify-center">{{ $t('actions') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="!flights.length && !isLoading">
                <td colspan="8">{{ $t('no_flights') }}</td>
            </tr>
            <tr v-for="(flight, index) in flights" :key="flight?.id">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td class="flightCode-column">{{ flight?.flightCode || 'N/A' }}</td>
                <td class="airport-column">{{ flight?.departureAirport || 'N/A' }}</td>
                <td class="airport-column">{{ flight?.arrivalAirport || 'N/A' }}</td>
                <td>{{ flight?.aircraft }}</td>
                <td>{{ flight?.airlineName }}</td>
                <td>{{ flight?.status }}</td>
                <td>
                    <v-row>
                        <v-col class="d-flex justify-start">
                            <v-btn color="primary" @click="goToDetails(flight?.id)">
                                {{ $t('details') }}
                            </v-btn>
                        </v-col>
                        <v-col class="d-flex justify-start">
                            <v-btn color="error" @click="openConfirmDeleteModal(flight?.id)">
                                {{ $t('delete') }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </td>
            </tr>
            </tbody>
        </v-table>

        <!-- Các modal giữ nguyên -->

        <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" />
    </v-container>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import axios from '../../services/api';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal.vue';
import SuccessModal from '../../components/SuccessModa.vue';
import ErrorModal from '../../components/ErrorModal.vue';
import LoadingModal from '@/components/LoadingModal.vue';
import { useRouter } from 'vue-router';
import { exportToExcel } from '@/services/ExportService';

export default {
    components: {
        ConfirmDeleteModal,
        SuccessModal,
        ErrorModal,
        LoadingModal
    },

    setup() {
        const currentPage = ref(1);
        const pageSize = ref(10);
        const flights = ref([]);
        const totalPages = ref(1);
        const isModalVisible = ref(false);
        const router = useRouter();

        const isSuccessVisible = ref(false);
        const isErrorVisible = ref(false);
        const errorMessage = ref('');
        const isLoading = ref(false);
        const selectedFlightId = ref(null);
        const isStatusModalVisible = ref(false);

        const addFlight = () => {
            router.push({ name: 'CreateFlight' });
        };
        const goToDetails = (flightId) => {
            if (!flightId) return;
            router.push({ name: 'FlightDetail', params: { id: flightId } });
        };
        const fetchFlights = async () => {
            isLoading.value = true;

            try {
                const response = await axios.get('/flights/all-flight', {
                    params: {
                        page: currentPage.value - 1,
                        size: pageSize.value
                    }
                });

                const data = response.data.data;
                flights.value = data.content || [];
                totalPages.value = data.totalPages || 1;
            } catch (error) {
                console.error('Error fetching flight data:', error);
            } finally {
                isLoading.value = false;
            }
        };
        // Hàm xuất Excel
        const handleExport = () => {
            console.log('Nút xuất đã được bấm');

            if (!flights.value.length) {
                alert('Không có dữ liệu để xuất Excel');
                return;
            }

            const formattedData = flights.value.map((flight, index) => ({
                STT: index + 1,
                'Mã Chuyến Bay': flight.flightDetails?.number || 'N/A',
                'Sân Bay Khởi Hành': flight.departureAirport?.airport || 'N/A',
                'Sân Bay Đến': flight.arrivalAirport?.airport || 'N/A',
                'Giờ Khởi Hành': flight.departureTime || 'N/A',
                'Giờ Đến': flight.arrivalTime || 'N/A'
            }));

            exportToExcel(formattedData);
        };
        const openConfirmDeleteModal = (flightId) => {
            selectedFlightId.value = flightId;
            isModalVisible.value = true;
        };

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
                const response = await axios.delete(`/flights/delete-flight/${flightId}`);

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
        watch(currentPage, () => {
            fetchFlights();
        });
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
            errorMessage,
            isLoading,
            goToDetails,
            addFlight,
            handleExport
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

.flightCode-column {
    max-width: 120px;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
