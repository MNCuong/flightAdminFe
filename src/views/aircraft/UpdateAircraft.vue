<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../services/api';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal.vue';
import SuccessModal from '../../components/SuccessModa.vue';
import ErrorModal from '../../components/ErrorModal.vue';

const route = useRoute();
const registration = ref('');
const airlines = ref('');
const createAt = ref('');
const updateAt = ref('');
const type = ref('');
const status = ref('');
const seats = ref('');
const imageUrl = ref('');
const flightDetails = ref(null);
const router = useRouter();
const isSuccessVisible = ref(false);
const isErrorVisible = ref(false);
const errorMessage = ref('');
const flightId = route.params.id;

const statusOptions = ref([
    { label: 'Sẵn sàng sử dụng', value: 'AVAILABLE' },
    { label: 'Đang hoạt động', value: 'IN_SERVICE' },
    { label: 'Đang bảo trì', value: 'MAINTENANCE' },
    { label: 'Đang bay', value: 'IN_FLIGHT' },
    { label: 'Đã hạ cánh', value: 'LANDED' },
    { label: 'Bị hoãn', value: 'DELAYED' },
    { label: 'Hủy chuyến bay', value: 'CANCELLED' },
    { label: 'Đang đỗ tại sân bay', value: 'GROUND' },
    { label: 'Đang tiếp nhiên liệu', value: 'REFUELING' },
    { label: 'Đang đỗ tại bãi', value: 'PARKED' },
    { label: 'Kiểm tra kỹ thuật', value: 'CHECKING' },
    { label: 'Ngừng hoạt động', value: 'RETIREMENT' }
]);
const getStatusLabel = (statusValue) => {
    const statusMap = {
        'AVAILABLE': 'Sẵn sàng sử dụng',
        'IN_SERVICE': 'Đang hoạt động',
        'MAINTENANCE': 'Đang bảo trì',
        'IN_FLIGHT': 'Đang bay',
        'LANDED': 'Đã hạ cánh',
        'DELAYED': 'Bị hoãn',
        'CANCELLED': 'Hủy chuyến bay',
        'GROUND': 'Đang đỗ tại sân bay',
        'REFUELING': 'Đang tiếp nhiên liệu',
        'PARKED': 'Đang đỗ tại bãi',
        'CHECKING': 'Kiểm tra kỹ thuật',
        'RETIREMENT': 'Ngừng hoạt động'
    };

    return statusMap[statusValue] || statusValue;
};

// Fetch flight details

const fetchFlightDetails = async () => {
    try {
        const response = await axios.get(`/flight/aircraft/get-aircraft/${flightId}`);
        flightDetails.value = response.data.data;
        airlines.value = flightDetails.value.airlines.name;
        registration.value = flightDetails.value.registration;
        type.value = flightDetails.value.type;
        status.value = getStatusLabel(flightDetails.value.status);
        imageUrl.value = flightDetails.value.imgUrl;
        createAt.value = flightDetails.value.createAt;
        updateAt.value = flightDetails.value.updateAt;
        console.log(status.value);
        if (flightDetails.value.seat === 0 || flightDetails.value.seat === 1) {
            seats.value = flightDetails.value.seatCapacity;
        } else {
            seats.value = flightDetails.value.seat;
        }
    } catch (error) {
        console.error('Error fetching flight details:', error);
    }
};

onMounted(fetchFlightDetails);

// Handle form submission
const submitForm = async () => {
    try {
        const updatedData = {
            registration: registration.value,
            airlines_id: flightDetails.value.airlines.id,
            status: typeof status.value === 'object' ? status.value.value : status.value,
            typeEnums: flightDetails.value.type,
            seat: seats.value
        };

        console.log('Updating aircraft:', updatedData);

        const response = await axios.put(`/flight/aircraft/update-aircraft/${flightId}`, updatedData);
        console.log('Update response:', response.data);
        if (response.status === 200) {
            isSuccessVisible.value = true;
        } else {
            isErrorVisible.value = true;
            errorMessage.value = response.data.message || 'Có lỗi xảy ra khi cập nhật phi cơ.';
        }
    } catch (error) {
        isErrorVisible.value = true;
        errorMessage.value = response.data.message || 'Có lỗi xảy ra khi cập nhật phi cơ.';
        console.error('Error submitting form:', error);
    }
};
const closeSuccessModal = () => {
    isSuccessVisible.value = false;
};

// Close Error Modal
const closeErrorModal = () => {
    isErrorVisible.value = false;
};
// Go back to the flight list
const goBack = () => {
    router.push({ name: 'AircraftList' });
};
</script>

<template>
    <v-form>
        <v-row>
            <v-col cols="12" md="6">
                <v-text-field v-model="registration" label="Số hiệu phi cơ" required disabled />
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field v-model="type" label="Loại phi cơ" required disabled />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="6">
                <v-select
                    v-model="status"
                    :items="statusOptions"
                    label="Trạng thái"
                    item-title="label"
                    item-value="value"
                    return-object="false"
                    hide-details="true"
                    required
                />
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
    <div v-if="flightDetails" class="flight-details-section" style="margin-top: 20px">
        <h3><strong>Thông số phi cơ</strong></h3>
        <v-divider class="my-4" />
        <v-row>
            <v-col cols="12" sm="6">
                <div v-if="flightDetails.imgUrl">
                    <v-img
                        :src="flightDetails.imgUrl"
                        :alt="'Ảnh của phi cơ ' + flightDetails.registration"
                        max-width="600"
                        aspect-ratio="1.6"
                        class="rounded"
                        cover
                    >
                        <template #placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="primary" />
                            </v-row>
                        </template>
                    </v-img>
                </div>
                <div v-else>
                    <span>Không có ảnh phi cơ</span>
                </div>
            </v-col>
            <v-col cols="12" sm="6">
                <v-text-field v-model="registration" label="Số hiệu phi cơ" required disabled />
                <v-text-field v-model="createAt" label="Ngày tạo" required disabled />
                <v-text-field v-model="updateAt" label="Ngày cập nhật" required disabled />
                <v-text-field v-model="type" label="Loại phi cơ" required disabled />
                <v-text-field v-model="airlines" label="Hãng hàng không" required disabled />
                <v-text-field v-model="seats" label="Số chỗ ngồi" required disabled readonly />



                <v-select
                    v-model="status"
                    :items="statusOptions"
                    label="Trạng thái"
                    item-title="label"
                    item-value="value"
                    return-object="false"
                    hide-details="true"
                    required
                    disabled
                />         </v-col>
        </v-row>

        <!-- Modal xác nhận xóa -->
        <confirm-delete-modal
            :visible="confirmDelete"
            :flightId="aircraftToDelete?.id"
            @confirm="confirmDeleteAction"
            @close="cancelDelete"
        />

        <!-- Modal thông báo thành công -->
        <success-modal :visible="isSuccessVisible" :message="'Phi cơ đã được cập nhật thành công!'" @close="closeSuccessModal" />

        <!-- Modal thông báo thất bại -->
        <error-modal :visible="isErrorVisible" :message="errorMessage" @close="closeErrorModal" />
    </div>
</template>

<style scoped>
.flight-details-section {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
}

h1 {
    color: #0077b6;
}
</style>
