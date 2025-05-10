<template>
    <div>
        <v-card class="white pa-4" flat>
            <v-form>
                <v-text-field v-model="registration" label="Số hiệu đăng ký" required />
                <v-text-field v-model="airlines_id" label="Vietnam Airlines" disabled required />

                <!-- Dropdown loại phi cơ -->
                <v-select
                    v-model="typeEnums"
                    :items="aircraftTypeEnum"
                    label="Loại phi cơ"
                    item-title="text"
                    item-value="value"
                    hide-selected
                    required
                />

                <!-- Dropdown trạng thái phi cơ -->
                <v-select
                    v-model="status"
                    :items="aircraftStatusEnum"
                    label="Trạng thái"
                    item-title="text"
                    item-value="value"
                    hide-selected
                    required
                />

                <v-text-field v-model="seat" label="Số chỗ ngồi" type="number" required />
                <input ref="fileInputRef" type="file" @change="handleFileChange" />


                <v-btn color="primary" @click="submitForm" class="mt-4" :disabled="isSubmitting"> Thêm phi cơ</v-btn>
                <v-btn color="content" @click="goBack" class="mt-4"> Quay lại</v-btn>
            </v-form>
        </v-card>
    </div>
    <!-- Modal thông báo thành công -->
    <success-modal :visible="isSuccessVisible" :message="'Thêm phi cơ thành công!'" @close="closeSuccessModal" />

    <!-- Modal thông báo thất bại -->
    <error-modal :visible="isErrorVisible" :message="errorMessage" @close="closeErrorModal" />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../../services/api';
import ErrorModal from '@/components/ErrorModal.vue';
import SuccessModal from '@/components/SuccessModa.vue';

const router = useRouter();

// Khai báo các Enum có sẵn cho "status" và "typeEnums"
const aircraftStatusEnum = ref([
    { value: 'ACTIVE', text: 'ACTIVE' },
    { value: 'IN_SERVICE', text: 'IN SERVICE' },
    { value: 'STANDBY', text: 'STANDBY' },
    { value: 'ON_GROUND', text: 'ON GROUND' },
    { value: 'UNDER_MAINTENANCE', text: 'UNDER MAINTENANCE' },
    { value: 'REPAIRING', text: 'REPAIRING' },
    { value: 'OUT_OF_SERVICE', text: 'OUT OF SERVICE' },
    { value: 'AOG', text: 'AOG' },
    { value: 'RETIRED', text: 'RETIRED' },
    { value: 'STORED', text: 'STORED' },
    { value: 'SCRAPPED', text: 'SCRAPPED' },
    { value: 'DELAYED', text: 'DELAYED' }
]);

const aircraftTypeEnum = ref([
    { value: 'AIRBUS_A320', text: 'Airbus A320' },
    { value: 'AIRBUS_A321', text: 'Airbus A321' },
    { value: 'BOEING_737_800', text: 'Boeing 737-800' },
    { value: 'BOEING_737_MAX_8', text: 'Boeing 737 MAX 8' },
    { value: 'BOEING_787_9', text: 'Boeing 787-9' },
    { value: 'AIRBUS_A350_900', text: 'Airbus A350-900' },
    { value: 'BOEING_777_300ER', text: 'Boeing 777-300ER' },
    { value: 'AIRBUS_A380', text: 'Airbus A380' }
]);

const registration = ref('');
const airlines_id = ref('');
const typeEnums = ref('');
const seat = ref('');
const status = ref('');
const file = ref(null);

const isSubmitting = ref(false);
const isSuccessVisible = ref(false);
const isErrorVisible = ref(false);
const errorMessage = ref('');
const fileInputRef = ref(null);



function goBack() {
    router.push({ name: 'AircraftList' });
}

function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    console.log('Selected file:', selectedFile);
    file.value = selectedFile;
}


const closeSuccessModal = () => {
    isSuccessVisible.value = false;
    router.push({ name: 'AircraftList' });
};

const closeErrorModal = () => {
    isErrorVisible.value = false;
};

async function submitForm() {
    isSubmitting.value = true;

    if (!registration.value || !typeEnums.value || !seat.value || !status.value || !file.value) {
        errorMessage.value = 'Vui lòng điền đầy đủ thông tin và chọn ảnh.';
        isErrorVisible.value = true;
        isSubmitting.value = false;
        return;
    }

    try {
        const payload = {
            registration: registration.value,
            airlines_id: 1,
            typeEnums: typeEnums.value,
            seat: seat.value,
            status: status.value
        };
        console.log(payload);

        const formData = new FormData();
        formData.append('data', JSON.stringify(payload));
        console.log(formData);

        if (file.value) {
            formData.append('file', file.value);
        } else {
            console.error('File not selected');
        }
        console.log(formData);
        // Gửi yêu cầu
        const response = await axios.post('/flight/aircraft/add-aircraft', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200) {
            isSuccessVisible.value = true;
        } else {
            errorMessage.value = 'Lỗi: ' + response.statusText;
            isErrorVisible.value = true;
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Lỗi không xác định';
        isErrorVisible.value = true;
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<style scoped></style>
